import { render, fireEvent } from '@testing-library/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import BoardCell from '../BoardCell';

const renderWithDnd = (ui) => {
  return render(
    <DndProvider backend={HTML5Backend}>
      {ui}
    </DndProvider>
  );
};

describe('BoardCell', () => {
  const mockCard = {
    id: 'test-card',
    paths: [[0, 1]]
  };

  const defaultProps = {
    card: null,
    isValidPlacement: false,
    onClick: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders empty cell when no card is provided', () => {
    const { container } = renderWithDnd(<BoardCell {...defaultProps} />);
    const style = window.getComputedStyle(container.firstChild);
    expect(style.backgroundColor).toBe('rgb(255, 255, 255)'); // #ffffff
  });

  it('renders card when provided', () => {
    const { getByAltText } = renderWithDnd(<BoardCell {...defaultProps} card={mockCard} />);
    expect(getByAltText('Card')).toBeInTheDocument();
  });

  it('shows valid placement styles when isValidPlacement is true', () => {
    const { container, getByText } = renderWithDnd(
      <BoardCell {...defaultProps} isValidPlacement={true} />
    );
    const style = window.getComputedStyle(container.firstChild);
    expect(style.backgroundColor).toBe('rgb(232, 245, 233)'); // #e8f5e9
    expect(getByText('Play here')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = jest.fn();
    const { container } = renderWithDnd(<BoardCell {...defaultProps} onClick={onClick} />);
    fireEvent.click(container.firstChild);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('has correct cursor style based on isValidPlacement', () => {
    const { container, rerender } = renderWithDnd(<BoardCell {...defaultProps} />);
    let style = window.getComputedStyle(container.firstChild);
    expect(style.cursor).toBe('default');

    rerender(
      <DndProvider backend={HTML5Backend}>
        <BoardCell {...defaultProps} isValidPlacement={true} />
      </DndProvider>
    );
    style = window.getComputedStyle(container.firstChild);
    expect(style.cursor).toBe('pointer');
  });
});
