<template>
	<view class="history-container">
		<!-- 顶部导航栏 -->
		<view class="top-nav-bar">
			<view class="back-button" hover-class="btn-hover" @click="goBack">
				<view class="back-icon"></view>
			</view>
			<view class="page-title">分析历史</view>
			<view class="right-action" v-if="historyList.length > 0" @click="showActionSheet">
				<view class="more-icon"></view>
			</view>
			<view class="right-placeholder" v-else></view>
		</view>
		
		<!-- 历史记录列表 -->
		<view class="history-list" v-if="historyList.length > 0">
			<view class="history-item" v-for="(item, index) in historyList" :key="item.id" @click="viewDetail(item)" :animation="animationData[index]">
				<view class="item-header">
					<view class="item-time">{{formatTime(item.savedAt)}}</view>
					<view class="item-status" :class="item.healthStatus === '健康' ? 'status-good' : 'status-warning'">
						{{item.healthStatus}}
					</view>
				</view>
				<view class="item-content">
					<view class="item-image-container">
						<image class="item-image" :src="item.imagePath" mode="aspectFill"></image>
					</view>
					<view class="item-info">
						<view class="info-row">
							<text class="info-label">作物类型：</text>
							<text class="info-value">{{item.cropType}}</text>
						</view>
						<view class="info-row">
							<text class="info-label">生长阶段：</text>
							<text class="info-value">{{item.growthStage}}</text>
						</view>
						<view class="info-brief">{{getBriefDetail(item.analysisDetail)}}</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 无历史记录提示 -->
		<view class="empty-history" v-else :animation="emptyAnimationData">
			<view class="empty-icon"></view>
			<view class="empty-text">暂无历史记录</view>
			<view class="start-analysis-button" hover-class="button-hover" @click="goToAnalysis">
				<view class="pulse-ring"></view>
				<view class="button-content">
					<view class="analysis-icon"></view>
					<text>开始分析</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { getAnalysisHistory, clearAnalysisHistory, deleteAnalysisRecord } from '@/utils/storage.js';

// 历史记录列表
const historyList = ref([]);
const animationData = reactive([]);
const emptyAnimationData = ref(null);

// 页面加载时获取历史记录
onMounted(() => {
	loadHistory();
	
	// 延迟执行动画，确保页面已渲染
	setTimeout(() => {
		playEmptyAnimation();
		playListAnimation();
	}, 100);
});

// 加载历史记录
const loadHistory = () => {
	historyList.value = getAnalysisHistory();
	// 初始化动画数据数组
	historyList.value.forEach(() => {
		animationData.push(null);
	});
};

// 返回上一页
const goBack = () => {
	uni.navigateBack();
};

// 前往分析页面
const goToAnalysis = () => {
	uni.navigateBack();
};

// 显示操作菜单
const showActionSheet = () => {
	if (historyList.value.length === 0) return;
	
	uni.showActionSheet({
		itemList: ['清空历史记录'],
		success: (res) => {
			if (res.tapIndex === 0) {
				uni.showModal({
					title: '确认清空',
					content: '确定要清空所有历史记录吗？此操作不可恢复。',
					confirmColor: '#5C6BC0',
					success: (modalRes) => {
						if (modalRes.confirm) {
							if (clearAnalysisHistory()) {
								historyList.value = [];
								uni.showToast({
									title: '已清空历史记录',
									icon: 'success'
								});
								// 显示空状态动画
								setTimeout(() => {
									playEmptyAnimation();
								}, 300);
							}
						}
					}
				});
			}
		}
	});
};

// 查看详情
const viewDetail = (item) => {
	// 将数据保存到页面传参
	uni.navigateTo({
		url: `/pages/home/analysis-detail?id=${item.id}`
	});
};

// 格式化时间
const formatTime = (timeString) => {
	try {
		const date = new Date(timeString);
		return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
	} catch (e) {
		return timeString || '未知时间';
	}
};

// 获取简短分析描述
const getBriefDetail = (detail) => {
	if (!detail) return '无分析详情';
	return detail.length > 50 ? detail.substring(0, 50) + '...' : detail;
};

// 播放列表动画
const playListAnimation = () => {
	if (historyList.value.length === 0) return;
	
	historyList.value.forEach((_, index) => {
		setTimeout(() => {
			const animation = uni.createAnimation({
				duration: 400,
				timingFunction: 'ease-out'
			});
			
			animation.opacity(1).translateY(0).step();
			animationData[index] = animation.export();
		}, index * 100); // 错开每个项目的动画时间
	});
};

// 播放空状态动画
const playEmptyAnimation = () => {
	if (historyList.value.length > 0) return;
	
	const animation = uni.createAnimation({
		duration: 600,
		timingFunction: 'ease-out'
	});
	
	animation.opacity(1).translateY(0).step();
	emptyAnimationData.value = animation.export();
};
</script>

<style>
.history-container {
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
	background: linear-gradient(90deg, #5C6BC0, #7986CB);
	color: white;
	padding-top: calc(20rpx + var(--status-bar-height));
}

.back-button {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	transition: all 0.2s ease;
}

.back-button.btn-hover {
	transform: scale(0.9);
	background-color: rgba(255, 255, 255, 0.2);
}

.back-icon {
	width: 40rpx;
	height: 40rpx;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='white' d='M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z'/%3E%3C/svg%3E");
	background-repeat: no-repeat;
	background-position: center;
	background-size: contain;
}

.page-title {
	font-size: 36rpx;
	font-weight: bold;
	letter-spacing: 2rpx;
}

.right-action {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.more-icon {
	width: 40rpx;
	height: 40rpx;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='white' d='M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z'/%3E%3C/svg%3E");
	background-repeat: no-repeat;
	background-position: center;
	background-size: contain;
}

.right-placeholder {
	width: 60rpx;
	height: 60rpx;
}

/* 历史记录列表 */
.history-list {
	flex: 1;
	padding: 20rpx;
}

.history-item {
	background-color: white;
	border-radius: 20rpx;
	margin-bottom: 20rpx;
	padding: 20rpx;
	box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.08);
	transform: translateY(20rpx);
	opacity: 0;
	transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.history-item:active {
	transform: scale(0.98);
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
}

.item-header {
	display: flex;
	justify-content: space-between;
	margin-bottom: 15rpx;
	align-items: center;
}

.item-time {
	font-size: 24rpx;
	color: #999;
}

.item-status {
	font-size: 24rpx;
	font-weight: 500;
	padding: 4rpx 12rpx;
	border-radius: 20rpx;
	background-color: #f0f0f0;
}

.status-good {
	color: #4CAF50;
	background-color: rgba(76, 175, 80, 0.1);
}

.status-warning {
	color: #FFA000;
	background-color: rgba(255, 160, 0, 0.1);
}

.item-content {
	display: flex;
}

.item-image-container {
	width: 180rpx;
	height: 180rpx;
	border-radius: 10rpx;
	overflow: hidden;
	margin-right: 20rpx;
	background-color: #f0f0f0;
}

.item-image {
	width: 100%;
	height: 100%;
}

.item-info {
	flex: 1;
}

.info-row {
	display: flex;
	margin-bottom: 10rpx;
}

.info-label {
	font-size: 26rpx;
	color: #666;
	width: 140rpx;
}

.info-value {
	font-size: 26rpx;
	color: #333;
	font-weight: 500;
}

.info-brief {
	font-size: 26rpx;
	color: #666;
	line-height: 1.5;
	margin-top: 10rpx;
	display: -webkit-box;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
	overflow: hidden;
	text-overflow: ellipsis;
}

/* 空历史记录提示 */
.empty-history {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 100rpx 50rpx;
	opacity: 0;
	transform: translateY(30rpx);
}

.empty-icon {
	width: 180rpx;
	height: 180rpx;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23BDBDBD' d='M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z'/%3E%3C/svg%3E");
	background-repeat: no-repeat;
	background-position: center;
	background-size: contain;
	margin-bottom: 30rpx;
	animation: float 3s ease-in-out infinite;
}

@keyframes float {
	0% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(-15rpx);
	}
	100% {
		transform: translateY(0);
	}
}

.empty-text {
	font-size: 34rpx;
	color: #666;
	margin-bottom: 60rpx;
	font-weight: 500;
}

/* 新的开始分析按钮样式 */
.start-analysis-button {
	position: relative;
	width: 360rpx;
	height: 110rpx;
	background: linear-gradient(135deg, #5C6BC0, #3949AB);
	border-radius: 55rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 8rpx 20rpx rgba(92, 107, 192, 0.4);
	overflow: hidden;
	z-index: 1;
}

.button-hover {
	transform: scale(0.95);
	box-shadow: 0 4rpx 10rpx rgba(92, 107, 192, 0.3);
}

.button-content {
	position: relative;
	z-index: 3;
	display: flex;
	align-items: center;
	justify-content: center;
}

.button-content text {
	color: white;
	font-size: 32rpx;
	font-weight: 600;
	letter-spacing: 2rpx;
}

.analysis-icon {
	width: 42rpx;
	height: 42rpx;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='white' d='M9.5 6.5v3h-3v-3h3M11 5H5v6h6V5zm-1.5 9.5v3h-3v-3h3M11 13H5v6h6v-6zm6.5-6.5v3h-3v-3h3M19 5h-6v6h6V5zm-6 8h1.5v1.5H13V13zm1.5 1.5H16V16h-1.5v-1.5zM16 13h1.5v1.5H16V13zm-3 3h1.5v1.5H13V16zm1.5 1.5H16V19h-1.5v-1.5zM16 16h1.5v1.5H16V16zm1.5-1.5H19V16h-1.5v-1.5zm0 3H19V19h-1.5v-1.5zM22 7h-2V4h-3V2h5v5zm0 15v-5h-2v3h-3v2h5zM2 22h5v-2H4v-3H2v5zM2 2v5h2V4h3V2H2z'/%3E%3C/svg%3E");
	background-repeat: no-repeat;
	background-position: center;
	background-size: contain;
	margin-right: 12rpx;
}

/* 脉冲效果 */
.pulse-ring {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 100%;
	height: 100%;
	background-color: rgba(255, 255, 255, 0.2);
	border-radius: 55rpx;
	z-index: 2;
	opacity: 0;
	animation: pulse 2s infinite;
}

@keyframes pulse {
	0% {
		transform: translate(-50%, -50%) scale(1);
		opacity: 0.6;
	}
	70% {
		transform: translate(-50%, -50%) scale(1.1);
		opacity: 0;
	}
	100% {
		transform: translate(-50%, -50%) scale(1.1);
		opacity: 0;
	}
}
</style> 