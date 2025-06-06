import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
        </div>

        <!-- Navigation Links -->
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
        </div>

        <!-- Actions -->
        <div class="navbar-actions">
          <button class="cart-button" type="button">
            <span class="cart-icon">🛒</span>
            <span class="cart-count">0</span>
          </button>
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

    .navbar-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .cart-button {
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
      background: #000000;
      color: #ffffff;
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

    .cart-button:hover .cart-icon {
      transform: scale(1.1);
    }

    .cart-button:hover .cart-count {
      background: #404040;
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
    }
  `]
})
export class NavbarComponent {

}
