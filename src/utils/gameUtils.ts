import { BOARD_SIZE, DIRECTIONS, SPECIAL_CARDS } from '@/constants/gameConstants';
import { Card } from '@/classes/Card';
import { PathsType } from '@/types';

const isDestinationCard = (card: Card): boolean => {
  return card.type === 'dest' || card.id.startsWith(SPECIAL_CARDS.DEST_PREFIX);
};

const getOppositeDirection = (direction: number): number => {
  switch (direction) {
    case DIRECTIONS.TOP:
      return DIRECTIONS.BOTTOM;
    case DIRECTIONS.RIGHT:
      return DIRECTIONS.LEFT;
    case DIRECTIONS.BOTTOM:
      return DIRECTIONS.TOP;
    case DIRECTIONS.LEFT:
      return DIRECTIONS.RIGHT;
    default:
      return -1;
  }
};

export function haveConnectingPath(card1: Card, card2: Card, direction: number): boolean {
  if (!card1 || !card2) return false;

  // Skip path matching for destination cards
  if (isDestinationCard(card2)) {
    return true;
  }

  const oppositeDirection = getOppositeDirection(direction);

  // Check if both cards have paths in the connecting directions
  const card1HasPath = card1.paths.some((path) => path.includes(direction));
  const card2HasPath = card2.paths.some((path) => path.includes(oppositeDirection));

  return card1HasPath && card2HasPath;
}

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

export function isValidDropNew(board: (Card | null)[], position: number, card: Card | null): boolean {
  // If no card or position is occupied, invalid
  if (!card || board[position]) return false;

  const boardSize = Math.sqrt(board.length);
  const neighbors = getNeighbors(position, boardSize);

  // At least one neighbor must be occupied (except for start card)
  if (card.type !== 'start') {
    const hasOccupiedNeighbor = neighbors.some((pos) => {
      const neighborCard = board[pos];
      return neighborCard && !isDestinationCard(neighborCard);
    });
    if (!hasOccupiedNeighbor) return false;
  }

  // Check if paths match with all neighbors
  const pathsMatch = neighbors.every((neighborPos) => {
    const neighborCard = board[neighborPos];
    if (!neighborCard) return true; // Empty neighbor is valid

    // Check if the paths match in this direction
    return pathsMatchInDirection(card.paths, neighborCard.paths);
  });

  if (!pathsMatch) return false;

  // Create a temporary board with the new card for path checking
  const tempBoard = [...board];
  tempBoard[position] = card;

  // Check if there's a valid path back to start
  return hasPathToStart(tempBoard, position, card);
}

export const pathsMatchInDirection = (paths1: PathsType, paths2: PathsType): boolean => {
  if (!paths1 || !paths2) return false;
  // TODO
  return true;
};

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
