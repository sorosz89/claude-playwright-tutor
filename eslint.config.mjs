import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';

export default defineConfig(
  { ignores: ['node_modules/', 'playwright-report/', 'test-results/'] },
  ...tseslint.configs.recommended,
  {
    ...playwright.configs['flat/recommended'],
    files: ['tests/**/*.ts', 'challenges/**/*.ts'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      'playwright/no-wait-for-timeout': 'error',
      'playwright/no-force-option': 'error',
      'playwright/prefer-web-first-assertions': 'error',
      // Unlike zero-gluten-e2e, 'playwright/no-raw-locators' is intentionally
      // left off: Playwright's own TodoMVC example uses raw CSS (e.g.
      // `input.new-todo`), and Challenge 2's whole premise is a raw CSS
      // selector breaking and getting healed back into another raw selector.
    },
  },
  {
    // The TODO scaffolding under challenges/ intentionally pre-declares
    // imports/consts a learner wires up as they fill in each TODO, so they
    // aren't all "used" yet. solutions/ files are unaffected (no unused
    // symbols once fully implemented), so disabling this here is low-risk.
    files: ['challenges/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
);
