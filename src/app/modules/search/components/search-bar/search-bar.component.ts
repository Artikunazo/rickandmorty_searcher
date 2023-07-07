import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, Validators, UntypedFormGroup } from '@angular/forms';

import { SearchService } from '../../services/search/search.service';

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
  public formSearch: UntypedFormGroup;
  public loading: boolean = false;
  public countSearches: number = 0;

  private _subscriptions = new Subscription();

  constructor(
    private _formBuilder: UntypedFormBuilder,
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

  search(form: UntypedFormGroup): void {
    this._searchService.setSessionStorage('name', form.value.name);
    this._searchService.setSessionStorage('type', form.value.type);
    this._searchService.search();

    this.typeSearchSelected.emit(this._searchService.getSessionStorage('type'));
  }

  ngOnInit(): void {
    this.getApisAvailable();
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }
}
