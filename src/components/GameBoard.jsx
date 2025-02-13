import React, { useRef } from 'react';
import BoardCell from './BoardCell';
import PlayerHand from './PlayerHand';
import { STYLES } from '../constants/gameConstants';
import * as gameUtils from '../utils/gameUtils';
import { DeckDisplay } from './Deck';
import { useGameState, useGameDispatch, gameActions } from '../state/GameStateContext';

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
    dispatch(gameActions.dragCard(card));
  };

  const handleBoardClick = (row, col) => {
    const position = `${row},${col}`;
    if ((selectedCard || draggedCard) && isValidDrop(position, selectedCard || draggedCard)) {
      dispatch(gameActions.placeCard(position, selectedCard || draggedCard));
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
        cells.push(
          <BoardCell
            key={position}
            card={board[position]}
            isValidPlacement={validPositions.has(position)}
            onClick={() => handleBoardClick(row, col)}
          />
        );
      }
      rows.push(
        <div key={row} style={{ display: 'flex', gap: STYLES.CELL_GAP }}>
          {cells}
        </div>
      );
    }
    return rows;
  };

  return (
    <div className="game-container" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      minHeight: '100vh',
      backgroundColor: STYLES.GAME_BG,
      position: 'relative'
    }}>
      <DeckDisplay cardsRemaining={cardsRemaining} />
      
      <div 
        ref={boardRef}
        className="game-board"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: STYLES.CELL_GAP,
          padding: '20px',
          backgroundColor: STYLES.BOARD_BG,
          borderRadius: '10px',
          margin: '0 auto',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
        }}
      >
        {renderBoard()}
      </div>

      <PlayerHand
        cards={activePlayer.hand}
        selectedCard={selectedCard}
        onCardSelect={handleCardSelect}
        onCardDragStart={handleCardDragStart}
        playerName={activePlayer.name}
      />

      <button
        onClick={() => dispatch(gameActions.resetGame())}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          padding: '10px 20px',
          backgroundColor: '#ff4444',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontWeight: 'bold',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          transition: 'background-color 0.2s',
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#ff6666'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#ff4444'}
      >
        Reset Game
      </button>
    </div>
  );
};

export default GameBoard;