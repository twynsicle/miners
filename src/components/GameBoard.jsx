import React, { useState, useRef } from 'react';
import { useDrop } from 'react-dnd';
import BoardCell from './BoardCell';
import PlayerHand from './PlayerHand';
import PlayerList from './PlayerList';
import { BOARD_SIZE, SPECIAL_CARDS, STYLES, DIRECTIONS, PLAYERS } from '../constants/gameConstants';
import { isValidDrop } from '../utils/gameUtils';
import { generateRandomCard } from '../utils/cardUtils';

const BOARD_PADDING = 20;
const HAND_SIZE = 6;
const DESTINATION_POSITIONS = [
  { row: 1, col: 2 }, // Column 3
  { row: 1, col: 4 }, // Column 5
  { row: 1, col: 6 }  // Column 7
];

/**
 * Main game board component
 */
const GameBoard = () => {
  const [board, setBoard] = useState(Array(BOARD_SIZE * BOARD_SIZE).fill(null));
  const [playerHands, setPlayerHands] = useState(
    PLAYERS.reduce((hands, player) => ({
      ...hands,
      [player.id]: Array.from({ length: HAND_SIZE }, generateRandomCard)
    }), {})
  );
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [draggedCard, setDraggedCard] = useState(null);
  const [activePlayerId, setActivePlayerId] = useState(PLAYERS[0].id);
  const boardRef = useRef(null);

  // Initialize the board with start card and destinations
  React.useEffect(() => {
    setBoard(prev => {
      const newBoard = [...prev];
      
      // Place start card in center of row 8 (index 7)
      const startRow = 7;
      const startCol = Math.floor(BOARD_SIZE / 2);
      const startIndex = startRow * BOARD_SIZE + startCol;
      newBoard[startIndex] = {
        id: SPECIAL_CARDS.START,
        paths: [[DIRECTIONS.TOP, DIRECTIONS.RIGHT, DIRECTIONS.BOTTOM, DIRECTIONS.LEFT]]
      };

      // Place destination cards
      DESTINATION_POSITIONS.forEach((pos, i) => {
        const index = pos.row * BOARD_SIZE + pos.col;
        newBoard[index] = {
          id: `${SPECIAL_CARDS.DEST_PREFIX}${i + 1}`,
          paths: [[DIRECTIONS.TOP, DIRECTIONS.BOTTOM]] // Vertical paths for destinations
        };
      });

      return newBoard;
    });
  }, []);

  // Move to next player's turn
  const nextTurn = () => {
    const currentPlayerIndex = PLAYERS.findIndex(p => p.id === activePlayerId);
    const nextPlayerIndex = (currentPlayerIndex + 1) % PLAYERS.length;
    setActivePlayerId(PLAYERS[nextPlayerIndex].id);
    setSelectedCardIndex(null);
  };

  // Handle card selection from hand
  const handleCardSelect = (index) => {
    setSelectedCardIndex(selectedCardIndex === index ? null : index);
  };

  // Calculate board index from mouse coordinates
  const getBoardIndexFromXY = (x, y) => {
    const rect = boardRef.current.getBoundingClientRect();
    const cellWidth = parseInt(STYLES.CELL_WIDTH);
    const cellHeight = parseInt(STYLES.CELL_HEIGHT);
    const gap = parseInt(STYLES.CELL_GAP);
    
    // Account for padding and gap in position calculation
    const relativeX = x - (rect.left + BOARD_PADDING);
    const relativeY = y - (rect.top + BOARD_PADDING);
    
    // Calculate board position including gaps
    const boardX = Math.floor(relativeX / (cellWidth + gap));
    const boardY = Math.floor(relativeY / (cellHeight + gap));
    
    // Ensure we're within bounds
    if (boardX >= 0 && boardX < BOARD_SIZE && boardY >= 0 && boardY < BOARD_SIZE) {
      return boardY * BOARD_SIZE + boardX;
    }
    return -1; // Invalid position
  };

  // Handle clicking a cell to place a card
  const handleCellClick = (index) => {
    if (selectedCardIndex === null) return;
    
    const activeHand = playerHands[activePlayerId];
    const cardToPlace = activeHand[selectedCardIndex];
    
    if (isValidDrop(board, index, cardToPlace)) {
      // Place the card
      setBoard(prev => {
        const newBoard = [...prev];
        newBoard[index] = cardToPlace;
        return newBoard;
      });
      
      // Remove card from hand and add a new one
      setPlayerHands(prev => ({
        ...prev,
        [activePlayerId]: prev[activePlayerId].map((card, i) => 
          i === selectedCardIndex ? generateRandomCard() : card
        )
      }));
      
      // Move to next player's turn
      nextTurn();
    }
  };

  // Handle drag and drop
  const [, drop] = useDrop(() => ({
    accept: 'card',
    hover: (item, monitor) => {
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      
      const index = getBoardIndexFromXY(clientOffset.x, clientOffset.y);
      if (index !== -1) {
        setDraggedCard(item);
      } else {
        setDraggedCard(null);
      }
    },
    drop: (item, monitor) => {
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      
      const index = getBoardIndexFromXY(clientOffset.x, clientOffset.y);
      if (index !== -1 && isValidDrop(board, index, item)) {
        setBoard(prev => {
          const newBoard = [...prev];
          newBoard[index] = item;
          return newBoard;
        });
        
        // Replace the dragged card with a new one
        setPlayerHands(prev => ({
          ...prev,
          [activePlayerId]: prev[activePlayerId].map(card => 
            card.id === item.id ? generateRandomCard() : card
          )
        }));
        
        // Move to next player's turn
        nextTurn();
      }
      setDraggedCard(null);
    }
  }), [board, activePlayerId]);

  const activePlayer = PLAYERS.find(p => p.id === activePlayerId);

  return (
    <div style={{ 
      display: 'flex', 
      padding: '20px',
      gap: '20px'
    }}>
      <PlayerList 
        players={PLAYERS}
        activePlayerId={activePlayerId}
      />
      
      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>Current Player: {activePlayer.name}</h2>
        </div>
        
        <div
          id="game-board"
          ref={ref => {
            drop(ref);
            boardRef.current = ref;
          }}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${BOARD_SIZE}, ${STYLES.CELL_WIDTH})`,
            gap: STYLES.CELL_GAP,
            padding: `${BOARD_PADDING}px`,
            backgroundColor: '#e0e0e0',
            borderRadius: '10px',
            margin: '0 auto'
          }}
        >
          {board.map((card, index) => {
            const isValidPlacement = (selectedCardIndex !== null && isValidDrop(board, index, playerHands[activePlayerId][selectedCardIndex])) ||
                                   (draggedCard && isValidDrop(board, index, draggedCard));

            return (
              <BoardCell
                key={index}
                card={card}
                isValidPlacement={isValidPlacement}
                onClick={() => handleCellClick(index)}
              />
            );
          })}
        </div>

        <PlayerHand
          cards={playerHands[activePlayerId]}
          selectedCardIndex={selectedCardIndex}
          onCardSelect={handleCardSelect}
          onCardDragStart={setDraggedCard}
          playerName={activePlayer.name}
        />
      </div>
    </div>
  );
};
export default GameBoard;