import { configureStore } from "@reduxjs/toolkit";
import conversationListReducer from "./conversationReducer";
import userReducer from "./userReducer";

export const store = configureStore({
    reducer: {
        conversationList: conversationListReducer,
        user: userReducer
    }
})