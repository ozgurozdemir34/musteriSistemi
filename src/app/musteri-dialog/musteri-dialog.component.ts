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
  
  template: `
  <h2 mat-dialog-title>Müşteri Ekle</h2>

  <mat-dialog-content style="max-height:75vh; overflow:auto;">
    <form [formGroup]="form">

      
      <mat-form-field appearance="outline" style="width:100%">
        <mat-label>Ad</mat-label>
        <input matInput formControlName="ad">
        <mat-error *ngIf="form.get('ad')?.invalid">Zorunlu alan</mat-error>
      </mat-form-field>

      
      <mat-form-field appearance="outline" style="width:100%">
        <mat-label>Soyad</mat-label>
        <input matInput formControlName="soyad">
        <mat-error *ngIf="form.get('soyad')?.invalid">Zorunlu alan</mat-error>
      </mat-form-field>

    
      <mat-form-field appearance="outline" style="width:100%">
        <mat-label>TC Kimlik Numarası</mat-label>
        <input matInput
               maxlength="11"
               inputmode="numeric"
               (keypress)="onlyNumber($event)"
               formControlName="kimlikNumarasi">

        <mat-error *ngIf="form.get('kimlikNumarasi')?.hasError('required')">
          TC Kimlik zorunlu
        </mat-error>
        <mat-error *ngIf="form.get('kimlikNumarasi')?.hasError('pattern')">
          Sadece sayı giriniz
        </mat-error>
        <mat-error *ngIf="form.get('kimlikNumarasi')?.hasError('minlength')">
          11 haneli olmalıdır
        </mat-error>
        <mat-error *ngIf="form.get('kimlikNumarasi')?.hasError('maxlength')">
          En fazla 11 hane olabilir
        </mat-error>
      </mat-form-field>

      
      <mat-form-field appearance="outline" style="width:100%">
        <mat-label>Çalıştığı Yer</mat-label>
        <input matInput formControlName="calistigiYer">
      </mat-form-field>

    
      <mat-form-field appearance="outline" style="width:100%">
        <mat-label>Cinsiyet</mat-label>
        <mat-select formControlName="cinsiyet">
          <mat-option value="Erkek">Erkek</mat-option>
          <mat-option value="Kadın">Kadın</mat-option>
          <mat-option value="Diğer">Diğer</mat-option>
        </mat-select>
      </mat-form-field>

      
      <mat-form-field appearance="outline" style="width:100%">
        <mat-label>Durum</mat-label>
        <mat-select formControlName="durum">
          <mat-option value="Aktif">Aktif</mat-option>
          <mat-option value="Pasif">Pasif</mat-option>
        </mat-select>
      </mat-form-field>

    
      <mat-form-field appearance="outline" style="width:100%">
        <mat-label>Not</mat-label>
        <textarea matInput rows="3" formControlName="not"></textarea>
      </mat-form-field>

      <hr>

      <h3>Adresler</h3>
      <div formArrayName="adresler">
        <div *ngFor="let a of adresArray.controls; let i=index"
             [formGroupName]="i"
             style="display:flex; gap:8px; align-items:flex-start;">

          <mat-form-field appearance="outline" style="flex:1;">
            <mat-label>Adres</mat-label>
            <input matInput formControlName="adres">
          </mat-form-field>

          <button mat-icon-button color="warn" type="button" (click)="adresSil(i)">✖</button>
        </div>
      </div>

      <button mat-stroked-button type="button" (click)="adresEkle()">
        + Adres Ekle
      </button>

      <hr>

     
      <h3>Telefonlar</h3>
      <div formArrayName="telefon">
        <div *ngFor="let t of telefonArray.controls; let i=index"
             [formGroupName]="i"
             style="display:flex; gap:8px; align-items:flex-start;">

          <mat-form-field appearance="outline" style="flex:1;">
            <mat-label>Telefon</mat-label>
            <input matInput mask="(000) 000 00 00" formControlName="numara">
            <mat-error *ngIf="t.get('numara')?.hasError('required')">Zorunlu</mat-error>
          </mat-form-field>


          <button mat-icon-button color="warn" type="button" (click)="telefonSil(i)">✖</button>
        </div>
      </div>

      <button mat-stroked-button type="button" (click)="telefonEkle()">
        + Telefon Ekle
      </button>

      <hr>

      
      <h3>Mailler</h3>
      <div formArrayName="mail">
        <div *ngFor="let m of mailArray.controls; let i=index"
             [formGroupName]="i"
             style="display:flex; gap:8px; align-items:flex-start;">

          <mat-form-field appearance="outline" style="flex:1;">
            <mat-label>Mail</mat-label>
            <input matInput type="email" formControlName="email">
            <mat-error *ngIf="m.get('email')?.hasError('required')">Zorunlu</mat-error>
            <mat-error *ngIf="m.get('email')?.hasError('email')">Geçerli email giriniz</mat-error>
          </mat-form-field>


          <button mat-icon-button color="warn" type="button" (click)="mailSil(i)">✖</button>
        </div>
      </div>

      <button mat-stroked-button type="button" (click)="mailEkle()">
        + Mail Ekle
      </button>

    </form>
  </mat-dialog-content>

  <mat-dialog-actions align="end">
    <button mat-button (click)="dialogRef.close()">İptal</button>
    <button mat-raised-button color="primary"
            [disabled]="form.invalid"
            (click)="kaydet()">
      Kaydet
    </button>
  </mat-dialog-actions>
  `
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
