module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/packages/'],
  globals: {
    'ts-jest': {
      tsConfig: 'tests/tsconfig.json'
    }
  },
  setupFilesAfterEnv: ['./tests/jest.setup.js']
};
