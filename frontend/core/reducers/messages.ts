import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IMessage } from "../../shared/types";

const initialState: IMessage[] = [];

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<IMessage[]>) => {
      return action.payload;
    },
  },
});

export const { setMessages } = messagesSlice.actions;

export default messagesSlice.reducer;
