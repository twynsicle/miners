import React, { useState } from 'react';

function Lobby({ onStart }) {
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useState([]);

  const handleJoin = () => {
    if (playerName) {
      setPlayers([...players, playerName]);
      setPlayerName('');
    }
  };

  return (
    <div>
      <h1>Lobby</h1>
      <input
        type="text"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        placeholder="Enter your name"
      />
      <button onClick={handleJoin}>Join</button>
      <ul>
        {players.map((player, index) => (
          <li key={index}>{player}</li>
        ))}
      </ul>
      <button onClick={onStart} disabled={players.length < 2}>
        Start Game
      </button>
    </div>
  );
}

export default Lobby;
