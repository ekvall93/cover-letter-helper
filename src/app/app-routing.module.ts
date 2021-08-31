import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddTemplateComponent } from './latex-to-pdf/add-template/add-template.component';
import {EditPDFComponent} from './latex-to-pdf/edit-pdf/edit-pdf.component'
/* import { LatexToPDFComponent } from './latex-to-pdf/latex-to-pdf.component'; */


const routes: Routes = [
  { path: '', component: AddTemplateComponent },
  { path: 'edit-pdf', component: EditPDFComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
