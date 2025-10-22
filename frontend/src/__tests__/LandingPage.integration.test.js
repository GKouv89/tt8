// import React from 'react';
// import { render, screen } from '@testing-library/react';
// import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import LandingPage from '../routes/LandingPage';

// describe('LandingPage Integration', () => {
//   it('renders cities from loader data', () => {
//     // Create mock data
//     const mockCities = [
//       { name: 'Eleusis' },
//       { name: 'Rennes' },
//       { name: 'ljubljiana' },
//       { name: 'Eleusis 2.0' }
//     ];

//     // Create router with mock loader
//     const router = createBrowserRouter([
//       {
//         path: '/',
//         element: <LandingPage />,
//         loader: () => mockCities // Directly return mock data
//       }
//     ]);

//     // Render with router provider
//     render(<RouterProvider router={router} />);

//     // Verify each city is rendered
//     mockCities.forEach(city => {
//       expect(screen.getByText(city.name)).toBeInTheDocument();
//     });
//   });
// });

// Polyfill Fetch API so React Router loaders work
/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "../routes/LandingPage";

// Polyfill fetch for Jest (safe – only affects test environment)
import "whatwg-fetch";

// Mock the api calls module
jest.mock("../api/calls", () => ({
  __esModule: true,
  default: jest.fn(),
}));

import fetchAllCities from "../api/calls";

describe("LandingPage integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders city list from loader", async () => {
    // Mock loader data
    const mockCities = [
      { name: "Athens" },
      { name: "Rennes" },
      { name: "Ljubljana" },
    ];
    fetchAllCities.mockResolvedValueOnce(mockCities);

    // Create router including the loader
    const router = createBrowserRouter([
      {
        path: "/",
        element: <LandingPage />,
        loader: async () => fetchAllCities(),
      },
    ]);

    // Render within act to avoid React state warnings
    await act(async () => {
      render(<RouterProvider router={router} />);
    });

    // Optional: check initial loading state (short-lived, so we use queryByText)
    // expect(screen.queryByText(/loading/i)).toBeInTheDocument();

    // Wait for final data to appear
    await waitFor(() => {
      expect(screen.getByText("Select a City")).toBeInTheDocument();
      expect(screen.getByText("Athens")).toBeInTheDocument();
      expect(screen.getByText("Rennes")).toBeInTheDocument();
      expect(screen.getByText("Ljubljana")).toBeInTheDocument();
    });
  });
});
