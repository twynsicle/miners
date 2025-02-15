import React from 'react';
import { useSelector } from 'react-redux';
import CardDisplay from './CardDisplay';
import { selectActivePlayer, selectSelectedCard } from '../state/selectors';
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
const PlayerHand = () => {
  const activePlayer = useSelector(selectActivePlayer);
  const selectedCard = useSelector(selectSelectedCard);

  if (!activePlayer) return null;

  return (
    <div className="player-hand-container">
      <div className="player-name">
        {activePlayer.name}'s Hand
      </div>
      <div className="cards-container">
        {activePlayer.hand.map((card) => (
          <div 
            key={`hand-${card.id}`}
            className={`hand-card ${card.id === selectedCard?.id ? 'selected' : ''}`}
          >
            <CardDisplay
              card={card}
              isDraggable={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerHand;
