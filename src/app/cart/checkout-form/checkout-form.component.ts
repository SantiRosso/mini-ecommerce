import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../cart.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-checkout-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="checkout-container">
      <div class="checkout-header">
        <h2>💳 Finalizar Compra</h2>
      </div>

      <div class="checkout-content" *ngIf="(cartItems$ | async) as cartItems">
        <!-- Si el carrito está vacío -->
        <div class="empty-cart" *ngIf="cartItems.length === 0">
          <h3>Tu carrito está vacío</h3>
          <p>No hay productos para procesar la compra.</p>
          <button class="btn btn-primary" (click)="goToProducts()">Ir a Productos</button>
        </div>

        <!-- Formulario de checkout -->
        <div class="checkout-form-container" *ngIf="cartItems.length > 0">
          <div class="row">
            <!-- Formulario -->
            <div class="form-section">
              <h3>Información de Envío</h3>
              <form [formGroup]="checkoutForm" (ngSubmit)="onSubmit()">
                <div class="form-group">
                  <label for="firstName">Nombre *</label>
                  <input
                    type="text"
                    id="firstName"
                    formControlName="firstName"
                    [class.error]="checkoutForm.get('firstName')?.invalid && checkoutForm.get('firstName')?.touched">
                  <div class="error-message" *ngIf="checkoutForm.get('firstName')?.invalid && checkoutForm.get('firstName')?.touched">
                    El nombre es requerido
                  </div>
                </div>

                <div class="form-group">
                  <label for="lastName">Apellido *</label>
                  <input
                    type="text"
                    id="lastName"
                    formControlName="lastName"
                    [class.error]="checkoutForm.get('lastName')?.invalid && checkoutForm.get('lastName')?.touched">
                  <div class="error-message" *ngIf="checkoutForm.get('lastName')?.invalid && checkoutForm.get('lastName')?.touched">
                    El apellido es requerido
                  </div>
                </div>

                <div class="form-group">
                  <label for="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    formControlName="email"
                    [class.error]="checkoutForm.get('email')?.invalid && checkoutForm.get('email')?.touched">
                  <div class="error-message" *ngIf="checkoutForm.get('email')?.invalid && checkoutForm.get('email')?.touched">
                    <span *ngIf="checkoutForm.get('email')?.errors?.['required']">El email es requerido</span>
                    <span *ngIf="checkoutForm.get('email')?.errors?.['email']">Ingrese un email válido</span>
                  </div>
                </div>

                <div class="form-group">
                  <label for="phone">Teléfono *</label>
                  <input
                    type="tel"
                    id="phone"
                    formControlName="phone"
                    [class.error]="checkoutForm.get('phone')?.invalid && checkoutForm.get('phone')?.touched">
                  <div class="error-message" *ngIf="checkoutForm.get('phone')?.invalid && checkoutForm.get('phone')?.touched">
                    El teléfono es requerido
                  </div>
                </div>

                <div class="form-group">
                  <label for="address">Dirección *</label>
                  <input
                    type="text"
                    id="address"
                    formControlName="address"
                    [class.error]="checkoutForm.get('address')?.invalid && checkoutForm.get('address')?.touched">
                  <div class="error-message" *ngIf="checkoutForm.get('address')?.invalid && checkoutForm.get('address')?.touched">
                    La dirección es requerida
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="city">Ciudad *</label>
                    <input
                      type="text"
                      id="city"
                      formControlName="city"
                      [class.error]="checkoutForm.get('city')?.invalid && checkoutForm.get('city')?.touched">
                    <div class="error-message" *ngIf="checkoutForm.get('city')?.invalid && checkoutForm.get('city')?.touched">
                      La ciudad es requerida
                    </div>
                  </div>

                  <div class="form-group">
                    <label for="postalCode">Código Postal *</label>
                    <input
                      type="text"
                      id="postalCode"
                      formControlName="postalCode"
                      [class.error]="checkoutForm.get('postalCode')?.invalid && checkoutForm.get('postalCode')?.touched">
                    <div class="error-message" *ngIf="checkoutForm.get('postalCode')?.invalid && checkoutForm.get('postalCode')?.touched">
                      El código postal es requerido
                    </div>
                  </div>
                </div>

                <h3>Información de Pago</h3>
                <div class="form-group">
                  <label for="cardNumber">Número de Tarjeta *</label>
                  <input
                    type="text"
                    id="cardNumber"
                    formControlName="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    maxlength="19"
                    [class.error]="checkoutForm.get('cardNumber')?.invalid && checkoutForm.get('cardNumber')?.touched">
                  <div class="error-message" *ngIf="checkoutForm.get('cardNumber')?.invalid && checkoutForm.get('cardNumber')?.touched">
                    Ingrese un número de tarjeta válido
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="expiryDate">Fecha de Vencimiento *</label>
                    <input
                      type="text"
                      id="expiryDate"
                      formControlName="expiryDate"
                      placeholder="MM/AA"
                      maxlength="5"
                      [class.error]="checkoutForm.get('expiryDate')?.invalid && checkoutForm.get('expiryDate')?.touched">
                    <div class="error-message" *ngIf="checkoutForm.get('expiryDate')?.invalid && checkoutForm.get('expiryDate')?.touched">
                      Ingrese una fecha válida (MM/AA)
                    </div>
                  </div>

                  <div class="form-group">
                    <label for="cvv">CVV *</label>
                    <input
                      type="text"
                      id="cvv"
                      formControlName="cvv"
                      placeholder="123"
                      maxlength="4"
                      [class.error]="checkoutForm.get('cvv')?.invalid && checkoutForm.get('cvv')?.touched">
                    <div class="error-message" *ngIf="checkoutForm.get('cvv')?.invalid && checkoutForm.get('cvv')?.touched">
                      Ingrese un CVV válido
                    </div>
                  </div>
                </div>

                <div class="form-actions">
                  <button type="button" class="btn btn-secondary" (click)="goToCart()">
                    Volver al Carrito
                  </button>
                  <button
                    type="submit"
                    class="btn btn-primary"
                    [disabled]="checkoutForm.invalid || isProcessing">
                    <span *ngIf="!isProcessing">Confirmar Compra</span>
                    <span *ngIf="isProcessing">Procesando...</span>
                  </button>
                </div>
              </form>
            </div>

            <!-- Resumen del pedido -->
            <div class="order-summary">
              <h3>Resumen del Pedido</h3>
              <div class="order-items">
                <div class="order-item" *ngFor="let item of cartItems">
                  <div class="item-details">
                    <span class="item-name">{{ item.product.name }}</span>
                    <span class="item-quantity">x{{ item.quantity }}</span>
                  </div>
                  <span class="item-price">\${{ (item.product.price * item.quantity) | number:'1.2-2' }}</span>
                </div>
              </div>

              <div class="order-total">
                <div class="total-line">
                  <span>Subtotal:</span>
                  <span>\${{ getSubtotal() | number:'1.2-2' }}</span>
                </div>
                <div class="total-line">
                  <span>Envío:</span>
                  <span>\${{ shippingCost | number:'1.2-2' }}</span>
                </div>
                <div class="total-line total-final">
                  <span>Total:</span>
                  <span>\${{ getTotal() | number:'1.2-2' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .checkout-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .checkout-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .checkout-header h2 {
      color: #333;
      font-size: 2.2rem;
      margin: 0;
    }

    .empty-cart {
      text-align: center;
      padding: 60px 20px;
    }

    .row {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 40px;
    }

    .form-section {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .form-section h3 {
      color: #333;
      margin: 0 0 25px 0;
      padding-bottom: 10px;
      border-bottom: 2px solid #e0e0e0;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }

    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #333;
    }

    input {
      width: 100%;
      padding: 12px;
      border: 2px solid #e0e0e0;
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.2s;
      box-sizing: border-box;
    }

    input:focus {
      outline: none;
      border-color: #007bff;
    }

    input.error {
      border-color: #dc3545;
    }

    .error-message {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 5px;
    }

    .form-actions {
      display: flex;
      gap: 15px;
      justify-content: flex-end;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px solid #e0e0e0;
    }

    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
      font-weight: 500;
    }

    .btn-primary {
      background: #007bff;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #0056b3;
    }

    .btn-primary:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background: #545b62;
    }

    .order-summary {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      height: fit-content;
    }

    .order-summary h3 {
      color: #333;
      margin: 0 0 25px 0;
      padding-bottom: 10px;
      border-bottom: 2px solid #e0e0e0;
    }

    .order-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .item-details {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .item-name {
      font-weight: 500;
      color: #333;
    }

    .item-quantity {
      font-size: 0.9rem;
      color: #666;
    }

    .item-price {
      font-weight: bold;
      color: #007bff;
    }

    .order-total {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 2px solid #e0e0e0;
    }

    .total-line {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }

    .total-final {
      font-size: 1.2rem;
      font-weight: bold;
      color: #333;
      padding-top: 10px;
      border-top: 1px solid #e0e0e0;
    }

    @media (max-width: 768px) {
      .row {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class CheckoutFormComponent implements OnInit {
  cartItems$: Observable<CartItem[]>;
  checkoutForm: FormGroup;
  isProcessing = false;
  shippingCost = 1500; // Costo fijo de envío

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private router: Router
  ) {
    this.cartItems$ = this.cartService.cartItems$;
    this.checkoutForm = this.createForm();
  }

  ngOnInit(): void {}

  private createForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10,15}$/)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      postalCode: ['', [Validators.required, Validators.pattern(/^\d{4,10}$/)]],
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/)]],
      expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]]
    });
  }

  onSubmit(): void {
    if (this.checkoutForm.valid) {
      this.isProcessing = true;

      // Simular procesamiento de pago
      setTimeout(() => {
        this.processOrder();
      }, 2000);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.checkoutForm.controls).forEach(key => {
      const control = this.checkoutForm.get(key);
      control?.markAsTouched();
    });
  }

  private processOrder(): void {
    // Aquí iría la lógica de procesamiento real del pedido
    alert('¡Compra realizada con éxito! 🎉\n\nTu pedido ha sido procesado y recibirás un email de confirmación.');

    // Limpiar carrito y redirigir
    this.cartService.clearCart();
    this.router.navigate(['/products']);
    this.isProcessing = false;
  }

  getSubtotal(): number {
    return this.cartService.getCartTotal();
  }

  getTotal(): number {
    return this.getSubtotal() + this.shippingCost;
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  goToProducts(): void {
    this.router.navigate(['/products']);
  }
}
