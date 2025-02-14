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
 * Game visual styles
 */
export const STYLES = {
  // Card dimensions - using standard playing card ratio of 2.5:3.5 in landscape
  CARD_WIDTH: '90px',   // Base width for landscape orientation
  CARD_HEIGHT: '64px',  // Height calculated for landscape (90 * 2.5/3.5)
  CELL_GAP: '4px',
  CELL_BORDER_WIDTH: '2px',
  CELL_BORDER_RADIUS: '8px',

  // Colors
  SELECTED_CARD_BORDER: '#4CAF50',
  VALID_DROP_BORDER: '#4CAF50',
  INVALID_DROP_BORDER: '#FF5252',
  EMPTY_CELL_BG: '#1a1a1a',
  BOARD_BG: '#2d2d2d'
};
