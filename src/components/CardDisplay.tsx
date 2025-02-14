import React from 'react';
import { useDrag } from 'react-dnd';
import { getCardImageFilename } from '../utils/cardUtils';
import { Card } from '../classes/Card';
import '../styles/Card.css';

interface CardDisplayProps {
  card: Card;
  selected?: boolean;
  onClick?: () => void;
  onDragStart?: () => void;
}

const CardDisplay: React.FC<CardDisplayProps> = ({ card, selected, onClick, onDragStart }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'card',
    item: () => {
      console.log('🎴 Card drag started:', card);
      if (onDragStart) {
        onDragStart();
      }
      return card;
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const imagePath = `/src/assets/cards/${getCardImageFilename(card.paths, card.type, card.id)}`;

  return (
    <div
      ref={drag}
      onClick={onClick}
      className={`card ${selected ? 'selected' : ''} ${isDragging ? 'dragging' : ''}`}
    >
      <img
        src={imagePath}
        alt={card.getPathDisplay()}
        className="card-image"
        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
          // If the image fails to load, show a placeholder with the path pattern
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          if (target.parentElement) {
            target.parentElement.style.backgroundColor = '#f0f0f0';
            target.parentElement.textContent = card.getPathDisplay();
          }
        }}
      />
    </div>
  );
};

export default CardDisplay;
