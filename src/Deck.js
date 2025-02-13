import { possibleCards } from './possibleCards';

class Deck {
  constructor() {
    this.deck = [];
    this.discardPile = [];
    this.initializeDeck();
    this.shuffleDeck();
  }

  initializeDeck() {
    possibleCards.forEach(cardType => {
      for (let i = 0; i < cardType.count; i++) {
        this.deck.push({ id: `${Math.random()}`, paths: cardType.paths });
      }
    });
  }

  shuffleDeck() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  drawCard() {
    return this.deck.pop();
  }

  discardCard(card) {
    this.discardPile.push(card);
  }

  getDeckSize() {
    return this.deck.length;
  }

  getDiscardPileSize() {
    return this.discardPile.length;
  }
}

export default Deck;
