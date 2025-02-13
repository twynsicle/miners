import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { allCardPaths } from '../src/possibleCards.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Card dimensions
const CARD_WIDTH = 180;  // doubled for better quality
const CARD_HEIGHT = 120; // doubled for better quality
const LINE_WIDTH = 6;    // reduced from 8
const CENTER_DOT_RADIUS = 4; // reduced from 6
const BORDER_WIDTH = 1;
const BORDER_RADIUS = 8;

// Colors
const COLORS = {
  BACKGROUND: '#ffffff',
  BORDER: '#e0e0e0',  // lighter border color
  PATH: '#2e7d32',    // darker green for better visibility
  ENDPOINT: '#d32f2f', // darker red for better visibility
  START_PATH: '#4CAF50', // bright green for start card
  DEST_PATH: '#FFA000'  // gold color for destination cards
};

// Side center positions (as ratios of width/height)
const SIDE_CENTERS = [
  { x: 0.5, y: 0 },    // top
  { x: 1, y: 0.5 },    // right
  { x: 0.5, y: 1 },    // bottom
  { x: 0, y: 0.5 }     // left
];

// Dead end offsets (in pixels)
const DEAD_END_LENGTH = 25; // reduced from 30
const DEAD_END_OFFSETS = [
  { dx: 0, dy: DEAD_END_LENGTH },     // top
  { dx: -DEAD_END_LENGTH, dy: 0 },    // right
  { dx: 0, dy: -DEAD_END_LENGTH },    // bottom
  { dx: DEAD_END_LENGTH, dy: 0 }      // left
];

function generateCardImage(path, pathColor = COLORS.PATH) {
  const canvas = createCanvas(CARD_WIDTH, CARD_HEIGHT);
  const ctx = canvas.getContext('2d');

  // Draw background
  ctx.fillStyle = COLORS.BACKGROUND;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  // Draw border
  ctx.strokeStyle = COLORS.BORDER;
  ctx.lineWidth = BORDER_WIDTH;
  ctx.beginPath();
  ctx.roundRect(1, 1, CARD_WIDTH - 2, CARD_HEIGHT - 2, BORDER_RADIUS);
  ctx.stroke();

  // Helper function to get absolute coordinates
  const getAbsoluteCoords = (relX, relY) => ({
    x: relX * CARD_WIDTH,
    y: relY * CARD_HEIGHT
  });

  // Draw path
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = LINE_WIDTH;
  ctx.lineCap = 'round';

  if (path.length === 1) {
    // Dead end path
    const start = getAbsoluteCoords(SIDE_CENTERS[path[0]].x, SIDE_CENTERS[path[0]].y);
    const offset = DEAD_END_OFFSETS[path[0]];
    
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(start.x + offset.dx, start.y + offset.dy);
    ctx.stroke();

    // Draw endpoint dot
    ctx.fillStyle = COLORS.ENDPOINT;
    ctx.beginPath();
    ctx.arc(start.x + offset.dx, start.y + offset.dy, CENTER_DOT_RADIUS, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // All paths connect to center
    const center = getAbsoluteCoords(0.5, 0.5);
    path.forEach(sideIndex => {
      const start = getAbsoluteCoords(SIDE_CENTERS[sideIndex].x, SIDE_CENTERS[sideIndex].y);
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(center.x, center.y);
      ctx.stroke();
    });

    // Draw center connection dot
    ctx.fillStyle = pathColor;
    ctx.beginPath();
    ctx.arc(center.x, center.y, CENTER_DOT_RADIUS * 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  return canvas;
}

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, '..', 'src', 'assets', 'cards');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate regular path cards
allCardPaths.forEach(cardPath => {
  const canvas = generateCardImage(cardPath);
  const filename = `card_${cardPath.sort().join('')}.png`;
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`${outputDir}/${filename}`, buffer);
});

// Generate start card (all sides connected)
const startCard = generateCardImage([0, 1, 2, 3], COLORS.START_PATH);
const startBuffer = startCard.toBuffer('image/png');
fs.writeFileSync(`${outputDir}/start.png`, startBuffer);

// Generate destination cards (all sides connected with gold color)
for (let i = 1; i <= 3; i++) {
  const destCard = generateCardImage([0, 1, 2, 3], COLORS.DEST_PATH);
  const destBuffer = destCard.toBuffer('image/png');
  fs.writeFileSync(`${outputDir}/dest${i}.png`, destBuffer);
}
