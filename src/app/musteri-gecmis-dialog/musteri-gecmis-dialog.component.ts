import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-musteri-gecmis-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    FormsModule
  ],
  template: `
    <h2 mat-dialog-title>Güncelleme Geçmişi</h2>

    <mat-dialog-content>

      <mat-form-field appearance="outline" style="width:260px;">
        <mat-label>Alan Seç</mat-label>
        <mat-select [(ngModel)]="seciliAlan">
          <mat-option *ngFor="let alan of alanlar" [value]="alan.value">
            {{ alan.label }}
          </mat-option>
        </mat-select>
      </mat-form-field>

      <div *ngIf="filtrelenmisLoglar().length === 0" style="margin-top:12px;">
        Bu alan için kayıt bulunamadı.
      </div>

      <div *ngFor="let log of filtrelenmisLoglar()"
           style="padding:8px 0; border-bottom:1px solid #eee; margin-top:8px;">

        <div style="font-weight:500;">
          {{ log.deger }}
        </div>

        <div style="color:gray; font-size:12px;">
          {{ log.guncellemeTarih | date:'dd.MM.yyyy HH:mm' }}-
          {{log.islemYapan}}
        </div>
         
        
         


      </div>

    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Kapat</button>
    </mat-dialog-actions>
  `
})
export class MusteriGecmisDialogComponent {

  
  alanlar = [
    { value: 'Ad', label: 'Ad' },
    { value: 'Soyad', label: 'Soyad' },
    { value: 'KimlikNumarasi', label: 'TC Kimlik No' },
    { value: 'CalistigiYer', label: 'Çalıştığı Yer' },
    { value: 'Cinsiyet', label: 'Cinsiyet' },
    { value: 'Not', label: 'Not' },
    { value: 'Durum', label: 'Durum' },
    { value: 'Telefon', label: 'Telefonlar' },
    { value: 'Mail', label: 'Mailler' },
    { value: 'Adres', label: 'Adresler' }
  ];

  seciliAlan = 'Ad';

  constructor(@Inject(MAT_DIALOG_DATA) public logs: any[]) {}

  filtrelenmisLoglar() {
    return this.logs
      .filter(l => l.alanAdi === this.seciliAlan)
      .sort((a, b) =>
        new Date(b.guncellemeTarih).getTime() -
        new Date(a.guncellemeTarih).getTime()
      );
  }
}
