import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormArray,
  AbstractControl
} from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
  MatDialog
} from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

import { NgxMaskDirective } from 'ngx-mask';
import { ChangeDetectorRef } from '@angular/core';

// ✅ İletişim listesi dialog olarak açılacak
import { IletisimListeComponent } from '../iletisim-liste/iletisim-liste.component';

@Component({
  selector: 'app-musteri-guncelle-dialog',
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
  templateUrl: './musteri-guncelle-dialog.component.html',
  styleUrls: ['./musteri-guncelle-dialog.component.css']
})
export class MusteriGuncelleDialogComponent implements OnInit {

  form = this.fb.group({
    id: [],
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

  private musteriId: number | null = null;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<MusteriGuncelleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private cd: ChangeDetectorRef,
    private dialog: MatDialog
  ) {
    this.form.patchValue(data);
    this.musteriId = data?.id ?? null;

    data.adresler?.forEach((a: any) =>
      this.adresArray.push(this.adresGroup(a))
    );

    data.telefon?.forEach((t: any) =>
      this.telefonArray.push(this.telefonGroup(t))
    );

    data.mail?.forEach((m: any) =>
      this.mailArray.push(this.mailGroup(m))
    );
  }

  ngOnInit() {
    this.cd.detectChanges();
  }

  iletisimGecmisiAc() {
    if (!this.musteriId) return;

    this.dialog.open(IletisimListeComponent, {
      width: '900px',
      maxHeight: '90vh',
      data: { musteriId: this.musteriId }
    });
  }

  private matchValidator(a: string, b: string) {
    return (group: AbstractControl) => {
      const c1 = group.get(a);
      const c2 = group.get(b);
      if (!c1 || !c2) return null;
      c2.setErrors(c1.value !== c2.value ? { mismatch: true } : null);
      return null;
    };
  }

  private telefonGroup(t?: any) {
    return this.fb.group({
      id: [t?.id],
      numara: [t?.numara || '', Validators.required]
    });
  }

  private adresGroup(a?: any) {
    return this.fb.group({
      id: [a?.id],
      adres: [a?.adres || '', Validators.required]
    });
  }

  private mailGroup(m?: any) {
    return this.fb.group({
      id: [m?.id],
      email: [m?.email || '', [Validators.required, Validators.email]]
    });
  }

  get adresArray() { return this.form.get('adresler') as FormArray; }
  get telefonArray() { return this.form.get('telefon') as FormArray; }
  get mailArray() { return this.form.get('mail') as FormArray; }

  onlyNumber(event: KeyboardEvent) {
    const charCode = event.charCode;
    if (charCode < 48 || charCode > 57) event.preventDefault();
  }

  adresEkle() { this.adresArray.push(this.adresGroup()); }
  adresSil(i: number) { this.adresArray.removeAt(i); }

  telefonEkle() { this.telefonArray.push(this.telefonGroup()); }
  telefonSil(i: number) { this.telefonArray.removeAt(i); }

  mailEkle() { this.mailArray.push(this.mailGroup()); }
  mailSil(i: number) { this.mailArray.removeAt(i); }

  guncelle() {
    if (this.form.invalid) return;

    const onay = window.confirm('Müşteri bilgilerini güncellemek istediğinize emin misiniz?');
    if (!onay) return;

    const raw = this.form.value;

    const payload = {
      ...raw,
      adresler: (raw.adresler ?? [])
        .filter((x: any) => x?.adres?.trim())
        .map((x: any) => {
          const obj: any = { adres: x.adres };
          if (x.id !== null && x.id !== undefined) obj.id = x.id;
          return obj;
        }),

      telefon: (raw.telefon ?? []).map((x: any) => {
        const obj: any = { numara: x.numara };
        if (x.id !== null && x.id !== undefined) obj.id = x.id;
        return obj;
      }),

      mail: (raw.mail ?? []).map((x: any) => {
        const obj: any = { email: x.email };
        if (x.id !== null && x.id !== undefined) obj.id = x.id;
        return obj;
      })
    };

    this.dialogRef.close(payload);
  }
}