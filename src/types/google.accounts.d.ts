interface GoogleTokenResponse {
  access_token?: string
  expires_in?: number
  scope?: string
  token_type?: string
  id_token?: string
  error?: string
  error_description?: string
}

interface GoogleTokenClientError {
  type?: 'popup_closed' | 'popup_disabled' | 'unknown'
  message?: string
}

interface GoogleTokenClient {
  requestAccessToken(overrides?: {
    prompt?: '' | 'none' | 'consent' | 'select_account'
  }): void
}

interface GoogleOAuth2Client {
  initTokenClient(config: {
    client_id: string
    scope: string
    callback: (response: GoogleTokenResponse) => void
    error_callback?: (error: GoogleTokenClientError) => void
  }): GoogleTokenClient
}

interface Window {
  google?: {
    accounts: {
      oauth2: GoogleOAuth2Client
    }
  }
}
