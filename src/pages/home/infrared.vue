<template>
	<view class="infrared-container">
		<!-- 顶部导航 -->
		<view class="infrared-header">
			<view class="back-button" @click="goBack">
				<view class="back-icon"></view>
			</view>
			<view class="header-title">红外检测</view>
		</view>
		
		<!-- 红外检测状态 -->
		<view class="device-notice">
			<text class="notice-text">尚未接入红外检测设备!</text>
			<view class="connect-btn">立即接入</view>
		</view>
		
		<!-- 红外检测区域 -->
		<view class="detection-view">
			<view class="detection-placeholder">
				<view class="detection-icon"></view>
				<text class="detection-text">等待数据采集</text>
			</view>
		</view>
		
		<!-- 检测历史 -->
		<view class="section-title">检测历史</view>
		
		<view class="history-list">
			<view class="history-empty">
				<text>暂无检测历史数据</text>
			</view>
		</view>
		
		<!-- 检测类型 -->
		<view class="section-title">检测类型</view>
		
		<view class="detection-grid">
			<!-- 温度分布 -->
			<view class="detection-item">
				<view class="item-header">
					<text class="item-title">温度分布</text>
				</view>
				<view class="item-desc">检测土壤和作物温度分布情况</view>
				<view class="item-status">可用</view>
			</view>
			
			<!-- 水分监测 -->
			<view class="detection-item">
				<view class="item-header">
					<text class="item-title">水分监测</text>
				</view>
				<view class="item-desc">检测土壤水分和灌溉状况</view>
				<view class="item-status">可用</view>
			</view>
			
			<!-- 病虫害 -->
			<view class="detection-item">
				<view class="item-header">
					<text class="item-title">病虫害</text>
				</view>
				<view class="item-desc">发现早期病虫害迹象</view>
				<view class="item-status">可用</view>
			</view>
			
			<!-- 作物长势 -->
			<view class="detection-item">
				<view class="item-header">
					<text class="item-title">作物长势</text>
				</view>
				<view class="item-desc">监测作物生长情况</view>
				<view class="item-status">可用</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const goBack = () => {
	uni.reLaunch({
		url: '/pages/home/home',
		animationType: 'slide-out-right'
	});
};

onMounted(() => {
	// 页面加载动画
	uni.showLoading({
		title: '初始化设备...',
		mask: true
	});
	
	setTimeout(() => {
		uni.hideLoading();
		uni.showToast({
			title: '设备未连接',
			icon: 'none',
			duration: 2000
		});
	}, 1500);
});
</script>

<style>
.infrared-container {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	background-color: #f5f7fa;
}

/* 顶部导航 */
.infrared-header {
	padding: 20rpx;
	padding-top: calc(20rpx + var(--status-bar-height));
	display: flex;
	align-items: center;
	background-color: #9AE681;
	position: sticky;
	top: 0;
	z-index: 100;
	animation: fadeIn 0.5s ease-out;
}

.back-button {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.3s ease;
}

.back-icon {
	width: 36rpx;
	height: 36rpx;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23333' d='M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z'/%3E%3C/svg%3E");
	background-repeat: no-repeat;
	background-position: center;
	background-size: contain;
}

.header-title {
	flex: 1;
	text-align: center;
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
}

/* 设备通知条 */
.device-notice {
	background-color: #FEF8E7;
	padding: 20rpx 30rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	animation: slideInUp 0.6s ease-out;
}

.notice-text {
	font-size: 28rpx;
	color: #333;
}

.connect-btn {
	background-color: #FF6B6B;
	color: white;
	font-size: 24rpx;
	padding: 8rpx 20rpx;
	border-radius: 20rpx;
	transition: all 0.3s ease;
}

.connect-btn:active {
	transform: scale(0.95);
	background-color: #E95959;
}

/* 红外检测区域 */
.detection-view {
	width: 100%;
	height: 380rpx;
	background-color: #2C3E50;
	display: flex;
	align-items: center;
	justify-content: center;
	animation: fadeIn 0.8s ease-out;
}

.detection-placeholder {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	animation: fadeIn 1s ease-out;
}

.detection-icon {
	width: 100rpx;
	height: 100rpx;
	background-color: rgba(255, 255, 255, 0.1);
	border-radius: 50%;
	margin-bottom: 20rpx;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23FF6B6B' d='M12 9c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4.5-1.9c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zm2.5 5.9c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zm-10 0c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zm-1-4c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2z'/%3E%3C/svg%3E");
	background-repeat: no-repeat;
	background-position: center;
	background-size: 60%;
	animation: pulse 2s infinite ease-in-out;
}

.detection-text {
	font-size: 28rpx;
	color: #fff;
}

/* 历史记录区域 */
.history-list {
	padding: 20rpx;
}

.history-empty {
	height: 200rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: white;
	border-radius: 16rpx;
	color: #999;
	font-size: 28rpx;
}

/* 监测区域 */
.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	padding: 30rpx 30rpx 10rpx;
	position: relative;
	animation: fadeInLeft 0.7s ease-out;
}

.section-title::after {
	content: '';
	position: absolute;
	left: 30rpx;
	bottom: 0;
	width: 120rpx;
	height: 6rpx;
	background-color: #FF6B6B;
	border-radius: 3rpx;
}

.detection-grid {
	display: flex;
	flex-wrap: wrap;
	padding: 20rpx;
}

.detection-item {
	width: calc(50% - 20rpx);
	margin: 10rpx;
	background-color: white;
	border-radius: 16rpx;
	padding: 20rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
	opacity: 0;
	animation: slideInUp 0.5s ease-out forwards;
}

.item-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10rpx;
}

.item-title {
	font-size: 28rpx;
	color: #333;
	font-weight: bold;
}

.item-desc {
	font-size: 24rpx;
	color: #999;
	margin-bottom: 16rpx;
}

.item-status {
	font-size: 24rpx;
	color: #FF6B6B;
	text-align: center;
	background-color: rgba(255, 107, 107, 0.1);
	padding: 6rpx 0;
	border-radius: 4rpx;
}

/* 交互效果 */
.detection-item:hover {
	transform: translateY(-3rpx);
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
	transition: all 0.3s;
}

.connect-btn:hover {
	background-color: #E95959;
	transform: scale(1.05);
	transition: all 0.3s;
}

.back-button:hover {
	background-color: rgba(255, 255, 255, 0.2);
	border-radius: 50%;
	transition: all 0.3s;
}

/* 添加动画关键帧 */
@keyframes fadeIn {
	from { opacity: 0; }
	to { opacity: 1; }
}

@keyframes slideInUp {
	from { 
		transform: translateY(30rpx);
		opacity: 0;
	}
	to { 
		transform: translateY(0);
		opacity: 1;
	}
}

@keyframes fadeInLeft {
	from { 
		transform: translateX(-30rpx);
		opacity: 0;
	}
	to { 
		transform: translateX(0);
		opacity: 1;
	}
}

@keyframes pulse {
	0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.4); }
	70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(255, 107, 107, 0); }
	100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 107, 107, 0); }
}

/* 应用动画到页面元素 */
.detection-item:nth-child(1) {
	animation-delay: 0.3s;
}

.detection-item:nth-child(2) {
	animation-delay: 0.4s;
}

.detection-item:nth-child(3) {
	animation-delay: 0.5s;
}

.detection-item:nth-child(4) {
	animation-delay: 0.6s;
}

.detection-item {
	transition: all 0.3s ease;
}
</style> 