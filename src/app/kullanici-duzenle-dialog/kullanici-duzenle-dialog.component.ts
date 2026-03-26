import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-kullanici-duzenle-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './kullanici-duzenle-dialog.component.html',
})
// kullanici-duzenle-dialog.component.ts

export class KullaniciDuzenleDialogComponent {
  sifre: string = '';
  sifreTekrar: string = ''; // Yeni: Şifre tekrarı için

  hideSifre: boolean = true; // Yeni: İlk şifre gizleme durumu
  hideSifreTekrar: boolean = true; // Yeni: Tekrar şifre gizleme durumu

  constructor(
    public dialogRef: MatDialogRef<KullaniciDuzenleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number; kullaniciadi: string }
  ) {}

  // Mevcut regex fonksiyonların (hasLetter, hasNumber vb.) aynı kalsın...

  hasLetter(): boolean { return /[A-Za-z]/.test(this.sifre); }
  hasNumber(): boolean { return /\d/.test(this.sifre); }
  hasSpecial(): boolean { return /[@$!%*?&.]/.test(this.sifre); }
  isLengthValid(): boolean { return this.sifre.length >= 8; }

  // Yeni: Şifreler eşleşiyor mu?
  doPasswordsMatch(): boolean {
    return this.sifre === this.sifreTekrar && this.sifre !== '';
  }

  // Güncellenmiş: "Güncelle" butonu için tüm kontroller + eşleşme
  isSifreGecerli(): boolean {
    return this.isLengthValid() && 
           this.hasLetter() && 
           this.hasNumber() && 
           this.hasSpecial() && 
           this.doPasswordsMatch();
  }

  kaydet(): void {
    if (this.isSifreGecerli()) {
      this.dialogRef.close({ sifre: this.sifre });
    }
  }
}