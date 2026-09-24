<script setup lang="ts">
export type UwinBannerLanguage = 'ko' | 'en' | 'ar' | 'ja'

defineProps<{
  language: UwinBannerLanguage
}>()

const bannerSrc = `${import.meta.env.BASE_URL}images/uwin/uwin-banner.svg`

const copy = {
  ko: {
    order: '연맹 집결지 근처로 이동',
    rules: [
      { title: '약탈금지', text: '2288(전체) &\n2286(열차)' },
      { title: '연맹 대결 참여', text: '최소 5상자 달성' },
      { title: '분쟁 발생 시', text: 'R4/R5에게 즉시 보고' },
      { title: '함께 소통하기', text: '연맹 채팅창에서 인사하기\n귓말에 응답하기' },
    ],
    rewards: {
      label: '포상',
      segments: ['기여도에 따라', '회원 등급 상향', '연맹 열차 차장 기회 부여'],
    },
    penalties: {
      label: '패널티',
      segments: ['1회 위반: 주의', '2회: 경고', '3회: 강퇴'],
    },
    footer: '서로 돕고 함께 걸으며, 함께 성장합니다.\nU WIN, WE WIN!',
  },
  en: {
    order: 'Relocate near the Alliance Rally Point',
    rules: [
      { title: 'NO PLUNDERING', text: '2288 (ALL) &\n2286 (TRAINS)' },
      { title: 'Join the Alliance Duel', text: '5+ REWARD CHESTS' },
      { title: 'Report disputes to', text: 'R4/R5 IMMEDIATELY' },
      { title: 'STAY CONNECTED', text: 'Say hello in Alliance Chat\nReply to private messages' },
    ],
    rewards: {
      label: 'REWARDS',
      segments: [
        'Based on contribution:',
        'MEMBER RANK PROMOTION',
        'ALLIANCE TRAIN CONDUCTOR OPPORTUNITY',
      ],
    },
    penalties: {
      label: 'PENALTIES',
      segments: ['1st violation: Caution', '2nd: Warning', '3rd: EXPULSION'],
    },
    footer: 'Help each other · Move forward together · Grow together\nU WIN, WE WIN!',
  },
  ar: {
    order: 'انتقلوا قرب نقطة تجمع التحالف',
    rules: [
      { title: 'ممنوع النهب', text: 'الخادم 2288 (الكل) و\n2286 (القطارات)' },
      { title: 'شاركوا في مواجهة التحالف', text: '5 صناديق مكافآت على الأقل' },
      { title: 'عند حدوث نزاع', text: 'أبلغوا R4/R5 فورًا' },
      { title: 'تواصلوا معًا', text: 'حيّوا في دردشة التحالف\nوردّوا على الرسائل الخاصة' },
    ],
    rewards: {
      label: 'المكافآت',
      segments: ['بحسب المساهمة', 'ترقية رتبة العضو', 'فرصة قيادة قطار التحالف'],
    },
    penalties: {
      label: 'العقوبات',
      segments: ['المرة الأولى: تنبيه', 'الثانية: إنذار', 'الثالثة: طرد'],
    },
    footer: 'نساعد بعضنا · نتقدم معًا · ننمو معًا\nU WIN, WE WIN!',
  },
  ja: {
    order: '連合集結地の近くへ移動',
    rules: [
      { title: '略奪禁止', text: '2288（全体）＆\n2286（列車）' },
      { title: '連合対決に参加', text: '報酬箱を5個以上獲得' },
      { title: '問題が起きたら', text: 'R4/R5へすぐに報告' },
      { title: '積極的に交流', text: '連合チャットで挨拶し\n個別メッセージに返信' },
    ],
    rewards: {
      label: '報酬',
      segments: ['貢献度に応じて', 'メンバーランク昇格', '連合列車の車掌機会'],
    },
    penalties: {
      label: 'ペナルティ',
      segments: ['1回目：注意', '2回目：警告', '3回目：追放'],
    },
    footer: '助け合い · 共に歩み · 共に成長する\nU WIN, WE WIN!',
  },
} as const

const orderLabels: Record<UwinBannerLanguage, string> = {
  ko: '군령',
  en: 'MANDATORY ORDER',
  ar: 'أمر إلزامي',
  ja: '必須指令',
}
</script>

<template>
  <figure class="uwin-banner" :lang="language">
    <img
      class="uwin-banner-art"
      :src="bannerSrc"
      alt=""
      aria-hidden="true"
      width="1672"
      height="941"
      decoding="async"
    />

    <div class="uwin-banner-copy">
      <div class="uwin-order">
        <strong>{{ orderLabels[language] }}</strong>
        <span>•</span>
        <span>{{ copy[language].order }}</span>
      </div>

      <ol class="uwin-rules">
        <li v-for="(rule, index) in copy[language].rules" :key="index">
          <span class="uwin-rule-number">{{ String(index + 1).padStart(2, '0') }}</span>
          <div class="uwin-rule-copy">
            <h2>{{ rule.title }}</h2>
            <p>{{ rule.text }}</p>
          </div>
        </li>
      </ol>

      <p class="uwin-rewards">
        <strong>{{ copy[language].rewards.label }}</strong>
        <template v-for="(segment, index) in copy[language].rewards.segments" :key="segment">
          <span v-if="index > 0" class="uwin-dot">•</span>
          <span>{{ segment }}</span>
        </template>
      </p>
      <p class="uwin-penalties">
        <strong>{{ copy[language].penalties.label }}</strong>
        <template v-for="(segment, index) in copy[language].penalties.segments" :key="segment">
          <span v-if="index > 0" class="uwin-dot">•</span>
          <span>{{ segment }}</span>
        </template>
      </p>
      <p class="uwin-footer">{{ copy[language].footer }}</p>
    </div>
  </figure>
</template>
