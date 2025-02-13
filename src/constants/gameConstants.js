/**
 * Game board dimensions and layout
 */
export const BOARD_SIZE = 9;
export const TOTAL_CELLS = BOARD_SIZE * BOARD_SIZE;
export const HAND_SIZE = 6;

/**
 * Special card types
 */
export const SPECIAL_CARDS = {
  START: 'start',
  DEST_PREFIX: 'dest_',
  BLOCK: 'block',
  JUMP: 'jump',
  SWAP: 'swap'
};

/**
 * Card path directions
 */
export const DIRECTIONS = {
  TOP: 0,
  RIGHT: 1,
  BOTTOM: 2,
  LEFT: 3
};

/**
 * Player constants
 */
export const PLAYERS = [
  { id: 1, name: 'Thorin Goldbeard', avatar: '👑', score: 0 },
  { id: 2, name: 'Gimli Axemaster', avatar: '⚔️', score: 0 },
  { id: 3, name: 'Dwalin Stonefist', avatar: '🛡️', score: 0 },
  { id: 4, name: 'Balin Silverbeard', avatar: '📚', score: 0 },
  { id: 5, name: 'Bofur Pickswing', avatar: '⛏️', score: 0 }
];

/**
 * Game visual styles
 */
export const STYLES = {
  // Card and cell dimensions
  CELL_WIDTH: '90px',
  CELL_HEIGHT: '60px', // Using standard playing card ratio of 2.5:3.5
  CELL_GAP: '4px',
  CELL_BORDER_WIDTH: '2px',
  CELL_BORDER_RADIUS: '8px',

  // Colors
  COLORS: {
    // Cell states
    EMPTY_CELL: '#ffffff',
    FILLED_CELL: '#ffffff',
    CELL_BORDER: '#cccccc',

    // Valid placement indicators
    VALID_DROP: '#e8f5e9',
    VALID_DROP_BORDER: '#4CAF50',
    VALID_DROP_TEXT: '#4CAF50',

    // Selection indicators
    SELECTED_CARD_BORDER: '#4CAF50'
  },

  // Player list styles
  PLAYER_LIST_WIDTH: '200px',
  PLAYER_AVATAR_SIZE: '40px',
  ACTIVE_PLAYER_INDICATOR: '10px solid #4CAF50',
  PLAYER_DEBUFF_HEIGHT: '30px'
};
