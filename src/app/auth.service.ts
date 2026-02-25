import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'https://localhost:7213';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  getPermissions(): string[] {
  const u = this.getUser();
  return (u?.permissions ?? []) as string[];
}

hasRole(role: string): boolean {
  const u = this.getUser();
  return u?.rol === role;
}

hasPerm(perm: string): boolean {
  if (this.hasRole('Admin')) return true; // admin sınırsız
  return this.getPermissions().includes(perm);
}
 login(data: any): Observable<any> {
  return this.http.post<any>(`${this.baseUrl}/login`, data).pipe(
    tap(res => {
      localStorage.setItem('token', res.token);

      const user = {
        ...res.user,
        permissions: res.permissions ?? []
      };

      localStorage.setItem('user', JSON.stringify(user));
    })
  );
}
 
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

 
  getUser() {
    return JSON.parse(localStorage.getItem('user') || 'null');
  }

  
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
