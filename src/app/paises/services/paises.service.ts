import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { PaisSmall, Borders } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private _baseUrl: string = "https://restcountries.com/v3.1";
  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regiones() {
    return [...this._regiones];
  }

  constructor
  (
    private http: HttpClient
  ) { }

  getCountrieByRegion(region: string): Observable<PaisSmall[]> {
    const url: string = `${this._baseUrl}/region/${region}?fields=name,cca3`;
    return this.http.get<PaisSmall[]>(url);
  }

  getBordersByCode(code: string): Observable<Borders> {

    if (!code) return of();
    const url: string = `${this._baseUrl}/alpha/${code}?fields=borders`;
    return this.http.get<Borders>(url);
  }
  
  getCountryByCode(code: string): Observable<PaisSmall> {
    const url: string = `${this._baseUrl}/alpha/${code}?fields=name,cca3`;
    return this.http.get<PaisSmall>(url);    
  }

  getCountriesByBorders(borders: string[]): Observable<PaisSmall[]> {
    
    const requests: Observable<PaisSmall>[] = []
    borders.forEach( cca3 => {
      const request = this.getCountryByCode(cca3);
      requests.push(request);
    });
    return combineLatest(requests);
  }
}
