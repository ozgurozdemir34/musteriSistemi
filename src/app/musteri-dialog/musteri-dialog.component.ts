import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormArray,
  AbstractControl
} from '@angular/forms';

import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-musteri-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    NgxMaskDirective
  ],
   templateUrl: './musteri-dialog.component.html',
  styleUrls: ['./musteri-dialog.component.css']
  
 
})
export class MusteriDialogComponent {
  form = this.fb.group({
    ad: ['', Validators.required],
    soyad: ['', Validators.required],
    kimlikNumarasi: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[0-9]*$/),
        Validators.minLength(11),
        Validators.maxLength(11)
      ]
    ],
    calistigiYer: [''],
    cinsiyet: [''],
    durum: ['Aktif'],
    not: [''],
    adresler: this.fb.array([]),
    telefon: this.fb.array([]),
    mail: this.fb.array([])
  });

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<MusteriDialogComponent>) {}

  private matchValidator(a: string, b: string) {
    return (group: AbstractControl) => {
      const c1 = group.get(a);
      const c2 = group.get(b);
      if (!c1 || !c2) return null;
      c2.setErrors(c1.value !== c2.value ? { mismatch: true } : null);
      return null;
    };
  }

  private telefonGroup() {
    return this.fb.group(
      { numara: ['', Validators.required] },
      
    );
  }

  private mailGroup() {
  return this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });
}
private adresGroup() {
  return this.fb.group({
    adres: ['', Validators.required]
  });
}


  get adresArray() { return this.form.get('adresler') as FormArray; }
  get telefonArray() { return this.form.get('telefon') as FormArray; }
  get mailArray() { return this.form.get('mail') as FormArray; }

  onlyNumber(event: KeyboardEvent) {
    const charCode = event.charCode;
    if (charCode < 48 || charCode > 57) event.preventDefault();
  }

  adresEkle() {
  this.adresArray.push(this.adresGroup());}

  adresSil(i: number) { this.adresArray.removeAt(i); }

  telefonEkle() { this.telefonArray.push(this.telefonGroup()); }
  telefonSil(i: number) { this.telefonArray.removeAt(i); }

  mailEkle() { this.mailArray.push(this.mailGroup()); }
  mailSil(i: number) { this.mailArray.removeAt(i); }

  kaydet() {
    if (this.form.invalid) return;

    const onay = window.confirm('Yeni müşteri eklemek istediğinize emin misiniz?');
    if (!onay) return;

    const raw = this.form.value;

    const payload = {
      ...raw,
      not: raw.not?.trim() || null,
      adresler: (raw.adresler ?? []).filter((x: any) => x?.adres?.trim()),
     telefon: (raw.telefon ?? []).map((x: any) => {
  const obj: any = { numara: x.numara };
  if (x.id !== null && x.id !== undefined) {
    obj.id = x.id;
  }
  return obj;
}), 
   mail: (raw.mail ?? []).map((x: any) => {
  const obj: any = { email: x.email };
  if (x.id !== null && x.id !== undefined) {
    obj.id = x.id;
  }
  return obj;
}),

    };

    this.dialogRef.close(payload);
  }
}
