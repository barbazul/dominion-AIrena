import neostandard from 'neostandard';
import globals from 'globals';

export default [
  { ignores: ['src/agents/dominiate/**'] },
  ...neostandard({ semi: true }),
  {
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      complexity: ['error', 10],
    },
  },
];
