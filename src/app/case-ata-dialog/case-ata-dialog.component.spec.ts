import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseAtaDialogComponent } from './case-ata-dialog.component';

describe('CaseAtaDialogComponent', () => {
  let component: CaseAtaDialogComponent;
  let fixture: ComponentFixture<CaseAtaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseAtaDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CaseAtaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
