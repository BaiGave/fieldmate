<template>
	<view class="all-products-container">
		<!-- 顶部导航栏 -->
		<view class="header">
			<view class="back-button" @click="goBack">
				<view class="back-icon"></view>
			</view>
			<view class="header-title">全部商品</view>
			<view class="search-button" @click="showSearch">
				<view class="search-icon"></view>
			</view>
		</view>
		
		<!-- 搜索区域 -->
		<view class="search-area" v-if="isSearchVisible">
			<view class="search-box">
				<view class="search-icon"></view>
				<input type="text" v-model="searchKeyword" placeholder="搜索" @confirm="handleSearch" />
				<view v-if="searchKeyword" class="clear-icon" @click="clearSearch"></view>
			</view>
		</view>
		
		<!-- 分类筛选 -->
		<view class="category-filter">
			<scroll-view scroll-x class="category-scroll" show-scrollbar="false">
				<view 
					v-for="(category, index) in categories" 
					:key="index"
					:class="['category-item', selectedCategory === category ? 'active' : '']"
					@click="selectCategory(category)"
				>
					{{ category }}
				</view>
			</scroll-view>
		</view>
		
		<!-- 商品列表 -->
		<view class="products-grid">
			<view 
				v-for="(product, index) in filteredProducts" 
				:key="index" 
				class="product-card"
				@click="viewProductDetail(product)"
			>
				<view class="product-image">
					<image :src="product.image" mode="aspectFill" @error="imgError(index)" class="product-image-content"></image>
				</view>
				<view class="product-info">
					<view class="product-title">{{ product.title }}</view>
					<view class="product-tag">{{ product.tag }}</view>
					<view class="product-footer">
						<view class="price-text">¥ {{ product.price }}</view>
						<view class="add-button" @click.stop="addToCart(product)">
							<text class="add-icon">+</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 空状态 -->
		<view class="empty-state" v-if="filteredProducts.length === 0">
			<image class="empty-icon" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23ddd' d='M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'/%3E%3C/svg%3E"></image>
			<text class="empty-text">没有找到相关商品</text>
			<view class="reset-button" @click="resetFilters">重置筛选</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// 导入图片资源
import n1Image from '../../static/images/n1.png';
import n2Image from '../../static/images/n2.png';
import n3Image from '../../static/images/n3.png';
import p1Image from '../../static/images/p1.png';
import p2Image from '../../static/images/p2.png';
import p3Image from '../../static/images/p3.png';
// 添加p4和p5图片导入，但实际使用p3的图片资源
const p4Image = p3Image;
const p5Image = p3Image;

// 搜索相关
const searchKeyword = ref('');
const isSearchVisible = ref(false);

// 分类筛选
const categories = ref(['全部', '记录管理', '土壤改良', '植物保护', '灌溉设备']);
const selectedCategory = ref('全部');

// 所有商品数据
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
    image: p4Image,
    description: '安全环保配方，有效防治多种农作物害虫，对人畜安全。'
  },
  {
    id: 5,
    title: '太阳能灭虫灯',
    tag: '植物保护',
    price: '128.00',
    image: p5Image,
    description: '太阳能供电，自动诱捕害虫，节能环保，无需接电源。'
  },
  {
    id: 6,
    title: '精准滴灌系统',
    tag: '灌溉设备',
    price: '238.00',
    image: p3Image,
    description: '节水高效的灌溉系统，可自动控制水量，满足不同作物需求。'
  },
  {
    id: 7,
    title: '农事记录软件订阅',
    tag: '记录管理',
    price: '98.00',
    image: n1Image,
    description: '专业农事记录软件年度订阅，支持多设备同步，数据永久保存。'
  },
  {
    id: 8,
    title: '土壤检测仪',
    tag: '土壤改良',
    price: '328.00',
    image: n2Image,
    description: '快速检测土壤pH值、湿度、肥力等指标，帮助制定科学施肥方案。'
  },
  {
    id: 9,
    title: '智能喷灌控制器',
    tag: '灌溉设备',
    price: '268.00',
    image: n3Image,
    description: '可远程控制的智能喷灌系统，支持定时、湿度感应等多种模式。'
  }
]);

// 过滤后的商品
const filteredProducts = computed(() => {
  let result = allProducts.value;
  
  // 应用分类筛选
  if (selectedCategory.value !== '全部') {
    result = result.filter(product => product.tag === selectedCategory.value);
  }
  
  // 应用搜索关键词
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    result = result.filter(product => 
      product.title.toLowerCase().includes(keyword) || 
      product.description.toLowerCase().includes(keyword) ||
      product.tag.toLowerCase().includes(keyword)
    );
  }
  
  return result;
});

// 显示搜索框
const showSearch = () => {
  isSearchVisible.value = !isSearchVisible.value;
  
  if (!isSearchVisible.value) {
    // 隐藏搜索框时，清除搜索
    clearSearch();
  }
};

// 处理搜索
const handleSearch = () => {
  // 直接应用搜索，不需要额外操作
  // 因为已经通过计算属性自动过滤了
};

// 清除搜索
const clearSearch = () => {
  searchKeyword.value = '';
};

// 选择分类
const selectCategory = (category) => {
  selectedCategory.value = category;
};

// 重置筛选条件
const resetFilters = () => {
  searchKeyword.value = '';
  selectedCategory.value = '全部';
};

// 图片加载错误处理
const imgError = (index) => {
  console.error('商品图片加载失败，索引:', index);
  
  // 使用占位图作为备用
  const productTitle = filteredProducts.value[index].title;
  const backupSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="#42b872"/><text x="50%" y="50%" font-family="Arial" font-size="24" fill="white" text-anchor="middle">${productTitle}</text></svg>`;
  
  // 显示错误提示
  uni.showToast({
    title: '图片加载中...',
    icon: 'none',
    duration: 1000
  });
  
  // 更新图片源
  filteredProducts.value[index].image = backupSvg;
};

// 跳转商品详情
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

// 返回上一页
const goBack = () => {
  uni.navigateBack();
};

onMounted(() => {
  // 页面加载动画
  uni.showLoading({
    title: '加载中...',
    mask: true
  });
  
  setTimeout(() => {
    uni.hideLoading();
  }, 600);
});
</script>

<style>
.all-products-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f7fa;
}

/* 顶部导航栏 */
.header {
  padding: 20rpx;
  padding-top: calc(20rpx + var(--status-bar-height));
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #42b872;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.back-button, .search-button {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.back-button:active, .search-button:active {
  transform: scale(0.9);
}

.back-icon {
  width: 36rpx;
  height: 36rpx;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23333' d='M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.search-icon {
  width: 36rpx;
  height: 36rpx;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23333' d='M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.header-title {
  font-size: 36rpx;
  color: #fff;
  font-weight: 500;
}

/* 搜索区域 */
.search-area {
  padding: 20rpx;
  background-color: #42b872;
  animation: slideDown 0.3s ease;
}

.search-box {
  height: 64rpx;
  background-color: white;
  border-radius: 32rpx;
  display: flex;
  align-items: center;
  padding: 0 25rpx;
  transition: all 0.3s ease;
}

.search-box input {
  flex: 1;
  height: 64rpx;
  font-size: 26rpx;
  color: #666;
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

/* 分类筛选 */
.category-filter {
  padding: 20rpx 0;
  background-color: white;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
  margin-bottom: 20rpx;
}

.category-scroll {
  white-space: nowrap;
  padding: 0 20rpx;
}

.category-item {
  display: inline-block;
  padding: 10rpx 30rpx;
  font-size: 28rpx;
  color: #666;
  margin-right: 20rpx;
  border-radius: 30rpx;
  background-color: #f5f5f5;
  transition: all 0.3s ease;
}

.category-item.active {
  background-color: #42b872;
  color: white;
  box-shadow: 0 2rpx 6rpx rgba(66, 184, 114, 0.3);
}

.category-item:active {
  transform: scale(0.95);
}

/* 商品列表 */
.products-grid {
  padding: 0 20rpx;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.product-card {
  width: calc(50% - 15rpx);
  margin-bottom: 30rpx;
  background-color: white;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  animation: fadeIn 0.5s ease;
}

.product-card:active {
  transform: scale(0.97);
}

.product-image {
  width: 100%;
  height: 240rpx;
  background-color: #f8f8f8;
  overflow: hidden;
}

.product-image-content {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.5s ease;
  animation: imgLoad 0.6s ease-out forwards;
}

.product-card:hover .product-image-content {
  transform: scale(1.08);
  filter: saturate(1.1);
}

.product-info {
  padding: 16rpx;
  position: relative;
}

.product-title {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 8rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-tag {
  font-size: 22rpx;
  color: #42b872;
  background-color: rgba(154, 230, 129, 0.1);
  display: inline-block;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
  margin-bottom: 60rpx;
}

.product-footer {
  padding: 0 16rpx;
  position: absolute;
  bottom: 16rpx;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-text {
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
}

.add-button {
  width: 60rpx;
  height: 60rpx;
  background-color: #42b872;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4rpx 8rpx rgba(66, 184, 114, 0.2);
}

.add-button:active {
  transform: scale(0.9);
  background-color: #388f5b;
}

.add-icon {
  color: white;
  font-size: 36rpx;
  line-height: 36rpx;
}

/* 空状态 */
.empty-state {
  padding: 100rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty-icon {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 30rpx;
}

.empty-text {
  font-size: 32rpx;
  color: #999;
  margin-bottom: 30rpx;
}

.reset-button {
  padding: 16rpx 40rpx;
  background-color: #42b872;
  color: white;
  border-radius: 40rpx;
  font-size: 28rpx;
  transition: all 0.3s ease;
  box-shadow: 0 4rpx 12rpx rgba(66, 184, 114, 0.3);
}

.reset-button:active {
  transform: scale(0.95);
  background-color: #388f5b;
}

/* 动画 */
@keyframes fadeIn {
  from { 
    opacity: 0;
    transform: translateY(20rpx);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

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

/* 为不同商品添加交错动画 */
.product-card:nth-child(2n) {
  animation-delay: 0.1s;
}

.product-card:nth-child(3n) {
  animation-delay: 0.2s;
}

.product-card:nth-child(4n) {
  animation-delay: 0.3s;
}
</style> 