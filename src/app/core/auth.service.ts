import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, timer } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

// Interfaces para tipado
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
  role?: string;
  avatar?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface ErrorResponse {
  message: string;
  statusCode: number;
  errors?: { [key: string]: string[] };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:3000/auth';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'current_user';

  // Subjects para manejar el estado de autenticación
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);

  // Observables públicos
  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public isLoading$ = this.isLoadingSubject.asObservable();

  private tokenRefreshTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Verificar si hay una sesión guardada al inicializar el servicio
    this.checkStoredAuth();
  }

  /**
   * Iniciar sesión
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    this.isLoadingSubject.next(true);

    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap(response => {
          this.handleAuthSuccess(response);
        }),
        catchError(error => {
          this.isLoadingSubject.next(false);
          return this.handleError(error);
        })
      );
  }

  /**
   * Registrar nuevo usuario
   */
  register(userData: RegisterRequest): Observable<AuthResponse> {
    this.isLoadingSubject.next(true);

    const { confirmPassword, ...dataToSend } = userData;
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, dataToSend)
      .pipe(
        tap(response => {
          this.handleAuthSuccess(response);
        }),
        catchError(error => {
          this.isLoadingSubject.next(false);
          return this.handleError(error);
        })
      );
  }

  /**
   * Cerrar sesión
   */
  logout(): Observable<any> {
    const token = this.getToken();

    // Llamar al endpoint de logout si hay token
    const logoutRequest = token
      ? this.http.post(`${this.API_URL}/logout`, {})
      : new Observable(observer => observer.next({}));

    return logoutRequest.pipe(
      tap(() => {
        this.handleLogout();
      }),
      catchError(error => {
        // Aunque falle el logout en el servidor, limpiar localmente
        this.handleLogout();
        return throwError(error);
      })
    );
  }

  /**
   * Refrescar token
   */
  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      return throwError('No refresh token available');
    }

    return this.http.post<AuthResponse>(`${this.API_URL}/refresh`, {
      refreshToken
    }).pipe(
      tap(response => {
        this.setToken(response.accessToken);
        if (response.refreshToken) {
          this.setRefreshToken(response.refreshToken);
        }
        this.scheduleTokenRefresh(response.expiresIn);
      }),
      catchError(error => {
        this.handleLogout();
        return this.handleError(error);
      })
    );
  }

  /**
   * Obtener perfil del usuario actual
   */
  getCurrentUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/profile`)
      .pipe(
        tap(user => {
          this.currentUserSubject.next(user);
          this.saveUserToStorage(user);
        }),
        catchError(error => this.handleError(error))
      );
  }

  /**
   * Actualizar perfil del usuario
   */
  updateProfile(userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/profile`, userData)
      .pipe(
        tap(user => {
          this.currentUserSubject.next(user);
          this.saveUserToStorage(user);
        }),
        catchError(error => this.handleError(error))
      );
  }

  /**
   * Cambiar contraseña
   */
  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.API_URL}/change-password`, {
      currentPassword,
      newPassword
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Solicitar reseteo de contraseña
   */
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.API_URL}/forgot-password`, { email })
      .pipe(
        catchError(error => this.handleError(error))
      );
  }

  /**
   * Resetear contraseña con token
   */
  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.API_URL}/reset-password`, {
      token,
      newPassword
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // Métodos de utilidad
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  // Métodos privados
  private handleAuthSuccess(response: AuthResponse): void {
    this.setToken(response.accessToken);
    if (response.refreshToken) {
      this.setRefreshToken(response.refreshToken);
    }

    this.currentUserSubject.next(response.user);
    this.isAuthenticatedSubject.next(true);
    this.isLoadingSubject.next(false);

    this.saveUserToStorage(response.user);
    this.scheduleTokenRefresh(response.expiresIn);
  }

  private handleLogout(): void {
    this.clearStorage();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.isLoadingSubject.next(false);

    if (this.tokenRefreshTimer) {
      clearTimeout(this.tokenRefreshTimer);
    }

    this.router.navigate(['/auth']);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error inesperado';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = error.error.message;
    } else {
      // Error del servidor
      switch (error.status) {
        case 400:
          errorMessage = error.error?.message || 'Datos inválidos';
          break;
        case 401:
          errorMessage = 'Credenciales inválidas';
          this.handleLogout();
          break;
        case 403:
          errorMessage = 'No tienes permisos para realizar esta acción';
          break;
        case 404:
          errorMessage = 'Recurso no encontrado';
          break;
        case 422:
          errorMessage = this.formatValidationErrors(error.error?.errors);
          break;
        case 500:
          errorMessage = 'Error interno del servidor';
          break;
        default:
          errorMessage = error.error?.message || 'Error de conexión';
      }
    }

    return throwError({ message: errorMessage, originalError: error });
  }

  private formatValidationErrors(errors: { [key: string]: string[] } | undefined): string {
    if (!errors) return 'Error de validación';

    const errorMessages = Object.values(errors).flat();
    return errorMessages.join(', ');
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private setRefreshToken(refreshToken: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  private saveUserToStorage(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private clearStorage(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  private checkStoredAuth(): void {
    const token = this.getToken();
    const userJson = localStorage.getItem(this.USER_KEY);

    if (token && userJson && !this.isTokenExpired()) {
      try {
        const user = JSON.parse(userJson);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);

        // Programar renovación del token
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiresIn = payload.exp - Math.floor(Date.now() / 1000);
        this.scheduleTokenRefresh(expiresIn);
      } catch (error) {
        this.clearStorage();
      }
    } else {
      this.clearStorage();
    }
  }

  private scheduleTokenRefresh(expiresInSeconds: number): void {
    if (this.tokenRefreshTimer) {
      clearTimeout(this.tokenRefreshTimer);
    }

    // Renovar el token 5 minutos antes de que expire
    const refreshTime = (expiresInSeconds - 300) * 1000;

    if (refreshTime > 0) {
      this.tokenRefreshTimer = setTimeout(() => {
        this.refreshToken().subscribe({
          error: () => this.handleLogout()
        });
      }, refreshTime);
    }
  }
}
