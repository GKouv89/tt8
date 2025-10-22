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

  test("renders city list and allows navigation", async () => {
    const mockCities = [
      { name: "Athens", description: "Capital of Greece" },
      { name: "Rennes", description: "French city" },
      { name: "Ljubljana", description: "Capital of Slovenia" },
    ];
    fetchAllCities.mockResolvedValueOnce(mockCities);

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

    // Wait for and test final rendered state
    await waitFor(() => {
      expect(screen.getByText("Select a City")).toBeInTheDocument();
      mockCities.forEach(city => {
        expect(screen.getByText(city.name)).toBeInTheDocument();
      });
    });

    // Test footer presence in integration
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getAllByRole('img')).toHaveLength(4);
  });

  test("handles empty cities list", async () => {
    fetchAllCities.mockResolvedValueOnce([]);

    const router = createBrowserRouter([
      {
        path: "/",
        element: <LandingPage />,
        loader: async () => fetchAllCities(),
      },
    ]);

    await act(async () => {
      render(<RouterProvider router={router} />);
    });

    // expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  // test("handles API errors", async () => {
  //   fetchAllCities.mockRejectedValueOnce(new Error("Failed to fetch"));

  //   const router = createBrowserRouter([
  //     {
  //       path: "/",
  //       element: <LandingPage />,
  //       loader: async () => fetchAllCities(),
  //     },
  //   ]);

  //   await act(async () => {
  //     render(<RouterProvider router={router} />);
  //   });

  //   // Should show loading state when error occurs
  //   expect(screen.getByText("Loading...")).toBeInTheDocument();
  // });
});
