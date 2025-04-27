<template>
	<view class="home-container">
		<!-- 顶部导航栏 -->
		<view class="top-nav-bar">
			<view class="user-avatar" @click="goToProfile">
				<view class="avatar-icon"></view>
			</view>
			<view class="app-name">{{currentTab === 'profile' ? '个人中心' : (currentTab === 'market' ? '农资市场' : (currentTab === 'message' ? '消息中心' : (currentTab === 'cart' ? '购物车' : '农田助理')))}}</view>
			<view class="notification-icon" @click="goToNotifications"></view>
		</view>
		
		<!-- 基于当前标签显示不同内容 -->
		<view v-if="currentTab === 'home'">
			<!-- 农田概况 -->
			<view class="farm-overview">
				<view class="overview-title">农田概况</view>
				<view class="stats-container">
					<view class="stat-item">
						<view class="stat-value">{{ farmArea }}</view>
						<view class="stat-label">农场面积</view>
					</view>
					<view class="stat-item">
						<view class="stat-value">4种</view>
						<view class="stat-label">农作物品种</view>
					</view>
				</view>
			</view>
			
			<!-- 功能区块 -->
			<view class="function-section">
				<!-- 田野情况 -->
				<view class="function-card">
					<view class="card-title">田野情况</view>
					<view class="function-grid">
						<view class="function-item" @click="goToInfrared">
							<view class="function-icon infrared-icon"></view>
							<view class="function-name">红外检测</view>
						</view>
						<view class="function-item" @click="goToOperation">
							<view class="function-icon operation-icon"></view>
							<view class="function-name">农事操作</view>
						</view>
						<view class="function-item" @click="goToMonitor">
							<view class="function-icon camera-icon"></view>
							<view class="function-name">摄像头监控</view>
						</view>
						<view class="function-item" @click="goToAiAnalysis">
							<view class="function-icon ai-analysis-icon"></view>
							<view class="function-name">作物智诊</view>
						</view>
						<view class="function-item" @click="goToHumidity">
							<view class="function-icon humidity-icon"></view>
							<view class="function-name">空气湿度</view>
						</view>
						<view class="function-item" @click="goToTemperature">
							<view class="function-icon temperature-icon"></view>
							<view class="function-name">农田温度</view>
						</view>
					</view>
				</view>
				
				<!-- 农场经营 -->
				<view class="function-card">
					<view class="card-title">农场经营</view>
					<view class="function-grid">
						<view class="function-item" @click="goToProducts">
							<view class="function-icon product-icon"></view>
							<view class="function-name">产品库</view>
						</view>
						<view class="function-item" @click="goToCertificate">
							<view class="function-icon certificate-icon"></view>
							<view class="function-name">溯源/合格证</view>
						</view>
						<view class="function-item" @click="goToOrders">
							<view class="function-icon order-icon"></view>
							<view class="function-name">订单</view>
						</view>
						<view class="function-item" @click="goToCustomer">
							<view class="function-icon customer-icon"></view>
							<view class="function-name">客户管理</view>
						</view>
						<view class="function-item" @click="goToSales">
							<view class="function-icon sales-icon"></view>
							<view class="function-name">产销对接</view>
						</view>
						<view class="function-item" @click="goToReport">
							<view class="function-icon report-icon"></view>
							<view class="function-name">经营报表</view>
						</view>
					</view>
				</view>
				
				<!-- 监测警报 -->
				<view class="function-card">
					<view class="card-title">监测警报</view>
					<view class="function-grid warning-grid">
						<view class="function-item" @click="goToInsect">
							<view class="function-icon insect-icon"></view>
							<view class="function-name">虫灾侵害</view>
						</view>
						<view class="function-item" @click="goToBird">
							<view class="function-icon bird-icon"></view>
							<view class="function-name">鸟类侵害</view>
						</view>
						<view class="function-item" @click="goToWeather">
							<view class="function-icon weather-icon"></view>
							<view class="function-name">雨水高温</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 农资市场页面 -->
		<view v-if="currentTab === 'market'" class="content-container">
			<view class="page-container">
				<view class="page-header">
					<view class="header-title">农资市场</view>
				</view>
				
				<view class="market-categories">
					<view class="category-item">
						<view class="category-icon seed-icon"></view>
						<view class="category-name">种子种苗</view>
					</view>
					<view class="category-item">
						<view class="category-icon fertilizer-icon"></view>
						<view class="category-name">肥料</view>
					</view>
					<view class="category-item">
						<view class="category-icon pesticide-icon"></view>
						<view class="category-name">农药</view>
					</view>
					<view class="category-item">
						<view class="category-icon tool-icon"></view>
						<view class="category-name">农具</view>
					</view>
				</view>
				
				<view class="recommend-products">
					<view class="section-title">推荐产品</view>
					<view class="product-list">
						<view class="product-card">
							<view class="product-image wheat-seed-image">
								<view class="product-tag">热销</view>
							</view>
							<view class="product-info">
								<view class="product-name">优质小麦种子</view>
								<view class="product-price">120<text class="price-unit">/袋</text></view>
							</view>
						</view>
						<view class="product-card">
							<view class="product-image fertilizer-image">
								<view class="product-tag">有机</view>
							</view>
							<view class="product-info">
								<view class="product-name">有机复合肥</view>
								<view class="product-price">89<text class="price-unit">/袋</text></view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 消息中心页面 -->
		<view v-if="currentTab === 'message'" class="content-container">
			<view class="page-container">
				<view class="message-list">
					<view class="message-item">
						<view class="message-avatar system-avatar"></view>
						<view class="message-content">
							<view class="message-title">系统通知</view>
							<view class="message-text">您的农田温度监测报告已更新</view>
							<view class="message-time">今天 08:30</view>
						</view>
					</view>
					<view class="message-item">
						<view class="message-avatar expert-avatar"></view>
						<view class="message-content">
							<view class="message-title">种植专家</view>
							<view class="message-text">根据您的农田情况，建议适当增加灌溉频率</view>
							<view class="message-time">昨天 16:45</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 购物车页面 -->
		<view v-if="currentTab === 'cart'" class="content-container">
			<view class="page-container">
				<view class="empty-cart" v-if="true">
					<view class="empty-icon"></view>
					<view class="empty-text">购物车还是空的</view>
					<view class="go-shopping-btn" @click="switchTab('market')">去购物</view>
				</view>
			</view>
		</view>
		
		<!-- 个人中心页面 -->
		<view v-if="currentTab === 'profile'" class="content-container">
			<view class="profile-section">
				<view class="profile-header">
					<view class="profile-avatar">
						<view class="avatar-large"></view>
					</view>
					<view class="profile-info">
						<view class="profile-name">张农夫</view>
						<view class="profile-phone">135****6789</view>
					</view>
					<view class="edit-profile-btn">编辑</view>
				</view>
				
				<view class="profile-stats">
					<view class="stat-block">
						<view class="stat-number">{{farmArea}}</view>
						<view class="stat-name">我的农田</view>
					</view>
					<view class="stat-block">
						<view class="stat-number">3年</view>
						<view class="stat-name">耕种年限</view>
					</view>
					<view class="stat-block">
						<view class="stat-number">8单</view>
						<view class="stat-name">历史订单</view>
					</view>
				</view>
				
				<view class="menu-section">
					<view class="menu-group">
						<view class="menu-title">我的服务</view>
						<view class="menu-grid">
							<view class="menu-item">
								<view class="menu-icon wallet-icon"></view>
								<view class="menu-name">我的钱包</view>
							</view>
							<view class="menu-item">
								<view class="menu-icon address-icon"></view>
								<view class="menu-name">收货地址</view>
							</view>
							<view class="menu-item">
								<view class="menu-icon coupon-icon"></view>
								<view class="menu-name">优惠券</view>
							</view>
							<view class="menu-item">
								<view class="menu-icon favorite-icon"></view>
								<view class="menu-name">我的收藏</view>
							</view>
						</view>
					</view>
					
					<view class="menu-group">
						<view class="menu-title">更多服务</view>
						<view class="menu-list">
							<view class="list-item">
								<view class="item-icon help-icon"></view>
								<view class="item-name">帮助中心</view>
								<view class="item-arrow"></view>
							</view>
							<view class="list-item">
								<view class="item-icon feedback-icon"></view>
								<view class="item-name">意见反馈</view>
								<view class="item-arrow"></view>
							</view>
							<view class="list-item">
								<view class="item-icon about-icon"></view>
								<view class="item-name">关于我们</view>
								<view class="item-arrow"></view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 底部信息 -->
		<view class="footer" v-if="currentTab === 'home'">
			<view class="hotline">服务热线：400-16988-03</view>
			<view class="copyright">版权所有</view>
		</view>
        
        <!-- 底部导航栏 -->
        <view class="tabbar" :class="{'tabbar-hidden': isTabbarHidden}">
            <view class="tabbar-item" :class="{'tabbar-item-active': currentTab === 'home'}" @click="switchTab('home')">
                <view class="tabbar-icon home-icon"></view>
                <view class="tabbar-text">首页</view>
            </view>
            <view class="tabbar-item" :class="{'tabbar-item-active': currentTab === 'market'}" @click="switchTab('market')">
                <view class="tabbar-icon market-icon"></view>
                <view class="tabbar-text">农资</view>
            </view>
            <view class="tabbar-item" :class="{'tabbar-item-active': currentTab === 'message'}" @click="switchTab('message')">
                <view class="tabbar-icon message-icon"></view>
                <view class="tabbar-text">消息</view>
            </view>
            <view class="tabbar-item" :class="{'tabbar-item-active': currentTab === 'cart'}" @click="switchTab('cart')">
                <view class="tabbar-icon cart-icon"></view>
                <view class="tabbar-text">购物车</view>
            </view>
            <view class="tabbar-item" :class="{'tabbar-item-active': currentTab === 'profile'}" @click="switchTab('profile')">
                <view class="tabbar-icon profile-icon"></view>
                <view class="tabbar-text">我的</view>
            </view>
        </view>
	</view>
</template>

<script setup>
import { onMounted, ref, onBeforeUnmount } from 'vue';
import { onShow, onHide } from '@dcloudio/uni-app';

// 农场面积数据
const farmArea = ref('0亩');

// 当前选中的标签页
const currentTab = ref('home');

// 页面滚动位置
const scrollTop = ref(0);
const lastScrollTop = ref(0);
const isTabbarHidden = ref(false);

// 监听页面滚动
const onPageScroll = (e) => {
    // 更新滚动位置
    lastScrollTop.value = scrollTop.value;
    scrollTop.value = e.scrollTop;
    
    // 判断滚动方向，向下滚动超过50px时隐藏导航栏
    if (scrollTop.value > lastScrollTop.value && scrollTop.value > 150) {
        isTabbarHidden.value = true;
    } else {
        isTabbarHidden.value = false;
    }
};

// 切换标签页
const switchTab = (tab) => {
    // 如果已经在当前标签页，不做任何操作
    if (currentTab.value === tab) return;
    
    // 更新当前选中的标签页
    currentTab.value = tab;
    
    // 这里仅切换内容区的显示，不进行页面跳转
    // 可以通过组件显示/隐藏或者其他方式在同一页面内切换内容
    
    // 如果需要实际跳转到其他独立页面，可以使用下面注释的代码
    /*
    switch(tab) {
        case 'home':
            // 已经在首页
            break;
        case 'market':
            uni.navigateTo({
                url: '/pages/market/market'
            });
            break;
        case 'message':
            uni.navigateTo({
                url: '/pages/message/message'
            });
            break;
        case 'cart':
            uni.navigateTo({
                url: '/pages/cart/cart'
            });
            break;
        case 'profile':
            goToProfile();
            break;
    }
    */
};

// 加载用户农场面积
const loadFarmArea = () => {
	// 先尝试从userInfo中读取
	const userInfo = uni.getStorageSync('userInfo');
	if (userInfo && userInfo.farmArea) {
		farmArea.value = userInfo.farmArea + '亩';
		return;
	}
	
	// 如果userInfo中没有，尝试从currentUser中读取
	try {
		let currentUser = uni.getStorageSync('currentUser');
		let userData;
		
		if (typeof currentUser === 'string') {
			userData = JSON.parse(currentUser || '{}');
		} else {
			userData = currentUser || {};
		}
		
		if (userData && userData.farmArea) {
			farmArea.value = userData.farmArea + '亩';
			
			// 如果从currentUser读取成功，同步到userInfo
			if (userInfo) {
				userInfo.farmArea = userData.farmArea;
				uni.setStorageSync('userInfo', userInfo);
			}
		}
	} catch (error) {
		console.error('读取农场面积失败:', error);
		// 使用默认值
		farmArea.value = '100亩';
	}
};

// 监听农场面积更新事件，实时更新显示
const handleFarmAreaUpdate = (data) => {
	if (data && data.farmArea) {
		// 移除可能的"亩"字以避免重复
		farmArea.value = data.farmArea.toString().replace('亩', '') + '亩';
	}
};

// 设置事件监听
const setupEventListeners = () => {
	uni.$on('farmAreaUpdated', handleFarmAreaUpdate);
};

// 移除事件监听
const removeEventListeners = () => {
	uni.$off('farmAreaUpdated', handleFarmAreaUpdate);
};

// 使用uni-app提供的onShow生命周期钩子
onShow(() => {
	console.log('页面显示了，刷新农场面积数据');
	// 刷新一次数据
	loadFarmArea();
});

// 可以在这里添加页面逻辑
const goToMonitor = () => {
	uni.navigateTo({
		url: '/pages/home/monitor'
	});
};

const goToProducts = () => {
	uni.navigateTo({
		url: '/pages/home/products'
	});
};

const goToOrders = () => {
	uni.navigateTo({
		url: '/pages/home/orders'
	});
};

// 新增功能页面跳转
const goToInfrared = () => {
	uni.navigateTo({
		url: '/pages/home/infrared'
	});
};

const goToOperation = () => {
	uni.navigateTo({
		url: '/pages/home/operation'
	});
};

const goToHumidity = () => {
	uni.navigateTo({
		url: '/pages/home/humidity'
	});
};

const goToTemperature = () => {
	uni.navigateTo({
		url: '/pages/home/temperature'
	});
};

const goToAiAnalysis = () => {
	uni.navigateTo({
		url: '/pages/home/ai-analysis'
	});
};

const goToCertificate = () => {
	uni.navigateTo({
		url: '/pages/home/certificate'
	});
};

const goToCustomer = () => {
	uni.navigateTo({
		url: '/pages/home/customer'
	});
};

const goToSales = () => {
	uni.navigateTo({
		url: '/pages/home/sales'
	});
};

const goToReport = () => {
	uni.navigateTo({
		url: '/pages/home/report'
	});
};

const goToInsect = () => {
	uni.navigateTo({
		url: '/pages/home/insect'
	});
};

const goToBird = () => {
	uni.navigateTo({
		url: '/pages/home/bird'
	});
};

const goToWeather = () => {
	uni.navigateTo({
		url: '/pages/home/weather'
	});
};

const goToNotifications = () => {
	uni.navigateTo({
		url: '/pages/notifications/notifications'
	});
};

const goToProfile = () => {
	uni.navigateTo({
		url: '/pages/home/profile'
	});
};

onMounted(() => {
	// 页面加载动画
	uni.showLoading({
		title: '加载中...',
		mask: true
	});
	
	// 加载农场面积
	loadFarmArea();
	
	// 设置事件监听
	setupEventListeners();
	
	setTimeout(() => {
		uni.hideLoading();
	}, 800);
});

onBeforeUnmount(() => {
	// 移除事件监听
	removeEventListeners();
});
</script>

<style>
.home-container {
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
	animation: slideInDown 0.5s ease-out;
	box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);
	z-index: 10;
}

.app-name {
	font-size: 38rpx;
	font-weight: bold;
	letter-spacing: 2rpx;
	text-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.1);
}

.user-avatar, .notification-icon {
	width: 70rpx;
	height: 70rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.3s ease;
	position: relative;
}

.user-avatar:active {
	transform: scale(0.92);
}

.notification-icon:active {
	transform: scale(0.92) rotate(15deg);
}

.avatar-icon {
	width: 60rpx;
	height: 60rpx;
	border-radius: 50%;
	background-color: rgba(255, 255, 255, 0.9);
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%2342b872' d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E");
	background-size: cover;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.notification-icon {
	background: linear-gradient(90deg, #42b872, #4fc47f);
	border-radius: 50%;
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.3s ease;
	position: relative;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.15);
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='white' d='M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z'/%3E%3C/svg%3E");
	background-repeat: no-repeat;
	background-position: center;
	background-size: 36rpx;
}

/* 农田概况 */
.farm-overview {
	background: linear-gradient(135deg, #42b872, #5dc68c);
	color: white;
	padding: 25rpx 30rpx 45rpx;
	border-bottom-left-radius: 30rpx;
	border-bottom-right-radius: 30rpx;
	animation: fadeIn 0.8s ease-out;
	box-shadow: 0 6rpx 20rpx rgba(66, 184, 114, 0.25);
	margin-bottom: 10rpx;
}

.overview-title {
	font-size: 32rpx;
	font-weight: 600;
	margin-bottom: 25rpx;
	display: flex;
	align-items: center;
}

.overview-title::before {
	content: "";
	display: inline-block;
	width: 8rpx;
	height: 30rpx;
	background-color: rgba(255, 255, 255, 0.7);
	margin-right: 16rpx;
	border-radius: 4rpx;
}

.stats-container {
	display: flex;
	justify-content: space-evenly;
	background-color: rgba(255, 255, 255, 0.1);
	border-radius: 20rpx;
	padding: 20rpx 10rpx;
}

.stat-item {
	text-align: center;
	flex: 0 0 40%;
	animation: fadeIn 1s ease-out;
	position: relative;
}

.stat-item:not(:last-child)::after {
	content: "";
	position: absolute;
	right: 0;
	top: 20%;
	height: 60%;
	width: 2rpx;
	background-color: rgba(255, 255, 255, 0.15);
}

.stat-value {
	font-size: 34rpx;
	font-weight: bold;
	margin-bottom: 8rpx;
	animation: fadeIn 1.2s ease-out;
}

.stat-label {
	font-size: 26rpx;
	opacity: 0.9;
}

/* 功能区块 */
.function-section {
	padding: 20rpx;
}

.function-card {
	background-color: #ffffff;
	border-radius: 24rpx;
	padding: 30rpx;
	margin-bottom: 30rpx;
	box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.06);
	opacity: 0;
	animation: scaleIn 0.5s ease-out forwards;
	border: 1px solid rgba(0, 0, 0, 0.03);
	overflow: hidden;
	position: relative;
}

.function-card::before {
	content: "";
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 6rpx;
	background: linear-gradient(to right, #42b872, #8fd3a6);
}

.function-card:nth-child(1) {
	animation-delay: 0.2s;
}

.function-card:nth-child(2) {
	animation-delay: 0.4s;
}

.function-card:nth-child(3) {
	animation-delay: 0.6s;
}

.card-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 36rpx;
	position: relative;
	padding-left: 24rpx;
	display: flex;
	align-items: center;
}

.card-title::before {
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

.function-grid {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	padding: 0 10rpx;
}

.warning-grid {
	justify-content: flex-start;
}

.warning-grid .function-item {
	margin-right: 80rpx;
}

.function-item {
	width: 30%;
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 36rpx;
	position: relative;
	transition: all 0.3s ease;
}

.function-item:active {
	transform: scale(0.92);
}

.function-icon {
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 20rpx;
	position: relative;
	background-position: center;
	background-repeat: no-repeat;
	background-size: 56rpx;
	transition: all 0.3s ease;
	box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.08);
}

.function-item:hover .function-icon {
	transform: scale(1.08);
	box-shadow: 0 10rpx 25rpx rgba(0, 0, 0, 0.12);
}

.function-name {
	font-size: 28rpx;
	color: #444;
	font-weight: 500;
}

/* 功能图标样式 */
.infrared-icon {
	background-color: rgba(255, 240, 240, 1);
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23e53935' d='M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E");
}

.operation-icon {
	background-color: rgba(240, 255, 240, 1);
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%234caf50' d='M21 11h-1V4c0-.55-.45-1-1-1H5c-.55 0-1 .45-1 1v7H3c-.55 0-1 .45-1 1s.45 1 1 1h1v7c0 .55.45 1 1 1h14c.55 0 1-.45 1-1v-7h1c.55 0 1-.45 1-1s-.45-1-1-1zm-5-7h1v2h-1V4zm-3 0h1v2h-1V4zm-3 0h1v2h-1V4zm-3 0h1v2H7V4z'/%3E%3C/svg%3E");
}

.camera-icon {
	background-color: rgba(240, 255, 240, 1);
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%234CAF50' d='M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z'/%3E%3C/svg%3E");
}

.humidity-icon {
	background-color: rgba(240, 248, 255, 1);
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%232196F3' d='M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8zm0 18c-3.35 0-6-2.57-6-6.2 0-2.34 1.95-5.44 6-9.14 4.05 3.7 6 6.79 6 9.14 0 3.63-2.65 6.2-6 6.2zm-4.17-6c.37 0 .67.26.74.62.41 2.22 2.28 2.98 3.64 2.87.43-.02.79.32.79.75 0 .4-.32.73-.72.75-2.13.13-4.62-1.09-5.19-4.12-.08-.45.28-.87.74-.87z'/%3E%3C/svg%3E");
}

.temperature-icon {
	background-color: rgba(255, 248, 240, 1);
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23FF9800' d='M15 13V5c0-1.66-1.34-3-3-3S9 3.34 9 5v8c-1.21.91-2 2.37-2 4 0 2.76 2.24 5 5 5s5-2.24 5-5c0-1.63-.79-3.09-2-4zm-4-2V5c0-.55.45-1 1-1s1 .45 1 1v1h-1v1h1v1h-1v1h1v1h-1v1h-2z'/%3E%3C/svg%3E");
}

.ai-analysis-icon {
	background-color: rgba(233, 240, 255, 1);
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%235C6BC0' d='M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3zM8 13h2.55v3h2.9v-3H16l-4-4z'/%3E%3C/svg%3E");
}

.product-icon {
	background-color: rgba(0, 150, 136, 0.1);
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23009688' d='M17.21 9.17l-2.83-2.83c-.31-.31-.85-.09-.85.36V8H10c-.55 0-1 .45-1 1s.45 1 1 1h3.53v1.29c0 .45.54.67.85.35l2.83-2.83c.2-.19.2-.51 0-.71zM20 3h-5.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H4c-.55 0-1 .45-1 1v18c0 .55.45 1 1 1h16c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1zm-8 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z'/%3E%3C/svg%3E");
}

.certificate-icon {
	background-color: rgba(76, 175, 80, 0.1);
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%234caf50' d='M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm7 10c0 4.52-2.98 8.69-7 9.93-4.02-1.24-7-5.41-7-9.93V6.3l7-3.11 7 3.11V11zm-11.59.59L6 13l4 4 8-8-1.41-1.42L10 14.17z'/%3E%3C/svg%3E");
}

.order-icon {
	background-color: rgba(3, 169, 244, 0.1);
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%2303a9f4' d='M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-8 4c0 .55-.45 1-1 1s-1-.45-1-1V8h2v2zm2-6c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm4 6c0 .55-.45 1-1 1s-1-.45-1-1V8h2v2z'/%3E%3C/svg%3E");
}

.customer-icon {
	background-color: rgba(33, 150, 243, 0.1);
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%232196f3' d='M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z'/%3E%3C/svg%3E");
}

.sales-icon {
	background-color: rgba(255, 193, 7, 0.1);
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23ffc107' d='M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z'/%3E%3C/svg%3E");
}

.report-icon {
	background-color: rgba(255, 87, 34, 0.1);
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23ff5722' d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z'/%3E%3C/svg%3E");
}

.insect-icon {
	background-color: rgba(121, 85, 72, 0.1);
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23795548' d='M21.47 4.35l-1.34-.56v8.9l.44.88c.08.17.12.37.12.58 0 .72-.58 1.3-1.3 1.3H15v3c0 .55-.45 1-1 1s-1-.45-1-1v-3H9c-.55 0-1-.45-1-1s.45-1 1-1h6.59l1.71-3.43-.59-.31c-.16-.08-.28-.22-.34-.39 0-.01-.01-.02-.01-.04-.01-.05-.02-.11-.02-.16 0 0 0-.01-.01-.01L16 10l-1.88-5.65c-.06-.18-.18-.35-.33-.46-.15-.12-.36-.17-.56-.14L11 4l-3-3-1.82.93c-.1.05-.2.12-.28.2-.08.08-.14.17-.19.27L5 4l5 3.28.45-.22L9 9v1l.42.21L9 11l2 1v2l-2 1v1l.42.21L9 17l2.99 1.5 1.25-.62.25.12v2.25l.58.29c.08.04.16.06.25.06.05 0 .09-.01.14-.01l5.11-1.38c.18-.05.33-.17.44-.33.1-.16.16-.36.16-.57v-.77l-.01-.14 1.1-.57c.34-.18.56-.52.56-.9v-.96c0-.31-.15-.6-.39-.79l-2-1.5z'/%3E%3C/svg%3E");
}

.bird-icon {
	background-color: rgba(216, 27, 96, 0.1);
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23d81b60' d='M22 10l-4.56-3.8-2.5 3.43-3.09-3.94L4 13l2.3-2.89 3.56 4.56 2.36-3 5.51 4.4 1.5-1.5L22 10z'/%3E%3C/svg%3E");
}

.weather-icon {
	background-color: rgba(33, 150, 243, 0.1);
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%232196f3' d='M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03 0 1.41 0 .39-.39.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41.39.39 1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41.39.39 1.03.39 1.41 0l1.06-1.06z'/%3E%3C/svg%3E");
}

/* 底部信息 */
.footer {
	text-align: center;
	margin-top: 30rpx;
	padding: 0 20rpx 20rpx;
	color: #999;
	font-size: 24rpx;
	animation: fadeIn 1.5s ease-out;
}

.hotline {
	margin-bottom: 10rpx;
}

/* 适配iPhone X等全面屏设备 */
@supports (bottom: constant(safe-area-inset-bottom)) or (bottom: env(safe-area-inset-bottom)) {
	.home-container {
		padding-bottom: calc(30rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(30rpx + env(safe-area-inset-bottom));
	}
}

/* 动画定义 */
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

@keyframes floatAnimation {
	0% { transform: translateY(0); }
	50% { transform: translateY(-10rpx); }
	100% { transform: translateY(0); }
}

/* 底部导航栏样式 */
.tabbar {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 110rpx;
    background-color: #ffffff;
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.08);
    z-index: 100;
    padding-bottom: env(safe-area-inset-bottom);
    transition: transform 0.3s ease-in-out;
}

.tabbar-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12rpx 0;
    position: relative;
    transition: all 0.2s ease;
}

.tabbar-icon {
    width: 48rpx;
    height: 48rpx;
    margin-bottom: 8rpx;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    transition: all 0.2s ease;
}

.tabbar-text {
    font-size: 24rpx;
    color: #999999;
    transition: all 0.2s ease;
}

.tabbar-item-active .tabbar-text {
    color: #42b872;
    font-weight: 500;
}

.tabbar-item-active .tabbar-icon {
    transform: scale(1.1);
}

.tabbar-item:active {
    opacity: 0.8;
}

/* 底部指示条 */
.tabbar-item-active::after {
    content: '';
    position: absolute;
    bottom: 8rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 40rpx;
    height: 4rpx;
    background: #42b872;
    border-radius: 2rpx;
    transition: all 0.2s ease;
}

/* 图标样式 */
.home-icon {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23999999' d='M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z' /%3E%3C/svg%3E");
}

.tabbar-item-active .home-icon {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%2342b872' d='M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z' /%3E%3C/svg%3E");
}

.market-icon {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23999999' d='M12,18H6V14H12M21,14V12L20,7H4L3,12V14H4V20H14V14H18V20H20V14M20,4H4V6H20V4Z' /%3E%3C/svg%3E");
}

.tabbar-item-active .market-icon {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%2342b872' d='M12,18H6V14H12M21,14V12L20,7H4L3,12V14H4V20H14V14H18V20H20V14M20,4H4V6H20V4Z' /%3E%3C/svg%3E");
}

.message-icon {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23999999' d='M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4C22,2.89 21.1,2 20,2Z' /%3E%3C/svg%3E");
}

.tabbar-item-active .message-icon {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%2342b872' d='M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4C22,2.89 21.1,2 20,2Z' /%3E%3C/svg%3E");
}

.cart-icon {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23999999' d='M17,18C15.89,18 15,18.89 15,20A2,2 0 0,0 17,22A2,2 0 0,0 19,20C19,18.89 18.1,18 17,18M1,2V4H3L6.6,11.59L5.24,14.04C5.09,14.32 5,14.65 5,15A2,2 0 0,0 7,17H19V15H7.42A0.25,0.25 0 0 1 7.17,14.75C7.17,14.7 7.18,14.66 7.2,14.63L8.1,13H15.55C16.3,13 16.96,12.58 17.3,11.97L20.88,5.5C20.95,5.34 21,5.17 21,5A1,1 0 0,0 20,4H5.21L4.27,2M7,18C5.89,18 5,18.89 5,20A2,2 0 0,0 7,22A2,2 0 0,0 9,20C9,18.89 8.1,18 7,18Z' /%3E%3C/svg%3E");
}

.tabbar-item-active .cart-icon {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%2342b872' d='M17,18C15.89,18 15,18.89 15,20A2,2 0 0,0 17,22A2,2 0 0,0 19,20C19,18.89 18.1,18 17,18M1,2V4H3L6.6,11.59L5.24,14.04C5.09,14.32 5,14.65 5,15A2,2 0 0,0 7,17H19V15H7.42A0.25,0.25 0 0 1 7.17,14.75C7.17,14.7 7.18,14.66 7.2,14.63L8.1,13H15.55C16.3,13 16.96,12.58 17.3,11.97L20.88,5.5C20.95,5.34 21,5.17 21,5A1,1 0 0,0 20,4H5.21L4.27,2M7,18C5.89,18 5,18.89 5,20A2,2 0 0,0 7,22A2,2 0 0,0 9,20C9,18.89 8.1,18 7,18Z' /%3E%3C/svg%3E");
}

.profile-icon {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23999999' d='M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z' /%3E%3C/svg%3E");
}

.tabbar-item-active .profile-icon {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%2342b872' d='M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z' /%3E%3C/svg%3E");
}

/* 页面底部留出导航栏的空间 */
.home-container {
    padding-bottom: calc(110rpx + env(safe-area-inset-bottom));
}

/* 修改底部信息的样式，避免与底部导航栏重叠 */
.footer {
    margin-bottom: 130rpx;
}

/* 添加滚动隐藏导航栏功能的CSS变量 */
:root {
    --tabbar-transform: translateY(0);
}

/* 添加导航栏滚动隐藏效果 */
.tabbar-hidden {
    transform: translateY(100%);
}

/* 农资市场页面样式 */
.content-container {
    padding: 20rpx;
    min-height: calc(100vh - 200rpx);
}

.page-container {
    background-color: #ffffff;
    border-radius: 20rpx;
    padding: 30rpx;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
}

.page-header {
    margin-bottom: 30rpx;
}

.header-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    position: relative;
    padding-left: 20rpx;
}

.header-title::before {
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

/* 农资市场分类 */
.market-categories {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: 40rpx;
}

.category-item {
    width: 22%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20rpx;
}

.category-icon {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    background-color: #f5f7fa;
    margin-bottom: 10rpx;
    background-position: center;
    background-repeat: no-repeat;
    background-size: 50%;
}

.seed-icon {
    background-color: rgba(240, 255, 240, 1);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%234caf50' d='M7.5 11l4.5 4.5 4.5-4.5L13 7.5z'/%3E%3C/svg%3E");
}

.fertilizer-icon {
    background-color: rgba(253, 245, 230, 1);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23ff9800' d='M20 4h-4V2h-2v2H8V2H6v2H4v18h16V4zm-8 14h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V8h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V8h2v2z'/%3E%3C/svg%3E");
}

.pesticide-icon {
    background-color: rgba(230, 230, 250, 1);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%239c27b0' d='M19 12v7H5v-7h14m0-2H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zM7 7v2h10V7l-5-5-5 5z'/%3E%3C/svg%3E");
}

.tool-icon {
    background-color: rgba(230, 250, 250, 1);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%2303a9f4' d='M13.78 15.44l-2.52-2.52 7.6-7.6c.32.74.52 1.55.56 2.4.04.89-.02 1.76-.2 2.59-.19.84-.49 1.65-.92 2.42-.44.78-.96 1.51-1.58 2.13-.6.63-1.29 1.14-2.05 1.54-.75.38-1.58.62-2.49.74-.91.08-1.78.02-2.61-.2l2.6-2.6 1.61 1.1zM4.41 12.34l9.22 9.22L18.22 17l-9.22-9.22-4.59 4.56z'/%3E%3C/svg%3E");
}

.category-name {
    font-size: 26rpx;
    color: #333;
    text-align: center;
}

/* 推荐产品 */
.recommend-products {
    margin-top: 20rpx;
}

.section-title {
    font-size: 30rpx;
    font-weight: bold;
    margin-bottom: 30rpx;
    color: #333;
    position: relative;
    padding-left: 20rpx;
}

.section-title::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 6rpx;
    height: 28rpx;
    background-color: #42b872;
    border-radius: 3rpx;
}

.product-list {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -15rpx;
}

.product-card {
    width: calc(50% - 30rpx);
    margin: 0 15rpx 30rpx;
    background-color: #fff;
    border-radius: 12rpx;
    overflow: hidden;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
}

.product-card:active {
    transform: scale(0.98);
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
}

.product-image {
    height: 240rpx;
    background-color: #f5f7fa;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    position: relative;
    overflow: hidden;
}

.product-tag {
    position: absolute;
    top: 16rpx;
    left: 0;
    background-color: #ff6b6b;
    color: white;
    font-size: 22rpx;
    font-weight: bold;
    padding: 6rpx 16rpx;
    border-radius: 0 16rpx 16rpx 0;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.15);
    z-index: 1;
}

.product-card:nth-child(2) .product-tag {
    background-color: #42b872;
}

.product-image::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 60rpx;
    background: linear-gradient(to top, rgba(0,0,0,0.1), transparent);
}

.wheat-seed-image {
    background-image: url('../../static/images/p4.png');
}

.fertilizer-image {
    background-image: url('../../static/images/p5.png');
}

.product-info {
    padding: 20rpx;
}

.product-name {
    font-size: 28rpx;
    font-weight: 500;
    margin-bottom: 12rpx;
    color: #333;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.4;
}

.product-price {
    font-size: 30rpx;
    color: #ff6b6b;
    font-weight: bold;
    display: flex;
    align-items: center;
}

.product-price::before {
    content: "¥";
    font-size: 24rpx;
    margin-right: 2rpx;
}

.price-unit {
    font-size: 24rpx;
    color: #999;
    font-weight: normal;
    margin-left: 2rpx;
}

/* 消息中心页面样式 */
.message-list {
    margin-top: 20rpx;
}

.message-item {
    display: flex;
    padding: 20rpx 0;
    border-bottom: 1px solid #f0f0f0;
}

.message-avatar {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    margin-right: 20rpx;
    background-position: center;
    background-repeat: no-repeat;
    background-size: 60%;
}

.system-avatar {
    background-color: #e3f2fd;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%232196f3' d='M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V8h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V8h2v2z'/%3E%3C/svg%3E");
}

.expert-avatar {
    background-color: #e8f5e9;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%234caf50' d='M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23L16.23 18z'/%3E%3C/svg%3E");
}

.message-content {
    flex: 1;
}

.message-title {
    font-size: 28rpx;
    font-weight: 500;
    color: #333;
    margin-bottom: 10rpx;
}

.message-text {
    font-size: 26rpx;
    color: #666;
    margin-bottom: 10rpx;
    line-height: 1.4;
}

.message-time {
    font-size: 24rpx;
    color: #999;
}

/* 购物车页面样式 */
.empty-cart {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100rpx 0;
}

.empty-icon {
    width: 150rpx;
    height: 150rpx;
    margin-bottom: 30rpx;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23ddd' d='M17 18c-1.11 0-2 .89-2 2 0 1.097.903 2 2 2a2 2 0 0 0 2-2c0-1.11-.9-2-2-2M1 2v2h2l3.6 7.59-1.36 2.45c-.15.28-.24.58-.24.96 0 .4-.32.73-.72.75-2.13.13-4.62-1.09-5.19-4.12-.08-.45.28-.87.74-.87z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    opacity: 0.5;
}

.empty-text {
    font-size: 28rpx;
    color: #999;
    margin-bottom: 30rpx;
}

.go-shopping-btn {
    padding: 15rpx 40rpx;
    background-color: #42b872;
    color: white;
    font-size: 28rpx;
    border-radius: 30rpx;
}

/* 个人中心页面样式 */
.profile-section {
    padding-bottom: 40rpx;
}

.profile-header {
    display: flex;
    align-items: center;
    padding: 40rpx 0;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 30rpx;
}

.profile-avatar {
    margin-right: 30rpx;
}

.avatar-large {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    background-color: #f5f7fa;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%2342b872' d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E");
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
}

.profile-info {
    flex: 1;
}

.profile-name {
    font-size: 34rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 10rpx;
}

.profile-phone {
    font-size: 26rpx;
    color: #999;
}

.edit-profile-btn {
    padding: 10rpx 30rpx;
    border: 1px solid #42b872;
    border-radius: 30rpx;
    color: #42b872;
    font-size: 26rpx;
}

.profile-stats {
    display: flex;
    justify-content: space-around;
    padding: 30rpx 0;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 30rpx;
}

.stat-block {
    text-align: center;
}

.stat-number {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 10rpx;
}

.stat-name {
    font-size: 26rpx;
    color: #999;
}

.menu-section {
    padding: 0 20rpx;
}

.menu-group {
    margin-bottom: 40rpx;
}

.menu-title {
    font-size: 30rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
    color: #333;
}

.menu-grid {
    display: flex;
    flex-wrap: wrap;
}

.menu-item {
    width: 25%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20rpx 0;
}

.menu-icon {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    margin-bottom: 10rpx;
    background-color: #f5f7fa;
    background-position: center;
    background-repeat: no-repeat;
    background-size: 50%;
}

.wallet-icon {
    background-color: rgba(255, 243, 224, 1);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23ff9800' d='M21 18v1c0 1.1-.9 2-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14c1.1 0 2 .9 2 2v1h-9a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z'/%3E%3C/svg%3E");
}

.address-icon {
    background-color: rgba(225, 245, 254, 1);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%2303a9f4' d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E");
}

.coupon-icon {
    background-color: rgba(230, 243, 255, 1);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23f44336' d='M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 .55.45 1 1 1h16c1.11 0 2-.89 2-2V4c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm10 15H5v-2h14v2zm0-5H5v-2h14v2zm0-5h-2v-1h-2v1H9v-1H7v1H5V8h14v1z'/%3E%3C/svg%3E");
}

.favorite-icon {
    background-color: rgba(251, 233, 231, 1);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23f44336' d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3z'/%3E%3C/svg%3E");
}

.menu-name {
    font-size: 26rpx;
    color: #666;
}

.menu-list {
    background-color: #f9f9f9;
    border-radius: 12rpx;
    overflow: hidden;
}

.list-item {
    display: flex;
    align-items: center;
    padding: 25rpx 20rpx;
    border-bottom: 1px solid #f0f0f0;
}

.list-item:last-child {
    border-bottom: none;
}

.item-icon {
    width: 40rpx;
    height: 40rpx;
    margin-right: 20rpx;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
}

.help-icon {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%234caf50' d='M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.24 16L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23L16.23 18z'/%3E%3C/svg%3E");
}

.feedback-icon {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23ff9800' d='M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z'/%3E%3C/svg%3E");
}

.about-icon {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%232196f3' d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z'/%3E%3C/svg%3E");
}

.item-name {
    flex: 1;
    font-size: 28rpx;
    color: #333;
}

.item-arrow {
    width: 30rpx;
    height: 30rpx;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23bbb' d='M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.42L10 14.17z'/%3E%3C/svg%3E");
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
}
</style> 