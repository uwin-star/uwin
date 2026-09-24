<script setup lang="ts">
import { watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useI18n } from '../i18n'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { t } = useI18n()
const { user, canManageMembers, signOut } = useAuth()
const allianceMark = `${import.meta.env.BASE_URL}images/uwin/uwin-alliance-mark.png`

watch(user, (currentUser) => {
  if (!currentUser) void router.replace({ name: 'login' })
})

async function handleSignOut() {
  await signOut()
  await router.replace('/login')
}
</script>

<template>
  <section v-if="user" class="account-page">
    <p class="eyebrow"><span aria-hidden="true" /> {{ t('account.eyebrow') }}</p>
    <h1>{{ t('account.welcome', { name: user.name }) }}</h1>
    <p class="page-lead">{{ t('account.lead') }}</p>

    <div class="account-grid">
      <article class="profile-card">
        <div class="profile-avatar">
          <img v-if="user.picture" :src="user.picture" :alt="t('account.profileImageAlt', { name: user.name })" />
          <img v-else :src="allianceMark" alt="" />
        </div>
        <div class="profile-copy">
          <span class="profile-label">{{ t('account.profileLabel') }}</span>
          <h2>{{ user.name }}</h2>
          <a :href="`mailto:${user.email}`">{{ user.email }}</a>
        </div>
        <span class="verified-badge" :class="{ unverified: !user.emailVerified }">
          {{ user.emailVerified ? t('account.emailVerified') : t('account.emailUnverified') }}
        </span>

        <dl class="membership-details">
          <div>
            <dt>{{ t('account.memberRole') }}</dt>
            <dd>{{ t(`memberRoles.${user.memberRole}`) }}</dd>
          </div>
          <div>
            <dt>{{ t('account.allianceRank') }}</dt>
            <dd>{{ user.allianceRank }}</dd>
          </div>
          <div>
            <dt>{{ t('account.alliancePosition') }}</dt>
            <dd>{{ t(`alliancePositions.${user.alliancePosition ?? 'none'}`) }}</dd>
          </div>
        </dl>
      </article>

      <article class="session-card">
        <p class="profile-label">{{ t('account.sessionLabel') }}</p>
        <dl>
          <div>
            <dt>{{ t('account.provider') }}</dt>
            <dd>{{ t(`account.providers.${user.provider}`) }}</dd>
          </div>
          <div>
            <dt>{{ t('account.scope') }}</dt>
            <dd>{{ user.provider === 'mock' ? t('account.mockScope') : 'openid · email · profile' }}</dd>
          </div>
          <div>
            <dt>{{ t('account.storage') }}</dt>
            <dd>{{ t('account.storageValue') }}</dd>
          </div>
        </dl>
        <button class="button logout-button" type="button" @click="handleSignOut">
          {{ t('account.logout') }}
        </button>
      </article>
    </div>

    <div class="management-note" :class="{ allowed: canManageMembers }">
      <strong>{{ t('account.managementTitle') }}</strong>
      <p>{{ t(canManageMembers ? 'account.managementAllowed' : 'account.managementDenied') }}</p>
      <RouterLink v-if="canManageMembers" class="management-link" to="/admin">
        {{ t('admin.title') }} →
      </RouterLink>
    </div>

    <div class="security-note">
      <strong>{{ t('account.securityTitle') }}</strong>
      <p>{{ t(user.provider === 'mock' ? 'account.mockSecurityText' : 'account.securityText') }}</p>
    </div>
  </section>
</template>
