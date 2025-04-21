<template>
	<view class="detail-container">
		<!-- 顶部导航栏 -->
		<view class="top-nav-bar">
			<view class="back-button" hover-class="btn-hover" @click="goBack">
				<view class="back-icon"></view>
			</view>
			<view class="page-title">分析详情</view>
			<view class="right-action" v-if="recordData" @click="showActionSheet">
				<view class="delete-icon"></view>
			</view>
			<view class="right-placeholder" v-else></view>
		</view>
		
		<!-- 详情内容 -->
		<view class="detail-content" v-if="recordData">
			<view class="image-section">
				<image class="crop-image" :src="recordData.imagePath" mode="aspectFit"></image>
				<view class="image-time">{{formatTime(recordData.savedAt)}}</view>
			</view>
			
			<view class="info-card">
				<view class="result-header">
					<view class="result-title">分析结果</view>
					<view class="result-status" :class="recordData.healthStatus === '健康' ? 'status-good' : 'status-warning'">
						{{recordData.healthStatus}}
					</view>
				</view>
				
				<view class="info-list">
					<view class="info-item">
						<view class="info-label">作物类型：</view>
						<view class="info-value">{{recordData.cropType}}</view>
					</view>
					<view class="info-item">
						<view class="info-label">生长状态：</view>
						<view class="info-value">{{recordData.growthStage}}</view>
					</view>
					<view class="detail-section" v-if="recordData.analysisDetail">
						<view class="detail-title">详细分析：</view>
						<view class="detail-content-text">{{recordData.analysisDetail}}</view>
					</view>
				</view>
			</view>
			
			<view class="suggestions-card" v-if="recordData.suggestions && recordData.suggestions.length > 0">
				<view class="suggestions-title">处理建议</view>
				<view class="suggestions-list">
					<view class="suggestion-item" v-for="(item, index) in recordData.suggestions" :key="index">
						<view class="suggestion-icon"></view>
						<view class="suggestion-text">{{item}}</view>
					</view>
				</view>
			</view>
			
			<view class="action-buttons">
				<view class="action-button primary-btn" @click="goToAnalysis">
					<view class="button-icon scan-icon"></view>
					<view class="button-text">新的分析</view>
				</view>
				<view class="action-button secondary-btn" @click="shareAnalysis">
					<view class="button-icon share-icon"></view>
					<view class="button-text">分享结果</view>
				</view>
			</view>
		</view>
		
		<!-- 加载中状态 -->
		<view class="loading-container" v-else>
			<view class="loading-icon"></view>
			<view class="loading-text">加载中...</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAnalysisHistory, deleteAnalysisRecord } from '@/utils/storage.js';

// 页面参数
const recordId = ref(null);
const recordData = ref(null);

// 页面加载
onMounted(() => {
	const pages = getCurrentPages();
	const page = pages[pages.length - 1];
	const query = page.options || {};
	
	if (query.id) {
		recordId.value = parseInt(query.id);
		loadRecordData();
	} else {
		uni.showToast({
			title: '参数错误',
			icon: 'none'
		});
		setTimeout(() => {
			goBack();
		}, 1500);
	}
});

// 加载记录数据
const loadRecordData = () => {
	const historyList = getAnalysisHistory();
	const record = historyList.find(item => item.id === recordId.value);
	
	if (record) {
		recordData.value = record;
	} else {
		uni.showToast({
			title: '记录不存在',
			icon: 'none'
		});
		setTimeout(() => {
			goBack();
		}, 1500);
	}
};

// 返回上一页
const goBack = () => {
	uni.navigateBack();
};

// 前往分析页面
const goToAnalysis = () => {
	// 返回到分析页面
	uni.navigateBack({
		delta: 2 // 返回两层，即从详情页返回到分析页
	});
};

// 显示操作菜单
const showActionSheet = () => {
	uni.showActionSheet({
		itemList: ['删除此记录'],
		success: (res) => {
			if (res.tapIndex === 0) {
				uni.showModal({
					title: '确认删除',
					content: '确定要删除这条分析记录吗？',
					confirmColor: '#5C6BC0',
					success: (modalRes) => {
						if (modalRes.confirm) {
							if (deleteAnalysisRecord(recordId.value)) {
								uni.showToast({
									title: '已删除',
									icon: 'success'
								});
								setTimeout(() => {
									goBack();
								}, 1500);
							}
						}
					}
				});
			}
		}
	});
};

// 分享分析结果
const shareAnalysis = () => {
	// 模拟分享功能
	uni.showToast({
		title: '分享功能开发中',
		icon: 'none'
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
</script>

<style>
.detail-container {
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

.delete-icon {
	width: 40rpx;
	height: 40rpx;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='white' d='M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z'/%3E%3C/svg%3E");
	background-repeat: no-repeat;
	background-position: center;
	background-size: contain;
}

.right-placeholder {
	width: 60rpx;
	height: 60rpx;
}

/* 详情内容 */
.detail-content {
	flex: 1;
	padding: 30rpx;
}

/* 图片区域 */
.image-section {
	position: relative;
	background-color: white;
	border-radius: 20rpx;
	overflow: hidden;
	margin-bottom: 30rpx;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
}

.crop-image {
	width: 100%;
	height: 400rpx;
}

.image-time {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 15rpx 20rpx;
	background-color: rgba(0, 0, 0, 0.5);
	color: white;
	font-size: 24rpx;
}

/* 信息卡片 */
.info-card {
	background-color: white;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 30rpx;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
}

.result-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30rpx;
	border-bottom: 1px solid #f0f0f0;
	padding-bottom: 20rpx;
}

.result-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.result-status {
	font-size: 26rpx;
	font-weight: 500;
	padding: 6rpx 20rpx;
	border-radius: 30rpx;
}

.status-good {
	color: #4CAF50;
	background-color: rgba(76, 175, 80, 0.1);
}

.status-warning {
	color: #FFA000;
	background-color: rgba(255, 160, 0, 0.1);
}

.info-list {
	margin-bottom: 20rpx;
}

.info-item {
	display: flex;
	margin-bottom: 20rpx;
}

.info-label {
	width: 180rpx;
	font-size: 28rpx;
	color: #666;
}

.info-value {
	flex: 1;
	font-size: 28rpx;
	color: #333;
	font-weight: 500;
}

.detail-section {
	margin-top: 20rpx;
	padding-top: 20rpx;
	border-top: 1px dashed #e0e0e0;
}

.detail-title {
	font-size: 28rpx;
	color: #666;
	margin-bottom: 10rpx;
}

.detail-content-text {
	font-size: 28rpx;
	color: #333;
	line-height: 1.6;
}

/* 建议卡片 */
.suggestions-card {
	background-color: white;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 30rpx;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
}

.suggestions-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 20rpx;
	border-bottom: 1px solid #f0f0f0;
	padding-bottom: 20rpx;
}

.suggestion-item {
	display: flex;
	align-items: flex-start;
	margin-bottom: 15rpx;
}

.suggestion-icon {
	width: 30rpx;
	height: 30rpx;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%235C6BC0' d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z'/%3E%3C/svg%3E");
	background-repeat: no-repeat;
	background-position: center;
	background-size: contain;
	margin-right: 15rpx;
	flex-shrink: 0;
	margin-top: 5rpx;
}

.suggestion-text {
	font-size: 28rpx;
	color: #333;
	line-height: 1.5;
}

/* 操作按钮 */
.action-buttons {
	display: flex;
	justify-content: space-between;
	margin-top: 20rpx;
}

.action-button {
	flex: 1;
	height: 90rpx;
	border-radius: 45rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);
}

.primary-btn {
	background: linear-gradient(to right, #5C6BC0, #7986CB);
	color: white;
	margin-right: 20rpx;
}

.secondary-btn {
	background-color: white;
	color: #5C6BC0;
	border: 1px solid #e0e0e0;
}

.button-icon {
	width: 36rpx;
	height: 36rpx;
	background-repeat: no-repeat;
	background-position: center;
	background-size: contain;
	margin-right: 10rpx;
}

.scan-icon {
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='white' d='M9.5 6.5v3h-3v-3h3M11 5H5v6h6V5zm-1.5 9.5v3h-3v-3h3M11 13H5v6h6v-6zm6.5-6.5v3h-3v-3h3M19 5h-6v6h6V5zm-6 8h1.5v1.5H13V13zm1.5 1.5H16V16h-1.5v-1.5zM16 13h1.5v1.5H16V13zm-3 3h1.5v1.5H13V16zm1.5 1.5H16V19h-1.5v-1.5zM16 16h1.5v1.5H16V16zm1.5-1.5H19V16h-1.5v-1.5zm0 3H19V19h-1.5v-1.5zM22 7h-2V4h-3V2h5v5zm0 15v-5h-2v3h-3v2h5zM2 22h5v-2H4v-3H2v5zM2 2v5h2V4h3V2H2z'/%3E%3C/svg%3E");
}

.share-icon {
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%235C6BC0' d='M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z'/%3E%3C/svg%3E");
}

.button-text {
	font-size: 28rpx;
	font-weight: 500;
}

/* 加载中状态 */
.loading-container {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 100rpx;
}

.loading-icon {
	width: 80rpx;
	height: 80rpx;
	border: 6rpx solid #f3f3f3;
	border-top: 6rpx solid #5C6BC0;
	border-radius: 50%;
	animation: spin 1s linear infinite;
	margin-bottom: 30rpx;
}

@keyframes spin {
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
}

.loading-text {
	font-size: 30rpx;
	color: #999;
}
</style> 