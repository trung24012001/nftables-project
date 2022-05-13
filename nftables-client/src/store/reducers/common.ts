import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MessageAlertType } from "lib";

export interface ICommonState {
  message: MessageAlertType | null;
}

const initialState: ICommonState = {
  message: null,
};

export const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setMessage: (
      state: ICommonState,
      action: PayloadAction<MessageAlertType | null>
    ) => {
      state.message = action.payload;
    },
  },
  extraReducers(builder) {},
});

// Action creators are generated for each case reducer function
export const { setMessage } = commonSlice.actions;

export default commonSlice.reducer;
