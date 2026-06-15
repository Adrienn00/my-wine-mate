import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import BaseLayout from '../layout/BaseLayout.vue'
import Home from '../pages/Home.vue'
import About from '../pages/About.vue'
import Login from '../pages/Login.vue'
import SignUp from '../pages/SignUp.vue'
import ForgotPassword from '../pages/ForgotPassword.vue'
import FoodPairing from '../pages/FoodPairing.vue'
import ConversationalPairing from '../pages/ConversationalPairing.vue'
import Recipes from '../pages/Recipes.vue'
import RecommendedWines from '../pages/RecommendedWines.vue'
import AddNewWine from '../pages/AddNewWine.vue'
import Wines from '../pages/Wines.vue'
import UserProfile from '../pages/UserProfile.vue'
import FavoriteList from '../pages/FavoriteList.vue'
import WineCard from '../pages/WineCard.vue'
import UserLayout from '../layout/UserLayout.vue'
import WinePreferences from '../pages/WinePreferences.vue'
import RecipePreferences from '../pages/RecipePreferences.vue'
import Admin from '../components/admin/Admin.vue'
import AdminDatabaseManager from '../components/admin/AdminDatabaseManager.vue'
import RecipeCard from '../pages/RecipeCard.vue'
import AddNewRecipe from '../pages/AddNewRecipe.vue'
import PendingItemsTabs from '../components/admin/PendingItemsTabs.vue'
import UserRoleManager from '../components/admin/UserRoleManager.vue'
import SystemStats from '../components/admin/SystemStats.vue'
import AIManagement from '../components/admin/AIManagement.vue'
import Social from '../pages/Social.vue'
import CheckEmail from '../pages/CheckEmail.vue'
import VerifyEmail from '../pages/VerifyEmail.vue'
const routes = [
  {
    path: '',
    component: BaseLayout,
    children: [
      { path: '', component: Home },
      { path: '/about', component: About },
      { path: '/login', component: Login },
      { path: '/signup', component: SignUp },
      { path: '/forgotPassword', component: ForgotPassword },
      { path: '/check-email', component: CheckEmail },
      { path: '/verify/:token', component: VerifyEmail },
      { path: '/foodPairing', component: FoodPairing },
      { path: '/pairing-assistant', component: ConversationalPairing },
      { path: '/recipes', component: Recipes },
      { path: '/recipe/:id', name: 'recipe-details', component: RecipeCard },
      { path: '/addRecipe', component: AddNewRecipe, meta: { requiresAuth: true } },
      { path: '/wines', component: Wines },
      { path: '/addWine', component: AddNewWine, meta: { requiresAuth: true } },
      { path: '/social', component: Social, meta: { requiresAuth: true } },
      {
        path: '/wine/:id',
        name: 'wine-details',
        component: WineCard,
      },
      {
        path: '/profile',
        component: UserLayout,
        meta: { requiresAuth: true },
        children: [
          { path: '/profile', component: UserProfile, meta: { requiresAuth: true } },
          { path: '/favorite', component: FavoriteList, meta: { requiresAuth: true } },
          { path: '/preferences', component: WinePreferences, meta: { requiresAuth: true } },
          { path: '/recipe-preferences', component: RecipePreferences, meta: { requiresAuth: true } },
          { path: '/recommended', component: RecommendedWines, meta: { requiresAuth: true } },
          { path: '/admin', component: Admin, meta: { requiresAuth: true, requiresAdmin: true } },
          { path: '/admin/pending', component: PendingItemsTabs, meta: { requiresAuth: true, requiresAdmin: true } },
          { path: '/admin/manager', component: AdminDatabaseManager, meta: { requiresAuth: true, requiresAdmin: true } },
          { path: '/admin/roles', component: UserRoleManager, meta: { requiresAuth: true, requiresAdmin: true } },
          { path: '/admin/stats', component: SystemStats, meta: { requiresAuth: true, requiresAdmin: true } },
          { path: '/admin/ai', component: AIManagement, meta: { requiresAuth: true, requiresAdmin: true } },
        ],
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin)

  if (requiresAuth && !authStore.token) {
    return next({ path: '/login', query: { redirect: to.fullPath } })
  }

  if (authStore.token && !authStore.user) {
    try {
      await authStore.loadProfile()
    } catch {
      return next({ path: '/login', query: { redirect: to.fullPath } })
    }
  }

  if (requiresAdmin && !authStore.user?.isAdmin) {
    return next('/')
  }

  next()
})

export default router
