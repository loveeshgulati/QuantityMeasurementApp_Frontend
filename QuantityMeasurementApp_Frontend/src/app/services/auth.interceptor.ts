import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();
  console.log('Interceptor called for:', req.url);
  console.log('Token present:', !!token);
  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    console.log('Added Authorization header');
  }
  return next(req);
};
