import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusteriGuncelleDialogComponent } from './musteri-guncelle-dialog.component';

describe('MusteriGuncelleDialogComponent', () => {
  let component: MusteriGuncelleDialogComponent;
  let fixture: ComponentFixture<MusteriGuncelleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MusteriGuncelleDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MusteriGuncelleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
