const baseConfig = require('./base');

module.exports = {
  ...baseConfig,
  extends: [
    ...baseConfig.extends,
    'next/core-web-vitals',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    ...baseConfig.rules,
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'jsx-a11y/alt-text': 'warn',
    'jsx-a11y/aria-props': 'warn',
  },
}; 