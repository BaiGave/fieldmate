<template>
	<view class="orders-container">
		<!-- 顶部导航 -->
		<view class="orders-header">
			<view class="back-button" @click="goBack">
				<view class="back-icon"></view>
			</view>
			<view class="header-title">确认订单</view>
			<view class="more-options">•••</view>
		</view>
		
		<!-- 订单状态标签 -->
		<view class="status-tabs">
			<view class="tab-item" :class="{active: activeTab === 'all'}" @click="switchTab('all')">
				<text>全部</text>
			</view>
			<view class="tab-item" :class="{active: activeTab === 'pending'}" @click="switchTab('pending')">
				<text>待付款</text>
			</view>
			<view class="tab-item" :class="{active: activeTab === 'reviewing'}" @click="switchTab('reviewing')">
				<text>待核销</text>
			</view>
			<view class="tab-item" :class="{active: activeTab === 'rating'}" @click="switchTab('rating')">
				<text>待评价</text>
			</view>
		</view>
		
		<!-- 订单列表 -->
		<view class="orders-list">
			<!-- 订单1 -->
			<view class="order-item">
				<view class="order-header">
					<text class="order-number">订单编号: 643846829774284</text>
					<text class="order-status pending">待付款</text>
				</view>
				<view class="order-content">
					<view class="product-image">
						<image src="/static/images/placeholder.png" mode="aspectFill"></image>
					</view>
					<view class="product-info">
						<view class="product-name">土壤学手册</view>
						<view class="product-desc">德国进口 配方温和 有效清理</view>
						<view class="product-price">¥ 800.00</view>
						<text class="product-quantity">×1</text>
					</view>
				</view>
				<view class="order-detail">
					<text class="appointment-time">预约到店时间: 03/25 星期五 09:20</text>
					<view class="order-total">
						<text class="total-label">需付款:</text>
						<text class="total-amount">¥ 800.00</text>
					</view>
				</view>
				<view class="order-actions">
					<view class="action-btn secondary" @click="cancelOrder">取消订单</view>
					<view class="action-btn primary" @click="payNow">立即支付</view>
				</view>
			</view>
			
			<!-- 订单2 -->
			<view class="order-item">
				<view class="order-header">
					<text class="order-number">订单编号: 643846829774284</text>
					<text class="order-status pending">待付款</text>
				</view>
				<view class="order-content">
					<view class="product-image">
						<image src="/static/images/placeholder.png" mode="aspectFill"></image>
					</view>
					<view class="product-info">
						<view class="product-name">土壤管理在线课程</view>
						<view class="product-desc">德国进口 配方温和 有效清理</view>
						<view class="product-price">¥ 800.00</view>
						<text class="product-quantity">×1</text>
					</view>
				</view>
				<view class="order-detail">
					<text class="appointment-time">预约到店时间: 03/25 星期五 09:20</text>
					<view class="order-total">
						<text class="total-label">需付款:</text>
						<text class="total-amount">¥ 800.00</text>
					</view>
				</view>
				<view class="order-actions">
					<view class="action-btn secondary" @click="cancelOrder">取消订单</view>
					<view class="action-btn primary" @click="payNow">立即支付</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 当前激活的标签
const activeTab = ref('pending');
const isLoading = ref(true);

// 切换标签
const switchTab = (tab) => {
	activeTab.value = tab;
	// 添加切换标签时的加载效果
	isLoading.value = true;
	setTimeout(() => {
		isLoading.value = false;
	}, 300);
};

// 返回主页
const goBack = () => {
	uni.reLaunch({
		url: '/pages/home/home',
		animationType: 'slide-out-right'
	});
};

// 支付订单
const payNow = () => {
	uni.showToast({
		title: '正在前往支付',
		icon: 'none',
		duration: 2000
	});
};

// 取消订单
const cancelOrder = () => {
	uni.showModal({
		title: '取消订单',
		content: '确定要取消该订单吗？',
		success: function(res) {
			if (res.confirm) {
				uni.showToast({
					title: '订单已取消',
					icon: 'success',
					duration: 2000
				});
			}
		}
	});
};

onMounted(() => {
	// 模拟加载数据
	setTimeout(() => {
		isLoading.value = false;
	}, 500);
	
	// 添加页面加载效果
	uni.showLoading({
		title: '加载中...',
		mask: true
	});
	
	setTimeout(() => {
		uni.hideLoading();
	}, 800);
});
</script>

<style>
.orders-container {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	background-color: #f5f7fa;
}

/* 顶部导航 */
.orders-header {
	padding: 20rpx;
	padding-top: calc(20rpx + var(--status-bar-height));
	display: flex;
	align-items: center;
	justify-content: space-between;
	background-color: #9AE681;
	position: sticky;
	top: 0;
	z-index: 100;
	animation: slideInLeft 0.5s ease-out;
}

.back-button {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
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

.more-options {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	transition: all 0.3s ease;
}

.more-options:active {
	transform: scale(0.9);
}

/* 订单状态标签 */
.status-tabs {
	display: flex;
	justify-content: space-around;
	align-items: center;
	background-color: #fff;
	height: 88rpx;
	border-bottom: 1rpx solid #eee;
	animation: fadeInUp 0.6s ease-out;
}

.tab-item {
	flex: 1;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 28rpx;
	color: #666;
	position: relative;
	transition: all 0.3s ease;
}

.tab-item.active {
	color: #4285f4;
	font-weight: bold;
}

.tab-item.active::after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	width: 50rpx;
	height: 4rpx;
	background-color: #4285f4;
	border-radius: 2rpx;
	transition: all 0.3s ease;
}

/* 订单列表 */
.orders-list {
	padding: 20rpx;
}

.order-item {
	background-color: #fff;
	border-radius: 16rpx;
	margin-bottom: 20rpx;
	overflow: hidden;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
	animation: scaleIn 0.5s ease-out forwards;
	transform-origin: center top;
	opacity: 0;
}

.order-item:nth-child(1) {
	animation-delay: 0.2s;
}

.order-item:nth-child(2) {
	animation-delay: 0.4s;
}

.order-item:nth-child(3) {
	animation-delay: 0.6s;
}

.order-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.order-number {
	font-size: 26rpx;
	color: #999;
}

.order-status {
	font-size: 26rpx;
	font-weight: bold;
}

.order-status.pending {
	color: #e74c3c;
}

.order-content {
	display: flex;
	padding: 20rpx;
	border-bottom: 1rpx solid #f0f0f0;
	position: relative;
}

.product-image {
	width: 160rpx;
	height: 160rpx;
	border-radius: 8rpx;
	overflow: hidden;
	background-color: #f0f0f0;
	margin-right: 20rpx;
}

.product-image image {
	width: 100%;
	height: 100%;
}

.product-info {
	flex: 1;
	position: relative;
}

.product-name {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 10rpx;
}

.product-desc {
	font-size: 24rpx;
	color: #999;
	margin-bottom: 10rpx;
}

.product-price {
	font-size: 32rpx;
	color: #333;
	margin-top: 10rpx;
}

.product-quantity {
	position: absolute;
	right: 0;
	top: 50%;
	transform: translateY(-50%);
	font-size: 26rpx;
	color: #999;
}

.order-detail {
	padding: 20rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.appointment-time {
	font-size: 26rpx;
	color: #666;
	display: block;
	margin-bottom: 10rpx;
}

.order-total {
	display: flex;
	justify-content: flex-end;
	align-items: center;
}

.total-label {
	font-size: 26rpx;
	color: #666;
	margin-right: 10rpx;
}

.total-amount {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.order-actions {
	padding: 20rpx;
	display: flex;
	justify-content: flex-end;
}

.action-btn {
	margin-left: 20rpx;
	padding: 10rpx 30rpx;
	font-size: 26rpx;
	border-radius: 30rpx;
	transition: all 0.2s ease;
}

.action-btn.secondary {
	border: 1rpx solid #ccc;
	color: #666;
}

.action-btn.primary {
	background-color: #4285f4;
	color: #fff;
}

/* 交互效果 */
.tab-item:hover {
	background-color: #f9f9f9;
}

.action-btn:hover {
	opacity: 0.8;
}

.back-button:hover {
	background-color: rgba(255, 255, 255, 0.2);
	border-radius: 50%;
	transition: all 0.3s;
}

/* 添加进入动画 */
@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translateY(30rpx);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes slideInLeft {
	from {
		transform: translateX(-50rpx);
		opacity: 0;
	}
	to {
		transform: translateX(0);
		opacity: 1;
	}
}

@keyframes scaleIn {
	from {
		transform: scale(0.9);
		opacity: 0;
	}
	to {
		transform: scale(1);
		opacity: 1;
	}
}

/* 应用动画到页面元素 */
.orders-header {
	animation: slideInLeft 0.5s ease-out;
}

.status-tabs {
	animation: fadeInUp 0.6s ease-out;
}

.order-item {
	transition: all 0.3s ease;
}

.order-item:active {
	transform: scale(0.98);
	box-shadow: 0 1rpx 5rpx rgba(0, 0, 0, 0.03);
}

.tab-item {
	transition: all 0.3s ease;
}

.tab-item.active::after {
	transition: all 0.3s ease;
}

.action-btn {
	transition: all 0.2s ease;
}

.action-btn:active {
	transform: scale(0.95);
}

.action-btn.primary:active {
	background-color: #3b77db;
}

.action-btn.secondary:active {
	background-color: #f8f8f8;
}

/* 加载骨架屏效果 */
@keyframes shimmer {
	0% {
		background-position: -200% 0;
	}
	100% {
		background-position: 200% 0;
	}
}

.skeleton-loading {
	background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
	background-size: 200% 100%;
	animation: shimmer 1.5s infinite;
}
</style> 