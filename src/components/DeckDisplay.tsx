import React from 'react';
import '../styles/Deck.css';

interface DeckDisplayProps {
  cardsRemaining: number;
}

const DeckDisplay: React.FC<DeckDisplayProps> = ({ cardsRemaining }) => (
  <div className="deck-display">
    <h3>Deck</h3>
    <div className="deck-counter">
      <span className="deck-icon">🎴</span>
      <span>{cardsRemaining} cards remaining</span>
    </div>
  </div>
);

export default DeckDisplay;
