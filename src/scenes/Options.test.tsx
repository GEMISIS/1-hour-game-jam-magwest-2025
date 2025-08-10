import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Options } from './Options';
import { GameSettings, Difficulty } from '../types';

test('updates settings and calls onClose', async () => {
  const settings: GameSettings = {
    music: true,
    sfx: true,
    difficulty: Difficulty.Normal,
  };
  const onClose = jest.fn();
  render(<Options settings={settings} onClose={onClose} />);

  const music = screen.getByLabelText(/Music/i);
  await userEvent.click(music);

  const sfx = screen.getByLabelText(/Sound Effects/i);
  await userEvent.click(sfx);

  const select = screen.getByRole('combobox');
  await userEvent.selectOptions(select, Difficulty.Hard);

  await userEvent.click(screen.getByText(/Back/i));
  expect(onClose).toHaveBeenCalledWith({
    music: false,
    sfx: false,
    difficulty: Difficulty.Hard,
  });
});
