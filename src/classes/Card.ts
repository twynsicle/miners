import { PathsType } from '../types/game';

/**
 * Represents a card in the game
 */
export class Card {
  readonly paths: PathsType;
  readonly type: string;
  readonly id?: string;
  readonly cardId: string;

  constructor(paths: PathsType, type: string, cardId: string, id?: string) {
    this.paths = paths;
    this.type = type;
    this.id = id;
    this.cardId = cardId;
  }

  /**
   * Check if this is a start card
   */
  isStartCard(): boolean {
    return this.type === 'start';
  }

  /**
   * Check if this is a destination card
   */
  isDestinationCard(): boolean {
    return this.type === 'dest';
  }

  /**
   * Get a display-friendly description of the card's paths
   */
  getPathDisplay(): string {
    if (!this.paths) return 'Empty';
    if (this.type === 'start') return 'Start';
    if (this.type === 'dest') return `Destination ${this.id}`;
    
    // For regular cards, show base path pattern without identifier
    if (Array.isArray(this.paths[0])) {
      return this.paths.map(p => Array.isArray(p) ? p.join('-') : p).join('_');
    }
    return this.paths.join('-');
  }

  /**
   * Create a copy of this card
   */
  clone(): Card {
    return new Card(
      Array.isArray(this.paths) ? [...this.paths] : this.paths,
      this.type,
      this.cardId,
      this.id
    );
  }
}
