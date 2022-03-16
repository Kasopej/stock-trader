import { axiosAuthInstance } from "../../services/network-services/axios-auth";

const state = {
  authenticated: false,
  idToken: "",
  expiresIn: 0,
  refreshToken: "",
};
const getters = {
  isAuthenticated(state) {
    return state.authenticated;
  },
};

const actions = {
  attemptUserRegistration({ commit, dispatch }, payload) {
    axiosAuthInstance
      .post("accounts:signUp?key=AIzaSyDHcX11Hra8hH42TUNKyHltC8B-lgaifzg", {
        email: payload.email,
        password: payload.password,
        returnSecureToken: true,
      })
      .catch((error) => {
        commit("throwError", { type: "registeration error", value: error });
      })
      .then((res) => {
        console.log(res);
        const authData = res.data;
        authData.expiresIn = authData.expiresIn * 1000 + new Date().valueOf();
        commit("storeAuthData", authData);
        commit("storeEmail", payload.email);
        dispatch("createNewUserAccount", payload);
      });
  },
  attemptLogin({ commit, dispatch }, payload) {
    axiosAuthInstance
      .post(
        "accounts:signInWithPassword?key=AIzaSyDHcX11Hra8hH42TUNKyHltC8B-lgaifzg",
        {
          email: payload.email,
          password: payload.password,
          returnSecureToken: true,
        }
      )
      .catch((error) => {
        commit("throwError", { type: "login error", value: error });
        throw error;
      })
      .then((res) => {
        const authData = res.data;
        authData.expiresIn = authData.expiresIn * 1000 + new Date().valueOf();
        commit("storeAuthData", authData);
        commit("storeEmail", payload.email);
        dispatch("fetchUserAccount");
        dispatch("persistAuthData");
      })
      .catch((err) => {
        console.log(err);
      });
  },
  persistAuthData({ rootState, dispatch }) {
    localStorage.setItem("email", rootState.email);
    const { refreshToken, expiresIn, idToken } = rootState.authStoreModule;
    localStorage.setItem(
      "data",
      JSON.stringify({ refreshToken, expiresIn, idToken })
    );
    dispatch("scheduleAuthRefresh");
  },
  scheduleAuthRefresh({ dispatch, state }) {
    setTimeout(function () {
      dispatch("refreshAuth");
    }, state.expiresIn - new Date().valueOf());
  },
  refreshAuth({ dispatch, commit, state }) {
    axiosAuthInstance
      .post(
        "",
        {
          grant_type: "refresh_token",
          refresh_token: state.refreshToken,
        },
        {
          baseURL:
            "https://securetoken.googleapis.com/v1/token?key=AIzaSyDHcX11Hra8hH42TUNKyHltC8B-lgaifzg",
          headers: { "Content-Type": "application/json" },
        }
      )
      .catch((error) => {
        commit("throwError", { type: "auth refresh error", value: error });
        commit("logout");
        throw error
      })
      .then((res) => {
        const data = res.data;
        commit("storeAuthData", {
          idToken: data.id_token,
          refreshToken: data.refresh_token,
          expiresIn: data.expires_in * 1000 + new Date().valueOf(),
        });
        commit("login");
        dispatch("persistAuthData");
      });
  },
  attemptLoginOnLoad({ commit, dispatch }) {
    try {
      const email = localStorage.getItem("email");
      const authData = JSON.parse(localStorage.getItem("data"));
      if (authData.expiresIn < new Date().valueOf() || !email) {
        throw new Error("Authentication has expired");
      }
      commit("storeEmail", email);
      commit("storeAuthData", authData);
      dispatch("fetchUserAccount");
      dispatch("persistAuthData");
    } catch (error) {
      console.log(error);
      dispatch("logout");
    }
  },
  logout({ commit }) {
    commit("logout");
    commit("clearAccount");
  },
};

const mutations = {
  storeAuthData(state, authData) {
    state.idToken = authData.idToken;
    state.expiresIn = authData.expiresIn;
    state.refreshToken = authData.refreshToken;
  },
  login(state) {
    state.authenticated = true;
  },
  logout(state) {
    for (const key in state) {
      state[key] = "";
    }
    localStorage.removeItem("data");
    localStorage.removeItem("email");
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};

/* eslint-disable no-unused-vars */
