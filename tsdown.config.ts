import { defineConfig } from 'tsdown'
import pkg from './package.json' with { type: 'json' }

const banner = `/*!
 * ${pkg.name} v${pkg.version}
 * ${pkg.description}
 * (c) 2021-${new Date().getFullYear()} saqqdy
 * Released under the MIT License.
 */`

export default defineConfig({
	dts: true,
	entry: ['src/index.ts'],
	external: [],
	fixedExtension: false,
	format: ['esm', 'cjs'],
	minify: false,
	outDir: 'dist',
	outputOptions: {
		banner,
		exports: 'named',
	},
	platform: 'node',
	sourcemap: true,
	target: 'node18',
})
