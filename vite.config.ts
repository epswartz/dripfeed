import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*_test.ts'], // Update to match the x_test.ts pattern
  },
});
