import {
  Component,
  Input,
  OnInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { ICharacter } from '@modules/search/models/character.model';
import { IEpisode } from '@modules/search/models/episode.model';
import { SearchService } from '@modules/search/services/search/search.service';
import { pipe } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'compare-characters',
  templateUrl: './compare-characters.component.html',
  styleUrls: ['./compare-characters.component.css'],
})
export class CompareCharactersComponent
  implements OnInit, OnDestroy, OnChanges
{
  @Input() characters: ICharacter[] = [];

  public episodes: IEpisode[] = [];
  public loading: boolean = false;

  constructor(private _searchService: SearchService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['characters'].currentValue) {
      this.getSharedEpisodes(this.characters);
    }
  }
  getSharedEpisodes(characters: ICharacter[]): void {
    const episodes: string[] = [];

    const characterEpisodesSorted = characters
      .map((character: ICharacter) => {
        return character.episode;
      })
      .sort(function (a, b) {
        return b.length - a.length;
      });

    // Iterate over the array of episodes more grather (0 ever more grather by sort)
    for (
      let i = 0, characterLength = characterEpisodesSorted[0].length;
      i < characterLength;
      i++
    ) {
      // Get each episode of the array of episodes[0]
      // Remeber that each episode is an URL
      const characterEpisodes = characterEpisodesSorted[0][i];

      // Iterate over the array of episodes sorted
      for (
        let j = 1, episodesSorted = characterEpisodesSorted.length;
        j < episodesSorted;
        j++
      ) {
        if (characterEpisodesSorted[j].indexOf(characterEpisodes) > -1) {
          episodes.push(characterEpisodes);
          break;
        }

        // just break the loop if 'j' position is the last element
        if (j === characterEpisodesSorted.length - 1) {
          break;
        }
      }
    }

    // Get episodes info from API
    episodes.forEach((episode: string) => {
      this.loading = true;
      this._searchService.getDataFromApi(episode)
      .pipe(
        delay(500)
      ).subscribe((episodeData) => {
        this.episodes.push(episodeData);
        this.loading = false;
      });
    });

  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}
