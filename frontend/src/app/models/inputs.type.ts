import { ValidatorFn } from '@angular/forms';

export interface DialogInput {
  title: string;
  message?: string;
  messageType?: 'text' | 'html';
}

type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'textarea'
  | 'number'
  | 'select'
  | 'radio'
  | 'date';

export interface Field {
  name: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  defaultValue?: any;
  disabled?: boolean;
  options?: {
    label: string;
    value: any;
  }[];
  toggleable?: boolean;
  validators?: ValidatorFn[];
}

export interface FormDialogInput extends Omit<DialogInput, 'messageType'> {
  fields: Field[];
}
