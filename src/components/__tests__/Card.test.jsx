import { render, fireEvent } from '@testing-library/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Card from '../Card';

// Wrap component with DND provider for testing
const renderWithDnd = (ui) => {
  return render(
    <DndProvider backend={HTML5Backend}>
      {ui}
    </DndProvider>
  );
};

describe('Card', () => {
  const mockProps = {
    id: 'test-card',
    paths: [[0, 1]],
    isSelected: false,
    onSelect: jest.fn()
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = renderWithDnd(<Card {...mockProps} />);
    expect(container).toBeInTheDocument();
  });

  it('displays the correct image', () => {
    const { getByAltText } = renderWithDnd(<Card {...mockProps} />);
    const image = getByAltText('Card');
    expect(image).toHaveAttribute('src', '/src/assets/cards/card_01.png');
  });

  it('applies selected styles when isSelected is true', () => {
    const { container } = renderWithDnd(<Card {...mockProps} isSelected={true} />);
    const cardDiv = container.firstChild;
    const style = window.getComputedStyle(cardDiv);
    expect(style.border).toContain('4CAF50');
  });

  it('calls onSelect when clicked', () => {
    const onSelect = jest.fn();
    const { container } = renderWithDnd(<Card {...mockProps} onSelect={onSelect} />);
    fireEvent.click(container.firstChild);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('has drag functionality', () => {
    const { container } = renderWithDnd(<Card {...mockProps} />);
    const cardDiv = container.firstChild;
    expect(cardDiv).toHaveAttribute('draggable', 'true');
  });
});
