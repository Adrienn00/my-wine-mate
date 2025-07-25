import { createRouter, createWebHistory } from 'vue-router'
import BaseLayout from '../layout/BaseLayout.vue'
import Home from '../pages/Home.vue'
import About from '../pages/About.vue'
import Login from '../pages/Login.vue'
import SignUp from '../pages/SignUp.vue'
import ForgotPassword from '../pages/ForgotPassword.vue'
import FoodPairing from '../pages/FoodPairing.vue'
import Recipes from '../pages/Recipes.vue'
import RecommendedWines from '../pages/RecommendedWines.vue'
import AddNewWine from '../pages/AddNewWine.vue'
import UserProfile from '../pages/UserProfile.vue'
import FavoriteList from '../pages/FavoriteList.vue'
import WineCard from '../pages/WineCard.vue'
import UserLayout from '../layout/UserLayout.vue'
import WinePreferences from '../pages/WinePreferences.vue'
import Admin from '../components/admin/Admin.vue'
import AdminDatabaseManager from '../components/admin/AdminDatabaseManager.vue'
import RecipeCard from '../pages/RecipeCard.vue'
import AddNewRecipe from '../pages/AddNewRecipe.vue'
import PendingItemsTabs from '../components/admin/PendingItemsTabs.vue'

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
      { path: '/foodPairing', component: FoodPairing },
      { path: '/recipes', component: Recipes },
      { path: '/recipe/:id', name: 'recipe-details', component: RecipeCard },
      { path: '/addRecipe', component: AddNewRecipe },
      { path: '/addWine', component: AddNewWine },
      {
        path: '/wine/:id',
        name: 'wine-details',
        component: WineCard,
      },
      {
        path: '/profile',
        component: UserLayout,
        children: [
          { path: '/profile', component: UserProfile },
          { path: '/favorite', component: FavoriteList },
          { path: '/preferences', component: WinePreferences },
          { path: '/recommended', component: RecommendedWines },
          { path: '/admin', component: Admin },
          { path: '/admin/pending', component: PendingItemsTabs },
          { path: '/admin/manager', component: AdminDatabaseManager },
        ],
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
