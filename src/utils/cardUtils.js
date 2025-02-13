/**
 * Get the image filename for a card based on its paths
 * @param {number[][]} paths - Array of path arrays
 * @param {string} [id] - Optional card ID for special cards
 * @returns {string} Image filename
 */
export function getCardImageFilename(paths, id) {
  if (id?.startsWith('dest_')) {
    const destNumber = id.split('_')[1];
    return `dest${destNumber}.png`;
  }
  if (id === 'start') {
    return 'start.png';
  }
  const pathKey = paths.map(path => path.sort().join('')).join('_');
  return `card_${pathKey}.png`;
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
