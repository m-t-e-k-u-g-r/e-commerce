import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { LoginComponent } from './components/login/login.component';
import { AddressOverviewComponent } from './components/address-overview/address-overview.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'c/:slug', component: HomeComponent },
  { path: 'shopping-cart', component: ShoppingCartComponent },
  { path: 'address', component: AddressOverviewComponent },
  { path: 'login', component: LoginComponent }
];
