<template>
	<view class="monitor-container">
		<!-- 顶部导航 -->
		<view class="monitor-header">
			<view class="back-button" @click="goBack">
				<view class="back-icon"></view>
			</view>
			<view class="header-title">监测</view>
		</view>
		
		<!-- 设备通知条 -->
		<view class="device-notice">
			<text class="notice-text">尚未接入物联网设备!</text>
			<view class="connect-btn">联系客服</view>
		</view>
		
		<!-- 摄像头区域 -->
		<view class="camera-view" :class="{'fullscreen-mode': isFullscreen}">
			<view class="camera-placeholder">
				<view class="camera-icon"></view>
				<text class="camera-text">未接入摄像头</text>
			</view>
			<!-- 全屏按钮 - 修改增加了点击反馈 -->
			<view class="fullscreen-btn" @click.stop.prevent="toggleFullscreen">
				<view class="fullscreen-icon" :class="{'exit-fullscreen': isFullscreen}"></view>
			</view>
			
			<!-- 全屏模式下显示的退出按钮 -->
			<view v-if="isFullscreen" class="exit-btn" @click.stop.prevent="exitFullscreen">
				<text class="exit-text">退出全屏</text>
			</view>
		</view>
		
		<!-- 全屏模式下的旋转提示 -->
		<view v-if="isFullscreen && !isLandscape" class="rotate-hint">
			<view class="rotate-icon"></view>
			<text class="rotate-text">请旋转设备获得更好体验</text>
		</view>
		
		<!-- 侧边 AI 检测 按钮 -->
		<view class="ai-toggle-btn" :class="{ active: detectionEnabled, 'new-event': newEventFlag }" @click="toggleAiMode">
			<view class="item-header">
				<text class="item-title">{{ detectionEnabled ? 'AI检测：已启用' : 'AI检测：未启用' }}</text>
			</view>
			<view class="item-message">
				<text class="item-value">{{ currentEvent }}</text>
			</view>
		</view>
		
		<!-- 全屏 AI 检测 面板 -->
		<transition name="ai-modal">
			<view v-if="showAiMode" class="ai-fullpage">
				<view class="ai-fullpage-header">
					<view class="title">AI 实时检测</view>
					<view class="ai-header-actions">
						<view class="switch-btn" @click.stop="toggleDetection"><text>{{ detectionEnabled ? '停止检测' : '启动检测' }}</text></view>
						<view class="close-btn" @click="toggleAiMode"><text>×</text></view>
					</view>
				</view>
				<scroll-view class="ai-full-events-list" scroll-y>
					<view v-for="(item, index) in aiEvents" :key="index" class="ai-full-event-item">
						<text>{{ item.desc }}</text>
					</view>
				</scroll-view>
			</view>
		</transition>
		<template v-if="!showAiMode">
			<!-- 环境监测 -->
			<view class="section-title">环境监测</view>
			
			<view class="monitor-grid">
				<!-- 土壤温度 -->
				<view class="monitor-item">
					<view class="item-header">
						<text class="item-title">土壤温度</text>
						<text class="item-value">--</text>
					</view>
					<view class="item-unit">单位: ℃</view>
					<view class="item-status">未接入传感器</view>
				</view>
				
				<!-- 土壤湿度 -->
				<view class="monitor-item">
					<view class="item-header">
						<text class="item-title">土壤湿度</text>
						<text class="item-value">--</text>
					</view>
					<view class="item-unit">单位: %</view>
					<view class="item-status">未接入传感器</view>
				</view>
				
				<!-- 铅离子 -->
				<view class="monitor-item">
					<view class="item-header">
						<text class="item-title">铅离子</text>
						<text class="item-value">--</text>
					</view>
					<view class="item-unit">单位: ppb</view>
					<view class="item-status">未接入传感器</view>
				</view>
				
				<!-- 镉离子 -->
				<view class="monitor-item">
					<view class="item-header">
						<text class="item-title">镉离子</text>
						<text class="item-value">--</text>
					</view>
					<view class="item-unit">单位: ppb</view>
					<view class="item-status">未接入传感器</view>
				</view>
				
				<!-- 铝离子 -->
				<view class="monitor-item">
					<view class="item-header">
						<text class="item-title">铝离子</text>
						<text class="item-value">--</text>
					</view>
					<view class="item-unit">单位: ppb</view>
					<view class="item-status">未接入传感器</view>
				</view>
				
				<!-- 钾离子 -->
				<view class="monitor-item">
					<view class="item-header">
						<text class="item-title">钾离子</text>
						<text class="item-value">--</text>
					</view>
					<view class="item-unit">单位: ppb</view>
					<view class="item-status">未接入传感器</view>
				</view>
			</view>
			
			<!-- 气象监测 -->
			<view class="section-title">气象监测</view>
			
			<!-- 远程控制 -->
			<view class="section-title">远程控制</view>
		</template>
	</view>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';

const goBack = () => {
	uni.reLaunch({
		url: '/pages/home/home',
		animationType: 'slide-out-right'
	});
};

// 添加全屏状态和相关方法
const isFullscreen = ref(false);
const isLandscape = ref(false);

// 添加 AI 实时检测 所需状态
const currentEvent = ref('');
const newEventFlag = ref(false);
const aiEvents = ref([]);
// 后台检测是否启用
const detectionEnabled = ref(true);

// 是否展示 AI 全屏模式
const showAiMode = ref(false);
const btnTop = ref(500);
let startY = 0;
let startTop = 0;
const toggleAiMode = () => {
	showAiMode.value = !showAiMode.value;
};
let aiInterval = null;

// 切换后台检测
const toggleDetection = () => {
	detectionEnabled.value = !detectionEnabled.value;
};

// 启动检测（持续随机事件生成）
const startDetection = () => {
	if (aiInterval) clearInterval(aiInterval);
	aiInterval = setInterval(() => {
		const time = new Date().toLocaleTimeString();
		// 每次随机选择不同事件类型
		const randomType = placeholderEventTypes[Math.floor(Math.random() * placeholderEventTypes.length)];
		const eventDesc = `${time}: ${randomType}`;
		// 更新当前事件及列表
		currentEvent.value = eventDesc;
		newEventFlag.value = true;
		setTimeout(() => { newEventFlag.value = false; }, 800);
		aiEvents.value.unshift({ time, desc: eventDesc });
	}, 5000);
};

// 停止检测
const stopDetection = () => {
	if (aiInterval) clearInterval(aiInterval);
};

// 切换全屏模式
const toggleFullscreen = () => {
	console.log('切换全屏模式', isFullscreen.value ? '退出全屏' : '进入全屏');
	isFullscreen.value = !isFullscreen.value;
	
	try {
		if (isFullscreen.value) {
			// 进入全屏模式
			// #ifdef APP-PLUS
			try {
				// 锁定为横屏模式
				plus.screen.lockOrientation('landscape');
				isLandscape.value = true;
				console.log('已锁定横屏');
				
				// 强制横屏 - 使用额外方法确保旋转
				setTimeout(() => {
					try {
						// 尝试使用额外API强制横屏
						const currentOrientation = plus.navigator.getOrientation();
						console.log('当前屏幕方向:', currentOrientation);
						
						if (currentOrientation !== 'landscape-primary' && currentOrientation !== 'landscape-secondary') {
							// 如果不是横屏，尝试强制旋转
							console.log('尝试强制旋转');
							plus.navigator.setOrientation('landscape-primary');
							isLandscape.value = true;
						}
					} catch (err) {
						console.error('强制旋转失败:', err);
					}
				}, 500);
			} catch (error) {
				console.error('横屏锁定失败', error);
				// 如果API不可用，依赖用户手动旋转
				uni.showToast({
					title: '请手动旋转设备至横屏',
					icon: 'none',
					duration: 2000
				});
			}
			// #endif
			
			// H5环境
			// #ifdef H5
			try {
				// 请求全屏
				const docElm = document.documentElement;
				if (docElm.requestFullscreen) {
					docElm.requestFullscreen();
				} else if (docElm.webkitRequestFullScreen) {
					docElm.webkitRequestFullScreen();
				} else if (docElm.mozRequestFullScreen) {
					docElm.mozRequestFullScreen();
				} else if (docElm.msRequestFullscreen) {
					docElm.msRequestFullscreen();
				}
				
				// 监听屏幕方向
				window.addEventListener('orientationchange', checkOrientation);
				checkOrientation();
			} catch (err) {
				console.error('H5全屏请求失败:', err);
			}
			// #endif
			
			uni.showToast({
				title: '已进入全屏模式',
				icon: 'none',
				duration: 1500
			});
		} else {
			exitFullscreen();
		}
	} catch (e) {
		console.error('全屏切换失败:', e);
		uni.showToast({
			title: '全屏切换失败',
			icon: 'none'
		});
	}
};

// 检查屏幕方向
const checkOrientation = () => {
	// #ifdef H5
	if (window.orientation === 90 || window.orientation === -90) {
		isLandscape.value = true;
	} else {
		isLandscape.value = false;
	}
	console.log('当前是否横屏:', isLandscape.value, '方向:', window.orientation);
	// #endif
};

// 退出全屏模式
const exitFullscreen = () => {
	console.log('执行退出全屏');
	isFullscreen.value = false;
	isLandscape.value = false;
	
	// #ifdef APP-PLUS
	try {
		plus.screen.lockOrientation('portrait');
		console.log('已恢复竖屏');
		
		// 额外尝试强制恢复竖屏
		try {
			plus.navigator.setOrientation('portrait-primary');
		} catch (err) {
			console.error('强制恢复竖屏失败:', err);
		}
	} catch (error) {
		console.error('竖屏恢复失败', error);
	}
	// #endif
	
	// #ifdef H5
	try {
		// 退出全屏
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		}
		
		// 移除事件监听
		window.removeEventListener('orientationchange', checkOrientation);
	} catch (err) {
		console.error('H5退出全屏失败:', err);
	}
	// #endif
	
	uni.showToast({
		title: '已退出全屏模式',
		icon: 'none',
		duration: 1500
	});
};

// 预定义丰富的占位事件类型
const placeholderEventTypes = [
	'动物入侵农田',
	'农田疑似火灾',
	'检测到害虫危害',
	'无人机飞过区域',
	'设备异常断电',
	'水源含量过低',
	'温度骤升异常',
	'土壤酸碱度异常',
];

// 随机生成时间字符串，基于当前时间向前偏移0-10分钟
function randomTimeString() {
	const now = Date.now();
	const offset = Math.floor(Math.random() * 600000); // 0~600 秒
	const date = new Date(now - offset);
	return date.toLocaleTimeString();
}

// 生成随机占位事件列表
function generatePlaceholderEvents(count = 5) {
	const events = [];
	for (let i = 0; i < count; i++) {
		const type = placeholderEventTypes[Math.floor(Math.random() * placeholderEventTypes.length)];
		const time = randomTimeString();
		events.push({ time, desc: `${time}: ${type}` });
	}
	return events;
}

// 监听返回键 - 修复退出键监听
onMounted(() => {
	// 页面加载动画
	uni.showLoading({
		title: '正在连接设备...',
		mask: true
	});
	
	setTimeout(() => {
		uni.hideLoading();
		uni.showToast({
			title: '设备连接失败',
			icon: 'none',
			duration: 2000
		});
	}, 1500);
	
	// 监听物理返回键
	// #ifdef APP-PLUS
	plus.key.addEventListener('backbutton', () => {
		if (isFullscreen.value) {
			exitFullscreen();
			return true; // 阻止默认返回行为
		}
		return false; // 不阻止默认返回行为
	});
	// #endif

	// #ifdef H5
	// 监听H5全屏变化
	document.addEventListener('fullscreenchange', handleFullscreenChange);
	document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
	document.addEventListener('mozfullscreenchange', handleFullscreenChange);
	document.addEventListener('MSFullscreenChange', handleFullscreenChange);
	// #endif

	// 初始化空事件列表
	aiEvents.value = [];
	// 默认启用检测
	if (detectionEnabled.value) startDetection();
	// 监听检测开关
	watch(detectionEnabled, enabled => {
		if (enabled) {
			startDetection();
		} else {
			stopDetection();
		}
	});
});

// 处理H5全屏变化
const handleFullscreenChange = () => {
	// #ifdef H5
	const isDocFullscreen = document.fullscreenElement || 
		document.webkitFullscreenElement || 
		document.mozFullScreenElement || 
		document.msFullscreenElement;
		
	// 如果用户通过其他方式退出了全屏（如按ESC键）
	if (!isDocFullscreen && isFullscreen.value) {
		exitFullscreen();
	}
	// #endif
};

// 在页面卸载时清理监听器
onUnmounted(() => {
	// 确保恢复竖屏
	if (isFullscreen.value) {
		// #ifdef APP-PLUS
		try {
			plus.screen.lockOrientation('portrait');
		} catch (e) {
			console.error('恢复竖屏失败:', e);
		}
		// #endif
	}
	
	// #ifdef APP-PLUS
	// 移除返回键监听
	try {
		plus.key.removeEventListener('backbutton');
	} catch (e) {
		console.error('移除监听器失败:', e);
	}
	// #endif

	// #ifdef H5
	// 移除H5全屏监听
	document.removeEventListener('fullscreenchange', handleFullscreenChange);
	document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
	document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
	document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
	window.removeEventListener('orientationchange', checkOrientation);
	// #endif

	// 清理 AI 检测定时器
	stopDetection();
});

// 处理拖拽开始
const onDragStart = (e) => {
	startY = e.touches ? e.touches[0].clientY : e.clientY;
	startTop = btnTop.value;
};

// 拖拽移动
const onDragging = (e) => {
	const clientY = e.touches ? e.touches[0].clientY : e.clientY;
	const delta = clientY - startY;
	let newTop = startTop + delta;
	if (newTop < 0) newTop = 0;
	// 假设容器高度2000rpx为边界，根据页面可修改
	if (newTop > 1500) newTop = 1500;
	btnTop.value = newTop;
};

// 拖拽结束
const onDragEnd = () => {};
</script>

<style>
.monitor-container {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	background-color: #f5f7fa;
}

/* 顶部导航 */
.monitor-header {
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
	background-color: #eafdda;
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
	background-color: #ff9a43;
	color: white;
	font-size: 24rpx;
	padding: 8rpx 20rpx;
	border-radius: 20rpx;
	transition: all 0.3s ease;
}

.connect-btn:active {
	transform: scale(0.95);
	background-color: #f38c2e;
}

/* 摄像头区域 */
.camera-view {
	width: 100%;
	height: 380rpx;
	background-color: #e6f0f9;
	display: flex;
	align-items: center;
	justify-content: center;
	animation: fadeIn 0.8s ease-out;
	position: relative;
	overflow: hidden;
	transition: all 0.3s ease;
}

/* 全屏模式样式 */
.camera-view.fullscreen-mode {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	width: 100vw;
	height: 100vh;
	z-index: 9999;
	background-color: #000;
}

/* 全屏按钮样式 */
.fullscreen-btn {
	position: absolute;
	bottom: 20rpx;
	right: 20rpx;
	width: 80rpx;
	height: 80rpx;
	background-color: rgba(0, 0, 0, 0.5);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
	transition: all 0.3s ease;
}

.fullscreen-btn:active {
	transform: scale(0.9);
	background-color: rgba(0, 0, 0, 0.7);
}

.fullscreen-icon {
	width: 40rpx;
	height: 40rpx;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23fff' d='M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z'/%3E%3C/svg%3E");
	background-repeat: no-repeat;
	background-position: center;
	background-size: contain;
	transition: all 0.3s ease;
}

.fullscreen-icon.exit-fullscreen {
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23fff' d='M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z'/%3E%3C/svg%3E");
}

/* 退出全屏按钮 */
.exit-btn {
	position: absolute;
	top: 30rpx;
	right: 30rpx;
	background-color: rgba(0, 0, 0, 0.5);
	padding: 10rpx 20rpx;
	border-radius: 30rpx;
	z-index: 1000;
}

.exit-btn:active {
	background-color: rgba(0, 0, 0, 0.7);
	transform: scale(0.95);
}

.exit-text {
	color: #ffffff;
	font-size: 24rpx;
}

.camera-placeholder {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	animation: fadeIn 1s ease-out;
}

.camera-icon {
	width: 100rpx;
	height: 100rpx;
	background-color: #b3cde6;
	border-radius: 50%;
	margin-bottom: 20rpx;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23fff' d='M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z'/%3E%3C/svg%3E");
	background-repeat: no-repeat;
	background-position: center;
	background-size: 60%;
	animation: pulse 2s infinite ease-in-out;
}

.camera-text {
	font-size: 28rpx;
	color: #999;
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
	background-color: #9AE681;
	border-radius: 3rpx;
}

.monitor-grid {
	display: flex;
	flex-wrap: wrap;
	padding: 20rpx;
}

.monitor-item {
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

.item-value {
	font-size: 32rpx;
	color: #333;
	animation: dataPulse 3s infinite;
}

.item-unit {
	font-size: 24rpx;
	color: #999;
	margin-bottom: 6rpx;
}

.item-status {
	font-size: 24rpx;
	color: #999;
	text-align: center;
	background-color: #f5f5f5;
	padding: 6rpx 0;
	border-radius: 4rpx;
}

/* 交互效果 */
.monitor-item:hover {
	transform: translateY(-3rpx);
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
	transition: all 0.3s;
}

.connect-btn:hover {
	background-color: #ff8c2e;
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
	0% { transform: scale(1); }
	50% { transform: scale(1.05); }
	100% { transform: scale(1); }
}

/* 应用动画到页面元素 */
.monitor-header {
	animation: fadeIn 0.5s ease-out;
}

.device-notice {
	animation: slideInUp 0.6s ease-out;
}

.camera-view {
	animation: fadeIn 0.8s ease-out;
}

.camera-placeholder {
	animation: fadeIn 1s ease-out;
}

.camera-icon {
	animation: pulse 2s infinite ease-in-out;
}

.section-title {
	animation: fadeInLeft 0.7s ease-out;
}

.monitor-item {
	opacity: 0;
	animation: slideInUp 0.5s ease-out forwards;
}

.monitor-item:nth-child(1) {
	animation-delay: 0.3s;
}

.monitor-item:nth-child(2) {
	animation-delay: 0.4s;
}

.monitor-item:nth-child(3) {
	animation-delay: 0.5s;
}

.monitor-item:nth-child(4) {
	animation-delay: 0.6s;
}

.monitor-item:nth-child(5) {
	animation-delay: 0.7s;
}

.monitor-item:nth-child(6) {
	animation-delay: 0.8s;
}

/* 添加交互效果 */
.connect-btn {
	transition: all 0.3s ease;
}

.connect-btn:active {
	transform: scale(0.95);
	background-color: #f38c2e;
}

.monitor-item {
	transition: all 0.3s ease;
}

.monitor-item:active {
	transform: translateY(-5rpx);
	box-shadow: 0 8rpx 16rpx rgba(0, 0, 0, 0.1);
}

.back-button {
	transition: all 0.3s ease;
}

.back-button:active {
	transform: scale(0.9);
}

/* 添加传感器数据闪烁提示效果 */
@keyframes dataPulse {
	0% { color: #333; }
	50% { color: #9AE681; }
	100% { color: #333; }
}

.item-value {
	animation: dataPulse 3s infinite;
}

/* 横屏提示样式 */
.rotate-hint {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background-color: rgba(0, 0, 0, 0.7);
	border-radius: 12rpx;
	padding: 20rpx 30rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	animation: fadeIn 1s ease-out;
	z-index: 1001;
}

.rotate-icon {
	width: 70rpx;
	height: 70rpx;
	margin-bottom: 10rpx;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23fff' d='M16.48 2.52c3.27 1.55 5.61 4.72 5.97 8.48h1.5C23.44 4.84 18.29 0 12 0l-.66.03 3.81 3.81 1.33-1.32zm-6.25-.77c-.59-.59-1.54-.59-2.12 0L1.75 8.11c-.59.59-.59 1.54 0 2.12l12.02 12.02c.59.59 1.54.59 2.12 0l6.36-6.36c.59-.59.59-1.54 0-2.12L10.23 1.75zm4.6 19.44L2.81 9.17l6.36-6.36 12.02 12.02-6.36 6.36zm-7.31.29C4.25 19.94 1.91 16.76 1.55 13H.05C.56 19.16 5.71 24 12 24l.66-.03-3.81-3.81-1.33 1.32z'/%3E%3C/svg%3E");
	background-repeat: no-repeat;
	background-position: center;
	background-size: contain;
	animation: rotate 2s infinite linear;
}

.rotate-text {
	color: white;
	font-size: 24rpx;
}

@keyframes rotate {
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
}

/* AI 切换 按钮 */
.ai-toggle-btn {
	position: fixed;
	bottom: 20rpx;
	right: 20rpx;
	width: 220rpx;
	background-color: #fff;
	border-radius: 16rpx;
	padding: 16rpx;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
	z-index: 2000;
	transition: background-color 0.3s, box-shadow 0.3s;
}
.ai-toggle-btn:hover {
	transform: scale(1.03);
}
.ai-toggle-btn.active {
	background-color: #9AE681;
	box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
}
.ai-toggle-btn.new-event {
	animation: blink 0.8s ease;
}
@keyframes blink {
	0%, 100% { opacity: 1; }
	50% { opacity: 0.4; }
}

.ai-toggle-btn .item-title {
	color: #333;
	font-size: 28rpx;
	font-weight: bold;
}

.ai-toggle-btn.active .item-title {
	color: #fff;
}

.ai-toggle-btn .item-message {
	margin-top: 6rpx;
}

.ai-toggle-btn .item-value {
	color: #666;
	font-size: 24rpx;
	line-height: 1.4;
	white-space: normal;
	word-wrap: break-word;
	max-height: 64rpx;
	overflow: hidden;
}

/* 全屏 AI 检测 模式 */
.ai-fullpage {
	/* 模仿监测项卡样式 */
	background-color: #fff;
	border-radius: 16rpx;
	padding: 20rpx;
	margin: 20rpx;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
}

.ai-fullpage-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
	/* 标题样式 */
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.ai-exit-btn text {
	color: #ff9a43;
	font-size: 28rpx;
}

.ai-full-events-list {
	/* 列表区域，与监测网格一致 */
	display: flex;
	flex-direction: column;
	width: 100%;
}

.ai-full-event-item {
	padding: 16rpx 0;
	border-bottom: 1rpx solid #f5f7fa;
	font-size: 28rpx;
	color: #333;
}

/* AI 全屏检测 标题 */
.ai-fullpage-header .title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  position: relative;
  padding-bottom: 10rpx;
}
.ai-fullpage-header .title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 90rpx;
  height: 6rpx;
  background-color: #9AE681;
  border-radius: 3rpx;
}

/* AI 全屏检测 动效 */
.ai-modal-enter-active, .ai-modal-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.ai-modal-enter-from, .ai-modal-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
.ai-modal-enter-to, .ai-modal-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.ai-detect-switch {
  background-color: #9AE681;
  padding: 8rpx 12rpx;
  border-radius: 8rpx;
  margin-right: 20rpx;
}

.ai-detect-switch text {
  color: #fff;
  font-size: 24rpx;
}

.ai-header-actions {
  display: flex;
  align-items: center;
}

.switch-btn {
  background-color: #9AE681;
  padding: 8rpx 12rpx;
  border-radius: 8rpx;
  margin-right: 12rpx;
}

.switch-btn text {
  color: #fff;
  font-size: 24rpx;
}

.close-btn {
  background-color: #fff;
  border: 1rpx solid #eee;
  border-radius: 8rpx;
  padding: 8rpx;
}

.close-btn text {
  color: #999;
  font-size: 28rpx;
}
</style> 