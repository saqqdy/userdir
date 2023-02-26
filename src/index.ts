import os from 'os'

export function userdir(): string | null {
	const env = process.env
	const home = env.HOME
	const user = env.LOGNAME || env.USER || env.LNAME || env.USERNAME
	if (process.platform === 'win32') {
		return env.USERPROFILE || (env.HOMEDRIVE || '') + (env.HOMEPATH || '') || home || null
	}
	if (process.platform === 'darwin') {
		return home || (user ? '/Users/' + user : null)
	}
	if (process.platform === 'linux') {
		if (home) return home
		else if (process.getuid && process.getuid() === 0) return '/root'
		else if (user) return '/home/' + user
		return null
	}
	return home || null
}

export default typeof os.homedir === 'function' ? os.homedir : userdir
