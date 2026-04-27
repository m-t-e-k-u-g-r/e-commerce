import { Component, inject, signal } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import { MatFormField, MatInput, MatLabel, MatSuffix } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule, MatButton, MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatIcon,
    MatButtonModule,
    MatIconButton,
    MatButton,
    MatSuffix,
  ],
  template: `
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
      <mat-form-field>
        <mat-label>E-Mail</mat-label>
        <input
          matInput
          placeholder="john.doe@example.com"
          type="email"
          formControlName="email"
        />
      </mat-form-field>
      <mat-form-field>
        <mat-label>Enter your password</mat-label>
        <input
          matInput
          [type]="hide() ? 'password' : 'text'"
          formControlName="password"
        />
        <button
          mat-icon-button
          matSuffix
          (click)="toggleVisibility(false)"
          [attr.aria-label]="'Hide password'"
          [attr.aria-pressed]="hide()"
        >
          <mat-icon>{{ hide() ? 'visibility_off' : 'visibility' }}</mat-icon>
        </button>
      </mat-form-field>
      @if (!isLogin) {
        <mat-form-field>
          <mat-label>Confirm Password</mat-label>
          <input
            matInput
            [type]="hideConfirm() ? 'password' : 'text'"
            formControlName="confirmPassword"
          />
          <button
            mat-icon-button
            matSuffix
            (click)="toggleVisibility(true)"
            [attr.aria-label]="'Hide password'"
            [attr.aria-pressed]="hideConfirm()"
          >
            <mat-icon>{{ hideConfirm() ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
        </mat-form-field>
      }
      <button type="submit" matButton="elevated">
        {{ isLogin ? 'Login' : 'Signup' }}
      </button>
      @if (isLogin) {
        <p>
          No account?
          <a (click)="toggleMode()"> Sign up </a>
        </p>
      }
      @if (!isLogin) {
        <p>
          Already have an account?
          <a (click)="toggleMode()"> Log in </a>
        </p>
      }
    </form>
  `,
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private authService = inject(AuthService);
  router = inject(Router);
  isLogin = true;
  loginForm: FormGroup<{
    email: FormControl<string | null>;
    password: FormControl<string | null>;
    confirmPassword: FormControl<string | null>;
  }> = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email, Validators.minLength(1)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', []),
  });
  hide = signal(true);
  hideConfirm = signal(true);
  toggleVisibility(confirm: boolean) {
    if (confirm) {
      this.hideConfirm.set(!this.hideConfirm());
    } else {
      this.hide.set(!this.hide());
    }
  }

  toggleMode() {
    this.isLogin = !this.isLogin;

    const confirmControl = this.loginForm.controls.confirmPassword;
    if (!this.isLogin) {
      confirmControl?.setValidators([Validators.required, Validators.minLength(6)]);
    } else {
      confirmControl?.clearValidators();
    }
  }

  onSubmit() {
    const data = this.loginForm.value;
    if (typeof data.email !== 'string' || typeof data.password !== 'string') return;
    if (this.isLogin) {
      this.authService.login(data.email, data.password).subscribe({
        next: () => {
          console.log('Login successful');
          this.router.navigate(['/']);
        },
        error: (err: Error) => {
          console.error('Login failed', err);
        },
      });
    } else {
      if (data.password !== data.confirmPassword) return;
      this.authService.signup(data.email, data.password).subscribe({
        next: () => {
          console.log('Signup successful');
          this.router.navigate(['/']);
        },
        error: (err: Error) => {
          console.error('Signup failed', err);
        },
      });
    }
  }
}
