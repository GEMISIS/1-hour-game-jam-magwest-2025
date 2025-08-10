import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateKaiju } from './CreateKaiju';
import { ArmType, LegType, WeaponType } from '../types';

test('uses a default name and blocks empty names', async () => {
  const onContinue = jest.fn();
  render(<CreateKaiju onContinue={onContinue} />);
  const input = screen.getByPlaceholderText(/Name/i) as HTMLInputElement;
  const button = screen.getByText(/Continue/i);

  expect(input.value).not.toBe('');
  expect(button).toBeEnabled();

  await userEvent.clear(input);
  expect(button).toBeDisabled();

  // Force click to exercise early return when name is empty
  button.removeAttribute('disabled');
  await userEvent.click(button);
  expect(onContinue).not.toHaveBeenCalled();

  await userEvent.type(input, 'Titan');
  expect(button).toBeEnabled();

  const [arms, legs, weapon] = screen.getAllByRole('combobox');
  await userEvent.selectOptions(arms, ArmType.Club);
  await userEvent.selectOptions(legs, LegType.Quad);
  await userEvent.selectOptions(weapon, WeaponType.Laser);
  await userEvent.click(button);
  expect(onContinue).toHaveBeenCalledWith(
    expect.objectContaining({
      name: 'Titan',
      arms: ArmType.Club,
      legs: LegType.Quad,
      weapon: WeaponType.Laser,
    })
  );
});
