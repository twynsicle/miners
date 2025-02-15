import React from 'react';
import { useDrop } from 'react-dnd';
import CardDisplay from './CardDisplay';
import { Card } from '@/classes/Card';
import '../styles/BoardCell.css';

interface BoardCellProps {
  card: Card | null;
  isValidPlacement: boolean;
  onClick: () => void;
  onDrop: (card: Card) => void;
  positionId: string;
}

interface DragItem {
  id: string;
}

const BoardCell: React.FC<BoardCellProps> = ({ card, isValidPlacement, onClick, onDrop, positionId }) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'CARD',
    canDrop: () => isValidPlacement,
    drop: (item: DragItem) => {
      console.log('🎯 Drop attempt:', { item, isValidPlacement, positionId });
      if (isValidPlacement) {
        console.log('🎯 Drop accepted, calling onDrop');
        // The card will be looked up in the parent component
        onDrop({ id: item.id } as Card);
        return { dropped: true };
      }
      console.log('🎯 Drop rejected: not a valid placement');
      return undefined;
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  }), [isValidPlacement, onDrop]);

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
