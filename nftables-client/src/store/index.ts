import { configureStore } from "@reduxjs/toolkit";
import rulesetReducer from "./reducers/ruleset";
import commonReducer from "./reducers/common";

export const store = configureStore({
  reducer: {
    ruleset: rulesetReducer,
    common: commonReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
