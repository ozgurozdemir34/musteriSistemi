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
    ReactiveFormsModule
  ],
  templateUrl: './iletisim-ekle-dialog.component.html',
  styleUrls: ['./iletisim-ekle-dialog.component.css']
})
export class IletisimEkleDialogComponent implements OnInit {

  iletisimForm!: FormGroup;
  dropdownlar: any[] = [];

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
    });
  }

  kaydet() {
    if (this.iletisimForm.invalid) return;

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
      next: () => {
        this.dialogRef.close(true);
      },
      error: () => alert('İletişim eklenemedi')
    });
  }
}