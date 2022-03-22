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
    //register new user for authentication
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
        const authData = res.data;
        authData.expiresIn = authData.expiresIn * 1000 + new Date().valueOf();
        commit("storeAuthData", authData);
        commit("storeEmail", payload.email);
        dispatch("createNewUserAccount", payload);
      });
  },
  attemptLogin({ commit, dispatch }, payload) {
    //authenticate existing user
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
    //persist details needed to identify & authenticate user on app load
    localStorage.setItem("email", rootState.email);
    const { refreshToken, expiresIn, idToken } = rootState.authStoreModule;
    localStorage.setItem(
      "data",
      JSON.stringify({ refreshToken, expiresIn, idToken })
    );
    dispatch("scheduleAuthRefresh"); //action to schedule the action that will refresh idToken from authentication server. This is done in a number of places hence it is in its own function
  },
  scheduleAuthRefresh({ dispatch, state }) {
    setTimeout(function () {
      dispatch("refreshAuth");
    }, state.expiresIn - new Date().valueOf()); //schedule action that refreshes token just before token expires
  },
  refreshAuth({ dispatch, commit, state }) {
    //this is the action that refreshes token just before token expires
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
        throw error;
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
    //login user on app start by identifying user & checking validity of token
    try {
      const email = localStorage.getItem("email");
      const authData = JSON.parse(localStorage.getItem("data"));
      if (authData.expiresIn < new Date().valueOf() || !email) {
        throw new Error("Authentication has expired"); //throw if token is expired
      }
      //only runs if token is valid
      commit("storeEmail", email);
      commit("storeAuthData", authData);
      dispatch("fetchUserAccount");
      dispatch("persistAuthData");
    } catch (error) {
      //if expired logout...log error details
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
