import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SelectCity } from './SelectCity';
import { cities } from '../data/cities';

test('selects a city and begins rampage', async () => {
  const onBegin = jest.fn();
  render(<SelectCity onBegin={onBegin} />);

  const select = screen.getByRole('combobox');
  await userEvent.selectOptions(select, cities[1].id);
  await userEvent.click(screen.getByText(/Begin Rampage/i));

  expect(onBegin).toHaveBeenCalledWith(cities[1]);
});
