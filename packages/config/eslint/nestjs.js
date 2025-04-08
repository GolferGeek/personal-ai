const baseConfig = require('./base');

module.exports = {
  ...baseConfig,
  extends: [
    ...baseConfig.extends,
    'plugin:@nestjs/recommended',
  ],
  rules: {
    ...baseConfig.rules,
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': ['warn', {
      allowExpressions: true,
      allowTypedFunctionExpressions: true,
    }],
    '@typescript-eslint/explicit-module-boundary-types': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
}; 