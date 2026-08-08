import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice';
import productReducer from './slices/productSlice';

const createNoopStorage = () => ({
	getItem: async () => null,
	setItem: async (_key: string, value: string) => value,
	removeItem: async () => undefined,
});

const createWebStorage = () => ({
	getItem: async (key: string) => (typeof window === 'undefined' ? null : window.localStorage.getItem(key)),
	setItem: async (key: string, value: string) => {
		if (typeof window !== 'undefined') window.localStorage.setItem(key, value);
		return value;
	},
	removeItem: async (key: string) => {
		if (typeof window !== 'undefined') window.localStorage.removeItem(key);
	},
});

const storage = typeof window === 'undefined' ? createNoopStorage() : createWebStorage();

const rootReducer = combineReducers({
	auth: authReducer,
	cart: cartReducer,
	wishlist: wishlistReducer,
	products: productReducer,
});

const persistConfig = {
	key: 'aurelia-store',
	storage,
	whitelist: ['auth', 'cart', 'wishlist'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

