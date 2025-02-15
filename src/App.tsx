import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { useDispatch } from 'react-redux';
import GameBoard from './components/GameBoard';
import { store } from './state/store';
import { gameActions } from './state/gameSlice';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './styles/variables.css';
import './styles/global.css';

const GameInitializer: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(gameActions.initGame());
  }, [dispatch]);

  return <GameBoard />;
};

/**
 * Main App component
 */
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
        <GameInitializer />
      </DndProvider>
    </Provider>
  );
};

export default App;
