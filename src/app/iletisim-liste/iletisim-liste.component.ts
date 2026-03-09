import { Component, OnInit, Inject, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';
import { MusteriService } from '../core/services/musteri.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IletisimIslemGecmisiComponent } from '../iletisim-islem-gecmisi/iletisim-islem-gecmisi.component';
import { AtananCaseDialogComponent } from '../atanan-case-dialog/atanan-case-dialog.component';
import { CaseAtaDialogComponent } from '../case-ata-dialog/case-ata-dialog.component';

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
    MatTableModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './iletisim-liste.component.html',
  styleUrls: ['./iletisim-liste.component.css']
})
export class IletisimListeComponent implements OnInit {

  iletisimler: any[] = [];
  // Header row'da expandedDetail OLMAMALI — sadece data ve detail row'da olacak
  displayedColumns: string[] = ['musteri', 'notBtn', 'tarih'];
  displayedColumnsWithExpand: string[] = [...this.displayedColumns, 'expandedDetail'];
  expandedElement: any | null = null;

  page = 1;
  totalCount = 0;
  pageSize = 20;
  loading = false;
  error: string | null = null;

  yeniIslemNot: any = {};
  islemYukleniyor: any = {};
  dropdownMap: any = {};
  objectKeys = Object.keys;

  constructor(
    private service: MusteriService,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.getir();
    this.service.dropdownAll().subscribe(res => {
      res.forEach((d: any) => {
        this.dropdownMap[d.key] = d.ad;
      });
    });
  }

  getir() {
    this.loading = true;
    this.error = null;
    this.service.iletisimListeGetir({ page: this.page })
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (res) => {
          this.iletisimler = res?.data ?? [];
          this.totalCount = res?.totalCount ?? 0;
        },
        error: () => this.error = 'Liste alınamadı'
      });
  }

  notAcKapat(row: any) {
    this.expandedElement = this.expandedElement === row ? null : row;
  }

  islemEkle(i: any) {
    const not = this.yeniIslemNot[i.id]?.trim();
    if (!not) return;

    const body = { iletisimId: i.id, not };
    this.islemYukleniyor[i.id] = true;

    this.service.iletisimIslemEkle(body)
      .pipe(finalize(() => this.islemYukleniyor[i.id] = false))
      .subscribe({
        next: () => {
          this.yeniIslemNot[i.id] = '';
        },
        error: () => alert('İşlem eklenemedi')
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

  caseAta(i: any) {
    this.dialog.open(CaseAtaDialogComponent, {
      width: '500px',
      data: { iletisimId: i.id, musteriId: i.musteriId }
    });
  }

  atananCaseleriAc() {
    this.dialog.open(AtananCaseDialogComponent, { width: '800px' });
  }

  oncekiSayfa() {
    if (this.page > 1) { this.page--; this.getir(); }
  }

  sonrakiSayfa() {
    if (this.page < this.toplamSayfa) { this.page++; this.getir(); }
  }

  get toplamSayfa(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  alanlarBosMu(alanlar: any): boolean {
    return !alanlar || this.objectKeys(alanlar).length === 0;
  }
}