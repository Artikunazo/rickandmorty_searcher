import { Injectable } from '@angular/core';
import { ConnectorService } from '@core/services/connector/connector.service';
import { environment } from '@environments/environment';
import { ApiRickAndMortyResultsResponse } from '@modules/search/models/result-api.type';
import { EMPTY, Observable, Subject, of, ReplaySubject } from 'rxjs';
import { delay, expand, map, scan, take } from 'rxjs/operators';
import { ApiRickAndMortyResponse } from '@modules/search/models/api.model';
import { Episode } from '@modules/search/models/episode.model';
import { Character } from '@modules/search/models/character.model';

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
  public characterIdsToCompare: Character[] = [];
  public charactersToCompare$ = new ReplaySubject<Character[]>;

  private apiUrl = environment.apiUrl;
  private finalResults: Array<ApiRickAndMortyResultsResponse> = []; // @Todo: Add type

  constructor(private _connectorService: ConnectorService) {}

  getAllResources(): Observable<string[]> {
    return this._connectorService.mGet(this.apiUrl).pipe(
      map((data: Object) => {
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

    if(name && type) this.cleanResults();

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
  
    if(this.finalResults.length >= 10) {
      return;
    }

    if(!response.info.next) {
      return;
    }

    this.getDataFromApi(response.info.next).subscribe({
      next: (response: ApiRickAndMortyResponse) => {
        this.setSessionStorage('info', JSON.stringify(response.info));
        this.processResults({ response, name });
      },
    });
  }

  getRandomEpisodeCharacter(episodesList: string[]): string {
    return episodesList[Math.floor(Math.random() * episodesList.length)];
  }

  getSessionStorage(param: string): string {
    return sessionStorage.getItem(param) ?? '';
  }

  setSessionStorage(paramName: string, paramValue: string) {
    sessionStorage.setItem(paramName, paramValue);
  }

  searchFromScroll() {
    const info = JSON.parse(this.getSessionStorage('info'));
    const name = this.getSessionStorage('name');

    this.getDataFromApi(info.next).pipe(take(1)).subscribe({
      next: (response: ApiRickAndMortyResponse) => {
        this.setSessionStorage('info', JSON.stringify(response.info));
        this.processResults({ response, name });
        this.results$.next(this.finalResults);
      },
    });
  }

  cleanResults() {
    this.finalResults = [];
    this.results$.next(this.finalResults);
  }
}
