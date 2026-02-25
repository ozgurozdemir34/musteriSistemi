import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MusteriService } from '../../../core/services/musteri.service';
import { Musteri } from '../../../models/musteri';
import { MusteriDialogComponent } from '../../../musteri-dialog/musteri-dialog.component';
import { MusteriGuncelleDialogComponent } from '../../../musteri-guncelle-dialog/musteri-guncelle-dialog.component';
import { NgxMaskDirective } from 'ngx-mask';
import { MusteriGecmisDialogComponent } from '../../../musteri-gecmis-dialog/musteri-gecmis-dialog.component';
import { AuthService } from '../../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-musteri-liste',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    NgxMaskDirective
  ],
   
  templateUrl: './musteri-liste.component.html',
  styleUrls: ['./musteri-liste.component.css']
})
export class MusteriListeComponent implements OnInit {

  
  tumMusteriler: Musteri[] = [];   
  musteriler: Musteri[] = [];      
  turler: any[] = [];
kategoriler: any[] = [];
yollar: any[] = [];

  aramaForm!: FormGroup;

  listeGoster = false;
  aramaYapildi = false;

  displayedColumns: string[] = [
    'ad',
    'soyad',
    'durum',
    'tarih',
    'detay'
  ];

  expandedElement: Musteri | null = null;
  iletisimAcikMusteriId: number | null = null;
   iletisimForm!: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private musteriService: MusteriService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private auth: AuthService,
     private router: Router

  ) {}
dropdownlar: any[] = [];
 ngOnInit(): void {

  this.aramaForm = this.fb.group({
    ad: [''],
    soyad: [''],
    telefon: [''],
    durum: ['Aktif', Validators.required],
    mail: ['']
  });
this.iletisimForm = this.fb.group({
  tur: ['', Validators.required],
  kategori: ['', Validators.required], 
  iletisimYolu: ['', Validators.required],
  not: ['', Validators.required]


  
});


 this.musteriService.dropdownAll().subscribe(res => {
  this.dropdownlar = res;

  
  const group: any = {};

  res.forEach((d:any) => {
    group[d.key] = ['', Validators.required];
  });

  group['not'] = ['', Validators.required];

  this.iletisimForm = this.fb.group(group);
});
this.route.queryParams.subscribe(params => {

  const id = params['musteriId'];

  if (!id) return;

  this.loading = true;

  this.musteriService.ara({
    page: 1,
    musteriId: id
  })
  .pipe(finalize(() => this.loading = false))
  .subscribe({
    next: (res) => {
      this.musteriler = res.data ?? [];
      this.totalCount = res.totalCount ?? 0;
      this.listeGoster = true;
      this.aramaYapildi = true;
      this.expandedElement = this.musteriler.length ? this.musteriler[0] : null;
    },
    error: () => {
      this.error = 'Müşteri getirilemedi.';
    }
  });

});

  
}




iletisimListesineGit() {
  this.router.navigate(['/iletisim']);
}
iletisimGecmisiGit(musteri: any) {
  this.router.navigate(['/iletisim'], {
    queryParams: { musteriId: musteri.id }
  });
}

iletisimFormAc(musteri: any) {
  this.iletisimAcikMusteriId =
    this.iletisimAcikMusteriId === musteri.id ? null : musteri.id;

  this.iletisimForm.reset();
}

iletisimKaydet(musteri: any) {

  if (this.iletisimForm.invalid) return;

  const formValue = this.iletisimForm.value;

  // ⭐ dynamic alanlar üret
  const alanlar: any = {};

  Object.keys(formValue).forEach(key => {
    if (key !== 'not') {
      alanlar[key] = formValue[key];
    }
  });

  const body = {
    musteriId: musteri.id,
    not: formValue.not,
    alanlar: alanlar
  };

  this.musteriService.iletisimEkle(body)
    .subscribe({
      next: () => {
        alert("İletişim eklendi.");
        this.iletisimForm.reset();
        this.iletisimAcikMusteriId = null;
      }
    });
}

cikis() {
  this.auth.logout();
}

iletisimDialogAc(musteri: any) {
  const tur = prompt("Tür (Iade, Tesekkur, Bilgi, Sikayet):");
  if (!tur) return;

  const yol = prompt("İletişim Yolu (Telefon, Mail):");
  if (!yol) return;

  const not = prompt("Not:");
  if (!not) return;

 const body = {
  musteriId: musteri.id,
  tur: tur,
  kategori: this.iletisimForm.value.kategori,
  iletisimYolu: yol,
  not: not
};


  this.musteriService.iletisimEkle(body).subscribe({
    next: () => {
      alert("İletişim eklendi.");
      this.ara(); 
    }
  });
}


page = 1;
pageSize = 20;
totalCount = 0;

 ara(): void {
  const { ad, soyad, telefon, durum, mail } = this.aramaForm.value;

    const params: any = {
    page: this.page
  };

  if (ad) params.ad = ad;
  if (soyad) params.soyad = soyad;
  if (telefon) params.telefon = telefon;
  if (mail) params.mail = mail;
  if (durum) params.durum = durum;

  
  if (Object.keys(params).length === 0) {
    this.musteriler = [];
     this.listeGoster = true;     
     this.aramaYapildi = true;    
    return;
  }

  this.loading = true;

  this.musteriService.ara(params)
    .pipe(finalize(() => this.loading = false))
    .subscribe({
      next: (data) => {
        this.musteriler = data.data ?? [];
        this.totalCount = data.totalCount ?? 0;
         this.listeGoster = true;     
         this.aramaYapildi = true;
         this.expandedElement = null;    
      },
      error: () => {
        this.error = 'Liste alınamadı.';
      }
    });
}

 


gecmisDialogAc(musteri: any) {
  this.dialog.open(MusteriGecmisDialogComponent, {
    width: '700px',
    data: musteri.guncellemeGecmisi
  });
}

  temizle(): void {
    this.aramaForm.reset({
      ad: '',
      soyad: '',
      durum: 'Aktif',
      mail :''
    });

    this.listeGoster = false;
    this.aramaYapildi = false;
    this.musteriler = [];
    this.expandedElement = null;
  }


get toplamSayfa(): number {
  return Math.ceil(this.totalCount / this.pageSize);
}

  oncekiSayfa() {
  if (this.page > 1) {
    this.page--;
    this.ara();
  }
}

sonrakiSayfa() {
  if (this.page < this.toplamSayfa) {
    this.page++;
    this.ara();
  }
}
  dialogAc(): void {
  const ref = this.dialog.open(MusteriDialogComponent, {
    width: '650px',
    maxHeight: '90vh'
  });

  ref.afterClosed().subscribe(result => {
    if (!result) return;

    const tcVarMi = this.tumMusteriler.some(m =>
      m.kimlikNumarasi === result.kimlikNumarasi
    );

    if (tcVarMi) {
      alert('Böyle bir TC zaten kayıtlı');
      return;
    }

    for (let tel of result.telefon ?? []) {
      const telefonVarMi = this.tumMusteriler.some(m =>
        m.telefon?.some((t: any) => t.numara === tel.numara)
      );

      if (telefonVarMi) {
        alert(`${tel.numara} numarası zaten kayıtlı`);
        return;
      }
    }

    this.musteriService.musteriEkle(result).subscribe({
      next: () => {
       
        this.temizle();
      }
    });
  });
}


  guncelleDialogAc(m: any) {
  const ref = this.dialog.open(MusteriGuncelleDialogComponent, {
    width: '650px',
    data: m
  });

  ref.afterClosed().subscribe(result => {
    if (!result) return;

   
    const tcVarMi = this.tumMusteriler.some(x =>
      x.kimlikNumarasi === result.kimlikNumarasi &&
      x.id !== m.id
    );

    if (tcVarMi) {
      alert('Böyle bir TC zaten kayıtlı');
      return;
    }

  
    for (let tel of result.telefon ?? []) {
      const telefonVarMi = this.tumMusteriler.some(x =>
        x.id !== m.id &&
        x.telefon?.some((t: any) => t.numara === tel.numara)
      );

      if (telefonVarMi) {
        alert(`${tel.numara} numarası zaten kayıtlı`);
        return;
      }
    }

    this.musteriService.musteriGuncelle(m.id, result).subscribe({
      next: () => {
        
        this.temizle();
      }
    });
  });
}


  detayGetir(m: Musteri): void {
    this.expandedElement = this.expandedElement === m ? null : m;
  }
}
