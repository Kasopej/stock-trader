import { shallowMount, createLocalVue } from "@vue/test-utils";
import Header from "@/components/Header.vue";
import { screen, fireEvent } from "@testing-library/vue";
import "@testing-library/jest-dom";
import VueRouter from "vue-router";

describe("Header.vue", () => {
  it("renders props.msg when passed", async (done) => {
    const localVue = createLocalVue();
    localVue.use(VueRouter);
    const router = new VueRouter({
      routes: [
        {
          path: "/",
          name: "landingPage",
        },
        {
          path: "/home",
          name: "home",
        },
        {
          path: "/stocks",
          name: "stocks",
        },
        {
          path: "/portfolio",
          name: "portfolio",
        },
        {
          path: "/register",
          name: "register",
        },
        {
          path: "/login",
          name: "login",
        },
        {
          path: "/profile",
          name: "profile",
        },
        {
          path: "/wallet",
          name: "wallet",
        },
      ],
    });

    const msg = "Kasope";
    const wrapper = shallowMount(Header, {
      attachTo: document.body,
      localVue,
      router,
    });
    const profileLink = screen.getByText("Kasope");
    await fireEvent.click(profileLink);
    expect(profileLink).toHaveClass("nav-link");
    expect(wrapper.text()).toMatch(msg);
    wrapper.vm.$destroy();
    done();
  });
});
