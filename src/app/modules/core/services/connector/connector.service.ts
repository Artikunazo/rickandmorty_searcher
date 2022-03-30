import { Injectable } from '@angular/core';
import {
  HttpClient,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConnectorService {
  constructor(private _http: HttpClient) {}

  mGet(url: string): Observable<Object> {
    return this._http.get(url);
  }

  
}
