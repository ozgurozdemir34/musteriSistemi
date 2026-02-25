import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IletisimListeComponent } from './iletisim-liste.component';

describe('IletisimListeComponent', () => {
  let component: IletisimListeComponent;
  let fixture: ComponentFixture<IletisimListeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IletisimListeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IletisimListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
