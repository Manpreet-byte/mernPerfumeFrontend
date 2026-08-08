import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import type { CartItem, Product } from '../types';

type CartState = {
  items: CartItem[];
  subtotal: number;
  total: number;
  loading: boolean;
  error: string | null;
};

type CartResponse = { items?: Array<{ product: Product; quantity: number }> } | Array<{ product: Product; quantity: number }> | null;

const mapCartResponse = (response: CartResponse): CartItem[] => {
  const items = Array.isArray(response) ? response : response?.items ?? [];
  return items
    .map((entry) => ({
      _id: entry.product._id,
      productId: entry.product._id,
      name: entry.product.name,
      brand: entry.product.brand,
      image: entry.product.images[0] ?? '',
      price: entry.product.discountPrice ?? entry.product.price,
      quantity: entry.quantity,
    }))
    .filter((item) => Boolean(item._id));
};

const recalculate = (state: CartState) => {
  state.subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  state.total = state.subtotal;
};

const initialState: CartState = {
  items: [],
  subtotal: 0,
  total: 0,
  loading: false,
  error: null,
};

export const fetchCart = createAsyncThunk<CartItem[]>('cart/fetchCart', async () => mapCartResponse((await api.get('/cart')).data));
export const addCartItem = createAsyncThunk<CartItem[], { product: Product; quantity?: number }>('cart/addCartItem', async ({ product, quantity = 1 }) => mapCartResponse((await api.post('/cart/add', { product: product._id, quantity })).data));
export const updateCartItem = createAsyncThunk<CartItem[], { id: string; quantity: number }>('cart/updateCartItem', async ({ id, quantity }) => mapCartResponse((await api.put(`/cart/update/${id}`, { quantity })).data));
export const removeCartItem = createAsyncThunk<CartItem[], string>('cart/removeCartItem', async (id) => mapCartResponse((await api.delete(`/cart/remove/${id}`)).data));

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<{ product: Product; quantity?: number }>) {
      const { product, quantity = 1 } = action.payload;
      const item = state.items.find((entry) => entry._id === product._id);
      if (item) item.quantity += quantity;
      else {
        state.items.push({
          _id: product._id,
          productId: product._id,
          name: product.name,
          brand: product.brand,
          image: product.images[0] ?? '',
          price: product.discountPrice ?? product.price,
          quantity,
        });
      }
      recalculate(state);
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item._id !== action.payload);
      recalculate(state);
    },
    updateQuantity(state, action: PayloadAction<{ id: string; quantity: number }>) {
      const item = state.items.find((entry) => entry._id === action.payload.id);
      if (!item) return;
      item.quantity = Math.max(1, action.payload.quantity);
      recalculate(state);
    },
    clearCart(state) {
      state.items = [];
      recalculate(state);
    },
    calculateSubtotal(state) {
      state.subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },
    calculateTotal(state) {
      state.total = state.subtotal;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
        recalculate(state);
      })
      .addCase(addCartItem.fulfilled, (state, action) => {
        state.items = action.payload;
        recalculate(state);
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.items = action.payload;
        recalculate(state);
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.items = action.payload;
        recalculate(state);
      });
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, calculateSubtotal, calculateTotal } = cartSlice.actions;
export default cartSlice.reducer;
