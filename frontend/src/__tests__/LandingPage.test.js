import React from 'react';
import { render, screen } from '@testing-library/react';
import { useLoaderData } from 'react-router-dom';
import LandingPage from '../routes/LandingPage';

// Mock the react-router-dom hook
jest.mock('react-router-dom', () => ({
  useLoaderData: jest.fn(),
}));

describe('LandingPage', () => {
  it('displays cities from loader data', () => {
    // Mock the loader data
    const mockCities = [{name: 'Athens'}, {name: 'Thessaloniki'}];
    useLoaderData.mockReturnValue(mockCities);

    render(<LandingPage />);
    
    expect(screen.getByText('Athens')).toBeInTheDocument();
    expect(screen.getByText('Thessaloniki')).toBeInTheDocument();
  });

  it('shows no cities when loader returns empty array', () => {
    useLoaderData.mockReturnValue([]);

    render(<LandingPage />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});