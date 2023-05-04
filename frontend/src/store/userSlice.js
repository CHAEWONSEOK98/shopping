import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userDate: {
    id: '',
    email: '',
    name: '',
    role: 0,
    image: '',
  },
  isAuth: false,
  isLoading: false,
  error: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export default userSlice.reducer;
