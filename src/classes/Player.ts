import { Card } from './Card';

/**
 * Represents a status effect that can be applied to a player
 */
export interface PlayerStatus {
  type: string;
  duration: number;
  effect: string;
}

/**
 * Represents a player in the game
 */
export class Player {
  readonly id: number;
  readonly name: string;
  readonly avatar: string;
  private _hand: Card[];
  private _statuses: PlayerStatus[];

  constructor(id: number, name: string, avatar: string = '') {
    this.id = id;
    this.name = name;
    this.avatar = avatar;
    this._hand = [];
    this._statuses = [];
  }

  /**
   * Get the player's current hand
   */
  get hand(): Card[] {
    return [...this._hand];
  }

  /**
   * Get the player's current statuses
   */
  get statuses(): PlayerStatus[] {
    return [...this._statuses];
  }

  /**
   * Add a card to the player's hand
   */
  addCard(card: Card): void {
    this._hand.push(card);
  }

  /**
   * Remove a card from the player's hand
   */
  removeCard(cardId: string): Card | undefined {
    const index = this._hand.findIndex(card => card.id === cardId);
    if (index === -1) return undefined;
    return this._hand.splice(index, 1)[0];
  }

  /**
   * Add a status effect to the player
   */
  addStatus(status: PlayerStatus): void {
    this._statuses.push(status);
  }

  /**
   * Remove a status effect from the player
   */
  removeStatus(type: string): PlayerStatus | undefined {
    const index = this._statuses.findIndex(status => status.type === type);
    if (index === -1) return undefined;
    return this._statuses.splice(index, 1)[0];
  }

  /**
   * Check if the player has a specific status
   */
  hasStatus(type: string): boolean {
    return this._statuses.some(status => status.type === type);
  }

  /**
   * Update all status durations and remove expired ones
   */
  updateStatuses(): void {
    this._statuses = this._statuses.filter(status => {
      status.duration--;
      return status.duration > 0;
    });
  }

  /**
   * Create a copy of this player
   */
  clone(): Player {
    const player = new Player(this.id, this.name, this.avatar);
    player._hand = this._hand.map(card => card.clone());
    player._statuses = [...this._statuses];
    return player;
  }

  /**
   * Check if the player's hand is empty
   */
  hasEmptyHand(): boolean {
    return this._hand.length === 0;
  }

  /**
   * Get the number of cards in the player's hand
   */
  getHandSize(): number {
    return this._hand.length;
  }

  /**
   * Serialize the player instance to a plain JSON object
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      avatar: this.avatar,
      hand: this._hand.map(card => card.toJSON()),
      statuses: [...this._statuses]
    };
  }

  /**
   * Create a new Player instance from a serialized JSON object
   */
  static fromJSON(json: {
    id: number;
    name: string;
    avatar: string;
    hand: ReturnType<Card['toJSON']>[];
    statuses: PlayerStatus[];
  }): Player {
    const player = new Player(json.id, json.name, json.avatar);
    json.hand.forEach(cardJson => {
      player.addCard(Card.fromJSON(cardJson));
    });
    json.statuses.forEach(status => {
      player._statuses.push(status);
    });
    return player;
  }
}
