import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LatexToPDFComponent } from './latex-to-pdf/latex-to-pdf.component';

const routes: Routes = [
  { path: '', component: LatexToPDFComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
