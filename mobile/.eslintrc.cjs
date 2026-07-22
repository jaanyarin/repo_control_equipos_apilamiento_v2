module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  globals: {
    __DEV__: 'readonly',
    atob: 'readonly',
    btoa: 'readonly',
  },
  rules: {
    'no-undef': 'error',
    'no-unused-vars': 'off',
    'no-unreachable': 'error',
  },
}
