<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from '../i18n'
import {
  useAuth,
  type AlliancePosition,
  type AllianceRank,
  type MemberRole,
} from '../composables/useAuth'

const route = useRoute()
const router = useRouter()
const { currentMessages, t } = useI18n()
const { isConfigured, isMockAuth, signIn, signInMock } = useAuth()

const allianceMark = `${import.meta.env.BASE_URL}images/uwin/uwin-alliance-mark.png`
const currentOrigin = window.location.origin
const isLoading = ref(false)
const errorMessage = ref('')
const memberRole = ref<MemberRole>('member')
const allianceRank = ref<AllianceRank>('R1')
const alliancePosition = ref<AlliancePosition | ''>('')

const roleOptions: MemberRole[] = ['super_admin', 'admin', 'member']
const rankOptions: AllianceRank[] = ['R1', 'R2', 'R3', 'R4', 'R5']
const positionOptions: AlliancePosition[] = ['leader', 'warlord', 'recruiter', 'goddess', 'butler']

function getRedirectPath(): string {
  const redirect = route.query.redirect
  return typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//')
    ? redirect
    : '/account'
}

async function runSignIn(action: () => Promise<unknown>) {
  isLoading.value = true
  errorMessage.value = ''

  try {
    await action()
    await router.replace(getRedirectPath())
  } catch (error: unknown) {
    errorMessage.value = error instanceof Error ? error.message : t('login.errorFallback')
  } finally {
    isLoading.value = false
  }
}

function handleSignIn() {
  return runSignIn(signIn)
}

function handleMockSignIn() {
  return runSignIn(() => signInMock({
    memberRole: memberRole.value,
    allianceRank: allianceRank.value,
    alliancePosition: alliancePosition.value || null,
  }))
}
</script>

<template>
  <section class="auth-layout">
    <div class="auth-card">
      <div class="auth-icon" :class="{ 'auth-icon-mark': isMockAuth }" aria-hidden="true">
        <img v-if="isMockAuth" :src="allianceMark" alt="" />
        <svg v-else viewBox="0 0 24 24">
          <path fill="#4285F4" d="M21.35 12.27c0-.71-.06-1.4-.18-2.06H12v3.9h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.15c1.84-1.7 2.9-4.2 2.9-7.23Z" />
          <path fill="#34A853" d="M12 21.72c2.63 0 4.84-.87 6.45-2.36l-3.15-2.45c-.87.58-1.99.93-3.3.93-2.53 0-4.68-1.71-5.45-4.01H3.3v2.53A9.72 9.72 0 0 0 12 21.72Z" />
          <path fill="#FBBC05" d="M6.55 13.83A5.84 5.84 0 0 1 6.25 12c0-.64.11-1.26.3-1.83V7.64H3.3A9.72 9.72 0 0 0 2.28 12c0 1.57.38 3.06 1.02 4.36l3.25-2.53Z" />
          <path fill="#EA4335" d="M12 6.16c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.83 3.31 14.63 2.28 12 2.28a9.72 9.72 0 0 0-8.7 5.36l3.25 2.53c.77-2.3 2.92-4.01 5.45-4.01Z" />
        </svg>
      </div>

      <p class="auth-kicker">{{ t(isMockAuth ? 'login.devKicker' : 'login.kicker') }}</p>
      <h1>{{ t(isMockAuth ? 'login.devTitle' : 'login.title') }}</h1>
      <p class="auth-description">
        {{ t(isMockAuth ? 'login.devDescription' : 'login.description') }}
      </p>

      <form v-if="isMockAuth" class="mock-login-form" @submit.prevent="handleMockSignIn">
        <label>
          <span>{{ t('login.memberRole') }}</span>
          <select v-model="memberRole">
            <option v-for="role in roleOptions" :key="role" :value="role">
              {{ t(`memberRoles.${role}`) }}
            </option>
          </select>
        </label>
        <label>
          <span>{{ t('login.allianceRank') }}</span>
          <select v-model="allianceRank">
            <option v-for="rank in rankOptions" :key="rank" :value="rank">{{ rank }}</option>
          </select>
        </label>
        <label>
          <span>{{ t('login.alliancePosition') }}</span>
          <select v-model="alliancePosition">
            <option value="">{{ t('alliancePositions.none') }}</option>
            <option v-for="position in positionOptions" :key="position" :value="position">
              {{ t(`alliancePositions.${position}`) }}
            </option>
          </select>
        </label>

        <p v-if="errorMessage" class="auth-error" role="alert">{{ errorMessage }}</p>
        <button class="mock-login-button" type="submit" :disabled="isLoading">
          <span v-if="isLoading" class="button-spinner" aria-hidden="true" />
          <span>{{ isLoading ? t('login.loading') : t('login.mockLoginCta') }}</span>
        </button>
      </form>

      <template v-else>
        <div v-if="!isConfigured" class="config-notice" role="status">
          <strong>{{ t('login.configTitle') }}</strong>
          <span>{{ t('login.configText') }}</span>
        </div>
        <p v-if="errorMessage" class="auth-error" role="alert">{{ errorMessage }}</p>
        <button class="google-button" type="button" :disabled="isLoading || !isConfigured" @click="handleSignIn">
          <span v-if="isLoading" class="button-spinner" aria-hidden="true" />
          <svg v-else viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M21.35 12.27c0-.71-.06-1.4-.18-2.06H12v3.9h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.15c1.84-1.7 2.9-4.2 2.9-7.23Z" />
            <path fill="#34A853" d="M12 21.72c2.63 0 4.84-.87 6.45-2.36l-3.15-2.45c-.87.58-1.99.93-3.3.93-2.53 0-4.68-1.71-5.45-4.01H3.3v2.53A9.72 9.72 0 0 0 12 21.72Z" />
            <path fill="#FBBC05" d="M6.55 13.83A5.84 5.84 0 0 1 6.25 12c0-.64.11-1.26.3-1.83V7.64H3.3A9.72 9.72 0 0 0 2.28 12c0 1.57.38 3.06 1.02 4.36l3.25-2.53Z" />
            <path fill="#EA4335" d="M12 6.16c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.83 3.31 14.63 2.28 12 2.28a9.72 9.72 0 0 0-8.7 5.36l3.25 2.53c.77-2.3 2.92-4.01 5.45-4.01Z" />
          </svg>
          <span>{{ isLoading ? t('login.loading') : t('login.loginCta') }}</span>
        </button>
        <p class="auth-legal">{{ t('login.legal') }}</p>
      </template>
    </div>

    <aside class="auth-aside" :aria-label="t('login.asideAria')">
      <img class="auth-aside-icon" :src="allianceMark" alt="" />
      <h2>{{ t(isMockAuth ? 'login.devAsideTitle' : 'login.asideTitle') }}</h2>
      <ul>
        <li v-for="item in currentMessages.login.asideItems" :key="item">{{ item }}</li>
      </ul>
      <p class="auth-origin">
        {{ t(isMockAuth ? 'login.devOrigin' : 'login.origin') }}
        <code>{{ isMockAuth ? 'VITE_AUTH_MODE=mock' : currentOrigin }}</code>
      </p>
    </aside>
  </section>
</template>
