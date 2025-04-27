<script>
import api from './utils/api.js';

export default {
  onLaunch: function () {
    // 初始化API模块
    api.setApiMode('mock');  // 设置为模拟模式
    api.init();  // 初始化API模块（创建默认用户等）
    
    console.log('应用启动初始化完成');
    
    // 检查是否需要自动创建管理员账户
    try {
      // 获取用户列表
      let users = uni.getStorageSync('users') || [];
      
      // 如果没有用户，创建一个管理员用户
      if (!users.length) {
        const adminUser = {
          id: 'admin-' + Date.now(),
          username: 'admin',
          phone: '13800138000',
          password: 'admin123',
          location: '北京市海淀区',
          farmArea: 500,
          createTime: Date.now(),
          updateTime: Date.now(),
          joinDate: new Date().toISOString().split('T')[0]
        };
        
        users.push(adminUser);
        uni.setStorageSync('users', users);
        console.log('创建了默认管理员用户');
      }
    } catch (e) {
      console.error('初始化用户数据失败:', e);
    }
  }
}
</script>

<style>
/*每个页面公共css */
page {
	font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
	box-sizing: border-box;
}

/* 移除所有默认边距 */
view, text, input, button {
	margin: 0;
	padding: 0;
}

/* 移除按钮默认样式 */
button::after {
	border: none;
}

/* 定义主题色变量，方便全局使用 */
:root {
	--primary-color: #42b872;
	--light-green: #e9f5e9;
	--text-color: #333333;
	--light-text: #909090;
	--background-color: #f8f9fa;
}
</style>
