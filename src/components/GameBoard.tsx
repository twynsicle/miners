import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import BoardCell from './BoardCell';
import PlayerHand from './PlayerHand';
import DeckDisplay from './DeckDisplay';
import PlayerList from './PlayerList';
import { useGameDispatch } from '../hooks/useGameDispatch';
import { gameActions } from '../state/gameSlice';
import { getValidPositions, isValidDropNew } from '../utils/gameUtils';
import { Card, GameState, Player } from '../types/game';
import { RootState } from '../state/store';
import '../styles/GameBoard.css';

const GameBoard: React.FC = () => {
  const dispatch = useGameDispatch();
  const boardRef = useRef<HTMLDivElement>(null);

  const {
    board,
    players,
    activePlayerId,
    selectedCard,
    draggedCard,
    cardsRemaining,
  } = useSelector((state: RootState) => state.game);

  const activePlayer = players.find(p => p.id === activePlayerId);

  if (!activePlayer) {
    return (
      <div className="game-error">
        <h2>Error: Unable to find active player</h2>
        <p>Please try refreshing the game.</p>
      </div>
    );
  }

  const handleCardSelect = (index: number) => {
    const card = activePlayer.hand[index];
    if (card) {
      dispatch(gameActions.selectCard(card));
    }
  };

  const handleCardDragStart = (card: Card) => {
    console.log(' Card drag started in GameBoard:', card);
    dispatch(gameActions.dragCard(card));
  };

  const handleBoardClick = (row: number, col: number) => {
    const position = `${row},${col}`;
    console.log(' Board cell clicked:', { row, col, position });
    
    // Convert board object to array format for validation
    const boardArray = new Array(9 * 9).fill(null);
    Object.entries(board).forEach(([pos, card]) => {
      const [r, c] = pos.split(',').map(Number);
      boardArray[r * 9 + c] = card;
    });
    
    if ((selectedCard || draggedCard) && isValidDropNew(boardArray, row * 9 + col, selectedCard || draggedCard)) {
      console.log(' Placing card via click:', { card: selectedCard || draggedCard });
      dispatch(gameActions.placeCard({ position, card: selectedCard || draggedCard }));
    }
  };

  const handleCellDrop = (row: number, col: number, droppedCard: Card) => {
    const position = `${row},${col}`;
    console.log(' Cell drop handler:', { row, col, position, droppedCard });
    
    const cardInHand = activePlayer.hand.find(c => c.cardId === droppedCard.cardId);
    console.log(' Found card in hand:', cardInHand);
    
    // Convert board object to array format for validation
    const boardArray = new Array(9 * 9).fill(null);
    Object.entries(board).forEach(([pos, card]) => {
      const [r, c] = pos.split(',').map(Number);
      boardArray[r * 9 + c] = card;
    });
    
    if (cardInHand && isValidDropNew(boardArray, row * 9 + col, cardInHand)) {
      console.log(' Placing card via drop', droppedCard);
      dispatch(gameActions.placeCard({ position, card: cardInHand }));
    } else {
      console.log(' Drop rejected:', { 
        hasCard: !!cardInHand, 
        isValid: cardInHand ? isValidDropNew(boardArray, row * 9 + col, cardInHand) : false 
      });
    }
  };

  // Render board grid
  const renderBoard = () => {
    const validPositions = getValidPositions(selectedCard || draggedCard, board);
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
            card={board[position] || null}
            isValidPlacement={validPositions.has(position)}
            onClick={() => handleBoardClick(row, col)}
            onDrop={(droppedCard) => handleCellDrop(row, col, droppedCard)}
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
      {/* Main game area */}
      <div className="game-main">
        <div ref={boardRef} className="game-board">
          {renderBoard()}
        </div>

        <PlayerHand
          cards={activePlayer.hand}
          selectedCard={selectedCard}
          onCardSelect={handleCardSelect}
          onCardDragStart={handleCardDragStart}
          playerName={activePlayer.name}
        />
      </div>

      {/* Right sidebar */}
      <div className="game-sidebar">
        <DeckDisplay cardsRemaining={cardsRemaining} />
        <PlayerList players={players} activePlayerId={activePlayerId} />
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