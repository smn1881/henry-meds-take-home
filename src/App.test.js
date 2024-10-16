import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  it('renders Henry Meds header', () => {
    render(<App />);
    expect(screen.getByText('Henry Meds')).toBeInTheDocument();
  })
});
