// import { basename } from 'path'
import userdir from '../index'

// const home = process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'] || null

test('defines get userdir', () => {
	// const user = basename(home)
	// const match = new RegExp(user + '$')
	// expect(userdir()).toMatch(match)
	expect(userdir()).toBe(process.env.USERPROFILE || process.env.HOME || null)
})
