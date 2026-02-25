import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IletisimIslemGecmisiComponent } from './iletisim-islem-gecmisi.component';

describe('IletisimIslemGecmisiComponent', () => {
  let component: IletisimIslemGecmisiComponent;
  let fixture: ComponentFixture<IletisimIslemGecmisiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IletisimIslemGecmisiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IletisimIslemGecmisiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
