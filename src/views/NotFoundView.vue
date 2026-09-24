<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from '../i18n'

const { t } = useI18n()
</script>

<template>
  <section class="content-page not-found">
    <p class="error-code">404</p>
    <h1>{{ t('notFound.title') }}</h1>
    <RouterLink class="button button-primary" to="/">{{ t('notFound.backHome') }}</RouterLink>
  </section>
</template>
