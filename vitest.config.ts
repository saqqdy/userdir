import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		coverage: {
			exclude: [
				'node_modules/**',
				'scripts/**',
				'**/*.config.*',
				'**/*.d.ts',
				'src/__tests__/**',
			],
			provider: 'v8',
			reporter: ['text', 'lcov'],
		},
	},
})
