import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KullaniciDuzenleDialogComponent } from './kullanici-duzenle-dialog.component';

describe('KullaniciDuzenleDialogComponent', () => {
  let component: KullaniciDuzenleDialogComponent;
  let fixture: ComponentFixture<KullaniciDuzenleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KullaniciDuzenleDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KullaniciDuzenleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
