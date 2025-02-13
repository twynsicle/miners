import React from 'react';
import { useDrag } from 'react-dnd';
import { getCardImageFilename } from '../utils/cardUtils';
import '../styles/Card.css';

const Card = ({ paths, type, id, cardId, selected, onClick, onDragStart }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'card',
    item: () => {
      console.log('🎴 Card drag started:', { paths, type, id, cardId });
      if (onDragStart) {
        onDragStart();
      }
      return { paths, type, id, cardId };
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // Get image path based on the card's paths and type
  const imagePath = `/src/assets/cards/${getCardImageFilename(paths, type, id)}`;

  // Format paths for display in case of error
  const getPathDisplay = () => {
    if (!paths) return 'Empty';
    if (type === 'start') return 'Start';
    if (type === 'dest') return `Destination ${id}`;
    
    // For regular cards, show base path pattern without identifier
    if (Array.isArray(paths[0])) {
      return paths.map(p => Array.isArray(p) ? p.join('-') : p).join('_');
    }
    return paths.join('-');
  };

  return (
    <div
      ref={drag}
      onClick={onClick}
      className={`card ${selected ? 'selected' : ''} ${isDragging ? 'dragging' : ''}`}
    >
      <img
        src={imagePath}
        alt={getPathDisplay()}
        className="card-image"
        onError={(e) => {
          // If the image fails to load, show a placeholder with the path pattern
          e.target.style.display = 'none';
          e.target.parentElement.style.backgroundColor = '#f0f0f0';
          e.target.parentElement.textContent = getPathDisplay();
        }}
      />
    </div>
  );
};

export default Card;
