export interface User {
  id: number;
  email: string;
  forename?: string;
  surname?: string;
  lastLogin: Date;
}

export interface UserListItem {
  title: string;
  value: string | Date | null | undefined;
  isDate?: boolean;
}
