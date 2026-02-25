import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KullaniciEkleDialogComponent } from './kullanici-ekle-dialog.component';

describe('KullaniciEkleDialogComponent', () => {
  let component: KullaniciEkleDialogComponent;
  let fixture: ComponentFixture<KullaniciEkleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KullaniciEkleDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KullaniciEkleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
