import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUserState } from "../../shared/types";

const initialState: IUserState = {
  email: "Karim",
  password: "Zerman",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<IUserState>) => {
      state.email = action.payload.email;
      state.password = action.payload.password;
    },
    logoutUser: (state) => {
      state.email = null;
      state.password = null;
    },
  },
});

export const { loginUser, logoutUser } = userSlice.actions;

export default userSlice.reducer;
