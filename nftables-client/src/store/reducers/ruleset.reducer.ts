import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { request } from "lib";
import { ChainType, RuleType, TableType } from "lib/type";

export interface RuleState {
  tables: TableType[];
  chains: ChainType[];
  rules: RuleType[];
}

const initialState: RuleState = {
  tables: [],
  chains: [],
  rules: [],
};

export const getTables = createAsyncThunk(
  "/tables",
  async ({}: object, { rejectWithValue }) => {
    try {
      const res = await request.get("/tables");
      return res.data;
    } catch (err) {
      console.log(err);
      rejectWithValue(err);
    }
  }
);

export const getChains = createAsyncThunk(
  "/chains",
  async ({}: object, { rejectWithValue }) => {
    try {
      const res = await request.get("/chains");
      return res.data;
    } catch (err) {
      console.log(err);
      rejectWithValue(err);
    }
  }
);

export const getRuleset = createAsyncThunk(
  "/product/getProductsInCate",
  async (obj: { cateId: number }, { rejectWithValue }) => {
    try {
      const res = await request.get("/ruleset");
      return res.data;
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
    builder.addCase(getTables.rejected, (state, action) => {
      console.log("get tables rejected!");
    });
    builder.addCase(getTables.fulfilled, (state, action) => {
      console.log(action.payload);
      state.tables = action.payload.tables;
    });
    builder.addCase(getChains.rejected, (state, action) => {
      console.log("get chains rejected!");
    });
    builder.addCase(getChains.fulfilled, (state, action) => {
      console.log(action.payload);
      state.chains = action.payload.chains;
    });
  },
});

// Action creators are generated for each case reducer function
export const {} = rulesetSlice.actions;

export default rulesetSlice.reducer;
