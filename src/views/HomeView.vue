<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from '../i18n'

const { currentMessages, t } = useI18n()
const rules = computed(() => currentMessages.value.home.rules)
const captions = computed(() => currentMessages.value.home.caption)
</script>

<template>
  <section class="hero">
    <div class="hero-copy-block">
      <p class="eyebrow"><span aria-hidden="true" /> {{ t('home.eyebrow') }}</p>
      <h1>
        <span>{{ t('home.title1') }}</span>
        <span><em>{{ t('home.titleAccent') }}</em></span>
      </h1>
      <p class="hero-copy">{{ t('home.description') }}</p>

      <div class="hero-actions">
        <RouterLink class="button button-primary" to="/about">{{ t('home.aboutCta') }}</RouterLink>
        <RouterLink class="button button-secondary" to="/recruit">{{ t('home.recruitCta') }}</RouterLink>
      </div>

      <div class="hero-caption" aria-label="UWIN">
        <span v-for="caption in captions" :key="caption">{{ caption }}</span>
      </div>
    </div>

  </section>

  <section class="section-block" aria-labelledby="rules-title">
    <div class="section-heading">
      <p class="eyebrow"><span aria-hidden="true" /> {{ t('home.sectionEyebrow') }}</p>
      <h2 id="rules-title">{{ t('home.rulesTitle') }}</h2>
      <p>{{ t('home.rulesDescription') }}</p>
      <RouterLink class="section-link" to="/notices">{{ t('home.allNotices') }} <span aria-hidden="true">→</span></RouterLink>
    </div>

    <div class="activity-grid">
      <article v-for="rule in rules" :key="rule.number" class="activity-card">
        <span class="activity-index">{{ rule.number }}</span>
        <h3>{{ rule.title }}</h3>
        <p>{{ rule.description }}</p>
      </article>
    </div>

    <div class="rule-outcomes" :aria-label="t('home.outcomesLabel')">
      <article class="outcome-card rewards-card">
        <span class="outcome-icon" aria-hidden="true">★</span>
        <div>
          <p class="profile-label">{{ currentMessages.home.rewards.label }}</p>
          <h3>{{ currentMessages.home.rewards.title }}</h3>
          <p>{{ currentMessages.home.rewards.text }}</p>
        </div>
      </article>
      <article class="outcome-card penalty-card">
        <span class="outcome-icon" aria-hidden="true">!</span>
        <div>
          <p class="profile-label">{{ currentMessages.home.penalties.label }}</p>
          <h3>{{ currentMessages.home.penalties.title }}</h3>
          <p>{{ currentMessages.home.penalties.text }}</p>
        </div>
      </article>
    </div>
  </section>

  <section class="recruit-banner">
    <div>
      <p class="eyebrow"><span aria-hidden="true" /> {{ t('home.join.eyebrow') }}</p>
      <h2>{{ t('home.join.title') }}</h2>
      <p>{{ t('home.join.text') }}</p>
    </div>
    <RouterLink class="button button-primary" to="/recruit">{{ t('home.join.cta') }}</RouterLink>
  </section>
</template>
