import { Injectable } from '@angular/core';
import { ConnectorService } from '@core/services/connector/connector.service';
import { environment } from '@environments/environment';
import { TResultApi } from '@modules/search/models/result-api.type';
import { Observable, EMPTY } from 'rxjs';
import {
  map,
  expand,
  delay,
  scan,
} from 'rxjs/operators';
import { BackendService } from '@core/interceptors/queue/backend.interceptor';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  public stopRequestQueue: boolean = false;

  private apiUrl = environment.apiUrl;

  constructor(private _connectorService: ConnectorService) {}

  getAllResources(): Observable<Object> {
    return this._connectorService.mGet(this.apiUrl)
    .pipe(
      map((data: any) => {
        return Object.entries(data).map(([key]) => {
          return key
        });
      })
    )
  }

  getDataFromApi(url: string = ''): Observable<any> {

    if (!url) {
      url = this.apiUrl;
    }

    return this._connectorService.mGet(url);
  }

  search(name: string, type: string): Observable<any> {
    let url = this.apiUrl;

    switch (type) {
      case 'characters':
        url += 'character/';
        break;
      case 'episodes':
        url += 'episode/';
        break;
      case 'locations':
        url += 'location/';
        break;

      default:
        break;
    }

    return this.processResults(this.getDataFromApi(url)).pipe(
      map((response: TResultApi[]) => {
        return response.filter((item: any) => {
          return item.name.toLowerCase().includes(name.toLowerCase());
        });
      })
    );
  }

  processResults(results: Observable<any>) {
    return results.pipe(
      expand((data: any) => {
        if(this.stopRequestQueue){
          return EMPTY;
        }

        return data['info'].next
          ? this.getDataFromApi(data['info'].next).pipe(delay(1000))
          : EMPTY;
      }),
      scan((accumulator: any, data: any) => {
        return [...accumulator, ...data.results];
      }, []),
    );
  }

  getEpisodeCharacter(episodes: string[]): string {
    return episodes[Math.floor(Math.random() * episodes.length)];
  }
}
