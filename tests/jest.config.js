module.exports = {
  //preset: 'ts-jest',
  //testEnvironment: 'node',
  //globals: {
  //  'ts-jest': {
  //    tsConfig: './tsconfig.json',
  //    diagnostics: !process.env.PUBLIC_PACKAGES,
  //  },
  //},
  //setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['./jest.setup.js'],
  testPathIgnorePatterns: ['/workspace/'],
}
