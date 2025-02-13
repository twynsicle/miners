import React from 'react';
import { useDrag } from 'react-dnd';
import { STYLES } from '../constants/gameConstants';
import { getCardImageFilename } from '../utils/cardUtils';

const Card = ({ id, paths, isSelected, onSelect }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'card',
    item: { id, paths },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const imagePath = `/src/assets/cards/${getCardImageFilename(paths, id)}`;

  return (
    <div
      ref={drag}
      onClick={onSelect}
      style={{
        width: STYLES.CARD_WIDTH,
        height: STYLES.CARD_HEIGHT,
        border: isSelected ? `4px solid ${STYLES.SELECTED_CARD_BORDER}` : '4px solid transparent',
        borderRadius: '8px',
        cursor: 'pointer',
        opacity: isDragging ? 0.5 : 1,
        position: 'relative',
        backgroundColor: 'white'
      }}
    >
      <img
        src={imagePath}
        alt="Card"
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
          e.target.parentElement.textContent = id?.startsWith('dest_') ? 
            `Destination ${id.split('_')[1]}` : 
            paths.map(p => p.join('-')).join(' | ');
        }}
      />
    </div>
  );
};

export default Card;
