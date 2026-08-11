module.exports = {
  preset: 'react-native',
  testTimeout: 30000,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation/.*|react-native-safe-area-context|react-native-screens|react-native-paper|react-native-vector-icons)/)',
  ],
}
