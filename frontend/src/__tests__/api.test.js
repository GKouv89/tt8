import { fetchAllCities, fetchThematicsPerCity } from '../api/calls';

describe('API Calls', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  describe('fetchAllCities', () => {
    it('makes correct API call and parses response', async () => {
      // Mock data that matches your actual API response
      const mockCities = [{ name: 'Athens' }];
      
      // Mock the fetch call
      global.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockCities)
      });

      // Call the function
      const cities = await fetchAllCities();

      // Test the fetch was called with correct URL
      expect(global.fetch).toHaveBeenCalledWith(
        `${process.env.REACT_APP_BASE_URL}cities/`
      );
      
      // Test the response parsing
      expect(cities).toEqual(mockCities);
    });

    it('handles API errors correctly', async () => {
      // Mock a failed API call
      global.fetch.mockRejectedValueOnce(new Error('API Error'));

      // Test error handling
      await expect(fetchAllCities()).rejects.toThrow('API Error');
    });
  });

  it('fetches thematics per city successfully', async () => {
    const mockThematics = [{name: 'Environment', description: 'Test'}, {name: 'Immigration', description: null}];
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockThematics)
    });

    const thematics = await fetchThematicsPerCity('Athens');
    expect(thematics).toEqual(mockThematics);
  });
});