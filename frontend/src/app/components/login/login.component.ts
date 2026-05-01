import { Component, inject, signal } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import { MatError, MatFormField, MatInput, MatLabel, MatSuffix } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule, MatButton, MatIconButton } from '@angular/material/button';
import { MyErrorStateMatcher } from '../../guards/errorMatcher.guard';
import { passwordValidators } from '../../utils';

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
    MatError,
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
          [errorStateMatcher]="matcher"
        />
        @if (
          this.loginForm.controls.email.hasError('email') &&
          !this.loginForm.controls.email.hasError('required')
        ) {
          <mat-error>Please enter a valid email address</mat-error>
        }
        @if (this.loginForm.controls.email.hasError('required')) {
          <mat-error>E-Mail is required</mat-error>
        }
      </mat-form-field>
      <mat-form-field>
        <mat-label>Enter your password</mat-label>
        <input matInput [type]="hide() ? 'password' : 'text'" formControlName="password" />
        <button
          type="button"
          mat-icon-button
          matSuffix
          (click)="toggleVisibility(false)"
          [attr.aria-label]="'Hide password'"
          [attr.aria-pressed]="hide()"
        >
          <mat-icon>{{ hide() ? 'visibility_off' : 'visibility' }}</mat-icon>
        </button>
        @if (this.loginForm.controls.password.hasError('required')) {
          <mat-error>Password is required</mat-error>
        }
        @if (
          this.loginForm.controls.password.hasError('minlength') ||
          this.loginForm.controls.password.hasError('pattern')
        ) {
          <mat-error>Password is too weak</mat-error>
        }
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
            type="button"
            mat-icon-button
            matSuffix
            (click)="toggleVisibility(true)"
            [attr.aria-label]="'Hide password'"
            [attr.aria-pressed]="hideConfirm()"
          >
            <mat-icon>{{ hideConfirm() ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
          @if (this.loginForm.controls.confirmPassword.hasError('required')) {
            <mat-error>Confirmation is required</mat-error>
          }
          @if (this.loginForm.controls.confirmPassword.hasError('pattern')) {
            <mat-error>Confirmation password must match password</mat-error>
          }
        </mat-form-field>
      }
      <button type="submit" matButton="elevated" [disabled]="loginForm.invalid || this.authService.loading()">
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
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  matcher = new MyErrorStateMatcher();
  protected authService = inject(AuthService);
  router = inject(Router);
  isLogin = true;
  loginForm: FormGroup<{
    email: FormControl<string | null>;
    password: FormControl<string | null>;
    confirmPassword: FormControl<string | null>;
  }> = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(12),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/),
    ]),
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
      confirmControl?.setValidators(passwordValidators);
    } else {
      confirmControl?.clearValidators();
    }
  }

  onSubmit() {
    const data = this.loginForm.value;
    if (typeof data.email !== 'string' || typeof data.password !== 'string') return;
    if (this.isLogin) {
      this.authService.login(data.email, data.password).subscribe();
    } else {
      if (data.password !== data.confirmPassword) return;
      this.authService.signup(data.email, data.password).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
      });
    }
  }
}
