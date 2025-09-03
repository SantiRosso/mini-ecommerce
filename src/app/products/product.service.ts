import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface Product {
  id: number;
  name: string;
  price: number;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly API_URL = 'http://localhost:3000/product';

  // Subject para manejar el estado de productos
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadProducts();
  }

  /**
   * Cargar todos los productos
   */
  loadProducts(): Observable<Product[]> {
    console.log('Fetching products from backend API');
    return this.http.get<Product[]>(this.API_URL)
      .pipe(
        tap(products => {
          console.log('Products loaded:', products);
          this.productsSubject.next(products);
        })
      );
  }

  /**
   * Obtener todos los productos
   */
  getProducts(): Observable<Product[]> {
    return this.loadProducts();
  }

  /**
   * Obtener producto por ID
   */
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}/${id}`);
  }

  /**
   * Obtener productos desde el subject (sin hacer petición HTTP)
   */
  getCurrentProducts(): Product[] {
    return this.productsSubject.value;
  }
}
