import React from 'react';
import { useDrag } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { Card } from '@/classes/Card';
import { gameActions } from '@/state/gameSlice';
import '../styles/CardDisplay.css';

interface CardDisplayProps {
  card: Card;
  isSelected?: boolean;
  onClick?: () => void;
  isDraggable?: boolean;
}

function getCardImageFilename(card: Card): string {
  // Handle action cards
  if (card.type === 'action') {
    return `${card.id}.png`;
  }

  // Handle special cards
  if (card.type === 'start') return 'start.png';
  if (card.type === 'dest') {
    const destId = card.id.replace('dest_', '');
    return `dest_${destId}.png`;
  }

  // Handle path cards
  if (!card.paths) return 'card_0.png';
  
  // Sort numbers in each path and join them
  const pathStr = card.paths
    .map((path: number[] | undefined) => 
      Array.isArray(path) ? [...path].sort().join('') : '0'
    )
    .join('_');

  return `card_${pathStr}.png`;
}

const CardDisplay: React.FC<CardDisplayProps> = ({ card, isSelected = false, onClick, isDraggable = false }) => {
  const dispatch = useDispatch();

  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: 'CARD',
      item: () => {
        dispatch(gameActions.dragCard(card.id));
        return { id: card.id };
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [card.id],
  );

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      dispatch(gameActions.selectCard(card.id));
    }
  };

  const imageFilename = getCardImageFilename(card);
  const displayText = card.getDisplayText();

  // Determine image path based on card type
  const imagePath = card.type === 'action' 
    ? `/src/assets/cards/actions/${imageFilename}` 
    : `/src/assets/cards/${imageFilename}`;

  return (
    <div
      ref={isDraggable ? dragRef : undefined}
      className={`card-display ${isSelected ? 'selected' : ''} ${isDragging ? 'dragging' : ''} ${card.type === 'action' ? 'action-card' : ''}`}
      onClick={handleClick}
      style={card.type === 'action' ? { '--card-color': card.color } as React.CSSProperties : undefined}
    >
      <img
        src={imagePath}
        alt={displayText}
        className="card-image"
        onError={(e) => {
          console.error(`Failed to load card image: ${imageFilename}`);
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          if (target.parentElement) {
            const fallbackContent = document.createElement('div');
            fallbackContent.className = 'card-content fallback';
            fallbackContent.textContent = displayText;
            target.parentElement.appendChild(fallbackContent);
          }
        }}
      />
    </div>
  );
};

export default CardDisplay;
