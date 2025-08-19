import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService, CreateProductRequest } from '../product.service';

@Component({
  selector: 'app-product-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="product-create-container">
      <div class="create-header">
        <button class="back-button" (click)="goBack()">
          <svg class="back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          <span>Volver</span>
        </button>
        <h1>Crear Nuevo Producto</h1>
      </div>

      <div class="create-form-container">
        <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="product-form">
          <div class="form-group">
            <label for="name">Nombre del Producto *</label>
            <input
              type="text"
              id="name"
              formControlName="name"
              class="form-control"
              [class.error]="isFieldInvalid('name')"
              placeholder="Ingresa el nombre del producto">
            <div class="error-message" *ngIf="isFieldInvalid('name')">
              <span *ngIf="productForm.get('name')?.errors?.['required']">
                El nombre es requerido
              </span>
              <span *ngIf="productForm.get('name')?.errors?.['minlength']">
                El nombre debe tener al menos 3 caracteres
              </span>
            </div>
          </div>

          <div class="form-group">
            <label for="price">Precio *</label>
            <div class="price-input-container">
              <span class="currency-symbol">$</span>
              <input
                type="number"
                id="price"
                formControlName="price"
                class="form-control price-input"
                [class.error]="isFieldInvalid('price')"
                placeholder="0.00"
                step="0.01"
                min="0">
            </div>
            <div class="error-message" *ngIf="isFieldInvalid('price')">
              <span *ngIf="productForm.get('price')?.errors?.['required']">
                El precio es requerido
              </span>
              <span *ngIf="productForm.get('price')?.errors?.['min']">
                El precio debe ser mayor a 0
              </span>
            </div>
          </div>

          <div class="form-actions">
            <button
              type="button"
              class="btn-cancel"
              (click)="goBack()"
              [disabled]="isLoading">
              Cancelar
            </button>
            <button
              type="submit"
              class="btn-create"
              [disabled]="productForm.invalid || isLoading">
              <span class="btn-content">
                <svg class="btn-icon" *ngIf="isLoading" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"
                          stroke-dasharray="32" stroke-dashoffset="32">
                    <animate attributeName="stroke-dashoffset" dur="1s" repeatCount="indefinite"
                             values="32;0;32"/>
                  </circle>
                </svg>
                <svg class="btn-icon" *ngIf="!isLoading" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                {{ isLoading ? 'Creando...' : 'Crear Producto' }}
              </span>
            </button>
          </div>
        </form>
      </div>

      <!-- Notificación de éxito -->
      <div class="success-notification" *ngIf="showSuccessMessage">
        <div class="notification-content">
          <svg class="success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M9 12l2 2 4-4"/>
            <circle cx="12" cy="12" r="10"/>
          </svg>
          <span>¡Producto creado exitosamente!</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-create-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      min-height: 100vh;
    }

    .create-header {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid #e5e7eb;
    }

    .back-button {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      background: white;
      color: #6b7280;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 14px;
    }

    .back-button:hover {
      background-color: #f9fafb;
      border-color: #9ca3af;
      color: #374151;
    }

    .back-icon {
      width: 16px;
      height: 16px;
      stroke-width: 2;
    }

    .create-header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
      color: #111827;
    }

    .create-form-container {
      background: #f9fafb;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .product-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-group label {
      font-weight: 500;
      color: #374151;
      font-size: 14px;
    }

    .form-control {
      padding: 12px 16px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.2s, box-shadow 0.2s;
      background: white;
    }

    .form-control:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-control.error {
      border-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }

    .price-input-container {
      position: relative;
      display: flex;
      align-items: center;
    }

    .currency-symbol {
      position: absolute;
      left: 16px;
      color: #6b7280;
      font-weight: 500;
      z-index: 1;
    }

    .price-input {
      padding-left: 40px;
    }

    .error-message {
      color: #ef4444;
      font-size: 14px;
      margin-top: 4px;
    }

    .form-actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      margin-top: 8px;
    }

    .btn-cancel,
    .btn-create {
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-cancel {
      background: white;
      color: #6b7280;
      border: 1px solid #d1d5db;
    }

    .btn-cancel:hover:not(:disabled) {
      background-color: #f9fafb;
      border-color: #9ca3af;
      color: #374151;
    }

    .btn-create {
      background: #3b82f6;
      color: white;
      min-width: 140px;
    }

    .btn-create:hover:not(:disabled) {
      background: #2563eb;
    }

    .btn-create:disabled,
    .btn-cancel:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-content {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn-icon {
      width: 16px;
      height: 16px;
      stroke-width: 2;
    }

    .success-notification {
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 16px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
    }

    .notification-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .success-icon {
      width: 20px;
      height: 20px;
      stroke-width: 2;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @media (max-width: 640px) {
      .product-create-container {
        padding: 16px;
      }

      .create-form-container {
        padding: 20px;
      }

      .create-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .create-header h1 {
        font-size: 24px;
      }

      .form-actions {
        flex-direction: column-reverse;
      }

      .btn-cancel,
      .btn-create {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class ProductCreateComponent {
  productForm: FormGroup;
  isLoading = false;
  showSuccessMessage = false;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {
    this.productForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      price: [null, [Validators.required, Validators.min(0.01)]]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  onSubmit(): void {
    if (this.productForm.valid && !this.isLoading) {
      this.isLoading = true;

      const productData: CreateProductRequest = {
        name: this.productForm.get('name')?.value,
        price: parseFloat(this.productForm.get('price')?.value)
      };

      this.productService.createProduct(productData).subscribe({
        next: (createdProduct) => {
          console.log('Product created successfully:', createdProduct);
          this.isLoading = false;
          this.showSuccessMessage = true;

          // Ocultar notificación después de 3 segundos y navegar
          setTimeout(() => {
            this.showSuccessMessage = false;
            this.router.navigate(['/products']);
          }, 2000);
        },
        error: (error) => {
          console.error('Error creating product:', error);
          this.isLoading = false;
          // Aquí podrías mostrar un mensaje de error
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
