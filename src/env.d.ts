/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH_MODE?: 'google' | 'mock'
  readonly VITE_GOOGLE_CLIENT_ID?: string
  readonly VITE_SUPER_ADMIN_EMAILS?: string
  readonly VITE_ADMIN_EMAILS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
