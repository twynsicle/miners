# Miners - UI Rules and Interactions

## Game Layout

### Main Components
1. Game Board
   - 9x9 grid of cells
   - Each cell can be empty or contain a card
   - Valid placement positions are highlighted
   - Start card is in row 8, column 5
   - Destination cards are in row 2, columns 3, 5, and 7

2. Player Hand
   - Located below the game board
   - Shows 5 cards for the active player
   - Cards are draggable and clickable
   - Active player's name is displayed above their hand

3. Game Info
   - Shows remaining cards in deck
   - Lists all players and indicates active player
   - Reset game button

## Player Interactions

### Card Selection and Placement
Players can place cards using two methods:

1. Click-to-Place Method:
   - Click a card in your hand to select it
   - Valid placement positions will be highlighted in green
   - Click a highlighted position to place the card
   - The card will be removed from your hand and placed on the board
   - You'll automatically draw a new card (if available)
   - Play passes to the next player

2. Drag-and-Drop Method:
   - Click and hold a card in your hand to start dragging
   - Valid placement positions will be highlighted in green
   - Drag the card over a valid position
     - The position will show a darker green highlight when hovering
     - Invalid positions will show a "not allowed" cursor
   - Release the card to place it
   - You'll automatically draw a new card (if available)
   - Play passes to the next player

### Visual Feedback

1. Valid Placement Positions:
   - Highlighted with a light green background
   - Show a dashed green border
   - Display "Play Here" text
   - Cursor changes to pointer

2. Card States:
   - Normal: Default appearance with game art
   - Selected: Blue border and glow effect
   - Dragging: Semi-transparent while being dragged
   - Hover Target: Darker green highlight when card is dragged over

3. Error States:
   - Failed card loads show path pattern as text

### Game Flow Feedback

1. Turn Indication:
   - Active player's name is highlighted
   - Only active player's cards are interactive

2. Card Drawing:
   - Cards smoothly animate into hand
   - Deck count updates immediately

3. Game State:
   - Board updates immediately after card placement
   - Valid positions update with each new card placed
   - Player turns advance automatically

## Accessibility Features

1. Mouse Interactions:
   - Click or drag-and-drop support
   - Hover effects for interactive elements
   - Cursor changes to indicate valid actions

2. Visual Cues:
   - Clear color coding for valid positions
   - Distinct highlighting for hover states
   - Text indicators for valid placement zones

3. Error Prevention:
   - Invalid placements are prevented
   - Clear visual feedback for valid/invalid actions
   - Confirmation for game reset

## Technical Notes

1. Drag and Drop:
   - Uses react-dnd library
   - Supports HTML5 drag and drop
   - Handles both touch and mouse events

2. State Management:
   - Card selection state
   - Valid position highlighting
   - Turn management
   - Deck and hand management

3. Visual Effects:
   - CSS transitions for smooth animations
   - Dynamic highlighting based on game state
   - Responsive layout for different screen sizes

---
*Note: This document serves as a reference for AI agents and developers to understand and implement the expected UI behavior consistently.*
