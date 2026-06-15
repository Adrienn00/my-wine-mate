<template>
  <div class="page-shell">
    <div class="page-frame page-stack">
      <div class="section-intro text-center">
        <span class="section-kicker">Control Center</span>
        <h1 class="section-title">Admin Features</h1>
        <p class="mx-auto max-w-2xl text-[var(--text-muted)]">
          Keep the admin area visually aligned with the rest of the product while making the action
          paths clearer and easier to scan.
        </p>
      </div>

      <div class="mx-auto grid w-full max-w-4xl gap-4 sm:grid-cols-2">
        <router-link to="/admin/pending" class="admin-card">
          <span class="admin-card-icon">✔</span>
          <span class="admin-card-title">Approval / Editing</span>
          <span class="admin-card-desc">Review pending wines and recipes</span>
        </router-link>
        <router-link to="/admin/manager" class="admin-card">
          <span class="admin-card-icon">🗄</span>
          <span class="admin-card-title">Database Management</span>
          <span class="admin-card-desc">Manage wines and recipes</span>
        </router-link>
        <router-link to="/admin/roles" class="admin-card">
          <span class="admin-card-icon">👤</span>
          <span class="admin-card-title">Role Management</span>
          <span class="admin-card-desc">Assign and revoke admin rights</span>
        </router-link>
        <router-link to="/admin/ai" class="admin-card">
          <span class="admin-card-icon">🤖</span>
          <span class="admin-card-title">AI Management</span>
          <span class="admin-card-desc">Train models, review AI feedback</span>
        </router-link>
        <router-link to="/admin/comments" class="admin-card">
          <span class="admin-card-icon">💬</span>
          <span class="admin-card-title">Review Management</span>
          <span class="admin-card-desc">Moderate wine and recipe comments</span>
        </router-link>
        <router-link to="/admin/stats" class="admin-card">
          <span class="admin-card-icon">📊</span>
          <span class="admin-card-title">System Statistics</span>
          <span class="admin-card-desc">Ratings, wines, users overview</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.admin-card {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid var(--line);
  background: white;
  text-decoration: none;
  color: var(--text-main);
  transition: all 0.2s;
}
.admin-card:hover {
  border-color: rgba(107, 45, 62, 0.35);
  color: var(--wine);
  transform: translateY(-1px);
}
.admin-card-icon { font-size: 1.5rem; }
.admin-card-title { font-weight: 600; font-size: 1rem; }
.admin-card-desc { font-size: 0.8rem; color: var(--text-muted); }
</style>
