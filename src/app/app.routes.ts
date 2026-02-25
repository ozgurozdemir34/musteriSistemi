import { Routes } from '@angular/router';
import { MusteriListeComponent } from './pages/musteri/musteri-liste/musteri-liste.component';
import { LoginComponent } from './pages/login/login.component';
import { IletisimListeComponent } from './iletisim-liste/iletisim-liste.component';
import { loginKontrol } from './auth/login-kontrol.guard';
import { AdminKullaniciComponent } from './pages/admin/admin-kullanici/admin-kullanici.component';
import { adminGuard } from './auth/admin.guard';


export const routes: Routes = [

  { path: 'login', component: LoginComponent },

  {
    path: 'musteri',
    component: MusteriListeComponent,
    canActivate: [loginKontrol]
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },

 
  
  {
  path: 'iletisim',
  component: IletisimListeComponent,
  canActivate:[loginKontrol]
},


{
  path: 'admin/kullanicilar',
  component: AdminKullaniciComponent,
  canActivate: [loginKontrol, adminGuard]
},
 { path: '**', redirectTo: 'login' }


];