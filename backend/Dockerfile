FROM ubuntu:bionic

RUN apt-get update  && apt-get install -y gnupg
RUN  apt-get update \
  && apt-get install -y wget \
  && rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y python3.6 python3-distutils python3-pip python3-apt
RUN apt-get update && apt-get -y install xvfb libfontconfig wkhtmltopdf

COPY ./requirements.txt /app/requirements.txt

WORKDIR /app
EXPOSE 5000
RUN pip3 install -r requirements.txt

ENV FLASK_ENV=development
ENV FLASK_APP=server

ENV LC_ALL=C.UTF-8
ENV LANG=C.UTF-8

RUN ln -snf /usr/share/zoneinfo/Etc/UTC /etc/localtime \
    && echo "Etc/UTC" > /etc/timezone \
    && apt-get update \
    && apt-get upgrade -y \
    && apt-get install texlive-latex-base texlive-latex-extra texlive-fonts-recommended xzdec -y \
    && rm -rf /var/lib/apt/lists/*


RUN tlmgr init-usertree
RUN tlmgr option repository ftp://tug.org/historic/systems/texlive/2017/tlnet-final
RUN tlmgr install --no-persistent-downloads xcolor
#RUN tlmgr -sys install --no-persistent-downloads collection-fontsrecommended
RUN apt-get update && apt-get install -y texlive-fonts-extra
RUN apt-get update && apt-get install texlive-lang-european
COPY . /app

CMD ["flask", "run", "--host=0.0.0.0"]
