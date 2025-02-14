import { possibleCards } from '../possibleCards';
import { Card } from '../types/game';

export class Deck {
  private cards: Card[];

  constructor() {
    this.cards = this.createDeck();
    this.shuffle();
  }

  private createDeck(): Card[] {
    const deck: Card[] = [];
    
    // Create cards based on possibleCards configuration
    possibleCards.forEach((cardConfig, configIndex) => {
      // Create specified number of cards for this path configuration
      for (let i = 0; i < cardConfig.count; i++) {
        deck.push({
          paths: cardConfig.paths,
          type: 'path',
          id: `${configIndex}-${i + 1}`, // e.g., "0-1" for first card of first config
          cardId: `${configIndex}-${i + 1}`
        });
      }
    });

    return deck;
  }

  private shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  drawCard(): Card | undefined {
    return this.cards.pop();
  }

  getCardsRemaining(): number {
    return this.cards.length;
  }
}
