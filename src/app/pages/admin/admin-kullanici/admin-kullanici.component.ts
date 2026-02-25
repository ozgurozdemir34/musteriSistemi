import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AdminService, KullaniciRow } from '../../../core/services/admin.service';
import { finalize } from 'rxjs';
import { YetkiDialogComponent } from '../yetki-dialog/yetki-dialog.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { KullaniciEkleDialogComponent } from '../../../kullanici-ekle-dialog/kullanici-ekle-dialog.component';

@Component({
  selector: 'app-admin-kullanici',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './admin-kullanici.component.html'
})
export class AdminKullaniciComponent implements OnInit {

  loading = false;
  error: string | null = null;

  users: KullaniciRow[] = [];
  displayedColumns: string[] = ['kullaniciadi', 'adsoyad', 'rol', 'aktif', 'islem'];

  dropdownTipler: any[] = [];
  secenekler: any[] = [];
  seciliTipId: number | null = null;

  yeniSecenek = '';
  yeniTip = '';

  duzenlenenSecenekId: number | null = null;
  duzenlenenAd = '';

  constructor(public admin: AdminService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getir();
    this.tipleriGetir();
  }

  getir() {
    this.loading = true;
    this.error = null;

    this.admin.kullaniciListe()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (list) => this.users = list ?? [],
        error: () => this.error = 'Kullanıcılar alınamadı.'
      });
  }

  tipleriGetir() {
    this.admin.dropdownTipListe()
      .subscribe(res => this.dropdownTipler = res);
  }

  tipEkle() {
    const ad = this.yeniTip.trim();
    if (!ad) return;

    this.admin.dropdownTipEkle({
      key: ad.toLowerCase().replace(/\s+/g, '_'),
      ad: ad
    })
    .subscribe(() => {
      this.yeniTip = '';
      this.tipleriGetir();
    });
  }

  tipSecildi(id: number) {
    this.seciliTipId = id;
    this.admin.dropdownSecenekListe(id)
      .subscribe(res => this.secenekler = res);
  }

  secenekSil(id: number) {
    if (!this.seciliTipId) return;

    this.loading = true;

    this.admin.dropdownSecenekSil(id)
      .pipe(finalize(() => this.loading = false))
      .subscribe(() => this.tipSecildi(this.seciliTipId!));
  }

  secenekEkle() {
    const ad = this.yeniSecenek.trim();
    if (!this.seciliTipId || !ad) return;

    this.admin.dropdownSecenekEkle({
      dropdownTipId: this.seciliTipId,
      ad: ad,
      aktif: true
    })
    .subscribe(() => {
      this.yeniSecenek = '';
      this.tipSecildi(this.seciliTipId!);
    });
  }

  secenekDuzenle(s: any) {
    this.duzenlenenSecenekId = s.id;
    this.duzenlenenAd = s.ad;
  }

  secenekDuzenIptal() {
    this.duzenlenenSecenekId = null;
    this.duzenlenenAd = '';
  }

  secenekGuncelle(s: any) {
    const ad = this.duzenlenenAd.trim();
    if (!ad) return;

    this.admin.dropdownSecenekGuncelle(s.id, {
      id: s.id,
      dropdownTipId: this.seciliTipId,
      ad: ad,
      aktif: true
    })
    .subscribe(() => {
      this.duzenlenenSecenekId = null;
      this.duzenlenenAd = '';
      this.tipSecildi(this.seciliTipId!);
    });
  }

  aktifPasifDegistir(u: KullaniciRow) {
    this.loading = true;
    const req = u.aktif ? this.admin.pasifYap(u.id) : this.admin.aktifYap(u.id);

    req.pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => this.getir(),
        error: () => this.error = 'İşlem başarısız.'
      });
  }

  yetkilerAc(u: KullaniciRow) {
    this.dialog.open(YetkiDialogComponent, {
      width: '700px',
      data: { user: u }
    }).afterClosed().subscribe((changed) => {
      if (changed) this.getir();
    });
  }

  get tipSecili(): boolean {
    return this.seciliTipId !== null;
  }

  secenekAktifPasif(s: any) {

  this.admin.dropdownSecenekGuncelle(s.id, {
    id: s.id,
    dropdownTipId: this.seciliTipId,
    ad: s.ad,
    aktif: !s.aktif
  })
  .subscribe(() => this.tipSecildi(this.seciliTipId!));
}
kullaniciEkleAc() {
  this.dialog.open(KullaniciEkleDialogComponent, {
    width: '450px'
  }).afterClosed().subscribe(changed => {
    if (changed) this.getir();
  });
}
tipAktifDegistir(t: any) {
  const req = t.aktif
    ? this.admin.dropdownTipPasif(t.id)
    : this.admin.dropdownTipAktif(t.id);

  req.subscribe(() => this.tipleriGetir());
}

}