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
 * Check if two cards' paths match in the given direction
 * @param {Card} card1 - First card to check
 * @param {Card} card2 - Second card to check
 * @param {number} direction - Direction from card1 to card2 (0-3)
 * @returns {boolean} True if paths match and connect
 */
export const pathsMatch = (card1, card2, direction) => {
  if (!card1 || !card2) return false;
  
  // Skip path matching for destination cards
  if (card2.id?.startsWith(SPECIAL_CARDS.DEST_PREFIX)) return true;
  
  const opposite = (direction + 2) % 4;
  
  // Check if either card has a path in their respective directions
  const card1HasPath = card1.paths.some(path => path.includes(direction));
  const card2HasPath = card2.paths.some(path => path.includes(opposite));
  
  // Both cards should either have paths that connect, or both should not have paths
  return (card1HasPath && card2HasPath) || (!card1HasPath && !card2HasPath);
};

/**
 * Check if two cards have a connecting path between them
 * @param {Card} card1 - First card
 * @param {Card} card2 - Second card
 * @param {number} direction - Direction from card1 to card2
 * @returns {boolean} True if the cards have connecting paths
 */
export const haveConnectingPath = (card1, card2, direction) => {
  if (!card1 || !card2) return false;
  
  const opposite = (direction + 2) % 4;
  
  // For each path in card1, check if it connects to any path in card2
  return card1.paths.some(path1 => {
    if (!path1.includes(direction)) return false;
    return card2.paths.some(path2 => path2.includes(opposite) && 
      // Ensure the paths are part of the same network
      path1.some(dir1 => path2.some(dir2 => 
        (dir1 + 2) % 4 === dir2 && (dir1 === direction || dir2 === opposite)
      ))
    );
  });
};

/**
 * Check if a card can be placed at the given index
 * @param {Card[]} board - Current game board
 * @param {number} index - Target index for card placement
 * @param {Card} card - Card to be placed
 * @returns {boolean} True if placement is valid
 */
export const isValidDrop = (board, index, card) => {
  // Rule 1: Can't place on an occupied space
  if (board[index]) return false;

  // Get adjacent cards and their directions
  const adjacentCards = [
    { dir: DIRECTIONS.TOP, offset: -BOARD_SIZE, valid: index >= BOARD_SIZE },
    { dir: DIRECTIONS.RIGHT, offset: 1, valid: (index % BOARD_SIZE) < (BOARD_SIZE - 1) },
    { dir: DIRECTIONS.BOTTOM, offset: BOARD_SIZE, valid: index < (BOARD_SIZE * (BOARD_SIZE - 1)) },
    { dir: DIRECTIONS.LEFT, offset: -1, valid: (index % BOARD_SIZE) > 0 }
  ].map(({ dir, offset, valid }) => ({
    card: valid ? board[index + offset] : null,
    direction: dir
  }));

  // Rule 2: Must be adjacent to at least one existing non-destination card
  const hasAdjacentNonDestCard = adjacentCards.some(({ card: adjCard }) => 
    adjCard && !adjCard.id?.startsWith(SPECIAL_CARDS.DEST_PREFIX)
  );
  if (!hasAdjacentNonDestCard) return false;

  // Rule 3: Must match paths with all adjacent cards
  const pathsMatchWithAdjacent = adjacentCards.every(({ card: adjCard, direction }) => 
    !adjCard || pathsMatch(card, adjCard, direction)
  );
  if (!pathsMatchWithAdjacent) return false;

  // Rule 4: Must form a contiguous line back to the starting card
  return hasPathToStart(board, index, card);
};

/**
 * Check if there's a valid path from the given position back to the start
 * @param {Card[]} board - Current game board
 * @param {number} startIndex - Starting position to check from
 * @param {Card} newCard - Card being placed (if any)
 * @returns {boolean} True if valid path exists
 */
export const hasPathToStart = (board, startIndex, newCard = null) => {
  // Create a temporary board with the new card
  const tempBoard = [...board];
  if (newCard) {
    tempBoard[startIndex] = newCard;
  }

  // Find the start card position
  const startCardIndex = tempBoard.findIndex(card => card?.id === SPECIAL_CARDS.START);
  if (startCardIndex === -1) return false;

  // Keep track of visited positions
  const visited = new Set();

  const dfs = (currentIndex) => {
    if (currentIndex === startCardIndex) return true;
    visited.add(currentIndex);

    // Check each direction
    const directions = [
      { dir: DIRECTIONS.TOP, offset: -BOARD_SIZE, valid: currentIndex >= BOARD_SIZE },
      { dir: DIRECTIONS.RIGHT, offset: 1, valid: (currentIndex % BOARD_SIZE) < (BOARD_SIZE - 1) },
      { dir: DIRECTIONS.BOTTOM, offset: BOARD_SIZE, valid: currentIndex < (BOARD_SIZE * (BOARD_SIZE - 1)) },
      { dir: DIRECTIONS.LEFT, offset: -1, valid: (currentIndex % BOARD_SIZE) > 0 }
    ];

    for (const { dir, offset, valid } of directions) {
      const nextIndex = currentIndex + offset;
      
      if (valid && !visited.has(nextIndex)) {
        const currentCard = tempBoard[currentIndex];
        const nextCard = tempBoard[nextIndex];
        
        // Check if there's a connecting path between the cards
        if (currentCard && nextCard && haveConnectingPath(currentCard, nextCard, dir)) {
          if (dfs(nextIndex)) {
            return true;
          }
        }
      }
    }

    return false;
  };

  return dfs(startIndex);
};
