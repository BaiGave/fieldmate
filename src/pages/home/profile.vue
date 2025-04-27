<template>
	<view class="profile-container">
		<!-- 顶部导航栏 -->
		<view class="top-nav-bar">
			<view class="back-button" @click="goBack">
				<view class="back-icon"></view>
			</view>
			<view class="page-title">个人资料</view>
			<view class="placeholder"></view>
		</view>
		
		<!-- 用户信息卡片 -->
		<view class="user-card">
			<view class="user-avatar-large">
				<view class="avatar-icon-large"></view>
			</view>
			<view class="user-name">{{ state.user.username || '默认用户' }}</view>
			<view class="user-role">农场主</view>
		</view>
		
		<!-- 个人资料详情 -->
		<view class="profile-section">
			<view class="section-title">基本信息</view>
			
			<view class="profile-item">
				<view class="item-label">手机号码</view>
				<view class="item-value">{{ formatPhone(state.user.phone) }}</view>
				<view class="item-arrow" @click="goToPhoneEdit"></view>
			</view>
			
			<view class="profile-item" :class="{'editing': state.locationEdit.isEditing}">
				<view class="item-label" :class="{'editing-label': state.locationEdit.isEditing}">经纬度坐标</view>
				
				<view v-if="!state.locationEdit.isEditing" class="item-value">
					{{ state.user.location || '未设置' }}
				</view>
				
				<view v-if="state.locationEdit.isEditing" class="item-edit">
					<view class="edit-content">
						<input 
							type="text" 
							v-model="state.locationEdit.value" 
							class="location-input" 
							focus 
							placeholder="请输入坐标"
						/>
						<view class="location-button" @click="getLocation" hover-class="button-hover">
							<text class="location-icon"></text>
							<text>获取坐标</text>
						</view>
					</view>
					<view class="edit-actions">
						<view class="save-button" @click="saveLocation" hover-class="button-hover">
							保存
						</view>
						<view class="cancel-button" @click="cancelLocationEdit" hover-class="button-hover">
							取消
						</view>
					</view>
				</view>
				
				<view v-if="!state.locationEdit.isEditing" class="item-arrow" @click="editLocation"></view>
			</view>
			
			<view class="profile-item farm-area-item" :class="{'editing': state.farmAreaEdit.isEditing}">
				<view class="item-label" :class="{'editing-label': state.farmAreaEdit.isEditing}">农场面积</view>
				
				<view v-if="!state.farmAreaEdit.isEditing" class="item-value">
					{{ state.user.farmArea }} 亩
				</view>
				
				<view v-if="state.farmAreaEdit.isEditing" class="item-edit">
					<view class="edit-content">
						<view class="area-edit-container">
							<input 
								type="digit" 
								v-model="state.farmAreaEdit.value" 
								class="area-input" 
								focus 
								placeholder="请输入面积"
							/>
							<text class="unit-text">亩</text>
						</view>
					</view>
					<view class="edit-actions">
						<view class="save-button" @click="saveFarmArea" hover-class="button-hover">
							保存
						</view>
						<view class="cancel-button" @click="cancelEdit" hover-class="button-hover">
							取消
						</view>
					</view>
				</view>
				
				<view v-if="!state.farmAreaEdit.isEditing" class="item-arrow" @click="editFarmArea"></view>
			</view>
			
			<view class="profile-item">
				<view class="item-label">加入时间</view>
				<view class="item-value">{{ state.user.joinDate || '未知' }}</view>
			</view>
		</view>
		
		<view class="profile-section">
			<view class="section-title">账户设置</view>
			
			<view class="profile-item no-hover" @click="goToNotifications">
				<view class="item-label">消息通知</view>
				<view class="item-arrow"></view>
			</view>
			
			<view class="profile-item api-mode-item" :class="{'editing': state.apiModeEdit.isEditing}">
				<view class="item-label" :class="{'editing-label': state.apiModeEdit.isEditing}">API接口模式</view>
				
				<view v-if="!state.apiModeEdit.isEditing" class="item-value">
					{{ state.apiModeEdit.currentMode === 'mock' ? '模拟接口' : '真实接口' }}
				</view>
				
				<view v-if="state.apiModeEdit.isEditing" class="item-edit">
					<view class="edit-content">
						<view class="api-mode-select">
							<view 
								class="mode-option" 
								:class="{'selected': state.apiModeEdit.value === 'mock'}"
								@click="state.apiModeEdit.value = 'mock'"
							>
								模拟接口
							</view>
							<view 
								class="mode-option" 
								:class="{'selected': state.apiModeEdit.value === 'real'}"
								@click="state.apiModeEdit.value = 'real'"
							>
								真实接口
							</view>
						</view>
					</view>
					<view class="edit-actions">
						<view class="save-button" @click="saveApiMode" hover-class="button-hover">
							保存
						</view>
						<view class="cancel-button" @click="cancelApiModeEdit" hover-class="button-hover">
							取消
						</view>
					</view>
				</view>
				
				<view v-if="!state.apiModeEdit.isEditing" class="item-arrow" @click="editApiMode"></view>
			</view>
		</view>
		
		<view class="modify-password-button" @click="goToPasswordManagement">
			修改密码
		</view>
		
		<view class="logout-button" @click="logout">
			退出登录
		</view>
		
		<!-- 退出登录确认弹窗 -->
		<view v-if="state.showLogoutConfirm" class="modal-overlay">
			<view class="modal-container">
				<view class="modal-header">确认退出</view>
				<view class="modal-content">
					<view class="modal-message">是否确认退出登录？</view>
				</view>
				<view class="modal-footer">
					<view class="modal-button cancel" @click="cancelLogout">取消</view>
					<view class="modal-button confirm" @click="confirmLogout">确认</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { reactive, computed, onMounted, onUnmounted } from 'vue';
import api from '../../utils/api.js';

export default {
	setup() {
		// 响应式数据
		const state = reactive({
			user: {
				username: '',
				phone: '',
				location: '',
				farmArea: 0,
				joinDate: ''
			},
			locationEdit: {
				isEditing: false,
				value: ''
			},
			farmAreaEdit: {
				isEditing: false,
				value: 0
			},
			apiModeEdit: {
				isEditing: false,
				value: 'mock',
				currentMode: 'mock'
			},
			isLoading: true,
			showLogoutConfirm: false
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
				// 获取当前API模式
				try {
					state.apiModeEdit.currentMode = api.getApiMode();
					state.apiModeEdit.value = state.apiModeEdit.currentMode;
				} catch (e) {
					console.error('获取API模式失败:', e);
					// 默认使用模拟模式
					state.apiModeEdit.currentMode = 'mock';
					state.apiModeEdit.value = 'mock';
				}
				
				// 优先从userInfo获取用户信息
				let userInfo = uni.getStorageSync('userInfo');
				let userData = {};
				
				if (userInfo) {
					userData = userInfo;
				} else {
					// 尝试从currentUser获取
					const currentUser = uni.getStorageSync('currentUser');
					
					if (typeof currentUser === 'string') {
						try {
							userData = JSON.parse(currentUser || '{}');
						} catch (e) {
							console.error('解析currentUser失败:', e);
							userData = {};
						}
					} else if (currentUser) {
						userData = currentUser;
					}
				}
				
				// 设置用户数据
				state.user.username = userData.username || '默认用户';
				state.user.phone = userData.phone || '13800138000';
				state.user.location = userData.location || '未设置位置';
				state.user.farmArea = userData.farmArea || '100';
				
				// 格式化注册日期
				if (userData.joinDate) {
					state.user.joinDate = userData.joinDate;
				} else {
					// 默认为当前日期
					const date = new Date();
					state.user.joinDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
				}
			} catch (error) {
				console.error('加载用户数据失败:', error);
				// 设置默认值
				state.user.username = '默认用户';
				state.user.phone = '13800138000';
				state.user.location = '未设置位置';
				state.user.farmArea = '100';
				
				// 默认为当前日期
				const date = new Date();
				state.user.joinDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
				
				uni.showToast({
					title: '已使用默认信息',
					icon: 'none'
				});
			} finally {
				state.isLoading = false;
			}
		};

		// 返回按钮
		const goBack = () => {
			// 同步更新所有用户信息
			try {
				// 同步更新userInfo
				const userInfo = uni.getStorageSync('userInfo');
				if (userInfo) {
					const needsUpdate = userInfo.farmArea !== state.user.farmArea ||
						userInfo.phone !== state.user.phone ||
						userInfo.location !== state.user.location;
						
					if (needsUpdate) {
						userInfo.farmArea = state.user.farmArea;
						userInfo.phone = state.user.phone;
						userInfo.location = state.user.location;
						uni.setStorageSync('userInfo', userInfo);
						
						// 触发全局事件，通知主页更新信息
						uni.$emit('userInfoUpdated', {
							farmArea: state.user.farmArea,
							phone: state.user.phone,
							location: state.user.location
						});
					}
				}
			} catch (e) {
				console.error('返回时更新用户信息失败:', e);
			}
			
			// 然后返回上一页
			uni.navigateBack();
		};

		// 跳转到手机号码修改页面
		const goToPhoneEdit = () => {
			uni.navigateTo({
				url: '/pages/home/phone-edit'
			});
		};
		
		// 跳转到密码管理页面
		const goToPasswordManagement = () => {
			uni.navigateTo({
				url: '/pages/home/password-management'
			});
		};

		// 编辑所在位置
		const editLocation = () => {
			state.locationEdit.isEditing = true;
			state.locationEdit.value = state.user.location;
		};

		// 获取当前位置
		const getLocation = () => {
			uni.showLoading({
				title: '获取位置中...'
			});
			
			uni.getLocation({
				// 不指定坐标系类型，使用默认值
				success: (res) => {
					try {
						// 获取成功后，直接使用经纬度信息
						state.locationEdit.value = `${res.latitude.toFixed(4)},${res.longitude.toFixed(4)}`;
						
						// 尝试获取详细位置信息
						uni.showToast({
							title: '位置已获取',
							icon: 'success'
						});
					} catch (e) {
						console.error('处理位置信息失败:', e);
						// 确保至少有经纬度信息
						state.locationEdit.value = `位置(${res.latitude.toFixed(2)},${res.longitude.toFixed(2)})`;
					}
					
					uni.hideLoading();
				},
				fail: (err) => {
					console.error('获取位置失败:', err);
					uni.hideLoading();
					
					// 更具体的错误处理
					if (err.errMsg.includes('permission')) {
						uni.showToast({
							title: '获取位置权限被拒绝',
							icon: 'none'
						});
					} else if (err.errMsg.includes('timeout')) {
						uni.showToast({
							title: '获取位置超时',
							icon: 'none'
						});
					} else {
						uni.showToast({
							title: '获取位置失败',
							icon: 'none'
						});
					}
					
					// 设置一个默认位置
					state.locationEdit.value = '请手动输入位置';
				},
				complete: () => {
					// 确保加载提示被关闭
					uni.hideLoading();
				}
			});
		};

		// 保存所在位置
		const saveLocation = async () => {
			// 验证输入
			if (!state.locationEdit.value) {
				uni.showToast({
					title: '位置不能为空',
					icon: 'none'
				});
				return;
			}

			uni.showLoading({
				title: '保存中...'
			});

			try {
				// 使用本地API更新位置
				const result = await api.updateUserInfo({
					location: state.locationEdit.value
				});

				// 无论API成功与否，都确保本地状态更新
				state.user.location = state.locationEdit.value;
				state.locationEdit.isEditing = false;
				
				// 更新本地存储
				try {
					const userInfo = uni.getStorageSync('userInfo');
					if (userInfo) {
						userInfo.location = state.user.location;
						uni.setStorageSync('userInfo', userInfo);
					}
					
					// 尝试更新currentUser
					let currentUser = uni.getStorageSync('currentUser');
					if (currentUser) {
						if (typeof currentUser === 'string') {
							try {
								let userData = JSON.parse(currentUser);
								userData.location = state.user.location;
								uni.setStorageSync('currentUser', JSON.stringify(userData));
							} catch (e) {
								console.error('更新currentUser失败:', e);
							}
						} else {
							currentUser.location = state.user.location;
							uni.setStorageSync('currentUser', currentUser);
						}
					}
				} catch (e) {
					console.error('更新本地存储失败:', e);
				}
				
				uni.hideLoading();
				uni.showToast({
					title: '保存成功',
					icon: 'success'
				});
			} catch (error) {
				console.error('保存位置失败:', error);
				
				// 即使API调用失败，仍然更新本地状态
				state.user.location = state.locationEdit.value;
				state.locationEdit.isEditing = false;
				
				// 更新本地存储
				try {
					const userInfo = uni.getStorageSync('userInfo');
					if (userInfo) {
						userInfo.location = state.user.location;
						uni.setStorageSync('userInfo', userInfo);
					}
					
					// 尝试更新currentUser
					let currentUser = uni.getStorageSync('currentUser');
					if (currentUser) {
						if (typeof currentUser === 'string') {
							try {
								let userData = JSON.parse(currentUser);
								userData.location = state.user.location;
								uni.setStorageSync('currentUser', JSON.stringify(userData));
							} catch (e) {
								console.error('更新currentUser失败:', e);
							}
						} else {
							currentUser.location = state.user.location;
							uni.setStorageSync('currentUser', currentUser);
						}
					}
				} catch (e) {
					console.error('更新本地存储失败:', e);
				}
				
				uni.hideLoading();
				uni.showToast({
					title: '保存成功',
					icon: 'success'
				});
			}
		};

		// 取消编辑位置
		const cancelLocationEdit = () => {
			state.locationEdit.isEditing = false;
		};

		// 编辑农场面积
		const editFarmArea = () => {
			state.farmAreaEdit.isEditing = true;
			state.farmAreaEdit.value = state.user.farmArea;
		};

		// 保存农场面积
		const saveFarmArea = async () => {
			// 验证输入
			if (state.farmAreaEdit.value < 0) {
				uni.showToast({
					title: '面积不能为负数',
					icon: 'none'
				});
				return;
			}

			try {
				// 使用本地API更新农场面积
				const result = await api.updateFarmArea({
					farmArea: state.farmAreaEdit.value
				});

				if (result.success) {
					// 更新本地状态
					state.user.farmArea = state.farmAreaEdit.value;
					state.farmAreaEdit.isEditing = false;
					
					// 触发全局事件，通知主页更新农场面积
					uni.$emit('farmAreaUpdated', {
						farmArea: state.user.farmArea + '亩'
					});
					
					// 同时更新userInfo中的农场面积
					try {
						const userInfo = uni.getStorageSync('userInfo');
						if (userInfo) {
							userInfo.farmArea = state.user.farmArea;
							uni.setStorageSync('userInfo', userInfo);
						}
					} catch (e) {
						console.error('更新userInfo失败:', e);
					}
					
					uni.showToast({
						title: '保存成功',
						icon: 'success'
					});
				} else {
					uni.showToast({
						title: result.message || '保存失败',
						icon: 'none'
					});
				}
			} catch (error) {
				console.error('保存农场面积失败:', error);
				
				// 本地模式下直接更新
				state.user.farmArea = state.farmAreaEdit.value;
				state.farmAreaEdit.isEditing = false;
				
				// 更新本地存储
				try {
					const userInfo = uni.getStorageSync('userInfo');
					if (userInfo) {
						userInfo.farmArea = state.user.farmArea;
						uni.setStorageSync('userInfo', userInfo);
					}
				} catch (e) {
					console.error('更新userInfo失败:', e);
				}
				
				uni.showToast({
					title: '保存成功',
					icon: 'success'
				});
			}
		};

		// 取消编辑
		const cancelEdit = () => {
			state.farmAreaEdit.isEditing = false;
		};

		// 登出操作
		const logout = () => {
			state.showLogoutConfirm = true;
		};

		// 确认登出
		const confirmLogout = () => {
			// 清除认证数据
			api.clearAuthData();
			
			// 重定向到登录页
			uni.reLaunch({
				url: '/pages/index/index'
			});
		};

		// 取消登出
		const cancelLogout = () => {
			state.showLogoutConfirm = false;
		};

		// 跳转到消息通知页面
		const goToNotifications = () => {
			uni.navigateTo({
				url: '/pages/home/notifications'
			});
		};

		// 编辑API接口模式
		const editApiMode = () => {
			state.apiModeEdit.isEditing = true;
		};

		// 保存API接口模式
		const saveApiMode = async () => {
			// 验证输入
			if (!state.apiModeEdit.value) {
				uni.showToast({
					title: '请选择API接口模式',
					icon: 'none'
				});
				return;
			}

			try {
				// 使用本地API更新API接口模式
				const result = await api.updateApiMode({
					mode: state.apiModeEdit.value
				});

				if (result.success) {
					// 更新本地状态
					state.apiModeEdit.currentMode = state.apiModeEdit.value;
					state.apiModeEdit.isEditing = false;
					
					// 触发全局事件，通知主页更新API接口模式
					uni.$emit('apiModeUpdated', {
						mode: state.apiModeEdit.currentMode
					});
					
					// 同时更新userInfo中的API接口模式
					try {
						const userInfo = uni.getStorageSync('userInfo');
						if (userInfo) {
							userInfo.apiMode = state.apiModeEdit.currentMode;
							uni.setStorageSync('userInfo', userInfo);
						}
					} catch (e) {
						console.error('更新userInfo失败:', e);
					}
					
					uni.showToast({
						title: '保存成功',
						icon: 'success'
					});
				} else {
					uni.showToast({
						title: result.message || '保存失败',
						icon: 'none'
					});
				}
			} catch (error) {
				console.error('保存API接口模式失败:', error);
				
				// 本地模式下直接更新
				state.apiModeEdit.currentMode = state.apiModeEdit.value;
				state.apiModeEdit.isEditing = false;
				
				// 更新本地存储
				try {
					const userInfo = uni.getStorageSync('userInfo');
					if (userInfo) {
						userInfo.apiMode = state.apiModeEdit.currentMode;
						uni.setStorageSync('userInfo', userInfo);
					}
				} catch (e) {
					console.error('更新userInfo失败:', e);
				}
				
				uni.showToast({
					title: '保存成功',
					icon: 'success'
				});
			}
		};

		// 取消编辑API接口模式
		const cancelApiModeEdit = () => {
			state.apiModeEdit.isEditing = false;
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
			
			// 监听手机号码更新事件
			uni.$on('phoneUpdated', (data) => {
				if (data && data.phone) {
					state.user.phone = data.phone;
					
					// 同步更新本地存储中所有相关数据
					try {
						// 1. 更新userInfo
						let userInfo = uni.getStorageSync('userInfo');
						if (userInfo) {
							userInfo.phone = data.phone;
							uni.setStorageSync('userInfo', userInfo);
						}
						
						// 2. 更新currentUser
						let currentUser = uni.getStorageSync('currentUser');
						if (currentUser) {
							if (typeof currentUser === 'string') {
								try {
									let userData = JSON.parse(currentUser);
									userData.phone = data.phone;
									uni.setStorageSync('currentUser', JSON.stringify(userData));
								} catch (e) {
									console.error('更新currentUser失败:', e);
								}
							} else {
								currentUser.phone = data.phone;
								uni.setStorageSync('currentUser', currentUser);
							}
						}
					} catch (e) {
						console.error('同步更新用户信息失败:', e);
					}
				}
			});
		});
		
		// 组件卸载时清除事件监听
		onUnmounted(() => {
			uni.$off('phoneUpdated');
		});

		return {
			state,
			formatPhone,
			goBack,
			goToPhoneEdit,
			goToPasswordManagement,
			editLocation,
			getLocation,
			saveLocation,
			cancelLocationEdit,
			editFarmArea,
			saveFarmArea,
			cancelEdit,
			logout,
			confirmLogout,
			cancelLogout,
			goToNotifications,
			editApiMode,
			saveApiMode,
			cancelApiModeEdit
		};
	}
};
</script>

<style>
.profile-container {
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

/* 用户信息卡片 */
.user-card {
	margin: 30rpx;
	background: white;
	border-radius: 20rpx;
	padding: 40rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
	animation: fadeIn 0.8s ease-out;
}

.user-avatar-large {
	width: 160rpx;
	height: 160rpx;
	border-radius: 50%;
	background-color: #f0f0f0;
	margin-bottom: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.avatar-icon-large {
	width: 140rpx;
	height: 140rpx;
	border-radius: 50%;
	background-color: rgba(255, 255, 255, 0.9);
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%2342b872' d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E");
	background-size: cover;
}

.user-name {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 10rpx;
}

.user-role {
	font-size: 28rpx;
	color: #666;
	background-color: rgba(66, 184, 114, 0.1);
	padding: 8rpx 24rpx;
	border-radius: 30rpx;
}

/* 个人资料详情 */
.profile-section {
	margin: 30rpx;
	background: white;
	border-radius: 20rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
	animation: fadeIn 1s ease-out;
	margin-bottom: 40rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 30rpx;
	position: relative;
	padding-left: 24rpx;
}

.section-title::before {
	content: "";
	position: absolute;
	left: 0;
	top: 50%;
	transform: translateY(-50%);
	width: 8rpx;
	height: 32rpx;
	background-color: #42b872;
	border-radius: 4rpx;
}

.profile-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx 20rpx;
	border-bottom: 1px solid #f0f0f0;
	transition: all 0.3s ease;
}

.profile-item.no-hover:active {
	background-color: transparent;
}

.profile-item.editing {
	background-color: #f9fcf9;
	border-radius: 12rpx;
	padding: 30rpx 20rpx 40rpx;
	margin: -10rpx -10rpx;
	box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.05);
	flex-direction: column;
	align-items: flex-start;
}

.profile-item:last-child {
	border-bottom: none;
}

.item-label {
	font-size: 30rpx;
	color: #333;
}

.item-value {
	font-size: 30rpx;
	color: #666;
	flex: 1;
	text-align: right;
	margin-right: 20rpx;
}

.item-arrow {
	width: 36rpx;
	height: 36rpx;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23999' d='M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z'/%3E%3C/svg%3E");
	background-repeat: no-repeat;
	background-position: center;
	background-size: cover;
}

/* 修改密码按钮 */
.modify-password-button {
	margin: 20rpx auto 30rpx;
	width: 90%;
	max-width: 600rpx;
	height: 90rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: white;
	border: 1px solid #ddd;
	color: #42b872;
	font-size: 32rpx;
	font-weight: bold;
	border-radius: 45rpx;
	box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.05);
	transition: all 0.3s ease;
}

.modify-password-button:active {
	transform: scale(0.96);
	background-color: #f5f5f5;
}

/* 退出登录按钮 */
.logout-button {
	margin: 20rpx auto 60rpx;
	width: 90%;
	max-width: 600rpx;
	height: 90rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: white;
	border: 1px solid #ddd;
	color: #e53935;
	font-size: 32rpx;
	font-weight: bold;
	border-radius: 45rpx;
	box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.05);
	transition: all 0.3s ease;
}

.logout-button:active {
	transform: scale(0.96);
	background-color: #f5f5f5;
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

.item-edit {
	display: flex;
	flex-direction: column;
	align-items: center;
	flex: 1;
	animation: fadeIn 0.3s ease-out;
	width: 100%;
}

.edit-content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	margin: 20rpx 0;
	width: 100%;
}

.location-input {
	width: 100%;
	height: 90rpx;
	background-color: #FFFFFF;
	border-radius: 10rpx;
	padding: 0 20rpx;
	font-size: 32rpx;
	color: #333;
	text-align: center;
	border: 2rpx solid #eee;
	transition: all 0.3s ease;
	box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
	margin-bottom: 20rpx;
	box-sizing: border-box;
}

.location-button {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 90rpx;
	width: 100%;
	background-color: #42b872;
	color: white;
	font-size: 30rpx;
	border-radius: 45rpx;
	box-shadow: 0 4rpx 12rpx rgba(66, 184, 114, 0.3);
	transition: all 0.3s ease;
	margin-bottom: 20rpx;
}

.area-edit-container {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	background-color: #FFFFFF;
	border-radius: 10rpx;
	margin-bottom: 20rpx;
	width: 100%;
}

.area-input {
	width: 260rpx;
	height: 90rpx;
	background-color: #FFFFFF;
	border-radius: 10rpx;
	padding: 0 20rpx;
	font-size: 32rpx;
	color: #333;
	text-align: center;
	border: 2rpx solid #eee;
	transition: all 0.3s ease;
	box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
	margin-right: 20rpx;
}

.edit-actions {
	display: flex;
	justify-content: center;
	width: 100%;
}

.save-button, .cancel-button {
	padding: 0;
	width: 160rpx;
	height: 80rpx;
	font-size: 30rpx;
	border-radius: 40rpx;
	margin: 0 15rpx;
	transition: all 0.2s ease;
	display: flex;
	align-items: center;
	justify-content: center;
}

.save-button {
	background-color: #42b872;
	color: white;
	box-shadow: 0 4rpx 12rpx rgba(66, 184, 114, 0.3);
}

.cancel-button {
	background-color: #f5f5f5;
	color: #666;
	border: 1rpx solid #e0e0e0;
}

.farm-area-item {
	transition: all 0.3s ease;
}

/* 弹窗样式 */
.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 999;
	animation: fadeIn 0.3s ease-out;
}

.modal-container {
	width: 80%;
	max-width: 600rpx;
	background-color: white;
	border-radius: 20rpx;
	overflow: hidden;
	box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.2);
	animation: scaleIn 0.3s ease-out;
}

.modal-header {
	padding: 30rpx;
	text-align: center;
	font-size: 34rpx;
	font-weight: bold;
	color: #333;
	border-bottom: 1rpx solid #f0f0f0;
}

.modal-content {
	padding: 40rpx 30rpx;
}

.modal-message {
	font-size: 32rpx;
	color: #666;
	text-align: center;
	line-height: 1.5;
}

.modal-footer {
	display: flex;
	border-top: 1rpx solid #f0f0f0;
}

.modal-button {
	flex: 1;
	padding: 25rpx 0;
	text-align: center;
	font-size: 32rpx;
	transition: all 0.2s;
}

.modal-button.cancel {
	color: #666;
	border-right: 1rpx solid #f0f0f0;
}

.modal-button.confirm {
	color: #e53935;
	font-weight: bold;
}

.modal-button:active {
	background-color: #f5f5f5;
}

@keyframes scaleIn {
	from { 
		opacity: 0; 
		transform: scale(0.9);
	}
	to { 
		opacity: 1; 
		transform: scale(1);
	}
}

.verification-section {
	width: 100%;
	margin: 20rpx 0;
}

.verification-input-container {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
}

.verification-input {
	flex: 1;
	height: 80rpx;
	background-color: #f0f7f2;
	border-radius: 10rpx;
	padding: 0 20rpx;
	font-size: 32rpx;
	color: #333;
	text-align: left;
	border: 2rpx solid #e0e0e0;
	transition: all 0.3s ease;
	box-shadow: inset 0 2rpx 5rpx rgba(0, 0, 0, 0.05);
	margin-right: 20rpx;
}

.get-code-button {
	min-width: 160rpx;
	height: 80rpx;
	background-color: #42b872;
	border-radius: 10rpx;
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

.location-icon {
	width: 30rpx;
	height: 30rpx;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='white' d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E");
	background-repeat: no-repeat;
	background-position: center;
	background-size: cover;
	margin-right: 10rpx;
}

.location-button:active {
	transform: scale(0.95);
	opacity: 0.9;
}

.button-hover {
	transform: scale(0.95);
	opacity: 0.9;
}

.unit-text {
	margin-left: 20rpx;
	font-size: 32rpx;
	color: #666;
}

.editing-label {
	margin-bottom: 20rpx;
	font-size: 32rpx;
	font-weight: bold;
}

.api-mode-item {
	transition: all 0.3s ease;
}

.api-mode-select {
	display: flex;
	flex-direction: row;
	width: 100%;
	margin-top: 20rpx;
	margin-bottom: 20rpx;
}

.mode-option {
	flex: 1;
	text-align: center;
	padding: 20rpx 0;
	background-color: #f0f0f0;
	margin: 0 10rpx;
	border-radius: 10rpx;
	font-size: 28rpx;
	color: #666;
	transition: all 0.3s ease;
}

.mode-option.selected {
	background-color: #42b872;
	color: #fff;
	box-shadow: 0 4rpx 8rpx rgba(66, 184, 114, 0.2);
}

.mode-option:active {
	opacity: 0.7;
}
</style> 