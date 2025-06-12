import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService, CartItem } from '../cart.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cart-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="cart-container">
      <div class="cart-header">
        <h2>🛒 Carrito de Compras</h2>
        <p class="items-count" *ngIf="(cartItems$ | async)?.length! > 0">
          {{ getTotalItems() }} {{ getTotalItems() === 1 ? 'artículo' : 'artículos' }}
        </p>
      </div>

      <div class="cart-content" *ngIf="(cartItems$ | async) as cartItems">
        <!-- Carrito vacío -->
        <div class="empty-cart" *ngIf="cartItems.length === 0">
          <div class="empty-cart-icon">🛒</div>
          <h3>Tu carrito está vacío</h3>
          <p>¡Agrega algunos productos increíbles!</p>
          <a routerLink="/products" class="btn btn-primary">Explorar Productos</a>
        </div>

        <!-- Items del carrito -->
        <div class="cart-items" *ngIf="cartItems.length > 0">
          <div class="cart-item" *ngFor="let item of cartItems">
            <div class="item-info">
              <h4>{{ item.product.name }}</h4>
              <p class="item-price">\${{ item.product.price | number:'1.2-2' }}</p>
            </div>

            <div class="quantity-controls">
              <button
                class="btn-quantity"
                (click)="decreaseQuantity(item.product.id)"
                [disabled]="item.quantity <= 1">
                -
              </button>
              <span class="quantity">{{ item.quantity }}</span>
              <button
                class="btn-quantity"
                (click)="increaseQuantity(item.product.id)">
                +
              </button>
            </div>

            <div class="item-total">
              <p>\${{ (item.product.price * item.quantity) | number:'1.2-2' }}</p>
            </div>

            <button
              class="btn-remove"
              (click)="removeItem(item.product.id)"
              title="Eliminar del carrito">
              🗑️
            </button>
          </div>

          <!-- Total del carrito -->
          <div class="cart-summary">
            <div class="total-section">
              <h3>Total: \${{ getCartTotal() | number:'1.2-2' }}</h3>
            </div>

            <div class="cart-actions">
              <button class="btn btn-secondary" (click)="clearCart()">
                Vaciar Carrito
              </button>
              <a routerLink="/checkout" class="btn btn-primary">
                Proceder al Pago
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cart-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .cart-header {
      border-bottom: 2px solid #e0e0e0;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }

    .cart-header h2 {
      margin: 0;
      color: #333;
      font-size: 2rem;
    }

    .items-count {
      color: #666;
      margin: 10px 0 0 0;
      font-size: 1.1rem;
    }

    .empty-cart {
      text-align: center;
      padding: 60px 20px;
    }

    .empty-cart-icon {
      font-size: 4rem;
      margin-bottom: 20px;
      opacity: 0.3;
    }

    .empty-cart h3 {
      color: #333;
      margin-bottom: 10px;
    }

    .empty-cart p {
      color: #666;
      margin-bottom: 30px;
    }

    .cart-item {
      display: flex;
      align-items: center;
      padding: 20px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      margin-bottom: 15px;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .item-info {
      flex: 2;
    }

    .item-info h4 {
      margin: 0 0 8px 0;
      color: #333;
      font-size: 1.2rem;
    }

    .item-price {
      color: #007bff;
      font-weight: bold;
      margin: 0;
      font-size: 1.1rem;
    }

    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 0 20px;
    }

    .btn-quantity {
      width: 35px;
      height: 35px;
      border: 1px solid #ddd;
      border-radius: 50%;
      background: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      transition: all 0.2s;
    }

    .btn-quantity:hover:not(:disabled) {
      background: #007bff;
      color: white;
      border-color: #007bff;
    }

    .btn-quantity:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .quantity {
      font-weight: bold;
      font-size: 1.1rem;
      min-width: 30px;
      text-align: center;
    }

    .item-total {
      flex: 1;
      text-align: right;
    }

    .item-total p {
      margin: 0;
      font-weight: bold;
      font-size: 1.2rem;
      color: #28a745;
    }

    .btn-remove {
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      padding: 8px;
      border-radius: 4px;
      margin-left: 15px;
      transition: background-color 0.2s;
    }

    .btn-remove:hover {
      background: #ffebee;
    }

    .cart-summary {
      margin-top: 30px;
      padding: 25px;
      border: 2px solid #007bff;
      border-radius: 8px;
      background: #f8f9fa;
    }

    .total-section {
      text-align: center;
      margin-bottom: 20px;
    }

    .total-section h3 {
      margin: 0;
      color: #333;
      font-size: 1.8rem;
    }

    .cart-actions {
      display: flex;
      gap: 15px;
      justify-content: center;
    }

    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
      text-align: center;
      transition: all 0.2s;
      font-weight: 500;
    }

    .btn-primary {
      background: #007bff;
      color: white;
    }

    .btn-primary:hover {
      background: #0056b3;
      transform: translateY(-1px);
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background: #545b62;
    }

    @media (max-width: 600px) {
      .cart-item {
        flex-direction: column;
        align-items: stretch;
        gap: 15px;
      }

      .quantity-controls {
        justify-content: center;
        margin: 0;
      }

      .item-total {
        text-align: center;
      }

      .cart-actions {
        flex-direction: column;
      }
    }
  `]
})
export class CartViewComponent implements OnInit {
  cartItems$: Observable<CartItem[]>;

  constructor(private cartService: CartService) {
    this.cartItems$ = this.cartService.cartItems$;
  }

  ngOnInit(): void {}

  increaseQuantity(productId: number): void {
    const items = this.cartService.getCartItems();
    const item = items.find(i => i.product.id === productId);
    if (item) {
      this.cartService.updateQuantity(productId, item.quantity + 1);
    }
  }

  decreaseQuantity(productId: number): void {
    const items = this.cartService.getCartItems();
    const item = items.find(i => i.product.id === productId);
    if (item && item.quantity > 1) {
      this.cartService.updateQuantity(productId, item.quantity - 1);
    }
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      this.cartService.clearCart();
    }
  }

  getTotalItems(): number {
    return this.cartService.getCartItemsCount();
  }

  getCartTotal(): number {
    return this.cartService.getCartTotal();
  }
}
