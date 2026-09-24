import { computed, readonly, ref } from 'vue'
import { useI18n } from '../i18n'

export type AuthProvider = 'google' | 'mock'
export type MemberRole = 'super_admin' | 'admin' | 'member'
export type AllianceRank = 'R1' | 'R2' | 'R3' | 'R4' | 'R5'
export type AlliancePosition = 'leader' | 'warlord' | 'recruiter' | 'goddess' | 'butler'

export interface AllianceUser {
  id: string
  name: string
  email: string
  picture: string
  emailVerified: boolean
  provider: AuthProvider
  memberRole: MemberRole
  allianceRank: AllianceRank
  alliancePosition: AlliancePosition | null
}

export interface MockSessionInput {
  memberRole: MemberRole
  allianceRank: AllianceRank
  alliancePosition: AlliancePosition | null
}

const GOOGLE_SCRIPT_ID = 'google-identity-services'
const GOOGLE_SCRIPT_URL = 'https://accounts.google.com/gsi/client'
const GOOGLE_SCOPES = 'openid email profile'
const GOOGLE_USERINFO_URL = 'https://openidconnect.googleapis.com/v1/userinfo'
const GOOGLE_REVOKE_URL = 'https://oauth2.googleapis.com/revoke'
const MOCK_SESSION_DURATION = 8 * 60 * 60 * 1000
const { t } = useI18n()

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() ?? ''
const authMode = import.meta.env.VITE_AUTH_MODE ?? (import.meta.env.DEV ? 'mock' : 'google')

function parseEmailAllowlist(value: string | undefined): Set<string> {
  return new Set(
    (value ?? '')
      .split(',')
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  )
}

const superAdminEmails = parseEmailAllowlist(import.meta.env.VITE_SUPER_ADMIN_EMAILS)
const adminEmails = parseEmailAllowlist(import.meta.env.VITE_ADMIN_EMAILS)

function resolveMemberRole(email: string): MemberRole {
  const normalizedEmail = email.trim().toLowerCase()
  if (superAdminEmails.has(normalizedEmail)) return 'super_admin'
  if (adminEmails.has(normalizedEmail)) return 'admin'
  return 'member'
}
const isMockAuth = import.meta.env.DEV && authMode === 'mock'
const user = ref<AllianceUser | null>(null)
const accessToken = ref<string | null>(null)
const expiresAt = ref<number | null>(null)

let scriptPromise: Promise<void> | null = null
let expiryTimer: number | null = null

const isConfigured = isMockAuth || Boolean(clientId)
const isAuthenticated = computed(() => {
  const currentUser = user.value
  const sessionIsCurrent = (expiresAt.value ?? 0) > Date.now()

  return Boolean(
    currentUser && sessionIsCurrent && (currentUser.provider === 'mock' || accessToken.value),
  )
})
const canManageMembers = computed(
  () =>
    isAuthenticated.value &&
    (user.value?.memberRole === 'super_admin' || user.value?.memberRole === 'admin'),
)

function clearSession() {
  user.value = null
  accessToken.value = null
  expiresAt.value = null

  if (expiryTimer !== null) {
    window.clearTimeout(expiryTimer)
    expiryTimer = null
  }
}

function scheduleExpiry(expiresAtMs: number) {
  if (expiryTimer !== null) {
    window.clearTimeout(expiryTimer)
  }

  expiryTimer = window.setTimeout(clearSession, Math.max(0, expiresAtMs - Date.now()))
}

function loadGoogleIdentity(): Promise<void> {
  if (window.google?.accounts.oauth2) return Promise.resolve()
  if (scriptPromise) return scriptPromise

  const loadingScript = new Promise<void>((resolve, reject) => {
    let script = document.getElementById(GOOGLE_SCRIPT_ID) as HTMLScriptElement | null

    const handleLoad = () => {
      if (window.google?.accounts.oauth2) {
        resolve()
        return
      }
      reject(new Error(t('authErrors.initFailed')))
    }
    const handleError = () => reject(new Error(t('authErrors.scriptLoad')))

    if (!script) {
      script = document.createElement('script')
      script.id = GOOGLE_SCRIPT_ID
      script.src = GOOGLE_SCRIPT_URL
      script.async = true
      script.defer = true
      document.head.append(script)
    }

    script.addEventListener('load', handleLoad, { once: true })
    script.addEventListener('error', handleError, { once: true })
  }).catch((error: unknown) => {
    scriptPromise = null
    document.getElementById(GOOGLE_SCRIPT_ID)?.remove()
    throw error
  })

  scriptPromise = loadingScript
  return loadingScript
}

function parseGoogleError(response: GoogleTokenResponse): Error {
  if (response.error === 'access_denied') return new Error(t('authErrors.accessDenied'))
  return new Error(response.error_description || response.error || t('authErrors.loginFailed'))
}

async function createSession(token: string, expiresIn: number): Promise<AllianceUser> {
  const response = await fetch(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${token}` },
    credentials: 'omit',
  })

  if (!response.ok) throw new Error(t('authErrors.userInfo'))

  const result = (await response.json()) as Record<string, unknown>
  const id = typeof result.sub === 'string' ? result.sub : ''
  const email = typeof result.email === 'string' ? result.email : ''

  if (!id || !email) throw new Error(t('authErrors.identity'))

  const googleUser: AllianceUser = {
    id,
    name:
      (typeof result.name === 'string' && result.name) ||
      (typeof result.given_name === 'string' && result.given_name) ||
      email.split('@')[0] ||
      t('account.nameLabel'),
    email,
    picture: typeof result.picture === 'string' ? result.picture : '',
    emailVerified: result.email_verified === true,
    provider: 'google',
    memberRole: resolveMemberRole(email),
    allianceRank: 'R1',
    alliancePosition: null,
  }

  user.value = googleUser
  accessToken.value = token
  expiresAt.value = Date.now() + expiresIn * 1000
  scheduleExpiry(expiresAt.value)
  return googleUser
}

async function signIn(): Promise<AllianceUser> {
  if (isMockAuth) throw new Error(t('authErrors.googleDisabled'))
  if (!clientId) throw new Error(t('authErrors.missingClient'))
  if (isAuthenticated.value && user.value) return user.value

  await loadGoogleIdentity()
  const oauth2 = window.google?.accounts.oauth2
  if (!oauth2) throw new Error(t('authErrors.initFailed'))

  return new Promise<AllianceUser>((resolve, reject) => {
    const tokenClient = oauth2.initTokenClient({
      client_id: clientId,
      scope: GOOGLE_SCOPES,
      callback: (response) => {
        if (response.error || !response.access_token) {
          reject(parseGoogleError(response))
          return
        }
        void createSession(response.access_token, response.expires_in ?? 3600).then(resolve, reject)
      },
      error_callback: (error) => {
        const message = error.type === 'popup_closed'
          ? t('authErrors.popupClosed')
          : error.message || t('authErrors.popupBlocked')
        reject(new Error(message))
      },
    })

    tokenClient.requestAccessToken({ prompt: 'select_account' })
  })
}

async function signInMock(input: MockSessionInput): Promise<AllianceUser> {
  if (!isMockAuth) throw new Error(t('authErrors.mockProduction'))

  const mockUser: AllianceUser = {
    id: `mock-${input.memberRole}-${input.allianceRank}`,
    name: t('login.mockUserName'),
    email: `${input.memberRole}@dev.uwin.local`,
    picture: '',
    emailVerified: true,
    provider: 'mock',
    memberRole: input.memberRole,
    allianceRank: input.allianceRank,
    alliancePosition: input.alliancePosition,
  }

  user.value = mockUser
  accessToken.value = null
  expiresAt.value = Date.now() + MOCK_SESSION_DURATION
  scheduleExpiry(expiresAt.value)
  return mockUser
}

async function signOut(): Promise<void> {
  const token = accessToken.value
  clearSession()
  if (!token) return

  try {
    await fetch(GOOGLE_REVOKE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ token }),
      credentials: 'omit',
      keepalive: true,
    })
  } catch {
    // The local session is already closed even when remote revocation fails.
  }
}

export function useAuth() {
  return {
    user: readonly(user),
    isAuthenticated,
    isConfigured,
    isMockAuth,
    canManageMembers,
    signIn,
    signInMock,
    signOut,
  }
}
