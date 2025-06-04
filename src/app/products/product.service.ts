import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Product {
  id: number;
  name: string;
  price: number;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    console.log('Fetching products from mock JSON file');
    return this.http.get<Product[]>('assets/product-mock.json');
  }

  getProductById(id: number): Observable<Product | undefined> {
    return this.getProducts().pipe(
      map(products => products.find(p => p.id === id))
    );
  }
}
