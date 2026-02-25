import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface KullaniciRow {
  id: number;
  kullaniciadi: string;
  ad: string;
  soyad: string;
  rol: string;
  aktif: boolean;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private baseUrl = 'https://localhost:7213';

  constructor(private http: HttpClient) {}

 
  kullaniciListe(): Observable<KullaniciRow[]> {
    return this.http.get<KullaniciRow[]>(`${this.baseUrl}/kullanici`);
  }

  
  pasifYap(id: number) {
    return this.http.put(`${this.baseUrl}/kullanici/pasif/${id}`, {});
  }

  aktifYap(id: number) {
    return this.http.put(`${this.baseUrl}/kullanici/aktif/${id}`, {});
  }

 
  permissionListe(): Observable<{ id: number; key: string }[]> {
    return this.http.get<{ id: number; key: string }[]>(`${this.baseUrl}/admin/permissions`);
  }

  kullaniciPermissionGetir(userId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/admin/kullanici/${userId}/permissions`);
  }

  
  kullaniciPermissionKaydet(userId: number, perms: string[]) {
    return this.http.put(`${this.baseUrl}/admin/kullanici/${userId}/permissions`, { perms });
  }
  
  // ===== DROPDOWN TIP =====
dropdownTipListe() {
  return this.http.get<any[]>(`${this.baseUrl}/dropdown/tip`);
}

dropdownTipEkle(body: any) {
  return this.http.post(`${this.baseUrl}/dropdown/tip`, body);
}

dropdownTipGuncelle(id: number, body: any) {
  return this.http.put(`${this.baseUrl}/dropdown/tip/${id}`, body);
}

dropdownTipSil(id: number) {
  return this.http.delete(`${this.baseUrl}/dropdown/tip/${id}`);
}
dropdownTipPasif(id: number) {
  return this.http.put(`${this.baseUrl}/dropdown/tip/pasif/${id}`, {});
}

dropdownTipAktif(id: number) {
  return this.http.put(`${this.baseUrl}/dropdown/tip/aktif/${id}`, {});
}

// ===== DROPDOWN SECENEK =====
dropdownSecenekListe(tipId: number) {
  return this.http.get<any[]>(`${this.baseUrl}/dropdown/secenek/${tipId}`);
}

dropdownSecenekEkle(body: any) {
  return this.http.post(`${this.baseUrl}/dropdown/secenek`, body);
}

dropdownSecenekGuncelle(id: number, body: any) {
  return this.http.put(`${this.baseUrl}/dropdown/secenek/${id}`, body);
}

dropdownSecenekSil(id: number) {
  return this.http.delete(`${this.baseUrl}/dropdown/secenek/${id}`);
}

kullaniciEkle(body: {
  kullaniciadi: string;
  sifre: string;
  ad: string;
  soyad: string;
  rol: string;
}) {
  return this.http.post(`${this.baseUrl}/kullanici`, body);
}



}