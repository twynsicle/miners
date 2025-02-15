import React from 'react';
import { useDrag } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { Card } from '../classes/Card';
import { gameActions } from '../state/gameSlice';
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
  
  // For regular cards, show base path pattern without identifier
  if (Array.isArray(card.paths[0])) {
    return (card.paths as any[]).map(p => Array.isArray(p) ? p.join('-') : p).join('_');
  }
  return (card.paths as any[]).join('-');
};


function getCardImageFilename(paths: number[][], type?: string, id?: string): string {
  if (!paths) return 'blank.png';
  
  // Handle special cards
  if (type === 'start') return 'start.png';
  if (type === 'dest') return `${id}.png`;
  
  // Convert paths to filename
  const getPathKey = (paths: number[][]) => {
    // For each path array in paths, sort the numbers and join them
    return paths.map(path => 
      Array.isArray(path) ? [...path].sort().join('') : path
    ).join('_');
  };

  return `card_${getPathKey(paths)}.png`;
}

const CardDisplay: React.FC<CardDisplayProps> = ({ 
  card, 
  isSelected = false, 
  onClick,
  isDraggable = false
}) => {
  const dispatch = useDispatch();

  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'CARD',
    item: () => {
      if (isDraggable) {
        dispatch(gameActions.dragCard(card instanceof Card ? card : Card.fromJSON(card)));
      }
      return card;
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    }),
    canDrag: () => isDraggable
  }), [card, isDraggable]);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (isDraggable) {
      dispatch(gameActions.selectCard(card instanceof Card ? card : Card.fromJSON(card)));
    }
  };

  const displayText = getPathDisplay(card);
  const imagePath = `/src/assets/cards/${getCardImageFilename(card.paths, card.type, card.id)}`;

  return (
    <div
      ref={dragRef}
      className={`card ${isSelected ? 'selected' : ''} ${isDragging ? 'dragging' : ''}`}
      onClick={handleClick}
    >
      <img
        src={imagePath}
        alt={displayText}
        className="card-image"
        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
          // If the image fails to load, show a placeholder with the path pattern
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          if (target.parentElement) {
            target.parentElement.style.backgroundColor = '#f0f0f0';
            const fallbackContent = document.createElement('div');
            fallbackContent.className = 'card-content fallback';
            fallbackContent.innerHTML = `
              <div class="card-id">${card.id}</div>
              <div class="card-paths">${displayText}</div>
            `;
            target.parentElement.appendChild(fallbackContent);
          }
        }}
      />
    </div>
  );
};

export default CardDisplay;
