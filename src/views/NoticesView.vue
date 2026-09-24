<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import UwinAllianceBanner, { type UwinBannerLanguage } from '../components/UwinAllianceBanner.vue'
import { useI18n } from '../i18n'
import { messages } from '../i18n/messages'

const { locale, t } = useI18n()
const assetBase = import.meta.env.BASE_URL
const noticeImage = `${assetBase}images/uwin/uwin-recruit-notice.webp`
const noticeImageSmall = `${assetBase}images/uwin/uwin-recruit-notice-sm.webp`
const noticeBannerLanguage = computed<UwinBannerLanguage>(() => locale.value)
const currentNotice = computed(() => messages[locale.value].notices)
const originalImageLabel = computed(() => t('common.originalImage'))
</script>

<template>
  <section class="content-page notices-page">
    <div class="notice-page-header">
      <div>
        <p class="eyebrow"><span aria-hidden="true" /> {{ currentNotice.eyebrow }}</p>
        <h1>{{ currentNotice.title }}</h1>
        <p class="page-lead">{{ currentNotice.lead }}</p>
      </div>
    </div>

    <div class="notice-meta">
      <span>2026-09-11 · {{ currentNotice.published }}</span>
      <span>UNITED WE WILL WIN</span>
    </div>

    <UwinAllianceBanner :language="noticeBannerLanguage" />

    <section class="mandatory-card" aria-labelledby="mandatory-title">
      <div class="mandatory-icon" aria-hidden="true">!</div>
      <div>
        <p id="mandatory-title">{{ currentNotice.mandatoryLabel }}</p>
        <h2>{{ currentNotice.mandatoryText }}</h2>
        <span>{{ currentNotice.mandatoryNote }}</span>
      </div>
    </section>

    <section class="official-rules" aria-labelledby="rules-title">
      <div class="notice-section-heading">
        <p class="profile-label">{{ currentNotice.rulesLabel }}</p>
        <h2 id="rules-title">{{ currentNotice.rulesTitle }}</h2>
      </div>

      <div class="official-rule-grid">
        <article v-for="rule in currentNotice.rules" :key="rule.number">
          <span>{{ rule.number }}</span>
          <h3>{{ rule.title }}</h3>
          <p>{{ rule.description }}</p>
        </article>
      </div>
    </section>

    <div class="notice-outcome-grid">
      <section class="official-reward" aria-labelledby="reward-title">
        <span class="official-reward-icon" aria-hidden="true">★</span>
        <div>
          <p class="profile-label">{{ currentNotice.rewardsLabel }}</p>
          <h2 id="reward-title">{{ currentNotice.rewardsTitle }}</h2>
          <p>{{ currentNotice.rewardsText }}</p>
        </div>
      </section>

      <section class="official-penalty" aria-labelledby="penalty-title">
        <p class="profile-label">{{ currentNotice.penaltiesLabel }}</p>
        <h2 id="penalty-title">{{ currentNotice.penaltyTitle }}</h2>
        <ol>
          <li v-for="penalty in currentNotice.penalties" :key="penalty.count">
            <span>{{ penalty.count }}</span>
            <strong>{{ penalty.label }}</strong>
          </li>
        </ol>
      </section>
    </div>

    <figure class="official-notice-image">
      <a :href="noticeImage" target="_blank" rel="noreferrer" :aria-label="originalImageLabel">
        <img
          :src="noticeImage"
          :srcset="`${noticeImageSmall} 603w, ${noticeImage} 1206w`"
          sizes="(max-width: 760px) calc(100vw - 48px), 720px"
          :alt="currentNotice.imageAlt"
          width="1206"
          height="1735"
          loading="lazy"
          decoding="async"
        />
      </a>
      <figcaption>UWIN {{ currentNotice.title }} · {{ originalImageLabel }}</figcaption>
    </figure>

    <div class="notice-signoff">
      <p>{{ currentNotice.signoff }}</p>
      <RouterLink class="button button-primary" to="/recruit">{{ currentNotice.recruitCta }}</RouterLink>
    </div>
  </section>
</template>
