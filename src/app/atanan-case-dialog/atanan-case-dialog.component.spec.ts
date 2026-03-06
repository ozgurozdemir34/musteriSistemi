import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtananCaseDialogComponent } from './atanan-case-dialog.component';

describe('AtananCaseDialogComponent', () => {
  let component: AtananCaseDialogComponent;
  let fixture: ComponentFixture<AtananCaseDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtananCaseDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AtananCaseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
