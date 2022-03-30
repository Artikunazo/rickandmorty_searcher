import { ICharacter } from './character.model';

export interface ILocation {
  created: string;
  dimension: string;
  id: number;
  name: string;
  residents: ICharacter[];
  type: string;
  url: string;
}
