import React from 'react';
import '../styles/PlayerList.css';

const PlayerList = ({ players, activePlayerId }) => (
  <div className="player-list">
    <h3 className="player-list-title">Players</h3>
    {players.map(player => (
      <div
        key={player.id}
        className={`player-card ${player.id === activePlayerId ? 'active' : ''}`}
      >
        <div className="player-info">
          <span className="player-avatar">{player.avatar}</span>
          <span className="player-name">{player.name}</span>
          {player.id === activePlayerId && (
            <span className="active-indicator">●</span>
          )}
        </div>
        
        <div className="debuff-container">
          {(!player.debuffs || player.debuffs.length === 0) ? (
            <span className="no-debuffs">No debuffs</span>
          ) : (
            player.debuffs.map((debuff, index) => (
              <span key={index} className="debuff-tag">
                {debuff}
              </span>
            ))
          )}
        </div>
      </div>
    ))}
  </div>
);

export default PlayerList;
