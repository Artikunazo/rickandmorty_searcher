import { ICharacterLocation } from './character-location.model';

export interface ICharacter {
  created: string;
  episode: string[];
  gender: 'unknown' | 'Female' | 'Male' | 'Genderless';
  id: number;
  image: string;
  location: ICharacterLocation;
  name: string;
  origin: string;
  species: string;
  status: 'Dead' | 'Alive' | 'unknown';
  type: string;
  url: string;
}
