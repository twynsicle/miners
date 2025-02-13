import React from 'react';
import { possibleCards } from '../possibleCards';
import { STYLES } from '../constants/gameConstants';

export class Deck {
  constructor() {
    this.cards = this.createDeck();
    this.shuffle();
  }

  createDeck() {
    const deck = [];
    
    // Create cards based on possibleCards configuration
    possibleCards.forEach((cardConfig, configIndex) => {
      // Create specified number of cards for this path configuration
      for (let i = 0; i < cardConfig.count; i++) {
        deck.push({
          paths: cardConfig.paths,
          id: `${configIndex}-${i + 1}` // e.g., "0-1" for first card of first config
        });
      }
    });

    return deck;
  }

  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  drawCard() {
    return this.cards.pop();
  }

  getCardsRemaining() {
    return this.cards.length;
  }
}

export const DeckDisplay = ({ cardsRemaining }) => {
  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: 'rgba(45, 45, 45, 0.9)',
      padding: '10px 20px',
      borderRadius: '8px',
      color: 'white',
      fontWeight: 'bold',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    }}>
      Cards Remaining: {cardsRemaining}
    </div>
  );
};
