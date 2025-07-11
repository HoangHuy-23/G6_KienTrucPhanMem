import AdminAxiosClient from './axiosClient';

const addressApi = {
	getAddress: (userId) => {
		const url = `/addresses/user/${userId}`;
		return AdminAxiosClient.get(url);
	},
	// Thêm các phương thức mới cho địa chỉ
	updateAddress: async (userId, addressId, addressData) => {
		const url = `/addresses/${addressId}`;

		// Đảm bảo gửi đúng format
		const formattedData = {
			homeNumber: addressData.homeNumber,
			street: addressData.street,
			ward: addressData.ward,
			district: addressData.district,
			city: addressData.city,
		};

		console.log('Update address request:', {
			url,
			data: formattedData,
		});

		try {
			const response = await AdminAxiosClient.put(url, formattedData, {
				headers: {
					'Content-Type': 'application/json',
				},
			});
			return response;
		} catch (error) {
			console.error('Update address error:', error.response?.data);
			throw error;
		}
	},

	addAddress: async (addressData) => {
		const url = `/user/create-address`;
		return await AdminAxiosClient.post(url, addressData, {
			withCredentials: true,
		});
	},

	getMyAddress: async () => {
		return AdminAxiosClient.get('user/get-my-address');
	},
};

export default addressApi;
