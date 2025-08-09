import { render, screen } from '@testing-library/react';
import App from './App';

test('renders start menu', () => {
  render(<App />);
  const button = screen.getByText(/Start Game/i);
  expect(button).toBeInTheDocument();
});
