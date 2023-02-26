/** @type {import('ts-jest').JestConfigWithTsJest} */

module.exports = {
	// preset: 'ts-jest/presets/default-esm',
	preset: 'ts-jest',
	testEnvironment: 'node',
	// setupFilesAfterEnv: ['./scripts/setupJestEnv.ts'],
	transform: {
		'^.+\\.tsx?$': [
			'ts-jest',
			{
				useESM: true,
				tsconfig: {
					target: 'esnext',
					sourceMap: true
				}
			}
		]
	},
	// globals: {
	// 	__DEV__: true,
	// 	__TEST__: true,
	// 	__VERSION__: require('./package.json').version,
	// 	__BROWSER__: false,
	// 	__GLOBAL__: false,
	// 	__ESM_BUNDLER__: true,
	// 	__ESM_BROWSER__: false,
	// 	__NODE_JS__: true,
	// 	// __SSR__: true,
	// 	__FEATURE_OPTIONS_API__: true,
	// 	__FEATURE_SUSPENSE__: true,
	// 	__FEATURE_PROD_DEVTOOLS__: false,
	// 	__COMPAT__: true,
	// 	'ts-jest': {
	// 		useESM: true,
	// 		tsconfig: {
	// 			target: 'esnext',
	// 			sourceMap: true
	// 		}
	// 	}
	// },
	transformIgnorePatterns: ['<rootDir>/node_modules/'],
	coverageDirectory: 'coverage',
	coverageReporters: ['html', 'lcov', 'text'],
	collectCoverageFrom: ['src/**/*.ts'],
	watchPathIgnorePatterns: ['/node_modules/', '/dist/', '/.git/'],
	moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
	extensionsToTreatAsEsm: ['.ts'],
	moduleNameMapper: {
		'^(\\.{1,2}/.*)\\.js$': '$1'
		// '@vue/consolidate': '@vue/consolidate',
		// '^@vue/(.*?)$': '<rootDir>/packages/$1/src'
	},
	rootDir: __dirname,
	testMatch: ['<rootDir>/src/**/__tests__/**/*spec.[jt]s?(x)'],
	testPathIgnorePatterns: process.env.SKIP_E2E
		? // ignore example tests on netlify builds since they don't contribute
		  // to coverage and can cause netlify builds to fail
		  ['/node_modules/', '/examples/__tests__']
		: ['/node_modules/']
}
