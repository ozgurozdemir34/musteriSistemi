import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loading = false;

  form = this.fb.group({
    kullaniciadi: ['', Validators.required],
    sifre: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  login() {
  if (this.form.invalid) return;

  this.loading = true;

  this.http.post<any>('https://localhost:7213/login', this.form.value)
    .subscribe({
      next: res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));

        const user = res.user;

        if (user?.rol === 'Admin') {
          this.router.navigate(['/admin/kullanicilar']);
        } else {
          this.router.navigate(['/musteri']);
        }
      },
      error: () => {
        alert('Kullanıcı adı veya şifre yanlış');
        this.loading = false;
      }
    });
}
}
