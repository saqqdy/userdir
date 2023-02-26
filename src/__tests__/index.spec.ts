import userdir from '..'

test('defines get userdir', () => {
	expect(userdir()).toBe('/Users/saqqdy')
})
