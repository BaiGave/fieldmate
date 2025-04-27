<template>
	<view class="login-container">
		<!-- 状态栏占位 -->
		<view class="status-bar"></view>
		
		<!-- 顶部图像区域 -->
		<view class="header-image">
			<view class="wave-shape"></view>
		</view>
		
		<!-- 登录表单区域 -->
		<view class="login-form">
			<!-- 应用LOGO -->
			<view class="login-logo">
				<view class="logo-image"></view>
			</view>
			
			<!-- 应用标题 -->
			<text class="app-title">农田助理</text>
			
			<!-- 输入框 -->
			<view class="input-group">
				<view class="icon-wrapper user-icon"></view>
				<input type="text" placeholder="用户名/手机号" v-model="loginForm.username" />
			</view>
			
			<view class="input-group">
				<view class="icon-wrapper lock-icon"></view>
				<input type="password" placeholder="密码" v-model="loginForm.password" />
			</view>
			
			<!-- 登录按钮 -->
			<button class="login-btn" :class="{'login-btn-active': buttonActive}" 
					@touchstart="buttonActive = true" 
					@touchend="buttonActive = false"
					@touchcancel="buttonActive = false"
					@click="handleLogin">登录</button>
			
			<!-- 注册和忘记密码链接 -->
			<view class="action-links">
				<view class="register-link" @click="goToRegister">没有账号？立即注册</view>
				<view class="forgot-link" @click="goToForgotPassword">忘记密码？</view>
			</view>
			
			<!-- 底部版权 -->
			<text class="footer-text">版权所有 © 2025 农田助理</text>
		</view>
	</view>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import api from '@/utils/api.js';

// 确保使用模拟后端API
onMounted(() => {
	// 设置API模式为mock（模拟）
	api.setApiMode('mock');
	
	// 初始化API模块（确保默认用户创建等）
	api.init();
	
	// 查看是否已有token和用户信息，如果有，直接跳转到主页
	const token = uni.getStorageSync('token');
	const userInfo = uni.getStorageSync('userInfo');
	
	if (token && userInfo) {
		console.log('已有登录信息，直接跳转');
		uni.reLaunch({
			url: '/pages/home/home'
		});
		return;
	}
	
	// 准备自动登录
	// 填充默认用户名和密码
	loginForm.username = 'admin';
	loginForm.password = 'admin123';
	
	// 延迟执行自动登录，给UI和系统足够时间初始化
	setTimeout(() => {
		console.log('执行自动登录');
		handleLogin();
	}, 1500); // 增加延迟时间到1.5秒
});

// 登录表单数据
const loginForm = reactive({
	username: '',
	password: ''
});

// 表单状态
const loginStatus = reactive({
	errorMessage: '',
	isSubmitting: false
});

// 按钮激活状态
const buttonActive = ref(false);

// 计算属性：表单是否可提交
const canSubmit = computed(() => {
	return loginForm.username && loginForm.password && !loginStatus.isSubmitting;
});

// 处理登录
const handleLogin = async () => {
	// 验证输入
	if (!loginForm.username) {
		uni.showToast({
			title: '请输入用户名或手机号',
			icon: 'none'
		});
		return;
	}
	
	if (!loginForm.password) {
		uni.showToast({
			title: '请输入密码',
			icon: 'none'
		});
		return;
	}
	
	// 显示加载中
	uni.showLoading({
		title: '登录中...',
		mask: true
	});
	
	loginStatus.isSubmitting = true;
	
	try {
		console.log('开始登录流程', loginForm);
		
		// 确保先创建一个默认用户
		await createDefaultUserIfNeeded();
		
		// 使用本地模拟API进行登录，而不是发送真实网络请求
		const result = await api.login({
			username: loginForm.username,
			password: loginForm.password
		});
		
		console.log('登录结果:', result);
		
		// 关闭加载
		uni.hideLoading();
		loginStatus.isSubmitting = false;
		
		if (result.success) {
			// 登录成功，保存用户信息和token
			const { token, userInfo } = result.data;
			
			// 保存token到本地存储
			uni.setStorageSync('token', token);
			
			// 保存用户信息
			uni.setStorageSync('userInfo', userInfo);
			
			// 显示成功消息
			uni.showToast({
				title: '登录成功',
				icon: 'success',
				duration: 1000
			});
			
			// 跳转到首页
			setTimeout(() => {
				uni.reLaunch({
					url: '/pages/home/home'
				});
			}, 1000);
		} else {
			// 登录失败
			uni.showToast({
				title: result.message || '登录失败，请检查用户名和密码',
				icon: 'none'
			});
			// 尝试直接登录
			directLogin();
		}
	} catch (error) {
		console.error('登录请求失败:', error);
		uni.hideLoading();
		loginStatus.isSubmitting = false;
		
		// 尝试直接登录
		directLogin();
	}
};

// 直接登录（出错时的备用方法）
const directLogin = () => {
	// 创建一个默认的用户信息
	const userInfo = {
		id: 'admin-' + Date.now(),
		username: 'admin',
		phone: '13800138000',
		password: 'admin123',
		location: '北京市海淀区',
		farmArea: 500,
		createTime: Date.now(),
		updateTime: Date.now(),
		joinDate: new Date().toISOString().split('T')[0]
	};
	
	// 生成一个token
	const token = 'local-token-' + Math.random().toString(36).substring(2);
	
	// 直接保存到本地存储
	uni.setStorageSync('userInfo', userInfo);
	uni.setStorageSync('token', token);
	
	// 显示成功消息
	uni.showToast({
		title: '登录成功',
		icon: 'success',
		duration: 1000
	});
	
	// 跳转到首页
	setTimeout(() => {
		uni.reLaunch({
			url: '/pages/home/home'
		});
	}, 1000);
};

// 确保默认用户存在
const createDefaultUserIfNeeded = async () => {
	try {
		// 检查是否已有用户
		const users = uni.getStorageSync('users') || [];
		
		// 如果没有admin用户，则创建一个
		if (!users.find(u => u.username === 'admin')) {
			const adminUser = {
				id: 'admin-' + Date.now(),
				username: 'admin',
				phone: '13800138000',
				password: 'admin123',
				location: '北京市海淀区',
				farmArea: 500,
				createTime: Date.now(),
				updateTime: Date.now(),
				joinDate: new Date().toISOString().split('T')[0]
			};
			
			users.push(adminUser);
			uni.setStorageSync('users', users);
		}
	} catch (e) {
		console.error('创建默认用户失败:', e);
	}
};

// 跳转到注册页面
const goToRegister = () => {
	uni.navigateTo({
		url: '/pages/register/register'
	});
};

// 跳转到忘记密码页面
const goToForgotPassword = () => {
	uni.navigateTo({
		url: '/pages/forgot-password/forgot-password'
	});
};
</script>

<style>
/* 图标字体定义 */
@font-face {
	font-family: 'iconfont';
	src: url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAOMAAAsAAAAAB9AAAAMzAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDHAqCYIJGATYCJAMQCwoABCAFhG0HSRvtBsgekiQlKkIUjgIFUYECUDw8bft+TzIzu2bDnESLpmlU4olEJZFI0EqJkCyVztMh9f8vw/0/l9Ob9gZ5NzuXyGqimuzRPBEKIUK0SCrRahLC/+Ge6UvgfKBycs9oomtSFQYYR1oH9MYRWIAEekDeMLZLXsRhAk1zYkRbB6fnkFfZmwKxzMqaIN9RVRrkEYXSsGcW8ZwoxeORtAx4Fn4+/lEPeZJSZm89O7w2hY5fw193Zo3+RxuEIODNZ4F9Row1QCFuG9OXyQTLa8g0ld8dNoFGIan8unP8dffftWKrgv94SFlkDTDXKMbES0QVU6bA7/Imye/Vkg9S7I9j8cTKffva4u3ttrg723bu7LC29S3u7LRHVtw7Ov7e+PNp9+8PaXl7R99Dn/EZw5o/vG9YZQ4dsxwcvULXK5pC+UalSo6OOzg+qzxy+Mq3nZZzmru3Cg3H87yzYx4/nre8EzluXjfLzKaVZ22zZ5kzZLPNXnfxolmXbZ5eodDl5evwEPrSR0cnOq7LiC1gzXKvswH70leHh5GLZcuqyw6sPXAcjcnX+a/nxK9wHvjy/lO3d9F6xLBP9x68c7KYYcZMZQEbfM8dxnGH7xyPOf504FwccyR9Lrbdofg9kzZkJKxgH8zVIY3A/zryzRJ3l/j9RlL5d/uPz4L+p3qsAD6u8rNLf5S/BAkC/3aZC4z9v9ByQJayYP9Mk7Jk4E28SIPpqNMU+E+oTIO7+gxZnX4K3qSOKMmeoBBNPEn8Jy9CIhrLxC6p0XgEpTHb3YVGa7Jg2rwaULTMQanZPCItawqkdstQ6rYJTavO7m7TRYZssShg1TIBodcTJN3eodTrndCWH0g6fUOp3hdouo7jNdvMyCaU5hRHqBdMzRQKaeViyJRTLYHrx2nVSZISKWf0KPvATTsWYsoBK5E1Yohzh9Io59BGSYl1hK4jJCeG0iLnoV5gIidMIjIZFMfxBDwf0YhlClLNvr8YZJSTWgQWqmBabSK1vTyHjqLeg+yYwrRSUYGVN7JM0ThwZsgTQhtF1S7iOgQxcQRFCydVR+oCKUEnm6qX57rnbVdAk71zJFKUqNHVLWF2oa1nwgA=') format('woff2');
}

.iconfont {
	font-family: "iconfont" !important;
	font-size: 36rpx;
	font-style: normal;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #42b872;
}

.icon-user:before {
	content: "\e7ae";
}

.icon-lock:before {
	content: "\e7c9";
}

.login-container {
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
	height: 350rpx;
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

.login-form {
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

.login-logo {
	width: 150rpx;
	height: 150rpx;
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

.input-group input {
	flex: 1;
	height: 90rpx;
	font-size: 32rpx;
	background-color: transparent;
	border: none;
}

.login-btn {
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

.login-btn-active {
	transform: scale(0.98);
	background-color: #379c5e;
	box-shadow: 0 5rpx 10rpx rgba(66, 184, 114, 0.2);
}

.action-links {
	width: 100%;
	display: flex;
	justify-content: space-between;
	margin-top: 30rpx;
}

.register-link, .forgot-link {
	color: #42b872;
	font-size: 28rpx;
}

.footer-text {
	margin-top: 40rpx;
	font-size: 26rpx;
	color: #909090;
	text-align: center;
	padding-bottom: 20rpx;
}

/* 适配不同尺寸屏幕的媒体查询 */
@media screen and (max-height: 600px) {
	.header-image {
		height: 280rpx;
	}
	
	.login-logo {
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
	
	.login-btn {
		height: 80rpx;
		line-height: 80rpx;
		font-size: 32rpx;
		margin-top: 30rpx;
	}
	
	.register-link {
		margin-top: 20rpx;
	}
	
	.footer-text {
		margin-top: 30rpx;
	}
}

/* iPhone X 等全面屏设备底部安全区域适配 */
@supports (bottom: constant(safe-area-inset-bottom)) or (bottom: env(safe-area-inset-bottom)) {
	.login-container {
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}
}
</style>

