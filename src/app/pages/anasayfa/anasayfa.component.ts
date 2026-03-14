import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-anasayfa',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './anasayfa.component.html',
  styleUrls: ['./anasayfa.component.css']
})
export class AnasayfaComponent implements OnInit {

  kullaniciAdi = '';

  constructor(
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit() {
    // AuthService'den kullanıcı adını al
    // Token'dan okuyorsan aşağıdaki gibi yapabilirsin:
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.kullaniciAdi = payload.ad || payload.sub || '';
      } catch {}
    }
  }

  musteriyeGit() {
    this.router.navigate(['/musteri']);
  }

  iletisimeGit() {
    this.router.navigate(['/iletisim']);
  }

  cikis() {
    this.auth.logout();
  }
}