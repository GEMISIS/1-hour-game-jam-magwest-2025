import { render, screen } from '@testing-library/react';
import App from './App';

test('renders start menu', () => {
  render(<App />);
  expect(screen.getByText(/Start Game/i)).toBeInTheDocument();
  expect(screen.getByText(/Options/i)).toBeInTheDocument();
});
