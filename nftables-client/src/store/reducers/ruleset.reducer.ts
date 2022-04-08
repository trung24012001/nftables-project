import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface RuleState {
  rules: any;
}

const initialState: RuleState = {
  rules: [],
};

export const getRuleset = createAsyncThunk(
  "/product/getProductsInCate",
  async (obj: { cateId: number }, { rejectWithValue }) => {
    try {
      // const res = await .get('/products/categories/' + obj.cateId);
      // return res.data;
    } catch (err) {
      console.log(err);
      rejectWithValue(err);
    }
  }
);

export const rulesetSlice = createSlice({
  name: "ruleset",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getRuleset.fulfilled, (state, action) => {});
  },
});

// Action creators are generated for each case reducer function
export const {} = rulesetSlice.actions;

export default rulesetSlice.reducer;
