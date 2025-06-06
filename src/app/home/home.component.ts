import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="home-container">
      <div class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">Mini Store</h1>
          <p class="hero-subtitle">Diseño minimalista, máxima elegancia</p>
          <p class="hero-description">
            Descubre nuestra colección cuidadosamente seleccionada de productos únicos 
            con un enfoque en la simplicidad y la calidad.
          </p>
          <div class="hero-actions">
            <a routerLink="/products" class="btn-primary">
              Explorar Productos
              <span class="arrow-icon">→</span>
            </a>
          </div>
        </div>
      </div>
      
      <div class="features-section">
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🎯</div>
            <h3>Selección Curada</h3>
            <p>Cada producto es cuidadosamente seleccionado por su calidad y diseño.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">✨</div>
            <h3>Diseño Minimalista</h3>
            <p>Menos es más. Enfoque en lo esencial sin comprometer la funcionalidad.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">🚀</div>
            <h3>Experiencia Simple</h3>
            <p>Navegación intuitiva y proceso de compra sin complicaciones.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      min-height: 100vh;
      background: #f7f7f7;
      padding-top: 70px;
    }

    .hero-section {
      background: #ffffff;
      border-bottom: 1px solid #e5e5e5;
      padding: 6rem 1rem;
      text-align: center;
    }

    .hero-content {
      max-width: 600px;
      margin: 0 auto;
    }

    .hero-title {
      font-size: 3.5rem;
      font-weight: 300;
      color: #000000;
      margin: 0 0 1rem;
      letter-spacing: -0.025em;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      color: #525252;
      margin: 0 0 2rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .hero-description {
      font-size: 1.125rem;
      line-height: 1.6;
      color: #737373;
      margin: 0 0 3rem;
    }

    .hero-actions {
      margin-top: 3rem;
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 2rem;
      background: #000000;
      color: #ffffff;
      text-decoration: none;
      font-weight: 500;
      font-size: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      transition: all 0.2s ease;
      border: 2px solid #000000;
    }

    .btn-primary:hover {
      background: #ffffff;
      color: #000000;
      transform: translateY(-2px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .arrow-icon {
      transition: all 0.2s ease;
    }

    .btn-primary:hover .arrow-icon {
      transform: translateX(4px);
    }

    .features-section {
      padding: 6rem 1rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 3rem;
    }

    .feature-card {
      background: #ffffff;
      padding: 3rem 2rem;
      text-align: center;
      border: 2px solid #e5e5e5;
      transition: all 0.2s ease;
    }

    .feature-card:hover {
      border-color: #000000;
      transform: translateY(-4px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }

    .feature-icon {
      font-size: 2.5rem;
      margin-bottom: 1.5rem;
    }

    .feature-card h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #000000;
      margin: 0 0 1rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .feature-card p {
      font-size: 1rem;
      line-height: 1.6;
      color: #525252;
      margin: 0;
    }

    @media (max-width: 768px) {
      .hero-section {
        padding: 4rem 1rem;
      }

      .hero-title {
        font-size: 2.5rem;
      }

      .hero-subtitle {
        font-size: 1rem;
      }

      .hero-description {
        font-size: 1rem;
      }

      .features-section {
        padding: 4rem 1rem;
      }

      .features-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .feature-card {
        padding: 2rem 1.5rem;
      }
    }
  `]
})
export class HomeComponent {

}
