import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Card} from '@/classes/Card';
import {Deck} from '@/classes/Deck';
import {PlayerStatus} from '@/classes/Player';
import {SPECIAL_CARDS} from '@/constants/gameConstants';
import {DEFAULT_PLAYERS} from '@/constants/playerConstants';
import {CardType} from "@/types";

export interface SerializedCard {
  paths: string;
  type: CardType;
  id: string;
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
  return new Card([[0, 1, 2, 3]], 'start', SPECIAL_CARDS.START);
};

const createDestinationCard = (id: string): Card => {
  return new Card([[0, 1, 2, 3]], 'dest', `${SPECIAL_CARDS.DEST_PREFIX}${id}`);
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
  DEFAULT_PLAYERS.forEach(config => {
    const handIds: string[] = [];

    // Deal 5 cards to each player
    for (let i = 0; i < 5; i++) {
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
      statuses: []
    };
    playerIds.push(config.id);
  });

  // Add remaining deck cards to state
  deck.cards.forEach(card => {
    cardsById[card.id] = card.toJSON();
    cardIds.push(card.id);
    deckCardIds.push(card.id);
  });

  return {
    cards: {
      byId: cardsById,
      allIds: cardIds
    },
    players: {
      byId: playersById,
      allIds: playerIds
    },
    board,
    activePlayerId: playerIds[0],
    selectedCardId: null,
    draggedCardId: null,
    deck: {
      cardIds: deckCardIds
    },
    cardsRemaining: deckCardIds.length
  };
};

const gameSlice = createSlice({
  name: 'game',
  initialState: createInitialState(),
  reducers: {
    initGame: (state) => {
      const newState = createInitialState();
      Object.assign(state, newState);
    },
    selectCard: (state, action: PayloadAction<string>) => {
      state.selectedCardId = action.payload;
      state.draggedCardId = null;
    },
    dragCard: (state, action: PayloadAction<string>) => {
      state.draggedCardId = action.payload;
      state.selectedCardId = null;
    },
    placeCard: (state, action: PayloadAction<{ position: string; cardId: string }>) => {
      const { position, cardId } = action.payload;
      
      // Place card on board
      state.board[position] = cardId;
      state.selectedCardId = null;
      state.draggedCardId = null;
      
      // Find active player
      const activePlayer = state.players.byId[state.activePlayerId];
      if (activePlayer) {
        // Remove card from player's hand
        activePlayer.handIds = activePlayer.handIds.filter(id => id !== cardId);
        
        // Draw a new card if available
        if (state.deck.cardIds.length > 0) {
          const newCardId = state.deck.cardIds.pop()!;
          activePlayer.handIds.push(newCardId);
          state.cardsRemaining = state.deck.cardIds.length;
        }

        // Move to next player
        const currentPlayerIndex = state.players.allIds.indexOf(state.activePlayerId);
        const nextPlayerIndex = (currentPlayerIndex + 1) % state.players.allIds.length;
        state.activePlayerId = state.players.allIds[nextPlayerIndex];
      }
    },
    resetGame: (state) => {
      const newState = createInitialState();
      Object.assign(state, newState);
    }
  }
});

export const gameActions = gameSlice.actions;
export default gameSlice.reducer;
