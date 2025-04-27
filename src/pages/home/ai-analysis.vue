<template>
	<view class="ai-analysis-container">
		<!-- 顶部导航栏 -->
		<view class="top-nav-bar">
			<view class="back-button" hover-class="btn-hover" @click="goBack">
				<view class="back-icon"></view>
			</view>
			<view class="page-title">作物智诊</view>
			<view class="right-placeholder"></view>
		</view>
		
		<!-- 主要内容区域 -->
		<view class="content-area">
			<!-- 图像上传区域 -->
			<view class="upload-section" :animation="uploadAnimation">
				<view class="upload-title">上传作物图片进行AI分析</view>
				<view class="upload-box" @click="chooseImage">
					<view class="upload-icon" v-if="!imagePath"></view>
					<image class="preview-image" v-if="imagePath" :src="imagePath" mode="aspectFill"></image>
					<view class="upload-text" v-if="!imagePath">点击上传图片</view>
				</view>
			</view>
			
			<!-- 功能按钮 -->
			<view class="action-buttons" :animation="buttonsAnimation">
				<view class="action-button scan-btn" hover-class="scan-btn-hover" @click="analyzeImage">
					<view class="button-content">
						<view class="button-icon scan-icon"></view>
						<view class="button-text">开始分析</view>
					</view>
					<view class="btn-ripple"></view>
				</view>
				<view class="action-button history-btn" hover-class="history-btn-hover" @click="viewHistory">
					<view class="button-icon history-icon"></view>
					<view class="button-text">历史记录</view>
				</view>
			</view>
			
			<!-- 分析结果区域 -->
			<view class="analysis-result" v-if="hasResult" :animation="resultAnimation">
				<view class="result-header">
					<view class="result-title">分析结果</view>
					<view class="result-time">{{analysisTime}}</view>
				</view>
				
				<view class="result-card">
					<view class="result-item">
						<view class="item-label">作物类型：</view>
						<view class="item-value">{{cropType}}</view>
					</view>
					<view class="result-item">
						<view class="item-label">生长状态：</view>
						<view class="item-value">{{growthStage}}</view>
					</view>
					<view class="result-item">
						<view class="item-label">健康状况：</view>
						<view class="item-value" :class="healthStatus === '健康' ? 'status-good' : 'status-warning'">
							{{healthStatus}}
						</view>
					</view>
					<view class="result-detail" v-if="analysisDetail">
						<view class="detail-title">详细分析：</view>
						<view class="detail-content">{{analysisDetail}}</view>
					</view>
				</view>
				
				<view class="suggestion-section" v-if="suggestions.length > 0">
					<view class="suggestion-title">处理建议</view>
					<view class="suggestion-list">
						<view class="suggestion-item" v-for="(item, index) in suggestions" :key="index">
							<view class="suggestion-icon"></view>
							<view class="suggestion-text">{{item}}</view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 分析历史为空的提示 -->
			<view class="no-result" v-if="!hasResult && isAnalyzed" :animation="noResultAnimation">
				<view class="no-result-icon"></view>
				<view class="no-result-text">尚未识别到作物，请重新上传清晰的作物图片</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { saveAnalysisHistory, getAnalysisHistory } from '@/utils/storage.js';
import api from '@/utils/api.js';

// 页面状态
const imagePath = ref('');
const hasResult = ref(false);
const isAnalyzed = ref(false);
const analysisTime = ref('');
const cropType = ref('');
const growthStage = ref('');
const healthStatus = ref('');
const analysisDetail = ref('');
const suggestions = ref([]);

// 动画控制
const uploadAnimation = ref(null);
const buttonsAnimation = ref(null);
const resultAnimation = ref(null);
const noResultAnimation = ref(null);

// 生命周期钩子
onMounted(() => {
	// 确保使用真实后端API
	api.setApiMode('real');
	console.log('当前API模式:', api.getApiMode());
	console.log('API基础URL:', api.getApiBaseUrl());
	
	playInitialAnimations();
});

// 返回上一页
const goBack = () => {
	uni.navigateBack();
};

// 选择图片
const chooseImage = () => {
	uni.chooseImage({
		count: 1,
		sizeType: ['original', 'compressed'],
		sourceType: ['album', 'camera'],
		success: (res) => {
			imagePath.value = res.tempFilePaths[0];
			// 重置分析结果
			hasResult.value = false;
			isAnalyzed.value = false;
		}
	});
};

// 分析图片
const analyzeImage = () => {
	if (!imagePath.value) {
		uni.showToast({
			title: '请先选择图片',
			icon: 'none'
		});
		return;
	}
	
	// 显示加载
	uni.showLoading({
		title: '正在分析...',
		mask: true
	});
	
	console.log('开始分析图片:', imagePath.value);
	
	// 获取当前环境API基础URL
	const apiBaseUrl = api.getApiBaseUrl();
	console.log('当前API基础URL:', apiBaseUrl);
	
	// 确保使用真实后端API
	api.setApiMode('real');
	
	// 调用API进行分析
	api.analyzeCropImage({
		imagePath: imagePath.value
	}).then(result => {
		uni.hideLoading();
		console.log('分析结果:', result);
				
		if (result.success) {
			// 更新页面数据
			const data = result.data;
			
			analysisTime.value = data.analysisTime;
			cropType.value = data.cropType;
			growthStage.value = data.growthStage;
			healthStatus.value = data.healthStatus;
			analysisDetail.value = data.analysisDetail;
			suggestions.value = data.suggestions || [];
			
			hasResult.value = true;
			isAnalyzed.value = true;
	
			console.log('分析成功，准备保存历史记录');
					
			// 保存到历史记录
			try {
				const historyData = {
					imagePath: imagePath.value,
					analysisTime: analysisTime.value,
					cropType: cropType.value,
					growthStage: growthStage.value,
					healthStatus: healthStatus.value,
					analysisDetail: analysisDetail.value,
					suggestions: suggestions.value
				};
				
				console.log('保存的历史数据:', historyData);
				const saveResult = saveAnalysisHistory(historyData);
				console.log('保存历史记录结果:', saveResult ? '成功' : '失败');
				
				// 添加额外的存储检查
				setTimeout(() => {
					const history = getAnalysisHistory();
					console.log(`存储检查: 当前有${history.length}条历史记录`);
				}, 500);
			} catch (error) {
				console.error('保存历史记录失败:', error);
			}
					
			// 播放结果动画
			playResultAnimation();
		} else {
			// 分析失败的处理
			console.error('分析失败:', result.message);
			
			if (result.code === 401) {
				uni.showToast({
					title: '请先登录',
					icon: 'none'
				});
			} else {
				uni.showToast({
					title: result.message || '分析失败',
					icon: 'none'
				});
				
				isAnalyzed.value = true;
				hasResult.value = false;
				playNoResultAnimation();
			}
		}
	}).catch(err => {
		uni.hideLoading();
		console.error('分析图片失败:', err);
		
		uni.showToast({
			title: '上传图片失败，请检查网络连接',
			icon: 'none'
		});
		
		isAnalyzed.value = true;
		hasResult.value = false;
		playNoResultAnimation();
	});
};

// 查看历史记录
const viewHistory = () => {
	uni.navigateTo({
		url: '/pages/home/analysis-history'
	});
};

// 播放初始动画
const playInitialAnimations = () => {
	// 上传区域动画
	const uploadAnim = uni.createAnimation({
		duration: 500,
		timingFunction: 'ease-out',
		delay: 100
	});
	uploadAnim.opacity(1).translateY(0).step();
	uploadAnimation.value = uploadAnim.export();
	
	// 按钮区域动画
	const buttonsAnim = uni.createAnimation({
		duration: 500,
		timingFunction: 'ease-out',
		delay: 300
	});
	buttonsAnim.opacity(1).translateY(0).step();
	buttonsAnimation.value = buttonsAnim.export();
};

// 播放结果动画
const playResultAnimation = () => {
	const resultAnim = uni.createAnimation({
		duration: 600,
		timingFunction: 'ease-out'
	});
	resultAnim.opacity(1).translateY(0).step();
	resultAnimation.value = resultAnim.export();
};

// 播放无结果动画
const playNoResultAnimation = () => {
	const noResultAnim = uni.createAnimation({
		duration: 600,
		timingFunction: 'ease-out'
	});
	noResultAnim.opacity(1).translateY(0).step();
	noResultAnimation.value = noResultAnim.export();
};
</script>

<style>
.ai-analysis-container {
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
	position: relative;
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

.right-placeholder {
	width: 60rpx;
}

/* 主要内容区域 */
.content-area {
	flex: 1;
	padding: 30rpx;
}

/* 上传区域 */
.upload-section {
	background-color: white;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 30rpx;
	box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.06);
	transform: translateY(20rpx);
	opacity: 0;
}

.upload-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 30rpx;
	text-align: center;
}

.upload-box {
	height: 400rpx;
	border: 2rpx dashed #ccc;
	border-radius: 16rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background-color: #f9f9f9;
	position: relative;
	overflow: hidden;
	transition: all 0.3s ease;
}

.upload-box:active {
	background-color: #f0f0f0;
	transform: scale(0.99);
}

.preview-image {
	width: 100%;
	height: 100%;
}

.upload-icon {
	width: 100rpx;
	height: 100rpx;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%235C6BC0' d='M19 7v2.99s-1.99.01-2 0V7h-3s.01-1.99 0-2h3V2h2v3h3v2h-3zm-3 4V8h-3V5H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8h-3zM5 19l3-4 2 3 3-4 4 5H5z'/%3E%3C/svg%3E");
	background-repeat: no-repeat;
	background-position: center;
	margin-bottom: 20rpx;
	animation: pulse-soft 2s infinite;
}

@keyframes pulse-soft {
	0% {
		transform: scale(1);
	}
	50% {
		transform: scale(1.1);
	}
	100% {
		transform: scale(1);
	}
}

.upload-text {
	font-size: 28rpx;
	color: #666;
}

/* 功能按钮 */
.action-buttons {
	display: flex;
	justify-content: space-between;
	margin-bottom: 40rpx;
	opacity: 0;
	transform: translateY(20rpx);
}

.action-button {
	flex: 1;
	height: 110rpx;
	border-radius: 55rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.3s ease;
	position: relative;
	overflow: hidden;
}

.scan-btn {
	background: linear-gradient(135deg, #5C6BC0, #3949AB);
	color: white;
	margin-right: 20rpx;
	box-shadow: 0 8rpx 20rpx rgba(92, 107, 192, 0.4);
	position: relative;
}

.scan-btn-hover {
	transform: scale(0.97);
	box-shadow: 0 4rpx 10rpx rgba(92, 107, 192, 0.3);
}

.history-btn {
	background-color: white;
	color: #5C6BC0;
	border: 1px solid #e0e0e0;
	box-shadow: 0 6rpx 15rpx rgba(0, 0, 0, 0.05);
}

.history-btn-hover {
	transform: scale(0.97);
	background-color: #f9f9f9;
}

.button-content {
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 2;
	position: relative;
}

.button-icon {
	width: 40rpx;
	height: 40rpx;
	background-repeat: no-repeat;
	background-position: center;
	background-size: contain;
	margin-right: 10rpx;
}

.scan-icon {
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='white' d='M9.5 6.5v3h-3v-3h3M11 5H5v6h6V5zm-1.5 9.5v3h-3v-3h3M11 13H5v6h6v-6zm6.5-6.5v3h-3v-3h3M19 5h-6v6h6V5zm-6 8h1.5v1.5H13V13zm1.5 1.5H16V16h-1.5v-1.5zM16 13h1.5v1.5H16V13zm-3 3h1.5v1.5H13V16zm1.5 1.5H16V19h-1.5v-1.5zM16 16h1.5v1.5H16V16zm1.5-1.5H19V16h-1.5v-1.5zm0 3H19V19h-1.5v-1.5zM22 7h-2V4h-3V2h5v5zm0 15v-5h-2v3h-3v2h5zM2 22h5v-2H4v-3H2v5zM2 2v5h2V4h3V2H2z'/%3E%3C/svg%3E");
}

.history-icon {
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%235C6BC0' d='M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z'/%3E%3C/svg%3E");
}

.button-text {
	font-size: 30rpx;
	font-weight: 600;
	letter-spacing: 1rpx;
}

/* 水波纹效果 */
.btn-ripple {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%);
	transform: scale(0);
	border-radius: 50%;
	opacity: 0;
	z-index: 1;
	animation: ripple 1.5s infinite;
}

@keyframes ripple {
	0% {
		transform: scale(0.5);
		opacity: 0;
	}
	25% {
		opacity: 0.3;
	}
	100% {
		transform: scale(1.8);
		opacity: 0;
	}
}

/* 分析结果区域 */
.analysis-result {
	background-color: white;
	border-radius: 20rpx;
	padding: 30rpx;
	box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.06);
	opacity: 0;
	transform: translateY(20rpx);
}

.result-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
	border-bottom: 1px solid #f0f0f0;
	padding-bottom: 20rpx;
}

.result-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.result-time {
	font-size: 24rpx;
	color: #999;
}

.result-card {
	background-color: #f9f9f9;
	border-radius: 16rpx;
	padding: 25rpx;
	margin-bottom: 30rpx;
}

.result-item {
	display: flex;
	margin-bottom: 18rpx;
}

.item-label {
	width: 180rpx;
	font-size: 28rpx;
	color: #666;
}

.item-value {
	flex: 1;
	font-size: 28rpx;
	color: #333;
	font-weight: 500;
}

.status-good {
	color: #4CAF50;
}

.status-warning {
	color: #FFA000;
}

.result-detail {
	margin-top: 20rpx;
	padding-top: 20rpx;
	border-top: 1px dashed #e0e0e0;
}

.detail-title {
	font-size: 28rpx;
	color: #666;
	margin-bottom: 10rpx;
}

.detail-content {
	font-size: 28rpx;
	color: #333;
	line-height: 1.6;
}

/* 建议部分 */
.suggestion-section {
	margin-top: 30rpx;
}

.suggestion-title {
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 20rpx;
}

.suggestion-item {
	display: flex;
	align-items: center;
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
}

.suggestion-text {
	font-size: 28rpx;
	color: #333;
	line-height: 1.5;
}

/* 无结果状态 */
.no-result {
	padding: 60rpx 40rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background-color: white;
	border-radius: 20rpx;
	margin-top: 30rpx;
	box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.06);
	opacity: 0;
	transform: translateY(20rpx);
}

.no-result-icon {
	width: 120rpx;
	height: 120rpx;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23BDBDBD' d='M18 13v7H4V6h5.02c.05-.71.22-1.38.48-2H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-1.5 5h-11l2.75-3.53 1.96 2.36 2.75-3.54zm2.8-9.11c.44-.7.7-1.51.7-2.39C20 4.01 17.99 2 15.5 2S11 4.01 11 6.5s2.01 4.5 4.49 4.5c.88 0 1.7-.26 2.39-.7L21 13.42 22.42 12 19.3 8.89zM15.5 9C14.12 9 13 7.88 13 6.5S14.12 4 15.5 4 18 5.12 18 6.5 16.88 9 15.5 9z'/%3E%3C/svg%3E");
	background-repeat: no-repeat;
	background-position: center;
	background-size: contain;
	margin-bottom: 20rpx;
	animation: shake 0.8s ease-in-out;
}

@keyframes shake {
	0%, 100% { transform: translateX(0); }
	20%, 60% { transform: translateX(-10rpx); }
	40%, 80% { transform: translateX(10rpx); }
}

.no-result-text {
	font-size: 28rpx;
	color: #666;
	text-align: center;
	line-height: 1.5;
	padding: 0 40rpx;
}
</style> 