/**
 * Gets the filename for a card's image based on its paths and type
 * @param {Array} paths - Array of path arrays
 * @param {string} [type] - Optional card type ('start' or 'dest')
 * @param {number} [id] - Optional card id for destination cards
 * @returns {string} - Filename for the card image
 */
export function getCardImageFilename(paths, type, id) {
  if (!paths) return 'blank.png';
  
  // Handle special cards
  if (type === 'start') return 'start.png';
  if (type === 'dest') return `dest${id}.png`;
  
  // Convert paths to filename
  const getPathKey = (paths) => {
    // For each path array in paths, sort the numbers and join them
    return paths.map(path => 
      Array.isArray(path) ? [...path].sort().join('') : path
    ).join('_');
  };

  return `card_${getPathKey(paths)}.png`;
}

/**
 * Generate a random card with 2-3 random directions
 * @returns {Object} Card object with id and paths
 */
export function generateRandomCard() {
  return {
    id: Math.random().toString(),
    paths: [
      [
        // Randomly select 2-3 directions for each path
        ...Array.from(
          { length: Math.floor(Math.random() * 2) + 2 },
          () => Math.floor(Math.random() * 4)
        ).filter((dir, i, arr) => arr.indexOf(dir) === i) // Remove duplicates
      ]
    ]
  };
}

/**
 * Checks if a path pattern is valid according to the game rules
 * @param {Array} paths - Array of path arrays to validate
 * @returns {boolean} - Whether the path pattern is valid
 */
export function isValidPathPattern(paths) {
  if (!Array.isArray(paths)) return false;
  
  // Each path must be an array of numbers 0-3
  return paths.every(path => 
    Array.isArray(path) &&
    path.every(n => n >= 0 && n <= 3)
  );
}
