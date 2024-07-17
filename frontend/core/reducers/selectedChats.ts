import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IChatClient } from "../../shared/types";

const initialState: IChatClient[] = [];

const selectedChatsSlice = createSlice({
  name: "selectedChats",
  initialState,
  reducers: {
    addToSelectedChats: (state, action: PayloadAction<IChatClient>) => {
      state.push(action.payload);
    },
    removeFromSelectedChats: (state, action: PayloadAction<IChatClient>) => {
      return state.filter((chat) => chat.id !== action.payload.id);
    },
  },
});

export const { addToSelectedChats, removeFromSelectedChats } =
  selectedChatsSlice.actions;

export default selectedChatsSlice.reducer;
