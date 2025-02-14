import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Card } from '../classes/Card';
import { Deck } from '../classes/Deck';
import { Player } from '../classes/Player';
import { PathsType } from '../types/game';
import { BOARD_SIZE, SPECIAL_CARDS } from '../constants/gameConstants';
import { DEFAULT_PLAYERS } from '../constants/playerConstants';

interface GameState {
  board: { [key: string]: Card };
  players: Player[];
  activePlayerId: number;
  selectedCard: Card | null;
  draggedCard: Card | null;
  deck: Card[];
  cardsRemaining: number;
}

const createStartCard = (): Card => {
  return new Card([[0, 1, 2, 3]], 'start', SPECIAL_CARDS.START, 'start');
};

const createDestinationCard = (id: string): Card => {
  return new Card([[0, 1, 2, 3]], 'dest', `${SPECIAL_CARDS.DEST_PREFIX}${id}`, id);
};

const createInitialState = (): GameState => {
  // Create and shuffle the deck
  const deck = new Deck();
  deck.shuffle();

  // Create players with avatars from default configurations
  const players: Player[] = DEFAULT_PLAYERS.map(config => 
    new Player(config.id, config.name, config.avatar)
  );

  // Deal 5 cards to each player
  players.forEach(player => {
    for (let i = 0; i < 5; i++) {
      const card = deck.drawCard();
      if (card) {
        player.addCard(card);
      }
    }
  });

  // Create initial board with start and destination cards
  const board: { [key: string]: Card } = {
    '7,4': createStartCard(),
    '1,2': createDestinationCard('1'),
    '1,4': createDestinationCard('2'),
    '1,6': createDestinationCard('3')
  };

  return {
    board,
    players,
    activePlayerId: 1,
    selectedCard: null,
    draggedCard: null,
    deck: deck.cards,
    cardsRemaining: deck.getCardsRemaining()
  };
};

export const gameSlice = createSlice({
  name: 'game',
  initialState: createInitialState(),
  reducers: {
    initGame: (state) => {
      const newState = createInitialState();
      Object.assign(state, newState);
    },
    selectCard: (state, action: PayloadAction<Card>) => {
      state.selectedCard = action.payload;
      state.draggedCard = null;
    },
    dragCard: (state, action: PayloadAction<Card>) => {
      state.draggedCard = action.payload;
      state.selectedCard = null;
    },
    placeCard: (state, action: PayloadAction<{ position: string; card: Card }>) => {
      const { position, card } = action.payload;
      state.board[position] = card;
      state.selectedCard = null;
      state.draggedCard = null;
      
      // Remove the card from player's hand
      const activePlayer = state.players.find(p => p.id === state.activePlayerId);
      if (activePlayer) {
        activePlayer.removeCard(card.cardId);
        
        // Draw a new card if there are cards remaining
        if (state.deck.length > 0) {
          const newCard = state.deck.pop();
          if (newCard) {
            activePlayer.addCard(newCard);
          }
          state.cardsRemaining = state.deck.length;
        }
      }

      // Move to next player
      const currentPlayerIndex = state.players.findIndex(p => p.id === state.activePlayerId);
      const nextPlayerIndex = (currentPlayerIndex + 1) % state.players.length;
      state.activePlayerId = state.players[nextPlayerIndex].id;
    },
    setActivePlayer: (state, action: PayloadAction<number>) => {
      state.activePlayerId = action.payload;
    },
    resetGame: (state) => {
      const newState = createInitialState();
      Object.assign(state, newState);
    }
  }
});

export const gameActions = gameSlice.actions;
export default gameSlice.reducer;
