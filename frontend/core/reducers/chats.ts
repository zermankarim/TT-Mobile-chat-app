import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IChat } from "../../shared/types";

const initialState: IChat[] = [];

const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    setChats: (state, action: PayloadAction<IChat[]>) => {
      state.splice(0, state.length, ...action.payload);
    },
  },
});

export const { setChats } = chatsSlice.actions;

export default chatsSlice.reducer;
