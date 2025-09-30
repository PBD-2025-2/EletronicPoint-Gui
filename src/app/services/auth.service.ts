import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment'
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth/api/v1`;
  
  constructor(private httpCliente: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<any> {
    return this.httpCliente.post<{token: string}>(`${this.apiUrl}/login`, { username, password}).pipe(
      tap((response: {token: string}) => {
        sessionStorage.setItem('accessToken', btoa(JSON.stringify(response['token'])))
      })
    )
  }
}
