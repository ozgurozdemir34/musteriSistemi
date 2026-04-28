import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailGonderDialogComponent } from './mail-gonder-dialog.component';

describe('MailGonderDialogComponent', () => {
  let component: MailGonderDialogComponent;
  let fixture: ComponentFixture<MailGonderDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MailGonderDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MailGonderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
