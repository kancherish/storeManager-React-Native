import { configureStore } from "@reduxjs/toolkit";
import { stockReducers } from "./stockSlice";

const store = configureStore({
    reducer:stockReducers
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
