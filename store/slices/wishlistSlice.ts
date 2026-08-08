import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import type { Product } from '../types';

type WishlistState = {
  items: Product[];
  loading: boolean;
  error: string | null;
};

const initialState: WishlistState = { items: [], loading: false, error: null };

export const fetchWishlist = createAsyncThunk<Product[]>('wishlist/fetchWishlist', async () => (await api.get('/wishlist')).data ?? []);
export const addWishlistItem = createAsyncThunk<Product[], Product>('wishlist/addWishlistItem', async (product) => (await api.post('/wishlist/add', { product: product._id })).data ?? []);
export const removeWishlistItem = createAsyncThunk<Product[], string>('wishlist/removeWishlistItem', async (id) => (await api.delete(`/wishlist/remove/${id}`)).data ?? []);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist(state, action: PayloadAction<Product>) {
      if (state.items.some((item) => item._id === action.payload._id)) return;
      state.items.push(action.payload);
    },
    removeFromWishlist(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addWishlistItem.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(removeWishlistItem.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
