import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import userApi from '../../api/userApi';
import addressApi from '../../api/addressApi';
import orderApi from '../../api/orderApi';

export const fetchUser = createAsyncThunk(
	'user/fetchUser',
	async (_, { rejectWithValue }) => {
		try {
			const userResponse = await userApi.getMyProfile();

			if (userResponse.status !== 200) {
				return rejectWithValue(
					`Failed to fetch user info. Status: ${userResponse.status}`,
				);
			}

			return userResponse.data.result;
		} catch (error) {
			console.error('Error fetching user:', error);
			return rejectWithValue(error.message); // Trả lỗi chi tiết
		}
	},
);

export const fetchAddress = createAsyncThunk(
	'user/fetchAddress',
	async (_, { rejectWithValue }) => {
		try {
			const response = await addressApi.getMyAddress();

			if (response.status !== 200) {
				return rejectWithValue(
					`Failed to fetch address. Status: ${response.status}, Message: ${response.statusText}`,
				);
			}

			console.log('List Address: ', response);

			return response.data.result;
		} catch (error) {
			console.error('Error fetching address:', error);
			return rejectWithValue('Error fetching address');
		}
	},
);
export const updateAddress = createAsyncThunk(
	'user/updateAddress',
	async ({ userId, addressId, addressData }, { rejectWithValue }) => {
		try {
			const response = await addressApi.updateAddress(
				userId,
				addressId,
				addressData,
			);
			if (response.status !== 200) {
				return rejectWithValue('Failed to update address');
			}
			return response.data;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	},
);
export const addAddress = createAsyncThunk(
	'user/addAddress',
	async (addressData, { rejectWithValue }) => {
		try {
			const response = await addressApi.addAddress(addressData);
			if (response.status !== 201) {
				return rejectWithValue('Failed to add address');
			}

			return response.data.result;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	},
);

export const fetchOrderByUserId = createAsyncThunk(
	'user/fetchOrderByUserId',
	async (userId, { rejectWithValue }) => {
		try {
			const response = await orderApi.getOrdersByUserId(userId);
			if (response.status !== 200) {
				return rejectWithValue('Failed to fetch orders');
			}

			return response.data.data;
		} catch (error) {
			console.error('Failed to fetch orders:', error.message || error);
			return rejectWithValue('Failed to fetch orders');
		}
	},
);

export const updateUserInfo = createAsyncThunk(
	'user/updateUserInfo',
	async ({ userId, userData }, { rejectWithValue }) => {
		try {
			const response = await userApi.update(userId, userData);

			if (response.status !== 200) {
				console.error('Failed to update profile:', response);
				return rejectWithValue(
					`Failed to update profile. Status: ${response.status}`,
				);
			}

			if (response.data?.status === 503) {
				console.error('User Service is not available:', response);
				return rejectWithValue(
					'User Service is not available. Please try again later.',
				);
			}

			return response.data;
		} catch (error) {
			console.error('Failed to update profile:', error);
			return rejectWithValue(
				`Failed to update profile: ${error?.response?.data?.message || 'Lỗi từ máy chủ'}`,
			);
		}
	},
);

const userSlice = createSlice({
	name: 'user',
	initialState: {
		user: null,
		address: [],
		error: null,
		status: 'idle',
		orders: [],
	},
	reducers: {
		setUser: (state, action) => {
			state.user = action.payload;
		},
		userInitialState: () => {
			return {
				user: null,
				address: [],
				error: null,
				status: 'idle',
				orders: [],
			};
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchUser.fulfilled, (state, action) => {
				state.user = action.payload;
			})
			.addCase(fetchUser.rejected, (state, action) => {
				state.error = action.payload;
			})
			.addCase(fetchAddress.fulfilled, (state, action) => {
				state.address = action.payload;
			})
			.addCase(fetchAddress.rejected, (state, action) => {
				state.error = action.payload;
			})
			.addCase(updateAddress.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(updateAddress.fulfilled, (state, action) => {
				state.status = 'succeeded';
				// Cập nhật địa chỉ trong mảng
				const updatedAddress = action.payload;
				state.address = state.address.map((addr) =>
					addr.id === updatedAddress.id ? updatedAddress : addr,
				);
			})
			.addCase(updateAddress.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload;
			})
			.addCase(addAddress.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(addAddress.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.address.push(action.payload);
			})
			.addCase(addAddress.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload;
			})
			.addCase(fetchOrderByUserId.fulfilled, (state, action) => {
				state.orders = action.payload;
			})
			.addCase(fetchOrderByUserId.rejected, (state, action) => {
				state.error = action.payload;
			})
			.addCase(updateUserInfo.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(updateUserInfo.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.user = action.payload;
			})
			.addCase(updateUserInfo.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload;
			});
	},
});

export const { setUser, userInitialState } = userSlice.actions;
export const userInfoReducer = userSlice.reducer;
