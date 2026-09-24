<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useI18n } from '../i18n'
import { useAuth, type MemberRole } from '../composables/useAuth'

const router = useRouter()
const { t } = useI18n()
const { user } = useAuth()
const activeSection = ref('overview')

watch(user, (currentUser) => {
  if (!currentUser) void router.replace({ name: 'login' })
})

const sections = [
  { key: 'overview', label: 'admin.overview', description: 'admin.overviewDesc', icon: '⌂' },
  { key: 'members', label: 'admin.members', description: 'admin.membersDesc', icon: '♙' },
  { key: 'notices', label: 'admin.notices', description: 'admin.noticesDesc', icon: '▤' },
  { key: 'recruit', label: 'admin.recruit', description: 'admin.recruitDesc', icon: '＋' },
  { key: 'settings', label: 'admin.settings', description: 'admin.settingsDesc', icon: '⚙' },
] as const

type SectionKey = (typeof sections)[number]['key']
type DemoMember = {
  name: string
  role: MemberRole
  rank: string
  status: 'active' | 'pending'
}

const demoMembers: DemoMember[] = [
  { name: 'UWIN · R5', role: 'super_admin', rank: 'R5', status: 'active' },
  { name: 'UWIN · Operations', role: 'admin', rank: 'R4', status: 'active' },
  { name: 'UWIN · Member', role: 'member', rank: 'R3', status: 'active' },
  { name: 'Application · Review', role: 'member', rank: '—', status: 'pending' },
]

const activeSectionLabel = computed(() => {
  const section = sections.find((item) => item.key === activeSection.value)
  return section ? t(section.label) : t('admin.overview')
})

function roleLabel(role: MemberRole) {
  return t(`memberRoles.${role}`)
}

function statusLabel(status: DemoMember['status']) {
  return t(status === 'active' ? 'admin.active' : 'admin.pending')
}

function selectSection(section: SectionKey) {
  activeSection.value = section
}
</script>

<template>
  <section v-if="user" class="admin-page">
    <header class="admin-header">
      <div>
        <p class="eyebrow"><span aria-hidden="true" /> UWIN · ADMIN</p>
        <h1>{{ t('admin.title') }}</h1>
        <p class="page-lead">{{ t('admin.lead') }}</p>
      </div>
      <div class="admin-role-card">
        <span>{{ t('admin.roleLabel') }}</span>
        <strong>{{ roleLabel(user.memberRole) }}</strong>
        <RouterLink to="/account">{{ t('admin.backAccount') }} →</RouterLink>
      </div>
    </header>

    <div class="admin-layout">
      <nav class="admin-menu" :aria-label="t('admin.title')">
        <button
          v-for="section in sections"
          :key="section.key"
          type="button"
          :class="{ active: activeSection === section.key }"
          :aria-label="t(section.label)"
          :aria-current="activeSection === section.key ? 'page' : undefined"
          @click="selectSection(section.key)"
        >
          <span class="admin-menu-icon" aria-hidden="true">{{ section.icon }}</span>
          <span>
            <strong>{{ t(section.label) }}</strong>
            <small>{{ t(section.description) }}</small>
          </span>
        </button>
      </nav>

      <div class="admin-content">
        <div class="admin-content-heading">
          <div>
            <p class="profile-label">{{ t('admin.consoleLabel') }}</p>
            <h2>{{ activeSectionLabel }}</h2>
          </div>
          <span class="admin-live"><i aria-hidden="true" /> {{ t('admin.demoMode') }}</span>
        </div>

        <template v-if="activeSection === 'overview'">
          <div class="admin-stats">
            <article>
              <span>01</span>
              <strong>248</strong>
              <small>{{ t('admin.statsMembers') }}</small>
            </article>
            <article>
              <span>02</span>
              <strong>12</strong>
              <small>{{ t('admin.statsRequests') }}</small>
            </article>
            <article>
              <span>03</span>
              <strong>08</strong>
              <small>{{ t('admin.statsNotices') }}</small>
            </article>
            <article>
              <span>04</span>
              <strong>2288</strong>
              <small>{{ t('admin.statsServer') }}</small>
            </article>
          </div>
          <div class="admin-quick-grid">
            <RouterLink class="admin-quick-card" to="/notices">
              <span>▤</span>
              <strong>{{ t('admin.openNotices') }}</strong>
              <small>{{ t('admin.recentTitle') }}</small>
            </RouterLink>
            <RouterLink class="admin-quick-card" to="/recruit">
              <span>＋</span>
              <strong>{{ t('admin.openRecruit') }}</strong>
              <small>{{ t('admin.recruitDesc') }}</small>
            </RouterLink>
          </div>
        </template>

        <section v-else-if="activeSection === 'members'" class="admin-panel">
          <div class="admin-panel-heading">
            <div>
              <h3>{{ t('admin.memberTitle') }}</h3>
              <p>{{ t('admin.membersDesc') }}</p>
            </div>
            <button class="admin-action-button" type="button" disabled>+ {{ t('admin.addMember') }}</button>
          </div>
          <div class="admin-table-wrap">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>{{ t('admin.memberHeader') }}</th>
                  <th>{{ t('admin.roleHeader') }}</th>
                  <th>{{ t('admin.rankHeader') }}</th>
                  <th>{{ t('admin.statusHeader') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="member in demoMembers" :key="member.name">
                  <td>{{ member.name }}</td>
                  <td><span class="admin-role" :class="member.role">{{ roleLabel(member.role) }}</span></td>
                  <td>{{ member.rank }}</td>
                  <td><span class="admin-status" :class="member.status">{{ statusLabel(member.status) }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section v-else-if="activeSection === 'notices'" class="admin-panel admin-placeholder-panel">
          <span class="placeholder-icon">▤</span>
          <h3>{{ t('admin.notices') }}</h3>
          <p>{{ t('admin.noticesDesc') }}</p>
          <RouterLink class="button button-primary" to="/notices">{{ t('admin.openNotices') }} →</RouterLink>
        </section>

        <section v-else-if="activeSection === 'recruit'" class="admin-panel admin-placeholder-panel">
          <span class="placeholder-icon">＋</span>
          <h3>{{ t('admin.recruit') }}</h3>
          <p>{{ t('admin.recruitDesc') }}</p>
          <RouterLink class="button button-primary" to="/recruit">{{ t('admin.openRecruit') }} →</RouterLink>
        </section>

        <section v-else class="admin-panel admin-placeholder-panel">
          <span class="placeholder-icon">⚙</span>
          <h3>{{ t('admin.settings') }}</h3>
          <p>{{ t('admin.settingsDesc') }}</p>
          <div class="permission-list">
            <span>✓ {{ t('memberRoles.super_admin') }}</span>
            <span>✓ {{ t('memberRoles.admin') }}</span>
            <span>· {{ t('memberRoles.member') }}</span>
          </div>
        </section>

        <p class="admin-demo-note"><strong>DEMO</strong> {{ t('admin.demoNotice') }}</p>
      </div>
    </div>
  </section>
</template>
