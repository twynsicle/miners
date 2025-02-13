import React, { useRef } from 'react';
import BoardCell from './BoardCell';
import PlayerHand from './PlayerHand';
import PlayerList from './PlayerList';
import { STYLES } from '../constants/gameConstants';
import * as gameUtils from '../utils/gameUtils';
import { DeckDisplay } from './Deck';
import { useGameState, useGameDispatch, gameActions } from '../state/GameStateContext';
import '../styles/GameBoard.css';

const GameBoard = () => {
  const {
    board,
    selectedCard,
    draggedCard,
    cardsRemaining,
    players,
    activePlayerId
  } = useGameState();
  const dispatch = useGameDispatch();
  const boardRef = useRef(null);

  // Convert board object to array format for validation
  const getBoardArray = () => {
    const boardArray = Array(81).fill(null);
    Object.entries(board).forEach(([pos, card]) => {
      const [row, col] = pos.split(',').map(Number);
      boardArray[row * 9 + col] = card;
    });
    return boardArray;
  };

  // Check if a position is a valid drop target for a card
  const isValidDrop = (position, card) => {
    if (!card) return false;
    
    const [row, col] = position.split(',').map(Number);
    const boardArray = getBoardArray();
    
    return gameUtils.isValidDrop(boardArray, row * 9 + col, card);
  };

  // Get all valid positions for the selected card
  const getValidPositions = (card) => {
    if (!card) return new Set();
    
    const validPositions = new Set();
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const position = `${row},${col}`;
        if (isValidDrop(position, card)) {
          validPositions.add(position);
        }
      }
    }
    return validPositions;
  };

  const handleCardSelect = (index) => {
    const activePlayer = players.find(p => p.id === activePlayerId);
    const card = activePlayer.hand[index];
    dispatch(gameActions.selectCard(card));
  };

  const handleCardDragStart = (card) => {
    console.log('🎮 Card drag started in GameBoard:', card);
    dispatch(gameActions.dragCard(card));
  };

  const handleBoardClick = (row, col) => {
    const position = `${row},${col}`;
    console.log('🎮 Board cell clicked:', { row, col, position });
    if ((selectedCard || draggedCard) && isValidDrop(position, selectedCard || draggedCard)) {
      console.log('🎮 Placing card via click:', { card: selectedCard || draggedCard });
      dispatch(gameActions.placeCard(position, selectedCard || draggedCard));
    }
  };

  const handleCellDrop = (row, col, droppedCard) => {
    const position = `${row},${col}`;
    console.log('🎮 Cell drop handler:', { row, col, position, droppedCard });
    
    const activePlayer = players.find(p => p.id === activePlayerId);
    console.log('🎮 Active player hand:', activePlayer.hand);
    
    const cardInHand = activePlayer.hand.find(c => c.cardId === droppedCard.cardId);
    console.log('🎮 Found card in hand:', cardInHand);
    
    if (cardInHand && isValidDrop(position, cardInHand)) {
      console.log('🎮 Placing card via drop');
      dispatch(gameActions.placeCard(position, cardInHand));
    } else {
      console.log('🎮 Drop rejected:', { 
        hasCard: !!cardInHand, 
        isValid: cardInHand ? isValidDrop(position, cardInHand) : false 
      });
    }
  };

  const activePlayer = players.find(p => p.id === activePlayerId);

  // Render board grid
  const renderBoard = () => {
    const validPositions = getValidPositions(selectedCard || draggedCard);
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
            card={board[position]}
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