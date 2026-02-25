import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

 intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

  const token = localStorage.getItem('token');

  let cloned = req;

  if (token) {
    cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

return next.handle(cloned).pipe(
  catchError((error: HttpErrorResponse) => {

    if (error.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    if (error.status === 403) {
      alert('Bu işlem için yetkiniz yoktur');
    }

    return throwError(() => error);
  })
);
}

}
