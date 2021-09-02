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
import { AddTemplateComponent } from './add-template/add-template.component';
import { EditPDFComponent } from './edit-pdf/edit-pdf.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatSelectModule} from '@angular/material/select';
import {MatSliderModule} from '@angular/material/slider';


import { AngularResizedEventModule } from 'angular-resize-event';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { KeyWordsComponent } from './edit-pdf/key-words/key-words.component';
import { PdfZoomComponent } from './edit-pdf/pdf-zoom/pdf-zoom.component';
import { StylePanelComponent } from './edit-pdf/style-panel/style-panel.component';
import { WorkingPanelComponent } from './edit-pdf/working-panel/working-panel.component';
import { NgxEditorModule } from 'ngx-editor';
import {MatDialogModule} from '@angular/material/dialog';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';




@NgModule({
  declarations: [
    AppComponent,
    AddTemplateComponent,
    EditPDFComponent,
    KeyWordsComponent,
    PdfZoomComponent,
    StylePanelComponent,
    WorkingPanelComponent,
  ],
  imports: [
    MatDialogModule,
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
    AppRoutingModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
