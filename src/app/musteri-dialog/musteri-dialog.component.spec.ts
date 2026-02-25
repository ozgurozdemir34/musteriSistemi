import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusteriDialogComponent } from './musteri-dialog.component';

describe('MusteriDialogComponent', () => {
  let component: MusteriDialogComponent;
  let fixture: ComponentFixture<MusteriDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MusteriDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MusteriDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
