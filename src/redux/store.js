import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/reducer";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";


const rootReducer = combineReducers({
    auth: authReducer,
});

const rootReducerConfig = {
    key: "authAndSideBar",
    storage,
    whitelist: [
        "auth"
    ],
};

const persistedReducer = persistReducer(rootReducerConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;
