import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, query, orderBy } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private baseUrl = 'https://localhost:7213';

  constructor(
    private firestore: Firestore,
    private http: HttpClient // .NET'e dosya fırlatmak için eklendi
  ) { }

  mesajlariGetir(iletisimId: string): Observable<any[]> {
    const mesajlarRef = collection(this.firestore, `iletisimler/${iletisimId}/mesajlar`);
    const q = query(mesajlarRef, orderBy('tarih', 'asc'));
    return collectionData(q, { idField: 'id' });
  }

  mesajGonder(iletisimId: string, benimId: number, benimKullaniciadi: string, metin: string, mentions: number[] = []) {
    const mesajlarRef = collection(this.firestore, `iletisimler/${iletisimId}/mesajlar`);
    return addDoc(mesajlarRef, {
      gonderenId: benimId,
      gonderenKullaniciadi: benimKullaniciadi,
      metin: metin,
      tip: 'metin',
      tarih: new Date().toISOString(),
      mentions: mentions
    });
  }

  async dosyaGonder(iletisimId: string, benimId: number, benimKullaniciadi: string, dosya: File) {
    const formData = new FormData();
    formData.append('dosya', dosya);
    formData.append('iletisimId', iletisimId);

    const uploadRes: any = await firstValueFrom(
      this.http.post(`${this.baseUrl}/iletisim/chatdosyayukle`, formData)
    );

    const mesajlarRef = collection(this.firestore, `iletisimler/${iletisimId}/mesajlar`);
    return addDoc(mesajlarRef, {
      gonderenId: benimId,
      gonderenKullaniciadi: benimKullaniciadi,
      metin: uploadRes.ad,
      dosyaUrl: uploadRes.url,
      dosyaTip: uploadRes.tip,
      tip: 'dosya',
      tarih: new Date().toISOString()
    });
  }
}