<script setup lang="ts">
import { useI18n } from '../i18n'

const gameGuideUrl =
  'https://namu.wiki/w/%EB%9D%BC%EC%8A%A4%ED%8A%B8%20%EC%9B%8C:%20%EC%84%9C%EB%B0%94%EC%9D%B4%EB%B2%8C'
const { currentMessages, t } = useI18n()
</script>

<template>
  <section class="content-page alliance-page">
    <p class="eyebrow"><span aria-hidden="true" /> {{ t('about.eyebrow') }}</p>
    <h1>{{ t('about.title1') }}<br /><em>{{ t('about.titleAccent') }}</em></h1>
    <p class="page-lead">{{ t('about.lead') }}</p>

    <div class="alliance-quote">
      <span aria-hidden="true">“</span>
      <p>{{ t('about.quote') }}</p>
    </div>

    <div class="value-grid" :aria-label="t('about.valuesLabel')">
      <article v-for="value in currentMessages.about.values" :key="value.number">
        <span>{{ value.number }}</span>
        <h2>{{ value.title }}</h2>
        <p>{{ value.text }}</p>
      </article>
    </div>

    <div class="alliance-promise">
      <p class="profile-label">{{ t('about.promiseLabel') }}</p>
      <h2>{{ t('about.promiseTitle') }}</h2>
      <p>{{ t('about.promiseText') }}</p>
      <a
        class="button button-secondary source-link"
        :href="gameGuideUrl"
        target="_blank"
        rel="noreferrer"
      >
        {{ t('about.gameInfo') }}
      </a>
    </div>
  </section>
</template>
