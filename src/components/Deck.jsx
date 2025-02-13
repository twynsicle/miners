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

export const DeckDisplay = ({ cardsRemaining }) => (
  <div style={{
    backgroundColor: STYLES.BOARD_BG,
    borderRadius: '10px',
    padding: '15px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    width: '200px'
  }}>
    <h3 style={{ margin: '0 0 15px 0', textAlign: 'center' }}>Deck</h3>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      backgroundColor: 'white',
      padding: '10px',
      borderRadius: '5px'
    }}>
      <span style={{ fontSize: '24px' }}>🎴</span>
      <span>{cardsRemaining} cards remaining</span>
    </div>
  </div>
);
