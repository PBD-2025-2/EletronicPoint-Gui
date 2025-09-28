import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, defaultIfEmpty, filter, first, noop, Observable } from 'rxjs';
import { of, concat } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Company {
  id: number;
  name: string;
  cnpj: string;
}

@Injectable({
  providedIn: 'root'
})

export class CompanyService {
  private apiUrl = 'http://localhost:8181/api/v1/companies';

  constructor(private http: HttpClient) {}

  getCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(this.apiUrl);
  }



searchCompanies(term: string): Observable<Company[]> {
  const encodedTerm = encodeURIComponent(term.trim());
  const urlByName = `${this.apiUrl}/name/${encodedTerm}`;
  const urlByCnpj = `${this.apiUrl}/cnpj/${encodedTerm}`;
  const urlById   = `${this.apiUrl}/id/${encodedTerm}`;

  const safeGet = (url: string) =>
    this.http.get<Company[]>(url).pipe(catchError(() => of([])));

  const safeGetId = (url: string) =>
    this.http.get<Company>(url).pipe(
      map(c => c ? [c] : []),
      catchError(() => of([]))
  );

  const requests = [
    safeGet(urlByName),
    safeGet(urlByCnpj),
    safeGetId(urlById)
  ];

  return concat(...requests).pipe(
    filter(arr => Array.isArray(arr) && arr.length > 0), 
    first(),
    defaultIfEmpty([]) 
  );
}

  addCompany(company: Omit<Company, 'id'>): Observable<Company> {
    return this.http.post<Company>(this.apiUrl, company);
  } 

   getCompanyByName(name: string): Observable<Company> {
    const encoded = encodeURIComponent(name.trim());

    return this.http.get<Company[]>(`${this.apiUrl}/name/${encoded}`).pipe(map(arr => arr[0]));
  }
}
