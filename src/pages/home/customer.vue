<template>
	<view class="customer-container">
		<!-- 顶部导航 -->
		<view class="customer-header">
			<view class="back-button" @click="goBack">
				<view class="back-icon"></view>
			</view>
			<view class="header-title">客户管理</view>
			<view class="add-button">+</view>
		</view>
		
		<!-- 搜索区域 -->
		<view class="search-area">
			<view class="search-box">
				<view class="search-icon"></view>
				<input type="text" placeholder="搜索客户名称/手机号" confirm-type="search" />
			</view>
		</view>
		
		<!-- 客户分类 -->
		<view class="tab-section">
			<view class="tab-item" :class="{active: activeTab === 'all'}" @click="switchTab('all')">
				<text>全部</text>
			</view>
			<view class="tab-item" :class="{active: activeTab === 'retail'}" @click="switchTab('retail')">
				<text>零售客户</text>
			</view>
			<view class="tab-item" :class="{active: activeTab === 'wholesale'}" @click="switchTab('wholesale')">
				<text>批发客户</text>
			</view>
			<view class="tab-item" :class="{active: activeTab === 'partner'}" @click="switchTab('partner')">
				<text>合作商</text>
			</view>
		</view>
		
		<!-- 客户列表 -->
		<view class="customer-list">
			<view class="customer-item" v-for="(item, index) in customers" :key="index">
				<view class="customer-avatar">
					<view class="avatar-text">{{item.name.charAt(0)}}</view>
				</view>
				<view class="customer-info">
					<view class="customer-name">{{item.name}}</view>
					<view class="customer-tags">
						<text class="customer-tag" :class="item.type">{{item.typeName}}</text>
						<text class="customer-tag level">{{item.level}}</text>
					</view>
					<view class="customer-contact">{{item.phone}}</view>
				</view>
				<view class="customer-action">
					<view class="action-btn call"></view>
					<view class="action-btn message"></view>
				</view>
			</view>
		</view>
		
		<!-- 客户分析 -->
		<view class="section-title">客户分析</view>
		
		<view class="analytics-grid">
			<view class="analytics-item">
				<view class="analytics-title">客户总数</view>
				<view class="analytics-value">152</view>
				<view class="analytics-trend up">
					<view class="trend-icon"></view>
					<text>11%</text>
				</view>
			</view>
			
			<view class="analytics-item">
				<view class="analytics-title">本月新增</view>
				<view class="analytics-value">28</view>
				<view class="analytics-trend up">
					<view class="trend-icon"></view>
					<text>5%</text>
				</view>
			</view>
			
			<view class="analytics-item">
				<view class="analytics-title">客单价</view>
				<view class="analytics-value">¥189</view>
				<view class="analytics-trend down">
					<view class="trend-icon"></view>
					<text>3%</text>
				</view>
			</view>
			
			<view class="analytics-item">
				<view class="analytics-title">忠诚度</view>
				<view class="analytics-value">78%</view>
				<view class="analytics-trend up">
					<view class="trend-icon"></view>
					<text>7%</text>
				</view>
			</view>
		</view>
		
		<!-- 客户活动 -->
		<view class="section-title">最近活动</view>
		
		<view class="activity-list">
			<view class="activity-item" v-for="(item, index) in 3" :key="index">
				<view class="activity-info">
					<view class="activity-title">客户回访计划</view>
					<view class="activity-desc">零售客户季度回访，提升客户黏性</view>
					<view class="activity-time">2023/0{{index+1}}/15 开始</view>
				</view>
				<view class="activity-status">进行中</view>
			</view>
		</view>
		
		<!-- 底部导航 -->
		<view class="bottom-nav">
			<view class="nav-item active">
				<view class="nav-icon customer-icon"></view>
				<text>客户</text>
			</view>
			<view class="nav-item">
				<view class="nav-icon group-icon"></view>
				<text>分组</text>
			</view>
			<view class="nav-item">
				<view class="nav-icon report-icon"></view>
				<text>报表</text>
			</view>
			<view class="nav-item">
				<view class="nav-icon settings-icon"></view>
				<text>设置</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const activeTab = ref('all');
const customers = ref([
	{
		name: '李农户',
		typeName: '零售客户',
		type: 'retail',
		level: 'VIP1',
		phone: '138****6666'
	},
	{
		name: '王批发',
		typeName: '批发客户',
		type: 'wholesale',
		level: 'VIP2',
		phone: '139****8888'
	},
	{
		name: '张农资',
		typeName: '合作商',
		type: 'partner',
		level: 'VIP3',
		phone: '137****7777'
	},
	{
		name: '刘种子',
		typeName: '零售客户',
		type: 'retail',
		level: 'VIP1',
		phone: '135****5555'
	}
]);

const switchTab = (tab) => {
	activeTab.value = tab;
	// 可以在这里添加筛选逻辑
};

const goBack = () => {
	uni.reLaunch({
		url: '/pages/home/home',
		animationType: 'slide-out-right'
	});
};

onMounted(() => {
	// 页面加载动画
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
.customer-container {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	background-color: #f5f7fa;
	padding-bottom: 120rpx;
}

/* 顶部导航 */
.customer-header {
	padding: 20rpx;
	padding-top: calc(20rpx + var(--status-bar-height));
	display: flex;
	align-items: center;
	background-color: #9AE681;
	position: sticky;
	top: 0;
	z-index: 100;
	animation: slideInDown 0.5s ease-out;
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

.add-button {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 48rpx;
	font-weight: bold;
	color: #333;
	transition: all 0.3s ease;
}

.add-button:active {
	transform: scale(0.9) rotate(90deg);
}

/* 搜索区域 */
.search-area {
	padding: 20rpx;
	animation: fadeIn 0.6s ease-out;
}

.search-box {
	height: 72rpx;
	background-color: white;
	border-radius: 36rpx;
	display: flex;
	align-items: center;
	padding: 0 30rpx;
	box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
}

.search-icon {
	width: 36rpx;
	height: 36rpx;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23999' d='M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'/%3E%3C/svg%3E");
	background-repeat: no-repeat;
	background-position: center;
	background-size: contain;
	margin-right: 10rpx;
}

.search-box input {
	flex: 1;
	height: 72rpx;
	font-size: 28rpx;
	color: #333;
}

/* 客户分类标签 */
.tab-section {
	display: flex;
	height: 88rpx;
	background-color: white;
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
	color: #42b872;
	font-weight: bold;
}

.tab-item.active::after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	width: 40rpx;
	height: 4rpx;
	background-color: #42b872;
	border-radius: 2rpx;
}

/* 客户列表 */
.customer-list {
	padding: 20rpx;
}

.customer-item {
	display: flex;
	align-items: center;
	background-color: white;
	border-radius: 16rpx;
	padding: 20rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
	animation: slideInUp 0.5s ease-out;
}

.customer-avatar {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	background-color: #42b872;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 20rpx;
}

.avatar-text {
	font-size: 36rpx;
	color: white;
	font-weight: bold;
}

.customer-info {
	flex: 1;
}

.customer-name {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 8rpx;
}

.customer-tags {
	display: flex;
	margin-bottom: 8rpx;
}

.customer-tag {
	font-size: 22rpx;
	padding: 2rpx 10rpx;
	border-radius: 10rpx;
	margin-right: 10rpx;
}

.customer-tag.retail {
	background-color: rgba(0, 188, 212, 0.1);
	color: #00BCD4;
}

.customer-tag.wholesale {
	background-color: rgba(255, 152, 0, 0.1);
	color: #FF9800;
}

.customer-tag.partner {
	background-color: rgba(76, 175, 80, 0.1);
	color: #4CAF50;
}

.customer-tag.level {
	background-color: rgba(255, 193, 7, 0.1);
	color: #FFC107;
}

.customer-contact {
	font-size: 26rpx;
	color: #999;
}

.customer-action {
	display: flex;
}

.action-btn {
	width: 60rpx;
	height: 60rpx;
	border-radius: 50%;
	margin-left: 10rpx;
	background-position: center;
	background-repeat: no-repeat;
	background-size: 60%;
	transition: all 0.3s ease;
}

.action-btn:active {
	transform: scale(0.9);
}

.action-btn.call {
	background-color: rgba(76, 175, 80, 0.1);
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%234CAF50' d='M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z'/%3E%3C/svg%3E");
}

.action-btn.message {
	background-color: rgba(33, 150, 243, 0.1);
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%232196F3' d='M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z'/%3E%3C/svg%3E");
}

/* 客户分析 */
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
	background-color: #42b872;
	border-radius: 3rpx;
}

.analytics-grid {
	display: flex;
	flex-wrap: wrap;
	padding: 20rpx;
}

.analytics-item {
	width: calc(50% - 20rpx);
	margin: 10rpx;
	background-color: white;
	border-radius: 16rpx;
	padding: 20rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
	animation: fadeIn 0.6s ease-out;
}

.analytics-title {
	font-size: 26rpx;
	color: #999;
	margin-bottom: 10rpx;
}

.analytics-value {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 10rpx;
}

.analytics-trend {
	display: flex;
	align-items: center;
	font-size: 24rpx;
}

.analytics-trend.up {
	color: #4CAF50;
}

.analytics-trend.down {
	color: #F44336;
}

.trend-icon {
	width: 20rpx;
	height: 20rpx;
	margin-right: 6rpx;
	background-position: center;
	background-repeat: no-repeat;
	background-size: contain;
}

.analytics-trend.up .trend-icon {
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%234CAF50' d='M7 14l5-5 5 5z'/%3E%3C/svg%3E");
}

.analytics-trend.down .trend-icon {
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23F44336' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
}

/* 客户活动 */
.activity-list {
	padding: 20rpx;
}

.activity-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	background-color: white;
	border-radius: 16rpx;
	padding: 20rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
	animation: slideInUp 0.5s ease-out;
}

.activity-info {
	flex: 1;
}

.activity-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 6rpx;
}

.activity-desc {
	font-size: 24rpx;
	color: #999;
	margin-bottom: 6rpx;
}

.activity-time {
	font-size: 22rpx;
	color: #999;
}

.activity-status {
	background-color: rgba(76, 175, 80, 0.1);
	color: #4CAF50;
	font-size: 24rpx;
	padding: 6rpx 16rpx;
	border-radius: 20rpx;
}

/* 底部导航 */
.bottom-nav {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	height: 100rpx;
	background-color: white;
	display: flex;
	border-top: 1rpx solid #f0f0f0;
	z-index: 90;
	animation: slideInUp 0.5s ease-out;
}

.nav-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	font-size: 24rpx;
	color: #999;
	transition: all 0.3s ease;
}

.nav-item.active {
	color: #42b872;
}

.nav-icon {
	width: 48rpx;
	height: 48rpx;
	margin-bottom: 4rpx;
	background-position: center;
	background-repeat: no-repeat;
	background-size: contain;
}

.customer-icon {
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%2342b872' d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E");
}

.group-icon {
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23999' d='M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z'/%3E%3C/svg%3E");
}

.report-icon {
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23999' d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z'/%3E%3C/svg%3E");
}

.settings-icon {
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23999' d='M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z'/%3E%3C/svg%3E");
}

/* 交互效果 */
.customer-item:active {
	transform: scale(0.99);
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05) inset;
}

.analytics-item:active {
	transform: translateY(-3rpx);
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.activity-item:active {
	transform: scale(0.99);
}

.nav-item:active {
	transform: scale(0.9);
}

/* 添加动画关键帧 */
@keyframes fadeIn {
	from { opacity: 0; }
	to { opacity: 1; }
}

@keyframes slideInDown {
	from { 
		transform: translateY(-30rpx);
		opacity: 0;
	}
	to { 
		transform: translateY(0);
		opacity: 1;
	}
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

@keyframes fadeInUp {
	from { 
		transform: translateY(20rpx);
		opacity: 0;
	}
	to { 
		transform: translateY(0);
		opacity: 1;
	}
}

/* 应用动画到页面元素 */
.customer-item:nth-child(1) {
	animation-delay: 0.2s;
}

.customer-item:nth-child(2) {
	animation-delay: 0.3s;
}

.customer-item:nth-child(3) {
	animation-delay: 0.4s;
}

.customer-item:nth-child(4) {
	animation-delay: 0.5s;
}

.analytics-item:nth-child(1) {
	animation-delay: 0.3s;
}

.analytics-item:nth-child(2) {
	animation-delay: 0.4s;
}

.analytics-item:nth-child(3) {
	animation-delay: 0.5s;
}

.analytics-item:nth-child(4) {
	animation-delay: 0.6s;
}

.activity-item:nth-child(1) {
	animation-delay: 0.4s;
}

.activity-item:nth-child(2) {
	animation-delay: 0.5s;
}

.activity-item:nth-child(3) {
	animation-delay: 0.6s;
}
</style> 