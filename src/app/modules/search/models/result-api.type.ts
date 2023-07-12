import { Character } from './character.model';
import { Episode } from './episode.model';
import { Location } from './location.model';

export type ApiRickAndMortyResultsResponse =
  | (keyof Character | keyof Episode | keyof Location);
