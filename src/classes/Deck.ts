import { Card } from './Card';
import { possibleCards } from '../possibleCards';

export class Deck {
  cards: Card[];

  constructor() {
    this.cards = this.createDeck();
  }

  private createDeck(): Card[] {
    const cards: Card[] = [];
    
    // Create cards based on possibleCards configuration
    possibleCards.forEach((cardConfig, configIndex) => {
      // Create specified number of cards for this path configuration
      for (let i = 0; i < cardConfig.count; i++) {
        const card = new Card(
          cardConfig.paths,
          'path',
          `path_${configIndex}_${i + 1}`,
        );
        cards.push(card);
      }
    });

    return cards;
  }

  /**
   * Shuffle the deck using Fisher-Yates algorithm
   */
  shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  /**
   * Draw a card from the top of the deck
   */
  drawCard(): Card | undefined {
    return this.cards.pop();
  }

  /**
   * Get the number of cards remaining in the deck
   */
  getCardsRemaining(): number {
    return this.cards.length;
  }

  /**
   * Convert the deck to a plain object for serialization
   */
  toJSON() {
    return {
      cards: this.cards.map(card => card.toJSON())
    };
  }

  /**
   * Create a Deck instance from a plain object
   */
  static fromJSON(json: any): Deck {
    const deck = new Deck();
    deck.cards = json.cards.map((cardJson: any) => Card.fromJSON(cardJson));
    return deck;
  }

  size() {
    return this.cards.length;
  }
}
