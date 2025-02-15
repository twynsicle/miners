import React from 'react';
import { useDrag } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { Card } from '../classes/Card';
import { gameActions } from '../state/gameSlice';
import { PathsType } from '../types/game';
import '../styles/CardDisplay.css';

interface CardDisplayProps {
  card: Card;
  isSelected?: boolean;
  onClick?: () => void;
  isDraggable?: boolean;
}

const getPathDisplay = (card: Card): string => {
  if (!card.paths) return 'Empty';
  if (card.type === 'start') return 'Start';
  if (card.type === 'dest') return `Destination ${card.id}`;
  
  // Parse paths if it's a string
  const paths = typeof card.paths === 'string' ? JSON.parse(card.paths) : card.paths;
  
  // For regular cards, show base path pattern
  return paths
    .map((path: number[]) => path.join('-'))
    .join('_');
};

function getCardImageFilename(card: Card): string {
  if (!card.paths) return 'card_0.png';
  
  // Handle special cards
  if (card.type === 'start') return 'start.png';
  if (card.type === 'dest') {
    const destId = card.id.replace('dest_', '');
    return `dest_${destId}.png`;
  }
  
  // Parse paths if it's a string
  const paths = typeof card.paths === 'string' ? JSON.parse(card.paths) : card.paths;
  
  // Regular path cards - format to match existing filenames
  const pathStr = paths
    .map((path: number[]) => path.sort().join(''))
    .join('_');
  
  return `card_${pathStr}.png`;
}

const CardDisplay: React.FC<CardDisplayProps> = ({ 
  card, 
  isSelected = false, 
  onClick,
  isDraggable = false
}) => {
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
      end: (item, monitor) => {
        if (!monitor.didDrop()) {
          dispatch(gameActions.clearDraggedCard());
        }
      },
    }),
    [card.id]  // Only depend on the ID
  );

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      dispatch(gameActions.selectCard(card.id));  // Only dispatch the ID
    }
  };

  const imageFilename = getCardImageFilename(card);
  const pathDisplay = getPathDisplay(card);

  return (
    <div
      ref={isDraggable ? dragRef : undefined}
      className={`card-display ${isSelected ? 'selected' : ''} ${isDragging ? 'dragging' : ''}`}
      onClick={handleClick}
    >
      <img 
        src={`/src/assets/cards/${imageFilename}`} 
        alt={pathDisplay}
        className="card-image"
        onError={(e) => {
          console.error(`Failed to load card image: ${imageFilename}`);
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          if (target.parentElement) {
            const fallbackContent = document.createElement('div');
            fallbackContent.className = 'card-content fallback';
            fallbackContent.textContent = pathDisplay;
            target.parentElement.appendChild(fallbackContent);
          }
        }}
      />
    </div>
  );
};

export default CardDisplay;
