import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YetkiDialogComponent } from './yetki-dialog.component';

describe('YetkiDialogComponent', () => {
  let component: YetkiDialogComponent;
  let fixture: ComponentFixture<YetkiDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YetkiDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(YetkiDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
