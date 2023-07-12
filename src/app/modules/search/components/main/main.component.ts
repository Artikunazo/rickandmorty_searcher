import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { TResultApi } from '@modules/search/models/result-api.type';
import { ICharacter } from '@modules/search/models/character.model';
import { SearchService } from '../../services/search/search.service';

@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit, OnDestroy {
  public results$ = this._searchService.results$;
  public typeSearch: string = '';
  public charactersToCompare: ICharacter[] = [];
  public showCompare: boolean = false;

  private _subscriptions = new Subscription();

  constructor(private readonly _searchService: SearchService) {}

  getTypeSearch(typeSelected: any): void {
    this.typeSearch = typeSelected as string;
  }

  toggleCompareContainer(): void {
    this.showCompare = !this.showCompare;
  }

  getCompareEvent(): void {
    this._searchService.charactersToCompare$.subscribe({
      next: (characters: ICharacter[]) => {
        characters.map(character => this.charactersToCompare.push(character));
      },
    });
  }

  onScroll() {
    this._searchService.searchFromScroll();
  }

  ngOnInit(): void {
    this.getCompareEvent();
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }
}
