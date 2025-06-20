import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import orderApi from '../../api/orderApi';

export const createOrder = createAsyncThunk(
	'order/createOrder',
	async (orderRequest, { rejectWithValue }) => {
		try {
			const response = await orderApi.createOrder(orderRequest);

			if (response.status !== 200) {
				return rejectWithValue(
					`Failed to create order. Status: ${response.status}, Message: ${response.statusText}`,
				);
			}

			console.log('Order created successfully:', response);

			return response?.data;
		} catch (error) {
			console.error('Error creating order:', error);
			return rejectWithValue('Error creating order');
		}
	},
);

export const fetchOrderByUserId = createAsyncThunk(
	'order/fetchOrderByUserId',
	async (userId, { rejectWithValue }) => {
		try {
			const response = await orderApi.getOrdersByUserId(userId);

			if (response.status !== 200) {
				return rejectWithValue(
					`Failed to fetch order. Status: ${response.status}, Message: ${response.statusText}`,
				);
			}

			return response?.data?.data;
		} catch (error) {
			console.error('Error fetching order:', error);
			return rejectWithValue('Error fetching order');
		}
	},
);

export const fetchMyOrders = createAsyncThunk(
	'order/fetchMyOrders',
	async (_, { rejectWithValue }) => {
		try {
			const response = await orderApi.getMyOrders();

			if (response.status !== 200) {
				return rejectWithValue(
					`Failed to fetch order. Status: ${response.status}, Message: ${response.statusText}`,
				);
			}

			return response?.data;
		} catch (error) {
			console.error('Error fetching order:', error);
			return rejectWithValue('Error fetching order');
		}
	},
);

const orderSlice = createSlice({
	name: 'order',
	initialState: {
		orders: [],
		current: {},
		error: null,
	},
	reducers: {
		setOrder: (state, action) => {
			state.current = action.payload;
		},
		orderInitialState: () => {
			return {
				orders: [],
				error: null,
				current: {},
			};
		},
		setMyOrders: (state, action) => {
			state.orders = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(createOrder.pending, (state) => {
				state.error = null;
			})
			.addCase(createOrder.fulfilled, (state, action) => {
				state.orders.push(action.payload);
				state.current = action.payload;
			})
			.addCase(createOrder.rejected, (state, action) => {
				state.error = action.payload;
				state.current = {};
			})
			.addCase(fetchOrderByUserId.fulfilled, (state, action) => {
				state.orders = action.payload;
			})
			.addCase(fetchOrderByUserId.rejected, (state, action) => {
				state.error = action.payload;
			})
			.addCase(fetchMyOrders.fulfilled, (state, action) => {
				state.orders = action.payload;
			})
			.addCase(fetchMyOrders.rejected, (state, action) => {
				state.error = action.payload;
			});
	},
});

export const { setOrder, orderInitialState } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;
