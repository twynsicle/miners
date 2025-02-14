export type PathType = number[];
export type PathsType = PathType[];

export interface Card {
  id: string;
  cardId: string;
  paths: PathsType;
  type: 'start' | 'dest' | 'path';
}

export interface Player {
  id: string;
  name: string;
  hand: Card[];
  score: number;
}

export interface GameState {
  board: { [key: string]: Card };
  players: Player[];
  activePlayerId: string;
  selectedCard: Card | null;
  draggedCard: Card | null;
  deck: Card[];
  cardsRemaining: number;
}

export interface Position {
  row: number;
  col: number;
}
