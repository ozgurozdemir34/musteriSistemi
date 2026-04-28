import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormArray,
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { NgxMaskDirective } from 'ngx-mask';
import { ChangeDetectorRef } from '@angular/core';
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
    MatProgressSpinnerModule,
    NgxMaskDirective
  ],
  templateUrl: './musteri-guncelle-dialog.component.html',
  styleUrls: ['./musteri-guncelle-dialog.component.css']
})
export class MusteriGuncelleDialogComponent implements OnInit {
  private adresApiUrl = 'https://api.tradres.com.tr/public/v1/catalog/providers/localsqlite/nodes';
  private adresApiKey = 'trd_live_BuLPt2BsbF8NWryAYNkGzJREpvgMnQGq';

  isYukleniyor = true; // Adres API sorguları bitene kadar form gizlenecek

  iller: any[] = [];
  ilcelerList: { [key: number]: any[] } = {};
  mahallelerList: { [key: number]: any[] } = {};
  sokaklarList: { [key: number]: any[] } = {};

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
    durum: [''],
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
    private dialog: MatDialog,
    private http: HttpClient
  ) {
    this.musteriId = data?.id ?? null;

    this.form.patchValue({
      ...data,
      durum: data.durum ?? data.Durum ?? 'Aktif'
    });

    data.telefon?.forEach((t: any) => this.telefonArray.push(this.telefonGroup(t)));
    data.mail?.forEach((m: any) => this.mailArray.push(this.mailGroup(m)));
  }

  async ngOnInit() {
    // String (Adana, Seyhan vs) gelen adreslerin ID'lerini API'den bularak formları dolduracağız.
    try {
      this.iller = await firstValueFrom(this.illeriGetir());

      if (this.data.adresler && this.data.adresler.length > 0) {
        for (let i = 0; i < this.data.adresler.length; i++) {
          const a = this.data.adresler[i];
          this.adresArray.push(this.adresGroup(a));
          
          if (!a.il) continue;

          // İl ID'sini bul
          const ilObj = this.iller.find(x => x.name.toUpperCase() === a.il.toUpperCase());
          if (ilObj) {
            this.adresArray.at(i).patchValue({ ilId: ilObj.id });
            this.adresArray.at(i).get('ilceId')?.enable();
            
            // İlçeleri yükle
            const ilceler = await firstValueFrom(this.ilceleriGetir(ilObj.id));
            this.ilcelerList[i] = ilceler;

            if (a.ilce) {
              const ilceObj = ilceler.find(x => x.name.toUpperCase() === a.ilce.toUpperCase());
              if (ilceObj) {
                this.adresArray.at(i).patchValue({ ilceId: ilceObj.id });
                this.adresArray.at(i).get('mahalleId')?.enable();

                // Mahalleleri yükle
                const mahalleler = await firstValueFrom(this.mahalleleriGetir(ilceObj.id));
                this.mahallelerList[i] = mahalleler;

                if (a.mahalle) {
                  const mObj = mahalleler.find(x => x.name.toUpperCase() === a.mahalle.toUpperCase());
                  if (mObj) {
                    this.adresArray.at(i).patchValue({ mahalleId: mObj.id });
                    this.adresArray.at(i).get('sokakId')?.enable();

                    // Sokakları yükle
                    const sokaklar = await firstValueFrom(this.sokaklariGetir(mObj.id));
                    this.sokaklarList[i] = sokaklar;

                    if (a.sokak) {
                      const sObj = sokaklar.find(x => x.name.toUpperCase() === a.sokak.toUpperCase());
                      if (sObj) this.adresArray.at(i).patchValue({ sokakId: sObj.id });
                    }
                  }
                }
              }
            }
          }
        }
      }
    } catch (err) {
      console.error("Adres API hatası:", err);
    } finally {
      this.isYukleniyor = false;
      this.cd.detectChanges();
    }
  }

  // --- API ÇAĞRILARI ---
  private adresHeaders() { return { headers: { 'X-Api-Key': this.adresApiKey } }; }
  illeriGetir() { return this.http.get<any[]>(`${this.adresApiUrl}?level=province&take=200`, this.adresHeaders()); }
  ilceleriGetir(ilId: number) { return this.http.get<any[]>(`${this.adresApiUrl}?level=town&parentId=${ilId}&take=200`, this.adresHeaders()); }
  mahalleleriGetir(ilceId: number) { return this.http.get<any[]>(`${this.adresApiUrl}?level=quarter&parentId=${ilceId}&take=200`, this.adresHeaders()); }
  sokaklariGetir(mahalleId: number) { return this.http.get<any[]>(`${this.adresApiUrl}?level=road&parentId=${mahalleId}&take=200`, this.adresHeaders()); }

  // --- FORM GROUP ÜRETİCİLERİ ---
  private telefonGroup(t?: any) {
    return this.fb.group({ id: [t?.id], numara: [t?.numara || '', Validators.required] });
  }

  private mailGroup(m?: any) {
    return this.fb.group({ id: [m?.id], email: [m?.email || '', [Validators.required, Validators.email]] });
  }

  private adresGroup(a?: any) {
    return this.fb.group({
      id: [a?.id],
      ilId: [null, Validators.required],
      il: [a?.il || ''],
      ilceId: [{ value: null, disabled: true }, Validators.required],
      ilce: [a?.ilce || ''],
      mahalleId: [{ value: null, disabled: true }, Validators.required],
      mahalle: [a?.mahalle || ''],
      sokakId: [{ value: null, disabled: true }, Validators.required],
      sokak: [a?.sokak || ''],
      acikAdres: [a?.acikAdres || '']
    });
  }

  get adresArray() { return this.form.get('adresler') as FormArray; }
  get telefonArray() { return this.form.get('telefon') as FormArray; }
  get mailArray() { return this.form.get('mail') as FormArray; }

  // --- ADRES SEÇİM OLAYLARI ---
  ilDegisti(ilId: number, index: number) {
    const ilName = this.iller.find(x => x.id === ilId)?.name || '';
    const group = this.adresArray.at(index);
    group.patchValue({ il: ilName, ilceId: null, ilce: '', mahalleId: null, mahalle: '', sokakId: null, sokak: '' });
    group.get('ilceId')?.enable();
    group.get('mahalleId')?.disable();
    group.get('sokakId')?.disable();
    
    this.ilcelerList[index] = [];
    this.mahallelerList[index] = [];
    this.sokaklarList[index] = [];

    this.ilceleriGetir(ilId).subscribe(res => this.ilcelerList[index] = res);
  }

  ilceDegisti(ilceId: number, index: number) {
    const ilceName = this.ilcelerList[index].find(x => x.id === ilceId)?.name || '';
    const group = this.adresArray.at(index);
    group.patchValue({ ilce: ilceName, mahalleId: null, mahalle: '', sokakId: null, sokak: '' });
    group.get('mahalleId')?.enable();
    group.get('sokakId')?.disable();

    this.mahallelerList[index] = [];
    this.sokaklarList[index] = [];

    this.mahalleleriGetir(ilceId).subscribe(res => this.mahallelerList[index] = res);
  }

  mahalleDegisti(mahalleId: number, index: number) {
    const mName = this.mahallelerList[index].find(x => x.id === mahalleId)?.name || '';
    const group = this.adresArray.at(index);
    group.patchValue({ mahalle: mName, sokakId: null, sokak: '' });
    group.get('sokakId')?.enable();

    this.sokaklarList[index] = [];
    this.sokaklariGetir(mahalleId).subscribe(res => this.sokaklarList[index] = res);
  }

  sokakDegisti(sokakId: number, index: number) {
    const sName = this.sokaklarList[index].find(x => x.id === sokakId)?.name || '';
    this.adresArray.at(index).patchValue({ sokak: sName });
  }

  // --- DİĞER FONKSİYONLAR ---
  iletisimGecmisiAc() {
    if (!this.musteriId) return;
    this.dialog.open(IletisimListeComponent, {
      width: '900px',
      maxHeight: '90vh',
      data: { musteriId: this.musteriId }
    });
  }

  onlyNumber(event: KeyboardEvent) {
    const charCode = event.charCode;
    if (charCode < 48 || charCode > 57) event.preventDefault();
  }

  adresEkle() {
    this.adresArray.push(this.adresGroup());
    this.ilcelerList[this.adresArray.length - 1] = [];
    this.mahallelerList[this.adresArray.length - 1] = [];
    this.sokaklarList[this.adresArray.length - 1] = [];
  }
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
        .filter((x: any) => x?.il?.trim())
        .map((x: any) => {
          const obj: any = { il: x.il, ilce: x.ilce, mahalle: x.mahalle, sokak: x.sokak, acikAdres: x.acikAdres };
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