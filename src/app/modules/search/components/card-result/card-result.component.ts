import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { Episode } from '@modules/search/models/episode.model';
import { SearchService } from '@modules/search/services/search/search.service';
import { Observable, Subscription } from 'rxjs';
import { Character } from '@modules/search/models/character.model';
import { delay } from 'rxjs/operators';
import { Location } from '@modules/search/models/location.model';

@Component({
  selector: 'card-result',
  templateUrl: './card-result.component.html',
  styleUrls: ['./card-result.component.css'],
})
export class CardResultComponent implements OnInit, OnDestroy {
  @Input() typeSearch: string = '';
  @Input() result!: any;
  @Output() compareEvent = new EventEmitter();

  public episode!: Episode;
  public moreInfo: boolean = false;
  public characters: Character[] = [];
  public charactersToCompare: number[] = [];
  public loading: boolean = false;

  private _subscriptions = new Subscription();

  constructor(
    private _searchService: SearchService,
  ) {}

  ngOnInit(): void {
    // Read episodes of a character
    if (this.typeSearch === 'characters') {
      this.searchEpisodes();
    }
  }

  private searchEpisodes(): void {
    const episode = this._searchService.getRandomEpisodeCharacter(
      this.result.episode
    );
    this._subscriptions.add(
      this.getDataFromApi(episode).subscribe((episodeData) => {
        this.episode = episodeData as Episode;
        this.loading = false;
      })
    );
  }

  toggleMoreInfo(): void {
    this.moreInfo = !this.moreInfo;
    if (!this.moreInfo) return;

    this.result.characters.forEach((character: string) => {
      this._subscriptions.add(
        this.getDataFromApi(character).subscribe((characterData: Character | Episode | Location) => {
          this.characters.push(characterData as Character);
          this.loading = false;
        })
      );
    });
  }

  getDataFromApi(url: string): Observable<Character | Episode | Location> {
    this.loading = true;
    return this._searchService.getDataFromApi(url).pipe(delay(500));
  }

  addCompare(character: Character) {
    if (this._searchService.characterIdsToCompare.length === 3) {
      this._searchService.charactersToCompare$.next(
        this._searchService.characterIdsToCompare
      );
      return;
    }

    this._searchService.characterIdsToCompare.push(character);
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }
}
