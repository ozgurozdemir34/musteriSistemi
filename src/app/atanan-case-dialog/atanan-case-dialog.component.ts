import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MusteriService } from '../core/services/musteri.service';

@Component({
  selector: 'app-atanan-case-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatTableModule,
    MatButtonModule
  ],
  templateUrl: './atanan-case-dialog.component.html'
})
export class AtananCaseDialogComponent implements OnInit {

  caseler: any[] = [];
  loading = false;

  constructor(
    private service: MusteriService,
    public dialogRef: MatDialogRef<AtananCaseDialogComponent>
  ) {}

  ngOnInit() {
    this.loading = true;
    this.service.atananCaseGetir().subscribe(res => {
      this.caseler = res;
      this.loading = false;
    });
  }

  tamamla(id: number) {
    this.service.caseTamamla(id).subscribe(() => {
      this.caseler = this.caseler.filter(x => x.id !== id);
    });
  }
}