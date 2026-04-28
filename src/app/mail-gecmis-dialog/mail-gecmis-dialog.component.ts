import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MusteriService } from '../core/services/musteri.service';

@Component({
  selector: 'app-mail-gecmis-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    MatDialogModule, 
    MatButtonModule, 
    MatIconModule, 
    MatProgressSpinnerModule
  ],
  templateUrl: './mail-gecmis-dialog.component.html',
})
export class MailGecmisDialogComponent implements OnInit {
  mailler: any[] = [];
  loading = true;
  error = '';

  constructor(
    public dialogRef: MatDialogRef<MailGecmisDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private musteriService: MusteriService
  ) {}

  ngOnInit() {
    this.musteriService.getGonderilenMailler(this.data.musteriId).subscribe({
      next: (res) => {
        this.mailler = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Mail geçmişi yüklenirken sunucu ile iletişim kurulamadı.';
        this.loading = false;
      }
    });
  }
}