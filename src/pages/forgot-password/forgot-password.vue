<template>
	<view class="forgot-password-container">
		<!-- 状态栏占位 -->
		<view class="status-bar"></view>
		
		<!-- 顶部图像区域 -->
		<view class="header-image">
			<view class="wave-shape"></view>
		</view>
		
		<!-- 重置密码表单区域 -->
		<view class="reset-form">
			<!-- 应用LOGO -->
			<view class="reset-logo">
				<view class="logo-image"></view>
			</view>
			
			<!-- 应用标题 -->
			<text class="app-title">重置密码</text>
			
			<!-- 输入框 -->
			<view class="input-group">
				<view class="icon-wrapper user-icon"></view>
				<input type="number" placeholder="请输入手机号" v-model="resetForm.phone" maxlength="11" />
			</view>
			
			<view class="input-group verify-code-group">
				<view class="icon-wrapper verify-icon"></view>
				<input type="number" placeholder="请输入验证码" v-model="resetForm.verificationCode" maxlength="6" />
				<button 
					class="send-code-btn" 
					:disabled="!isPhoneValid || formStatus.codeSent || countdown > 0" 
					@click="sendVerificationCode">
					{{ verificationButtonText }}
				</button>
			</view>
			
			<view class="input-group">
				<view class="icon-wrapper lock-icon"></view>
				<input type="password" placeholder="请设置新密码" v-model="resetForm.newPassword" />
			</view>
			
			<view class="input-group">
				<view class="icon-wrapper lock-icon"></view>
				<input type="password" placeholder="请确认新密码" v-model="resetForm.confirmPassword" />
			</view>
			
			<!-- 重置按钮 -->
			<button class="reset-btn" :class="{'reset-btn-active': canSubmit}" 
					@touchstart="handleTouchStart" 
					@touchend="handleTouchEnd"
					@touchcancel="handleTouchEnd"
					@click="resetPassword"
					:disabled="formStatus.submitting">重置密码</button>
			
			<!-- 返回登录 -->
			<view class="back-to-login" @click="goBackToLogin">返回登录</view>
		</view>
	</view>
</template>

<script setup>
import { ref, reactive, computed, onUnmounted } from 'vue';

// 表单数据
const resetForm = reactive({
	phone: '',
	verificationCode: '',
	newPassword: '',
	confirmPassword: ''
});

// 表单状态
const formStatus = reactive({
	submitting: false,
	errorMsg: '',
	codeSent: false,
	countdown: 0
});

// 按钮点击状态
const canSubmit = ref(false);

// 倒计时计时器
const countdownTimer = ref(null);

// 验证码按钮文本
const verificationButtonText = computed(() => {
	return formStatus.countdown > 0 
		? `${formStatus.countdown}秒后重发` 
		: '获取验证码';
});

// 手机号验证
const isPhoneValid = computed(() => {
	const phoneRegex = /^1[3-9]\d{9}$/;
	return phoneRegex.test(resetForm.phone);
});

// 表单是否可提交
const isFormValid = computed(() => {
	return resetForm.phone && 
		   resetForm.verificationCode && 
		   resetForm.newPassword && 
		   resetForm.confirmPassword &&
		   resetForm.newPassword === resetForm.confirmPassword &&
		   !formStatus.submitting;
});

// 处理触摸开始
const handleTouchStart = () => {
	canSubmit.value = true;
};

// 处理触摸结束
const handleTouchEnd = () => {
	canSubmit.value = false;
};

// 发送验证码
const sendVerificationCode = async () => {
	if (!resetForm.phone) {
		uni.showToast({
			title: '请输入手机号',
			icon: 'none'
		});
		return;
	}
	
	if (!isPhoneValid.value) {
		uni.showToast({
			title: '手机号格式不正确',
			icon: 'none'
		});
		return;
	}
	
	// 显示加载状态
	uni.showLoading({
		title: '发送中...'
	});
	
	try {
		// 调用发送验证码API
		const response = await fetch('https://gwyixuidazse.sealosbja.site/auth/send-verification-code', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				phone: resetForm.phone
			})
		});
		
		const result = await response.json();
		
		// 关闭加载
		uni.hideLoading();
		
		if (result.success) {
			// 验证码发送成功
			formStatus.codeSent = true;
			
			// 开始倒计时
			formStatus.countdown = 60;
			countdownTimer.value = setInterval(() => {
				formStatus.countdown--;
				if (formStatus.countdown <= 0) {
					clearInterval(countdownTimer.value);
					formStatus.codeSent = false;
				}
			}, 1000);
			
			uni.showToast({
				title: '验证码已发送',
				icon: 'success'
			});
		} else {
			// 发送失败
			uni.showToast({
				title: result.message || '验证码发送失败，请稍后重试',
				icon: 'none'
			});
		}
	} catch (error) {
		console.error('验证码发送请求失败:', error);
		uni.hideLoading();
		
		uni.showToast({
			title: '验证码发送失败，请检查网络连接',
			icon: 'none'
		});
	}
};

// 重置密码
const resetPassword = async () => {
	// 表单验证
	if (!resetForm.phone) {
		uni.showToast({
			title: '请输入手机号',
			icon: 'none'
		});
		return;
	}
	
	if (!isPhoneValid.value) {
		uni.showToast({
			title: '手机号格式不正确',
			icon: 'none'
		});
		return;
	}
	
	if (!resetForm.verificationCode) {
		uni.showToast({
			title: '请输入验证码',
			icon: 'none'
		});
		return;
	}
	
	if (!resetForm.newPassword) {
		uni.showToast({
			title: '请设置新密码',
			icon: 'none'
		});
		return;
	}
	
	if (resetForm.newPassword !== resetForm.confirmPassword) {
		uni.showToast({
			title: '两次输入的密码不一致',
			icon: 'none'
		});
		return;
	}
	
	// 显示加载状态
	uni.showLoading({
		title: '重置中...'
	});
	
	formStatus.submitting = true;
	
	try {
		// 调用重置密码API
		const response = await fetch('https://gwyixuidazse.sealosbja.site/auth/reset-password', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				phone: resetForm.phone,
				code: resetForm.verificationCode,
				password: resetForm.newPassword
			})
		});
		
		const result = await response.json();
		
		// 关闭加载
		uni.hideLoading();
		formStatus.submitting = false;
		
		if (result.success) {
			// 重置成功
			uni.showToast({
				title: '密码重置成功',
				icon: 'success',
				duration: 2000
			});
			
			// 重置成功后返回登录页面
			setTimeout(() => {
				goBackToLogin();
			}, 2000);
		} else {
			// 重置失败
			uni.showToast({
				title: result.message || '密码重置失败，请检查验证码是否正确',
				icon: 'none'
			});
		}
	} catch (error) {
		console.error('密码重置请求失败:', error);
		uni.hideLoading();
		formStatus.submitting = false;
		
		uni.showToast({
			title: '密码重置失败，请检查网络连接',
			icon: 'none'
		});
	}
};

// 返回登录页
const goBackToLogin = () => {
	uni.navigateBack();
};

// 组件卸载时清除定时器
onUnmounted(() => {
	if (countdownTimer.value) {
		clearInterval(countdownTimer.value);
	}
});
</script>

<style>
.forgot-password-container {
	position: relative;
	min-height: 100vh;
	background-color: #f8f9fa;
}

/* 状态栏占位 */
.status-bar {
	height: var(--status-bar-height);
	width: 100%;
	background-color: #42b872;
}

.header-image {
	width: 100%;
	height: 300rpx;
	background-color: #42b872;
	position: relative;
}

.wave-shape {
	position: absolute;
	bottom: -2rpx;
	left: 0;
	width: 100%;
	height: 40rpx;
	background-color: #f8f9fa;
	border-radius: 100% 100% 0 0 / 100% 100% 0 0;
}

.reset-form {
	width: 85%;
	max-width: 650rpx;
	margin: -70rpx auto 0;
	padding: 50rpx 40rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	background-color: #ffffff;
	border-radius: 20rpx;
	box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.05);
	position: relative;
	z-index: 10;
}

.reset-logo {
	width: 140rpx;
	height: 140rpx;
	border-radius: 50%;
	background-color: white;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.1);
	border: 8rpx solid white;
	overflow: hidden;
	margin-top: -120rpx;
	margin-bottom: 30rpx;
}

.logo-image {
	width: 70%;
	height: 70%;
	background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%2342b872' d='M7.5 10c0-1.5.5-3.5 2-4.5 1.5-1 4-1.5 6.5-.5 2.5 1 3.5 3 3.5 4.5s-1.25 3.5-3 4.5c-1.75 1 2.5 1 1 4s-4 3 -6.5 3c-2.5 0-4-1.5-5-3s-.5-3.5 .5-5 1.5-2.5 1-3.5zM7 5c-1 0-2 .5-2.5 1.5S4 8 4 8c-1.5 2 -1.5 4 -1.5 5.5s.5 3 1.5 4c1 1.2 2 2 3 2 1.2-.2 2-1.5 2-2.5s-1-1.5-1.5-2.5-.5-2 0-3 .5-2 .5-3 .5-2 0-3 -1-1-1-1z'/%3E%3C/svg%3E") no-repeat center center;
	background-size: cover;
}

.app-title {
	font-size: 48rpx;
	font-weight: bold;
	color: #42b872;
	margin: 20rpx 0 40rpx;
	text-align: center;
}

.input-group {
	width: 100%;
	margin-bottom: 30rpx;
	position: relative;
	display: flex;
	align-items: center;
	border: 1px solid #e0e0e0;
	border-radius: 45rpx;
	background-color: white;
	padding: 0 30rpx;
	height: 90rpx;
	transition: all 0.3s;
}

.input-group:focus-within {
	border-color: #42b872;
	box-shadow: 0 0 0 3rpx rgba(66, 184, 114, 0.1);
}

.verify-code-group {
	position: relative;
}

.icon-wrapper {
	width: 44rpx;
	height: 44rpx;
	margin-right: 20rpx;
	background-position: center;
	background-repeat: no-repeat;
	background-size: contain;
}

.user-icon {
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0h24v24H0z'/%3E%3Cpath d='M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-4.987-3.744A7.966 7.966 0 0 0 12 20c1.97 0 3.773-.712 5.167-1.892A6.979 6.979 0 0 0 12.16 16a6.981 6.981 0 0 0-5.147 2.256zM5.616 16.82A8.975 8.975 0 0 1 12.16 14a8.972 8.972 0 0 1 6.362 2.634 8 8 0 1 0-12.906.187zM12 13a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' fill='%2342b872'/%3E%3C/svg%3E");
}

.lock-icon {
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0h24v24H0z'/%3E%3Cpath d='M19 10h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V11a1 1 0 0 1 1-1h1V9a7 7 0 1 1 14 0v1zm-2 0V9A5 5 0 0 0 7 9v1h10zm-6 4v4h2v-4h-2z' fill='%2342b872'/%3E%3C/svg%3E");
}

.verify-icon {
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0h24v24H0z'/%3E%3Cpath d='M4 15h2v5h12V4H6v5H4V3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6zm6-4V8l5 4-5 4v-3H2v-2h8z' fill='%2342b872'/%3E%3C/svg%3E");
}

.input-group input {
	flex: 1;
	height: 90rpx;
	font-size: 32rpx;
	background-color: transparent;
	border: none;
}

.send-code-btn {
	position: absolute;
	right: 10rpx;
	height: 70rpx;
	line-height: 70rpx;
	padding: 0 20rpx;
	font-size: 24rpx;
	color: #ffffff;
	background-color: #42b872;
	border: none;
	border-radius: 35rpx;
}

.send-code-btn[disabled] {
	background-color: #cccccc;
	color: #ffffff;
}

.reset-btn {
	width: 80%;
	height: 90rpx;
	line-height: 90rpx;
	background-color: #42b872;
	color: white;
	border: none;
	border-radius: 45rpx;
	font-size: 36rpx;
	font-weight: 500;
	margin-top: 40rpx;
	transition: all 0.2s;
	box-shadow: 0 10rpx 20rpx rgba(66, 184, 114, 0.2);
}

.reset-btn-active {
	transform: scale(0.98);
	background-color: #379c5e;
	box-shadow: 0 5rpx 10rpx rgba(66, 184, 114, 0.2);
}

.reset-btn[disabled] {
	opacity: 0.6;
	background-color: #a9a9a9;
	box-shadow: none;
}

.back-to-login {
	margin-top: 30rpx;
	color: #42b872;
	font-size: 28rpx;
}

/* 适配不同尺寸屏幕的媒体查询 */
@media screen and (max-height: 600px) {
	.header-image {
		height: 250rpx;
	}
	
	.reset-logo {
		width: 120rpx;
		height: 120rpx;
		margin-top: -100rpx;
	}
	
	.app-title {
		margin: 20rpx 0 30rpx;
		font-size: 42rpx;
	}
	
	.input-group {
		margin-bottom: 20rpx;
		height: 80rpx;
	}
	
	.input-group input {
		height: 80rpx;
	}
	
	.reset-btn {
		height: 80rpx;
		line-height: 80rpx;
		font-size: 32rpx;
		margin-top: 30rpx;
	}
	
	.back-to-login {
		margin-top: 20rpx;
	}
}

/* iPhone X 等全面屏设备底部安全区域适配 */
@supports (bottom: constant(safe-area-inset-bottom)) or (bottom: env(safe-area-inset-bottom)) {
	.forgot-password-container {
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}
}
</style> 