import baseConfig from '@addy/common/eslint';

export default [
  ...baseConfig,
  {
    ignores: ['eslint.config.mjs'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];
