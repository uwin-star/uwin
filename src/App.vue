<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useI18n, type Locale } from './i18n'
import { useAuth } from './composables/useAuth'

const { locale, t, localeOptions, setLocale } = useI18n()
const { user, isAuthenticated, canManageMembers } = useAuth()
const allianceMark = `${import.meta.env.BASE_URL}images/uwin/uwin-alliance-mark.png`

const shortLabels: Record<Locale, Record<string, string>> = {
  ko: { home: '홈', about: '소개', notices: '공지', recruit: '모집', admin: '관리' },
  en: { home: 'Home', about: 'About', notices: 'News', recruit: 'Join', admin: 'Admin' },
  ar: { home: 'الرئيسية', about: 'عن', notices: 'إعلانات', recruit: 'انضم', admin: 'إدارة' },
  ja: { home: 'ホーム', about: '紹介', notices: 'お知らせ', recruit: '参加', admin: '管理' },
}

const navItems = computed(() => [
  { to: '/', full: t('nav.home'), short: shortLabels[locale.value].home },
  { to: '/about', full: t('nav.about'), short: shortLabels[locale.value].about },
  { to: '/notices', full: t('nav.notices'), short: shortLabels[locale.value].notices },
  { to: '/recruit', full: t('nav.recruit'), short: shortLabels[locale.value].recruit },
])

function changeLocale(event: Event) {
  const value = (event.target as HTMLSelectElement).value as Locale
  setLocale(value)
}
</script>

<template>
  <div class="site-shell">
    <header class="site-header">
      <RouterLink class="brand" to="/" :aria-label="t('common.brandHome')">
        <img class="brand-mark" :src="allianceMark" alt="" width="48" height="48" />
        <span class="brand-copy">
          <strong>UWIN</strong>
          <small>UNITED WE WILL WIN</small>
        </span>
      </RouterLink>

      <div class="header-tools">
        <label class="sr-only" for="locale-select">{{ t('common.language') }}</label>
        <select
          id="locale-select"
          class="locale-select"
          :value="locale"
          :aria-label="t('common.language')"
          @change="changeLocale"
        >
          <option v-for="option in localeOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>

        <nav
          class="site-nav"
          :class="{ 'has-admin': canManageMembers }"
          :aria-label="t('common.primaryNavigation')"
        >
          <RouterLink v-for="item in navItems" :key="item.to" :to="item.to">
            <span class="nav-label-full">{{ item.full }}</span>
            <span class="nav-label-short">{{ item.short }}</span>
          </RouterLink>
          <RouterLink v-if="canManageMembers" class="nav-admin" to="/admin">
            <span class="nav-label-full">{{ t('nav.admin') }}</span>
            <span class="nav-label-short">{{ shortLabels[locale].admin }}</span>
          </RouterLink>
          <RouterLink v-if="!isAuthenticated" class="nav-login" to="/login">
            {{ t('nav.login') }}
          </RouterLink>
          <RouterLink
            v-else
            class="nav-account"
            to="/account"
            :aria-label="`${t('account.eyebrow')} · ${user?.name ?? ''}`"
          >
            <img v-if="user?.picture" :src="user.picture" alt="" />
            <img v-else :src="allianceMark" alt="" />
            <span>{{ user?.name }}</span>
          </RouterLink>
        </nav>
      </div>
    </header>

    <main class="site-main">
      <RouterView />
    </main>

    <footer class="site-footer">
      <div>
        <strong>{{ t('footer.name') }}</strong>
        <span>{{ t('footer.description') }}</span>
      </div>
      <p>{{ t('footer.motto') }}</p>
    </footer>
  </div>
</template>
