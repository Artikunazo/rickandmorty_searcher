import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { SearchService } from '../../services/search/search.service';

import { TResultApi } from '@modules/search/models/result-api.type';
import { Subscription, EMPTY } from 'rxjs';

@Component({
  selector: 'search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
})
export class SearchBarComponent implements OnInit, OnDestroy {

  @Output() results = new EventEmitter();
  @Output() typeSearchSelected = new EventEmitter();

  public typeSearchList: string[] = [];
  public formSearch: FormGroup;
  public loading: boolean = false;
  public countSearches: number = 0;

  private _subscriptions = new Subscription();

  constructor(
    private _formBuilder: FormBuilder,
    private _searchService: SearchService
  ) {
    this.formSearch = this._formBuilder.group({
      name: ['', [Validators.required]],
      type: ['', [Validators.required]],
    });
  }

  getApisAvailable(): void {
    this.loading = true;
    this._subscriptions.add(
      this._searchService.getAllResources().subscribe({
        next: (data: any) => {
          this.typeSearchList = data;
          this.loading = false;
        },
      })
    );
  }

  search(form: FormGroup): void {

    this.loading = true;
    this.countSearches++;
    if (this.countSearches > 1) {
      this.cancelQueue();
      return;
    }

    this._subscriptions.add(
      this.sendRequest(form.value.name, form.value.type).subscribe({
        next: (results: TResultApi) => {
          this.results.emit(results);
          this.typeSearchSelected.emit(this.formSearch.value.type);

        },
        error: (error: any) => {
          alert(error.message);
        },
        complete: () => {
          this._searchService.stopRequestsQueue = false;
          this.loading = false;
          this.countSearches = 0;
        }
      })
    );
  }

  cancelQueue(): void {
    this._searchService.stopRequestsQueue = true;
    this._searchService.processResults(EMPTY);
    this.countSearches = 0;
  }

  sendRequest(name: string, type: string){
    return this._searchService.search(name, type);
  }

  ngOnInit(): void {
    this.getApisAvailable();
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }
}
