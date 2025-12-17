import type { User } from "@/types/auth";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  user?: User;
  isLoggedIn?: boolean;
  loading: boolean;
}

const initialState: UserState = {
  user: undefined,
  isLoggedIn: false,
  loading: true,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearUser: (state) => {
      state.user = undefined;
      state.isLoggedIn = false;
    },
  },
});

export const { setUser, clearUser, setIsLoggedIn, setLoading } =
  userSlice.actions;

const userReducer = userSlice.reducer;
export default userReducer;
