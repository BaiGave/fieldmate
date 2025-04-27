/**
 * 本地存储工具函数
 */

// 通用存储处理函数
const storageUtil = {
  // 保存数据到存储
  saveData(key, data) {
    try {
      console.log(`正在保存数据到存储: ${key}`, data);
      uni.setStorageSync(key, JSON.stringify(data));
      console.log(`数据已保存: ${key}`);
      
      // 添加验证保存是否成功
      const verifyData = uni.getStorageSync(key);
      console.log(`验证存储数据: ${key}`, verifyData ? '成功' : '失败');
      
      return true;
    } catch (e) {
      console.error(`保存${key}失败:`, e);
      return false;
    }
  },
  
  // 获取存储数据
  getData(key, defaultValue = []) {
    try {
      const dataString = uni.getStorageSync(key);
      console.log(`获取存储数据: ${key}`, dataString ? '成功' : '未找到');
      
      if (!dataString) {
        console.log(`使用默认值: ${key}`, defaultValue);
        return defaultValue;
      }
      
      return JSON.parse(dataString);
    } catch (e) {
      console.error(`获取${key}失败:`, e);
      return defaultValue;
    }
  },
  
  // 清空指定数据
  clearData(key, emptyValue = '[]') {
    try {
      uni.setStorageSync(key, emptyValue);
      return true;
    } catch (e) {
      console.error(`清空${key}失败:`, e);
      return false;
    }
  }
};

// AI分析历史记录键名
const ANALYSIS_HISTORY_KEY = 'ai_analysis_history';

// 保存AI分析历史记录
export const saveAnalysisHistory = (analysisData) => {
  // 获取现有历史记录
  const historyList = storageUtil.getData(ANALYSIS_HISTORY_KEY, []);
  console.log('当前历史记录数量:', historyList.length);
  
  // 创建新记录
  const newRecord = {
    ...analysisData,
    id: Date.now(), // 添加唯一标识
    savedAt: new Date().toISOString()
  };
  
  console.log('添加新记录:', newRecord);
  
  // 添加新记录到顶部
  historyList.unshift(newRecord);
  
  // 限制历史记录数量，只保留最近30条
  const limitedHistory = historyList.slice(0, 30);
  
  // 保存到本地存储
  const result = storageUtil.saveData(ANALYSIS_HISTORY_KEY, limitedHistory);
  console.log('保存分析历史结果:', result ? '成功' : '失败');
  
  return result;
};

// 获取AI分析历史记录
export const getAnalysisHistory = () => {
  const data = storageUtil.getData(ANALYSIS_HISTORY_KEY, []);
  console.log('获取到的历史记录数量:', data.length);
  return data;
};

// 清空历史记录
export const clearAnalysisHistory = () => storageUtil.clearData(ANALYSIS_HISTORY_KEY);

// 删除单条历史记录
export const deleteAnalysisRecord = (recordId) => {
  // 获取现有历史记录
  const historyList = storageUtil.getData(ANALYSIS_HISTORY_KEY, []);
  
  // 过滤掉要删除的记录
  const updatedList = historyList.filter(item => item.id !== recordId);
  
  // 保存更新后的历史记录
  return storageUtil.saveData(ANALYSIS_HISTORY_KEY, updatedList);
}; 