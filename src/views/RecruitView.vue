<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from '../i18n'

const assetBase = import.meta.env.BASE_URL
const noticeImage = `${assetBase}images/uwin/uwin-recruit-notice.webp`
const noticeImageSmall = `${assetBase}images/uwin/uwin-recruit-notice-sm.webp`

const { currentMessages, t } = useI18n()
</script>

<template>
  <section class="content-page recruit-page">
    <p class="eyebrow"><span aria-hidden="true" /> {{ t('recruit.eyebrow') }}</p>
    <h1>{{ t('recruit.title1') }}<br /><em>{{ t('recruit.titleAccent') }}</em></h1>
    <p class="page-lead">{{ t('recruit.lead') }}</p>

    <div class="recruit-highlight">
      <div class="recruit-crest" aria-hidden="true">U</div>
      <div>
        <p class="profile-label">{{ t('recruit.highlightLabel') }}</p>
        <h2>{{ t('recruit.highlightTitle') }}</h2>
        <p>{{ t('recruit.highlightText') }}</p>
      </div>
    </div>

    <section class="notice-section" aria-labelledby="notice-title">
      <div class="notice-copy">
        <p class="eyebrow"><span aria-hidden="true" /> {{ t('recruit.noticeEyebrow') }}</p>
        <h2 id="notice-title">{{ t('recruit.noticeTitle') }}</h2>
        <p>{{ t('recruit.noticeText') }}</p>
        <RouterLink class="notice-page-link" to="/notices">{{ t('recruit.noticePageLink') }} →</RouterLink>
      </div>

      <figure class="notice-figure">
        <a
          class="notice-preview"
          :href="noticeImage"
          target="_blank"
          rel="noreferrer"
          :aria-label="t('common.originalImage')"
        >
          <img
            :src="noticeImage"
            :srcset="`${noticeImageSmall} 603w, ${noticeImage} 1206w`"
            sizes="(max-width: 760px) calc(100vw - 64px), 720px"
            :alt="t('recruit.imageAlt')"
            width="1206"
            height="1735"
            loading="lazy"
            decoding="async"
          />
          <span class="notice-preview-action">{{ t('common.originalImage') }} ↗</span>
        </a>
        <figcaption>{{ t('recruit.date') }}</figcaption>
      </figure>
    </section>

    <div class="recruit-steps" :aria-label="t('recruit.recruitStepsLabel')">
      <article v-for="step in currentMessages.recruit.steps" :key="step.number">
        <span>{{ step.number }}</span>
        <div>
          <h3>{{ step.title }}</h3>
          <p>{{ step.text }}</p>
        </div>
      </article>
    </div>

    <div class="recruit-actions">
      <div>
        <h2>{{ t('recruit.actionsTitle') }}</h2>
        <p>{{ t('recruit.actionsText') }}</p>
      </div>
      <RouterLink class="button button-primary" to="/login">{{ t('recruit.loginCta') }}</RouterLink>
    </div>
  </section>
</template>
