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
import { ChatService } from '../core/services/chat.service';
import { Observable } from 'rxjs';

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
  displayedColumns: string[] = ['musteri', 'notBtn', 'tarih'];
  displayedColumnsWithExpand: string[] = [...this.displayedColumns, 'expandedDetail'];
  expandedElement: any | null = null;
  chatMesajlari: { [key: number]: Observable<any[]> } = {};
  yeniChatMesaj: { [key: number]: string } = {};
  benimId: number = 0;
  benimAd: string = '';
  page = 1;
  totalCount = 0;
  pageSize = 20;
  loading = false;
  error: string | null = null;

  yeniIslemNot: any = {};
  islemYukleniyor: any = {};
  dosyaYukleniyor: any = {};
  chatDosyaYukleniyor: { [key: number]: boolean } = {};

  aiLoading: any = {};
  aiResult: any = {};
  oncekiMesajSayisi: { [key: number]: number } = {};

  hedefIletisimId: number | null = null;

  dropdownMap: any = {};
  objectKeys = Object.keys;

  baseUrl = 'https://localhost:7213';

  constructor(
    private service: MusteriService,
    private router: Router,
    private dialog: MatDialog,
    private chatService: ChatService,
    private route: ActivatedRoute,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.kullaniciBilgileriniCek();

    if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission();
    }

    this.route.queryParams.subscribe(params => {
      const hedefId = params['hedefId'] ? +params['hedefId'] : null;
      this.getir(() => {
        if (hedefId) {
          this.iletisimeGit(hedefId);
        }
      });
    });

    this.service.dropdownAll().subscribe(res => {
      res.forEach((d: any) => {
        this.dropdownMap[d.key] = d.ad;
      });
    });
  }

  kullaniciBilgileriniCek() {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        this.benimId = user.id || 0;
        this.benimAd = (user.ad && user.soyad) ? (user.ad + ' ' + user.soyad) : 'Gizemli Kullanıcı';
      }
    } catch (e) {
      console.error(e);
    }
  }

  getir(callback?: () => void) {
    this.loading = true;
    this.error = null;
    this.chatMesajlari = {};
    this.oncekiMesajSayisi = {};
    this.service.iletisimListeGetir({ page: this.page })
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (res) => {
          this.iletisimler = res?.data ?? [];
          this.totalCount = res?.totalCount ?? 0;
          this.tumIletisimleriDinle();
          if (callback) callback();
        },
        error: () => this.error = 'Liste alınamadı'
      });
  }

  tumIletisimleriDinle() {
    this.iletisimler.forEach(row => {
      const id = row.id || row.iletisimId;
      if (!id || this.chatMesajlari[id]) return;

      const mesajlar$ = this.chatService.mesajlariGetir(id.toString());
      this.chatMesajlari[id] = mesajlar$;

      mesajlar$.subscribe({
        next: (data) => {
          const guncelSayi = data.length;
          const eskiSayi = this.oncekiMesajSayisi[id] ?? -1;

          if (eskiSayi === -1) {
            this.oncekiMesajSayisi[id] = guncelSayi;
            return;
          }

          if (guncelSayi > eskiSayi) {
            const sonMesaj = data[guncelSayi - 1];
            if (sonMesaj.gonderenId !== this.benimId) {
              const bildirimMetin = sonMesaj.tip === 'dosya' ? `📎 ${sonMesaj.metin}` : sonMesaj.metin;
              this.bildirimGonder(sonMesaj.gonderenAd, bildirimMetin, id);
            }
          }

          this.oncekiMesajSayisi[id] = guncelSayi;
        },
        error: (err) => console.error(err)
      });
    });
  }

  notAcKapat(row: any) {
    this.expandedElement = this.expandedElement === row ? null : row;
  }

  bildirimGonder(kimden: string, metin: string, iletisimId: number) {
    if (!("Notification" in window)) return;

    if (Notification.permission === "granted") {
      const bildirim = new Notification(`Yeni Mesaj: ${kimden}`, {
        body: metin
      });

      bildirim.onclick = () => {
        window.focus();
        bildirim.close();
        this.router.navigate(['/iletisim'], { queryParams: { hedefId: iletisimId } });
      };
    }
  }

  iletisimeGit(iletisimId: number) {
    const mevcutSayfada = this.iletisimler.find(i => (i.id || i.iletisimId) === iletisimId);

    if (mevcutSayfada) {
      this.satiriAcVeScrollEt(mevcutSayfada, iletisimId);
      return;
    }

    this.dogruSayfayiBul(iletisimId, 1);
  }

  private dogruSayfayiBul(iletisimId: number, arananSayfa: number) {
    if (arananSayfa > this.toplamSayfa) return;

    this.service.iletisimListeGetir({ page: arananSayfa }).subscribe({
      next: (res) => {
        const liste = res?.data ?? [];
        const bulunan = liste.find((i: any) => (i.id || i.iletisimId) === iletisimId);

        if (bulunan) {
          this.page = arananSayfa;
          this.getir(() => {
            const hedef = this.iletisimler.find(i => (i.id || i.iletisimId) === iletisimId);
            if (hedef) this.satiriAcVeScrollEt(hedef, iletisimId);
          });
        } else {
          this.dogruSayfayiBul(iletisimId, arananSayfa + 1);
        }
      },
      error: () => console.error(`Sayfa ${arananSayfa} aranamadı`)
    });
  }

  private satiriAcVeScrollEt(row: any, iletisimId: number) {
    if (this.expandedElement !== row) {
      this.notAcKapat(row);
    }

    setTimeout(() => {
      const element = document.getElementById(`satir-${iletisimId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 350);
  }

  chatGonder(row: any) {
    const id = row.id || row.iletisimId;
    const metin = this.yeniChatMesaj[id]?.trim();
    if (!metin) return;
    this.chatService.mesajGonder(id.toString(), this.benimId, this.benimAd, metin);
    this.yeniChatMesaj[id] = '';
  }

  async chatDosyaSec(event: any, row: any) {
    const dosya: File = event.target.files[0];
    if (!dosya) return;

    const id = row.id || row.iletisimId;
    this.chatDosyaYukleniyor[id] = true;

    try {
      await this.chatService.dosyaGonder(id.toString(), this.benimId, this.benimAd, dosya);
    } catch (e) {
      alert('Dosya gönderilemedi');
      console.error(e);
    } finally {
      this.chatDosyaYukleniyor[id] = false;
      event.target.value = '';
    }
  }

  islemEkle(i: any) {
    const not = this.yeniIslemNot[i.id]?.trim();
    if (!not) return;

    const body = { iletisimId: i.id, not };
    this.islemYukleniyor[i.id] = true;

    this.service.iletisimIslemEkle(body)
      .pipe(finalize(() => this.islemYukleniyor[i.id] = false))
      .subscribe({
        next: () => { this.yeniIslemNot[i.id] = ''; },
        error: () => alert('İşlem eklenemedi')
      });
  }

  dosyaSec(event: any, i: any) {
    const dosya: File = event.target.files[0];
    if (!dosya) return;

    const izinli = ['image/jpeg', 'image/png'];
    if (!izinli.includes(dosya.type)) {
      alert('Sadece jpg ve png dosyası yüklenebilir.');
      return;
    }

    this.dosyaYukleniyor[i.id] = true;
    this.service.iletisimDosyaYukle(i.id, dosya)
      .pipe(finalize(() => this.dosyaYukleniyor[i.id] = false))
      .subscribe({
        next: (res) => {
          if (!i.dosyalar) i.dosyalar = [];
          i.dosyalar.push(res);
        },
        error: () => alert('Görsel yüklenemedi')
      });
  }

  async aiAnalizYap(dosya: any) {
    this.aiLoading[dosya.id] = true;
    this.aiResult[dosya.id] = null;

    try {
      const sonuc = await this.service.kayitliResmiAnalizEt(dosya.id);
      let formatliMetin = sonuc.analiz.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      formatliMetin = formatliMetin.replace(/\n/g, '<br/>');
      this.aiResult[dosya.id] = formatliMetin;
    } catch (error) {
      console.error(error);
      this.aiResult[dosya.id] = "Analiz sırasında bir hata oluştu.";
    } finally {
      this.aiLoading[dosya.id] = false;
    }
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