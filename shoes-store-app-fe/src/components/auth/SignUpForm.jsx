import { unwrapResult } from '@reduxjs/toolkit';
import { enqueueSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { register as registerAction } from '../../hooks/auth/authSlice';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { subYears } from 'date-fns';

function SignUpForm() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const todayMinus10Years = subYears(new Date(), 10);

	const SignUpSchema = yup.object().shape({
		firstName: yup.string().required('Tên đầu là bắt buộc'),
		lastName: yup.string().required('Tên cuối là bắt buộc'),
		email: yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
		password: yup
			.string()
			.min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
			.required('Mật khẩu là bắt buộc'),
		phone: yup
			.string()
			.matches(
				/^[0-9]{10}$/,
				'Số điện thoại hợp lệ phải có 10 chữ số: (vd: 0123456789)',
			)
			.required('Số điện thoại là bắt buộc'),
		dob: yup
			.date()
			.typeError('Ngày sinh không hợp lệ')
			.required('Ngày sinh là bắt buộc')
			.max(todayMinus10Years, 'Bạn phải từ 10 tuổi trở lên'),
		gender: yup
			.string()
			.oneOf(['MALE', 'FEMALE'], 'Giới tính không hợp lệ')
			.required('Giới tính là bắt buộc'),
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			firstName: '',
			lastName: '',
			email: '',
			password: '',
			phone: '',
			gender: 'FEMALE', // set mặc định nếu muốn
			dob: '',
		},
		resolver: yupResolver(SignUpSchema),
	});

	const onSubmit = async (data) => {
		try {
			const result = await dispatch(registerAction(data));
			const dataResult = unwrapResult(result);

			if (dataResult?.id) {
				enqueueSnackbar('Đăng ký thành công', { variant: 'success' });
				navigate('/login');
				return;
			}

			enqueueSnackbar(`Đăng ký thất bại!`, { variant: 'error' });
			return;
		} catch (error) {
			console.error('Failed to register:', error);
			enqueueSnackbar(
				`Đăng ký thất bại: ${error?.response?.data?.message || 'Lỗi từ máy chủ'}`,
				{ variant: 'error' },
			);
			return;
		}
	};

	return (
		<>
			<div className='flex justify-center pt-5'>
				<div className='bg-white rounded-2xl shadow-xl p-8 w-full max-w-xl'>
					<div className='flex justify-center'>
						<h1 className='font-bold text-xl justify-center'>Thêm Tài Khoản</h1>
					</div>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className='flex items-center pt-3'>
							<label htmlFor='firstName' className='ml-5 font-bold'>
								Tên đầu:
							</label>
							<div className='ml-8 mb-4 search-container w-3/5'>
								<input
									className='w-full boder no-border py-1 input-field'
									type='text'
									id='firstName'
									{...register('firstName')}
								/>
								{errors.firstName && (
									<p className='text-red-500 text-sm'>{errors.firstName.message}</p>
								)}
							</div>
						</div>
						<div className='flex items-center pt-3'>
							<label htmlFor='lastName' className='ml-5 font-bold'>
								Tên cuối:
							</label>
							<div className='ml-8 mb-4 search-container w-3/5'>
								<input
									className='w-full boder no-border py-1 input-field'
									type='text'
									id='lastName'
									{...register('lastName')}
								/>
								{errors.lastName && (
									<p className='text-red-500 text-sm'>{errors.lastName.message}</p>
								)}
							</div>
						</div>
						<div className='flex items-center pt-3'>
							<label htmlFor='email' className='ml-5 font-bold'>
								Email:
							</label>
							<div className='ml-8 mb-4 search-container w-3/5'>
								<input
									className='w-full boder no-border py-1 input-field'
									type='email'
									id='email'
									{...register('email')}
								/>
								{errors.email && (
									<p className='text-red-500 text-sm'>{errors.email.message}</p>
								)}
							</div>
						</div>
						<div className='flex items-center pt-3'>
							<label htmlFor='password' className='ml-5 font-bold'>
								Mật khẩu:
							</label>
							<div className='ml-8 mb-4 search-container w-3/5'>
								<input
									className='w-full boder no-border py-1 input-field'
									type='password'
									id='password'
									{...register('password')}
								/>
								{errors.password && (
									<p className='text-red-500 text-sm'>{errors.password.message}</p>
								)}
							</div>
						</div>
						<div className='flex items-center pt-3'>
							<label htmlFor='phone' className='ml-5 font-bold'>
								Số điện thoại:
							</label>
							<div className='ml-8 mb-4 search-container w-3/5'>
								<input
									className='w-full boder no-border py-1 input-field'
									type='text'
									id='phone'
									{...register('phone')}
								/>
								{errors.phone && (
									<p className='text-red-500 text-sm'>{errors.phone.message}</p>
								)}
							</div>
						</div>
						<div className='flex items-center pt-3'>
							<label htmlFor='dob' className='ml-5 font-bold'>
								Ngày sinh:
							</label>
							<div className='ml-8 mb-4 search-container w-3/5'>
								<input
									className='w-full boder no-border py-1 input-field'
									type='date'
									id='dob'
									{...register('dob')}
								/>
								{errors.dob && (
									<p className='text-red-500 text-sm'>{errors.dob.message}</p>
								)}
							</div>
						</div>
						<div className='flex items-center pt-3'>
							<label className='ml-5 font-bold'>Giới tính:</label>
							<div className='ml-8 mb-4 w-3/5'>
								<div className='flex items-center mb-4'>
									<input
										id='default-radio-1'
										type='radio'
										value='MALE'
										name='gender'
										className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 
										dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
										{...register('gender')}
									/>
									<label
										htmlFor='default-radio-1'
										className='ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'
									>
										Nam
									</label>
								</div>
								<div className='flex items-center'>
									<input
										id='default-radio-2'
										type='radio'
										value='FEMALE'
										name='gender'
										className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 
										dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
										{...register('gender')}
									/>
									<label
										htmlFor='default-radio-2'
										className='ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'
									>
										Nữ
									</label>
								</div>
								{errors.gender && (
									<p className='text-red-500 text-sm'>{errors.gender.message}</p>
								)}
							</div>
						</div>
						<div className='flex justify-center pt-3'>
							<button
								type='submit'
								className='px-4 py-2 bg-blue-500 text-white font-bold rounded'
							>
								Tạo Tài Khoản
							</button>
						</div>

						<div className='flex justify-center mt-4'>
							<p className='text-sm text-gray-600'>
								Bạn đã có tài khoản?{' '}
								<span
									className='text-blue-600 hover:underline cursor-pointer'
									onClick={() => navigate('/login')}
								>
									Đăng nhập
								</span>
							</p>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}

export default SignUpForm;
