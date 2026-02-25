import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AdminService } from '../core/services/admin.service';

@Component({
  selector: 'app-kullanici-ekle-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  template: `
    <h2 mat-dialog-title>Yeni Kullanıcı</h2>

    <mat-dialog-content
      [formGroup]="form"
      style="display:flex; flex-direction:column; gap:10px; margin-top:10px;">

      <mat-form-field appearance="outline">
        <mat-label>Kullanıcı adı</mat-label>
        <input matInput formControlName="kullaniciadi">
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Şifre</mat-label>
        <input matInput type="password" formControlName="sifre">
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Ad</mat-label>
        <input matInput formControlName="ad">
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Soyad</mat-label>
        <input matInput formControlName="soyad">
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Rol</mat-label>
        <mat-select formControlName="rol">
          <mat-option value="admin">Admin</mat-option>
          <mat-option value="kullanici">Kullanıcı</mat-option>
        </mat-select>
      </mat-form-field>

    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-stroked-button mat-dialog-close>İptal</button>

      <button mat-raised-button
              color="primary"
              (click)="kaydet()"
              [disabled]="form.invalid">
        Kaydet
      </button>
    </mat-dialog-actions>
  `
})
export class KullaniciEkleDialogComponent {

  form = this.fb.group({
    kullaniciadi: ['', Validators.required],
    sifre: ['', Validators.required],
    ad: ['', Validators.required],
    soyad: ['', Validators.required],
    rol: ['kullanici', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private admin: AdminService,
    private dialogRef: MatDialogRef<KullaniciEkleDialogComponent>
  ) {}

  kaydet() {
    if (this.form.invalid) return;

    this.admin.kullaniciEkle(this.form.value as any)
      .subscribe(() => this.dialogRef.close(true));
  }
}