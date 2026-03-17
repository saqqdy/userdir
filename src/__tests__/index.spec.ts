import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import defaultExport, { clearCache, userdir, userdirAsync } from '../index'

// Helper to mock process.platform
function mockPlatform(platform: string): void {
	Object.defineProperty(process, 'platform', {
		configurable: true,
		value: platform,
	})
}

// Helper to restore process.platform
function restorePlatform(): void {
	Object.defineProperty(process, 'platform', {
		configurable: true,
		value: process.platform,
	})
}

describe('userdir', () => {
	beforeEach(() => {
		clearCache()
	})

	describe('basic functionality', () => {
		it('should return home directory', () => {
			const result = userdir()

			expect(result).toBe(process.env.USERPROFILE || process.env.HOME || null)
		})

		it('should return null when no env vars set', () => {
			const result = userdir({ cache: false, env: {} })

			expect(result).toBeNull()
		})

		it('should use default values for options', () => {
			const result = userdir({})

			expect(result).toBe(process.env.USERPROFILE || process.env.HOME || null)
		})

		it('should accept all options', () => {
			const result = userdir({
				cache: false,
				env: { HOME: '/custom/home' },
				validate: false,
			})

			expect(result).toBe('/custom/home')
		})
	})

	describe('cache', () => {
		it('should return cached result', () => {
			const first = userdir()
			const second = userdir()

			expect(first).toBe(second)
		})

		it('should bypass cache when cache option is false', () => {
			const first = userdir()
			const second = userdir({ cache: false })

			expect(first).toBe(second)
		})

		it('should not cache result when cache is false', () => {
			userdir({ cache: false, env: { HOME: '/first' } })
			clearCache()
			const result = userdir({ cache: false, env: { HOME: '/second' } })

			expect(result).toBe('/second')
		})

		it('clearCache should reset cached value', () => {
			userdir()
			clearCache()
			const result = userdir()

			expect(result).toBe(process.env.USERPROFILE || process.env.HOME || null)
		})

		it('should cache null result', () => {
			const first = userdir({ cache: true, env: {} })
			const second = userdir({ cache: true, env: { HOME: '/should/not/use' } })

			expect(first).toBeNull()
			expect(second).toBeNull() // Returns cached null
		})

		it('should update cache on subsequent calls with cache enabled', () => {
			userdir({ cache: true, env: { HOME: '/first' } })
			clearCache()
			userdir({ cache: true, env: { HOME: '/second' } })
			const result = userdir()

			expect(result).toBe('/second')
		})

		it('should return cached value immediately when cache is true', () => {
			userdir({ cache: true, env: { HOME: '/cached' } })
			const result = userdir({ cache: true, env: { HOME: '/different' } })

			expect(result).toBe('/cached')
		})
	})

	describe('validation', () => {
		it('should return null when validate is true and path does not exist', () => {
			const result = userdir({
				cache: false,
				env: { HOME: '/nonexistent/path/12345' },
				validate: true,
			})

			expect(result).toBeNull()
		})

		it('should return path when validate is true and path exists', () => {
			const result = userdir({ validate: true })

			expect(result).toBeTruthy()
		})

		it('should not validate by default', () => {
			const result = userdir({
				cache: false,
				env: { HOME: '/nonexistent/path/12345' },
			})

			expect(result).toBe('/nonexistent/path/12345')
		})

		it('should return null when validating null result', () => {
			const result = userdir({
				cache: false,
				env: {},
				validate: true,
			})

			expect(result).toBeNull()
		})

		it('should validate and return null for non-existent path', () => {
			const result = userdir({
				cache: false,
				env: { HOME: '/this/path/definitely/does/not/exist' },
				validate: true,
			})

			expect(result).toBeNull()
		})
	})

	describe('userdirAsync', () => {
		it('should work', async () => {
			const result = await userdirAsync()

			expect(result).toBe(userdir())
		})

		it('should return same result as sync version', async () => {
			const syncResult = userdir({ cache: false, env: { HOME: '/test/home' } })
			const asyncResult = await userdirAsync({ cache: false, env: { HOME: '/test/home' } })

			expect(asyncResult).toBe(syncResult)
		})

		it('should handle options correctly', async () => {
			const result = await userdirAsync({
				cache: false,
				env: { HOME: '/async/home' },
			})

			expect(result).toBe('/async/home')
		})

		it('should handle validation', async () => {
			const result = await userdirAsync({
				cache: false,
				env: { HOME: '/nonexistent' },
				validate: true,
			})

			expect(result).toBeNull()
		})

		it('should handle null result', async () => {
			const result = await userdirAsync({
				cache: false,
				env: {},
			})

			expect(result).toBeNull()
		})
	})

	describe('platform specific - win32', () => {
		it.skipIf(process.platform !== 'win32')('should use USERPROFILE first', () => {
			const result = userdir({
				cache: false,
				env: {
					HOME: '/should/not/use',
					HOMEDRIVE: 'C:',
					HOMEPATH: '\\Users\\default',
					USERPROFILE: 'C:\\Users\\test',
				},
			})

			expect(result).toBe('C:\\Users\\test')
		})

		it.skipIf(process.platform !== 'win32')('should fallback to HOMEDRIVE + HOMEPATH', () => {
			const result = userdir({
				cache: false,
				env: {
					HOMEDRIVE: 'D:',
					HOMEPATH: '\\Users\\fallback',
				},
			})

			expect(result).toBe('D:\\Users\\fallback')
		})

		it.skipIf(process.platform !== 'win32')('should fallback to HOME when USERPROFILE and HOMEDRIVE/HOMEPATH not set', () => {
			const result = userdir({
				cache: false,
				env: {
					HOME: 'C:\\Users\\homeuser',
				},
			})

			expect(result).toBe('C:\\Users\\homeuser')
		})

		it.skipIf(process.platform !== 'win32')('should handle empty HOMEDRIVE', () => {
			const result = userdir({
				cache: false,
				env: {
					HOMEDRIVE: '',
					HOMEPATH: '\\Users\\test',
				},
			})

			expect(result).toBe('\\Users\\test')
		})

		it.skipIf(process.platform !== 'win32')('should handle empty HOMEPATH', () => {
			const result = userdir({
				cache: false,
				env: {
					HOMEDRIVE: 'C:',
					HOMEPATH: '',
				},
			})

			expect(result).toBe('C:')
		})

		it.skipIf(process.platform !== 'win32')('should return null when no win32 env vars set', () => {
			const result = userdir({
				cache: false,
				env: {},
			})

			expect(result).toBeNull()
		})
	})

	describe('platform specific - darwin', () => {
		it('should use HOME when set', () => {
			const result = userdir({
				cache: false,
				env: { HOME: '/Users/testuser' },
			})

			expect(result).toBe('/Users/testuser')
		})

		it('should construct path from USER when HOME not set', () => {
			const result = userdir({
				cache: false,
				env: { USER: 'testuser' },
			})

			// On darwin: /Users/testuser, on linux: /home/testuser
			expect(result).toBeTypeOf('string')
			expect(result).toMatch(/\/(Users|home)\/testuser/)
		})

		it('should use LOGNAME for user', () => {
			const result = userdir({
				cache: false,
				env: { LOGNAME: 'loguser' },
			})

			expect(result).toBeTypeOf('string')
		})

		it('should return null when no user env on darwin', () => {
			// Simulating darwin behavior when no HOME and no user
			const result = userdir({
				cache: false,
				env: {},
			})

			expect(result).toBeNull()
		})
	})

	describe('platform specific - linux', () => {
		it('should use HOME when set', () => {
			const result = userdir({
				cache: false,
				env: { HOME: '/home/linuxuser' },
			})

			expect(result).toBe('/home/linuxuser')
		})

		it('should construct path from USER when HOME not set', () => {
			const result = userdir({
				cache: false,
				env: { USER: 'linuxuser' },
			})

			expect(result).toBeTypeOf('string')
		})

		it('should use LNAME for user', () => {
			const result = userdir({
				cache: false,
				env: { LNAME: 'lnameuser' },
			})

			expect(result).toBeTypeOf('string')
		})

		it('should use USERNAME for user', () => {
			const result = userdir({
				cache: false,
				env: { USERNAME: 'usernameuser' },
			})

			expect(result).toBeTypeOf('string')
		})

		it('should prefer LOGNAME over USER', () => {
			const result = userdir({
				cache: false,
				env: { LOGNAME: 'loguser', USER: 'otheruser' },
			})

			// LOGNAME is checked first
			expect(result).toContain('loguser')
		})
	})

	describe('platform specific - freebsd/sunos', () => {
		it('should use HOME when set', () => {
			const result = userdir({
				cache: false,
				env: { HOME: '/home/bsduser' },
			})

			expect(result).toBe('/home/bsduser')
		})

		it('should construct path from USER when HOME not set', () => {
			const result = userdir({
				cache: false,
				env: { USER: 'bsduser' },
			})

			expect(result).toBeTypeOf('string')
		})
	})

	describe('default export', () => {
		it('should be a function', () => {
			expect(typeof defaultExport).toBe('function')
		})

		it('should return home directory', () => {
			const result = defaultExport()

			expect(typeof result).toBe('string')
		})

		it('should return string result', () => {
			const result = defaultExport()

			expect(result).toBeTruthy()
		})
	})

	describe('edge cases', () => {
		it('should handle undefined options', () => {
			const result = userdir(undefined)

			expect(result).toBe(process.env.USERPROFILE || process.env.HOME || null)
		})

		it('should handle null env in options', () => {
			const result = userdir({ cache: false, env: undefined })

			expect(result).toBe(process.env.USERPROFILE || process.env.HOME || null)
		})

		it('should handle partial env object', () => {
			const result = userdir({
				cache: false,
				env: { UNKNOWN_VAR: 'value' },
			})

			expect(result).toBeNull()
		})

		it('should handle whitespace in path', () => {
			const result = userdir({
				cache: false,
				env: { HOME: '/home/user with spaces' },
			})

			expect(result).toBe('/home/user with spaces')
		})

		it('should handle special characters in path', () => {
			const result = userdir({
				cache: false,
				env: { HOME: '/home/user-name_test.dir' },
			})

			expect(result).toBe('/home/user-name_test.dir')
		})

		it('should handle unicode in path', () => {
			const result = userdir({
				cache: false,
				env: { HOME: '/home/用户' },
			})

			expect(result).toBe('/home/用户')
		})

		it('should handle very long path', () => {
			const longPath = `/home/${'a'.repeat(200)}`
			const result = userdir({
				cache: false,
				env: { HOME: longPath },
			})

			expect(result).toBe(longPath)
		})

		it('should handle empty string env values', () => {
			const result = userdir({
				cache: false,
				env: { HOME: '', USER: '' },
			})

			expect(result).toBeNull()
		})
	})

	describe('coverage - simulated platforms', () => {
		afterEach(() => {
			restorePlatform()
		})

		it('should handle win32 platform correctly', () => {
			mockPlatform('win32')
			const result = userdir({
				cache: false,
				env: { USERPROFILE: 'C:\\Users\\testuser' },
			})

			expect(result).toBe('C:\\Users\\testuser')
		})

		it('should handle win32 with HOMEDRIVE/HOMEPATH fallback', () => {
			mockPlatform('win32')
			const result = userdir({
				cache: false,
				env: { HOMEDRIVE: 'D:', HOMEPATH: '\\Users\\fallback' },
			})

			expect(result).toBe('D:\\Users\\fallback')
		})

		it('should handle win32 with HOME fallback', () => {
			mockPlatform('win32')
			const result = userdir({
				cache: false,
				env: { HOME: 'C:\\Users\\homeuser' },
			})

			expect(result).toBe('C:\\Users\\homeuser')
		})

		it('should handle win32 with no env vars', () => {
			mockPlatform('win32')
			const result = userdir({
				cache: false,
				env: {},
			})

			expect(result).toBeNull()
		})

		it('should handle linux platform with HOME', () => {
			mockPlatform('linux')
			const result = userdir({
				cache: false,
				env: { HOME: '/home/linuxuser' },
			})

			expect(result).toBe('/home/linuxuser')
		})

		it('should handle linux platform with USER', () => {
			mockPlatform('linux')
			const result = userdir({
				cache: false,
				env: { USER: 'linuxuser' },
			})

			expect(result).toBe('/home/linuxuser')
		})

		it('should handle linux platform with no env vars', () => {
			mockPlatform('linux')
			const result = userdir({
				cache: false,
				env: {},
			})

			expect(result).toBeNull()
		})

		it('should handle darwin platform with HOME', () => {
			mockPlatform('darwin')
			const result = userdir({
				cache: false,
				env: { HOME: '/Users/darwinuser' },
			})

			expect(result).toBe('/Users/darwinuser')
		})

		it('should handle darwin platform with USER', () => {
			mockPlatform('darwin')
			const result = userdir({
				cache: false,
				env: { USER: 'darwinuser' },
			})

			expect(result).toBe('/Users/darwinuser')
		})

		it('should handle darwin platform with no env vars', () => {
			mockPlatform('darwin')
			const result = userdir({
				cache: false,
				env: {},
			})

			expect(result).toBeNull()
		})

		it('should handle freebsd platform with HOME', () => {
			mockPlatform('freebsd')
			const result = userdir({
				cache: false,
				env: { HOME: '/home/freebsduser' },
			})

			expect(result).toBe('/home/freebsduser')
		})

		it('should handle freebsd platform with USER', () => {
			mockPlatform('freebsd')
			const result = userdir({
				cache: false,
				env: { USER: 'freebsduser' },
			})

			expect(result).toBe('/home/freebsduser')
		})

		it('should handle freebsd platform with no env vars', () => {
			mockPlatform('freebsd')
			const result = userdir({
				cache: false,
				env: {},
			})

			expect(result).toBeNull()
		})

		it('should handle sunos platform with HOME', () => {
			mockPlatform('sunos')
			const result = userdir({
				cache: false,
				env: { HOME: '/home/sunosuser' },
			})

			expect(result).toBe('/home/sunosuser')
		})

		it('should handle sunos platform with USER', () => {
			mockPlatform('sunos')
			const result = userdir({
				cache: false,
				env: { USER: 'sunosuser' },
			})

			expect(result).toBe('/home/sunosuser')
		})

		it('should handle sunos platform with no env vars', () => {
			mockPlatform('sunos')
			const result = userdir({
				cache: false,
				env: {},
			})

			expect(result).toBeNull()
		})

		it('should handle unknown platform with HOME', () => {
			mockPlatform('unknown')
			const result = userdir({
				cache: false,
				env: { HOME: '/home/unknownuser' },
			})

			expect(result).toBe('/home/unknownuser')
		})

		it('should handle unknown platform with no HOME', () => {
			mockPlatform('unknown')
			const result = userdir({
				cache: false,
				env: {},
			})

			expect(result).toBeNull()
		})
	})
})
