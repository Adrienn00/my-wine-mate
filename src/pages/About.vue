<template>
  <PageFrame>
    <BaseCard class="hero-sheen overflow-hidden" rounded="rounded-2xl" padding="p-0">
      <div class="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
        <div class="relative min-h-[22rem] overflow-hidden">
          <img
            :src="HERO_IMAGES.about"
            alt="Wine bar atmosphere"
            class="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(38,21,20,0.08),rgba(38,21,20,0.72))]"></div>
          <div class="anim-fade-up absolute bottom-5 left-5 right-5 rounded-2xl border border-white/20 bg-black/25 p-4 text-white backdrop-blur-sm">
            <p class="text-xs font-semibold uppercase tracking-[0.22em] text-[#f4dcb6]">
              Project mood
            </p>
            <p class="mt-2 text-2xl font-semibold leading-tight">
              Wine choice should feel guided, not intimidating.
            </p>
          </div>
        </div>

        <div class="relative p-6 md:p-10">
          <SectionHeader kicker="Project Story" title="About" />
          <div class="space-y-4 text-[var(--text-muted)]">
            <p>
              <strong class="text-[var(--text-main)]">MyWineMate</strong> is a final-year project
              created to make choosing wine feel enjoyable instead of stressful.
            </p>
            <p>
              The idea comes from hospitality: many people feel unsure when they need to choose a
              wine for dinner, a gift, or a casual evening.
            </p>
            <p>
              My goal is to build a fast, clear, and modern web app that helps users find the wine
              that fits them best.
            </p>
            <p>
              MyWineMate is more than a search tool. It combines a wine and recipe catalog with AI
              assisted pairing, OCR-style label reading, and a conversational sommelier interface.
            </p>
          </div>

          <div class="mt-6 grid gap-3 sm:grid-cols-3">
            <div class="anim-fade-up anim-d2 rounded-2xl border border-[var(--line)] bg-white/70 p-4">
              <p class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(93,31,50,0.1)] text-sm font-bold text-[var(--wine)]">
                W
              </p>
              <p class="mt-2 text-sm font-semibold">Wine catalog</p>
            </div>
            <div class="anim-fade-up anim-d3 rounded-2xl border border-[var(--line)] bg-white/70 p-4">
              <p class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(199,163,103,0.18)] text-sm font-bold text-[var(--wine)]">
                F
              </p>
              <p class="mt-2 text-sm font-semibold">Food pairing</p>
            </div>
            <div class="anim-fade-up anim-d4 rounded-2xl border border-[var(--line)] bg-white/70 p-4">
              <p class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(93,31,50,0.1)] text-sm font-bold text-[var(--wine)]">
                AI
              </p>
              <p class="mt-2 text-sm font-semibold">AI assistant</p>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  </PageFrame>
</template>

<script setup>
import PageFrame from '../components/ui/PageFrame.vue'
import BaseCard from '../components/ui/BaseCard.vue'
import SectionHeader from '../components/ui/SectionHeader.vue'
import { HERO_IMAGES } from '../services/imageFallbacks'
</script>
