import React from 'react';
import { useDrag } from 'react-dnd';
import { STYLES } from '../constants/gameConstants';
import { getCardImageFilename } from '../utils/cardUtils';

const Card = ({ paths, type, id, cardId, selected, onClick }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'card',
    item: { paths, id: cardId },
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
      style={{
        width: STYLES.CARD_WIDTH,
        height: STYLES.CARD_HEIGHT,
        border: selected ? `4px solid ${STYLES.SELECTED_CARD_BORDER}` : '4px solid transparent',
        borderRadius: STYLES.CELL_BORDER_RADIUS,
        cursor: 'pointer',
        opacity: isDragging ? 0.5 : 1,
        position: 'relative',
        backgroundColor: 'white',
        boxSizing: 'border-box'
      }}
    >
      <img
        src={imagePath}
        alt={getPathDisplay()}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          pointerEvents: 'none'
        }}
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
