import React from 'react';
import { STYLES } from '../constants/gameConstants';

const PlayerList = ({ players, activePlayerId }) => {
  return (
    <div style={{
      width: STYLES.PLAYER_LIST_WIDTH,
      marginRight: '20px',
      backgroundColor: '#f5f5f5',
      borderRadius: '10px',
      padding: '15px'
    }}>
      <h2 style={{ margin: '0 0 15px 0', textAlign: 'center' }}>Players</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {players.map(player => (
          <div
            key={player.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '10px',
              borderLeft: player.id === activePlayerId ? STYLES.ACTIVE_PLAYER_INDICATOR : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: STYLES.PLAYER_AVATAR_SIZE,
                height: STYLES.PLAYER_AVATAR_SIZE,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                backgroundColor: '#f0f0f0',
                borderRadius: '50%'
              }}>
                {player.avatar}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold' }}>{player.name}</div>
                <div style={{ fontSize: '0.9em', color: '#666' }}>Score: {player.score}</div>
              </div>
            </div>
            
            {/* Space for future debuffs */}
            <div style={{
              marginTop: '8px',
              height: STYLES.PLAYER_DEBUFF_HEIGHT,
              backgroundColor: '#f9f9f9',
              borderRadius: '4px'
            }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerList;
