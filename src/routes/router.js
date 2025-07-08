import { createRouter, createWebHistory } from "vue-router";
import BaseLayout from "../layout/BaseLayout.vue";
import Home from "../pages/Home.vue";
import About from "../pages/About.vue";
import Login from "../pages/Login.vue";
import SignUp from "../pages/SignUp.vue";

const routes = [
  {
    path: "",
    component: BaseLayout,
    children: [
      { path: "", component: Home },
      { path: "/about", component: About },
      { path: "/login", component: Login },
      { path: "/signup", component: SignUp },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
