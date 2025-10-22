import { fetchAllCities, fetchThematicsPerCity } from '../api/calls';

describe('API Calls', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  describe('fetchAllCities', () => {
    it('makes correct API call and parses response', async () => {
      // Mock data that matches your actual API response
      const mockCities = [{ name: 'Athens', description: 'Description of Athens' }];
      
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

  describe('fetchThematicsPerCity', () => {
    it('fetches thematics per city successfully', async () => {
      const mockResponse = {
        city: {
          name: 'Athens',
          description: 'Description of Athens'
        },
        thematics: [
          { name: 'Environment' },
          { name: 'Immigration' }
        ]
      };

      global.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      });

      const result = await fetchThematicsPerCity('Athens');
      
      // Test the fetch was called with correct URL
      expect(global.fetch).toHaveBeenCalledWith(
        `${process.env.REACT_APP_BASE_URL}cities/Athens/thematics/`
      );

      // Test the response contains both city and thematics data
      expect(result).toHaveProperty('city');
      expect(result).toHaveProperty('thematics');
      expect(result.city.name).toBe('Athens');
      expect(result.city.description).toBe('Description of Athens');
      expect(result.thematics).toHaveLength(2);
    });

    it('handles city not found error', async () => {
      global.fetch.mockResolvedValueOnce({
        status: 404,
        ok: false
      });

      await expect(fetchThematicsPerCity('NonexistentCity')).rejects.toThrow();
    });
  });
});