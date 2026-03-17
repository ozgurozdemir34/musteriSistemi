import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { MusteriService } from './musteri.service';

@Injectable({ providedIn: 'root' })
export class RaporService {

  constructor(private musteriService: MusteriService) {}

  musteriExcel(data: any) {
    // Önce dropdownları çek, sonra excel oluştur
    this.musteriService.dropdownAll().subscribe(dropdownlar => {
      const dropdownMap: any = {};
      dropdownlar.forEach((d: any) => {
        dropdownMap[d.key] = d.ad;
      });
      this.olustur(data, dropdownMap);
    });
  }

  private olustur(data: any, dropdownMap: any) {
    const wb = XLSX.utils.book_new();
    const rows: any[][] = [];

    rows.push(['MÜŞTERİ BİLGİLERİ']);
    rows.push(['Ad Soyad', `${data.musteri.ad} ${data.musteri.soyad}`]);
    rows.push(['TC Kimlik', data.musteri.kimlikNumarasi || '-']);
    rows.push(['Cinsiyet', data.musteri.cinsiyet || '-']);
    rows.push(['Çalıştığı Yer', data.musteri.calistigiYer || '-']);
    rows.push(['Durum', data.musteri.durum]);
    rows.push(['Kayıt Tarihi', new Date(data.musteri.tarih).toLocaleDateString('tr-TR')]);
    rows.push(['Not', data.musteri.not || '-']);
    rows.push([]);

    rows.push(['TELEFON / MAİL / ADRES']);
    rows.push(['Telefonlar', (data.musteri.telefonlar || []).join(', ') || '-']);
    rows.push(['E-postalar', (data.musteri.mailler || []).join(', ') || '-']);
    rows.push(['Adresler', (data.musteri.adresler || []).join(' | ') || '-']);
    rows.push([]);

    rows.push(['İLETİŞİM GEÇMİŞİ']);
    rows.push(['Tarih', 'Ekleyen', 'Not', 'Alanlar', 'İşlem Notları']);

    for (const i of data.iletisimler) {
      const alanlarStr = i.alanlar
        ? Object.entries(i.alanlar)
            .map(([k, v]) => `${dropdownMap[k] || k}: ${v}`)
            .join(', ')
        : '-';

      const islemNotlari = (i.islemGecmisi || [])
        .map((g: any) => `[${new Date(g.tarih).toLocaleDateString('tr-TR')}] ${g.islemYapan}: ${g.not}`)
        .join('\n') || '-';

      rows.push([
        new Date(i.tarih).toLocaleDateString('tr-TR'),
        i.islemYapan,
        i.not || '-',
        alanlarStr,
        islemNotlari
      ]);
    }

    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [
      { wch: 20 }, { wch: 30 }, { wch: 40 }, { wch: 40 }, { wch: 50 }
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Rapor');
    XLSX.writeFile(wb, `${data.musteri.ad}_${data.musteri.soyad}_rapor.xlsx`);
  }
}