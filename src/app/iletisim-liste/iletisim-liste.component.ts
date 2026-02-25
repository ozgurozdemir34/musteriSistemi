import { Component, OnInit, Inject, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { finalize } from 'rxjs';
import { MusteriService } from '../core/services/musteri.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IletisimIslemGecmisiComponent } from '../iletisim-islem-gecmisi/iletisim-islem-gecmisi.component';

@Component({
  selector: 'app-iletisim-liste',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    MatTableModule
  ],
  templateUrl: './iletisim-liste.component.html',
  styleUrls: ['./iletisim-liste.component.css']
})
export class IletisimListeComponent implements OnInit {

  iletisimler: any[] = [];
  seciliTur: string = '';
  seciliKategori: string = '';

 displayedColumns: string[] = [
  'musteri',
  'notBtn',
  'tarih',
  'islem'
];
  expandedElement: any | null = null;

  page = 1;
  totalCount = 0;
  pageSize = 20;
  musteriId: number | null = null;
  isDialog = false;
  loading = false;
  error: string | null = null;

  constructor(
    private service: MusteriService,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  notAcKapat(row: any) {
    this.expandedElement = this.expandedElement === row ? null : row;
  }

  ngOnInit() {
    if (this.data?.musteriId) {
      this.musteriId = this.data.musteriId;
      this.isDialog = true;
    }

    this.route.queryParams.subscribe(params => {
      if (!this.isDialog && params['musteriId']) {
        this.musteriId = params['musteriId'];
      }
      this.getir();
      this.service.dropdownAll().subscribe(res => {
  res.forEach((d:any) => {
    this.dropdownMap[d.key] = d.ad;
  });
});

    });
  }
yeniIslemNot: any = {};

islemEkle(i: any) {
  const body = {
    iletisimId: i.id,
    not: this.yeniIslemNot[i.id]
  };

  this.service.iletisimIslemEkle(body)
    .subscribe(() => {
      this.yeniIslemNot[i.id] = '';
      alert('İşlem eklendi');
    });
}
  getir() {
    const params: any = { page: this.page };

    if (this.seciliTur) params.tur = this.seciliTur;
    if (this.seciliKategori) params.kategori = this.seciliKategori;
    if (this.musteriId) params.musteriId = this.musteriId;

    this.loading = true;
    this.error = null;

    this.service.iletisimListeGetir(params)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (res) => {
          this.iletisimler = res?.data ?? [];
          this.totalCount = res?.totalCount ?? 0;
        },
        error: () => this.error = "İletişim listesi alınamadı."
      });
  }

  musteriyeGit(id: number) {
    this.router.navigate(['/musteri'], { queryParams: { musteriId: id } });
  }

  islemGecmisiDialogAc(i: any) {
    this.dialog.open(IletisimIslemGecmisiComponent, {
      width: '650px',
      data: { iletisimId: i.id, musteri: i.musteri }
    });
  }

  turDegisti() {
    if (!this.isDialog) {
      this.musteriId = null;
      this.router.navigate([], { queryParams: {} });
    }
    this.page = 1;
    this.getir();
  }

  kategoriDegisti() {
    if (!this.isDialog) {
      this.musteriId = null;
      this.router.navigate([], { queryParams: {} });
    }
    this.page = 1;
    this.getir();
  }

  oncekiSayfa() {
    if (this.page > 1) {
      this.page--;
      this.getir();
    }
  }

  sonrakiSayfa() {
    const toplamSayfa = Math.ceil(this.totalCount / this.pageSize);
    if (this.page < toplamSayfa) {
      this.page++;
      this.getir();
    }
  }
objectKeys = Object.keys;
dropdownMap: any = {};
  get toplamSayfa(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }
}