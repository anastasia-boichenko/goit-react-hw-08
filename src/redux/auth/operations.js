import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = "https://connections-api.goit.global";

const setAuthHeader = (token) => {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};

const cleatAuthHeader = () => {
  axios.defaults.headers.common.Authorization = "";
};

export const register = createAsyncThunk(
  "auth/register",
  async (credentials, thunkAPI) => {
    try {
      const { data } = await axios.post("/users/signup", credentials);
      setAuthHeader(data.token);
      toast.success("Registration is successful ", { duration: 3000 });
      return data;
    } catch (error) {
      toast.error("Something went wrong", { duration: 3000 });
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const logIn = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const { data } = await axios.post("/users/login", credentials);
      setAuthHeader(data.token);
      toast.success("Login is successful ", { duration: 3000 });
      return data;
    } catch (error) {
      toast.error("Please check your login info", { duration: 3000 });
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const logOut = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    await axios.post("/users/logout");
    cleatAuthHeader();
  } catch (error) {
    toast.error("Something went wrong", { duration: 3000 });
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const refresh = createAsyncThunk("auth/refresh", async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const persistedToken = state.auth.token;
  if (!persistedToken) return thunkAPI.rejectWithValue("Unable to fetch user");
  try {
    setAuthHeader(persistedToken);
    const { data } = await axios.get("/users/current");
    return data;
  } catch (error) {
    toast.error("Something went wrong", { duration: 3000 });
    return thunkAPI.rejectWithValue(error.message);
  }
});
