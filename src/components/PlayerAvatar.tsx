import React from 'react';
import '../styles/PlayerAvatar.css';

interface PlayerAvatarProps {
  avatarUrl: string;
  playerName: string;
  size?: 'small' | 'medium' | 'large';
  isActive?: boolean;
}

const PlayerAvatar: React.FC<PlayerAvatarProps> = ({ avatarUrl, playerName, size = 'medium', isActive = false }) => {
  return (
    <div className={`player-avatar ${size} ${isActive ? 'active' : ''}`}>
      <img src={avatarUrl} alt={`${playerName}'s avatar`} className="avatar-image" />
    </div>
  );
};

export default PlayerAvatar;
