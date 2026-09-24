import { computed, readonly, ref, watch } from 'vue'
import { messages } from './messages'

export type Locale = keyof typeof messages

export const localeOptions: ReadonlyArray<{
  value: Locale
  label: string
  short: string
}> = [
  { value: 'ko', label: '한국어', short: 'KO' },
  { value: 'en', label: 'English', short: 'EN' },
  { value: 'ar', label: 'العربية', short: 'AR' },
  { value: 'ja', label: '日本語', short: 'JA' },
]

const STORAGE_KEY = 'uwin-locale'
const DEFAULT_LOCALE: Locale = 'ko'

function isLocale(value: string | null): value is Locale {
  return value === 'ko' || value === 'en' || value === 'ar' || value === 'ja'
}

function getInitialLocale(): Locale {
  try {
    const savedLocale = window.localStorage.getItem(STORAGE_KEY)
    return isLocale(savedLocale) ? savedLocale : DEFAULT_LOCALE
  } catch {
    return DEFAULT_LOCALE
  }
}

const locale = ref<Locale>(getInitialLocale())
const currentMessages = computed(() => messages[locale.value])
const isRtl = computed(() => locale.value === 'ar')

function getValue(source: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((value, key) => {
    if (value && typeof value === 'object' && key in value) {
      return (value as Record<string, unknown>)[key]
    }
    return undefined
  }, source)
}

function t(path: string, params?: Record<string, string | number>): string {
  const value = getValue(messages[locale.value], path) ?? getValue(messages[DEFAULT_LOCALE], path)

  if (typeof value !== 'string' && typeof value !== 'number') {
    return path
  }

  return String(value).replace(/\{(\w+)\}/g, (match, key: string) => {
    const replacement = params?.[key]
    return replacement === undefined ? match : String(replacement)
  })
}

function setLocale(nextLocale: Locale) {
  locale.value = nextLocale
}

watch(
  locale,
  (nextLocale) => {
    const direction = nextLocale === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = nextLocale
    document.documentElement.dir = direction
    document.documentElement.dataset.locale = nextLocale
    document.title = t('meta.title')
    document.querySelector('meta[name="description"]')?.setAttribute('content', t('meta.description'))

    try {
      window.localStorage.setItem(STORAGE_KEY, nextLocale)
    } catch {
      // Storage can be unavailable in private browsing; the in-memory locale still works.
    }
  },
  { immediate: true },
)

export function useI18n() {
  return {
    locale: readonly(locale),
    currentMessages,
    isRtl,
    localeOptions,
    t,
    setLocale,
  }
}
