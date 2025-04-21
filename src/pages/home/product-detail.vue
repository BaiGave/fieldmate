<template>
	<view class="product-detail-container">
		<!-- 顶部导航栏 -->
		<view class="header">
			<view class="back-button" @click="goBack">
				<view class="back-icon"></view>
			</view>
			<view class="header-title">商品详情</view>
			<view class="share-button" @click="shareProduct">
				<view class="share-icon"></view>
			</view>
		</view>
		
		<!-- 商品图片展示 -->
		<view class="product-image">
			<image :src="product.image" mode="aspectFill" @error="imgError" class="product-image-content"></image>
			<view class="image-indicator">
				<view class="indicator-dot active"></view>
			</view>
		</view>
		
		<!-- 商品信息 -->
		<view class="product-info-card">
			<view class="product-title">{{ product.title }}</view>
			<view class="product-price">¥ {{ product.price }}</view>
			<view class="product-tag">{{ product.tag }}</view>
			
			<view class="divider"></view>
			
			<!-- 商品描述 -->
			<view class="description-section">
				<view class="section-title">商品描述</view>
				<view class="product-description">{{ product.description }}</view>
			</view>
			
			<view class="divider"></view>
			
			<!-- 规格选择 -->
			<view class="specs-section">
				<view class="section-title">规格选择</view>
				<view class="specs-options">
					<view 
						v-for="(spec, index) in specs" 
						:key="index"
						:class="['spec-item', selectedSpec === spec ? 'active' : '']"
						@click="selectSpec(spec)"
					>
						{{ spec }}
					</view>
				</view>
			</view>
			
			<view class="divider"></view>
			
			<!-- 数量选择 -->
			<view class="quantity-section">
				<view class="section-title">数量</view>
				<view class="quantity-selector">
					<view class="quantity-button minus" @click="decreaseQuantity">-</view>
					<view class="quantity-value">{{ quantity }}</view>
					<view class="quantity-button plus" @click="increaseQuantity">+</view>
				</view>
			</view>
		</view>
		
		<!-- 相关推荐 -->
		<view class="related-section">
			<view class="section-header">
				<text class="section-title">相关推荐</text>
			</view>
			<scroll-view scroll-x class="related-scroll" show-scrollbar="false">
				<view 
					v-for="(relatedProduct, index) in relatedProducts" 
					:key="index"
					class="related-product"
					@click="viewProductDetail(relatedProduct)"
				>
					<view class="related-image">
						<image :src="relatedProduct.image" mode="aspectFill" class="related-image-content"></image>
					</view>
					<view class="related-title">{{ relatedProduct.title }}</view>
					<view class="related-price">¥ {{ relatedProduct.price }}</view>
				</view>
			</scroll-view>
		</view>
		
		<!-- 底部操作栏 -->
		<view class="bottom-action">
			<view class="action-buttons">
				<view class="action-button customer-service" @click="contactService">
					<view class="action-icon customer-service-icon"></view>
					<text class="action-text">客服</text>
				</view>
				<view class="action-button cart" @click="goToCart">
					<view class="action-icon cart-icon"></view>
					<text class="action-text">购物车</text>
					<view class="cart-badge" v-if="cartCount > 0">{{ cartCount }}</view>
				</view>
			</view>
			<view class="buy-buttons">
				<view class="add-to-cart-button" @click="addToCart">加入购物车</view>
				<view class="buy-now-button" @click="buyNow">立即购买</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// 商品数据
const product = ref({
	id: 0,
	title: '加载中...',
	tag: '',
	price: '0.00',
	image: '',
	description: '商品信息加载中...'
});

// 规格选择
const specs = ref(['标准', '特惠装', '礼盒装']);
const selectedSpec = ref('标准');

// 购买数量
const quantity = ref(1);

// 购物车数量
const cartCount = ref(0);

// 相关推荐商品
const relatedProducts = ref([]);

// 从本地存储获取商品数据
const loadProductData = () => {
	uni.showLoading({
		title: '加载中...',
		mask: true
	});
	
	try {
		const productData = uni.getStorageSync('selectedProduct');
		if (productData) {
			product.value = JSON.parse(productData);
			console.log('加载的商品数据:', product.value);
			
			// 加载相关推荐
			loadRelatedProducts();
		} else {
			// 如果没有商品数据，获取URL中的id参数
			const pages = getCurrentPages();
			const currentPage = pages[pages.length - 1];
			const productId = currentPage.options?.id;
			
			if (productId) {
				// 根据ID从所有商品中获取数据
				loadProductById(productId);
			} else {
				uni.showToast({
					title: '商品数据加载失败',
					icon: 'none',
					duration: 2000
				});
				
				setTimeout(() => {
					goBack();
				}, 2000);
			}
		}
	} catch (e) {
		console.error('获取商品数据失败:', e);
		uni.showToast({
			title: '商品数据加载失败',
			icon: 'none',
			duration: 2000
		});
	} finally {
		setTimeout(() => {
			uni.hideLoading();
		}, 500);
	}
};

// 根据ID加载商品
const loadProductById = (id) => {
	// 这里应该有一个API调用来获取商品数据
	// 但目前我们使用模拟数据
	console.log('根据ID加载商品:', id);
	
	// 获取所有商品数据
	const allProductsData = uni.getStorageSync('allProducts');
	if (allProductsData) {
		const allProducts = JSON.parse(allProductsData);
		const foundProduct = allProducts.find(p => p.id == id);
		
		if (foundProduct) {
			product.value = foundProduct;
			console.log('找到商品:', foundProduct);
			
			// 加载相关推荐
			loadRelatedProducts();
		} else {
			uni.showToast({
				title: '未找到商品',
				icon: 'none',
				duration: 2000
			});
		}
	} else {
		// 如果本地没有所有商品数据，使用硬编码的演示数据
		// 这部分在实际应用中应该由API调用替代
		import('../../static/images/p1.png').then(p1Image => {
			product.value = {
				id: id,
				title: '便携式农事记录本',
				tag: '记录管理',
				price: '58.00',
				image: p1Image.default,
				description: '专为农业工作者设计的记录本，防水，耐用，便于随时记录农事活动。'
			};
			
			// 加载相关推荐
			loadRelatedProducts();
		});
	}
};

// 加载相关推荐商品
const loadRelatedProducts = () => {
	// 获取所有商品数据
	const allProductsData = uni.getStorageSync('allProducts');
	
	if (allProductsData) {
		const allProducts = JSON.parse(allProductsData);
		
		// 筛选出同类别的商品，排除当前商品
		let related = allProducts.filter(p => p.tag === product.value.tag && p.id !== product.value.id);
		
		// 如果同类别商品不足3个，添加其他类别的商品
		if (related.length < 3) {
			const otherProducts = allProducts.filter(p => p.id !== product.value.id && p.tag !== product.value.tag);
			related = [...related, ...otherProducts].slice(0, 3);
		}
		
		relatedProducts.value = related.slice(0, 3);
	} else {
		// 如果本地没有所有商品数据，使用硬编码的演示数据
		// 这部分在实际应用中应该由API调用替代
		import('../../static/images/p2.png').then(p2Image => {
			import('../../static/images/p3.png').then(p3Image => {
				relatedProducts.value = [
					{
						id: 2,
						title: '有机肥',
						tag: '土壤改良',
						price: '168.00',
						image: p2Image.default,
						description: '纯天然有机肥料，富含多种营养元素，改善土壤结构，提高土壤肥力。'
					},
					{
						id: 3,
						title: '生物菌肥',
						tag: '土壤改良',
						price: '198.00',
						image: p3Image.default,
						description: '含有多种有益微生物，促进植物根系发育，增强作物抗逆性。'
					}
				];
			});
		});
	}
};

// 获取购物车数量
const getCartCount = () => {
	try {
		const cartItems = uni.getStorageSync('cartItems');
		if (cartItems) {
			const items = JSON.parse(cartItems);
			cartCount.value = items.reduce((total, item) => total + item.quantity, 0);
		}
	} catch (e) {
		console.error('获取购物车数据失败:', e);
	}
};

// 选择规格
const selectSpec = (spec) => {
	selectedSpec.value = spec;
	
	uni.showToast({
		title: `已选择${spec}`,
		icon: 'none',
		duration: 1000
	});
};

// 增加数量
const increaseQuantity = () => {
	if (quantity.value < 99) {
		quantity.value++;
	}
};

// 减少数量
const decreaseQuantity = () => {
	if (quantity.value > 1) {
		quantity.value--;
	}
};

// 添加到购物车
const addToCart = () => {
	try {
		// 获取当前购物车
		const cartItems = JSON.parse(uni.getStorageSync('cartItems') || '[]');
		
		// 检查商品是否已在购物车中，匹配规格
		const existingItemIndex = cartItems.findIndex(item => 
			item.id === product.value.id && item.spec === selectedSpec.value
		);
		
		if (existingItemIndex > -1) {
			// 增加数量
			cartItems[existingItemIndex].quantity += quantity.value;
		} else {
			// 添加新商品
			cartItems.push({
				...product.value,
				quantity: quantity.value,
				spec: selectedSpec.value
			});
		}
		
		// 保存到本地存储
		uni.setStorageSync('cartItems', JSON.stringify(cartItems));
		
		// 更新购物车数量
		getCartCount();
		
		// 提示用户
		uni.showToast({
			title: '已添加到购物车',
			icon: 'success',
			duration: 1500
		});
	} catch (e) {
		console.error('添加购物车失败:', e);
		uni.showToast({
			title: '添加购物车失败',
			icon: 'none',
			duration: 1500
		});
	}
};

// 立即购买
const buyNow = () => {
	// 添加到购物车
	addToCart();
	
	// 跳转到结算页面
	setTimeout(() => {
		uni.navigateTo({
			url: '/pages/cart/checkout'
		});
	}, 300);
};

// 分享商品
const shareProduct = () => {
	uni.showShareMenu({
		withShareTicket: true,
		menus: ['shareAppMessage', 'shareTimeline']
	});
	
	uni.showToast({
		title: '请点击右上角分享',
		icon: 'none',
		duration: 2000
	});
};

// 联系客服
const contactService = () => {
	uni.showToast({
		title: '正在连接客服...',
		icon: 'none',
		duration: 1500
	});
};

// 前往购物车
const goToCart = () => {
	uni.switchTab({
		url: '/pages/cart/cart'
	});
};

// 图片加载错误处理
const imgError = () => {
	console.error('商品图片加载失败');
	
	// 使用占位图作为备用
	const backupSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="#42b872"/><text x="50%" y="50%" font-family="Arial" font-size="24" fill="white" text-anchor="middle">${product.value.title}</text></svg>`;
	
	// 显示错误提示
	uni.showToast({
		title: '图片加载中...',
		icon: 'none',
		duration: 1000
	});
	
	// 更新图片源
	product.value.image = backupSvg;
};

// 查看推荐商品详情
const viewProductDetail = (recommendedProduct) => {
	// 保存选中的商品到本地存储，以便在详情页获取
	uni.setStorageSync('selectedProduct', JSON.stringify(recommendedProduct));
	
	// 刷新当前页面
	onMounted(() => {
		loadProductData();
	});
	
	// 更新URL，但不刷新页面
	history.replaceState(
		{},
		'',
		`/pages/home/product-detail?id=${recommendedProduct.id}`
	);
};

// 返回上一页
const goBack = () => {
	uni.navigateBack();
};

onMounted(() => {
	// 加载商品数据
	loadProductData();
	
	// 获取购物车数量
	getCartCount();
	
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
.product-detail-container {
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

.back-button, .share-button {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.3s ease;
}

.back-button:active, .share-button:active {
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

.share-icon {
	width: 36rpx;
	height: 36rpx;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23333' d='M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z'/%3E%3C/svg%3E");
	background-repeat: no-repeat;
	background-position: center;
	background-size: contain;
}

.header-title {
	font-size: 36rpx;
	color: #fff;
	font-weight: 500;
}

/* 商品图片 */
.product-image {
	width: 100%;
	height: 750rpx;
	background-color: #f8f8f8;
	position: relative;
	overflow: hidden;
}

.product-image-content {
	width: 100%;
	height: 100%;
	object-fit: cover;
	transition: all 0.5s ease;
	animation: imgLoad 0.8s ease-out forwards;
}

.image-indicator {
	position: absolute;
	bottom: 20rpx;
	left: 0;
	right: 0;
	display: flex;
	justify-content: center;
}

.indicator-dot {
	width: 16rpx;
	height: 16rpx;
	border-radius: 8rpx;
	background-color: rgba(255, 255, 255, 0.6);
	margin: 0 6rpx;
	transition: all 0.3s ease;
}

.indicator-dot.active {
	background-color: #fff;
	width: 30rpx;
}

/* 商品信息卡片 */
.product-info-card {
	margin: 20rpx;
	padding: 30rpx;
	background-color: #fff;
	border-radius: 16rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	animation: fadeIn 0.5s ease;
}

.product-title {
	font-size: 40rpx;
	color: #333;
	font-weight: bold;
	margin-bottom: 20rpx;
}

.product-price {
	font-size: 48rpx;
	color: #ff4b33;
	font-weight: bold;
	margin-bottom: 10rpx;
}

.product-tag {
	font-size: 24rpx;
	color: #42b872;
	background-color: rgba(154, 230, 129, 0.1);
	display: inline-block;
	padding: 6rpx 16rpx;
	border-radius: 20rpx;
	margin-bottom: 20rpx;
}

.divider {
	height: 1px;
	background-color: #f0f0f0;
	margin: 30rpx 0;
}

/* 描述部分 */
.description-section, .specs-section, .quantity-section {
	margin-bottom: 20rpx;
}

.section-title {
	font-size: 32rpx;
	color: #333;
	font-weight: 500;
	margin-bottom: 20rpx;
}

.product-description {
	font-size: 28rpx;
	color: #666;
	line-height: 1.6;
}

/* 规格选择 */
.specs-options {
	display: flex;
	flex-wrap: wrap;
}

.spec-item {
	padding: 12rpx 30rpx;
	border: 1px solid #ddd;
	border-radius: 40rpx;
	font-size: 26rpx;
	color: #666;
	margin-right: 20rpx;
	margin-bottom: 10rpx;
	transition: all 0.3s ease;
}

.spec-item.active {
	color: #42b872;
	border-color: #42b872;
	background-color: rgba(154, 230, 129, 0.1);
}

.spec-item:active {
	transform: scale(0.95);
}

/* 数量选择 */
.quantity-selector {
	display: flex;
	align-items: center;
}

.quantity-button {
	width: 60rpx;
	height: 60rpx;
	border: 1px solid #ddd;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 36rpx;
	color: #666;
	transition: all 0.3s ease;
}

.quantity-button.minus {
	border-radius: 30rpx 0 0 30rpx;
}

.quantity-button.plus {
	border-radius: 0 30rpx 30rpx 0;
}

.quantity-button:active {
	background-color: #f5f5f5;
}

.quantity-value {
	width: 90rpx;
	height: 60rpx;
	border-top: 1px solid #ddd;
	border-bottom: 1px solid #ddd;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 30rpx;
	color: #333;
}

/* 相关推荐 */
.related-section {
	margin: 0 20rpx 120rpx;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.related-scroll {
	white-space: nowrap;
}

.related-product {
	display: inline-block;
	width: 220rpx;
	margin-right: 20rpx;
	background-color: #fff;
	border-radius: 12rpx;
	overflow: hidden;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
	transition: all 0.3s ease;
}

.related-product:active {
	transform: scale(0.97);
}

.related-image {
	width: 100%;
	height: 220rpx;
	background-color: #f8f8f8;
	overflow: hidden;
}

.related-image-content {
	width: 100%;
	height: 100%;
	object-fit: cover;
	transition: all 0.3s ease;
}

.related-product:hover .related-image-content {
	transform: scale(1.05);
}

.related-title {
	padding: 10rpx 12rpx;
	font-size: 24rpx;
	color: #333;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.related-price {
	padding: 0 12rpx 10rpx;
	font-size: 26rpx;
	color: #ff4b33;
	font-weight: bold;
}

/* 底部操作栏 */
.bottom-action {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: #fff;
	display: flex;
	align-items: center;
	padding: 16rpx 20rpx;
	box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
	z-index: 100;
}

.action-buttons {
	display: flex;
	margin-right: 20rpx;
}

.action-button {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 0 20rpx;
	position: relative;
}

.action-icon {
	width: 40rpx;
	height: 40rpx;
	margin-bottom: 4rpx;
}

.customer-service-icon {
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23666' d='M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9zm-4 18H6c-.55 0-1-.45-1-1v-4h3v5zm10 0h-2v-5h3v4c0 .55-.45 1-1 1z'/%3E%3C/svg%3E");
	background-repeat: no-repeat;
	background-position: center;
	background-size: contain;
}

.cart-icon {
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23666' d='M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z'/%3E%3C/svg%3E");
	background-repeat: no-repeat;
	background-position: center;
	background-size: contain;
}

.action-text {
	font-size: 20rpx;
	color: #666;
}

.cart-badge {
	position: absolute;
	top: -6rpx;
	right: 10rpx;
	background-color: #ff4b33;
	color: white;
	font-size: 18rpx;
	border-radius: 20rpx;
	padding: 0 10rpx;
	min-width: 30rpx;
	height: 30rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.buy-buttons {
	display: flex;
	flex: 1;
}

.add-to-cart-button, .buy-now-button {
	flex: 1;
	height: 80rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 40rpx;
	font-size: 28rpx;
	color: white;
	transition: all 0.3s ease;
}

.add-to-cart-button {
	background-color: #ff9800;
	margin-right: 16rpx;
}

.buy-now-button {
	background-color: #ff4b33;
}

.add-to-cart-button:active, .buy-now-button:active {
	transform: scale(0.97);
	opacity: 0.9;
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
</style> 