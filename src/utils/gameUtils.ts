import { BOARD_SIZE, DIRECTIONS, SPECIAL_CARDS } from '../constants/gameConstants';
import { Card, PathType, PathsType } from '../types/game';

/**
 * @typedef {Object} Card
 * @property {string} id - Unique identifier for the card
 * @property {number[][]} paths - Array of path arrays, each containing directions (0-3)
 */

/**
 * @typedef {Object} AdjacentCard
 * @property {number} index - Board index of the card
 * @property {Card} card - The card object
 * @property {number} direction - Direction from the original position (0-3)
 */

/**
 * Get indices of adjacent cells on the board
 * @param {number} index - Current cell index
 * @returns {number[]} Array of adjacent cell indices
 */
export const getAdjacentIndices = (index: number): number[] => {
  const row = Math.floor(index / BOARD_SIZE);
  const col = index % BOARD_SIZE;
  const adjacent: number[] = [];

  if (row > 0) adjacent.push(index - BOARD_SIZE); // Top
  if (row < BOARD_SIZE - 1) adjacent.push(index + BOARD_SIZE); // Bottom
  if (col > 0) adjacent.push(index - 1); // Left
  if (col < BOARD_SIZE - 1) adjacent.push(index + 1); // Right

  return adjacent;
};

/**
 * Check if a card is a destination card
 * @param {Object} card - Card to check
 * @returns {boolean} - Whether the card is a destination
 */
const isDestinationCard = (card: Card): boolean => {
  return card.type === 'dest' || 
         (typeof card.id === 'string' && card.id.startsWith(SPECIAL_CARDS.DEST_PREFIX));
};

/**
 * Get the opposite direction
 * @param {number} direction - Direction to get opposite of
 * @returns {number} - Opposite direction
 */
const getOppositeDirection = (direction: number): number => {
  switch (direction) {
    case DIRECTIONS.TOP: return DIRECTIONS.BOTTOM;
    case DIRECTIONS.RIGHT: return DIRECTIONS.LEFT;
    case DIRECTIONS.BOTTOM: return DIRECTIONS.TOP;
    case DIRECTIONS.LEFT: return DIRECTIONS.RIGHT;
    default: return -1;
  }
};

/**
 * Check if two cards have paths that match (either both have paths or neither has paths)
 * @param {Object} card1 - First card
 * @param {Object} card2 - Second card
 * @param {number} direction - Direction from card1 to card2
 * @returns {boolean} - Whether the paths match
 */
export function pathsMatch(card1: Card, card2: Card, direction: number): boolean {
  if (!card1 || !card2) return false;
  
  // Skip path matching for destination cards
  if (isDestinationCard(card2)) {
    return true;
  }
  
  const oppositeDirection = getOppositeDirection(direction);
  
  // Check if both cards have paths in the connecting directions
  const card1HasPath = card1.paths.some(path => path.includes(direction));
  const card2HasPath = card2.paths.some(path => path.includes(oppositeDirection));
  
  // Both cards must have connecting paths
  return card1HasPath && card2HasPath;
}

/**
 * Check if two cards have a connecting path between them
 * @param {Object} card1 - First card
 * @param {Object} card2 - Second card
 * @param {number} direction - Direction from card1 to card2
 * @returns {boolean} - Whether the cards have a connecting path
 */
export function haveConnectingPath(card1: Card, card2: Card, direction: number): boolean {
  if (!card1 || !card2) return false;
  
  // Skip path matching for destination cards
  if (isDestinationCard(card2)) {
    return true;
  }
  
  const oppositeDirection = getOppositeDirection(direction);
  
  // Check if both cards have paths in the connecting directions
  const card1HasPath = card1.paths.some(path => path.includes(direction));
  const card2HasPath = card2.paths.some(path => path.includes(oppositeDirection));
  
  return card1HasPath && card2HasPath;
}

/**
 * Get adjacent card positions for a given position
 * @param {number} position - Position to get adjacents for
 * @param {number} boardSize - Size of the board
 * @returns {Object} - Map of directions to adjacent positions
 */
function getAdjacentPositions(position: number, boardSize: number): { [key: number]: number } {
  const row = Math.floor(position / boardSize);
  const col = position % boardSize;
  const adjacents: { [key: number]: number } = {};
  
  // Check top
  if (row > 0) {
    adjacents[DIRECTIONS.TOP] = position - boardSize;
  }
  
  // Check right
  if (col < boardSize - 1) {
    adjacents[DIRECTIONS.RIGHT] = position + 1;
  }
  
  // Check bottom
  if (row < boardSize - 1) {
    adjacents[DIRECTIONS.BOTTOM] = position + boardSize;
  }
  
  // Check left
  if (col > 0) {
    adjacents[DIRECTIONS.LEFT] = position - 1;
  }
  
  return adjacents;
}

/**
 * Check if a card has a path back to the start
 * @param {Array} board - Game board
 * @param {number} position - Position to check from
 * @param {Object} card - Card to check
 * @returns {boolean} - Whether there is a path to start
 */
export function hasPathToStart(board: (Card | null)[], position: number, card: Card): boolean {
  if (!card) return false;
  
  const boardSize = Math.sqrt(board.length);
  const visited: Set<number> = new Set();
  const toVisit: number[] = [position];
  
  while (toVisit.length > 0) {
    const currentPos = toVisit.pop() as number;
    if (visited.has(currentPos)) continue;
    visited.add(currentPos);
    
    const currentCard = currentPos === position ? card : board[currentPos];
    if (!currentCard) continue;
    
    // If we found the start card, we have a path
    if (currentCard.type === 'start' || currentCard.id === SPECIAL_CARDS.START) {
      return true;
    }
    
    // Get adjacent positions
    const adjacents = getAdjacentPositions(currentPos, boardSize);
    
    // Check each adjacent position
    Object.entries(adjacents).forEach(([direction, adjPos]) => {
      const adjCard = board[adjPos];
      if (!adjCard || visited.has(adjPos)) return;
      
      // Check if the cards connect
      if (haveConnectingPath(currentCard, adjCard, Number(direction))) {
        toVisit.push(adjPos);
      }
    });
  }
  
  return false;
}

/**
 * Check if a card can be placed at a position
 * @param {Array} board - Game board
 * @param {number} position - Position to check
 * @param {Object} card - Card to check
 * @returns {boolean} - Whether the card can be placed
 */
export function isValidDrop(board: (Card | null)[], position: number, card: Card): boolean {
  console.log('testing valid drop', position, card.paths)
  if (!card || board[position]) return false;
  
  const boardSize = Math.sqrt(board.length);
  const adjacents = getAdjacentPositions(position, boardSize);
  
  // Must be adjacent to at least one non-destination card
  let hasAdjacentCard = false;
  
  // Check each adjacent position
  for (const [direction, adjPos] of Object.entries(adjacents)) {
    const adjCard = board[adjPos];
    if (!adjCard) continue;
    
    // Skip destination cards for adjacency check
    if (isDestinationCard(adjCard)) continue;
    
    hasAdjacentCard = true;
    
    // Check if paths match with adjacent card
    if (!pathsMatch(card, adjCard, Number(direction))) {
      console.log('Failed path match:', card, adjCard, direction);
      return false;
    }
  }
  
  // Must be adjacent to at least one card and have a path to start
  const isValid = hasAdjacentCard && hasPathToStart(board, position, card);
  console.log('isValidDrop:', position, card, isValid);
  return isValid;
}

/**
 * Get a random integer between min and max (inclusive)
 */
export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Get a random element from an array
 */
export function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Check if a path is valid by comparing it with a target path
 */
export function isValidPath(path: PathType, targetPath: PathType): boolean {
  if (path.length !== targetPath.length) return false;
  return path.every((value, index) => value === targetPath[index]);
}

/**
 * Check if two paths are equal
 */
export function arePathsEqual(path1: PathType, path2: PathType): boolean {
  if (path1.length !== path2.length) return false;
  return path1.every((value, index) => value === path2[index]);
}

/**
 * Check if a card's paths match with the paths at a given position
 */
export function doPathsMatch(paths1: PathsType, paths2: PathsType): boolean {
  if (paths1.length !== paths2.length) return false;
  return paths1.every((path1) => 
    paths2.some((path2) => arePathsEqual(path1, path2))
  );
}

/**
 * Get the filename for a card's image based on its paths and type
 */
export function getCardImageFilename(paths: PathsType, type: string, id?: string): string {
  if (type === 'start') return 'start.png';
  if (type === 'dest') return `dest${id}.png`;
  
  // For regular cards, use the path pattern
  if (Array.isArray(paths[0])) {
    return paths.map(p => Array.isArray(p) ? p.join('-') : p).join('_') + '.png';
  }
  return paths.join('-') + '.png';
}

/**
 * Get neighboring positions for a given position
 */
export function getNeighbors(position: number, boardSize: number): number[] {
  const row = Math.floor(position / boardSize);
  const col = position % boardSize;
  const neighbors: number[] = [];

  // Up
  if (row > 0) neighbors.push(position - boardSize);
  // Right
  if (col < boardSize - 1) neighbors.push(position + 1);
  // Down
  if (row < boardSize - 1) neighbors.push(position + boardSize);
  // Left
  if (col > 0) neighbors.push(position - 1);

  return neighbors;
}

/**
 * Check if a card can be placed at a given position
 */
export function isValidDropNew(board: (Card | null)[], position: number, card: Card): boolean {
  // If no card or position is occupied, invalid
  if (!card || board[position]) return false;
  
  const boardSize = Math.sqrt(board.length);
  const neighbors = getNeighbors(position, boardSize);
  
  // At least one neighbor must be occupied (except for start card)
  if (card.type !== 'start') {
    const hasOccupiedNeighbor = neighbors.some(pos => {
      const neighborCard = board[pos];
      return neighborCard && !isDestinationCard(neighborCard);
    });
    if (!hasOccupiedNeighbor) return false;
  }
  
  // Check if paths match with all neighbors
  const pathsMatch = neighbors.every(neighborPos => {
    const neighborCard = board[neighborPos];
    if (!neighborCard) return true; // Empty neighbor is valid
    
    // Get the direction from current position to neighbor
    const direction = getDirection(position, neighborPos, boardSize);
    
    // Check if the paths match in this direction
    return pathsMatchInDirection(card.paths, neighborCard.paths, direction);
  });
  
  if (!pathsMatch) return false;
  
  // Create a temporary board with the new card for path checking
  const tempBoard = [...board];
  tempBoard[position] = card;
  
  // Check if there's a valid path back to start
  return hasPathToStart(tempBoard, position, card);
}

/**
 * Get the direction from one position to another
 */
function getDirection(from: number, to: number, boardSize: number): 'up' | 'right' | 'down' | 'left' {
  if (to === from - boardSize) return 'up';
  if (to === from + 1) return 'right';
  if (to === from + boardSize) return 'down';
  return 'left';
}

/**
 * Check if two sets of paths match in a given direction
 */
function pathsMatchInDirection(paths1: PathsType, paths2: PathsType, direction: string): boolean {
  // TODO: Implement path matching logic based on direction
  return true; // Placeholder
}

/**
 * Get all valid positions for a card on the board
 */
export function getValidPositions(card: Card | null, currentBoard: { [key: string]: Card }): Set<string> {
  if (!card) return new Set();
  
  // Convert the board object to an array format
  const boardArray: (Card | null)[] = new Array(BOARD_SIZE * BOARD_SIZE).fill(null);
  Object.entries(currentBoard).forEach(([position, card]) => {
    const [row, col] = position.split(',').map(Number);
    boardArray[row * BOARD_SIZE + col] = card;
  });
  
  const validPositions: Set<string> = new Set();
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const position = `${row},${col}`;
      if (isValidDropNew(boardArray, row * BOARD_SIZE + col, card)) {
        validPositions.add(position);
      }
    }
  }
  return validPositions;
}
