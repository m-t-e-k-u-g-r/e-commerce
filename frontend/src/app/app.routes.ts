import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'c/:slug', component: HomeComponent },
  { path: 'shopping-cart', component: ShoppingCartComponent },
];
