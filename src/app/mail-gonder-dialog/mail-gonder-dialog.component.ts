import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-mail-gonder-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './mail-gonder-dialog.component.html',
  // CSS olarak musteri-dialog ile aynı class'ları kullandığım için ekstra CSS yazmana gerek yok.
})
export class MailGonderDialogComponent {
  
  form = this.fb.group({
    mail: [null], // Birden fazla mail varsa seçilen
    konu: ['', Validators.required],
    icerik: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<MailGonderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Eğer müşterinin 1'den fazla maili varsa, ilkini varsayılan olarak seç
    if (data.mailler?.length > 1) {
      this.form.patchValue({ mail: data.mailler[0].email });
    }
  }

  gonder() {
    if (this.form.invalid) return;

    // Backend'deki MailGonderDto ile birebir aynı yapıyı kuruyoruz
    const payload = {
      musteriId: this.data.musteriId,
      mail: this.form.value.mail, // Null olsa bile backend ilk maili alacak şekilde ayarlanmış, süper.
      konu: this.form.value.konu,
      icerik: this.form.value.icerik
    };

    this.dialogRef.close(payload);
  }
}