# Miners - How to Play

## Game Overview
Miners is a multiplayer board game where players compete to build mining paths using cards. The game combines strategy and planning as players try to create the most efficient paths to reach their destinations.

## Game Components
- A 9x9 game board (81 spaces)
- A deck of path cards
- Multiple destination points
- Starting position
- 5 players: Thorin Goldbeard, Gimli Ironfoot, Dwalin Rockfist, Balin Gemseeker, and Bofur Pickaxe

## Setup
1. The game starts with:
   - A starting card placed in the middle of the 8th row (position '7,4')
   - Three destination cards placed on the 2nd row (positions '1,2', '1,4', and '1,6')
   - Each player receives a hand of 5 cards
2. Special Cards:
   - The starting card has paths in all directions (top, right, bottom, left)
   - Each destination card has paths in all directions
   - The starting card is marked with a unique identifier 'start'
   - Destination cards are marked with identifiers 'dest_1', 'dest_2', and 'dest_3'

## Game Rules

### Turn Sequence
1. Players take turns clockwise, starting with player ID 1 (Thorin Goldbeard)
2. On your turn:
   a. Select a card from your hand
   b. Valid placement positions will be highlighted on the board
   c. Place the selected card in a valid position
   d. Draw a new card from the deck to maintain 5 cards in your hand
   e. Your turn ends, and play passes to the next player clockwise
3. If the deck is empty when you need to draw a card, continue playing with the remaining cards in your hand

### Card Placement Rules
1. Cards can only be placed adjacent to existing cards on the board
   - The card must be adjacent to at least one existing non-destination card
   - Destination cards don't count as adjacent cards for placement purposes
2. Paths must connect properly with adjacent cards
   - Each path on your card must properly connect with paths on adjacent cards
   - Paths are considered connected if they meet at the shared edge between cards
   - Destination cards automatically connect with any adjacent paths
3. The new card must form at least one continuous path back to the starting card
   - This path must be made up of connected path segments
   - The path cannot go through destination cards
   - The path must be traceable through adjacent cards back to the start

### Card Interaction
1. Selecting a Card:
   - Click on a card in your hand to select it
   - Valid placement positions will be highlighted on the board
2. Placing a Card:
   - Click on a highlighted position to place your selected card
   - You can also drag and drop cards onto valid positions
3. Invalid Placements:
   - The game will prevent you from placing cards in invalid positions
   - A position is invalid if it doesn't meet all placement rules

### Winning the Game
The game continues until players create continuous paths from the starting position to the destination cards. (Full winning conditions to be determined as the game develops)

## Game Board Layout
- The board is a 9x9 grid
- Starting position: Row 8 (index 7), Column 5 (index 4)
- Destination cards: Row 2 (index 1), Columns 3, 5, and 7 (indices 2, 4, and 6)
- Board positions are referenced using zero-based indices in the format 'row,column'

## Technical Notes
- The game uses a drag-and-drop interface for card placement
- Each card has a unique cardId for tracking
- The game state tracks:
  - Player hands
  - Board state
  - Active player
  - Selected and dragged cards
  - Remaining cards in the deck

---
*Note: This game is under active development. Rules and mechanics may be updated as the game evolves.*
