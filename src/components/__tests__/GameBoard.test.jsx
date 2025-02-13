import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import GameBoard from '../GameBoard';
import { BOARD_SIZE, PLAYERS } from '../../constants/gameConstants';

const renderWithDnd = (ui) => {
  return render(
    <DndProvider backend={HTML5Backend}>
      {ui}
    </DndProvider>
  );
};

describe('GameBoard', () => {
  it('renders without crashing', () => {
    const { container } = renderWithDnd(<GameBoard />);
    expect(container).toBeInTheDocument();
  });

  it('displays current player name', () => {
    const { getByText } = renderWithDnd(<GameBoard />);
    const firstPlayer = PLAYERS[0];
    expect(getByText(`Current Player: ${firstPlayer.name}`)).toBeInTheDocument();
    expect(getByText(`${firstPlayer.name}'s Hand`)).toBeInTheDocument();
  });

  it('renders player list with all players', () => {
    const { getByText } = renderWithDnd(<GameBoard />);
    PLAYERS.forEach(player => {
      expect(getByText(player.name)).toBeInTheDocument();
      expect(getByText(`Score: ${player.score}`)).toBeInTheDocument();
    });
  });

  it('shows active player indicator', () => {
    const { container } = renderWithDnd(<GameBoard />);
    const playerElements = container.querySelectorAll('[style*="borderLeft"]');
    const activePlayerElement = Array.from(playerElements).find(el => 
      el.style.borderLeft.includes('solid')
    );
    expect(activePlayerElement).toBeInTheDocument();
  });

  it('renders correct number of cells', () => {
    const { container } = renderWithDnd(<GameBoard />);
    const cells = container.querySelectorAll('#game-board > div');
    expect(cells.length).toBe(BOARD_SIZE * BOARD_SIZE);
  });

  it('initializes start card in correct position', () => {
    const { container } = renderWithDnd(<GameBoard />);
    const cells = container.querySelectorAll('#game-board > div');
    const startRow = 7;
    const startCol = Math.floor(BOARD_SIZE / 2);
    const startIndex = startRow * BOARD_SIZE + startCol;
    const startCell = cells[startIndex];
    expect(startCell.querySelector('img')).toBeInTheDocument();
  });

  it('initializes destination cards in correct positions', () => {
    const { container } = renderWithDnd(<GameBoard />);
    const cells = container.querySelectorAll('#game-board > div');
    const destinationPositions = [
      { row: 1, col: 2 }, // Column 3
      { row: 1, col: 4 }, // Column 5
      { row: 1, col: 6 }  // Column 7
    ];

    destinationPositions.forEach(({ row, col }) => {
      const index = row * BOARD_SIZE + col;
      const cell = cells[index];
      expect(cell.querySelector('img')).toBeInTheDocument();
    });
  });

  it('initializes player hand with 6 cards', () => {
    const { container } = renderWithDnd(<GameBoard />);
    const handCards = container.querySelectorAll('.player-hand img');
    expect(handCards.length).toBe(6);
  });

  it('moves to next player after placing a card', async () => {
    const { getByText, container } = renderWithDnd(<GameBoard />);
    
    // Get first player's name
    const firstPlayer = PLAYERS[0];
    const secondPlayer = PLAYERS[1];
    
    // Select first card in hand
    const handCards = container.querySelectorAll('.player-hand img');
    fireEvent.click(handCards[0]);
    
    // Click a valid cell on the board
    const cells = container.querySelectorAll('#game-board > div');
    fireEvent.click(cells[65]); // Click a cell near the start card
    
    // Check that it's now the second player's turn
    expect(getByText(`Current Player: ${secondPlayer.name}`)).toBeInTheDocument();
  });
});
