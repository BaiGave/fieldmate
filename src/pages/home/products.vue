<template>
	<view class="products-container">
		<!-- 顶部搜索区域 -->
		<view class="search-header">
			<view class="back-button" @click="goBack">
				<view class="back-icon"></view>
			</view>
			<view class="search-box">
				<view class="search-icon"></view>
				<input type="text" v-model="searchKeyword" placeholder="搜索" @confirm="handleSearch" />
				<view v-if="searchKeyword" class="clear-icon" @click="clearSearch"></view>
			</view>
		</view>
		
		<!-- 搜索结果 -->
		<view v-if="isSearching" class="search-results">
			<view class="result-header">
				<text class="result-title">搜索结果</text>
				<text class="result-count">找到 {{filteredProducts.length}} 个结果</text>
			</view>
			
			<view v-if="filteredProducts.length > 0" class="results-grid">
				<view v-for="(product, index) in filteredProducts" :key="index" class="result-card" @click="viewProductDetail(product)">
					<view class="result-image">
						<image :src="product.image" mode="aspectFill" class="result-image-content"></image>
					</view>
					<view class="result-info">
						<view class="result-title">{{product.title}}</view>
						<view class="result-price">¥ {{product.price}}</view>
					</view>
				</view>
			</view>
			
			<view v-else class="no-results">
				<view class="no-results-icon"></view>
				<text class="no-results-text">没有找到相关商品</text>
				<view class="back-to-products" @click="clearSearch">返回商品列表</view>
			</view>
		</view>
		
		<!-- 正常商品显示区域 -->
		<block v-else>
			<!-- 顶部轮播图 -->
			<view class="banner-image">
				<swiper class="banner-swiper" circular autoplay interval="3000" duration="500">
					<swiper-item v-for="(item, index) in bannerImages" :key="index">
						<image class="banner-image-content" :src="item" mode="aspectFill" @error="imgError(index)"></image>
					</swiper-item>
				</swiper>
			</view>
			
			<!-- 产品轮播 -->
			<view class="product-slider-container">
				<view class="swiper-wrapper">
					<swiper class="product-swiper" :current="currentIndex" @change="onSwiperChange" circular>
						<swiper-item v-for="(product, index) in products" :key="index">
							<view class="product-card" @click="viewProductDetail(product)">
								<view class="product-image">
									<image :src="product.image" mode="aspectFill" @error="productImgError(index)" class="product-image-content"></image>
								</view>
								<view class="product-info">
									<view class="product-title">{{product.title}}</view>
									<view class="product-tag">{{product.tag}}</view>
								</view>
								<view class="product-footer">
									<view class="price-text">¥ {{product.price}}</view>
									<view class="add-button" @click.stop="addToCart(product)">
										<text class="add-icon">+</text>
									</view>
								</view>
							</view>
						</swiper-item>
					</swiper>
					
					<!-- 自定义指示器 -->
					<view class="custom-indicator">
						<view 
							v-for="(dot, i) in products.length" 
							:key="i" 
							:class="['indicator-dot', i === currentIndex ? 'active' : '']">
						</view>
					</view>
				</view>
			</view>
			
			<!-- 更多推荐区域 -->
			<view class="more-section">
				<view class="section-header">
					<text class="section-title">更多推荐</text>
					<text class="section-link" @click="viewAllProducts">查看全部</text>
				</view>
				<view class="more-products">
					<view class="more-product-card" v-for="(product, index) in recommendProducts" :key="index" @click="viewProductDetail(product)">
						<view class="more-product-image">
							<image :src="product.image" mode="aspectFill" @error="moreImgError(index)" class="more-product-img"></image>
						</view>
						<view class="more-product-info">
							<view class="more-product-title">{{product.title}}</view>
							<view class="more-product-price">
								<text class="price-icon"></text>
								<text class="price-text">{{product.price}}</text>
							</view>
						</view>
						<view class="more-add-button" @click.stop="addToCart(product)"></view>
					</view>
				</view>
			</view>
		</block>
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// 直接导入图片（Vite会自动处理这些资源）
import n1Image from '../../static/images/n1.png';
import n2Image from '../../static/images/n2.png';
import n3Image from '../../static/images/n3.png';
import p1Image from '../../static/images/p1.png';
import p2Image from '../../static/images/p2.png';
import p3Image from '../../static/images/p3.png';

// 搜索相关
const searchKeyword = ref('');
const isSearching = ref(false);

// 使用导入的图片资源
const bannerImages = ref([
  n1Image,
  n2Image,
  n3Image
]);

// 所有产品数据
const allProducts = ref([
  {
    id: 1,
    title: '便携式农事记录本',
    tag: '记录管理',
    price: '58.00',
    image: p1Image,
    description: '专为农业工作者设计的记录本，防水，耐用，便于随时记录农事活动。'
  },
  {
    id: 2,
    title: '有机肥',
    tag: '土壤改良',
    price: '168.00',
    image: p2Image,
    description: '纯天然有机肥料，富含多种营养元素，改善土壤结构，提高土壤肥力。'
  },
  {
    id: 3,
    title: '生物菌肥',
    tag: '土壤改良',
    price: '198.00',
    image: p3Image,
    description: '含有多种有益微生物，促进植物根系发育，增强作物抗逆性。'
  },
  {
    id: 4,
    title: '农用环保杀虫剂',
    tag: '植物保护',
    price: '88.00',
    image: p2Image,
    description: '安全环保配方，有效防治多种农作物害虫，对人畜安全。'
  },
  {
    id: 5,
    title: '太阳能灭虫灯',
    tag: '植物保护',
    price: '128.00',
    image: p1Image,
    description: '太阳能供电，自动诱捕害虫，节能环保，无需接电源。'
  },
  {
    id: 6,
    title: '精准滴灌系统',
    tag: '灌溉设备',
    price: '238.00',
    image: p3Image,
    description: '节水高效的灌溉系统，可自动控制水量，满足不同作物需求。'
  }
]);

// 轮播展示的产品
const products = ref(allProducts.value.slice(0, 3));

// 更多推荐产品
const recommendProducts = ref([
  allProducts.value[2], // 生物菌肥
  allProducts.value[0]  // 便携式农事记录本
]);

// 搜索过滤后的产品
const filteredProducts = computed(() => {
  if (!searchKeyword.value) return [];
  
  const keyword = searchKeyword.value.toLowerCase();
  return allProducts.value.filter(product => 
    product.title.toLowerCase().includes(keyword) || 
    product.tag.toLowerCase().includes(keyword) ||
    product.description.toLowerCase().includes(keyword)
  );
});

// 处理搜索
const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    isSearching.value = true;
  }
};

// 清除搜索
const clearSearch = () => {
  searchKeyword.value = '';
  isSearching.value = false;
};

// 图片加载错误处理
const imgError = (index) => {
  console.error('图片加载失败，索引:', index, '路径:', bannerImages.value[index]);
  
  // 使用占位图作为备用
  const backupSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="300" viewBox="0 0 600 300"><rect width="600" height="300" fill="#${index === 0 ? '9AE681' : index === 1 ? '42b872' : '36a264'}"/><text x="50%" y="50%" font-family="Arial" font-size="24" fill="white" text-anchor="middle">农产品 ${index+1}</text></svg>`;
  
  // 显示错误提示并使用备用图
  uni.showToast({
    title: '图片加载中...',
    icon: 'none',
    duration: 1000
  });
  
  bannerImages.value[index] = backupSvg;
};

// 产品图片加载错误处理
const productImgError = (index) => {
  console.error('产品图片加载失败，索引:', index, '产品:', products.value[index].title);
  
  // 使用占位图作为备用
  const backupSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="${index === 0 ? '#9AE681' : index === 1 ? '#42b872' : '#36a264'}"/><text x="50%" y="50%" font-family="Arial" font-size="24" fill="white" text-anchor="middle">${products.value[index].title}</text></svg>`;
  
  products.value[index].image = backupSvg;
};

const goBack = () => {
	uni.reLaunch({
		url: '/pages/home/home',
		animationType: 'slide-out-right'
	});
};

// 查看全部商品
const viewAllProducts = () => {
  uni.navigateTo({
    url: '/pages/home/all-products'
  });
  
  // 如果页面不存在，提示用户
  uni.onError((err) => {
    console.error('导航错误:', err);
    uni.showToast({
      title: '全部商品页面开发中',
      icon: 'none',
      duration: 2000
    });
  });
};

// 查看商品详情
const viewProductDetail = (product) => {
  // 保存选中的商品到本地存储，以便在详情页获取
  uni.setStorageSync('selectedProduct', JSON.stringify(product));
  
  uni.navigateTo({
    url: `/pages/home/product-detail?id=${product.id}`
  });
  
  // 如果页面不存在，提示用户
  uni.onError((err) => {
    console.error('导航错误:', err);
    uni.showToast({
      title: '商品详情页面开发中',
      icon: 'none',
      duration: 2000
    });
  });
};

// 添加到购物车
const addToCart = (product) => {
  // 获取当前购物车
  const cartItems = JSON.parse(uni.getStorageSync('cartItems') || '[]');
  
  // 检查商品是否已在购物车中
  const existingItem = cartItems.find(item => item.id === product.id);
  
  if (existingItem) {
    // 增加数量
    existingItem.quantity += 1;
  } else {
    // 添加新商品
    cartItems.push({
      ...product,
      quantity: 1
    });
  }
  
  // 保存到本地存储
  uni.setStorageSync('cartItems', JSON.stringify(cartItems));
  
  // 提示用户
  uni.showToast({
    title: '已添加到购物车',
    icon: 'success',
    duration: 1500
  });
};

// 当前产品索引
const currentIndex = ref(0);

// 滑动切换事件
const onSwiperChange = (e) => {
  currentIndex.value = e.detail.current;
};

// 更多推荐图片加载错误处理
const moreImgError = (index) => {
  console.error('更多推荐图片加载失败，索引:', index);
  
  // 获取对应的图片元素
  const imgElements = document.querySelectorAll('.more-product-img');
  if (imgElements && imgElements.length > index) {
    const product = recommendProducts.value[index].title;
    const backupSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="120" height="120" fill="${index === 0 ? '#36a264' : '#9AE681'}"/><text x="50%" y="50%" font-family="Arial" font-size="14" fill="white" text-anchor="middle">${product}</text></svg>`;
    
    imgElements[index].src = backupSvg;
  }
};

onMounted(() => {
	// 页面加载动画效果
	uni.showLoading({
		title: '加载中...',
		mask: true
	});
	
	// 检查图片路径
	console.log('图片已通过import方式导入');
	
	setTimeout(() => {
		uni.hideLoading();
	}, 700);
});
</script>

<style>
.products-container {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	background-color: #f5f7fa;
}

/* 顶部搜索区域 */
.search-header {
	padding: 20rpx;
	padding-top: calc(20rpx + var(--status-bar-height));
	display: flex;
	align-items: center;
	background-color: #42b872;
	position: sticky;
	top: 0;
	z-index: 100;
	animation: slideInLeft 0.6s ease-out;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
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

.search-box {
	flex: 1;
	height: 64rpx;
	background-color: white;
	border-radius: 32rpx;
	margin: 0 20rpx;
	display: flex;
	align-items: center;
	padding: 0 25rpx;
	transition: all 0.3s ease;
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

.clear-icon {
	width: 36rpx;
	height: 36rpx;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23999' d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/%3E%3C/svg%3E");
	background-repeat: no-repeat;
	background-position: center;
	background-size: contain;
	margin-left: 10rpx;
}

.search-box input {
	flex: 1;
	height: 64rpx;
	font-size: 26rpx;
	color: #666;
}

/* 搜索结果样式 */
.search-results {
	padding: 20rpx;
}

.result-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.result-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.result-count {
	font-size: 24rpx;
	color: #999;
}

.results-grid {
	display: flex;
	flex-wrap: wrap;
	margin: 0 -10rpx;
}

.result-card {
	width: calc(50% - 20rpx);
	margin: 10rpx;
	background-color: #fff;
	border-radius: 12rpx;
	overflow: hidden;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
	transition: all 0.3s ease;
}

.result-card:active {
	transform: scale(0.98);
}

.result-image {
	width: 100%;
	height: 240rpx;
	overflow: hidden;
}

.result-image-content {
	width: 100%;
	height: 100%;
	object-fit: cover;
	transition: transform 0.3s ease;
}

.result-card:hover .result-image-content {
	transform: scale(1.05);
}

.result-info {
	padding: 16rpx;
}

.result-title {
	font-size: 28rpx;
	font-weight: 500;
	color: #333;
	margin-bottom: 8rpx;
}

.result-price {
	font-size: 32rpx;
	font-weight: bold;
	color: #42b872;
}

.no-results {
	padding: 60rpx 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.no-results-icon {
	width: 120rpx;
	height: 120rpx;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23ddd' d='M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'/%3E%3C/svg%3E");
	background-repeat: no-repeat;
	background-position: center;
	background-size: contain;
	margin-bottom: 20rpx;
}

.no-results-text {
	font-size: 28rpx;
	color: #999;
	margin-bottom: 20rpx;
}

.back-to-products {
	font-size: 28rpx;
	color: #42b872;
	padding: 10rpx 30rpx;
	border: 1px solid #42b872;
	border-radius: 30rpx;
	transition: all 0.3s ease;
}

.back-to-products:active {
	background-color: #42b872;
	color: white;
}

/* 轮播图 */
.banner-image {
	width: 100%;
	height: 320rpx;
	overflow: hidden;
	border-radius: 12rpx;
	margin: 20rpx;
	width: calc(100% - 40rpx);
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);
	transition: all 0.3s ease;
	animation: fadeIn 0.8s ease-out;
	background-color: #f8f8f8;
	position: relative;
}

.banner-image::after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 80rpx;
	background: linear-gradient(0deg, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0) 100%);
	z-index: 1;
}

.banner-swiper {
	width: 100%;
	height: 100%;
}

.banner-image-content {
	width: 100%;
	height: 100%;
	transition: transform 0.5s ease;
	filter: saturate(1.1);
}

.banner-image:hover .banner-image-content {
	transform: scale(1.03);
}

/* 图片占位符样式 */
.placeholder-image {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #f0f0f0;
}

.banner-placeholder {
	background-color: #9AE681;
	position: relative;
}

.banner-placeholder::after {
	content: '农产品展示';
	color: white;
	font-size: 36rpx;
	font-weight: bold;
}

.product-placeholder {
	background-color: #eee;
	position: relative;
}

.product-placeholder::after {
	content: '产品图片';
	color: #999;
	font-size: 24rpx;
}

.small-placeholder {
	background-color: #eee;
	position: relative;
}

.small-placeholder::after {
	content: '产品图片';
	color: #999;
	font-size: 20rpx;
}

/* 产品轮播 */
.product-slider-container {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 20rpx 0;
	height: 650rpx;
	position: relative;
	animation: fadeIn 1s ease-out;
}

.swiper-wrapper {
	width: 100%;
	height: 100%;
	position: relative;
}

.product-swiper {
	height: 590rpx;
	width: 100%;
}

.product-card {
	width: 400rpx;
	height: 520rpx;
	background-color: #ffffff;
	border-radius: 20rpx;
	overflow: hidden;
	margin: 10rpx auto;
	box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.06);
	position: relative;
	transition: all 0.3s ease;
	animation: zoomIn 0.5s ease-out;
}

.product-card:active {
	transform: scale(0.97);
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.product-card:hover {
	transform: translateY(-5rpx);
	box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.1);
	background-color: #fafffe;
}

.product-image {
	width: 100%;
	height: 320rpx;
	margin: 0 auto 0;
	overflow: hidden;
	animation: fadeIn 0.5s ease-out forwards;
	background-color: #f8f8f8;
	position: relative;
}

.product-image::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: linear-gradient(180deg, rgba(66, 184, 114, 0.1) 0%, rgba(66, 184, 114, 0) 100%);
	z-index: 1;
	opacity: 0;
	transition: opacity 0.3s ease;
}

.product-card:hover .product-image::before {
	opacity: 1;
}

.product-image-content {
	width: 100%;
	height: 100%;
	object-fit: cover;
	transition: all 0.5s ease;
	filter: saturate(1.05);
}

.product-card:hover .product-image-content {
	transform: scale(1.08);
	filter: saturate(1.2) contrast(1.05);
}

.product-info {
	padding: 20rpx 24rpx 10rpx;
	position: relative;
	animation: fadeIn 0.5s ease-out forwards;
}

.product-title {
	font-size: 32rpx;
	color: #333;
	font-weight: 500;
	margin-bottom: 6rpx;
	animation-delay: 0.1s;
	transition: all 0.3s ease;
}

.product-tag {
	font-size: 24rpx;
	color: #42b872;
	margin-bottom: 60rpx;
	animation-delay: 0.2s;
	transition: all 0.3s ease;
	background-color: rgba(154, 230, 129, 0.1);
	display: inline-block;
	padding: 4rpx 12rpx;
	border-radius: 20rpx;
}

.product-footer {
	padding: 0 30rpx;
	position: absolute;
	bottom: 25rpx;
	left: 0;
	right: 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
	animation-delay: 0.3s;
}

.price-text {
	font-size: 36rpx;
	color: #333;
	font-weight: bold;
	display: flex;
	align-items: center;
	transition: all 0.3s ease;
}

.add-button {
	width: 70rpx;
	height: 70rpx;
	background-color: #42b872;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 5rpx;
	transition: all 0.3s ease;
	box-shadow: 0 4rpx 8rpx rgba(66, 184, 114, 0.2);
}

.add-button:active {
	transform: scale(0.9);
	background-color: #388f5b;
}

.add-button:hover {
	transform: scale(1.05);
	background-color: #4dc681;
	box-shadow: 0 6rpx 12rpx rgba(66, 184, 114, 0.3);
}

.add-icon {
	color: white;
	font-size: 42rpx;
	line-height: 42rpx;
}

/* 自定义指示器 */
.custom-indicator {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	justify-content: center;
	padding: 10rpx 0;
	transition: all 0.5s ease;
}

.indicator-dot {
	width: 14rpx;
	height: 14rpx;
	border-radius: 7rpx;
	background-color: #ddd;
	margin: 0 6rpx;
	transition: all 0.3s ease;
}

.indicator-dot.active {
	background-color: #42b872;
	width: 30rpx;
	box-shadow: 0 2rpx 6rpx rgba(66, 184, 114, 0.3);
}

.indicator-dot:hover:not(.active) {
	background-color: #bbb;
	transform: scale(1.2);
}

/* 更多推荐区域 */
.more-section {
	margin-top: 30rpx;
	padding: 0 20rpx;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
	animation: slideInLeft 0.7s ease-out;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	animation-delay: 0.1s;
}

.section-link {
	font-size: 24rpx;
	color: #999;
	transition: all 0.3s ease;
}

.section-link:active {
	color: #42b872;
}

.section-link:hover {
	color: #42b872;
	text-decoration: underline;
}

.more-product-card {
	display: flex;
	background-color: white;
	border-radius: 12rpx;
	padding: 16rpx;
	margin-bottom: 16rpx;
	align-items: center;
	transition: all 0.3s ease;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
	animation: slideInUp 0.6s ease-out;
	border-left: 3px solid #42b872;
}

.more-product-card:active {
	background-color: #f9f9f9;
	transform: scale(0.98) translateX(5rpx);
}

.more-product-card:hover {
	background-color: #fafffe;
	transform: translateX(5rpx);
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);
}

.more-product-image {
	width: 120rpx;
	height: 120rpx;
	border-radius: 8rpx;
	overflow: hidden;
	margin-right: 20rpx;
	background-color: #f8f8f8;
	position: relative;
}

.more-product-image::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(66, 184, 114, 0);
	z-index: 1;
	transition: background-color 0.3s ease;
}

.more-product-card:hover .more-product-image::before {
	background-color: rgba(66, 184, 114, 0.05);
}

.more-product-img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	transition: all 0.4s ease;
}

.more-product-card:hover .more-product-img {
	transform: scale(1.1);
}

.more-product-info {
	flex: 1;
}

.more-product-title {
	font-size: 28rpx;
	color: #333;
	margin-bottom: 10rpx;
	animation-delay: 0.1s;
}

.more-product-price {
	display: flex;
	align-items: center;
}

.more-add-button {
	width: 40rpx;
	height: 40rpx;
	background-color: #42b872;
	border-radius: 50%;
	position: relative;
}

.more-add-button::before,
.more-add-button::after {
	content: '';
	position: absolute;
	background-color: white;
}

.more-add-button::before {
	width: 20rpx;
	height: 4rpx;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}

.more-add-button::after {
	width: 4rpx;
	height: 20rpx;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}

/* 移除相关的箭头样式 */
.slider-arrow, .left-arrow, .right-arrow, .arrow-icon {
	display: none;
}

/* 添加动画过渡效果 */
@keyframes fadeIn {
	from { opacity: 0; transform: translateY(20rpx); }
	to { opacity: 1; transform: translateY(0); }
}

.product-image, .product-title, .product-tag, .product-footer {
	animation: fadeIn 0.5s ease-out forwards;
}

.product-title {
	animation-delay: 0.1s;
}

.product-tag {
	animation-delay: 0.2s;
}

.product-footer {
	animation-delay: 0.3s;
}

/* 搜索框悬浮效果 */
.search-box:hover {
	background-color: #f5f5f5;
	box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05) inset;
}

/* 返回按钮悬浮效果 */
.back-button:hover {
	background-color: rgba(255, 255, 255, 0.2);
	border-radius: 50%;
}

/* 添加动画关键帧 */
@keyframes slideInLeft {
	from { 
		transform: translateX(-30rpx);
		opacity: 0;
	}
	to { 
		transform: translateX(0);
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

@keyframes zoomIn {
	from { 
		transform: scale(0.8);
		opacity: 0;
	}
	to { 
		transform: scale(1);
		opacity: 1;
	}
}

/* 为页面元素添加动画 */
.search-header {
	animation: slideInLeft 0.6s ease-out;
}

.banner-image {
	animation: fadeIn 0.8s ease-out;
}

.product-slider-container {
	animation: fadeIn 1s ease-out;
}

.section-title, .section-link {
	animation: slideInLeft 0.7s ease-out;
}

.more-product-card {
	animation: slideInUp 0.6s ease-out;
}

.more-product-card:nth-child(2) {
	animation-delay: 0.1s;
}

.swiper-item-transition {
	transition: all 0.5s ease;
}

.product-card {
	animation: zoomIn 0.5s ease-out;
}

/* 添加交互效果 */
.search-box {
	transition: all 0.3s ease;
}

.search-box:active {
	background-color: #f8f8f8;
}

.product-card {
	transition: all 0.3s ease;
}

.product-card:active {
	transform: scale(0.97);
}

.add-button {
	transition: all 0.3s ease;
}

.add-button:active {
	transform: scale(0.9);
	background-color: #8bd379;
}

.more-product-card {
	transition: all 0.3s ease;
}

.more-product-card:active {
	transform: scale(0.98) translateX(5rpx);
	background-color: #f9f9f9;
}

.section-link {
	transition: all 0.3s ease;
}

.section-link:active {
	color: #42b872;
}

/* 为轮播添加转场动画 */
.custom-indicator {
	transition: all 0.5s ease;
}

.indicator-dot {
	transition: all 0.3s ease;
}

/* 为产品卡片添加悬浮效果 */
.product-title, .product-tag, .price-text {
	transition: all 0.3s ease;
}

.product-card:hover .product-title {
	color: #42b872;
}

.product-card:hover {
	box-shadow: 0 8rpx 16rpx rgba(0, 0, 0, 0.1);
	transform: translateY(-5rpx);
}

/* 页面加载时的图片模糊处理与淡入效果 */
@keyframes imgLoad {
	from { 
		filter: blur(5px) brightness(0.9);
		transform: scale(1.05);
	}
	to { 
		filter: blur(0) brightness(1);
		transform: scale(1);
	}
}

.product-image-content, .banner-image-content, .more-product-img {
	animation: imgLoad 0.6s ease-out forwards;
}
</style> 