import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface Favorite {
  id: string;
  userId: string;
  productId: number;
  createdAt: string;
}

export interface FavoriteResponse {
  message: string;
  favorite: Favorite;
}

export interface FavoriteListResponse {
  favorites: Favorite[];
  count: number;
}

export interface FavoriteCheckResponse {
  isFavorite: boolean;
  productId: number;
}

export interface FavoriteToggleResponse {
  message: string;
  isFavorite: boolean;
  favorite?: Favorite;
}

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private readonly API_URL = 'http://localhost:3000/favorite';

  // Subject para manejar el estado de favoritos
  private favoritesSubject = new BehaviorSubject<Favorite[]>([]);
  public favorites$ = this.favoritesSubject.asObservable();

  constructor(private http: HttpClient) {
    console.log('FavoriteService initialized');
    this.loadFavorites().subscribe({
      next: (response) => {
        console.log('Initial favorites loaded:', response);
      },
      error: (error) => {
        console.error('Error loading initial favorites:', error);
        // Si hay error de autenticación, el usuario probablemente no está logueado
        if (error.status === 401) {
          console.warn('User not authenticated - cannot load favorites');
        }
      }
    });
  }

  /**
   * Cargar todos los favoritos del usuario
   */
  loadFavorites(): Observable<FavoriteListResponse> {
    return this.http.get<FavoriteListResponse>(this.API_URL)
      .pipe(
        tap(response => {
          this.favoritesSubject.next(response.favorites);
        })
      );
  }

  /**
   * Agregar producto a favoritos
   */
  addToFavorites(productId: number): Observable<FavoriteResponse> {
    return this.http.post<FavoriteResponse>(`${this.API_URL}/${productId}`, {})
      .pipe(
        tap(() => {
          // Recargar favoritos después de agregar
          this.loadFavorites().subscribe();
        })
      );
  }

  /**
   * Remover producto de favoritos
   */
  removeFromFavorites(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${productId}`)
      .pipe(
        tap(() => {
          // Recargar favoritos después de remover
          this.loadFavorites().subscribe();
        })
      );
  }

  /**
   * Verificar si un producto es favorito
   */
  isFavorite(productId: number): Observable<FavoriteCheckResponse> {
    return this.http.get<FavoriteCheckResponse>(`${this.API_URL}/${productId}/check`);
  }

  /**
   * Alternar estado de favorito
   */
  toggleFavorite(productId: number): Observable<FavoriteToggleResponse> {
    console.log('Making toggle request to:', `${this.API_URL}/${productId}/toggle`);
    return this.http.post<FavoriteToggleResponse>(`${this.API_URL}/${productId}/toggle`, {})
      .pipe(
        tap(response => {
          console.log('Toggle favorite API response:', response);
          // Recargar favoritos después de alternar
          this.loadFavorites().subscribe({
            next: (loadResponse) => console.log('Favorites reloaded after toggle:', loadResponse),
            error: (error) => console.error('Error reloading favorites after toggle:', error)
          });
        })
      );
  }

  /**
   * Obtener favoritos desde el subject (sin hacer petición HTTP)
   */
  getCurrentFavorites(): Favorite[] {
    return this.favoritesSubject.value;
  }

  /**
   * Verificar si un producto es favorito desde el estado local
   */
  isProductFavorite(productId: number): boolean {
    const favorites = this.getCurrentFavorites();
    return favorites.some(favorite => favorite.productId === productId);
  }

  /**
   * Obtener el conteo de favoritos
   */
  getFavoriteCount(): number {
    return this.getCurrentFavorites().length;
  }
}
