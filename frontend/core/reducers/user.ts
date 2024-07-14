import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUserState } from "../../shared/types";

const initialState: IUserState = {
  general: {
    name: null,
    surname: null,
    dateOfBirth: null,
    email: null,
  },
  images: {
    backgroundURL: null,
    avatar: null,
  },
  socialContacts: {
    friends: [],
  },
  secret: {
    password: null,
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<IUserState>) => {
      const { general, secret, socialContacts, images } = state;
      general.email = action.payload.general.email;
      general.name = action.payload.general.name;
      general.surname = action.payload.general.surname;
      general.dateOfBirth = action.payload.general.dateOfBirth;

      socialContacts.friends = action.payload.socialContacts.friends;

      images.avatar = action.payload.images.avatar;
      images.backgroundURL = action.payload.images.backgroundURL;

      secret.password = action.payload.secret.password;
    },
    logoutUser: (state) => {
      const { general, secret, socialContacts, images } = state;
      general.email = null;
      general.name = null;
      general.surname = null;
      general.dateOfBirth = null;

      socialContacts.friends = [];

      images.avatar = null;
      images.backgroundURL = null;

      secret.password = null;
    },
  },
});

export const { loginUser, logoutUser } = userSlice.actions;

export default userSlice.reducer;
