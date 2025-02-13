import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { SPECIAL_CARDS } from '../constants/gameConstants';
import { Deck } from '../components/Deck';

// Create context
const GameStateContext = createContext();
const GameDispatchContext = createContext();

// Define initial state
const createInitialState = () => ({
  players: [
    {
      id: 1,
      name: 'Player 1',
      avatar: '👤',
      hand: []
    }
  ],
  activePlayerId: 1,
  board: {},
  deck: null,
  cardsRemaining: 0,
  selectedCard: null,
  draggedCard: null
});

// Initialize a fresh game state
const initializeGameState = (baseState = createInitialState()) => {
  const newDeck = new Deck();
  const initialHand = Array(6).fill(null).map(() => newDeck.drawCard());
  
  const newState = {
    ...baseState,
    players: baseState.players.map(player => ({
      ...player,
      hand: player.id === 1 ? initialHand : []
    })),
    deck: newDeck,
    cardsRemaining: newDeck.getCardsRemaining(),
    board: {
      // Place start card in center of row 8
      '7,4': {
        type: 'start',
        id: SPECIAL_CARDS.START,
        paths: [[0, 1, 2, 3]] // All directions
      },
      // Place destination cards
      '1,2': {
        type: 'dest',
        id: 1,
        cardId: `${SPECIAL_CARDS.DEST_PREFIX}1`,
        paths: [[0, 1, 2, 3]]
      },
      '1,4': {
        type: 'dest',
        id: 2,
        cardId: `${SPECIAL_CARDS.DEST_PREFIX}2`,
        paths: [[0, 1, 2, 3]]
      },
      '1,6': {
        type: 'dest',
        id: 3,
        cardId: `${SPECIAL_CARDS.DEST_PREFIX}3`,
        paths: [[0, 1, 2, 3]]
      }
    }
  };
  
  localStorage.setItem('gameState', JSON.stringify(newState));
  return newState;
};

// Action types
const ACTIONS = {
  INIT_GAME: 'init_game',
  PLACE_CARD: 'place_card',
  SELECT_CARD: 'select_card',
  DRAG_CARD: 'drag_card',
  DRAW_CARD: 'draw_card',
  SET_ACTIVE_PLAYER: 'set_active_player',
  LOAD_STATE: 'load_state',
  RESET_GAME: 'reset_game'
};

// Reducer function
function gameReducer(state, action) {
  switch (action.type) {
    case ACTIONS.INIT_GAME: {
      return initializeGameState(state);
    }
    
    case ACTIONS.PLACE_CARD: {
      const { position, card } = action.payload;
      const player = state.players.find(p => p.id === state.activePlayerId);
      const cardIndex = player.hand.indexOf(card);
      
      // Draw a new card
      const newCard = state.deck.drawCard();
      
      const newState = {
        ...state,
        board: {
          ...state.board,
          [position]: {
            ...card,
            cardId: card.id // Preserve the card ID for rendering
          }
        },
        players: state.players.map(p => {
          if (p.id === state.activePlayerId) {
            const newHand = [...p.hand];
            newHand[cardIndex] = newCard;
            return { ...p, hand: newHand };
          }
          return p;
        }),
        selectedCard: null,
        draggedCard: null,
        cardsRemaining: state.deck.getCardsRemaining()
      };
      
      localStorage.setItem('gameState', JSON.stringify(newState));
      return newState;
    }
    
    case ACTIONS.SELECT_CARD: {
      const newState = {
        ...state,
        selectedCard: action.payload === state.selectedCard ? null : action.payload
      };
      localStorage.setItem('gameState', JSON.stringify(newState));
      return newState;
    }
    
    case ACTIONS.DRAG_CARD: {
      const newState = {
        ...state,
        draggedCard: action.payload
      };
      localStorage.setItem('gameState', JSON.stringify(newState));
      return newState;
    }
    
    case ACTIONS.SET_ACTIVE_PLAYER: {
      const newState = {
        ...state,
        activePlayerId: action.payload
      };
      localStorage.setItem('gameState', JSON.stringify(newState));
      return newState;
    }
    
    case ACTIONS.RESET_GAME: {
      localStorage.removeItem('gameState');
      return initializeGameState();
    }
    
    case ACTIONS.LOAD_STATE: {
      return action.payload;
    }
    
    default:
      return state;
  }
}

// Provider component
export function GameStateProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, null, () => {
    // Try to load state from localStorage
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      // Recreate deck instance
      if (parsedState.deck) {
        parsedState.deck = Object.assign(new Deck(), parsedState.deck);
      }
      return parsedState;
    }
    return initializeGameState();
  });
  
  // Initialize game if no deck exists
  useEffect(() => {
    if (!state.deck) {
      dispatch({ type: ACTIONS.INIT_GAME });
    }
  }, []);
  
  return (
    <GameStateContext.Provider value={state}>
      <GameDispatchContext.Provider value={dispatch}>
        {children}
      </GameDispatchContext.Provider>
    </GameStateContext.Provider>
  );
}

// Custom hooks to use the game state
export function useGameState() {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
}

export function useGameDispatch() {
  const context = useContext(GameDispatchContext);
  if (context === undefined) {
    throw new Error('useGameDispatch must be used within a GameStateProvider');
  }
  return context;
}

// Action creators
export const gameActions = {
  initGame: () => ({ type: ACTIONS.INIT_GAME }),
  placeCard: (position, card) => ({
    type: ACTIONS.PLACE_CARD,
    payload: { position, card }
  }),
  selectCard: (card) => ({
    type: ACTIONS.SELECT_CARD,
    payload: card
  }),
  dragCard: (card) => ({
    type: ACTIONS.DRAG_CARD,
    payload: card
  }),
  setActivePlayer: (playerId) => ({
    type: ACTIONS.SET_ACTIVE_PLAYER,
    payload: playerId
  }),
  resetGame: () => ({ type: ACTIONS.RESET_GAME })
};
