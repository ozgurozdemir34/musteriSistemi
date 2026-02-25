import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { finalize } from 'rxjs';
import { AdminService } from '../../../core/services/admin.service';

type Group = { title: string; perms: string[] };

@Component({
  selector: 'app-yetki-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    FormsModule
  ],
  templateUrl: './yetki-dialog.component.html'
})
export class YetkiDialogComponent implements OnInit {

  loading = false;
  error: string | null = null;

  allPerms: string[] = [];
  selected = new Set<string>();

  groups: Group[] = [];

  // ⭐ Permission label map
  permLabels: Record<string, string> = {
    'musteri.read': 'Müşteri listeleme',
    'musteri.create': 'Müşteri oluşturma',
    'musteri.update': 'Müşteri güncelleme',

    'iletisim.read': 'İletişim listeleme',
    'iletisim.create': 'İletişim oluşturma',
    'iletisim.islem.read': 'İletişim işlem geçmişi görüntüleme',
    'iletisim.islem.create': 'İletişim işlem ekleme',

    'admin.user.read': 'Kullanıcı listeleme',
    'admin.user.create': 'Kullanıcı oluşturma',
    'admin.user.activate': 'Kullanıcı aktif/pasif',
    'admin.user.permissions': 'Kullanıcı yetki yönetimi'
  };

  // ⭐ Grup label map
  groupLabels: Record<string, string> = {
    musteri: 'Müşteri',
    iletisim: 'İletişim',
    admin: 'Admin'
  };

  constructor(
    private admin: AdminService,
    private ref: MatDialogRef<YetkiDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: any }
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.admin.permissionListe().subscribe({
      next: (list) => {
        this.allPerms = (list ?? []).map(x => x.key);
        this.buildGroups();

        this.admin.kullaniciPermissionGetir(this.data.user.id)
          .pipe(finalize(() => this.loading = false))
          .subscribe({
            next: (userPerms) => {
              (userPerms ?? []).forEach(p => this.selected.add(p));
            },
            error: () => this.error = 'Kullanıcı yetkileri alınamadı.'
          });
      },
      error: () => {
        this.loading = false;
        this.error = 'Permission listesi alınamadı.';
      }
    });
  }

  buildGroups() {
    const g: Record<string, string[]> = {};

    for (const p of this.allPerms) {
      const prefix = p.split('.')[0];
      if (!g[prefix]) g[prefix] = [];
      g[prefix].push(p);
    }

    this.groups = Object.keys(g)
      .sort()
      .map(k => ({
        title: this.groupLabels[k] || k,
        perms: g[k].sort()
      }));
  }

  toggle(p: string, checked: boolean) {
    if (checked) this.selected.add(p);
    else this.selected.delete(p);
  }

  isChecked(p: string) {
    return this.selected.has(p);
  }

  kaydet() {
    this.loading = true;
    this.error = null;

    const perms = Array.from(this.selected);

    this.admin.kullaniciPermissionKaydet(this.data.user.id, perms)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => this.ref.close(true),
        error: () => this.error = 'Kaydetme başarısız.'
      });
  }
}