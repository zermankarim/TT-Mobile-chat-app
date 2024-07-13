import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IChat, IMessage } from "../../shared/types";

const initialState: IChat = {
  _id: "",
  createdAt: "",
  messages: [],
  senderEmail: "",
  recipientEmail: "",
  createdBy: "",
};

const currentChatSlice = createSlice({
  name: "currentChat",
  initialState,
  reducers: {
    setCurrentChat: (state, action: PayloadAction<IChat>) => {
      const { _id, createdAt, messages, senderEmail, recipientEmail } =
        action.payload;
      state._id = _id;
      state.createdAt = createdAt;
      state.messages = messages;
      state.senderEmail = senderEmail;
      state.recipientEmail = recipientEmail;
    },
  },
});

export const { setCurrentChat } = currentChatSlice.actions;

export default currentChatSlice.reducer;
