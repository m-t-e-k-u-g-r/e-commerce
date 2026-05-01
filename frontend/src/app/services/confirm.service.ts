import { Injectable } from '@angular/core';
import { DialogInput, FormDialogInput, DialogOptions } from '../models/inputs.type';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { firstValueFrom } from 'rxjs';
import { OptionsDialogComponent } from '../components/options-dialog/options-dialog.component';
import { OptionsDialogResponse } from '../models/optionsResponse.type';

@Injectable({
  providedIn: 'root',
})
export class ConfirmService {
  constructor(private dialog: MatDialog) {}

  async confirm(data: DialogInput, options: DialogOptions = {}): Promise<boolean> {
    return await firstValueFrom(
      this.dialog.open(ConfirmDialogComponent, {
        data: data,
        ...options
      }).afterClosed()
    )
  }

  async confirmOptions(data: FormDialogInput, options: DialogOptions = {}): Promise<OptionsDialogResponse> {
    return await firstValueFrom(
      this.dialog.open(OptionsDialogComponent, {
        data: data,
        ...options
      }).afterClosed()
    )
  }
}
