import React from 'react';
import Card from './Card';
import { STYLES } from '../constants/gameConstants';

const BoardCell = ({ card, isValidPlacement, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        width: STYLES.CARD_WIDTH,
        height: STYLES.CARD_HEIGHT,
        border: isValidPlacement ? '2px dashed #4CAF50' : '2px solid #1a1a1a',
        borderRadius: STYLES.CELL_BORDER_RADIUS,
        backgroundColor: card ? 'transparent' : '#1a1a1a',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: isValidPlacement ? 'pointer' : 'default',
        transition: 'border-color 0.2s ease',
        boxSizing: 'border-box',
        margin: 0,
        padding: 0
      }}
    >
      {card && (
        <Card 
          paths={card.paths}
          type={card.type}
          id={card.id}
          cardId={card.cardId}
        />
      )}
    </div>
  );
};

export default BoardCell;
