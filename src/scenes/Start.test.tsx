import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Start } from './Start';

test('calls handlers when start menu buttons are clicked', async () => {
  const onStartGame = jest.fn();
  const onViewHighScores = jest.fn();
  const onOptions = jest.fn();

  render(
    <Start
      onStartGame={onStartGame}
      onViewHighScores={onViewHighScores}
      onOptions={onOptions}
    />
  );

  await userEvent.click(screen.getByText(/Start Game/i));
  expect(onStartGame).toHaveBeenCalled();

  await userEvent.click(screen.getByText(/High Scores/i));
  expect(onViewHighScores).toHaveBeenCalled();

  await userEvent.click(screen.getByText(/Options/i));
  expect(onOptions).toHaveBeenCalled();
});
