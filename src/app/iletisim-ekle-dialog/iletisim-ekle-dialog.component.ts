import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MusteriService } from '../core/services/musteri.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-iletisim-ekle-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './iletisim-ekle-dialog.component.html',
  styleUrls: ['./iletisim-ekle-dialog.component.css']
})
export class IletisimEkleDialogComponent implements OnInit {

  iletisimForm!: FormGroup;
  dropdownlar: any[] = [];
  secilenDosya: File | null = null;
  dosyaYukleniyor = false;

  constructor(
    public dialogRef: MatDialogRef<IletisimEkleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { musteriId: number; musteriAd: string },
    private fb: FormBuilder,
    private service: MusteriService
  ) {}

  ngOnInit() {
    this.service.dropdownAll().subscribe(res => {
      this.dropdownlar = res;

      const group: any = {};
      res.forEach((d: any) => {
        group[d.key] = ['', Validators.required];
      });
      group['not'] = ['', Validators.required];

      this.iletisimForm = this.fb.group(group);
      this.iletisimForm.updateValueAndValidity();
    });
  }

  dosyaSecildi(event: any) {
    const dosya: File = event.target.files[0];
    if (!dosya) return;

    const izinli = ['image/jpeg', 'image/png'];
    if (!izinli.includes(dosya.type)) {
      alert('Sadece jpg ve png dosyası yüklenebilir.');
      event.target.value = '';
      return;
    }

    this.secilenDosya = dosya;
  }

  kaydet() {
    if (!this.iletisimForm || this.iletisimForm.invalid) return;

    const formValue = this.iletisimForm.value;
    const alanlar: any = {};

    Object.keys(formValue).forEach(key => {
      if (key !== 'not') alanlar[key] = formValue[key];
    });

    const body = {
      musteriId: this.data.musteriId,
      not: formValue.not,
      alanlar
    };

    this.service.iletisimEkle(body).subscribe({
      next: (iletisimRes) => {
        if (this.secilenDosya) {
          this.dosyaYukleniyor = true;
          this.service.iletisimDosyaYukle(iletisimRes.id, this.secilenDosya).subscribe({
            next: (dosyaRes) => {
              console.log('yüklenen dosya yolu:', dosyaRes.dosyaYolu);
              this.dosyaYukleniyor = false;
              this.dialogRef.close(true);
            },
            error: () => {
              this.dosyaYukleniyor = false;
              alert('İletişim eklendi fakat görsel yüklenemedi.');
              this.dialogRef.close(true);
            }
          });
        } else {
          this.dialogRef.close(true);
        }
      },
      error: () => alert('İletişim eklenemedi')
    });
  }
}