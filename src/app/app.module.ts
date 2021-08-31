import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import {TextFieldModule} from '@angular/cdk/text-field';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgxTextEditorModule } from 'ngx-text-editor';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MainPipe } from './safePipe/main-pipe.module';
import {MatListModule} from '@angular/material/list';
import {MatInputModule} from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';

import { LatexToPDFComponent } from './latex-to-pdf/latex-to-pdf.component';
import { AddTemplateComponent } from './latex-to-pdf/add-template/add-template.component';
import { EditPDFComponent } from './latex-to-pdf/edit-pdf/edit-pdf.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatSelectModule} from '@angular/material/select';
import {MatSliderModule} from '@angular/material/slider';


import { AngularResizedEventModule } from 'angular-resize-event';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { KeyWordsComponent } from './latex-to-pdf/edit-pdf/key-words/key-words.component';
import { PdfZoomComponent } from './latex-to-pdf/edit-pdf/pdf-zoom/pdf-zoom.component';
import { StylePanelComponent } from './latex-to-pdf/edit-pdf/style-panel/style-panel.component';
import { WorkingPanelComponent } from './latex-to-pdf/edit-pdf/working-panel/working-panel.component';
import { NgxEditorModule } from 'ngx-editor';



@NgModule({
  declarations: [
    AppComponent,
    LatexToPDFComponent,
    AddTemplateComponent,
    EditPDFComponent,
    KeyWordsComponent,
    PdfZoomComponent,
    StylePanelComponent,
    WorkingPanelComponent
  ],
  imports: [
    NgxEditorModule,
    FontAwesomeModule,
    AngularResizedEventModule,
    MatSliderModule,
    MatSelectModule,
    MatButtonToggleModule,
    FlexLayoutModule,
    MatInputModule,
    MatListModule,
    MainPipe,
    PdfViewerModule,
    NgxTextEditorModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    TextFieldModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
