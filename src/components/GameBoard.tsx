import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import BoardCell from './BoardCell';
import PlayerHand from './PlayerHand';
import DeckDisplay from './DeckDisplay';
import PlayerList from './PlayerList';
import { useGameDispatch } from '@/hooks/useGameDispatch';
import { gameActions } from '@/state/gameSlice';
import { getValidPositions, isValidDropNew } from '@/utils/gameUtils';
import {
  selectBoardCards, 
  selectDraggedCard, 
  selectSelectedCard, 
  selectCardsRemaining, 
  selectActivePlayerId, 
  selectAllPlayers 
} from '@/state/selectors';
import '../styles/GameBoard.css';
import {Card} from "@/classes/Card";


const GameBoard: React.FC = () => {
  const dispatch = useGameDispatch();
  const boardRef = useRef<HTMLDivElement>(null);

  const boardCards = useSelector(selectBoardCards);
  const selectedCard = useSelector(selectSelectedCard);
  const draggedCard = useSelector(selectDraggedCard);
  const cardsRemaining = useSelector(selectCardsRemaining);
  const activePlayerId = useSelector(selectActivePlayerId);
  const players = useSelector(selectAllPlayers);

  const activePlayer = players.find(p => p.id === activePlayerId);

  if (!activePlayer) {
    return (
      <div className="game-error">
        <h2>Error: Unable to find active player</h2>
        <p>Please try refreshing the game.</p>
      </div>
    );
  }

  const handleBoardClick = (row: number, col: number) => {
    const position = `${row},${col}`;
    
    // Convert board object to array format for validation
    const boardArray = new Array(9 * 9).fill(null);
    Object.entries(boardCards).forEach(([pos, card]) => {
      const [r, c] = pos.split(',').map(Number);
      boardArray[r * 9 + c] = card;
    });
    
    if ((selectedCard || draggedCard) && isValidDropNew(boardArray, row * 9 + col, selectedCard || draggedCard)) {
      const card = selectedCard || draggedCard;
      if (card) {
        dispatch(gameActions.placeCard({ position, cardId: card.id }));
      }
    }
  };

  const handleCellDrop = (row: number, col: number, droppedCard: { id: string }) => {
    const position = `${row},${col}`;
    console.log(' Cell drop handler:', { row, col, position, droppedCard });
    
    const cardInHand = activePlayer.hand.find((c: Card) => c.id === droppedCard.id);
    console.log(' Found card in hand:', cardInHand);
    
    // Convert board object to array format for validation
    const boardArray = new Array(9 * 9).fill(null);
    Object.entries(boardCards).forEach(([pos, card]) => {
      const [r, c] = pos.split(',').map(Number);
      boardArray[r * 9 + c] = card;
    });
    
    if (cardInHand && isValidDropNew(boardArray, row * 9 + col, cardInHand)) {
      console.log(' Placing card via drop', droppedCard);
      dispatch(gameActions.placeCard({ position, cardId: cardInHand.id }));
    } else {
      console.log(' Drop rejected:', { 
        hasCard: !!cardInHand, 
        isValid: cardInHand ? isValidDropNew(boardArray, row * 9 + col, cardInHand) : false 
      });
    }
  };

  // Render board grid
  const renderBoard = () => {
    const validPositions = getValidPositions(selectedCard || draggedCard, boardCards);
    const rows = [];

    for (let row = 0; row < 9; row++) {
      const cells = [];
      for (let col = 0; col < 9; col++) {
        const position = `${row},${col}`;
        const positionId = `${col + 1}-${row + 1}`;
        cells.push(
          <BoardCell
            key={position}
            positionId={positionId}
            card={boardCards[position] || null}
            isValidPlacement={validPositions.has(position)}
            onClick={() => handleBoardClick(row, col)}
            onDrop={(card) => handleCellDrop(row, col, card)}
          />
        );
      }
      rows.push(
        <div key={row} className="board-row">
          {cells}
        </div>
      );
    }

    return rows;
  };

  return (
    <div className="game-container">
      <div className="game-main">
        <div className="game-board" ref={boardRef}>
          {renderBoard()}
        </div>
        <PlayerHand />

      </div>
      <div className="game-sidebar">
        <DeckDisplay cardsRemaining={cardsRemaining} />
        <PlayerList />
      </div>
      <button
        className="reset-button"
        onClick={() => dispatch(gameActions.resetGame())}
      >
        Reset Game
      </button>
    </div>
  );
};

export default GameBoard;