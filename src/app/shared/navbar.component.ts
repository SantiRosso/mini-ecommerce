import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../cart/cart.service';
import { AuthService, User } from '../core/auth.service';
import { FavoriteService } from '../favorites/favorite.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="navbar-container">
        <!-- Logo/Brand -->
        <div class="navbar-brand">
          <a routerLink="/" class="brand-link">
            <span class="brand-icon">🛍️</span>
            <span class="brand-text">Mini Store</span>
          </a>
        </div>        <!-- Navigation Links -->
        <div class="navbar-nav">
          <a routerLink="/"
             routerLinkActive="active"
             [routerLinkActiveOptions]="{exact: true}"
             class="nav-link">
            Inicio
          </a>
          <a routerLink="/products"
             routerLinkActive="active"
             class="nav-link">
            Productos
          </a>
          <a routerLink="/favorites"
             routerLinkActive="active"
             class="nav-link"
             *ngIf="authService.isAuthenticated$ | async">
            <span class="nav-icon">❤️</span>
            <span class="nav-text">Favoritos</span>
            <span class="nav-count"
                  [class.has-items]="(favoriteCount$ | async)! > 0">
              {{ favoriteCount$ | async }}
            </span>
          </a>
        </div>        <!-- Actions -->
        <div class="navbar-actions">
          <!-- Cart Button -->
          <a routerLink="/cart" class="cart-button" title="Ver carrito">
            <span class="cart-icon">🛒</span>
            <span class="cart-count"
                  [class.has-items]="(cartItemsCount$ | async)! > 0">
              {{ cartItemsCount$ | async }}
            </span>
          </a>

          <!-- Separator -->
          <div class="actions-separator"></div>          <!-- Profile Button -->
          <div class="profile-dropdown" *ngIf="(authService.isAuthenticated$ | async); else loginButton">
            <button class="profile-button" (click)="toggleDropdown()" [class.active]="showDropdown">
              <div class="profile-avatar">
                <svg class="profile-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
            </button>

            <div class="dropdown-menu" [class.show]="showDropdown">
              <div class="dropdown-header" *ngIf="(authService.currentUser$ | async) as user">
                <div class="user-info">
                  <span class="user-name">{{ user.firstName }} {{ user.lastName }}</span>
                  <span class="user-email">{{ user.email }}</span>
                </div>
              </div>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item" (click)="logout()">
                <svg class="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16,17 21,12 16,7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Cerrar Sesión
              </button>
            </div>
          </div>

          <ng-template #loginButton>
            <a routerLink="/auth" class="profile-button" title="Iniciar Sesión / Registro">
              <div class="profile-avatar">
                <svg class="profile-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
            </a>
          </ng-template>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: #ffffff;
      border-bottom: 2px solid #e5e5e5;
      transition: all 0.2s ease;
      height: 70px;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }

    .navbar:hover {
      border-bottom-color: #000000;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    .navbar-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 70px;
    }

    .navbar-brand .brand-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .navbar-brand .brand-link:hover {
      transform: translateY(-1px);
    }

    .navbar-brand .brand-icon {
      font-size: 1.5rem;
      transition: all 0.2s ease;
    }

    .navbar-brand .brand-text {
      font-size: 1.25rem;
      font-weight: 600;
      color: #000000;
      letter-spacing: -0.025em;
      transition: all 0.2s ease;
    }

    .navbar-brand .brand-link:hover .brand-icon {
      transform: scale(1.1);
    }

    .navbar-brand .brand-link:hover .brand-text {
      color: #404040;
    }

    .navbar-nav {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .nav-link {
      display: flex;
      align-items: center;
      padding: 0.5rem 1rem;
      color: #525252;
      text-decoration: none;
      font-weight: 500;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      transition: all 0.2s ease;
      position: relative;
    }

    .nav-link:hover {
      color: #000000;
    }

    .nav-link::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 50%;
      width: 0;
      height: 2px;
      background: #000000;
      transition: all 0.2s ease;
      transform: translateX(-50%);
    }

    .nav-link:hover::after,
    .nav-link.active::after {
      width: 100%;
    }

    .nav-link.active {
      color: #000000;
      font-weight: 600;
    }

    .nav-icon {
      font-size: 1rem;
    }

    .nav-text {
      display: inline;
    }

    .nav-count {
      background: #d4d4d4;
      color: #666;
      font-size: 0.7rem;
      font-weight: 600;
      padding: 0.125rem 0.375rem;
      border-radius: 50%;
      min-width: 1rem;
      height: 1rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-left: 0.5rem;
      transition: all 0.2s ease;
    }

    .nav-count.has-items {
      background: #e91e63;
      color: #ffffff;
    }

    .navbar-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }    .cart-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: none;
      border: 2px solid #d4d4d4;
      padding: 0.5rem 1rem;
      cursor: pointer;
      transition: all 0.2s ease;
      font-weight: 500;
      color: #404040;
      text-decoration: none;
    }

    .cart-button:hover {
      border-color: #000000;
      color: #000000;
      transform: translateY(-1px);
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }

    .cart-button:active {
      transform: scale(0.98);
    }

    .cart-icon {
      font-size: 1.125rem;
      transition: all 0.2s ease;
    }

    .cart-count {
      background: #d4d4d4;
      color: #666;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.125rem 0.375rem;
      border-radius: 50%;
      min-width: 1.25rem;
      height: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .cart-count.has-items {
      background: #000000;
      color: #ffffff;
      animation: pulse 0.5s ease-in-out;
    }

    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }

    .cart-button:hover .cart-icon {
      transform: scale(1.1);
    }

    .cart-button:hover .cart-count {
      background: #404040;
    }

    .actions-separator {
      width: 1px;
      height: 30px;
      background: #e0e0e0;
      margin: 0 0.75rem;
    }

    .profile-button {
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      transition: all 0.2s ease;
      margin-left: 0.5rem;
    }

    .profile-avatar {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      border: 2px solid white;
    }

    .profile-button:hover .profile-avatar {
      transform: translateY(-1px) scale(1.05);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }    .profile-icon {
      color: white;
      width: 18px;
      height: 18px;
      stroke-width: 2;
      transition: all 0.2s ease;
    }

    .profile-button:hover .profile-icon {
      transform: scale(1.1);
    }

    .profile-dropdown {
      position: relative;
    }

    .profile-button.active .profile-avatar {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .dropdown-menu {
      position: absolute;
      top: calc(100% + 15px);
      right: 0;
      background: white;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      min-width: 250px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.2s ease;
      z-index: 1000;
      border: 1px solid #e2e8f0;
    }

    .dropdown-menu.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .dropdown-menu::before {
      content: '';
      position: absolute;
      top: -6px;
      right: 20px;
      width: 12px;
      height: 12px;
      background: white;
      border: 1px solid #e2e8f0;
      border-bottom: none;
      border-right: none;
      transform: rotate(45deg);
    }

    .dropdown-header {
      padding: 16px;
    }

    .user-info {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-weight: 600;
      color: #2d3748;
      margin-bottom: 4px;
    }

    .user-email {
      font-size: 12px;
      color: #718096;
    }

    .dropdown-divider {
      height: 1px;
      background: #e2e8f0;
      margin: 0 8px;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      padding: 12px 16px;
      background: none;
      border: none;
      font-size: 14px;
      color: #4a5568;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .dropdown-item:hover {
      background: #f7fafc;
      color: #2d3748;
    }

    .dropdown-item:last-child {
      border-radius: 0 0 8px 8px;
    }

    .dropdown-icon {
      width: 16px;
      height: 16px;
      stroke-width: 2;
    }

    @media (max-width: 768px) {
      .navbar-container {
        padding: 0 0.75rem;
        height: 60px;
      }

      .navbar {
        height: 60px;
      }

      .navbar-brand .brand-text {
        display: none;
      }

      .navbar-nav {
        gap: 0.75rem;
      }

      .nav-link {
        padding: 0.5rem;
        font-size: 0.8rem;
      }

      .nav-text {
        display: none;
      }

      .nav-count {
        margin-left: 0.25rem;
        min-width: 0.875rem;
        height: 0.875rem;
        font-size: 0.65rem;
      }

      .navbar-actions {
        gap: 0.75rem;
      }

      .profile-avatar {
        width: 36px;
        height: 36px;
      }      .profile-icon {
        width: 16px;
        height: 16px;
      }

      .cart-button {
        padding: 0.375rem 0.75rem;
      }

      .actions-separator {
        height: 25px;
        margin: 0 0.5rem;
      }
    }
  `]
})
export class NavbarComponent implements OnInit {
  cartItemsCount$: Observable<number>;
  favoriteCount$: Observable<number>;
  showDropdown = false;

  constructor(
    private cartService: CartService,
    public authService: AuthService,
    private favoriteService: FavoriteService
  ) {
    this.cartItemsCount$ = new Observable(observer => {
      this.cartService.cartItems$.subscribe(items => {
        const count = items.reduce((total, item) => total + item.quantity, 0);
        observer.next(count);
      });
    });

    this.favoriteCount$ = new Observable(observer => {
      this.favoriteService.favorites$.subscribe(favorites => {
        observer.next(favorites.length);
      });
    });
  }

  ngOnInit(): void {}

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  logout(): void {
    this.showDropdown = false;
    this.authService.logout().subscribe();
  }
}
