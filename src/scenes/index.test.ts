import { Start, CreateKaiju, SelectCity, Score, HighScores, Options } from './index';

test('re-exports all scenes', () => {
  expect(Start).toBeDefined();
  expect(CreateKaiju).toBeDefined();
  expect(SelectCity).toBeDefined();
  expect(Score).toBeDefined();
  expect(HighScores).toBeDefined();
  expect(Options).toBeDefined();
});
