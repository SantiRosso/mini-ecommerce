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
  private readonly API_URL = 'http://localhost:3000/favorites';

  // Subject para manejar el estado de favoritos
  private favoritesSubject = new BehaviorSubject<Favorite[]>([]);
  public favorites$ = this.favoritesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadFavorites();
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
    return this.http.post<FavoriteToggleResponse>(`${this.API_URL}/${productId}/toggle`, {})
      .pipe(
        tap(() => {
          // Recargar favoritos después de alternar
          this.loadFavorites().subscribe();
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
