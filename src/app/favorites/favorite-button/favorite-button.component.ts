import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoriteService } from '../favorite.service';

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

  constructor(private favoriteService: FavoriteService) {}

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
    if (this.isLoading) return;

    this.isLoading = true;

    this.favoriteService.toggleFavorite(this.productId).subscribe({
      next: (response) => {
        this.isFavorite = response.isFavorite;
        this.favoriteChanged.emit(this.isFavorite);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error toggling favorite:', error);
        this.isLoading = false;
      }
    });
  }
}
