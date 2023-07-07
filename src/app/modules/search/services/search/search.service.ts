import { Injectable } from '@angular/core';
import { ConnectorService } from '@core/services/connector/connector.service';
import { environment } from '@environments/environment';
import { TResultApi } from '@modules/search/models/result-api.type';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

enum typeSearch {
  CHARACTERS = 'characters',
  EPISODES = 'episodes',
  LOCATIONS = 'locations',
}

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  public results$ = new Subject<any>();

  private apiUrl = environment.apiUrl;

  constructor(private _connectorService: ConnectorService) {}

  getAllResources(): Observable<Object> {
    return this._connectorService.mGet(this.apiUrl).pipe(
      map((data: any) => {
        return Object.entries(data).map(([key]) => {
          return key;
        });
      })
    );
  }

  getDataFromApi(url: string = ''): Observable<any> {
    if (!url) {
      url = this.apiUrl;
    }

    return this._connectorService.mGet(url);
  }

  search() {
    const name = this.getSessionStorage('name');
    const type = this.getSessionStorage('type');
    this.searchInApi(name, type);
  }

  searchInApi(name: string, type: string) {
    let url = this.apiUrl;

    if (type === typeSearch.CHARACTERS) url += 'character/';
    if (type === typeSearch.EPISODES) url += 'episodes/';
    if (type === typeSearch.LOCATIONS) url += 'locations/';

    this.getDataFromApi(url).subscribe({
      next: (results) => this.results$.next(results)
    });
  }

  // processResults(results: Observable<any>) {
  //   return results.pipe(
  //     expand((data: any) => {

  //       if(this.stopRequestsQueue){
  //         return EMPTY;
  //       }

  //       return data['info'].next
  //         ? this.getDataFromApi(data['info'].next).pipe(delay(1000))
  //         : EMPTY;
  //     }),
  //     scan((accumulator: any, data: any) => {
  //       return [...accumulator, ...data.results];
  //     }, []),
  //   );
  // }

  getEpisodeCharacter(episodes: string[]): string {
    return episodes[Math.floor(Math.random() * episodes.length)];
  }

  getSessionStorage(param: string): string {
    return sessionStorage.getItem(param) ?? '';
  }

  setSessionStorage(paramName: string, paramValue: string) {
    sessionStorage.setItem(paramName, paramValue);
  }
}
