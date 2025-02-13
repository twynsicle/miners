import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
  });

  it('renders game board when game is started', () => {
    const { getByText } = render(<App />);
    expect(getByText(/Current Player: Player 1/)).toBeInTheDocument();
  });

  it('applies correct styles to container', () => {
    const { container } = render(<App />);
    const appDiv = container.firstChild;
    expect(appDiv).toHaveStyle({
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '20px'
    });
  });
});
