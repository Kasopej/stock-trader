import { shallowMount, createLocalVue, mount } from "@vue/test-utils";
import Header from "@/components/Header.vue";
import Home from "@/views/Home.vue";
import { fireEvent, getByText, screen } from "@testing-library/vue";
import VueRouter from "vue-router";

let localVue, router;

describe("Header.vue is the component that contains header navigation links", () => {
  beforeAll(setupRouter);
  it("renders the navigation links base don the router object", async function () {
    const wrapper = mount(Header, {
      attachTo: document.body,
      localVue,
      router,
    });
    expect(screen.getByText(wrapper.vm.$data.name)).toHaveAttribute(
      "href",
      "#/profile"
    );
  });
});

function setupRouter() {
  localVue = createLocalVue();
  localVue.use(VueRouter);
  router = new VueRouter({
    base: process.env.BASE_URL,
    routes: [
      {
        path: "/",
        name: "landingPage",
        component: Home,
      },
      {
        path: "/home",
        name: "home",
        component: () =>
          import(/* webpackChunkName: "about" */ "../views/Home.vue"),
      },
      {
        path: "/stocks",
        name: "stocks",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "about" */ "../views/StocksView.vue"),
      },
      {
        path: "/portfolio",
        name: "portfolio",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "about" */ "../views/Portfolio.vue"),
      },
      {
        path: "/register",
        name: "register",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "about" */ "../views/Register.vue"),
      },
      {
        path: "/login",
        name: "login",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "about" */ "../views/Login.vue"),
      },
      {
        path: "/profile",
        name: "profile",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "about" */ "../views/Profile.vue"),
      },
      {
        path: "/wallet",
        name: "wallet",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "about" */ "../views/Wallet.vue"),
      },
    ],
  });
}
