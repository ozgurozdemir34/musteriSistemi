import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailGecmisDialogComponent } from './mail-gecmis-dialog.component';

describe('MailGecmisDialogComponent', () => {
  let component: MailGecmisDialogComponent;
  let fixture: ComponentFixture<MailGecmisDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MailGecmisDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MailGecmisDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
