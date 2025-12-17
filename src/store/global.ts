import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GlobalState {
  access_token?: string;
}

const initialState: GlobalState = {
  access_token: "",
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.access_token = action.payload;
    },
    removeAccessToken: (state) => {
      state.access_token = "";
    },
  },
});

export const { setAccessToken, removeAccessToken } = globalSlice.actions;

const globalReducer = globalSlice.reducer;
export default globalReducer;
