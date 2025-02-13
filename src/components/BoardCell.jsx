import React from 'react';
import Card from './Card';
import { STYLES } from '../constants/gameConstants';

const BoardCell = ({ card, isValidPlacement, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        width: STYLES.CELL_WIDTH,
        height: STYLES.CELL_HEIGHT,
        backgroundColor: isValidPlacement ? STYLES.COLORS.VALID_DROP : STYLES.COLORS.EMPTY_CELL,
        border: `2px solid ${isValidPlacement ? STYLES.COLORS.VALID_DROP_BORDER : STYLES.COLORS.CELL_BORDER}`,
        borderRadius: STYLES.CELL_BORDER_RADIUS,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: isValidPlacement ? 'pointer' : 'default'
      }}
    >
      {card ? (
        <Card {...card} />
      ) : isValidPlacement ? (
        <div style={{
          color: STYLES.COLORS.VALID_DROP_TEXT,
          fontWeight: 'bold',
          fontSize: '14px',
          textAlign: 'center'
        }}>
          Play here
        </div>
      ) : null}
    </div>
  );
};

export default BoardCell;
