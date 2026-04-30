export interface DialogInput {
  title: string;
  message?: string;
  messageType?: 'text' | 'html';
}

type FieldType =
  | 'text'
  | 'email'
  | 'textarea'
  | 'number'
  | 'select'
  | 'radio'
  | 'date';

export interface Field {
  name: string;
  type: FieldType;
  label: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: any;
  disabled?: boolean;
  options?: {
    label: string;
    value: any;
  }[];
}

export interface FormDialogInput extends Omit<DialogInput, 'messageType'> {
  fields: Field[];
}
