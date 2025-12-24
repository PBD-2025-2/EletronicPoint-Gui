import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError} from 'rxjs/operators';
import { Observable, throwError} from 'rxjs';
import { environment } from '../environments/environment';

export interface Company {
  id: number;
  name: string;
  cnpj?: string;
}

export interface Sector {
  name: string;
  companyId: number;
}

@Injectable({
  providedIn: 'root'
})

export class CompanyService {
  private apiUrl = `${environment.apiUrl}/eletronicPoint/api/v1/companies`;
  private apirUrlSectors = `${environment.apiUrl}/eletronicPoint/api/v1/sectors`;

  constructor(private http: HttpClient) { }

  getCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(this.apiUrl);
  }

  searchCompanies(term: string): Observable<Company[]> {
    const trimmed = term.trim();

    // Input with only numbers
    if (/^\d+$/.test(trimmed)) {

      // Search by CNPJ
      if (trimmed.length === 14) {
        return this.http.get<Company[]>(`${this.apiUrl}/cnpj/${trimmed}`).pipe(
          catchError(err => throwError(() => err)));
      }

      // Search by ID
      return this.http.get<Company>(`${this.apiUrl}/id/${trimmed}`).pipe(
        map(c => c ? [c] : [])
      );
    }

    // Search by name
    return this.http.get<Company[]>(`${this.apiUrl}/name/${encodeURIComponent(trimmed)}`).pipe(
      catchError(err => throwError(() => err)));
  }

  getCompanyByName(name: string): Observable<Company> {
    if (!name) {
      return throwError(() => new Error('Company name is required'));
    }

    const encoded = encodeURIComponent(name.trim());

    return this.http.get<any>(`${this.apiUrl}/name/${encoded}`).pipe(
      map(res => {
        if (!res) throw new Error("Company not found");

        const arr = Array.isArray(res) ? res : [res];

        if (arr.length === 0) {
          throw new Error("Company not found");
        }

        const company = arr[0];
        if (!company.id) {
          throw new Error("Company record doesn't have id");
        }
        return company as Company;
      }),
      catchError(err => throwError(() => err))
    );
  }

  addCompany(company: Omit<Company, 'id'>): Observable<Company> {
    return this.http.post<Company>(this.apiUrl, company);
  }

  updateCompany(company: Company): Observable<Company> {
    return this.http.put<Company>(`${this.apiUrl}/${company.id}`, company);
  }

  deleteCompany(id: number): Observable<Company> {
    return this.http.delete<Company>(`${this.apiUrl}/${id}`);
  }

  addCompanySector(sector: Sector): Observable<Sector> {
    return this.http.post<Sector>(this.apirUrlSectors, sector);
  }
}
