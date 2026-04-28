import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions, MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { DialogInput } from '../../models/inputs.type';

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButton, MatDialogClose],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>

    @if (data.message) {
      <mat-dialog-content>
        @if (data.messageType == 'html') {
          <span [innerHTML]="data.message"></span>
        } @else {
          {{ data.message }}
        }
      </mat-dialog-content>
    }
    <mat-dialog-actions>
      <button mat-flat-button [mat-dialog-close]="true">Confirm</button>
      <button mat-button [mat-dialog-close]="false">Cancel</button>
    </mat-dialog-actions>
  `,
  styleUrl: './confirm-dialog.component.scss',
})
export class ConfirmDialogComponent {
  data = inject<DialogInput>(MAT_DIALOG_DATA);
}
