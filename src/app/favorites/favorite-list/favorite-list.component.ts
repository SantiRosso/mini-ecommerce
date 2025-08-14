import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FavoriteService, Favorite } from '../favorite.service';
import { ProductService, Product } from '../../products/product.service';
import { FavoriteButtonComponent } from '../favorite-button/favorite-button.component';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

interface FavoriteWithProduct extends Favorite {
  product?: Product;
}

@Component({
  selector: 'app-favorite-list',
  standalone: true,
  imports: [CommonModule, FavoriteButtonComponent],
  template: `
    <div class="favorites-container">
      <div class="favorites-header">
        <h2>Mis Favoritos</h2>
        <p class="favorites-count">{{ favorites.length }} producto(s)</p>
      </div>

      <div class="favorites-content" *ngIf="!isLoading; else loadingTemplate">
        <div class="empty-state" *ngIf="favorites.length === 0">
          <div class="empty-icon">💔</div>
          <h3>No tienes favoritos aún</h3>
          <p>Explora nuestros productos y marca tus favoritos</p>
          <button class="btn-primary" (click)="goToProducts()">
            Ver Productos
          </button>
        </div>

        <div class="favorites-grid" *ngIf="favorites.length > 0">
          <div class="favorite-card" *ngFor="let favorite of favorites">
            <div class="product-image">
              <img
                [src]="getProductImage(favorite.product)"
                [alt]="favorite.product?.name || 'Producto'"
                (error)="onImageError($event)">
            </div>

            <div class="product-info">
              <h3 class="product-name">{{ favorite.product?.name || 'Producto no encontrado' }}</h3>
              <p class="product-price" *ngIf="favorite.product">
                {{ formatPrice(favorite.product.price) }}
              </p>
              <p class="added-date">
                Agregado el {{ favorite.createdAt | date:'dd/MM/yyyy' }}
              </p>
            </div>

            <div class="product-actions">
              <button
                class="btn-view"
                *ngIf="favorite.product"
                (click)="viewProduct(favorite.productId)">
                Ver Producto
              </button>

              <app-favorite-button
                [productId]="favorite.productId"
                (favoriteChanged)="onFavoriteChanged($event, favorite)">
              </app-favorite-button>
            </div>
          </div>
        </div>
      </div>

      <ng-template #loadingTemplate>
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Cargando favoritos...</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .favorites-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .favorites-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .favorites-header h2 {
      color: #333;
      margin-bottom: 8px;
    }

    .favorites-count {
      color: #666;
      font-size: 16px;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
    }

    .empty-icon {
      font-size: 64px;
      margin-bottom: 20px;
    }

    .empty-state h3 {
      color: #333;
      margin-bottom: 12px;
    }

    .empty-state p {
      color: #666;
      margin-bottom: 24px;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
      transition: background-color 0.3s ease;
    }

    .btn-primary:hover {
      background-color: #0056b3;
    }

    .favorites-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }

    .favorite-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .favorite-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .product-image {
      height: 200px;
      overflow: hidden;
      background-color: #f8f9fa;
    }

    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .product-info {
      padding: 16px;
    }

    .product-name {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin-bottom: 8px;
      line-height: 1.4;
    }

    .product-price {
      font-size: 20px;
      font-weight: 700;
      color: #28a745;
      margin-bottom: 8px;
    }

    .added-date {
      font-size: 14px;
      color: #666;
      margin-bottom: 0;
    }

    .product-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-top: 1px solid #e9ecef;
    }

    .btn-view {
      background-color: #17a2b8;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.3s ease;
    }

    .btn-view:hover {
      background-color: #138496;
    }

    .loading-state {
      text-align: center;
      padding: 60px 20px;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #007bff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .favorites-grid {
        grid-template-columns: 1fr;
      }

      .product-actions {
        flex-direction: column;
        gap: 12px;
      }
    }
  `]
})
export class FavoriteListComponent implements OnInit {
  favorites: FavoriteWithProduct[] = [];
  isLoading: boolean = true;

  constructor(
    private favoriteService: FavoriteService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFavoritesWithProducts();
  }

  private loadFavoritesWithProducts(): void {
    this.isLoading = true;

    this.favoriteService.loadFavorites().subscribe({
      next: (response) => {
        const favorites = response.favorites;

        if (favorites.length === 0) {
          this.favorites = [];
          this.isLoading = false;
          return;
        }

        // Cargar información del producto para cada favorito
        const productRequests = favorites.map(favorite =>
          this.productService.getProductById(favorite.productId).pipe(
            map(product => ({ ...favorite, product })),
            catchError(() => of({ ...favorite, product: undefined }))
          )
        );

        forkJoin(productRequests).subscribe({
          next: (favoritesWithProducts) => {
            this.favorites = favoritesWithProducts;
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error loading products for favorites:', error);
            this.favorites = favorites;
            this.isLoading = false;
          }
        });
      },
      error: (error) => {
        console.error('Error loading favorites:', error);
        this.isLoading = false;
      }
    });
  }

  viewProduct(productId: number): void {
    this.router.navigate(['/product', productId]);
  }

  goToProducts(): void {
    this.router.navigate(['/products']);
  }

  onFavoriteChanged(isFavorite: boolean, favorite: FavoriteWithProduct): void {
    if (!isFavorite) {
      // Remover de la lista si ya no es favorito
      this.favorites = this.favorites.filter(f => f.id !== favorite.id);
    }
  }

  getProductImage(product?: Product): string {
    return '/assets/images/product-placeholder.jpg';
  }

  onImageError(event: any): void {
    event.target.src = '/assets/images/product-placeholder.jpg';
  }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }
}
