// Card configurations with their counts in the deck
export const possibleCards = [
  // Single dead ends
  { paths: [[0]], count: 2 },
  { paths: [[2]], count: 2 },

  // Two dead ends
  { paths: [[0], [1]], count: 2 },
  { paths: [[0], [2]], count: 2 },
  { paths: [[1], [3]], count: 2 },

  // Three dead ends
  { paths: [[0], [1], [2]], count: 1 },
  { paths: [[0], [1], [3]], count: 1 },

  // Four dead ends
  { paths: [[0], [1], [2], [3]], count: 1 },

  // Two-way paths (straight and corners)
  { paths: [[0, 2]], count: 4 }, // vertical
  { paths: [[1, 3]], count: 4 }, // horizontal
  { paths: [[0, 1]], count: 4 }, // Top-right corner / bottom-left corner
  { paths: [[1, 2]], count: 4 }, // Bottom-right corner / top-left corner

  // Two-way paths with dead ends
  { paths: [[0, 2], [1]], count: 2 }, 
  { paths: [[0, 2], [3]], count: 2 }, 
  { paths: [[1, 2], [0]], count: 2 }, 
  { paths: [[1, 3], [0]], count: 2 }, 
  { paths: [[1, 3], [2]], count: 2 }, 

  // Three-way paths (T-junctions)
  { paths: [[0, 1, 2]], count: 5 }, // vertical with offshoot
  { paths: [[1, 2, 3]], count: 5 }, // horizontal with offshoot

  // Three-way paths with dead ends
  { paths: [[0, 1, 2], [3]], count: 2 },
  { paths: [[1, 2, 3], [0]], count: 2 }, 

  // Four-way paths (crossroads)
  { paths: [[0, 1, 2, 3]], count: 5 },
];

