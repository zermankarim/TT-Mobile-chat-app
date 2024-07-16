import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IChat, IMessage } from "../../shared/types";

const initialState: IChat = {
  createdAt: "",
  messages: [],
  parcipients: [],
  createdBy: "",
};

const currentChatSlice = createSlice({
  name: "currentChat",
  initialState,
  reducers: {
    setCurrentChat: (state, action: PayloadAction<IChat>) => {
      const { createdAt, messages, parcipients } = action.payload;
      state.createdAt = createdAt;
      state.messages = messages;
      state.parcipients = parcipients;
    },
  },
});

export const { setCurrentChat } = currentChatSlice.actions;

export default currentChatSlice.reducer;
