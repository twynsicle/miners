import { CardType, PathsType, ActionCardData } from '@/types';

export class Card {
  readonly paths?: PathsType;
  readonly type: CardType;
  readonly id: string;
  readonly text?: string;
  readonly color?: string;

  constructor(
    type: CardType,
    id: string,
    paths?: PathsType,
    text?: string,
    color?: string
  ) {
    this.paths = paths;
    this.type = type;
    this.id = id;
    this.text = text;
    this.color = color;
  }

  /**
   * Create a Card instance from a plain object
   */
  static fromJSON(json: { paths?: string, type: CardType, id: string, text?: string, color?: string }): Card {
    return new Card(
      json.type,
      json.id,
      json.paths ? JSON.parse(json.paths) : undefined,
      json.text,
      json.color
    );
  }

  /**
   * Convert the card to a plain object for serialization
   */
  toJSON() {
    return {
      paths: this.paths ? JSON.stringify(this.paths) : undefined,
      type: this.type,
      id: this.id,
      text: this.text,
      color: this.color
    };
  }

  /**
   * Create an action card from action card data
   */
  static fromActionData(data: ActionCardData): Card {
    return new Card('action', data.id, undefined, data.text, data.color);
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
   * Check if this is an action card
   */
  isActionCard(): boolean {
    return this.type === 'action';
  }

  /**
   * Get a display-friendly description of the card
   */
  getDisplayText(): string {
    if (this.type === 'action') return this.text || 'Action';
    if (this.type === 'start') return 'Start';
    if (this.type === 'dest') return `Destination ${this.id}`;

    // For regular path cards, show base path pattern without identifier
    if (!this.paths) return 'Empty';
    if (Array.isArray(this.paths[0])) {
      return this.paths.map((p) => (Array.isArray(p) ? p.join('-') : p)).join('_');
    }
    return this.paths.join('-');
  }

  /**
   * Create a copy of this card
   */
  clone(): Card {
    return new Card(
      this.type,
      this.id,
      this.paths ? (Array.isArray(this.paths) ? [...this.paths] : this.paths) : undefined,
      this.text,
      this.color
    );
  }
}
