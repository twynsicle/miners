import React from 'react';
import Card from './Card';
import { STYLES } from '../constants/gameConstants';

/**
 * @typedef {import('../utils/gameUtils').Card} Card
 */

/**
 * Component for displaying and managing a player's hand of cards
 * @param {Object} props
 * @param {Card[]} props.cards - Cards in the player's hand
 * @param {number} props.selectedCardIndex - Index of the selected card
 * @param {function(number): void} props.onCardSelect - Handler for card selection
 * @param {function(Card): void} props.onCardDragStart - Handler for card drag start
 * @param {function(): void} props.onRefreshHand - Handler for refreshing the hand
 * @param {string} props.playerName - Name of the player
 */
function PlayerHand({ cards, selectedCardIndex, onCardSelect, onCardDragStart, onRefreshHand, playerName }) {
  return (
    <div>
      <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{playerName}'s Hand</h3>
      <div 
        style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          padding: '10px',
          backgroundColor: '#f0f0f0',
          borderRadius: '10px',
          marginTop: '20px'
        }}
      >
        {cards.map((card, index) => (
          <div
            key={card.id}
            draggable
            onDragStart={() => onCardDragStart(card)}
          >
            <Card
              paths={card.paths}
              isSelected={selectedCardIndex === index}
              onSelect={() => onCardSelect(index)}
            />
          </div>
        ))}
      </div>
      <button onClick={onRefreshHand}>Refresh Hand</button>
      
      <h2>Card Connections</h2>
      <ul>
        {cards.map((card) => (
          <li key={card.id}>
            Card {card.id}: {card.paths.map((path) => `[${path.join(', ')}]`).join(' ')}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PlayerHand;
