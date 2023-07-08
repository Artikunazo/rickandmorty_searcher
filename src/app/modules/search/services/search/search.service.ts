import { Injectable } from '@angular/core';
import { ConnectorService } from '@core/services/connector/connector.service';
import { environment } from '@environments/environment';
import { TResultApi } from '@modules/search/models/result-api.type';
import { EMPTY, Observable, Subject, of } from 'rxjs';
import { delay, expand, map, scan } from 'rxjs/operators';
import { ApiRickAndMortyResponse } from '@modules/search/models/api.model';
import { IEpisode } from '@modules/search/models/episode.model';
import { ICharacter } from '@modules/search/models/character.model';

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
  private finalResults: Array<TResultApi> = []; // @Todo: Add type

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
    if (type === typeSearch.EPISODES) url += 'episode/';
    if (type === typeSearch.LOCATIONS) url += 'location/';

    this.getDataFromApi(url).subscribe({
      next: (response: ApiRickAndMortyResponse) => {
        this.processResults({ response, name });
        this.results$.next(this.finalResults);
      },
    });
  }

  processResults(params: { response: ApiRickAndMortyResponse; name: string }) {
    const { response, name } = params;
    const resultsListFiltered = response.results.filter((item: any ) =>
      item.name.toLowerCase().includes(name.toLocaleLowerCase())
    );

    resultsListFiltered.map(item => this.finalResults.push(item));
  
    if(this.finalResults.length >= 30) {
      return;
    }

    if(!response.info.next) {
      return;
    }

    this.getDataFromApi(response.info.next).subscribe({
      next: (response: ApiRickAndMortyResponse) => {
        this.processResults({ response, name });
      },
    });
  }

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
