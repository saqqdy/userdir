import { existsSync } from 'node:fs'
import os from 'node:os'

export interface UserdirOptions {
	/** Whether to use cache */
	cache?: boolean
	/** Custom environment variables (for testing) */
	env?: typeof process.env
	/** Validate if directory exists */
	validate?: boolean
}

// Cache
let cachedHome: string | null | undefined

/**
 * Get the user home directory
 *
 * @param options - Configuration options
 * @returns - User home directory path, or null if not found
 */
export function userdir(options?: UserdirOptions): string | null {
	const { cache = true, env, validate = false } = options || {}

	if (cache && cachedHome !== undefined) {
		return cachedHome
	}

	const processEnv = env || process.env
	const home = processEnv.HOME
	const user = processEnv.LOGNAME || processEnv.USER || processEnv.LNAME || processEnv.USERNAME

	let result: string | null = null

	switch (process.platform) {
		case 'win32':
			result = processEnv.USERPROFILE || `${processEnv.HOMEDRIVE || ''}${processEnv.HOMEPATH || ''}` || home || null
			break
		case 'darwin':
			result = home || (user ? `/Users/${user}` : null)
			break
		case 'linux':
			if (home) result = home
			else if (process.getuid && process.getuid() === 0) result = '/root'
			else if (user) result = `/home/${user}`
			break
		case 'freebsd':
		case 'sunos':
			result = home || (user ? `/home/${user}` : null)
			break
		default:
			result = home || null
	}

	// Path validation
	if (validate && result && !existsSync(result)) {
		result = null
	}

	if (cache) {
		cachedHome = result
	}

	return result
}

/**
 * Clear the cache
 */
export function clearCache(): void {
	cachedHome = undefined
}

/**
 * Get the user home directory asynchronously
 *
 * @param options - Configuration options
 * @returns - Promise resolving to user home directory path, or null if not found
 */
export async function userdirAsync(options?: UserdirOptions): Promise<string | null> {
	return userdir(options)
}

// Default export: prefer os.homedir
export default typeof os.homedir === 'function' ? os.homedir : userdir
