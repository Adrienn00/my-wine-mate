<template>
  <PageFrame>
    <BaseCard class="hero-sheen" rounded="rounded-2xl" padding="p-6 md:p-10">
      <SectionHeader kicker="Project Story" title="About" />
      <div class="space-y-4 text-[var(--text-muted)]">
        <p>
          <strong class="text-[var(--text-main)]">Vinology Cook</strong> is a final-year project
          created to make choosing wine feel enjoyable instead of stressful.
        </p>
        <p>
          The idea comes from hospitality: many people feel unsure when they need to choose a wine
          for dinner, a gift, or a casual evening.
        </p>
        <p>
          My goal is to build a fast, clear, and modern web app that helps users find the wine
          that fits them best.
        </p>
        <p>
          My Wine Mate is more than a search tool. It is meant to be a smart companion in the
          decision-making process, with future plans for photo-based search and richer wine profiles.
        </p>
        <p class="pt-2 text-sm italic">Thanks for visiting!</p>
      </div>
    </BaseCard>
  </PageFrame>
</template>

<script setup>
import PageFrame from '../components/ui/PageFrame.vue'
import BaseCard from '../components/ui/BaseCard.vue'
import SectionHeader from '../components/ui/SectionHeader.vue'
</script>
