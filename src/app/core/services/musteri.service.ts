import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Musteri } from '../../models/musteri';
import { Observable } from 'rxjs';

export interface PagedResponse<T> {
  totalCount: number;
  data: T[];
}

@Injectable({
  providedIn: 'root'
})
export class MusteriService {

  private baseUrl = 'https://localhost:7213';

  constructor(private http: HttpClient) {}

  ara(params: any): Observable<PagedResponse<Musteri>> {
    return this.http.get<PagedResponse<Musteri>>(
      `${this.baseUrl}/musteri`,
      { params }
    );
  }

  musteriEkle(data: any): Observable<Musteri> {
    return this.http.post<Musteri>(`${this.baseUrl}/musteri`, data);
  }

  musteriGuncelle(id: number, payload: Musteri) {
  return this.http.put<Musteri>(
    `${this.baseUrl}/musteri/${id}`,
    payload
  );
}

  iletisimEkle(data: any) {
    return this.http.post<any>(`${this.baseUrl}/iletisim`, data);
  }

  iletisimListeGetir(params: any) {
    return this.http.get<any>(
      `${this.baseUrl}/iletisim`,
      { params }
    );
  }

  iletisimIslemEkle(data: any) {
    return this.http.post<any>(
      `${this.baseUrl}/iletisim/islemekle`,
      data
    );
  }

  iletisimIslemGecmisiGetir(iletisimId: number) {
    return this.http.get<any[]>(
      `${this.baseUrl}/iletisim/islemgecmisi`,
      { params: { iletisimId } }
    );
  }
dropdownAll() {
  return this.http.get<any[]>(`${this.baseUrl}/dropdown/all`);
}
 
  dropdownGet(key: string) {
    return this.http.get<any>(`${this.baseUrl}/dropdown/${key}`);
  }
}