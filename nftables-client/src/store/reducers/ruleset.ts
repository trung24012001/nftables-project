import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { request, RuleTypeResponse } from "lib";
import { ChainType, RuleType, TableType } from "lib";

export interface IRuleState {
  tables: TableType[];
  chains: ChainType[];
  rules: RuleType[];
}

const initialState: IRuleState = {
  tables: [],
  chains: [],
  rules: [],
};

export const getTables = createAsyncThunk(
  "/getTables",
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
  "/getChains",
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
  "/getRuleset",
  async ({}: object, { rejectWithValue }) => {
    try {
      const res = await request.get("/rules");
      return res.data.ruleset.map((rule: RuleTypeResponse) => {
        return {
          ...rule,
          ip_src: rule.ip_src?.join(", "),
          ip_dst: rule.ip_dst?.join(", "),
          port_src: rule.port_src?.join(", "),
          port_dst: rule.port_dst?.join(", "),
          protocol: rule.protocol?.join(", "),
        };
      });
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
      state.tables = action.payload.tables;
    });
    builder.addCase(getChains.rejected, (state, action) => {
      console.log("get chains rejected!");
    });
    builder.addCase(getChains.fulfilled, (state, action) => {
      state.chains = action.payload.chains;
    });
    builder.addCase(getRuleset.rejected, (state, action) => {
      console.log("get rules rejected!");
    });
    builder.addCase(getRuleset.fulfilled, (state, action) => {
      console.log(action.payload);
      state.rules = action.payload;
    });
  },
});

// Action creators are generated for each case reducer function
export const {} = rulesetSlice.actions;

export default rulesetSlice.reducer;
