import { render, screen } from '@testing-library/react';
import App from './App';

test('renders character', () => {
  render(<App />);
  const img = screen.getByAltText(/character/i);
  expect(img).toBeInTheDocument();
});
