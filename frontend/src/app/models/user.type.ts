export interface User extends EditUser {
  id: number;
  lastLogin: Date;
}

export interface EditUser {
  email: string;
  forename?: string;
  surname?: string;
}

export interface UserListItem {
  title: string;
  value: string | Date | null | undefined;
  isDate?: boolean;
}
