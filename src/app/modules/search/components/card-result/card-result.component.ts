import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
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
  public characterCompare!: FormControl;
  public loading: boolean = false;

  private _subscriptions = new Subscription();

  constructor(
    private _searchService: SearchService,
    private _formBuilder: FormBuilder
  ) {
    // Init checkbox for compare characters
    this.characterCompare = this._formBuilder.control(false);
  }

  ngOnInit(): void {
    // Read episodes of a character
    if (this.typeSearch === 'characters') {
      this.searchEpisodes();
      this.checkboxListenerInit();
    }
  }

  private searchEpisodes(): void {
    const episode = this._searchService.getEpisodeCharacter(
      this.result.episode
    );
    this._subscriptions.add(
      this.getDataFromApi(episode).subscribe((episodeData) => {
        this.episode = episodeData as IEpisode;
        this.loading = false;
      })
    );
  }

  private checkboxListenerInit() {
    // Listener compare checkbox action
    this._subscriptions.add(
      this.characterCompare.valueChanges.subscribe({
        next: (value) => {
          this.compareEvent.emit({
            character: this.result,
            value: value,
          });
        },
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

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }
}
