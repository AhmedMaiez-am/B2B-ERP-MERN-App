import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
  } from '../Actions/Types';
  
  const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null,
  };
  export default function (state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case REGISTER_SUCCESS:
      case LOGIN_SUCCESS:
        localStorage.setItem('token', payload.token);
        localStorage.setItem('user', payload.user);
        return {
          ...state,
          ...payload,
          token: payload.token,
          isAuthenticated: true,
          loading: false,
          user: payload.user,
        };
      case USER_LOADED:
        // localStorage.setItem('token', payload.token);
        return {
          ...state,
          // ...payload,
          isAuthenticated: true,
          loading: false,
          user: payload,
        };
  
      case REGISTER_FAIL:
      case AUTH_ERROR:
      case LOGIN_FAIL:
      case LOGOUT:
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return {
          ...state,
          token: null,
          isAuthenticated: false,
          loading: false,
          user:null,
        };
  
      default:
        return state;
    }
  }