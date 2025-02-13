import React from 'react';
import { STYLES } from '../constants/gameConstants';

const PlayerList = ({ players, activePlayerId }) => (
  <div style={{
    backgroundColor: STYLES.BOARD_BG,
    borderRadius: '10px',
    padding: '15px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    width: '200px'
  }}>
    <h3 style={{ margin: '0 0 15px 0', textAlign: 'center' }}>Players</h3>
    {players.map(player => (
      <div
        key={player.id}
        style={{
          padding: '10px',
          marginBottom: '8px',
          backgroundColor: player.id === activePlayerId ? '#e3f2fd' : 'white',
          borderRadius: '5px',
          display: 'flex',
          flexDirection: 'column',
          gap: '5px'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{ fontSize: '24px' }}>{player.avatar}</span>
          <span style={{ flex: 1 }}>{player.name}</span>
          {player.id === activePlayerId && (
            <span style={{ color: '#2196f3' }}>●</span>
          )}
        </div>
        
        {/* Space for future debuffs */}
        <div style={{
          minHeight: '24px',
          padding: '4px',
          backgroundColor: 'rgba(0,0,0,0.05)',
          borderRadius: '3px',
          fontSize: '12px',
          color: '#666',
          display: 'flex',
          gap: '4px',
          flexWrap: 'wrap'
        }}>
          {(!player.debuffs || player.debuffs.length === 0) ? (
            <span style={{ fontStyle: 'italic' }}>No debuffs</span>
          ) : (
            player.debuffs.map((debuff, index) => (
              <span 
                key={index}
                style={{
                  padding: '2px 6px',
                  backgroundColor: 'rgba(255,0,0,0.1)',
                  borderRadius: '3px',
                  color: '#d32f2f'
                }}
              >
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
