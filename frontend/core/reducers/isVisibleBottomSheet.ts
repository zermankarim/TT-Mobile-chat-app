import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IChat } from "../../shared/types";

const initialState: boolean = false;

const isVisibleBottomSheetSlice = createSlice({
  name: "isVisibleBottomSheet",
  initialState,
  reducers: {
    setIsVisibleBottomSheet: (state, action: PayloadAction<boolean>) => {
      return (state = action.payload);
    },
  },
});

export const { setIsVisibleBottomSheet } = isVisibleBottomSheetSlice.actions;

export default isVisibleBottomSheetSlice.reducer;
