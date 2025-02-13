import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import GameBoard from './components/GameBoard';
import { GameStateProvider } from './state/GameStateContext';
import './styles/variables.css';
import './styles/global.css';

/**
 * Initial player state
 */
const INITIAL_PLAYERS = [
  { name: 'Player 1', score: 0 },
  { name: 'Player 2', score: 0 }
];

/**
 * Main App component
 */
function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <GameStateProvider>
        <GameBoard />
      </GameStateProvider>
    </DndProvider>
  );
}

export default App;
