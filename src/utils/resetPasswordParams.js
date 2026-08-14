const TOKEN_PARAM_KEYS = ['token', 'resetToken', 'reset_token', 'code', 't']
const EMAIL_PARAM_KEYS = ['email', 'e']

function readRawQueryParam(searchString, key) {
  if (!searchString) return ''

  const query = searchString.startsWith('?') ? searchString.slice(1) : searchString
  if (!query) return ''

  for (const segment of query.split('&')) {
    if (!segment) continue

    const separatorIndex = segment.indexOf('=')
    const rawKey = separatorIndex === -1 ? segment : segment.slice(0, separatorIndex)
    const rawValue = separatorIndex === -1 ? '' : segment.slice(separatorIndex + 1)

    let decodedKey = rawKey
    try {
      decodedKey = decodeURIComponent(rawKey.replace(/\+/g, '%20'))
    } catch {
      decodedKey = rawKey
    }

    if (decodedKey !== key) continue

    try {
      // Preserve literal "+" characters in token values.
      return decodeURIComponent(rawValue.replace(/\+/g, '%2B'))
    } catch {
      return rawValue
    }
  }

  return ''
}

function readParamFromSearch(searchString, keys) {
  for (const key of keys) {
    const value = readRawQueryParam(searchString, key)
    if (value) return value
  }
  return ''
}

export function sanitizeResetToken(token) {
  return String(token || '')
    .trim()
    .replace(/^token\s*[:#=]\s*/i, '')
    .replace(/\s+/g, '')
}

export function normalizeResetEmail(email) {
  return String(email || '')
    .trim()
    .toLowerCase()
}

/**
 * Parse reset-password params from email links.
 * Uses raw query parsing so "+" characters in tokens are not turned into spaces.
 */
export function parseResetPasswordParams(searchParams, hash = '', routeToken = '') {
  const searchString =
    typeof searchParams === 'string'
      ? searchParams
      : searchParams?.toString
        ? `?${searchParams.toString()}`
        : ''

  let hashString = hash || ''
  if (hashString.startsWith('#?')) {
    hashString = `?${hashString.slice(2)}`
  } else if (hashString.startsWith('#')) {
    hashString = `?${hashString.slice(1)}`
  }

  const token =
    sanitizeResetToken(
      routeToken ||
        readParamFromSearch(searchString, TOKEN_PARAM_KEYS) ||
        readParamFromSearch(hashString, TOKEN_PARAM_KEYS)
    )

  const rawEmail =
    readParamFromSearch(searchString, EMAIL_PARAM_KEYS) ||
    readParamFromSearch(hashString, EMAIL_PARAM_KEYS)

  let email = rawEmail
  try {
    email = decodeURIComponent(rawEmail.replace(/\+/g, '%2B'))
  } catch {
    email = rawEmail
  }

  return {
    token,
    email: normalizeResetEmail(email),
  }
}

export function buildForgotPasswordPayload(email) {
  const payload = {
    email: normalizeResetEmail(email),
  }

  if (!payload.email) {
    throw new Error('Email is required.')
  }

  return payload
}

export function buildResetPasswordPayload({ email, token, newPassword }) {
  const payload = {
    email: normalizeResetEmail(email),
    token: sanitizeResetToken(token),
    newPassword: newPassword?.trim(),
  }

  if (!payload.email || !payload.token || !payload.newPassword) {
    throw new Error('Email, token, and new password are required.')
  }

  if (payload.newPassword.length < 8) {
    throw new Error('Password must be at least 8 characters.')
  }

  return payload
}

export function getResetPasswordErrorMessage(error) {
  const message = String(error?.message || error || '').trim()

  if (
    message.includes('Invalid or expired reset token') ||
    message.includes('invalid or expired')
  ) {
    return 'Invalid or expired reset token. Request a new reset email, then paste the latest token and use the same email address you requested the reset for.'
  }

  return message || 'Unable to reset password. Please try again.'
}
