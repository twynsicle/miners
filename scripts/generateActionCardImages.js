import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { actionCardDefinitions } from '../src/possibleActionCards.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CARD_SIZE = { width: 180, height: 120 };
const OUTPUT_DIR = path.join(__dirname, '../src/assets/cards/actions');

// Match path card styling
const CARD_STYLE = {
  borderWidth: 2,
  borderColor: '#2d2d2d',
  cornerRadius: 12,
  iconSize: 60 // Size for icons
};

// Simplified icon paths using basic shapes
const ICONS = {
  pickaxe: {
    paths: [
      'M 4 20 L 9 15 L 14 10',
      'M 12 20 L 16 16',
      'M 4 12 L 8 8',
      'M 3 21 L 12 12',
      'M 12 3 L 3 12'
    ]
  },
  lantern: {
    paths: [
      'M 9 21 L 15 21',
      'M 9 17 L 15 17',
      'M 9 13 L 15 13',
      'M 8 8 L 16 8 L 20 12 L 4 12 L 8 8',
      'M 12 8 L 12 3'
    ]
  },
  cart: {
    paths: [
      'M 8 21 A 1 1 0 1 0 8 19 A 1 1 0 1 0 8 21',
      'M 19 21 A 1 1 0 1 0 19 19 A 1 1 0 1 0 19 21',
      'M 2.05 2.05 L 4.05 2.05 L 6.71 14.47 C 6.89 15.37 7.70 16.05 8.71 16.05 L 18.49 16.05 C 19.44 16.05 20.28 15.48 20.44 14.48 L 22.09 7.05 L 5.12 7.05'
    ]
  },
  binoculars: {
    paths: [
      'M 4 10 A 3 3 0 1 0 4 4 A 3 3 0 0 0 4 10',
      'M 20 10 A 3 3 0 1 0 20 4 A 3 3 0 0 0 20 10',
      'M 12 12 A 3 3 0 1 0 12 6 A 3 3 0 0 0 12 12',
      'M 4 16 L 4 4',
      'M 20 16 L 20 4',
      'M 10 4 L 12 6 L 14 4 L 12 2 L 10 4'
    ]
  },
  dynamite: {
    paths: [
      'M 12 2 L 12 9',
      'M 6 9 L 18 9',
      'M 4 12 L 20 12 L 20 11 A 2 2 0 0 1 18 14 L 6 14 A 2 2 0 0 1 4 11 L 4 12',
      'M 4 21 L 4 14',
      'M 20 21 L 20 14'
    ]
  }
};

function drawIcon(ctx, iconData, x, y, size, color) {
  ctx.save();
  
  // Scale the icon to fit the desired size
  const scale = size / 24; // Icons are designed on a 24x24 grid
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  
  // Set up the stroke style
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  // Draw each path
  for (const pathStr of iconData.paths) {
    ctx.beginPath();
    
    // Parse and draw the path
    const commands = pathStr.split(' ');
    for (let i = 0; i < commands.length; i++) {
      const cmd = commands[i];
      
      if (cmd === 'M') {
        ctx.moveTo(parseFloat(commands[i+1]), parseFloat(commands[i+2]));
        i += 2;
      } else if (cmd === 'L') {
        ctx.lineTo(parseFloat(commands[i+1]), parseFloat(commands[i+2]));
        i += 2;
      } else if (cmd === 'A') {
        const [rx, ry, rot, laf, sf, x, y] = commands.slice(i+1, i+8).map(parseFloat);
        ctx.arc(x - rx, y, rx, 0, 2 * Math.PI);
        i += 7;
      }
    }
    
    ctx.stroke();
  }
  
  ctx.restore();
}

function drawActionCard(ctx, card) {
  // Card base (same as path cards)
  ctx.fillStyle = '#4a4a4a';
  ctx.strokeStyle = CARD_STYLE.borderColor;
  ctx.lineWidth = CARD_STYLE.borderWidth;
  ctx.beginPath();
  ctx.roundRect(
    CARD_STYLE.borderWidth/2,
    CARD_STYLE.borderWidth/2,
    CARD_SIZE.width - CARD_STYLE.borderWidth,
    CARD_SIZE.height - CARD_STYLE.borderWidth,
    CARD_STYLE.cornerRadius
  );
  ctx.fill();
  ctx.stroke();

  // Determine which icon to use
  let icon = ICONS.pickaxe;
  if (card.id.includes('lantern')) icon = ICONS.lantern;
  else if (card.id.includes('cart')) icon = ICONS.cart;
  else if (card.id.includes('view_dest')) icon = ICONS.binoculars;
  else if (card.id.includes('cave_in')) icon = ICONS.dynamite;

  // Draw icon
  const iconX = (CARD_SIZE.width - CARD_STYLE.iconSize) / 2;
  const iconY = (CARD_SIZE.height - CARD_STYLE.iconSize) / 2 - 20;
  drawIcon(ctx, icon, iconX, iconY, CARD_STYLE.iconSize, card.color);

  // Add card text below icon
  ctx.font = 'bold 16px Arial';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(card.text, CARD_SIZE.width/2, CARD_SIZE.height/2 + 25);
}

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Generate all cards
actionCardDefinitions.forEach(card => {
  const canvas = createCanvas(CARD_SIZE.width, CARD_SIZE.height);
  const ctx = canvas.getContext('2d');
  drawActionCard(ctx, card);
  
  // Save with consistent filename pattern
  const outputPath = path.join(OUTPUT_DIR, `${card.id}.png`);
  const output = fs.createWriteStream(outputPath);
  canvas.createPNGStream().pipe(output);
  console.log(`Generated: ${outputPath}`);
});
