import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MusteriService } from '../core/services/musteri.service';

@Component({
  selector: 'app-iletisim-islem-gecmisi-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule
  ],
  template: `
    <h2 mat-dialog-title>İşlem Geçmişi</h2>

    <mat-dialog-content style="min-width:500px; max-height:500px; overflow:auto;">

      <div style="margin-bottom:12px; color:gray;">
        {{ data?.musteri }}
      </div>

      <!-- Loading -->
      <div *ngIf="loading">
        Yükleniyor...
      </div>

      <!-- Boş -->
      <div *ngIf="!loading && islemler.length === 0">
        Henüz işlem eklenmemiş.
      </div>

      <!-- Liste -->
      <div *ngFor="let x of islemler"
           style="margin-bottom:12px;
                  padding:12px;
                  background:#f5f5f5;
                  border-radius:8px;
                  border-left:4px solid #3f51b5;">

        <div>
          {{ x.not }}
        </div>

        <div style="font-size:12px;
                    color:gray;
                    margin-top:6px;">
          {{ x.islemYapan }} -
          {{ x.tarih | date:'dd.MM.yyyy HH:mm' }}
        </div>

      </div>

    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-stroked-button mat-dialog-close>
        Kapat
      </button>
    </mat-dialog-actions>
  `
})
export class IletisimIslemGecmisiComponent implements OnInit {

  loading = false;
  islemler: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: MusteriService
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.service
      .iletisimIslemGecmisiGetir(this.data.iletisimId)
      .subscribe({
        next: (res) => {
          this.islemler = res ?? [];
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.islemler = [];
        }
      });
  }
}
