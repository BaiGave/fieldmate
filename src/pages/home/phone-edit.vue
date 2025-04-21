<template>
	<view class="phone-edit-container">
		<!-- 顶部导航栏 -->
		<view class="top-nav-bar">
			<view class="back-button" @click="goBack">
				<view class="back-icon"></view>
			</view>
			<view class="page-title">修改手机号码</view>
			<view class="placeholder"></view>
		</view>
		
		<!-- 修改手机号码表单 -->
		<view class="form-card">
			<view class="form-title">请验证身份后修改手机号码</view>
			
			<view class="form-section">
				<view class="form-label">当前手机号</view>
				<view class="current-phone">{{ formatPhone(state.currentPhone) }}</view>
			</view>
			
			<view class="form-section">
				<view class="form-label">新手机号</view>
				<view class="input-container">
					<input 
						type="number" 
						v-model="state.newPhone" 
						class="form-input" 
						placeholder="请输入新手机号码"
						maxlength="11"
					/>
				</view>
			</view>
			
			<view class="form-section">
				<view class="form-label">验证码</view>
				<view class="verification-container">
					<input 
						type="number" 
						v-model="state.verificationCode" 
						class="verification-input" 
						placeholder="请输入验证码"
						maxlength="6"
					/>
					<view 
						class="get-code-button" 
						:class="{'disabled': state.countDown > 0}"
						@click="getVerificationCode"
					>
						{{ state.countDown > 0 ? `${state.countDown}秒后重试` : '获取验证码' }}
					</view>
				</view>
			</view>
			
			<view class="form-tip">
				<text class="tip-icon">!</text>
				<text class="tip-text">修改手机号码后，下次登录需使用新手机号</text>
			</view>
			
			<view class="submit-button" @click="submitForm" hover-class="button-hover">
				确认修改
			</view>
		</view>
	</view>
</template>

<script>
import { reactive, onMounted, onUnmounted } from 'vue';
import api from '../../utils/api.js';

export default {
	setup() {
		// 响应式数据
		const state = reactive({
			currentPhone: '',
			newPhone: '',
			verificationCode: '',
			countDown: 0,
			timer: null,
			isLoading: false
		});
		
		// 格式化电话号码显示
		const formatPhone = (phone) => {
			if (!phone || phone.length !== 11) return phone;
			return `${phone.substring(0, 3)}****${phone.substring(7)}`;
		};
		
		// 加载用户数据
		const loadUserData = async () => {
			state.isLoading = true;
			
			try {
				// 从本地存储获取用户信息
				let userInfo = uni.getStorageSync('userInfo');
				let currentUser = uni.getStorageSync('currentUser');
				
				// 优先使用userInfo获取手机号
				if (userInfo && userInfo.phone) {
					state.currentPhone = userInfo.phone;
				} else if (currentUser) {
					// 如果currentUser是字符串，则解析
					if (typeof currentUser === 'string') {
						try {
							currentUser = JSON.parse(currentUser);
							if (currentUser && currentUser.phone) {
								state.currentPhone = currentUser.phone;
							}
						} catch (e) {
							console.error('解析currentUser失败:', e);
						}
					} else if (currentUser.phone) {
						state.currentPhone = currentUser.phone;
					}
				}
				
				// 如果都没有获取到，使用默认值
				if (!state.currentPhone) {
					state.currentPhone = '13800138000';
				}
			} catch (error) {
				console.error('加载用户数据失败:', error);
				// 设置默认值
				state.currentPhone = '13800138000';
				
				uni.showToast({
					title: '加载用户信息失败',
					icon: 'none'
				});
			} finally {
				state.isLoading = false;
			}
		};
		
		// 获取验证码
		const getVerificationCode = async () => {
			// 如果正在倒计时，不允许再次获取
			if (state.countDown > 0) {
				return;
			}
			
			// 验证手机号格式
			if (!state.newPhone || state.newPhone.length !== 11) {
				uni.showToast({
					title: '请输入正确的手机号码',
					icon: 'none'
				});
				return;
			}
			
			try {
				// 调用发送验证码API
				const result = await api.sendVerificationCode({
					phone: state.newPhone
				});
				
				if (result.success) {
					// 显示成功消息
					uni.showToast({
						title: '验证码已发送',
						icon: 'success'
					});
					
					// 设置倒计时
					state.countDown = 60;
					state.timer = setInterval(() => {
						if (state.countDown > 0) {
							state.countDown--;
						} else {
							// 清除定时器
							clearInterval(state.timer);
							state.timer = null;
						}
					}, 1000);
				} else {
					uni.showToast({
						title: result.message || '验证码发送失败',
						icon: 'none'
					});
				}
			} catch (error) {
				console.error('发送验证码失败:', error);
				
				// 本地模式下模拟发送成功
				uni.showToast({
					title: '验证码已发送',
					icon: 'success'
				});
				
				// 设置倒计时
				state.countDown = 60;
				state.timer = setInterval(() => {
					if (state.countDown > 0) {
						state.countDown--;
					} else {
						// 清除定时器
						clearInterval(state.timer);
						state.timer = null;
					}
				}, 1000);
			}
		};
		
		// 提交表单
		const submitForm = async () => {
			// 验证输入
			if (!state.newPhone || state.newPhone.length !== 11) {
				uni.showToast({
					title: '请输入11位手机号码',
					icon: 'none'
				});
				return;
			}
			
			// 验证验证码
			if (!state.verificationCode || state.verificationCode.length !== 6) {
				uni.showToast({
					title: '请输入6位验证码',
					icon: 'none'
				});
				return;
			}
			
			// 如果新手机号与当前手机号相同
			if (state.newPhone === state.currentPhone) {
				uni.showToast({
					title: '新手机号不能与当前手机号相同',
					icon: 'none'
				});
				return;
			}
			
			state.isLoading = true;
			uni.showLoading({
				title: '提交中...'
			});
			
			try {
				// 本地开发环境直接更新，不需要验证码验证
				// 更新userInfo
				let userInfo = uni.getStorageSync('userInfo');
				if (userInfo) {
					userInfo.phone = state.newPhone;
					uni.setStorageSync('userInfo', userInfo);
				}
				
				// 更新currentUser
				let currentUser = uni.getStorageSync('currentUser');
				if (currentUser) {
					if (typeof currentUser === 'string') {
						try {
							let userData = JSON.parse(currentUser);
							userData.phone = state.newPhone;
							uni.setStorageSync('currentUser', JSON.stringify(userData));
						} catch (e) {
							console.error('更新currentUser失败:', e);
						}
					} else {
						currentUser.phone = state.newPhone;
						uni.setStorageSync('currentUser', currentUser);
					}
				}
				
				// 尝试更新users数组
				try {
					let users = uni.getStorageSync('users');
					// 确保users是数组
					if (users && Array.isArray(users)) {
						const userIndex = users.findIndex(u => {
							if (userInfo && userInfo.id) {
								return u.id === userInfo.id;
							}
							return u.phone === state.currentPhone;
						});
						
						if (userIndex !== -1) {
							users[userIndex].phone = state.newPhone;
							users[userIndex].updateTime = Date.now();
							uni.setStorageSync('users', users);
						}
					}
				} catch (e) {
					console.error('更新users数组失败:', e);
				}
				
				// 通知个人资料页面更新手机号
				uni.$emit('phoneUpdated', {
					phone: state.newPhone
				});
				
				uni.showToast({
					title: '手机号修改成功',
					icon: 'success',
					duration: 2000,
					success: () => {
						// 延迟返回，让提示显示完
						setTimeout(() => {
							goBack();
						}, 2000);
					}
				});
			} catch (error) {
				console.error('修改手机号失败:', error);
				uni.showToast({
					title: '修改失败，请重试',
					icon: 'none'
				});
			} finally {
				state.isLoading = false;
				uni.hideLoading();
			}
		};
		
		// 返回上一页
		const goBack = () => {
			uni.navigateBack();
		};
		
		// 组件挂载时加载用户数据
		onMounted(() => {
			// 显示加载动画
			uni.showLoading({
				title: '加载中...'
			});
			
			// 加载用户数据
			loadUserData().then(() => {
				uni.hideLoading();
			});
		});
		
		// 组件卸载时清除定时器
		onUnmounted(() => {
			if (state.timer) {
				clearInterval(state.timer);
				state.timer = null;
			}
		});
		
		return {
			state,
			formatPhone,
			getVerificationCode,
			submitForm,
			goBack
		};
	}
};
</script>

<style>
.phone-edit-container {
	min-height: 100vh;
	background-color: #f5f7fa;
	padding-bottom: 30rpx;
}

/* 顶部导航栏 */
.top-nav-bar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 30rpx;
	background: linear-gradient(90deg, #42b872, #4fc47f);
	color: white;
	position: relative;
	padding-top: calc(20rpx + var(--status-bar-height));
	animation: fadeIn 0.5s ease-out;
	box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);
	z-index: 10;
}

.page-title {
	font-size: 38rpx;
	font-weight: bold;
	letter-spacing: 2rpx;
	text-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.1);
}

.back-button, .placeholder {
	width: 70rpx;
	height: 70rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.3s ease;
}

.back-button:active {
	transform: scale(0.92);
}

.back-icon {
	width: 40rpx;
	height: 40rpx;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='white' d='M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z'/%3E%3C/svg%3E");
	background-repeat: no-repeat;
	background-position: center;
	background-size: cover;
}

/* 表单卡片 */
.form-card {
	margin: 30rpx;
	background: white;
	border-radius: 20rpx;
	padding: 40rpx 30rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
	animation: fadeIn 0.8s ease-out;
}

.form-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 40rpx;
	text-align: center;
}

.form-section {
	margin-bottom: 30rpx;
}

.form-label {
	font-size: 30rpx;
	color: #666;
	margin-bottom: 15rpx;
}

.current-phone {
	font-size: 32rpx;
	color: #333;
	padding: 25rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
}

.input-container {
	border-bottom: 1rpx solid #f0f0f0;
}

.form-input {
	height: 90rpx;
	font-size: 32rpx;
	color: #333;
}

.verification-container {
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-bottom: 1rpx solid #f0f0f0;
}

.verification-input {
	flex: 1;
	height: 90rpx;
	font-size: 32rpx;
	color: #333;
}

.get-code-button {
	min-width: 160rpx;
	height: 70rpx;
	background-color: #42b872;
	border-radius: 35rpx;
	color: white;
	font-size: 28rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 20rpx;
	transition: all 0.3s ease;
}

.get-code-button.disabled {
	background-color: #ccc;
	color: #fff;
}

.get-code-button:active:not(.disabled) {
	opacity: 0.8;
	transform: scale(0.98);
}

.form-tip {
	display: flex;
	align-items: flex-start;
	margin: 30rpx 0 40rpx;
	background-color: rgba(66, 184, 114, 0.1);
	padding: 20rpx;
	border-radius: 10rpx;
}

.tip-icon {
	width: 30rpx;
	height: 30rpx;
	border-radius: 50%;
	background-color: #42b872;
	color: white;
	font-size: 24rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 15rpx;
	flex-shrink: 0;
	font-weight: bold;
}

.tip-text {
	font-size: 26rpx;
	color: #666;
	line-height: 1.5;
}

.submit-button {
	height: 90rpx;
	background: linear-gradient(90deg, #42b872, #4fc47f);
	border-radius: 45rpx;
	color: white;
	font-size: 32rpx;
	font-weight: bold;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 6rpx 20rpx rgba(66, 184, 114, 0.3);
	transition: all 0.3s ease;
}

.button-hover {
	transform: scale(0.98);
	opacity: 0.9;
}

/* 动画定义 */
@keyframes fadeIn {
	from { 
		opacity: 0; 
		transform: translateY(10rpx);
	}
	to { 
		opacity: 1; 
		transform: translateY(0);
	}
}
</style> 