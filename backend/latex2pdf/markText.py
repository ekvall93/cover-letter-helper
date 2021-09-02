from typing import List, Tuple
import spacy
nlp = spacy.load("en_core_web_sm")
import yake
from rake_nltk import Rake
from gensim.summarization import keywords as gensimKeywords
from .constants import startTag, endTag
import re
import spacy_ke

class AssertListStr:
    """Make sure that list contains strings"""
    def assertListStr(self, wordLisr)->List[str]:
        """Convert to strings"""
        return [str(w) for w in wordLisr]



class SpacyKeKeywords(AssertListStr):
    def __init__(self):
        AssertListStr.__init__(self)
        self.SpacyKeNLP = spacy.load("en_core_web_sm")
        self.SpacyKeNLP.add_pipe("yake")
    """Get text keywords with Spacy"""
    def spacyKeKeywords(self, text: str, treshold = 0.5)->List[str]:
        """Get keywords"""
        doc = self.SpacyKeNLP(text)
        words = list()
        for keyword, score in doc._.extract_keywords(n=100):
            if score > treshold:
                break
            words.append(keyword)
        words = self.assertListStr(words)
        words.sort(key=lambda x: len(x.split()), reverse=True)
        return words

class SpacyKeywords(AssertListStr):
    def __init__(self):
        AssertListStr.__init__(self)
    """Get text keywords with Spacy"""
    def spacyKeywords(self, text: str)->List[str]:
        """Get keywords"""
        doc = nlp(text)
        return self.assertListStr(list(doc.ents))

class YakeKeywords(AssertListStr):
    """Get text keywords with Yake"""
    def __init__(self, language: str = "en", max_ngram_size: int = 3, deduplication_threshold: float = 0.9, numOfKeywords : int= 20):
        self.language = language
        self.max_ngram_size = max_ngram_size
        self.deduplication_threshold = deduplication_threshold
        self.numOfKeywords = numOfKeywords
        AssertListStr.__init__(self)

    def _getYakeKeywords(self, keywords: List[Tuple[str, float]])->List[str]:
        """Extract keywords for Yake generator"""
        yake_w = list()
        for kw in list(keywords):
            yake_w.append(kw[0])
        return yake_w

    def yakeKeywords(self, text : str)->List[str]:
        """Get keywords"""
        custom_kw_extractor = yake.KeywordExtractor(lan=self.language, n=self.max_ngram_size, dedupLim=self.deduplication_threshold, top=self.numOfKeywords, features=None)
        keywords = custom_kw_extractor.extract_keywords(text)
        return self.assertListStr(self._getYakeKeywords(keywords))

class RakeKeywords(AssertListStr):
    """Get text keywords with Rake"""
    def __init__(self):
        self.rake_nltk_var = Rake()
        AssertListStr.__init__(self)

    def rakeKeywords(self, text:str)->List[str]:
        """Rale keywords"""
        self.rake_nltk_var.extract_keywords_from_text(text)
        rake_w = self.rake_nltk_var.get_ranked_phrases()
        return self.assertListStr(rake_w)

class GensimKeywords(AssertListStr):
    """Get text keywords with Gensim"""
    def gensimKeywords(self, text:str)->List[str]:
        """Get keywords"""
        return self.assertListStr(gensimKeywords(text).split("\n"))

class Keywords(SpacyKeywords, YakeKeywords, RakeKeywords, GensimKeywords, SpacyKeKeywords):
    """Get text keywords from several nlp-packages"""
    def __init__(self, spacy=False, yake=False, rake=False, gensim=False, spacyKe=True):
        SpacyKeywords.__init__(self)
        YakeKeywords.__init__(self)
        RakeKeywords.__init__(self)
        GensimKeywords.__init__(self)
        SpacyKeKeywords.__init__(self)
        self.keyword_extractors = list()
        if spacy:
            self.keyword_extractors.append(self.spacyKeywords)
        if yake:
            self.keyword_extractors.append(self.yakeKeywords)
        if rake:
            self.keyword_extractors.append(self.rakeKeywords)
        if gensim:
            self.keyword_extractors.append(self.gensimKeywords)
        if spacyKe:
            self.keyword_extractors.append(self.spacyKeKeywords)
        assert len(self.keyword_extractors) >0, "You need to use atleast one keyword extractor"

    @staticmethod
    def _unique(words: List[str])->List[str]:
        """Get unique keywords"""
        return list(set(words))
    @staticmethod
    def _flatten(ListOfList: List[List[str]])->List[str]:
        return [s for List in ListOfList for s in List]

    def keywords(self, text: str)->List[str]:
        """Get Keywords"""
        listOfKeywordLists = [extractor(text) for extractor in self.keyword_extractors]
        words = self._unique([l for KeywordList in listOfKeywordLists for l in KeywordList])
        words.sort(key=lambda x: len(x.split()), reverse=True)
        print(words)
        return words


    @staticmethod
    def _unique(words: List[str])->List[str]:
        """Get unique keywords"""
        return list(set(words))
    @staticmethod
    def _flatten(ListOfList: List[List[str]])->List[str]:
        return [s for List in ListOfList for s in List]

class MarkKeywords:
    def __init__(self):
        self.startTag = startTag
        self.endTag = endTag
        self.tagLength = len(self.startTag) + len(self.endTag)

    def _escapeSpecialChars(self, t:str)->str:
        """Escape special chars for regex"""
        return re.escape(t)

    def _getWordPositions(self, word : str, text : str)->List[int]:
        """Find position of word in text"""
        return [m.start() for m in re.finditer(f' {self._escapeSpecialChars(word)} ', text)]
    def _getStartTagIx(self, text: str)->int:
        """Find position of the last startTag in text before keyword"""
        start_tag_match = re.search(fr"(?s:.*){self.startTag}", text)
        if start_tag_match:
            start_tag_ix = start_tag_match.span()[1]
        else:
            #There dont exist any startTag
            start_tag_ix = -1
        return start_tag_ix

    def _getEndTagIx(self, text: str)->int:
        """Find position of the last endTag in text before keyword"""
        end_tag_match = re.search(fr"(?s:.*){self.endTag}", text)
        if end_tag_match:
            end_tag_ix = end_tag_match.span()[1]
        else:
            #There dont exist any endTag
            end_tag_ix = -1

        return end_tag_ix

    def _checkInsertTag(self, start_tag_ix: int, end_tag_ix: int)->bool:
        """Check if we should mark keyword"""
        #There dont exist any tags, we can mark keyword
        if start_tag_ix == -1 and end_tag_ix == -1:
            return True
        #There exist a startTag, and it's closer to word than endTag.
        #Hence, the word is already marked
        elif start_tag_ix > end_tag_ix:
            return False
        #There exist a endTag, and it's closer to word than startTag.
        #Hence, the word cannot be marked.
        elif start_tag_ix < end_tag_ix:
            return True
        #We dont need to check for '==' in this case i.e., endTag and startTag cannot have same position

    def _insertTag(self, start: int, end: int, text:str)->str:
        """Mark keyword"""
        return f"{text[:start + 1]}{self.startTag}{text[start + 1:end +1]}{self.endTag}{text[end + 1:]}"

    def _incrementStartPos(self, start : int, insertPosition : List[int])->int:
        for insert_start in insertPosition:
            if insert_start < start:
                start += self.tagLength
        return start

    def _markKeyword(self, w: str, text: str, posList : List[int])->str:
        #Keep track on insert position
        insertPosition = list()
        for start in posList:
            #If text has become longer due to markdowns.
            #Increment the start position
            start = self._incrementStartPos(start, insertPosition)
            end = start + len(w)
            t = text[:start]
            #Get start/end position of the clostest tags left of the word
            start_tag_ix = self._getStartTagIx(t)
            end_tag_ix = self._getEndTagIx(t)
            #Check if we can insert tag
            if self._checkInsertTag(start_tag_ix, end_tag_ix):
                text = self._insertTag(start, end, text)
                insertPosition.append(start)
        return text


    def markKeywords(self, text:str, words:List[str])->str:
        """Mark keywords"""
        for w in words:
            #Get position of keyword
            posList = self._getWordPositions(w, text)
            text = self._markKeyword(w, text, posList)
        return text

class MarkText(Keywords, MarkKeywords):
    """Find keywords in text and mark them"""
    def __init__(self, spacy=False, yake=False, rake=False, gensim=False, spacyKe=True):
        MarkKeywords.__init__(self)
        Keywords.__init__(self, spacy, yake, rake, gensim, spacyKe)

    def markText(self, text):
        """Mark text"""
        keywords = self.keywords(text)
        text = self.markKeywords(text, keywords)
        return text
