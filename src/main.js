import { createSSRApp } from "vue";
import App from "./App.vue";
import api from './utils/api.js';

// 初始化API模块
api.setApiMode('real');  // 设置为真实模式
api.init();  // 初始化API模块（创建默认用户等）

export function createApp() {
	const app = createSSRApp(App);
	return { app };
}
