import { yupResolver } from '@hookform/resolvers/yup';
import {
	Box,
	FormControlLabel,
	Radio,
	RadioGroup,
	Typography,
} from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import * as yup from 'yup';
import {
	cartInitializeState,
	clearCartFromSession,
} from '../../../hooks/cart/cartSlice';
import { createOrder, setOrder } from '../../../hooks/order/orderSlice';
import { setProgress } from '../../../hooks/orderProgressStore';
import { fetchAddress, fetchUser } from '../../../hooks/user/userSlice';
import PaymentDialog from './PaymentDialog';

const schema = yup.object().shape({
	paymentMethod: yup.string().required('Vui lòng chọn phương thức thanh toán'),
	addressId: yup.string().required('Vui lòng chọn địa chỉ'),
});

const Pay = () => {
	const dispatch = useDispatch();
	const navigation = useNavigate();
	const [isExpanded, setIsExpanded] = useState(false);
	const [paymentMethod, setPaymentMethod] = useState('CASH');

	const { cartItems } = useSelector((state) => state.cart);
	const { address } = useSelector((state) => state.userInfo);
	const [selectedAddress, setSelectedAddress] = useState('');
	const [showModal, setShowModal] = useState(false);
	const [vnpayUrl, setVnPayUrl] = useState('');
	const { user } = useSelector((state) => state.userInfo);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		dispatch(fetchUser());
	}, []);

	useEffect(() => {
		const fetchAddressData = async () => {
			try {
				const result = await dispatch(fetchAddress());
				const resultUnwrapped = unwrapResult(result);

				if (resultUnwrapped?.length > 0) {
					setSelectedAddress(resultUnwrapped[0]?.id);
				} else {
					navigation('/address');
					enqueueSnackbar('Vui lòng thêm địa chỉ giao hàng', {
						variant: 'info',
					});
				}
			} catch (error) {
				console.error('Error fetching address:', error);
			}
		};
		fetchAddressData();
	}, [dispatch, navigation]);

	const [isShow, setIsShow] = useState(false);
	useEffect(() => {
		if (cartItems?.length > 2) {
			setIsShow(true);
		}
	}, [cartItems.length]);

	const total = useMemo(() => {
		return cartItems.reduce(
			(acc, item) => acc + item?.productItem?.price * item?.quantity,
			0,
		);
	}, [cartItems]);

	const form = useForm({
		defaultValues: {
			paymentMethod: paymentMethod,
			totalPrice: total,
			orderDetails: cartItems?.map((item) => ({
				productItemId: item?.productItem?.id,
				quantity: item?.quantity,
				size: item?.cartDetailPK?.size,
			})),
			addressId: '',
		},
		resolver: yupResolver(schema),
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = form;

	useEffect(() => {
		if (selectedAddress) {
			reset((prev) => ({
				...prev,
				addressId: selectedAddress,
			}));
		}
	}, [selectedAddress, reset]);

	const onSubmit = async (data) => {
		if (
			user.phone === null ||
			user.phone === undefined ||
			user.phone.length === 0
		) {
			enqueueSnackbar('Vui lòng cập nhật số điện thoại trước khi đặt hàng', {
				variant: 'info',
			});
			navigation('/updateProfile');
			return;
		}
		try {
			setIsLoading(true);
			const orderResult = await dispatch(createOrder(data));
			const resultUnwrapped = unwrapResult(orderResult);
			if (resultUnwrapped?.id && resultUnwrapped?.paymentMethod === 'VNPAY') {
				setVnPayUrl(resultUnwrapped?.paymentUrl);
				setShowModal(true);
				dispatch(setOrder(resultUnwrapped));
				dispatch(clearCartFromSession());
				dispatch(cartInitializeState());
				return;
			}
			if (resultUnwrapped?.id && resultUnwrapped?.paymentMethod === 'CASH') {
				enqueueSnackbar('Đặt hàng thành công', { variant: 'success' });
				dispatch(clearCartFromSession());
				dispatch(cartInitializeState());
				navigation('/orderSuccess');
				dispatch(setProgress('Thực hiện đặt hàng'));
				return;
			}
			enqueueSnackbar(`Đặt hàng thất bại: ${resultUnwrapped}`, {
				variant: 'error',
			});
			return;
		} catch (error) {
			console.error('Error creating order:', error);
			enqueueSnackbar(`Đặt hàng thất bại!`, {
				variant: 'error',
			});
			return;
		} finally {
			setIsLoading(false);
		}
	};

	if (showModal) {
		return <PaymentDialog isOpen={showModal} url={vnpayUrl} />;
	}

	return (
		<div className='w-full flex justify-between'>
			<div id='left' className='w-1/2 px-5 pt-10 flex flex-col'>
				<img src='logo.png' alt='logo' className='h-20 w-20' />

				<div className='flex flex-row justify-between items-center py-2'>
					<strong className='ml-1 animate-bounce'>
						Sản phẩm đang trong giỏ hàng của nhiều người dùng. Đừng lo
						<span className='text-red-500 hover:cursor-pointer animate-bounce'>
							{' '}
							LEN DOM{' '}
						</span>
						đã giữ chỗ cho các bạn để không bị hết hàng khi thanh toán.
					</strong>
				</div>

				<Box component='form' onSubmit={handleSubmit(onSubmit)}>
					<div className='flex flex-col items-start py-1 w-full'>
						<Box>
							<Typography variant='subtitle1' fontWeight={'bold'}>
								Chọn phương thức thanh toán
							</Typography>
							<RadioGroup
								value={paymentMethod}
								onChange={(e) => setPaymentMethod(e.target.value)}
							>
								<FormControlLabel
									value='CASH'
									control={<Radio {...register('paymentMethod')} />}
									label='Thanh toán khi nhận hàng'
								/>
								<FormControlLabel
									value='VNPAY'
									control={<Radio {...register('paymentMethod')} />}
									label='Thanh toán qua VNPAY'
								/>
							</RadioGroup>
							{errors.paymentMethod && (
								<Typography color='error'>{errors?.paymentMethod?.message}</Typography>
							)}
						</Box>

						<Box>
							<Typography variant='subtitle1' fontWeight={'bold'}>
								Chọn địa chỉ giao hàng
							</Typography>
							<RadioGroup
								value={selectedAddress}
								onChange={(e) => setSelectedAddress(e.target.value)}
							>
								{address?.map((address) => (
									<FormControlLabel
										key={address?.id}
										value={address?.id}
										control={<Radio {...register('addressId')} />}
										label={
											address?.homeNumber +
											'/' +
											address?.ward +
											'/' +
											address?.district +
											'/' +
											address?.city
										}
									/>
								))}
							</RadioGroup>
							{errors.addressId && (
								<Typography color='error'>{errors?.addressId?.message}</Typography>
							)}
						</Box>

						<input
							type='submit'
							value={isLoading ? 'Đang xử lý đơn hàng...' : 'Hoàn tất đơn hàng'}
							className='h-10 bg-blue-400 rounded-lg text-white w-2/4 my-2'
						/>
					</div>
				</Box>
				<hr className='mt-10 mb-2 text-grey-300' />
			</div>
			<div
				id='right'
				className='w-1/2 pt-10 px-10 rounded-2xl shadow-lg bg-white/30 backdrop-blur-md border border-white/20'
			>
				<div
					id='items'
					className={`${isExpanded ? 'h-fit' : 'h-60'} overflow-y-scroll custom-scrollbar`}
				>
					{cartItems?.map((item) => (
						<div
							key={item?.productItem.id + item?.cartDetailPK.size}
							className='flex justify-between items-center p-2 border rounded-2xl my-1'
						>
							<div className='flex items-center '>
								<img
									src={item?.productItem?.images[0]}
									alt={item?.product?.name}
									className='h-20 w-20 rounded-lg mr-2'
								/>
								<div>
									<p>{item?.productItem?.product?.name}</p>
									<div className='flex'>
										<p className='text-stone-500'>{item?.productItem?.color?.name}</p>
										<p className='text-stone-500 ml-1'> {item?.cartDetailPK?.size}</p>
									</div>
								</div>
							</div>
							<div>
								<p>{item?.productItem?.price.toLocaleString()}đ</p>
								<p className='text-stone-500'>x{item?.quantity}</p>
							</div>
						</div>
					))}
				</div>
				{isShow && (
					<button
						onClick={() => setIsExpanded(!isExpanded)}
						className='mt-2 font-bold hover:text-stone-300  p-2 w-full'
					>
						{isExpanded ? 'Thu gọn' : 'Xem tất cả'}
					</button>
				)}
				<div className='border-1 my-3'></div>

				<div className='border-1 my-3'></div>
				<div className='flex justify-between px-5'>
					<p className='font-calibri text-base'>Tạm tính</p>
					<p>{total?.toLocaleString()}đ</p>
				</div>

				<div className='border-1 my-3'></div>
				<div className='flex justify-between items-center px-5'>
					<p className='font-bold text-xl'>Tổng cộng</p>
					<p className='font-bold text-xl'>{total?.toLocaleString()}đ</p>
				</div>
				<div className='flex items-center mt-2'>
					<div className='border-1 flex-grow'></div>

					<div className='border-1 flex-grow'></div>
				</div>
			</div>
		</div>
	);
};

export default Pay;
