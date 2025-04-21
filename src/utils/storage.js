/**
 * 本地存储工具函数
 */

// 通用存储处理函数
const storageUtil = {
  // 保存数据到存储
  saveData(key, data) {
    try {
      uni.setStorageSync(key, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error(`保存${key}失败:`, e);
      return false;
    }
  },
  
  // 获取存储数据
  getData(key, defaultValue = []) {
    try {
      const dataString = uni.getStorageSync(key) || JSON.stringify(defaultValue);
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
  
  // 添加新记录到顶部
  historyList.unshift({
    ...analysisData,
    id: Date.now(), // 添加唯一标识
    savedAt: new Date().toISOString()
  });
  
  // 限制历史记录数量，只保留最近30条
  const limitedHistory = historyList.slice(0, 30);
  
  // 保存到本地存储
  return storageUtil.saveData(ANALYSIS_HISTORY_KEY, limitedHistory);
};

// 获取AI分析历史记录
export const getAnalysisHistory = () => storageUtil.getData(ANALYSIS_HISTORY_KEY, []);

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