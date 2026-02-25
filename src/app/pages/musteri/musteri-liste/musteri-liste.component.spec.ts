import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusteriListeComponent } from './musteri-liste.component';

describe('MusteriListeComponent', () => {
  let component: MusteriListeComponent;
  let fixture: ComponentFixture<MusteriListeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MusteriListeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MusteriListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
