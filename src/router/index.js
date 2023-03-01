import { createRouter, createWebHistory } from "vue-router";
import store from "../store";

const routes = [
  {
    path: "/",
    name: "landingPage",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "home",
    component: () => import(/* webpackChunkName: "home" */ "../views/Home.vue"),
  },
  {
    path: "/stocks",
    name: "stocks",
    component: () =>
      import(/* webpackChunkName: "stocks" */ "../views/StocksView.vue"),
  },
  {
    path: "/portfolio",
    name: "portfolio",
    component: () =>
      import(/* webpackChunkName: "portfolio" */ "../views/Portfolio.vue"),
  },
  {
    path: "/register",
    name: "register",
    meta: {
      layout: "empty",
    },
    component: () =>
      import(/* webpackChunkName: "regiser" */ "../views/Register.vue"),
  },
  {
    path: "/login",
    name: "login",
    meta: {
      layout: "empty",
    },
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login.vue"),
  },
  {
    path: "/profile",
    name: "profile",
    component: () =>
      import(/* webpackChunkName: "profile" */ "../views/Profile.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  base: process.env.BASE_URL,
  routes,
});
router.beforeEach((to, from, next) => {
  if (
    to.name !== "login" &&
    to.name !== "register" &&
    !store.state.authStoreModule.authenticated
  ) {
    next("/login");
  } else next();
});

export default router;
