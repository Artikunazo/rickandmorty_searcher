import { Character } from './character.model';

export interface Location {
  created: string;
  dimension: string;
  id: number;
  name: string;
  residents: Character[];
  type: string;
  url: string;
}
