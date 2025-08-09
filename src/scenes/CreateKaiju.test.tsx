import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateKaiju } from './CreateKaiju';

test('uses a default name and blocks empty names', async () => {
  const onContinue = jest.fn();
  render(<CreateKaiju onContinue={onContinue} />);
  const input = screen.getByPlaceholderText(/Name/i) as HTMLInputElement;
  const button = screen.getByText(/Continue/i);

  expect(input.value).not.toBe('');
  expect(button).toBeEnabled();

  await userEvent.clear(input);
  expect(button).toBeDisabled();

  await userEvent.type(input, 'Titan');
  expect(button).toBeEnabled();
  await userEvent.click(button);
  expect(onContinue).toHaveBeenCalledWith(
    expect.objectContaining({ name: 'Titan' })
  );
});
