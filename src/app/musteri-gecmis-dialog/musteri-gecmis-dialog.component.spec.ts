import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusteriGecmisDialogComponent } from './musteri-gecmis-dialog.component';

describe('MusteriGecmisDialogComponent', () => {
  let component: MusteriGecmisDialogComponent;
  let fixture: ComponentFixture<MusteriGecmisDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MusteriGecmisDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MusteriGecmisDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
