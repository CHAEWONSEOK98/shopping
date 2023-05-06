import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axios';

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (body, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`/users/register`, body);

      return response.data;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.reponse.data || error.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (body, thunkAPI) => {
    // payload creator
    try {
      const response = await axiosInstance.post(`/users/login`, body);

      return response.data; // action payload
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.reponse.data || error.message);
    }
  }
);

export const authUser = createAsyncThunk(
  'user/authUser',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/users/auth`);

      return response.data;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.reponse.data || error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`/users/logout`);

      return response.data;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.reponse.data || error.message);
    }
  }
);
