import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { loginKontrolGuard } from './login-kontrol.guard';

describe('loginKontrolGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => loginKontrolGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
