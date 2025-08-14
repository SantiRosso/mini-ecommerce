import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductListComponent } from './products/product-list/product-list.component';
import { ProductDetailComponent } from './products/product-detail/product-detail.component';
import { CartViewComponent } from './cart/cart-view/cart-view.component';
import { CheckoutFormComponent } from './cart/checkout-form/checkout-form.component';
import { AuthComponent } from './auth/auth.component';
import { FavoriteListComponent } from './favorites/favorite-list/favorite-list.component';
import { AuthGuard, GuestGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'cart', component: CartViewComponent },
  {
    path: 'favorites',
    component: FavoriteListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'checkout',
    component: CheckoutFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'auth',
    component: AuthComponent,
    canActivate: [GuestGuard]
  }
];
