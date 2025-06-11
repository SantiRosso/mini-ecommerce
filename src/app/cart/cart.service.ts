import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../products/product.service';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {
    // Cargar carrito desde localStorage si existe
    this.loadCartFromStorage();
  }

  addToCart(product: Product, quantity: number = 1): void {
    const existingItemIndex = this.cartItems.findIndex(item => item.product.id === product.id);
    
    if (existingItemIndex > -1) {
      // Si el producto ya existe, incrementar la cantidad
      this.cartItems[existingItemIndex].quantity += quantity;
    } else {
      // Si es un producto nuevo, agregarlo al carrito
      this.cartItems.push({ product, quantity });
    }
    
    this.updateCart();
  }

  removeFromCart(productId: number): void {
    this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
    this.updateCart();
  }

  updateQuantity(productId: number, quantity: number): void {
    const itemIndex = this.cartItems.findIndex(item => item.product.id === productId);
    
    if (itemIndex > -1) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        this.cartItems[itemIndex].quantity = quantity;
        this.updateCart();
      }
    }
  }

  clearCart(): void {
    this.cartItems = [];
    this.updateCart();
  }

  getCartItems(): CartItem[] {
    return [...this.cartItems];
  }

  getCartItemsCount(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  getCartTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  private updateCart(): void {
    this.cartItemsSubject.next([...this.cartItems]);
    this.saveCartToStorage();
  }

  private saveCartToStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  private loadCartFromStorage(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.cartItemsSubject.next([...this.cartItems]);
    }
  }
}