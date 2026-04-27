import { Injectable } from '@angular/core';
import { DialogInput } from '../models/inputs.type';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfirmService {
  constructor(private dialog: MatDialog) {}
  async confirm(data: DialogInput): Promise<boolean> {
    return await firstValueFrom(
      this.dialog.open(ConfirmDialogComponent, { data: data }).afterClosed()
    )
  }
}
