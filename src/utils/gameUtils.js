import { BOARD_SIZE, DIRECTIONS, SPECIAL_CARDS } from '../constants/gameConstants';

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
export const getAdjacentIndices = (index) => {
  const row = Math.floor(index / BOARD_SIZE);
  const col = index % BOARD_SIZE;
  const adjacent = [];

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
const isDestinationCard = (card) => {
  return card.type === 'dest' || 
         (typeof card.id === 'string' && card.id.startsWith(SPECIAL_CARDS.DEST_PREFIX));
};

/**
 * Get the opposite direction
 * @param {number} direction - Direction to get opposite of
 * @returns {number} - Opposite direction
 */
const getOppositeDirection = (direction) => {
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
export function pathsMatch(card1, card2, direction) {
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
export function haveConnectingPath(card1, card2, direction) {
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
function getAdjacentPositions(position, boardSize) {
  const row = Math.floor(position / boardSize);
  const col = position % boardSize;
  const adjacents = {};
  
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
export function hasPathToStart(board, position, card) {
  if (!card) return false;
  
  const boardSize = Math.sqrt(board.length);
  const visited = new Set();
  const toVisit = [position];
  
  while (toVisit.length > 0) {
    const currentPos = toVisit.pop();
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
export function isValidDrop(board, position, card) {
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
