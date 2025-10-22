import React from 'react';
import { render, screen } from '@testing-library/react';
import { useLoaderData } from 'react-router-dom';
import LandingPage from '../routes/LandingPage';

// Mock the react-router-dom hook
jest.mock('react-router-dom', () => ({
  useLoaderData: jest.fn(),
  Link: ({ children }) => children // Mock Link component to render its children
}));

describe('LandingPage', () => {
  it('displays cities from loader data with descriptions', () => {
    const mockCities = [
      { name: 'Athens', description: 'Capital of Greece' },
      { name: 'Thessaloniki', description: 'Second largest city' }
    ];
    useLoaderData.mockReturnValue(mockCities);

    render(<LandingPage />);
    
    expect(screen.getByText('Athens')).toBeInTheDocument();
    expect(screen.getByText('Thessaloniki')).toBeInTheDocument();
  });

  it('shows loading state when loader returns empty array', () => {
    useLoaderData.mockReturnValue([]);
    render(<LandingPage />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  describe('Footer', () => {
    beforeEach(() => {
      // Provide any data to render the component
      useLoaderData.mockReturnValue([{ name: 'Athens' }]);
    });

    it('renders all logos', () => {
      render(<LandingPage />);
      
      expect(screen.getByAltText('Athena Research Center logo')).toBeInTheDocument();
      expect(screen.getByAltText('Mentor logo')).toBeInTheDocument();
      expect(screen.getByAltText('NKUA logo')).toBeInTheDocument();
      expect(screen.getByAltText('Cofinanced by Greece and the European Union')).toBeInTheDocument();
    });

    it('logos have correct styling', () => {
      render(<LandingPage />);
      
      const logos = screen.getAllByRole('img');
      logos.forEach(logo => {
        expect(logo).toHaveStyle({
          height: '50px',
          width: 'auto',
          objectFit: 'contain'
        });
      });
    });

    it('footer has correct positioning', () => {
      render(<LandingPage />);
      
      const footer = screen.getByRole('contentinfo');
      expect(footer).toHaveStyle({
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%'
      });
    });
  });
});