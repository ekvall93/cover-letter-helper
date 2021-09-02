import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-explanation',
  templateUrl: './explanation.component.html',
  styleUrls: ['./explanation.component.scss']
})
export class ExplanationComponent {

  constructor(
    private dialogRef: MatDialogRef<ExplanationComponent>,public dialog: MatDialog, public ngZone : NgZone,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {

    this.ngZone.run(() => {
      console.log("hello")
    this.dialogRef.close();
    })

  }
}
