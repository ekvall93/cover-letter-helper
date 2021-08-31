import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddTemplateComponent } from './add-template/add-template.component';
import {EditPDFComponent} from './edit-pdf/edit-pdf.component'

const routes: Routes = [
  { path: '', component: AddTemplateComponent },
  { path: 'edit-pdf', component: EditPDFComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
