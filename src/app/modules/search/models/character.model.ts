import { CharacterLocation } from './character-location.model';

export interface Character {
  created: string;
  episode: string[];
  gender: 'unknown' | 'Female' | 'Male' | 'Genderless';
  id: number;
  image: string;
  location: CharacterLocation;
  name: string;
  origin: string;
  species: string;
  status: 'Dead' | 'Alive' | 'unknown';
  type: string;
  url: string;
}
