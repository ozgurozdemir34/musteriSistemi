import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MusteriService } from '../core/services/musteri.service';

@Component({
  selector: 'app-case-ata-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './case-ata-dialog.component.html'
})
export class CaseAtaDialogComponent implements OnInit {

  form!: FormGroup;
  kullanicilar: any[] = [];

  constructor(
    private fb: FormBuilder,
    private service: MusteriService,
    public dialogRef: MatDialogRef<CaseAtaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      atananId: ['', Validators.required],
      not: ['', Validators.required]
    });

    this.service.kullanicilariGetir()
      .subscribe(res => this.kullanicilar = res);
  }

  kaydet() {
    if (this.form.invalid) return;

    const body = {
      iletisimId: this.data.iletisimId,
      musteriId: this.data.musteriId,
      atananId: this.form.value.atananId,
      not: this.form.value.not
    };

    this.service.caseOlustur(body)
      .subscribe(() => {
        alert("Case atandı");
        this.dialogRef.close();
      });
  }
}