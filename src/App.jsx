import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import GameBoard from './components/GameBoard';

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
  const [gameStarted] = useState(true);
  const [players] = useState(INITIAL_PLAYERS);

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '20px',
        boxSizing: 'border-box'
      }}>
        {gameStarted && <GameBoard players={players} />}
      </div>
    </DndProvider>
  );
}

export default App;
