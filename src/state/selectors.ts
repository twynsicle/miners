import { RootState } from './store';
import { createSelector } from '@reduxjs/toolkit';
import { Card } from '@/classes/Card';
import { SerializedCard } from './gameSlice';

export const selectGameState = (state: RootState) => state.game;
export const selectCards = (state: RootState) => state.game.cards;

const createCardFromStored = (cardData: SerializedCard | undefined): Card | null => {
  if (!cardData) return null;
  // Parse paths before creating the Card
  const paths = JSON.parse(cardData.paths);
  return new Card(paths, cardData.type, cardData.id);
};

export const selectAllPlayers = createSelector([selectGameState], (game) =>
  game.players.allIds
    .map((id) => {
      const player = game.players.byId[id];
      if (!player) return null;
      const handCards = player.handIds
        .map((cardId) => createCardFromStored(game.cards.byId[cardId]))
        .filter((card): card is Card => card !== null);
      return {
        ...player,
        hand: handCards,
      };
    })
    .filter((player) => player !== null),
);

export const selectActivePlayer = createSelector([selectGameState], (game) => {
  const player = game.players.byId[game.activePlayerId];
  if (!player) return null;
  const handCards = player.handIds
    .map((cardId) => createCardFromStored(game.cards.byId[cardId]))
    .filter((card): card is Card => card !== null);
  return {
    ...player,
    hand: handCards,
  };
});

// Board selectors
export const selectBoardCards = createSelector([selectGameState], (game) => {
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
});

// Game state selectors
export const selectCardsRemaining = createSelector([selectGameState], (game) => game.cardsRemaining);

export const selectActivePlayerId = createSelector([selectGameState], (game) => game.activePlayerId);

export const selectSelectedCard = createSelector([selectGameState, selectCards], (game, cards) =>
  game.selectedCardId ? createCardFromStored(cards.byId[game.selectedCardId]) : null,
);

export const selectDraggedCard = createSelector([selectGameState, selectCards], (game, cards) =>
  game.draggedCardId ? createCardFromStored(cards.byId[game.draggedCardId]) : null,
);
