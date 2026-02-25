import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminKullaniciComponent } from './admin-kullanici.component';

describe('AdminKullaniciComponent', () => {
  let component: AdminKullaniciComponent;
  let fixture: ComponentFixture<AdminKullaniciComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminKullaniciComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminKullaniciComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
