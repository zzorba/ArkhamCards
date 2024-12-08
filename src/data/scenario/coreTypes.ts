import LatestDeckT from "@data/interfaces/LatestDeckT";


export interface LatestDecks {
  [code: string]: LatestDeckT | undefined;
}