import { CardType, PathsType } from '@/types';

export class Card {
  readonly paths: PathsType;
  readonly type: CardType;
  readonly id: string;

  constructor(paths: PathsType, type: CardType, id: string) {
    this.paths = paths;
    this.type = type;
    this.id = id;
  }

  /**
   * Create a Card instance from a plain object
   */
  static fromJSON(json: any): Card {
    return new Card(JSON.parse(json.paths), json.type, json.id);
  }

  /**
   * Convert the card to a plain object for serialization
   */
  toJSON() {
    return {
      paths: JSON.stringify(this.paths),
      type: this.type,
      id: this.id,
    };
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
      return this.paths.map((p) => (Array.isArray(p) ? p.join('-') : p)).join('_');
    }
    return this.paths.join('-');
  }

  /**
   * Create a copy of this card
   */
  clone(): Card {
    return new Card(Array.isArray(this.paths) ? [...this.paths] : this.paths, this.type, this.id);
  }
}
