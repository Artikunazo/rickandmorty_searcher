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
  public showCompare = false;
  public showGoToTop = false;

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
    // @Todo: transform in directive
    if(window.scrollY >= (window.innerHeight / 3)) {
      this.showGoToTop = true;
    }
  }

  goToTop() {
    window.scrollTo(0, 0);
    if(window.scrollY === 0) {
      this.showGoToTop = false;
    }
  }

  ngOnInit(): void {
    this.getCompareEvent();
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }
}
