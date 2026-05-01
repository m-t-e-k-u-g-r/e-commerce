import { Component, inject } from '@angular/core';
import { MatCard, MatCardActions, MatCardAvatar, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { AuthService } from '../../services/auth.service';
import { MatButton } from '@angular/material/button';
import { MatDivider, MatList, MatListItem, MatListItemLine, MatListItemTitle } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { UserListItem } from '../../models/user.type';
import { NotificationService } from '../../services/notification.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardActions,
    MatCardTitle,
    MatButton,
    MatCardSubtitle,
    MatDivider,
    MatList,
    MatListItem,
    MatIcon,
    DatePipe,
    MatListItemTitle,
    MatListItemLine,
    MatCardAvatar,
  ],
  template: `
    @if (user) {
      <mat-card class="profile-container">
        <mat-card-header>
          <mat-icon mat-card-avatar>account_circle</mat-icon>
          <mat-card-title>
            @if (user.forename || user.surname) {
              {{ user.forename }} {{ user.surname }}
            } @else {
              User #{{ user.id }}
            }
          </mat-card-title>
          <mat-card-subtitle>{{ user.email }}</mat-card-subtitle>
        </mat-card-header>

        <mat-divider></mat-divider>

        <mat-card-content>
          <mat-list class="user-info">
            @for (item of getItems(); track item.title) {
              <mat-list-item>
                <span matListItemTitle class="title">{{ item.title }}</span>
                <span matListItemLine class="line">
                  {{ item.isDate ? (item.value | date: 'medium') : item.value }}
                </span>
              </mat-list-item>
            }
          </mat-list>
        </mat-card-content>

        <mat-card-actions align="end">
          <button mat-button (click)="this.notificationService.toBeImplemented()">
            Change Password
          </button>
          <button mat-button (click)="this.userService.openProfileEditor()">
            Edit Profile
          </button>
        </mat-card-actions>
      </mat-card>
    }
  `,
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  authService = inject(AuthService);
  userService = inject(UserService);
  notificationService = inject(NotificationService);
  user = this.authService.user();

  getItems(): UserListItem[] {
    if (!this.user) return [];
    return [
      { title: 'User ID:', value: this.user?.id },
      { title: 'Email:', value: this.user?.email },
      this.user?.forename || this.user?.surname
        ? {
            title: 'Name:',
            value: `${this.user.forename ?? ''} ${this.user.surname ?? ''}`.trim(),
          }
        : null,
      { title: 'Last Login:', value: this.user?.lastLogin, isDate: true },
    ].filter(Boolean) as UserListItem[];
  }
}
