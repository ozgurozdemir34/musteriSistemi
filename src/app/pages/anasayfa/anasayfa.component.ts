import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../auth.service';
import { MusteriService } from '../../core/services/musteri.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-anasayfa',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './anasayfa.component.html',
  styleUrls: ['./anasayfa.component.css']
})
export class AnasayfaComponent implements OnInit {
  @ViewChild('durumChart') durumChartCanvas!: ElementRef;
  @ViewChild('trafikChart') trafikChartCanvas!: ElementRef;

  kullaniciAdi = '';
  stats: any = null;

  constructor(
    private router: Router,
    private auth: AuthService,
    private service: MusteriService
  ) {}

  ngOnInit() {
    // Senin Token Okuma Mantığın
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(decodeURIComponent(escape(atob(token.split('.')[1]))));
        this.kullaniciAdi = payload.ad || payload.sub || '';
      } catch {}
    }
    this.istatistikGetir();
  }

  istatistikGetir() {
    this.service.dashboardStats().subscribe({
      next: (res) => {
        this.stats = res;
        // Grafikler için DOM'un render edilmesini bekle
        setTimeout(() => this.grafikleriOlustur(), 50);
      }
    });
  }

  grafikleriOlustur() {
    if (!this.stats || !this.durumChartCanvas) return;

    // Durum Dağılımı (Doughnut)
    new Chart(this.durumChartCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: this.stats.durumlar.map((d: any) => d.label),
        datasets: [{
          data: this.stats.durumlar.map((d: any) => d.value),
          backgroundColor: ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#6366f1'],
          borderWidth: 0
        }]
      },
      options: { 
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } } } 
      }
    });

    // Trafik Grafiği (Line)
    new Chart(this.trafikChartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: this.stats.trafik.map((t: any) => t.tarih),
        datasets: [{
          label: 'İşlem',
          data: this.stats.trafik.map((t: any) => t.adet),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: { 
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
      }
    });
  }

  musteriyeGit() { this.router.navigate(['/musteri']); }
  iletisimeGit() { this.router.navigate(['/iletisim']); }
  cikis() { this.auth.logout(); }
}