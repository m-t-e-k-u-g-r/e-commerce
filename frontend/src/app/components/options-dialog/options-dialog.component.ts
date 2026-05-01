import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButton, MatIconButton } from '@angular/material/button';
import { FormDialogInput } from '../../models/inputs.type';
import { MatDivider } from '@angular/material/list';
import { MatFormField, MatHint, MatInput, MatLabel, MatSuffix } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-options-dialog',
  imports: [
    MatDialogTitle,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDivider,
    MatFormField,
    MatLabel,
    MatInput,
    MatSelect,
    MatOption,
    MatDatepickerInput,
    MatHint,
    MatDatepickerToggle,
    MatDatepicker,
    ReactiveFormsModule,
    MatSuffix,
    MatIcon,
    MatIconButton,
  ],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title>{{ data.title }}</h2>

      <mat-dialog-content [formGroup]="form">
        @if (data.message) {
          <p class="dialog-message">
            {{ data.message }}
          </p>
          <mat-divider />
        }
        <div class="input_wrapper">
          @for (field of fields; track field.name) {
            <mat-form-field>
              <mat-label>{{ field.label }}</mat-label>
              @switch (field.type) {
                @case ('text') {
                  <input
                    matInput
                    placeholder="{{ field.placeholder || '' }}"
                    [formControlName]="field.name"
                  />
                }
                @case ('email') {
                  <input
                    matInput
                    placeholder="{{ field.placeholder || '' }}"
                    [formControlName]="field.name"
                    type="email"
                  />
                }
                @case ('password') {
                  <div>
                    <input
                      matInput
                      [type]="!isHidden(field.name) ? 'password' : 'text'"
                      [formControlName]="field.name"
                    />
                    <button
                      type="button"
                      mat-icon-button
                      matSuffix
                      (click)="toggleVisibility(field.name)"
                      [attr.aria-label]="'Hide password'"
                    >
                      <mat-icon>
                        {{ !isHidden(field.name) ? 'visibility_off' : 'visibility' }}
                      </mat-icon>
                    </button>
                  </div>
                }
                @case ('textarea') {
                  <textarea
                    matInput
                    placeholder="{{ field.placeholder || '' }}"
                    value="{{ field.defaultValue || '' }}"
                    [formControlName]="field.name"
                  ></textarea>
                }
                @case ('number') {
                  <input
                    matInput
                    type="number"
                    placeholder="{{ field.placeholder || '' }}"
                    [formControlName]="field.name"
                  />
                }
                @case ('select') {
                  <mat-select [formControlName]="field.name">
                    @for (option of field.options; track option) {
                      <mat-option [value]="option.value">{{ option.label }}</mat-option>
                    }
                  </mat-select>
                }
                @case ('radio') {
                  @for (option of field.options; track option.value) {
                    <input
                      matInput
                      type="radio"
                      id="{{ option.value }}"
                      [formControlName]="field.name"
                    />
                    <label for="{{ option.value }}">
                      {{ option.label }}
                    </label>
                  }
                }
                @case ('date') {
                  <div>
                    <input matInput [matDatepicker]="picker" [formControlName]="field.name" />
                    <mat-hint>MM/DD/YYYY</mat-hint>
                    <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
                    <mat-datepicker #picker></mat-datepicker>
                  </div>
                }
              }
            </mat-form-field>
          }
        </div>
      </mat-dialog-content>

      <mat-dialog-actions>
        <button mat-flat-button (click)="confirm()" [disabled]="this.form.invalid">Confirm</button>
        <button mat-button (click)="cancel()">Cancel</button>
      </mat-dialog-actions>
    </div>
  `,
  styleUrl: './options-dialog.component.scss',
})
export class OptionsDialogComponent implements OnInit {
  data = inject<FormDialogInput>(MAT_DIALOG_DATA);
  fields = this.data.fields;
  form!: FormGroup;

  hiddenState: Record<string, boolean> = {};

  constructor(public optionDialogRef: MatDialogRef<OptionsDialogComponent>) {}

  ngOnInit() {
    const group: any = {};
    this.fields.forEach((field) => {
      group[field.name] = new FormControl(field.defaultValue || '', field.validators ?? []);
      if (field.toggleable) {
        this.hiddenState[field.name] = true;
      }
    });
    this.form = new FormGroup(group);
  }

  toggleVisibility(fieldName: string) {
    this.hiddenState[fieldName] = !this.hiddenState[fieldName];
  }
  isHidden(fieldName: string) {
    return this.hiddenState[fieldName];
  }

  confirm() {
    this.optionDialogRef.close({
      confirmed: true,
      data: this.form.value,
    });
  }
  cancel() {
    this.optionDialogRef.close({
      confirmed: false,
      data: this.form.value,
    });
  }
}
