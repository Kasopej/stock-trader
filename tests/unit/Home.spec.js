import { createLocalVue, mount } from "@vue/test-utils";
import Home from "@/views/Home.vue";
import { screen } from "@testing-library/vue";
import VueRouter from "vue-router";

console.log(createLocalVue, mount, Home, screen, VueRouter);
describe("App is a the root vue instance", () => {
  it("receives information about the user authentication from state", function () {});
});