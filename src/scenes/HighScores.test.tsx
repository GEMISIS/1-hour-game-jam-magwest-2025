import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HighScores } from './HighScores';
import { ScoreRecord, ArmType, LegType, WeaponType } from '../types';
import { cities } from '../data/cities';

test('lists high scores and handles back', async () => {
  const records: ScoreRecord[] = [
    {
      id: '1',
      kaiju: {
        name: 'Gorgo',
        arms: ArmType.Claws,
        legs: LegType.Biped,
        weapon: WeaponType.Fire,
      },
      cityId: 'metroville',
      score: 1000,
      createdAt: 'now',
    },
  ];
  const onBack = jest.fn();
  render(<HighScores scores={records} onBack={onBack} />);

  const cityName = cities.find((c) => c.id === 'metroville')?.name;
  const text = `${records[0].kaiju.name} in ${cityName}: $${records[0].score}`;
  expect(screen.getByText(text)).toBeInTheDocument();

  await userEvent.click(screen.getByText(/Back/i));
  expect(onBack).toHaveBeenCalled();
});
