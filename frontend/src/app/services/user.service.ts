import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { EditUser, User } from '../models/user.type';
import { finalize, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';
import { catchError } from 'rxjs/operators';
import { ConfirmService } from './confirm.service';
import { Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = environment.apiUrl + 'users';
  http = inject(HttpClient);
  authService = inject(AuthService);
  notificationService = inject(NotificationService);
  confirmService = inject(ConfirmService);

  getUser() {
    return this.http.get<User>(this.baseUrl + '/me',
      { withCredentials: true }
    ).pipe(
      tap((user: User) => {
        this.authService.user.set(user);
        this.authService.isLoggedIn.set(true);
      }),
      finalize(() => {
        this.authService.setInitialized(true);
      })
    );
  }

  async openProfileEditor() {
    const user = this.authService.user()
    if (!user) return;
    const response = await this.confirmService.confirmOptions({
      title: 'Profile editor',
      fields: [
        {
          name: 'email',
          type: 'email',
          label: 'E-Mail',
          defaultValue: user.email,
          validators: [Validators.required]
        },
        {
          name: 'forename',
          type: 'text',
          label: 'Forename',
          defaultValue: user.forename,
        },
        {
          name: 'surname',
          type: 'text',
          label: 'Surname',
          defaultValue: user.surname,
        }
      ],
    });
    if (!response.confirmed) return;

    const updatedUser: EditUser = {
      email: response.data.email,
      forename: response.data.forename,
      surname: response.data.surname,
    }
    this.editProfile(updatedUser).subscribe();
  }

  editProfile(updatedUser: EditUser) {
    const toastId = this.notificationService.pending('Updating profile...');
    return this.http.put<User>(this.baseUrl + '/profile',
      { updatedUser },
      { withCredentials: true }
    ).pipe(
      tap((user: User) => {
        this.authService.user.set(user);
      }),
      catchError((err) => {
        this.notificationService.error('Failed to update profile');
        return throwError(() => err);
      }),
      finalize(() => {
        this.notificationService.clear(toastId);
      })
    );
  }
}
