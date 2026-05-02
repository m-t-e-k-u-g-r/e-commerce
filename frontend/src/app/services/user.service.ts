import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { EditUser, User } from '../models/user.type';
import { finalize, tap, throwError } from 'rxjs';
import { HttpClient, HttpContext } from '@angular/common/http';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';
import { catchError } from 'rxjs/operators';
import { ConfirmService } from './confirm.service';
import { Validators } from '@angular/forms';
import { passwordValidators } from '../utils';
import { API_TARGET } from '../interceptors/refresh-interceptor';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = environment.apiUrl + 'users';
  http = inject(HttpClient);
  authService = inject(AuthService);
  notificationService = inject(NotificationService);
  confirmService = inject(ConfirmService);
  loadingService = inject(LoadingService);

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
          validators: [Validators.required, Validators.email]
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

    this.editProfile(response.data).subscribe();
  }

  editProfile(updatedUser: EditUser) {
    const toastId = this.notificationService.pending('Updating profile...');
    this.loadingService.startLoading('user');
    return this.http.put<User>(this.baseUrl + '/profile', updatedUser,
      { withCredentials: true, context: new HttpContext().set(API_TARGET, 'authenticated') }
    ).pipe(
      tap((user: User) => {
        this.authService.user.set(user);
        this.notificationService.success('Profile updated successfully');
      }),
      catchError((err) => {
        this.notificationService.error('Failed to update profile');
        return throwError(() => err);
      }),
      finalize(() => {
        this.notificationService.clear(toastId);
        this.loadingService.stopLoading('user');
      })
    );
  }

  async openPasswordChangeDialog() {
    const response = await this.confirmService.confirmOptions(
      {
        title: 'Change password',
        fields: [
          {name: 'oldPassword', type: 'password', label: 'Current password', validators: passwordValidators},
          {name: 'newPassword', type: 'password', label: 'New password', validators: passwordValidators},
          {name: 'confirmNew', type: 'password', label: 'Confirm new password', validators: passwordValidators }
        ],
      },
      {}
    );
    if (!response.confirmed) return;
    const data = response.data;
    if (data.newPassword !== data.confirmNew) {
      return this.notificationService.error('Password confirmation invalid');
    }
    this.changePassword(data.oldPassword, data.newPassword).subscribe();
  }

  changePassword(oldPassword: string, newPassword: string) {
    const toastId = this.notificationService.pending('Changing password...');
    return this.http
      .put<void>(
        this.baseUrl + '/change-password',
        { oldPassword: oldPassword, newPassword: newPassword },
        { withCredentials: true, context: new HttpContext().set(API_TARGET, 'authenticated') },
      )
      .pipe(
        tap(() => {
          this.notificationService.success('Password changed successfully');
        }),
        catchError((err) => {
          if (err.message === 'INVALID_PASSWORD') {
            this.notificationService.error('Invalid current password');
          } else if (err.message === 'SAME_PASSWORD') {
            this.notificationService.error(
              'New password cannot be the same as the current password',
            );
          } else {
            this.notificationService.error('Please try again', 'Failed to change password');
          }

          return throwError(() => err);
        }),
        finalize(() => {
          this.notificationService.clear(toastId);
        }),
      );
  }
}
