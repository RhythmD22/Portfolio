import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: {
        ...globals.browser,
        ...globals.serviceworker,
        Chart: 'readonly',
        Fancybox: 'readonly',
        gtag: 'readonly',
        isDarkMode: 'readonly',
        getChartOptions: 'readonly',
        createChart: 'readonly',
        observeThemeChanges: 'readonly',
        initCharts: 'writable',
        updateCharts: 'writable',
        updateBubble: 'writable',
        structuredClone: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
        },
      ],
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-duplicate-imports': 'error',
      'prefer-const': 'warn',
      'eqeqeq': [
        'warn',
        'always',
        {
          null: 'ignore',
        },
      ],
      'curly': ['warn', 'multi-line'],
      'no-var': 'warn',
      'no-redeclare': ['error', { builtinGlobals: false }],
    },
  },
];