import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Card } from '@/classes/Card';
import { Deck } from '@/classes/Deck';
import { PlayerStatus } from '@/classes/Player';
import { SPECIAL_CARDS } from '@/constants/gameConstants';
import { DEFAULT_PLAYERS } from '@/constants/playerConstants';
import { CardType } from '@/types';

export interface SerializedCard {
  paths?: string;
  type: CardType;
  id: string;
  text?: string;
  color?: string;
}

export interface SerializedPlayer {
  id: number;
  name: string;
  avatar: string;
  handIds: string[];
  statuses: PlayerStatus[];
}

interface NormalizedGameState {
  cards: {
    byId: { [id: string]: SerializedCard };
    allIds: string[];
  };
  players: {
    byId: { [id: number]: SerializedPlayer };
    allIds: number[];
  };
  board: {
    [position: string]: string;
  };
  activePlayerId: number;
  selectedCardId: string | null;
  draggedCardId: string | null;
  deck: {
    cardIds: string[];
  };
  cardsRemaining: number;
}

const createStartCard = (): Card => {
  return new Card('start', SPECIAL_CARDS.START, [[0, 1, 2, 3]]);
};

const createDestinationCard = (id: string): Card => {
  return new Card('dest', `${SPECIAL_CARDS.DEST_PREFIX}${id}`, [[0, 1, 2, 3]]);
};

const createInitialState = (): NormalizedGameState => {
  // Create and shuffle deck
  const deck = new Deck();
  deck.shuffle();

  // Initialize normalized state containers
  const cardsById: { [id: string]: SerializedCard } = {};
  const cardIds: string[] = [];
  const playersById: { [id: number]: SerializedPlayer } = {};
  const playerIds: number[] = [];
  const board: { [position: string]: string } = {};
  const deckCardIds: string[] = [];

  // Add special cards to the state
  const startCard = createStartCard();
  cardsById[startCard.id] = startCard.toJSON();
  cardIds.push(startCard.id);
  board['7,4'] = startCard.id;

  // Add destination cards
  ['1', '2', '3'].forEach((id, index) => {
    const destCard = createDestinationCard(id);
    cardsById[destCard.id] = destCard.toJSON();
    cardIds.push(destCard.id);
    board[`1,${2 + index * 2}`] = destCard.id;
  });

  // Create players and deal cards
  DEFAULT_PLAYERS.forEach((config) => {
    const handIds: string[] = [];

    for (let i = 0; i < 6; i++) {
      const card = deck.drawCard();
      if (card) {
        cardsById[card.id] = card.toJSON();
        cardIds.push(card.id);
        handIds.push(card.id);
      }
    }

    playersById[config.id] = {
      id: config.id,
      name: config.name,
      avatar: config.avatar,
      handIds,
      statuses: [],
    };
    playerIds.push(config.id);
  });

  // Add remaining deck cards to state
  deck.cards.forEach((card) => {
    cardsById[card.id] = card.toJSON();
    cardIds.push(card.id);
    deckCardIds.push(card.id);
  });

  return {
    cards: {
      byId: cardsById,
      allIds: cardIds,
    },
    players: {
      byId: playersById,
      allIds: playerIds,
    },
    board,
    activePlayerId: playerIds[0],
    selectedCardId: null,
    draggedCardId: null,
    deck: {
      cardIds: deckCardIds,
    },
    cardsRemaining: deckCardIds.length,
  };
};

const gameSlice = createSlice({
  name: 'game',
  initialState: createInitialState(),
  reducers: {
    initGame(state) {
      const newState = createInitialState();
      Object.assign(state, newState);
    },
    selectCard(state, action: PayloadAction<string>) {
      state.selectedCardId = action.payload;
    },
    dragCard(state, action: PayloadAction<string>) {
      state.draggedCardId = action.payload;
    },
    placeCard(state, action: PayloadAction<{ position: string; cardId: string }>) {
      const { position, cardId } = action.payload;
      const card = state.cards.byId[cardId];
      const player = state.players.byId[state.activePlayerId];

      // Only allow placing path cards on the board
      if (card.type === 'path') {
        // Remove card from player's hand
        player.handIds = player.handIds.filter((id) => id !== cardId);

        // Place card on board
        state.board[position] = cardId;

        // Draw a new card if available
        if (state.deck.cardIds.length > 0) {
          const newCardId = state.deck.cardIds[0];
          player.handIds.push(newCardId);
          state.deck.cardIds = state.deck.cardIds.slice(1);
        }

        // Move to next player
        const currentPlayerIndex = state.players.allIds.indexOf(state.activePlayerId);
        state.activePlayerId = state.players.allIds[(currentPlayerIndex + 1) % state.players.allIds.length];
      }

      // Clear selected/dragged card
      state.selectedCardId = null;
      state.draggedCardId = null;

      // Update cards remaining count
      state.cardsRemaining = state.deck.cardIds.length;
    },
    playActionCard(state, action: PayloadAction<string>) {
      const cardId = action.payload;
      const card = state.cards.byId[cardId];
      const player = state.players.byId[state.activePlayerId];

      // Only allow playing action cards
      if (card.type === 'action') {
        // Remove card from player's hand
        player.handIds = player.handIds.filter((id) => id !== cardId);

        // Draw a new card if available
        if (state.deck.cardIds.length > 0) {
          const newCardId = state.deck.cardIds[0];
          player.handIds.push(newCardId);
          state.deck.cardIds = state.deck.cardIds.slice(1);
        }

        // Move to next player
        const currentPlayerIndex = state.players.allIds.indexOf(state.activePlayerId);
        state.activePlayerId = state.players.allIds[(currentPlayerIndex + 1) % state.players.allIds.length];

        // Update cards remaining count
        state.cardsRemaining = state.deck.cardIds.length;
      }
    },
    resetGame(state) {
      const newState = createInitialState();
      Object.assign(state, newState);
    },
  },
});

export const gameActions = gameSlice.actions;
export default gameSlice.reducer;
