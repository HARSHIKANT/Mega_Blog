import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";

const store = configureStore({
    reducer:{
        auth: authSlice,
        // TODO: add other slices here
        // e.g., post: postsSlice,
    }
});

export default store;