// Card configurations with their counts in the deck
export const possibleCards = [
  // Single paths (dead ends)
  { paths: [[0]], count: 5 },
  { paths: [[1]], count: 5 },
  { paths: [[2]], count: 5 },
  { paths: [[3]], count: 5 },

  // Two-way paths (straight and corners)
  { paths: [[0, 2]], count: 10 }, // vertical
  { paths: [[1, 3]], count: 10 }, // horizontal
  { paths: [[0, 1]], count: 10 }, 
  { paths: [[1, 2]], count: 10 }, 
  { paths: [[2, 3]], count: 10 }, 
  { paths: [[3, 0]], count: 10 }, // corners

  // Three-way paths (T-junctions)
  { paths: [[0, 1, 2]], count: 5 },
  { paths: [[1, 2, 3]], count: 5 },
  { paths: [[2, 3, 0]], count: 5 },
  { paths: [[3, 0, 1]], count: 5 },

  // Four-way paths (crossroads)
  { paths: [[0, 1, 2, 3]], count: 5 },
];

// Define all possible card paths
export const allCardPaths = [
  // Single paths (dead ends)
  [0], [1], [2], [3],

  // Two-way paths (straight and corners)
  [0, 2], // vertical
  [1, 3], // horizontal
  [0, 1], [1, 2], [2, 3], [3, 0], // corners

  // Three-way paths (T-junctions)
  [0, 1, 2], [1, 2, 3], [2, 3, 0], [3, 0, 1],

  // Four-way paths (crossroads)
  [0, 1, 2, 3]
];
