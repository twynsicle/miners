import { RootState } from './store';
import { createSelector } from '@reduxjs/toolkit';
import { Card } from '../classes/Card';
import { Player } from '../classes/Player';

// Basic selectors
const selectGameState = (state: RootState) => state.game;
const selectPlayers = (state: RootState) => state.game.players;
const selectBoard = (state: RootState) => state.game.board;
const selectCards = (state: RootState) => state.game.cards;

// Helper function to safely create a Card from stored data
const createCardFromStored = (cardData: any): Card | null => {
  if (!cardData) return null;
  // Parse paths before creating the Card
  const paths = typeof cardData.paths === 'string' ? JSON.parse(cardData.paths) : cardData.paths;
  return new Card(
    paths,
    cardData.type,
    cardData.id
  );
};

// Card selectors
export const selectCardById = createSelector(
  [selectCards, (state: RootState, cardId: string) => cardId],
  (cards, cardId) => cards.byId[cardId] ? createCardFromStored(cards.byId[cardId]) : null
);

export const selectAllCards = createSelector(
  [selectCards],
  (cards) => cards.allIds.map(id => createCardFromStored(cards.byId[id])).filter((card): card is Card => card !== null)
);

// Player selectors
export const selectPlayerById = createSelector(
  [selectGameState, selectCards, (state: RootState, playerId: number) => playerId],
  (game, cards, playerId) => {
    const player = game.players.byId[playerId];
    if (!player) return null;

    // Reconstruct player's hand
    const handCards = player.handIds.map(cardId => 
      createCardFromStored(game.cards.byId[cardId])
    ).filter((card): card is Card => card !== null);

    return {
      ...player,
      hand: handCards
    };
  }
);

export const selectAllPlayers = createSelector(
  [selectGameState],
  (game) => game.players.allIds.map(id => {
    const player = game.players.byId[id];
    if (!player) return null;
    const handCards = player.handIds.map(cardId => 
      createCardFromStored(game.cards.byId[cardId])
    ).filter((card): card is Card => card !== null);
    return {
      ...player,
      hand: handCards
    };
  }).filter((player): player is Player => player !== null)
);

export const selectActivePlayer = createSelector(
  [selectGameState],
  (game) => {
    const player = game.players.byId[game.activePlayerId];
    if (!player) return null;
    const handCards = player.handIds.map(cardId => 
      createCardFromStored(game.cards.byId[cardId])
    ).filter((card): card is Card => card !== null);
    return {
      ...player,
      hand: handCards
    };
  }
);

// Game state selectors
export const selectCardsRemaining = createSelector(
  [selectGameState],
  (game) => game.cardsRemaining
);

export const selectActivePlayerId = createSelector(
  [selectGameState],
  (game) => game.activePlayerId
);

// Board selectors
export const selectBoardCards = createSelector(
  [selectGameState],
  (game) => {
    const boardCards: { [position: string]: Card } = {};
    Object.entries(game.board).forEach(([position, cardId]) => {
      if (cardId) {
        const card = createCardFromStored(game.cards.byId[cardId]);
        if (card) {
          boardCards[position] = card;
        }
      }
    });
    return boardCards;
  }
);

export const selectBoardCard = createSelector(
  [selectGameState, (state: RootState, position: string) => position],
  (game, position) => {
    const cardId = game.board[position];
    return cardId ? createCardFromStored(game.cards.byId[cardId]) : null;
  }
);

// Selected/Dragged card selectors
export const selectSelectedCard = createSelector(
  [selectGameState],
  (game) => game.selectedCardId ? createCardFromStored(game.cards.byId[game.selectedCardId]) : null
);

export const selectDraggedCard = createSelector(
  [selectGameState],
  (game) => game.draggedCardId ? createCardFromStored(game.cards.byId[game.draggedCardId]) : null
);

// Deck selectors
export const selectDeckCards = createSelector(
  [selectGameState],
  (game) => game.deck.cardIds
    .map(id => createCardFromStored(game.cards.byId[id]))
    .filter((card): card is Card => card !== null)
);
