import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoriteService } from '../favorite.service';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-favorite-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      class="favorite-btn"
      [class.is-favorite]="isFavorite"
      [disabled]="isLoading"
      (click)="toggleFavorite()"
      [title]="isFavorite ? 'Remover de favoritos' : 'Agregar a favoritos'">

      <span class="heart-icon" [class.loading]="isLoading">
        {{ isFavorite ? '❤️' : '🤍' }}
      </span>

      <span class="btn-text" *ngIf="showText">
        {{ isFavorite ? 'En favoritos' : 'Agregar a favoritos' }}
      </span>
    </button>
    
    <!-- Debug info -->
    <div style="font-size: 10px; color: gray;" *ngIf="false">
      Auth: {{authService.isAuthenticated()}} | Loading: {{isLoading}} | Product: {{productId}}
    </div>
  `,
  styles: [`
    .favorite-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border: none;
      border-radius: 8px;
      background: transparent;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 14px;
    }

    .favorite-btn:hover {
      background-color: #f5f5f5;
      transform: scale(1.05);
    }

    .favorite-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .heart-icon {
      font-size: 20px;
      transition: transform 0.2s ease;
    }

    .heart-icon.loading {
      animation: pulse 1s infinite;
    }

    .is-favorite .heart-icon {
      animation: heartbeat 0.5s ease-out;
    }

    .btn-text {
      font-weight: 500;
    }

    .is-favorite .btn-text {
      color: #e91e63;
    }

    @keyframes heartbeat {
      0% { transform: scale(1); }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); }
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `]
})
export class FavoriteButtonComponent implements OnInit {
  @Input() productId!: number;
  @Input() showText: boolean = false;
  @Output() favoriteChanged = new EventEmitter<boolean>();

  isFavorite: boolean = false;
  isLoading: boolean = false;

  constructor(
    private favoriteService: FavoriteService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.checkFavoriteStatus();

    // Suscribirse a cambios en favoritos
    this.favoriteService.favorites$.subscribe(() => {
      this.checkFavoriteStatus();
    });
  }

  private checkFavoriteStatus(): void {
    this.isFavorite = this.favoriteService.isProductFavorite(this.productId);
  }

  toggleFavorite(): void {
    console.log('🔥 BUTTON CLICKED - toggleFavorite() method called');
    
    if (this.isLoading) {
      console.log('⚠️ Already loading, returning...');
      return;
    }

    console.log('=== TOGGLE FAVORITE DEBUG ===');
    console.log('Product ID:', this.productId);
    console.log('Auth Service present:', !!this.authService);
    console.log('Is authenticated (method):', this.authService.isAuthenticated());
    console.log('Current user:', this.authService.getCurrentUser());
    console.log('Token exists:', !!this.authService.getToken());
    
    // Verificar si el usuario está autenticado
    if (!this.authService.isAuthenticated()) {
      console.error('❌ User not authenticated - cannot toggle favorite');
      alert('Por favor, inicia sesión para agregar productos a favoritos');
      return;
    }

    console.log('✅ User is authenticated, proceeding with toggle...');
    this.isLoading = true;

    this.favoriteService.toggleFavorite(this.productId).subscribe({
      next: (response) => {
        console.log('✅ Toggle favorite response:', response);
        this.isFavorite = response.isFavorite;
        this.favoriteChanged.emit(this.isFavorite);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error toggling favorite:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        this.isLoading = false;
        
        // Mostrar mensaje de error específico
        if (error.status === 401) {
          alert('No estás autenticado. Por favor, inicia sesión.');
        } else {
          alert('Error al agregar/quitar de favoritos. Inténtalo de nuevo.');
        }
      }
    });
  }
}
