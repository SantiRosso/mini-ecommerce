import { Routes } from '@angular/router';
import { ProductListComponent } from './products/product-list/product-list.component';
import { ProductDetailComponent } from './products/product-detail/product-detail.component';

export const routes: Routes = [
  { path: 'products', component: ProductListComponent },
  { path: 'product/:id', component: ProductDetailComponent }
];
