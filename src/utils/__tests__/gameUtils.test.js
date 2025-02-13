import { pathsMatch, haveConnectingPath, hasPathToStart, isValidDrop } from '../gameUtils';
import { DIRECTIONS, SPECIAL_CARDS, BOARD_SIZE } from '../../constants/gameConstants';

describe('pathsMatch', () => {
  test('should return true when both cards have connecting paths', () => {
    const card1 = { paths: [[DIRECTIONS.RIGHT]] }; // right only
    const card2 = { paths: [[DIRECTIONS.LEFT]] };  // left only
    expect(pathsMatch(card1, card2, DIRECTIONS.RIGHT)).toBe(true);
  });

  test('should return true when neither card has a path in connecting direction', () => {
    const card1 = { paths: [[DIRECTIONS.TOP]] };    // top only
    const card2 = { paths: [[DIRECTIONS.BOTTOM]] }; // bottom only
    expect(pathsMatch(card1, card2, DIRECTIONS.RIGHT)).toBe(true); // checking right-left connection
  });

  test('should return false when only one card has a connecting path', () => {
    const card1 = { paths: [[DIRECTIONS.RIGHT]] }; // right only
    const card2 = { paths: [[DIRECTIONS.TOP]] };   // top only
    expect(pathsMatch(card1, card2, DIRECTIONS.RIGHT)).toBe(false);
  });
});

describe('haveConnectingPath', () => {
  test('should return true when cards have directly connecting paths', () => {
    const card1 = { paths: [[DIRECTIONS.RIGHT]] }; // right only
    const card2 = { paths: [[DIRECTIONS.LEFT]] };  // left only
    expect(haveConnectingPath(card1, card2, DIRECTIONS.RIGHT)).toBe(true);
  });

  test('should return false when paths dont connect', () => {
    const card1 = { paths: [[DIRECTIONS.TOP]] };    // top only
    const card2 = { paths: [[DIRECTIONS.BOTTOM]] }; // bottom only
    expect(haveConnectingPath(card1, card2, DIRECTIONS.RIGHT)).toBe(false);
  });

  test('should return false when only one card has a path', () => {
    const card1 = { paths: [[DIRECTIONS.RIGHT]] }; // right only
    const card2 = { paths: [[DIRECTIONS.TOP]] };   // top only
    expect(haveConnectingPath(card1, card2, DIRECTIONS.RIGHT)).toBe(false);
  });
});

describe('hasPathToStart', () => {
  const createBoard = (size) => Array(size * size).fill(null);
  
  test('should return true for card directly connected to start', () => {
    const board = createBoard(BOARD_SIZE);
    const startCard = { id: SPECIAL_CARDS.START, paths: [[DIRECTIONS.RIGHT]] };
    const newCard = { paths: [[DIRECTIONS.LEFT]] };
    
    // Place start card in center
    const centerIndex = Math.floor((BOARD_SIZE * BOARD_SIZE) / 2);
    board[centerIndex] = startCard;
    
    // Try to place card to the right of start
    const rightIndex = centerIndex + 1;
    expect(hasPathToStart(board, rightIndex, newCard)).toBe(true);
  });

  test('should return false for card not connected to start', () => {
    const board = createBoard(BOARD_SIZE);
    const startCard = { id: SPECIAL_CARDS.START, paths: [[DIRECTIONS.RIGHT]] };
    const newCard = { paths: [[DIRECTIONS.RIGHT]] }; // points away from start
    
    // Place start card in center
    const centerIndex = Math.floor((BOARD_SIZE * BOARD_SIZE) / 2);
    board[centerIndex] = startCard;
    
    // Try to place card to the right of start
    const rightIndex = centerIndex + 1;
    expect(hasPathToStart(board, rightIndex, newCard)).toBe(false);
  });

  test('should return true for chain of connected cards to start', () => {
    const board = createBoard(BOARD_SIZE);
    const startCard = { id: SPECIAL_CARDS.START, paths: [[DIRECTIONS.RIGHT]] };
    const middleCard = { paths: [[DIRECTIONS.LEFT, DIRECTIONS.RIGHT]] };
    const newCard = { paths: [[DIRECTIONS.LEFT]] };
    
    // Place start card in center
    const centerIndex = Math.floor((BOARD_SIZE * BOARD_SIZE) / 2);
    board[centerIndex] = startCard;
    
    // Place middle card to the right of start
    const middleIndex = centerIndex + 1;
    board[middleIndex] = middleCard;
    
    // Try to place card to the right of middle card
    const rightIndex = middleIndex + 1;
    expect(hasPathToStart(board, rightIndex, newCard)).toBe(true);
  });

  test('should return false for broken chain of cards', () => {
    const board = createBoard(BOARD_SIZE);
    const startCard = { id: SPECIAL_CARDS.START, paths: [[DIRECTIONS.RIGHT]] };
    const middleCard = { paths: [[DIRECTIONS.TOP, DIRECTIONS.BOTTOM]] }; // vertical only
    const newCard = { paths: [[DIRECTIONS.LEFT]] };
    
    // Place start card in center
    const centerIndex = Math.floor((BOARD_SIZE * BOARD_SIZE) / 2);
    board[centerIndex] = startCard;
    
    // Place middle card to the right of start
    const middleIndex = centerIndex + 1;
    board[middleIndex] = middleCard;
    
    // Try to place card to the right of middle card
    const rightIndex = middleIndex + 1;
    expect(hasPathToStart(board, rightIndex, newCard)).toBe(false);
  });
});

describe('isValidDrop', () => {
  const createBoard = (size) => Array(size * size).fill(null);
  
  test('should return false when dropping on an occupied space', () => {
    const board = createBoard(BOARD_SIZE);
    const existingCard = { paths: [[DIRECTIONS.TOP]] };
    const newCard = { paths: [[DIRECTIONS.BOTTOM]] };
    
    board[0] = existingCard;
    expect(isValidDrop(board, 0, newCard)).toBe(false);
  });

  test('should return false when not adjacent to any non-destination card', () => {
    const board = createBoard(BOARD_SIZE);
    const newCard = { paths: [[DIRECTIONS.TOP]] };
    
    expect(isValidDrop(board, 0, newCard)).toBe(false);
  });

  test('should return true for valid placement next to start with connecting path', () => {
    const board = createBoard(BOARD_SIZE);
    const startCard = { id: SPECIAL_CARDS.START, paths: [[DIRECTIONS.RIGHT]] };
    const newCard = { paths: [[DIRECTIONS.LEFT]] };
    
    // Place start card in center
    const centerIndex = Math.floor((BOARD_SIZE * BOARD_SIZE) / 2);
    board[centerIndex] = startCard;
    
    // Try to place card to the right of start
    const rightIndex = centerIndex + 1;
    expect(isValidDrop(board, rightIndex, newCard)).toBe(true);
  });

  test('should return false for invalid path connection', () => {
    const board = createBoard(BOARD_SIZE);
    const startCard = { id: SPECIAL_CARDS.START, paths: [[DIRECTIONS.RIGHT]] };
    const newCard = { paths: [[DIRECTIONS.RIGHT]] }; // points away from start
    
    // Place start card in center
    const centerIndex = Math.floor((BOARD_SIZE * BOARD_SIZE) / 2);
    board[centerIndex] = startCard;
    
    // Try to place card to the right of start
    const rightIndex = centerIndex + 1;
    expect(isValidDrop(board, rightIndex, newCard)).toBe(false);
  });
});
