<template>
	<view class="certificate-container">
		<!-- 顶部导航 -->
		<view class="certificate-header">
			<view class="back-button" @click="goBack">
				<view class="back-icon"></view>
			</view>
			<view class="header-title">溯源/合格证</view>
		</view>
		
		<!-- 搜索区域 -->
		<view class="search-area">
			<view class="search-box">
				<view class="search-icon"></view>
				<input type="text" placeholder="请输入产品批次号或扫描二维码" confirm-type="search" />
			</view>
			<view class="scan-btn">扫码</view>
		</view>
		
		<!-- 溯源信息卡片 -->
		<view class="section-title">溯源批次</view>
		
		<view class="certificate-list">
			<view class="certificate-card" v-for="(item, index) in 3" :key="index">
				<view class="card-main">
					<view class="certificate-product">有机肥 A19928{{index+1}}</view>
					<text class="certificate-status success">已认证</text>
				</view>
				<view class="certificate-detail">
					<view class="detail-item">
						<text class="detail-label">生产日期:</text>
						<text class="detail-value">2023-0{{index+1}}-15</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">认证日期:</text>
						<text class="detail-value">2023-0{{index+1}}-20</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">有效期至:</text>
						<text class="detail-value">2025-0{{index+1}}-14</text>
					</view>
				</view>
				<view class="card-footer">
					<view class="view-detail">查看详情</view>
					<view class="share-certificate">分享</view>
				</view>
			</view>
		</view>
		
		<!-- 合格证模板 -->
		<view class="section-title">合格证模板</view>
		
		<view class="template-grid">
			<view class="template-item" v-for="(item, index) in 4" :key="index">
				<view class="template-image">
					<view class="placeholder-image">证书{{index+1}}</view>
				</view>
				<view class="template-name">{{templateNames[index]}}</view>
				<view class="template-badge" v-if="index === 0">热门</view>
			</view>
		</view>
		
		<!-- 申请指南 -->
		<view class="section-title">申请指南</view>
		
		<view class="guide-steps">
			<view class="step-item">
				<view class="step-icon">1</view>
				<view class="step-content">
					<view class="step-title">提交产品信息</view>
					<view class="step-desc">包括产品基本信息、生产过程和质量标准</view>
				</view>
			</view>
			
			<view class="step-item">
				<view class="step-icon">2</view>
				<view class="step-content">
					<view class="step-title">缴纳认证费用</view>
					<view class="step-desc">按照产品类型和批次数量确定</view>
				</view>
			</view>
			
			<view class="step-item">
				<view class="step-icon">3</view>
				<view class="step-content">
					<view class="step-title">等待审核认证</view>
					<view class="step-desc">一般需要5-15个工作日完成审核</view>
				</view>
			</view>
			
			<view class="step-item">
				<view class="step-icon">4</view>
				<view class="step-content">
					<view class="step-title">领取电子证书</view>
					<view class="step-desc">审核通过后可下载电子版证书</view>
				</view>
			</view>
		</view>
		
		<!-- 底部按钮 -->
		<view class="bottom-buttons">
			<view class="apply-button">申请认证</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const templateNames = ref(['农产品质量安全认证', '有机产品认证', '绿色食品认证', '地理标志认证']);

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
.certificate-container {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	background-color: #f5f7fa;
	padding-bottom: 120rpx;
}

/* 顶部导航 */
.certificate-header {
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

/* 搜索区域 */
.search-area {
	padding: 20rpx;
	display: flex;
	align-items: center;
	animation: fadeIn 0.6s ease-out;
}

.search-box {
	flex: 1;
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

.scan-btn {
	width: 120rpx;
	height: 72rpx;
	background-color: #42b872;
	color: white;
	border-radius: 36rpx;
	margin-left: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
	transition: all 0.3s ease;
}

.scan-btn:active {
	transform: scale(0.95);
	background-color: #3ca667;
}

/* 溯源信息卡片 */
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

.certificate-list {
	padding: 20rpx;
}

.certificate-card {
	background-color: white;
	border-radius: 16rpx;
	padding: 20rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
	animation: slideInUp 0.5s ease-out;
}

.card-main {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16rpx;
}

.certificate-product {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.certificate-status {
	font-size: 24rpx;
	padding: 4rpx 16rpx;
	border-radius: 30rpx;
}

.certificate-status.success {
	background-color: rgba(76, 175, 80, 0.1);
	color: #42b872;
}

.certificate-detail {
	border-top: 1rpx solid #f0f0f0;
	border-bottom: 1rpx solid #f0f0f0;
	padding: 16rpx 0;
	margin-bottom: 16rpx;
}

.detail-item {
	display: flex;
	font-size: 26rpx;
	margin-bottom: 10rpx;
}

.detail-label {
	color: #999;
	width: 140rpx;
}

.detail-value {
	flex: 1;
	color: #333;
}

.card-footer {
	display: flex;
	justify-content: flex-end;
}

.view-detail, .share-certificate {
	font-size: 26rpx;
	padding: 10rpx 20rpx;
	margin-left: 20rpx;
	border-radius: 30rpx;
	transition: all 0.3s ease;
}

.view-detail {
	border: 1rpx solid #ccc;
	color: #666;
}

.share-certificate {
	background-color: #42b872;
	color: white;
}

.view-detail:active, .share-certificate:active {
	transform: scale(0.95);
}

/* 合格证模板 */
.template-grid {
	display: flex;
	flex-wrap: wrap;
	padding: 20rpx;
}

.template-item {
	width: calc(50% - 20rpx);
	margin: 10rpx;
	position: relative;
	animation: fadeIn 0.6s ease-out;
}

.template-image {
	height: 200rpx;
	background-color: white;
	border-radius: 16rpx;
	margin-bottom: 10rpx;
	overflow: hidden;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.placeholder-image {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #f0f0f0;
	color: #999;
	font-size: 28rpx;
}

.template-name {
	font-size: 26rpx;
	color: #333;
	text-align: center;
}

.template-badge {
	position: absolute;
	top: 10rpx;
	right: 10rpx;
	background-color: #ff6b6b;
	color: white;
	font-size: 20rpx;
	padding: 4rpx 10rpx;
	border-radius: 10rpx;
}

/* 申请指南 */
.guide-steps {
	padding: 20rpx;
}

.step-item {
	display: flex;
	padding: 20rpx;
	background-color: white;
	border-radius: 16rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
	animation: fadeInUp 0.6s ease-out;
}

.step-icon {
	width: 60rpx;
	height: 60rpx;
	background-color: #42b872;
	border-radius: 50%;
	color: white;
	font-size: 28rpx;
	font-weight: bold;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 20rpx;
}

.step-content {
	flex: 1;
}

.step-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 6rpx;
}

.step-desc {
	font-size: 24rpx;
	color: #999;
}

/* 底部按钮 */
.bottom-buttons {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 20rpx;
	background-color: white;
	box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
	z-index: 90;
	animation: slideInUp 0.5s ease-out;
}

.apply-button {
	height: 88rpx;
	background-color: #42b872;
	color: white;
	font-size: 32rpx;
	border-radius: 44rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.3s ease;
}

.apply-button:active {
	transform: scale(0.98);
	background-color: #3ca667;
}

/* 交互效果 */
.search-box:active {
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1) inset;
}

.certificate-card:active {
	transform: scale(0.99);
}

.template-item:active .template-image {
	transform: translateY(-3rpx);
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
	transition: all 0.3s;
}

.step-item:active {
	transform: translateY(-3rpx);
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
	transition: all 0.3s;
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
.certificate-card:nth-child(1) {
	animation-delay: 0.2s;
}

.certificate-card:nth-child(2) {
	animation-delay: 0.3s;
}

.certificate-card:nth-child(3) {
	animation-delay: 0.4s;
}

.template-item:nth-child(1) {
	animation-delay: 0.2s;
}

.template-item:nth-child(2) {
	animation-delay: 0.3s;
}

.template-item:nth-child(3) {
	animation-delay: 0.4s;
}

.template-item:nth-child(4) {
	animation-delay: 0.5s;
}

.step-item:nth-child(1) {
	animation-delay: 0.3s;
}

.step-item:nth-child(2) {
	animation-delay: 0.4s;
}

.step-item:nth-child(3) {
	animation-delay: 0.5s;
}

.step-item:nth-child(4) {
	animation-delay: 0.6s;
}
</style> 