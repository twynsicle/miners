import { Card } from './Card';
import { possiblePathCards } from '@/possiblePathCards';
import { actionCardDefinitions } from '@/possibleActionCards';

export class Deck {
  cards: Card[];

  constructor() {
    this.cards = this.createDeck();
  }

  private createDeck(): Card[] {
    const cards: Card[] = [];

    // Create path cards
    possiblePathCards.forEach((cardConfig, configIndex) => {
      // Create specified number of cards for this path configuration
      for (let i = 0; i < cardConfig.count; i++) {
        const card = new Card('path', `path_${configIndex}_${i + 1}`, cardConfig.paths);
        cards.push(card);
      }
    });

    // Create action cards
    actionCardDefinitions.forEach((cardConfig) => {
      // Create specified number of cards for this action
      for (let i = 0; i < cardConfig.count; i++) {
        const card = Card.fromActionData(cardConfig);
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
   * Draw multiple cards from the top of the deck
   */
  drawCards(count: number): Card[] {
    const cards: Card[] = [];
    for (let i = 0; i < count; i++) {
      const card = this.drawCard();
      if (card) cards.push(card);
    }
    return cards;
  }

  /**
   * Get the number of cards remaining in the deck
   */
  getCardsRemaining(): number {
    return this.cards.length;
  }

  size() {
    return this.cards.length;
  }
}
