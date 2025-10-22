module.exports = {
  // Tell Jest to use jsdom environment for testing React components
  testEnvironment: 'jsdom',
  
  // Files to run before tests
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  
  // Handle file imports
  moduleNameMapper: {
    // Handle CSS imports
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // Handle image imports
    '\\.(jpg|jpeg|png|gif|webp|svg|woff|woff2)$': '<rootDir>/src/__mocks__/fileMock.js'
  },

  // Directories to search for tests
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx}'
  ],
  
  // Transform files before testing
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  }
}