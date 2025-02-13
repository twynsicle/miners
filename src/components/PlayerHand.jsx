import React from 'react';
import Card from './Card';
import { STYLES } from '../constants/gameConstants';

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
    <div className="player-hand-container" style={{
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '10px'
    }}>
      <div className="player-name" style={{
        color: '#fff',
        fontSize: '1.2em',
        textShadow: '0 2px 4px rgba(0,0,0,0.2)'
      }}>
        {playerName}'s Hand
      </div>
      <div className="cards-container" style={{
        display: 'flex',
        gap: '10px',
        padding: '10px',
        backgroundColor: 'rgba(45, 45, 45, 0.9)',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
      }}>
        {cards.map((card, index) => card && (
          <div 
            key={`hand-${index}-${card.id || 'unknown'}`}
            draggable
            onDragStart={() => onCardDragStart(card)}
            style={{
              transform: card === selectedCard ? 'translateY(-10px)' : 'none',
              transition: 'transform 0.2s ease',
              cursor: 'pointer'
            }}
          >
            <Card
              paths={card.paths}
              selected={card === selectedCard}
              onClick={() => onCardSelect(index)}
              cardId={card.id}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerHand;
