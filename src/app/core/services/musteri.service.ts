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
  aramaState: any = null;
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

  caseOlustur(data: any) {
  return this.http.post(`${this.baseUrl}/case`, data);
}


caseTamamla(id: number) {
  return this.http.post(`${this.baseUrl}/case/tamamla/${id}`, {});
}

atananCaseGetir() {
  return this.http.get<any[]>(`${this.baseUrl}/case/atananlar`);
}

kullanicilariGetir() {
  return this.http.get<any[]>(`${this.baseUrl}/kullanici`);
}
musteriRaporGetir(musteriId: number) {
  return this.http.get<any>(`${this.baseUrl}/rapor/musteri/${musteriId}`);

}

dashboardStats(): Observable<any> {
  return this.http.get(`${this.baseUrl}/musteri/dashboard-istatistik`);
}
iletisimDosyaYukle(iletisimId: number, dosya: File) {
  const formData = new FormData();
  formData.append('dosya', dosya);
  return this.http.post<any>(
    `${this.baseUrl}/iletisim/dosyayukle?iletisimId=${iletisimId}`,
    formData
  );
}

private adresApiUrl = 'https://api.tradres.com.tr/public/v1/catalog/providers/localsqlite/nodes';
private adresApiKey = 'trd_live_BuLPt2BsbF8NWryAYNkGzJREpvgMnQGq';

private adresHeaders() {
  return { headers: { 'X-Api-Key': this.adresApiKey } };
}

illeriGetir() {
  return this.http.get<any[]>(
    `${this.adresApiUrl}?level=province&take=200`,
    this.adresHeaders()
  );
}

ilceleriGetir(ilId: number) {
  return this.http.get<any[]>(
    `${this.adresApiUrl}?level=town&parentId=${ilId}&take=200`,
    this.adresHeaders()
  );
}

mahalleleriGetir(ilceId: number) {
  return this.http.get<any[]>(
    `${this.adresApiUrl}?level=quarter&parentId=${ilceId}&take=200`,
    this.adresHeaders()
  );
}

sokaklariGetir(mahalleId: number) {
  return this.http.get<any[]>(
    `${this.adresApiUrl}?level=road&parentId=${mahalleId}&take=200`,
    this.adresHeaders()
  );
}
mailGonder(data: any) {
  return this.http.post(`${this.baseUrl}/mail/gonder`, data);
}

getGonderilenMailler(musteriId: number) {
  return this.http.get<any[]>(`${this.baseUrl}/mail/liste/${musteriId}`);
}
}