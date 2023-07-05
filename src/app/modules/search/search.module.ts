import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './components/main/main.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { HttpClientModule } from '@angular/common/http';
import {MaterialModule} from './../material/material.module'
import { SearchRoutingModule } from './search-routing.module';
import { CardResultComponent } from './components/card-result/card-result.component';
import { ReactiveFormsModule  } from '@angular/forms';
import { CompareCharactersComponent } from './components/compare-characters/compare-characters.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [
    MainComponent,
    SearchBarComponent,
    CardResultComponent,
    CompareCharactersComponent
  ],
  imports: [
    CommonModule,
    SearchRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    SharedModule,
    MaterialModule
  ]
})
export class SearchModule { }
