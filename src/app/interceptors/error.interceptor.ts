import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { NotificationService } from '../services/notification.service';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe( catchError((error: HttpErrorResponse) => {
    let message = 'An unexpected error occurred.';
    if (error.error) {

      if (typeof error.error === 'string') {
        message = error.error;
      } 
      else if (error.error.message) {
        message = error.error.message;
      } 
      
      else if (error.error.error) {
        message = error.error.error;
      }
      
      else if (error.error.details) {
        message = error.error.details;
      }
    }
    
    if (error.status === 0) {
      message = 'Unable to connect to the server.';
    }
    
    notificationService.showError(message);
    return throwError(() => new Error(message));
  
  })
);
};
