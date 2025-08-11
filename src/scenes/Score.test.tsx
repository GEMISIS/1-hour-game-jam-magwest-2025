import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Score } from './Score';

test('renders score and calls handlers', async () => {
  const onPlayAgain = jest.fn();
  const onViewHighScores = jest.fn();
  const scoreValue = 12345;

  render(
    <Score
      score={scoreValue}
      onPlayAgain={onPlayAgain}
      onViewHighScores={onViewHighScores}
    />
  );

  const formatted = `$${scoreValue.toLocaleString()}`;
  expect(screen.getByText(formatted)).toBeInTheDocument();

  await userEvent.click(screen.getByText(/Play Again/i));
  expect(onPlayAgain).toHaveBeenCalled();

  await userEvent.click(screen.getByText(/High Scores/i));
  expect(onViewHighScores).toHaveBeenCalled();
});
