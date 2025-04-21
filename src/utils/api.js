// 本地存储API接口模拟

// 工具函数
const utils = {
  // 生成随机ID
  generateId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  },
  
  // 获取当前时间戳
  getCurrentTime() {
    return new Date().getTime();
  },
  
  // 模拟验证码
  generateSmsCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  },
  
  // 统一响应格式
  createResponse(success, code, message, data = null) {
    return {
      success,
      code,
      message,
      data
    };
  },
  
  // 获取用户数据
  getUserData() {
    let currentUser = uni.getStorageSync('currentUser');
    
    if (typeof currentUser === 'string') {
      try {
        return JSON.parse(currentUser || '{}');
      } catch (e) {
        console.error('解析用户数据失败:', e);
        return {};
      }
    }
    
    return currentUser || {};
  },
  
  // 更新用户存储
  updateUserStorage(userData, updateUsers = true) {
    // 1. 更新currentUser
    uni.setStorageSync('currentUser', JSON.stringify(userData));
    
    // 2. 更新userInfo
    const userInfo = uni.getStorageSync('userInfo');
    if (userInfo) {
      Object.assign(userInfo, userData);
      uni.setStorageSync('userInfo', userInfo);
    }
    
    // 3. 如果需要，更新users数组中对应用户
    if (updateUsers) {
      try {
        let users = uni.getStorageSync('users');
        if (users && Array.isArray(users)) {
          const userIndex = users.findIndex(u => u.id === (userData.id || ''));
          
          if (userIndex !== -1) {
            Object.assign(users[userIndex], userData, { updateTime: this.getCurrentTime() });
            uni.setStorageSync('users', users);
          }
        }
      } catch (e) {
        console.error('更新users数组失败:', e);
      }
    }
  },
  
  // 获取默认用户数据
  getDefaultUserData(data = {}) {
    return {
      username: '默认用户',
      phone: data.phone || '13800138000',
      location: data.location || '未设置位置',
      farmArea: data.farmArea || '100',
      joinDate: new Date().toISOString().split('T')[0]
    };
  },
  
  // 模拟API请求
  async mockRequest(callback, delay = 800) {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const result = callback();
          resolve(result);
        } catch (error) {
          console.error('API请求失败', error);
          resolve(this.createResponse(false, 500, '请求失败'));
        }
      }, delay);
    });
  },
  
  // 格式化当前日期时间
  formatDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }
};

// API模块
export default {
  //===========================================
  // 用户账户管理相关API
  //===========================================
  
  // 用户注册
  register: async (data) => {
    return utils.mockRequest(() => {
      // 检查用户是否已存在
      const users = uni.getStorageSync('users') || [];
      const existingUser = users.find(u => u.username === data.username || u.phone === data.phone);
      
      if (existingUser) {
        return utils.createResponse(false, 400, '用户名或手机号已存在');
      }
      
      // 创建新用户
      const newUser = {
        id: utils.generateId(),
        username: data.username,
        phone: data.phone,
        password: data.password,
        location: data.location || '',
        farmArea: data.farmArea || 0,
        createTime: utils.getCurrentTime(),
        updateTime: utils.getCurrentTime()
      };
      
      // 保存到本地存储
      users.push(newUser);
      uni.setStorageSync('users', users);
      
      // 自动登录（保存当前用户信息）
      uni.setStorageSync('userInfo', newUser);
      const token = 'local-token-' + utils.generateId();
      uni.setStorageSync('token', token);
      
      return utils.createResponse(true, 200, '注册成功', {
        token,
        userInfo: newUser
      });
    });
  },
  
  // 用户登录
  login: async (data) => {
    return utils.mockRequest(() => {
      const users = uni.getStorageSync('users') || [];
      const user = users.find(u => (u.username === data.username || u.phone === data.username) && u.password === data.password);
      
      if (!user) {
        return utils.createResponse(false, 401, '用户名或密码错误');
      }
      
      // 登录成功，保存用户信息到本地存储
      uni.setStorageSync('userInfo', user);
      const token = 'local-token-' + utils.generateId();
      uni.setStorageSync('token', token);
      
      return utils.createResponse(true, 200, '登录成功', {
        token,
        userInfo: user
      });
    });
  },
  
  // 发送短信验证码
  sendVerificationCode: async (data) => {
    return utils.mockRequest(() => {
      // 获取手机号
      const phone = data.phone;
      
      // 生成验证码并保存到本地
      const smsCode = utils.generateSmsCode();
      const smsData = uni.getStorageSync('smsCodes') || {};
      
      smsData[phone] = {
        code: smsCode,
        expireTime: utils.getCurrentTime() + 5 * 60 * 1000 // 5分钟有效期
      };
      
      uni.setStorageSync('smsCodes', smsData);
      
      console.log(`手机号 ${phone} 的验证码: ${smsCode}`); // 开发时在控制台显示验证码
      
      return utils.createResponse(true, 200, '验证码发送成功');
    });
  },
  
  // 重置密码
  resetPassword: async (data) => {
    return utils.mockRequest(() => {
      // 验证短信验证码
      const smsData = uni.getStorageSync('smsCodes') || {};
      const smsInfo = smsData[data.phone];
      
      if (!smsInfo || smsInfo.code !== data.code || smsInfo.expireTime < utils.getCurrentTime()) {
        return utils.createResponse(false, 400, '验证码无效或已过期');
      }
      
      // 更新用户密码
      const users = uni.getStorageSync('users') || [];
      const userIndex = users.findIndex(u => u.phone === data.phone);
      
      if (userIndex === -1) {
        return utils.createResponse(false, 404, '用户不存在');
      }
      
      users[userIndex].password = data.password;
      users[userIndex].updateTime = utils.getCurrentTime();
      
      uni.setStorageSync('users', users);
      
      // 删除已使用的验证码
      delete smsData[data.phone];
      uni.setStorageSync('smsCodes', smsData);
      
      return utils.createResponse(true, 200, '密码重置成功');
    });
  },
  
  // 修改密码
  changePassword: async (data) => {
    return utils.mockRequest(() => {
      // 获取当前用户信息
      const userInfo = uni.getStorageSync('userInfo');
      
      if (!userInfo) {
        return utils.createResponse(false, 401, '用户未登录');
      }
      
      // 更新用户存储
      utils.updateUserStorage({ password: data.newPassword, updateTime: utils.getCurrentTime() });
      
      return utils.createResponse(true, 200, '密码修改成功');
    });
  },
  
  // 清除身份验证数据（用于登出）
  clearAuthData: () => {
    try {
      uni.removeStorageSync('token');
      uni.removeStorageSync('userInfo');
      return true;
    } catch (e) {
      console.error('清除身份验证数据失败:', e);
      return false;
    }
  },
  
  //===========================================
  // 用户信息相关API
  //===========================================
  
  // 获取个人信息
  getUserProfile: async () => {
    return utils.mockRequest(() => {
      // 获取当前用户信息
      const userInfo = uni.getStorageSync('userInfo');
      
      if (!userInfo) {
        return utils.createResponse(false, 401, '未登录');
      }
      
      // 格式化注册日期
      let joinDate = userInfo.joinDate;
      if (!joinDate) {
        // 默认为注册时间或当前日期
        if (userInfo.createTime) {
          const createDate = new Date(userInfo.createTime);
          joinDate = `${createDate.getFullYear()}-${String(createDate.getMonth() + 1).padStart(2, '0')}-${String(createDate.getDate()).padStart(2, '0')}`;
        } else {
          const date = new Date();
          joinDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        }
      }
      
      // 返回用户信息
      return utils.createResponse(true, 200, '获取成功', {
        id: userInfo.id,
        username: userInfo.username || '默认用户',
        phone: userInfo.phone || '13800138000',
        location: userInfo.location || '未设置位置',
        farmArea: userInfo.farmArea || '100',
        joinDate: joinDate
      });
    }, 600);
  },
  
  // 更新用户信息
  updateUserInfo: async (data) => {
    return utils.mockRequest(() => {
      // 获取或创建用户数据
      let userData = utils.getUserData();
      
      if (!userData || Object.keys(userData).length === 0) {
        userData = utils.getDefaultUserData(data);
      } else {
        // 仅更新提供的字段
        ['location', 'username', 'farmArea'].forEach(field => {
          if (data[field] !== undefined) {
            userData[field] = data[field];
          }
        });
      }
      
      // 更新各种用户存储
      utils.updateUserStorage(userData);
      
      return utils.createResponse(true, 200, '用户信息更新成功', userData);
    }, 500);
  },
  
  // 使用验证码更新手机号
  updatePhoneWithVerification: async (data) => {
    return utils.mockRequest(() => {
      // 在本地模式下，直接通过验证码验证
      // 实际项目中这里应该调用后端API进行验证
      
      // 获取或创建用户数据
      let userData = utils.getUserData();
      
      if (!userData || Object.keys(userData).length === 0) {
        userData = utils.getDefaultUserData({ phone: data.phone });
      } else {
        userData.phone = data.phone;
      }
      
      // 更新各种用户存储
      utils.updateUserStorage(userData);
      
      // 清除验证码数据
      try {
        const smsData = uni.getStorageSync('smsCodes') || {};
        delete smsData[data.phone];
        uni.setStorageSync('smsCodes', smsData);
      } catch (e) {
        console.error('清除验证码数据失败:', e);
      }
      
      return utils.createResponse(true, 200, '手机号更新成功');
    });
  },
  
  //===========================================
  // 农场管理相关API
  //===========================================
  
  // 更新农场面积
  updateFarmArea: async (data) => {
    return utils.mockRequest(() => {
      // 获取或创建用户数据
      let userData = utils.getUserData();
      
      if (!userData || Object.keys(userData).length === 0) {
        userData = utils.getDefaultUserData({ farmArea: data.farmArea });
      } else {
        userData.farmArea = data.farmArea;
      }
      
      // 更新各种用户存储
      utils.updateUserStorage(userData);
      
      // 触发全局事件，确保实时更新
      if (typeof uni !== 'undefined' && uni.$emit) {
        uni.$emit('farmAreaUpdated', { farmArea: data.farmArea });
      }
      
      return utils.createResponse(true, 200, '农场面积更新成功', { farmArea: data.farmArea });
    }, 500);
  },
  
  // 获取农场信息
  getFarmInfo: async () => {
    return utils.mockRequest(() => {
      // 获取当前用户信息
      const userInfo = uni.getStorageSync('userInfo');
      
      if (!userInfo) {
        return utils.createResponse(false, 401, '未登录');
      }
      
      // 返回模拟的农场信息
      return utils.createResponse(true, 200, '获取成功', {
        farmArea: userInfo.farmArea || 0,
        plotTotalArea: userInfo.farmArea ? userInfo.farmArea * 0.85 : 0, // 模拟已耕种面积
        plotCount: userInfo.farmArea ? Math.ceil(userInfo.farmArea / 50) : 0 // 模拟地块数量
      });
    }, 500);
  },
  
  // 同步面积
  syncArea: async () => {
    return utils.mockRequest(() => utils.createResponse(true, 200, '同步成功'));
  },
  
  //===========================================
  // 消息通知相关API
  //===========================================
  
  // 获取消息通知列表
  getNotifications: async () => {
    return utils.mockRequest(() => {
      // 获取当前用户信息，确保已登录
      const userInfo = uni.getStorageSync('userInfo');
      
      if (!userInfo) {
        return utils.createResponse(false, 401, '未登录');
      }
      
      // 尝试从本地存储获取消息
      let notifications = [];
      try {
        // 检查用户是否已经清空过消息
        const hasCleared = uni.getStorageSync('notifications_cleared');
        
        // 从本地存储获取消息
        const storedNotifications = uni.getStorageSync('notifications');
        
        // 如果用户已经清空过消息，并且当前没有消息，则保持空状态
        if (hasCleared && (!storedNotifications || JSON.parse(storedNotifications).length === 0)) {
          notifications = [];
        } else if (storedNotifications) {
          notifications = JSON.parse(storedNotifications);
        } else {
          // 如果没有存储过消息，且未清空过，则初始化默认消息
          notifications = [{
            id: utils.generateId(),
            title: '欢迎使用农田助理',
            content: '欢迎使用农田助理！在这里您将收到重要的系统通知和农田预警信息。',
            time: new Date().toLocaleString('zh-CN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            }).replace(/\//g, '-'),
            type: 'system',
            read: false
          }];
          
          // 保存到本地存储
          uni.setStorageSync('notifications', JSON.stringify(notifications));
        }
      } catch (e) {
        console.error('获取消息失败:', e);
        notifications = [];
      }
      
      return utils.createResponse(true, 200, '获取成功', notifications);
    }, 500);
  },
  
  // 标记消息为已读
  markNotificationAsRead: async (data) => {
    return utils.mockRequest(() => {
      const { notificationId } = data;
      
      // 获取当前用户信息，确保已登录
      const userInfo = uni.getStorageSync('userInfo');
      
      if (!userInfo) {
        return utils.createResponse(false, 401, '未登录');
      }
      
      // 尝试从本地存储获取消息
      try {
        const storedNotifications = uni.getStorageSync('notifications');
        if (!storedNotifications) {
          return utils.createResponse(false, 404, '消息不存在');
        }
        
        const notifications = JSON.parse(storedNotifications);
        const index = notifications.findIndex(n => n.id === notificationId);
        
        if (index === -1) {
          return utils.createResponse(false, 404, '消息不存在');
        }
        
        // 标记为已读
        notifications[index].read = true;
        
        // 保存到本地存储
        uni.setStorageSync('notifications', JSON.stringify(notifications));
        
        return utils.createResponse(true, 200, '标记成功');
      } catch (e) {
        console.error('标记消息已读失败:', e);
        return utils.createResponse(false, 500, '操作失败');
      }
    });
  },
  
  // 清空所有消息
  clearAllNotifications: async () => {
    return utils.mockRequest(() => {
      // 获取当前用户信息，确保已登录
      const userInfo = uni.getStorageSync('userInfo');
      
      if (!userInfo) {
        return utils.createResponse(false, 401, '未登录');
      }
      
      // 清空消息
      try {
        uni.setStorageSync('notifications', JSON.stringify([]));
        uni.setStorageSync('notifications_cleared', 'true');
        
        return utils.createResponse(true, 200, '清空成功');
      } catch (e) {
        console.error('清空消息失败:', e);
        return utils.createResponse(false, 500, '操作失败');
      }
    });
  },
  
  //===========================================
  // 摄像机监控相关API
  //===========================================
  
  // 获取摄像头状态和流
  getCameraStream: async () => {
    return utils.mockRequest(() => {
      // 获取当前用户信息，确保已登录
      const userInfo = uni.getStorageSync('userInfo');
      
      if (!userInfo) {
        return utils.createResponse(false, 401, '未登录');
      }
      
      // 模拟摄像头未连接状态
      return utils.createResponse(true, 200, '获取成功', {
        connected: false,
        streamUrl: '',
        message: '摄像头未连接',
        deviceInfo: {
          id: 'CAM_MOCK_001',
          name: '农田监控摄像头',
          status: 'offline',
          lastOnline: utils.formatDateTime()
        }
      });
    }, 800);
  },
  
  // 连接摄像头
  connectCamera: async () => {
    return utils.mockRequest(() => {
      // 获取当前用户信息，确保已登录
      const userInfo = uni.getStorageSync('userInfo');
      
      if (!userInfo) {
        return utils.createResponse(false, 401, '未登录');
      }
      
      // 模拟摄像头连接失败
      return utils.createResponse(false, 503, '连接失败', {
        reason: '设备离线',
        message: '摄像头设备当前不在线，请检查设备连接或联系客服'
      });
    }, 1500);
  },
  
  // 获取AI检测历史记录
  getAiDetectionEvents: async () => {
    return utils.mockRequest(() => {
      // 获取当前用户信息，确保已登录
      const userInfo = uni.getStorageSync('userInfo');
      
      if (!userInfo) {
        return utils.createResponse(false, 401, '未登录');
      }
      
      // 模拟AI检测历史记录
      const events = [];
      for (let i = 0; i < 5; i++) {
        const time = new Date(Date.now() - i * 3600000);
        events.push({
          id: utils.generateId(),
          desc: `检测到农田${['东', '南', '西', '北', '中'][i]}侧有动态`,
          type: ['movement', 'animal', 'person', 'vehicle', 'other'][i],
          time: time.toLocaleString('zh-CN'),
          read: i > 2
        });
      }
      
      return utils.createResponse(true, 200, '获取成功', events);
    }, 600);
  },
  
  //===========================================
  // 作物智诊相关API
  //===========================================
  
  // 分析作物图片
  analyzeCropImage: async (data) => {
    return utils.mockRequest(() => {
      // 获取当前用户信息，确保已登录
      const userInfo = uni.getStorageSync('userInfo');
      
      if (!userInfo) {
        return utils.createResponse(false, 401, '未登录');
      }
      
      // 获取图片路径
      const { imagePath } = data;
      
      if (!imagePath) {
        return utils.createResponse(false, 400, '未提供图片');
      }
      
      // 模拟分析结果
      const resultTypes = [
        {
          // 健康结果
          cropType: '水稻',
          growthStage: '抽穗期',
          healthStatus: '健康',
          analysisDetail: '经AI分析，当前水稻处于抽穗期，整体生长状况良好，叶色浓绿，长势均匀，未发现明显病虫害迹象。',
          suggestions: [
            '继续保持现有管理方式',
            '注意控制水分，保持稻田浅水层',
            '预计20天后可以收获'
          ]
        },
        {
          // 轻微问题
          cropType: '小麦',
          growthStage: '灌浆期',
          healthStatus: '轻微受损',
          analysisDetail: '经AI分析，当前小麦处于灌浆期，叶片边缘有轻微发黄现象，可能是缺少微量元素或有轻微病虫害。建议尽快处理以避免影响产量。',
          suggestions: [
            '适量补充锌、镁等微量元素肥料',
            '检查是否有蚜虫等害虫，必要时进行防治',
            '控制田间湿度，避免过于潮湿'
          ]
        },
        {
          // 严重问题
          cropType: '玉米',
          growthStage: '拔节期',
          healthStatus: '严重受损',
          analysisDetail: '经AI分析，当前玉米处于拔节期，但发现多处叶片卷曲发黄，可能存在严重缺水或病虫害问题。建议立即采取措施处理。',
          suggestions: [
            '立即检查灌溉系统，确保水分供应',
            '喷施广谱杀虫剂防治可能的病虫害',
            '增施有机肥料提高植株抵抗力'
          ]
        }
      ];
      
      // 随机选择一种结果
      const result = resultTypes[Math.floor(Math.random() * resultTypes.length)];
      
      // 添加分析时间
      const now = new Date();
      const analysisTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      // 保存分析历史
      try {
        const historyItem = {
          id: utils.generateId(),
          imagePath,
          analysisTime,
          savedAt: Date.now(),
          ...result
        };
        
        // 获取历史记录
        let history = [];
        const storedHistory = uni.getStorageSync('analysis_history');
        if (storedHistory) {
          history = JSON.parse(storedHistory);
        }
        
        // 添加新记录到开头
        history.unshift(historyItem);
        
        // 限制历史记录数量
        if (history.length > 20) {
          history = history.slice(0, 20);
        }
        
        // 保存更新后的历史记录
        uni.setStorageSync('analysis_history', JSON.stringify(history));
      } catch (e) {
        console.error('保存分析历史失败:', e);
      }
      
      return utils.createResponse(true, 200, '分析成功', {
        analysisTime,
        ...result
      });
    }, 2000); // 模拟较长的分析时间
  },
  
  // 获取作物分析历史
  getAnalysisHistory: async () => {
    return utils.mockRequest(() => {
      // 获取当前用户信息，确保已登录
      const userInfo = uni.getStorageSync('userInfo');
      
      if (!userInfo) {
        return utils.createResponse(false, 401, '未登录');
      }
      
      // 从本地存储获取历史记录
      try {
        const storedHistory = uni.getStorageSync('analysis_history');
        if (!storedHistory) {
          return utils.createResponse(true, 200, '获取成功', []);
        }
        
        const history = JSON.parse(storedHistory);
        return utils.createResponse(true, 200, '获取成功', history);
      } catch (e) {
        console.error('获取分析历史失败:', e);
        return utils.createResponse(false, 500, '获取失败');
      }
    }, 600);
  },
  
  // 删除作物分析历史记录
  deleteAnalysisRecord: async (data) => {
    return utils.mockRequest(() => {
      // 获取当前用户信息，确保已登录
      const userInfo = uni.getStorageSync('userInfo');
      
      if (!userInfo) {
        return utils.createResponse(false, 401, '未登录');
      }
      
      const { recordId } = data;
      
      if (!recordId) {
        return utils.createResponse(false, 400, '未提供记录ID');
      }
      
      // 从本地存储获取历史记录
      try {
        const storedHistory = uni.getStorageSync('analysis_history');
        if (!storedHistory) {
          return utils.createResponse(false, 404, '记录不存在');
        }
        
        let history = JSON.parse(storedHistory);
        const index = history.findIndex(item => item.id === recordId);
        
        if (index === -1) {
          return utils.createResponse(false, 404, '记录不存在');
        }
        
        // 删除记录
        history.splice(index, 1);
        
        // 保存更新后的历史记录
        uni.setStorageSync('analysis_history', JSON.stringify(history));
        
        return utils.createResponse(true, 200, '删除成功');
      } catch (e) {
        console.error('删除分析历史失败:', e);
        return utils.createResponse(false, 500, '删除失败');
      }
    }, 500);
  },
  
  // 清空所有作物分析历史
  clearAnalysisHistory: async () => {
    return utils.mockRequest(() => {
      // 获取当前用户信息，确保已登录
      const userInfo = uni.getStorageSync('userInfo');
      
      if (!userInfo) {
        return utils.createResponse(false, 401, '未登录');
      }
      
      // 清空历史记录
      try {
        uni.setStorageSync('analysis_history', JSON.stringify([]));
        return utils.createResponse(true, 200, '清空成功');
      } catch (e) {
        console.error('清空分析历史失败:', e);
        return utils.createResponse(false, 500, '清空失败');
      }
    }, 500);
  }
};