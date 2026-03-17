import eslintSets from '@eslint-sets/eslint-config'

export default eslintSets({
	ignores: ['examples/**', 'scripts/**', '**/*.yml', '**/*.yaml', '.claude/**'],
	markdown: false,
	rules: {
		camelcase: 'off',
	},
	stylistic: {
		indent: 'tab',
	},
	type: 'lib',
	typescript: true,
})
