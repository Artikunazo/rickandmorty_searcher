import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl } from '@angular/forms';
import { IEpisode } from '@modules/search/models/episode.model';
import { SearchService } from '@modules/search/services/search/search.service';
import { Observable, Subscription } from 'rxjs';
import { ICharacter } from '@modules/search/models/character.model';
import { delay } from 'rxjs/operators';
import { ILocation } from '@modules/search/models/location.model';

@Component({
  selector: 'card-result',
  templateUrl: './card-result.component.html',
  styleUrls: ['./card-result.component.css'],
})
export class CardResultComponent implements OnInit, OnDestroy {
  @Input() typeSearch: string = '';
  @Input() result!: any;
  @Output() compareEvent = new EventEmitter();

  public episode!: IEpisode;
  public moreInfo: boolean = false;
  public characters: ICharacter[] = [];
  public charactersToCompare: number[] = [];
  public loading: boolean = false;

  private _subscriptions = new Subscription();

  constructor(
    private _searchService: SearchService,
    private _formBuilder: UntypedFormBuilder
  ) {
  }

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
        this.episode = episodeData as IEpisode;
        this.loading = false;
      })
    );
  }

  toggleMoreInfo(): void {
    this.moreInfo = !this.moreInfo;
    if (this.moreInfo) {
      this.result.characters.forEach((character: string) => {
        this._subscriptions.add(
          this.getDataFromApi(character)
            .subscribe((characterData) => {
              this.characters.push(characterData as ICharacter);
              this.loading = false;
            })
        );
      });
    }
  }

  getDataFromApi(url: string): Observable<ICharacter | IEpisode | ILocation> {
    this.loading = true;
    return this._searchService.getDataFromApi(url).pipe(delay(500));
  }

  addCompare(idCharacter: number) {
    if(this.charactersToCompare.length === 3) {
      return;
    }
    
    this.charactersToCompare.push(idCharacter);
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }
}
