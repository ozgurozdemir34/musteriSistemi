import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IletisimEkleDialogComponent } from './iletisim-ekle-dialog.component';

describe('IletisimEkleDialogComponent', () => {
  let component: IletisimEkleDialogComponent;
  let fixture: ComponentFixture<IletisimEkleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IletisimEkleDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IletisimEkleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
