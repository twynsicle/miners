import { useSelector } from 'react-redux';
import CardDisplay from './CardDisplay';
import { selectActivePlayer, selectSelectedCard } from '@/state/selectors';
import '../styles/PlayerHand.css';

const PlayerHand = () => {
  const activePlayer = useSelector(selectActivePlayer);
  const selectedCard = useSelector(selectSelectedCard);

  if (!activePlayer) return null;

  return (
    <div className="player-hand-container">
      <div className="player-name">{activePlayer.name}&apos;s Hand</div>
      <div className="cards-container">
        {activePlayer.hand.map((card) => (
          <div key={`hand-${card.id}`} className={`hand-card ${card.id === selectedCard?.id ? 'selected' : ''}`}>
            <CardDisplay card={card} isDraggable={true} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerHand;
