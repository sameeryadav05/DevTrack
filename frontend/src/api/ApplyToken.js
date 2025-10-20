// src/utils/applyTokenToAxios.js
import API from "./Axios";
import AuthStore from "../store/AuthStore";

export const applyTokenToAxios = () => {
  const token = AuthStore.getState().token;
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } 
  else {
    delete API.defaults.headers.common["Authorization"];
  }
};
