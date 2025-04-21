<template>
	<view class="notifications-container">
		<!-- 顶部导航栏 -->
		<view class="top-nav-bar">
			<view class="back-button" @click="goBack">
				<view class="back-icon"></view>
			</view>
			<view class="page-title">消息通知</view>
			<view class="right-icon" @click="clearAllNotifications">
				<view class="clear-icon"></view>
			</view>
		</view>
		
		<!-- 内容区域 -->
		<view class="content-area">
			<!-- 消息类型选择 -->
			<view class="notification-tabs">
				<view 
					class="tab-item" 
					:class="{ active: activeTab === 'all' }" 
					@click="activeTab = 'all'">全部</view>
				<view 
					class="tab-item" 
					:class="{ active: activeTab === 'system' }" 
					@click="activeTab = 'system'">系统通知</view>
				<view 
					class="tab-item" 
					:class="{ active: activeTab === 'alert' }" 
					@click="activeTab = 'alert'">农田预警</view>
			</view>
			
			<!-- 消息列表 -->
			<scroll-view scroll-y="true" class="notification-list" v-if="filteredNotifications.length > 0">
				<view 
					class="notification-item" 
					v-for="(item, index) in filteredNotifications" 
					:key="index"
					:class="{ unread: !item.read }"
					@click="readNotification(index)"
				>
					<view class="notification-icon" :class="item.type + '-icon'"></view>
					<view class="notification-content">
						<view class="notification-title">{{ item.title }}</view>
						<view class="notification-text">{{ item.content }}</view>
						<view class="notification-time">{{ item.time }}</view>
					</view>
					<view class="unread-dot" v-if="!item.read"></view>
				</view>
			</scroll-view>
			
			<!-- 空消息状态 -->
			<view class="empty-notifications" v-if="filteredNotifications.length === 0">
				<view class="empty-icon"></view>
				<view class="empty-text">暂无消息通知</view>
				<view class="empty-subtext">农田助理将在这里向您发送重要的通知</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// 当前选中的标签
const activeTab = ref('all');

// 消息数据
const notifications = ref([]);

// 初始化默认消息（仅在首次使用时）
const initDefaultNotifications = () => {
	return [
		{
			id: 1,
			title: '欢迎使用农田助理',
			content: '欢迎使用农田助理！在这里您将收到重要的系统通知和农田预警信息。',
			time: new Date().toLocaleString('zh-CN', {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit',
				hour: '2-digit',
				minute: '2-digit'
			}).replace(/\//g, '-'),
			type: 'system',
			read: false
		}
	];
};

// 从本地存储加载消息
const loadNotifications = () => {
	try {
		// 检查用户是否已经清空过消息
		const hasCleared = uni.getStorageSync('notifications_cleared');
		
		// 先尝试从本地存储获取
		const storedNotifications = uni.getStorageSync('notifications');
		
		// 如果用户已经清空过消息，并且当前没有消息，则保持空状态
		if (hasCleared && (!storedNotifications || JSON.parse(storedNotifications).length === 0)) {
			console.log('用户已清空过消息，保持空状态');
			notifications.value = [];
			return;
		}
		
		// 检查是否有有效数据
		if (storedNotifications && JSON.parse(storedNotifications).length > 0) {
			notifications.value = JSON.parse(storedNotifications);
		} else {
			// 如果没有存储过消息或消息为空，且未清空过，则初始化默认消息
			console.log('初始化默认欢迎消息');
			notifications.value = initDefaultNotifications();
			// 保存到本地存储
			saveNotifications();
		}
	} catch (e) {
		console.error('加载消息失败:', e);
		// 出错时也使用默认消息，除非已经清空过
		const hasCleared = uni.getStorageSync('notifications_cleared');
		if (!hasCleared) {
			notifications.value = initDefaultNotifications();
			saveNotifications();
		} else {
			notifications.value = [];
		}
	}
	
	// 打印消息数量，用于调试
	console.log('当前消息数量:', notifications.value.length);
};

// 保存消息到本地存储
const saveNotifications = () => {
	try {
		uni.setStorageSync('notifications', JSON.stringify(notifications.value));
	} catch (e) {
		console.error('保存消息失败:', e);
	}
};

// 根据当前选中的标签过滤消息
const filteredNotifications = computed(() => {
	if (activeTab.value === 'all') {
		return notifications.value;
	} else {
		return notifications.value.filter(item => item.type === activeTab.value);
	}
});

// 返回上一页
const goBack = () => {
	uni.navigateBack();
};

// 阅读消息
const readNotification = (index) => {
	// 标记消息为已读
	notifications.value[index].read = true;
	
	// 保存到本地存储
	saveNotifications();
	
	// 显示提示
	uni.showToast({
		title: '已标记为已读',
		icon: 'none',
		duration: 1500
	});
};

// 清空所有消息
const clearAllNotifications = () => {
	uni.showModal({
		title: '清空消息',
		content: '确定要清空所有消息吗？删除后将不可恢复',
		success: (res) => {
			if (res.confirm) {
				notifications.value = [];
				
				// 保存到本地存储
				saveNotifications();
				
				// 设置标记，表示用户已经清空过消息
				uni.setStorageSync('notifications_cleared', 'true');
				
				uni.showToast({
					title: '已清空所有消息',
					icon: 'success'
				});
			}
		}
	});
};

// 添加测试消息（仅用于开发测试）
const addTestMessage = () => {
	const types = ['system', 'alert'];
	const type = types[Math.floor(Math.random() * types.length)];
	const title = type === 'system' ? '系统测试消息' : '预警测试消息';
	
	const newMessage = {
		id: new Date().getTime(),
		title: title,
		content: '这是一条测试消息，用于验证本地存储功能是否正常工作。',
		time: new Date().toLocaleString('zh-CN', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit'
		}).replace(/\//g, '-'),
		type: type,
		read: false
	};
	
	notifications.value.unshift(newMessage);
	saveNotifications();
	
	uni.showToast({
		title: '已添加测试消息',
		icon: 'none'
	});
};

// 页面加载时从本地存储中读取消息
onMounted(() => {
	// 确保页面加载时初始化消息
	console.log('页面加载，初始化消息');
	loadNotifications();
});
</script>

<style>
.notifications-container {
	min-height: 100vh;
	background-color: #f5f7fa;
	display: flex;
	flex-direction: column;
}

/* 顶部导航栏 */
.top-nav-bar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 30rpx;
	background: linear-gradient(90deg, #42b872, #4fc47f);
	color: white;
	padding-top: calc(20rpx + var(--status-bar-height));
	position: relative;
	box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);
	z-index: 10;
}

.back-button, .right-icon {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.back-icon {
	width: 40rpx;
	height: 40rpx;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='white' d='M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z'/%3E%3C/svg%3E");
	background-repeat: no-repeat;
	background-position: center;
	background-size: contain;
}

.clear-icon {
	width: 40rpx;
	height: 40rpx;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='white' d='M15 16h4v2h-4zm0-8h7v2h-7zm0 4h6v2h-6zM3 18c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V8H3v10zm2-8h6v8H5v-8zm5-6H6L5 5H2v2h12V5h-3z'/%3E%3C/svg%3E");
	background-repeat: no-repeat;
	background-position: center;
	background-size: contain;
}

.page-title {
	font-size: 38rpx;
	font-weight: bold;
	letter-spacing: 2rpx;
	text-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.1);
}

/* 内容区域 */
.content-area {
	flex: 1;
	display: flex;
	flex-direction: column;
}

/* 消息类型选择标签 */
.notification-tabs {
	display: flex;
	background-color: white;
	padding: 0 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.tab-item {
	flex: 1;
	height: 80rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
	color: #666;
	position: relative;
}

.tab-item.active {
	color: #42b872;
	font-weight: bold;
}

.tab-item.active::after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 30%;
	width: 40%;
	height: 4rpx;
	background-color: #42b872;
	border-radius: 2rpx;
}

/* 消息列表 */
.notification-list {
	flex: 1;
	padding: 20rpx 30rpx;
	height: calc(100vh - 250rpx);
	box-sizing: border-box;
	width: 100%;
}

.notification-item {
	background-color: white;
	border-radius: 16rpx;
	padding: 24rpx;
	padding-right: 60rpx;
	margin-bottom: 20rpx;
	display: flex;
	position: relative;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
	transition: all 0.3s;
	box-sizing: border-box;
	width: 100%;
}

.notification-item:active {
	transform: scale(0.98);
	opacity: 0.9;
}

.notification-item.unread {
	border-left: 0;
	background-color: white;
}

.notification-icon {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	background-color: #f0f0f0;
	margin-right: 20rpx;
	flex-shrink: 0;
	background-position: center;
	background-repeat: no-repeat;
	background-size: 60%;
}

.system-icon {
	background-color: rgba(66, 184, 114, 0.1);
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%2342b872' d='M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z'/%3E%3C/svg%3E");
}

.alert-icon {
	background-color: #FEE9EA;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23F44336' d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'/%3E%3C/svg%3E");
}

.notification-content {
	flex: 1;
}

.notification-title {
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 10rpx;
}

.notification-text {
	font-size: 26rpx;
	color: #666;
	line-height: 1.5;
	margin-bottom: 15rpx;
}

.notification-time {
	font-size: 24rpx;
	color: #999;
}

.unread-dot {
	position: absolute;
	right: 30rpx;
	top: 50%;
	transform: translateY(-50%);
	width: 12rpx;
	height: 12rpx;
	border-radius: 50%;
	background-color: #4CAF50;
}

/* 空消息状态 */
.empty-notifications {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 80rpx 40rpx;
}

.empty-icon {
	width: 180rpx;
	height: 180rpx;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23E0E0E0' d='M18 17H6v-2h12v2zm0-4H6v-2h12v2zm0-4H6V7h12v2zM3 22l1.5-1.5L6 22l1.5-1.5L9 22l1.5-1.5L12 22l1.5-1.5L15 22l1.5-1.5L18 22l1.5-1.5L21 22V2l-1.5 1.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2 4.5 3.5 3 2v20z'/%3E%3C/svg%3E");
	background-repeat: no-repeat;
	background-position: center;
	background-size: contain;
	margin-bottom: 40rpx;
}

.empty-text {
	font-size: 34rpx;
	color: #999;
	font-weight: bold;
	margin-bottom: 20rpx;
}

.empty-subtext {
	font-size: 28rpx;
	color: #bbb;
	text-align: center;
	line-height: 1.5;
}
</style> 