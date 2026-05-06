import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { LoginComponent } from './components/login/login.component';
import { AddressOverviewComponent } from './components/address-overview/address-overview.component';
import { AddressFormComponent } from './components/address-form/address-form.component';
import { OrderOverviewComponent } from './components/order-overview/order-overview.component';
import { authGuard, redirectFromLogin } from './guards/auth.guard';
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'c/:slug', component: HomeComponent },
  { path: 'shopping-cart', component: ShoppingCartComponent },
  { path: 'address', component: AddressOverviewComponent },
  { path: 'address/new', component: AddressFormComponent },
  { path: 'address/e/:id', component: AddressFormComponent },
  { path: 'orders', component: OrderOverviewComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent, canActivate: [redirectFromLogin] },
  { path: '**', redirectTo: ''},
];
