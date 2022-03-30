import { ICharacter } from './character.model';
import { IEpisode } from './episode.model';
import { ILocation } from './location.model';

export type TResultApi =
  | (keyof ICharacter | keyof IEpisode | keyof ILocation);
