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

  mesajGonder(iletisimId: string, benimId: number, benimAd: string, metin: string) {
    const mesajlarRef = collection(this.firestore, `iletisimler/${iletisimId}/mesajlar`);
    return addDoc(mesajlarRef, {
      gonderenId: benimId,
      gonderenAd: benimAd,
      metin: metin,
      tip: 'metin',
      tarih: new Date().toISOString()
    });
  }

  async dosyaGonder(iletisimId: string, benimId: number, benimAd: string, dosya: File) {
    // 1. Resmi Firebase Storage yerine kendi .NET API'mize yüklüyoruz!
    const formData = new FormData();
    formData.append('dosya', dosya);
    formData.append('iletisimId', iletisimId);

    // API'ye yollayıp C#'tan dönen güvenli URL'yi bekliyoruz
    const uploadRes: any = await firstValueFrom(
      this.http.post(`${this.baseUrl}/iletisim/chatdosyayukle`, formData)
    );

    // 2. .NET'ten dönen URL'yi Firestore'a (Chat veritabanına) yazıyoruz
    const mesajlarRef = collection(this.firestore, `iletisimler/${iletisimId}/mesajlar`);
    return addDoc(mesajlarRef, {
      gonderenId: benimId,
      gonderenAd: benimAd,
      metin: uploadRes.ad,
      dosyaUrl: uploadRes.url, // Artık uploads/chat/8/resim.jpg şeklinde geliyor
      dosyaTip: uploadRes.tip, 
      tip: 'dosya',
      tarih: new Date().toISOString()
    });
  }
}