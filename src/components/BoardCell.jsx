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
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: isValidPlacement ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        boxSizing: 'border-box',
        margin: 0,
        padding: 0,
        position: 'relative'
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
      {isValidPlacement && !card && (
        <div style={{
          position: 'absolute',
          color: '#4CAF50',
          fontWeight: 'bold',
          fontSize: '14px',
          textShadow: '0 1px 2px rgba(0,0,0,0.2)',
          pointerEvents: 'none'
        }}>
          Play Here
        </div>
      )}
    </div>
  );
};

export default BoardCell;
