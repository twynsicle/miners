import React from 'react';
import { useDrop } from 'react-dnd';
import CardDisplay from './CardDisplay';
import { Card } from '../classes/Card';
import '../styles/BoardCell.css';

interface BoardCellProps {
  card: Card | null;
  isValidPlacement: boolean;
  onClick: () => void;
  onDrop: (card: Card) => void;
  positionId: string;
}

const BoardCell: React.FC<BoardCellProps> = ({ card, isValidPlacement, onClick, onDrop, positionId }) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'card',
    canDrop: (item: Card) => {
      // console.log('🎯 Checking if drop is valid:', { isValidPlacement, item, positionId });
      return isValidPlacement;
    },
    drop: (item: Card) => {
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
        <CardDisplay card={card} />
      ) : (
        <div className="empty-cell-placeholder" />
      )}
    </div>
  );
};

export default BoardCell;
