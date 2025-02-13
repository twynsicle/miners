import React, { useState, useEffect, useRef } from 'react';
import { useDrop } from 'react-dnd';
import BoardCell from './BoardCell';
import PlayerHand from './PlayerHand';
import Card from './Card';
import PlayerList from './PlayerList';
import { BOARD_SIZE, SPECIAL_CARDS, STYLES, DIRECTIONS, PLAYERS } from '../constants/gameConstants';
import { isValidDrop } from '../utils/gameUtils';
import { generateRandomCard } from '../utils/cardUtils';
import { Deck, DeckDisplay } from './Deck';

const DESTINATION_POSITIONS = [
  { row: 1, col: 2 }, // Column 3
  { row: 1, col: 4 }, // Column 5
  { row: 1, col: 6 }  // Column 7
];

const GameBoard = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [board, setBoard] = useState({});
  const [playerHand, setPlayerHand] = useState([]);
  const [deck, setDeck] = useState(new Deck());
  const [cardsRemaining, setCardsRemaining] = useState(0);
  const [activePlayerId, setActivePlayerId] = useState(PLAYERS[0].id);
  const [draggedCard, setDraggedCard] = useState(null);
  const boardRef = useRef(null);

  // Initialize the game
  useEffect(() => {
    const newDeck = new Deck();
    setDeck(newDeck);
    setCardsRemaining(newDeck.getCardsRemaining());
    
    // Deal initial hand
    const initialHand = Array(6).fill(null).map(() => {
      const card = newDeck.drawCard();
      console.log('Drew card:', card); // Debug log
      return card;
    }).filter(Boolean); // Remove any null cards
    
    setPlayerHand(initialHand);
    setCardsRemaining(newDeck.getCardsRemaining());
  }, []);

  // Initialize the board with start card and destinations
  useEffect(() => {
    setBoard(prev => {
      const newBoard = { ...prev };
      
      // Place start card in center of row 8 (index 7)
      const startRow = 7;
      const startCol = 4;  // Center column (5th column, index 4)
      const startIndex = `${startRow},${startCol}`;
      newBoard[startIndex] = {
        type: 'start',
        paths: [[DIRECTIONS.TOP, DIRECTIONS.RIGHT, DIRECTIONS.BOTTOM, DIRECTIONS.LEFT]]
      };

      // Place destination cards
      DESTINATION_POSITIONS.forEach((pos, i) => {
        const index = `${pos.row},${pos.col}`;
        newBoard[index] = {
          type: 'dest',
          id: i + 1,
          paths: [[DIRECTIONS.TOP, DIRECTIONS.RIGHT, DIRECTIONS.BOTTOM, DIRECTIONS.LEFT]]
        };
      });

      return newBoard;
    });
  }, []);

  const handleCardClick = (index) => {
    const card = playerHand[index];
    setSelectedCard(selectedCard === card ? null : card);
    setDraggedCard(null);
  };

  const handleBoardClick = (row, col) => {
    const position = `${row},${col}`;
    if ((selectedCard || draggedCard) && isValidDrop(board, position, selectedCard || draggedCard)) {
      // Place the card
      const newBoard = { ...board };
      const cardToPlace = selectedCard || draggedCard;
      newBoard[position] = {
        paths: cardToPlace.paths,
        cardId: cardToPlace.id
      };
      setBoard(newBoard);

      // Remove the card from hand and draw a new one
      const newHand = [...playerHand];
      const cardIndex = playerHand.indexOf(selectedCard || draggedCard);
      const newCard = deck.drawCard();
      newHand[cardIndex] = newCard;
      
      setPlayerHand(newHand);
      setSelectedCard(null);
      setDraggedCard(null);
      setCardsRemaining(deck.getCardsRemaining());
    }
  };

  const [, drop] = useDrop(() => ({
    accept: 'card',
    hover: (item, monitor) => {
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset || !boardRef.current) return;

      const bounds = boardRef.current.getBoundingClientRect();
      const x = clientOffset.x - bounds.left;
      const y = clientOffset.y - bounds.top;
      const cellWidth = parseInt(STYLES.CARD_WIDTH) + parseInt(STYLES.CELL_GAP);
      const cellHeight = parseInt(STYLES.CARD_HEIGHT) + parseInt(STYLES.CELL_GAP);
      const col = Math.floor(x / cellWidth);
      const row = Math.floor(y / cellHeight);

      if (row >= 0 && row < 9 && col >= 0 && col < 9) {
        setDraggedCard(item);
      }
    },
    drop: (item, monitor) => {
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset || !boardRef.current) return;

      const bounds = boardRef.current.getBoundingClientRect();
      const x = clientOffset.x - bounds.left;
      const y = clientOffset.y - bounds.top;
      const cellWidth = parseInt(STYLES.CARD_WIDTH) + parseInt(STYLES.CELL_GAP);
      const cellHeight = parseInt(STYLES.CARD_HEIGHT) + parseInt(STYLES.CELL_GAP);
      const col = Math.floor(x / cellWidth);
      const row = Math.floor(y / cellHeight);

      if (row >= 0 && row < 9 && col >= 0 && col < 9) {
        handleBoardClick(row, col);
      }
    }
  }), [board, selectedCard, draggedCard]);

  const activePlayer = PLAYERS.find(p => p.id === activePlayerId);

  // Render the game board grid
  const renderBoard = () => {
    const cells = [];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const position = `${row},${col}`;
        const card = board[position];
        const isValidPlacement = (selectedCard || draggedCard) && 
          isValidDrop(board, position, selectedCard || draggedCard);

        cells.push(
          <BoardCell
            key={position}
            card={card}
            isValidPlacement={isValidPlacement}
            onClick={() => handleBoardClick(row, col)}
          />
        );
      }
    }
    return cells;
  };

  return (
    <div className="game-container" style={{
      display: 'flex',
      padding: '20px',
      gap: '20px'
    }}>
      <PlayerList 
        players={PLAYERS}
        activePlayerId={activePlayerId}
      />

      <div className="game-board-container">
        <div 
          ref={drop(boardRef)}
          className="game-board"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(9, ${STYLES.CARD_WIDTH})`,
            gridTemplateRows: `repeat(9, ${STYLES.CARD_HEIGHT})`,
            gap: STYLES.CELL_GAP,
            padding: '20px',
            backgroundColor: STYLES.BOARD_BG,
            borderRadius: '10px',
            margin: '0 auto',
            width: 'fit-content'
          }}
        >
          {renderBoard()}
        </div>

        <DeckDisplay cardsRemaining={cardsRemaining} />
        <PlayerHand
          cards={playerHand}
          selectedCard={selectedCard}
          onCardSelect={handleCardClick}
          onCardDragStart={setDraggedCard}
          playerName={activePlayer.name}
        />
      </div>
    </div>
  );
};

export default GameBoard;