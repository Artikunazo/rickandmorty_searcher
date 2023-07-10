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

  getCompareEvent(event: any): void {
    if (
      event.value &&
      this.charactersToCompare.length > 1 &&
      this.charactersToCompare.length === 3
    ) {
      alert(
        'Sólo se pueden comparar hasta 3 personajes.\nEl personaje seleccionado no será comparado.'
      );
      return;
    }

    if (event.value) {
      this.charactersToCompare.push(event.character);
      return;
    }

    if (!event.value) {
      const index = this.charactersToCompare.findIndex((character: any) => {
        return character['name'] === event.character['name'];
      });

      if (index !== -1) {
        this.charactersToCompare.splice(index, 1);
      }

      return;
    }

    if (this.charactersToCompare.length < 2) {
      this.toggleCompareContainer();
      return;
    }
  }

  onScroll() {
    this._searchService.searchFromScroll();
  }

  ngOnInit(): void {
    // this.results$.subscribe();
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }
}
