import React from 'react';
import { useSelector } from 'react-redux';
import PlayerAvatar from './PlayerAvatar';
import '../styles/PlayerList.css';
import { selectAllPlayers, selectActivePlayer } from '../state/selectors';

const PlayerList = () => {
  const players = useSelector(selectAllPlayers);
  const activePlayer = useSelector(selectActivePlayer);

  return (
    <div className="player-list">
      <h3 className="player-list-title">Players</h3>
      {players.map(player => (
        <div 
          key={player.id} 
          className={`player-card ${player.id === activePlayer?.id ? 'active' : ''}`}
        >
          <PlayerAvatar 
            avatarUrl={player.avatar}
            playerName={player.name}
            size="medium"
            isActive={player.id === activePlayer?.id}
          />
          <div className="player-info">
            <div className="player-name-row">
              <span className="player-name">{player.name}</span>
              {player.id === activePlayer?.id && (
                <span className="active-indicator">●</span>
              )}
            </div>
            <div className="debuff-container">
              {(!player.statuses || player.statuses.length === 0) ? (
                <span className="no-debuffs">No active effects</span>
              ) : (
                player.statuses.map((status, index) => (
                  <span key={index} className="debuff-tag" title={status.effect}>
                    {status.type} ({status.duration})
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlayerList;
