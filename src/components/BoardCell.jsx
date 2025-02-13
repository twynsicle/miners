import React from 'react';
import { useDrop } from 'react-dnd';
import Card from './Card';
import '../styles/BoardCell.css';

const BoardCell = ({ card, isValidPlacement, onClick, onDrop, positionId }) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'card',
    canDrop: (item) => {
      // console.log('🎯 Checking if drop is valid:', { isValidPlacement, item, positionId });
      return isValidPlacement;
    },
    drop: (item) => {
      console.log('🎯 Drop attempt:', { item, isValidPlacement, positionId });
      if (isValidPlacement) {
        console.log('🎯 Drop accepted, calling onDrop');
        onDrop(item);
        return { dropped: true };
      }
      console.log('🎯 Drop rejected: not a valid placement');
      return undefined;
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop()
    })
  }));

  return (
    <div
      ref={drop}
      onClick={onClick}
      id={positionId}
      className={`board-cell ${isValidPlacement ? 'valid-placement' : ''} ${isOver && canDrop ? 'drag-over' : ''}`}
    >
      {card ? (
        <Card {...card} />
      ) : (
        <div className="empty-cell-placeholder" />
      )}
    </div>
  );
};

export default BoardCell;
