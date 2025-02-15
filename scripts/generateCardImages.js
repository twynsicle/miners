import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { possibleCards } from '../src/possibleCards.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Card dimensions
const CARD_WIDTH = 180;
const CARD_HEIGHT = 120;
const LINE_WIDTH = 28; // Increased path width
const BORDER_WIDTH = 2;
const BORDER_RADIUS = 12;

// Colors
const COLORS = {
  BACKGROUND: '#4a4a4a', // Dark grey background
  BORDER: '#2d2d2d', // Darker border
  PATH: '#c4a484', // Sandy brown for tunnels
  PATH_EDGE: '#8b7355', // Darker brown for tunnel edges
  START_PATH: '#deb887', // Burlywood for start card
  DEST_PATH: '#b8860b', // Dark golden for destination
};

// Side center positions (as ratios of width/height)
const SIDE_CENTERS = [
  { x: 0.5, y: 0 }, // top
  { x: 1, y: 0.5 }, // right
  { x: 0.5, y: 1 }, // bottom
  { x: 0, y: 0.5 }, // left
];

// Control point offsets for curved paths (as ratio of card size)
const CURVE_OFFSET = 0.3; // Increased curve amount
const NOISE_VARIANCE = 8; // Increased wobbliness

function addNoise(ctx, x, y, variance = NOISE_VARIANCE) {
  return {
    x: x + (Math.random() - 0.5) * variance,
    y: y + (Math.random() - 0.5) * variance,
  };
}

function generateCardImage(paths, pathColor = COLORS.PATH, pathEdgeColor = COLORS.PATH_EDGE) {
  const canvas = createCanvas(CARD_WIDTH, CARD_HEIGHT);
  const ctx = canvas.getContext('2d');

  // Draw background
  ctx.fillStyle = COLORS.BACKGROUND;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  // Draw border
  ctx.strokeStyle = COLORS.BORDER;
  ctx.lineWidth = BORDER_WIDTH;
  ctx.beginPath();
  ctx.roundRect(2, 2, CARD_WIDTH - 4, CARD_HEIGHT - 4, BORDER_RADIUS);
  ctx.stroke();

  // Helper function to get absolute coordinates
  const getAbsoluteCoords = (relX, relY) => ({
    x: relX * CARD_WIDTH,
    y: relY * CARD_HEIGHT,
  });

  const center = getAbsoluteCoords(0.5, 0.5);

  // Function to draw a path with multiple control points for more wobbliness
  function drawWobblyPath(ctx, start, end, numControlPoints = 4, isCorner = false) {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);

    if (isCorner) {
      // For corner paths (adjacent sides), use a quarter-circle-like curve
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const midX = start.x + dx / 2;
      const midY = start.y + dy / 2;

      // Control point is perpendicular to the midpoint
      const controlX = midX + (dy > 0 ? -Math.abs(dy) : Math.abs(dy)) * CURVE_OFFSET;
      const controlY = midY + (dx > 0 ? Math.abs(dx) : -Math.abs(dx)) * CURVE_OFFSET;

      ctx.quadraticCurveTo(controlX, controlY, end.x, end.y);
    } else if (path.length === 2) {
      // For straight two-point paths, use a curved line with more pronounced curve
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const midX = (start.x + end.x) / 2;
      const midY = (start.y + end.y) / 2;

      // Add some random offset to the midpoint perpendicular to the path
      const perpX = -dy * CURVE_OFFSET;
      const perpY = dx * CURVE_OFFSET;
      const controlX = midX + perpX + (Math.random() - 0.5) * NOISE_VARIANCE;
      const controlY = midY + perpY + (Math.random() - 0.5) * NOISE_VARIANCE;

      ctx.quadraticCurveTo(controlX, controlY, end.x, end.y);
    } else {
      // For other paths, use multiple control points for more wobbliness
      const points = [];
      for (let i = 1; i < numControlPoints; i++) {
        const t = i / numControlPoints;
        const baseX = start.x + (end.x - start.x) * t;
        const baseY = start.y + (end.y - start.y) * t;
        points.push(addNoise(ctx, baseX, baseY));
      }

      // Use multiple quadratic curves to create a more natural path
      points.forEach((point, i) => {
        if (i === points.length - 1) {
          ctx.quadraticCurveTo(point.x, point.y, end.x, end.y);
        } else {
          const next = points[i + 1];
          const midX = (point.x + next.x) / 2;
          const midY = (point.y + next.y) / 2;
          ctx.quadraticCurveTo(point.x, point.y, midX, midY);
        }
      });
    }

    ctx.stroke();
  }

  // Draw each path set
  paths.forEach((path) => {
    // Draw path edges first (for tunnel effect)
    ctx.strokeStyle = pathEdgeColor;
    ctx.lineWidth = LINE_WIDTH + 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    path.forEach((sideIndex, i) => {
      const start = getAbsoluteCoords(SIDE_CENTERS[sideIndex].x, SIDE_CENTERS[sideIndex].y);

      if (path.length === 2) {
        // Draw curved path between two sides
        const nextIndex = (i + 1) % path.length;
        const end = getAbsoluteCoords(SIDE_CENTERS[path[nextIndex]].x, SIDE_CENTERS[path[nextIndex]].y);

        if (i === 0) {
          // Check if sides are adjacent
          const isCorner = Math.abs(sideIndex - path[nextIndex]) === 1 || Math.abs(sideIndex - path[nextIndex]) === 3;
          drawWobblyPath(ctx, start, end, 4, isCorner);
        }
      } else if (path.length >= 3) {
        // For 3+ connected paths, all meet in the center
        drawWobblyPath(ctx, start, center);
      } else {
        // For single paths, draw to a point before the center
        // For top/bottom paths (0,2), make them shorter
        const distanceRatio = sideIndex === 0 || sideIndex === 2 ? 0.35 : 0.5;
        const midPoint = {
          x: start.x + (center.x - start.x) * distanceRatio,
          y: start.y + (center.y - start.y) * distanceRatio,
        };
        drawWobblyPath(ctx, start, midPoint);
      }
    });

    // Draw main path color
    ctx.strokeStyle = pathColor;
    ctx.lineWidth = LINE_WIDTH;

    // Repeat the same path drawing logic for the main path color
    path.forEach((sideIndex, i) => {
      const start = getAbsoluteCoords(SIDE_CENTERS[sideIndex].x, SIDE_CENTERS[sideIndex].y);

      if (path.length === 2) {
        const nextIndex = (i + 1) % path.length;
        const end = getAbsoluteCoords(SIDE_CENTERS[path[nextIndex]].x, SIDE_CENTERS[path[nextIndex]].y);

        if (i === 0) {
          const isCorner = Math.abs(sideIndex - path[nextIndex]) === 1 || Math.abs(sideIndex - path[nextIndex]) === 3;
          drawWobblyPath(ctx, start, end, 4, isCorner);
        }
      } else if (path.length >= 3) {
        // For 3+ connected paths, all meet in the center
        drawWobblyPath(ctx, start, center);
      } else {
        // For single paths, draw to a point before the center
        // For top/bottom paths (0,2), make them shorter
        const distanceRatio = sideIndex === 0 || sideIndex === 2 ? 0.35 : 0.5;
        const midPoint = {
          x: start.x + (center.x - start.x) * distanceRatio,
          y: start.y + (center.y - start.y) * distanceRatio,
        };
        drawWobblyPath(ctx, start, midPoint);
      }
    });
  });

  return canvas;
}

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, '..', 'src', 'assets', 'cards');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate regular path cards
possibleCards.forEach((card) => {
  const canvas = generateCardImage(card.paths);
  const filename = `card_${card.paths.map((path) => path.sort().join('')).join('_')}.png`;
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`${outputDir}/${filename}`, buffer);
});

// Generate start card (all sides connected)
const startCard = generateCardImage([[0, 1, 2, 3]], COLORS.START_PATH, COLORS.PATH_EDGE);
fs.writeFileSync(`${outputDir}/start.png`, startCard.toBuffer('image/png'));

// Generate destination cards (all sides connected with gold color)
for (let i = 1; i <= 3; i++) {
  const destCard = generateCardImage([[0, 1, 2, 3]], COLORS.DEST_PATH, COLORS.PATH_EDGE);
  fs.writeFileSync(`${outputDir}/dest${i}.png`, destCard.toBuffer('image/png'));
}
