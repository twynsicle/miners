import React from 'react';
import Card from './Card';
import '../styles/PlayerHand.css';

/**
 * Component for displaying and managing a player's hand of cards
 * @param {Object} props
 * @param {Object[]} props.cards - Cards in the player's hand
 * @param {Object} props.selectedCard - The currently selected card
 * @param {function(number): void} props.onCardSelect - Handler for card selection
 * @param {function(Object): void} props.onCardDragStart - Handler for card drag start
 * @param {string} props.playerName - Name of the player
 */
const PlayerHand = ({ cards, selectedCard, onCardSelect, onCardDragStart, playerName }) => {
  return (
    <div className="player-hand-container">
      <div className="player-name">
        {playerName}'s Hand
      </div>
      <div className="cards-container">
        {cards.map((card, index) => card && (
          <div 
            key={`hand-${index}-${card.id || 'unknown'}`}
            className={`hand-card ${card === selectedCard ? 'selected' : ''}`}
          >
            <Card
              {...card}
              selected={card === selectedCard}
              onClick={() => onCardSelect(index)}
              onDragStart={() => onCardDragStart(card)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerHand;
