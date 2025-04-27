<template>
	<view class="register-container">
		<!-- 状态栏占位 -->
		<view class="status-bar"></view>
		
		<!-- 顶部图像区域 -->
		<view class="header-image">
			<view class="wave-shape"></view>
		</view>
		
		<!-- 注册表单区域 -->
		<view class="register-form">
			<!-- 应用LOGO -->
			<view class="register-logo">
				<view class="logo-image"></view>
			</view>
			
			<!-- 应用标题 -->
			<text class="app-title">账号注册</text>
			
			<!-- 输入框 -->
			<view class="input-group">
				<view class="icon-wrapper user-icon"></view>
				<input type="text" placeholder="请输入用户名" v-model="registerForm.username" />
			</view>
			
			<view class="input-group">
				<view class="icon-wrapper user-icon"></view>
				<input type="number" placeholder="请输入手机号" v-model="registerForm.phone" maxlength="11" />
			</view>
			
			<view class="input-group verify-code-group">
				<view class="icon-wrapper verify-icon"></view>
				<input type="number" placeholder="请输入验证码" v-model="registerForm.verificationCode" maxlength="6" />
				<button 
					class="send-code-btn" 
					:disabled="formStatus.submitting || !isPhoneValid" 
					@click="sendVerificationCode">
					{{ codeButtonText }}
				</button>
			</view>
			
			<view class="input-group">
				<view class="icon-wrapper lock-icon"></view>
				<input type="password" placeholder="请设置密码" v-model="registerForm.password" />
			</view>
			
			<view class="input-group">
				<view class="icon-wrapper lock-icon"></view>
				<input type="password" placeholder="请确认密码" v-model="registerForm.confirmPassword" />
			</view>
			
			<view class="input-group">
				<view class="icon-wrapper location-icon"></view>
				<input type="text" placeholder="所在位置（可选）" v-model="registerForm.location" />
			</view>
			
			<view class="input-group">
				<view class="icon-wrapper farm-icon"></view>
				<input type="number" placeholder="农场面积（亩，可选）" v-model="registerForm.farmArea" />
			</view>
			
			<!-- 注册按钮 -->
			<button class="register-btn" :class="{'register-btn-active': buttonActive}" 
					@touchstart="buttonActive = true" 
					@touchend="buttonActive = false"
					@touchcancel="buttonActive = false"
					@click="handleRegister"
					:disabled="formStatus.submitting">注册</button>
			
			<!-- 返回登录 -->
			<view class="back-to-login" @click="goToLogin">已有账号？返回登录</view>
			
			<!-- 底部版权 -->
			<text class="footer-text">版权所有 © 2025 农田助理</text>
		</view>
	</view>
</template>

<script setup>
import { ref, reactive, computed, onUnmounted, onMounted } from 'vue';
import api from '@/utils/api.js';

// 确保使用真实后端API
onMounted(() => {
	// 设置API模式为real（真实后端）
	api.setApiMode('real');
});

// 注册表单数据
const registerForm = reactive({
	username: '',
	phone: '',
	verificationCode: '',
	password: '',
	confirmPassword: '',
	location: '',
	farmArea: ''
});

// 表单状态
const formStatus = reactive({
	submitting: false,
	errorMsg: '',
	codeSent: false,
	countdown: 0
});

// 按钮激活状态
const buttonActive = ref(false);

// 计算属性：验证码按钮文本
const codeButtonText = computed(() => {
	if (formStatus.countdown > 0) {
		return `${formStatus.countdown}秒后重新获取`;
	}
	return formStatus.codeSent ? '重新获取验证码' : '获取验证码';
});

// 计算属性：手机号格式是否有效
const isPhoneValid = computed(() => {
	const phonePattern = /^1[3-9]\d{9}$/;
	return phonePattern.test(registerForm.phone);
});

// 计算属性：表单是否可提交
const canSubmit = computed(() => {
	return registerForm.username && 
	       registerForm.phone && 
	       registerForm.verificationCode && 
	       registerForm.password &&
	       !formStatus.submitting;
});

// 验证码倒计时
let countdownTimer = null;

// 开始倒计时
const startCountdown = () => {
	if (countdownTimer) clearInterval(countdownTimer);
	
	countdownTimer = setInterval(() => {
		formStatus.countdown--;
		if (formStatus.countdown <= 0) {
			clearInterval(countdownTimer);
			formStatus.codeSent = false;
		}
	}, 1000);
};

// 处理注册
const handleRegister = async () => {
	// 表单验证
	if (!registerForm.username) {
		uni.showToast({
			title: '请输入用户名',
			icon: 'none'
		});
		return;
	}
	
	if (!registerForm.phone) {
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
	
	if (!registerForm.password) {
		uni.showToast({
			title: '请设置密码',
			icon: 'none'
		});
		return;
	}
	
	if (registerForm.password !== registerForm.confirmPassword) {
		uni.showToast({
			title: '两次输入的密码不一致',
			icon: 'none'
		});
		return;
	}
	
	// 显示加载状态
	uni.showLoading({
		title: '注册中...'
	});
	
	formStatus.submitting = true;
	
	try {
		// 调用注册API
		const result = await api.register({
			username: registerForm.username,
			phone: registerForm.phone,
			verificationCode: registerForm.verificationCode,
			password: registerForm.password,
			location: registerForm.location || '',
			farmArea: registerForm.farmArea || '0'
		});
		
		// 关闭加载
		uni.hideLoading();
		formStatus.submitting = false;
		
		if (result.success) {
			// 注册成功，保存用户信息和token
			const { token, userInfo } = result.data;
			
			// 保存token到本地存储
			uni.setStorageSync('token', token);
			
			// 保存用户信息
			uni.setStorageSync('userInfo', userInfo);
			
			// 显示成功消息
			uni.showToast({
				title: '注册成功',
				icon: 'success',
				duration: 2000
			});
			
			// 注册成功后跳转到首页
			setTimeout(() => {
				uni.reLaunch({
					url: '/pages/home/home'
				});
			}, 2000);
		} else {
			// 注册失败
			uni.showToast({
				title: result.message || '注册失败，请检查输入信息',
				icon: 'none'
			});
		}
	} catch (error) {
		console.error('注册请求失败:', error);
		uni.hideLoading();
		formStatus.submitting = false;
		
		uni.showToast({
			title: '注册失败，请检查网络连接',
			icon: 'none'
		});
	}
};

// 发送验证码
const sendVerificationCode = async () => {
	if (!registerForm.phone) {
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
	
	if (formStatus.countdown > 0) return;
	
	// 显示加载状态
	uni.showLoading({
		title: '发送中...'
	});
	
	try {
		// 调用发送验证码API
		const result = await api.sendVerificationCode({
			phone: registerForm.phone
		});
		
		// 关闭加载
		uni.hideLoading();
		
		if (result.success) {
			// 验证码发送成功
			formStatus.codeSent = true;
			
			// 开始倒计时
			formStatus.countdown = 60;
			startCountdown();
			
			uni.showToast({
				title: '验证码已发送',
				icon: 'success'
			});
			
			// 在真实环境中显示验证码（仅用于开发）
			if (result.data && result.data.code) {
				console.log('验证码（仅供测试）:', result.data.code);
			}
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

// 跳转到登录页
const goToLogin = () => {
	uni.navigateBack();
};

// 组件卸载时清除定时器
onUnmounted(() => {
	if (countdownTimer) {
		clearInterval(countdownTimer);
	}
});
</script>

<style>
.register-container {
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

.register-form {
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

.register-logo {
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

.location-icon {
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0h24v24H0z'/%3E%3Cpath d='M12 20.9l4.95-4.95a7 7 0 1 0-9.9 0L12 20.9zm0 2.828l-6.364-6.364a9 9 0 1 1 12.728 0L12 23.728zM12 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 2a4 4 0 1 1 0-8 4 4 0 0 1 0 8z' fill='%2342b872'/%3E%3C/svg%3E");
}

.farm-icon {
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0h24v24H0z'/%3E%3Cpath d='M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z' fill='%2342b872'/%3E%3C/svg%3E");
}

.input-group input {
	flex: 1;
	height: 90rpx;
	font-size: 32rpx;
	background-color: transparent;
	border: none;
}

.register-btn {
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

.register-btn-active {
	transform: scale(0.98);
	background-color: #379c5e;
	box-shadow: 0 5rpx 10rpx rgba(66, 184, 114, 0.2);
}

.register-btn[disabled] {
	opacity: 0.6;
	background-color: #a9a9a9;
	box-shadow: none;
}

.back-to-login {
	margin-top: 30rpx;
	color: #42b872;
	font-size: 28rpx;
}

.footer-text {
	margin-top: 40rpx;
	color: #999;
	font-size: 24rpx;
}

/* 适配不同尺寸屏幕的媒体查询 */
@media screen and (max-height: 600px) {
	.header-image {
		height: 250rpx;
	}
	
	.register-logo {
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
	
	.register-btn {
		height: 80rpx;
		line-height: 80rpx;
		font-size: 32rpx;
		margin-top: 30rpx;
	}
	
	.back-to-login {
		margin-top: 20rpx;
	}
	
	.footer-text {
		margin-top: 30rpx;
	}
}

/* iPhone X 等全面屏设备底部安全区域适配 */
@supports (bottom: constant(safe-area-inset-bottom)) or (bottom: env(safe-area-inset-bottom)) {
	.register-container {
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}
}

.verify-code-group {
	position: relative;
}

.verify-icon {
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0h24v24H0z'/%3E%3Cpath d='M4 15h2v5h12V4H6v5H4V3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6zm6-4V8l5 4-5 4v-3H2v-2h8z' fill='%2342b872'/%3E%3C/svg%3E");
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
</style> 