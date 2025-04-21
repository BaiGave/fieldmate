# 农田助理后端API文档

## 简介
本文档定义了农田助理前端应用所需的后端API接口规范。后端开发团队需按照本文档实现对应的接口功能，确保与前端的无缝对接。

这是一个基于Python的后端项目，数据库连接方式是：mysql://root:8pzlxn5j@test-db-mysql.ns-h0e5wid2.svc:3306

## 技术栈与环境
- 开发语言：Python
- 数据库：MySQL
- 数据库连接：mysql://root:8pzlxn5j@test-db-mysql.ns-h0e5wid2.svc:3306
- 建议使用框架：Flask/FastAPI/Django

## 通用规范

### 认证方式
除了注册、登录等特定接口外，所有请求都需要在请求头中包含授权令牌：
```
Authorization: Bearer <token>
```

### 响应格式
所有API响应都遵循以下统一格式：
```json
{
  "success": true/false,  // 请求是否成功
  "code": 200,            // 状态码，成功时为200，失败时根据错误类型返回相应的错误码
  "message": "消息说明",  // 响应消息，成功或错误的描述信息
  "data": {               // 响应数据，成功时返回相关数据，失败时可为null
    // 具体数据字段
  }
}
```

### 通用错误码
| 错误码 | 说明 |
|-------|------|
| 400 | 请求参数错误 |
| 401 | 未授权（未登录或token无效） |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

## 数据库设计建议

需为该API创建以下主要数据表：

1. `users` - 用户表
2. `notifications` - 消息通知表
3. `farm_info` - 农场信息表
4. `camera_devices` - 摄像设备表
5. `ai_detection_events` - AI检测事件表
6. `crop_analysis` - 作物分析记录表

详细的表结构设计请根据API返回数据格式自行拓展。

## API 接口详情

## 1. 用户账户管理相关API

### 1.1 用户注册
- **接口**: `/auth/register`
- **方法**: `POST`
- **请求参数**:
  ```json
  {
    "username": "用户名",
    "phone": "手机号",
    "password": "密码",
    "location": "位置信息（可选）",
    "farmArea": "农场面积（可选）"
  }
  ```
- **成功响应**:
  ```json
  {
    "success": true,
    "code": 200,
    "message": "注册成功",
    "data": {
      "token": "用户认证令牌",
      "userInfo": {
        "id": "用户ID",
        "username": "用户名",
        "phone": "手机号",
        "location": "位置信息",
        "farmArea": 0,
        "createTime": 1672502400000,
        "updateTime": 1672502400000
      }
    }
  }
  ```
- **错误响应**:
  ```json
  {
    "success": false,
    "code": 400,
    "message": "用户名或手机号已存在",
    "data": null
  }
  ```

### 1.2 用户登录
- **接口**: `/auth/login`
- **方法**: `POST`
- **请求参数**:
  ```json
  {
    "username": "用户名或手机号",
    "password": "密码"
  }
  ```
- **成功响应**:
  ```json
  {
    "success": true,
    "code": 200,
    "message": "登录成功",
    "data": {
      "token": "用户认证令牌",
      "userInfo": {
        "id": "用户ID",
        "username": "用户名",
        "phone": "手机号",
        "location": "位置信息",
        "farmArea": 100,
        "createTime": 1672502400000,
        "updateTime": 1672502400000
      }
    }
  }
  ```
- **错误响应**:
  ```json
  {
    "success": false,
    "code": 401,
    "message": "用户名或密码错误",
    "data": null
  }
  ```

### 1.3 发送短信验证码
- **接口**: `/auth/send-verification-code`
- **方法**: `POST`
- **请求参数**:
  ```json
  {
    "phone": "手机号"
  }
  ```
- **成功响应**:
  ```json
  {
    "success": true,
    "code": 200,
    "message": "验证码发送成功",
    "data": null
  }
  ```
- **错误响应**:
  ```json
  {
    "success": false,
    "code": 400,
    "message": "手机号格式错误或发送过于频繁",
    "data": null
  }
  ```

### 1.4 重置密码
- **接口**: `/auth/reset-password`
- **方法**: `POST`
- **请求参数**:
  ```json
  {
    "phone": "手机号",
    "code": "短信验证码",
    "password": "新密码"
  }
  ```
- **成功响应**:
  ```json
  {
    "success": true,
    "code": 200,
    "message": "密码重置成功",
    "data": null
  }
  ```
- **错误响应**:
  ```json
  {
    "success": false,
    "code": 400,
    "message": "验证码无效或已过期",
    "data": null
  }
  ```

### 1.5 修改密码
- **接口**: `/auth/change-password`
- **方法**: `POST`
- **请求头**: 需要授权（Authorization）
- **请求参数**:
  ```json
  {
    "oldPassword": "旧密码",
    "newPassword": "新密码"
  }
  ```
- **成功响应**:
  ```json
  {
    "success": true,
    "code": 200,
    "message": "密码修改成功",
    "data": null
  }
  ```
- **错误响应**:
  ```json
  {
    "success": false,
    "code": 401,
    "message": "用户未登录",
    "data": null
  }
  ```

### 1.6 登出
- **接口**: `/auth/logout`
- **方法**: `POST`
- **请求头**: 需要授权（Authorization）
- **请求参数**: 无
- **成功响应**:
  ```json
  {
    "success": true,
    "code": 200,
    "message": "登出成功",
    "data": null
  }
  ```

## 2. 用户信息相关API

### 2.1 获取个人信息
- **接口**: `/user/profile`
- **方法**: `GET`
- **请求头**: 需要授权（Authorization）
- **请求参数**: 无
- **成功响应**:
  ```json
  {
    "success": true,
    "code": 200,
    "message": "获取成功",
    "data": {
      "id": "用户ID",
      "username": "用户名",
      "phone": "手机号",
      "location": "位置信息",
      "farmArea": "100",
      "joinDate": "2023-01-01"
    }
  }
  ```
- **错误响应**:
  ```json
  {
    "success": false,
    "code": 401,
    "message": "未登录",
    "data": null
  }
  ```

### 2.2 更新用户信息
- **接口**: `/user/update-info`
- **方法**: `PUT`
- **请求头**: 需要授权（Authorization）
- **请求参数**:
  ```json
  {
    "username": "用户名（可选）",
    "location": "位置信息（可选）",
    "farmArea": "农场面积（可选）"
  }
  ```
- **成功响应**:
  ```json
  {
    "success": true,
    "code": 200,
    "message": "用户信息更新成功",
    "data": {
      "id": "用户ID",
      "username": "更新后的用户名",
      "phone": "手机号",
      "location": "更新后的位置信息",
      "farmArea": "更新后的农场面积",
      "joinDate": "2023-01-01"
    }
  }
  ```
- **错误响应**:
  ```json
  {
    "success": false,
    "code": 401,
    "message": "未登录",
    "data": null
  }
  ```

### 2.3 使用验证码更新手机号
- **接口**: `/user/update-phone`
- **方法**: `PUT`
- **请求头**: 需要授权（Authorization）
- **请求参数**:
  ```json
  {
    "phone": "新手机号",
    "code": "短信验证码"
  }
  ```
- **成功响应**:
  ```json
  {
    "success": true,
    "code": 200,
    "message": "手机号更新成功",
    "data": null
  }
  ```
- **错误响应**:
  ```json
  {
    "success": false,
    "code": 400,
    "message": "验证码无效或已过期",
    "data": null
  }
  ```

## 3. 农场管理相关API

### 3.1 更新农场面积
- **接口**: `/farm/update-area`
- **方法**: `PUT`
- **请求头**: 需要授权（Authorization）
- **请求参数**:
  ```json
  {
    "farmArea": "100"
  }
  ```
- **成功响应**:
  ```json
  {
    "success": true,
    "code": 200,
    "message": "农场面积更新成功",
    "data": {
      "farmArea": "100"
    }
  }
  ```
- **错误响应**:
  ```json
  {
    "success": false,
    "code": 401,
    "message": "未登录",
    "data": null
  }
  ```

### 3.2 获取农场信息
- **接口**: `/farm/info`
- **方法**: `GET`
- **请求头**: 需要授权（Authorization）
- **请求参数**: 无
- **成功响应**:
  ```json
  {
    "success": true,
    "code": 200,
    "message": "获取成功",
    "data": {
      "farmArea": 100,
      "plotTotalArea": 85,
      "plotCount": 2
    }
  }
  ```
- **错误响应**:
  ```json
  {
    "success": false,
    "code": 401,
    "message": "未登录",
    "data": null
  }
  ```

### 3.3 同步面积
- **接口**: `/farm/sync-area`
- **方法**: `POST`
- **请求头**: 需要授权（Authorization）
- **请求参数**: 无
- **成功响应**:
  ```json
  {
    "success": true,
    "code": 200,
    "message": "同步成功",
    "data": null
  }
  ```
- **错误响应**:
  ```json
  {
    "success": false,
    "code": 401,
    "message": "未登录",
    "data": null
  }
  ```

## 4. 消息通知相关API

### 4.1 获取消息通知列表
- **接口**: `/notifications`
- **方法**: `GET`
- **请求头**: 需要授权（Authorization）
- **请求参数**: 无
- **成功响应**:
  ```json
  {
    "success": true,
    "code": 200,
    "message": "获取成功",
    "data": [
      {
        "id": "消息ID",
        "title": "欢迎使用农田助理",
        "content": "欢迎使用农田助理！在这里您将收到重要的系统通知和农田预警信息。",
        "time": "2023-01-01 12:00",
        "type": "system",
        "read": false
      }
    ]
  }
  ```
- **错误响应**:
  ```json
  {
    "success": false,
    "code": 401,
    "message": "未登录",
    "data": null
  }
  ```

### 4.2 标记消息为已读
- **接口**: `/notifications/mark-read`
- **方法**: `PUT`
- **请求头**: 需要授权（Authorization）
- **请求参数**:
  ```json
  {
    "notificationId": "消息ID"
  }
  ```
- **成功响应**:
  ```json
  {
    "success": true,
    "code": 200,
    "message": "标记成功",
    "data": null
  }
  ```
- **错误响应**:
  ```json
  {
    "success": false,
    "code": 404,
    "message": "消息不存在",
    "data": null
  }
  ```

### 4.3 清空所有消息
- **接口**: `/notifications/clear-all`
- **方法**: `DELETE`
- **请求头**: 需要授权（Authorization）
- **请求参数**: 无
- **成功响应**:
  ```json
  {
    "success": true,
    "code": 200,
    "message": "清空成功",
    "data": null
  }
  ```
- **错误响应**:
  ```json
  {
    "success": false,
    "code": 401,
    "message": "未登录",
    "data": null
  }
  ```

## 5. 摄像机监控相关API

### 5.1 获取摄像头状态和流
- **接口**: `/camera/stream`
- **方法**: `GET`
- **请求头**: 需要授权（Authorization）
- **请求参数**: 无
- **成功响应**:
  ```json
  {
    "success": true,
    "code": 200,
    "message": "获取成功",
    "data": {
      "connected": true,
      "streamUrl": "rtsp://camera.example.com/stream/1",
      "message": "摄像头已连接",
      "deviceInfo": {
        "id": "CAM001",
        "name": "农田监控摄像头",
        "status": "online",
        "lastOnline": "2023-01-01 12:00:00"
      }
    }
  }
  ```
- **未连接响应**:
  ```json
  {
    "success": true,
    "code": 200,
    "message": "获取成功",
    "data": {
      "connected": false,
      "streamUrl": "",
      "message": "摄像头未连接",
      "deviceInfo": {
        "id": "CAM001",
        "name": "农田监控摄像头",
        "status": "offline",
        "lastOnline": "2023-01-01 12:00:00"
      }
    }
  }
  ```
- **错误响应**:
  ```json
  {
    "success": false,
    "code": 401,
    "message": "未登录",
    "data": null
  }
  ```

### 5.2 连接摄像头
- **接口**: `/camera/connect`
- **方法**: `POST`
- **请求头**: 需要授权（Authorization）
- **请求参数**:
  ```json
  {
    "deviceId": "摄像头设备ID（可选）"
  }
  ```
- **成功响应**:
  ```json
  {
    "success": true,
    "code": 200,
    "message": "连接成功",
    "data": {
      "streamUrl": "rtsp://camera.example.com/stream/1"
    }
  }
  ```
- **错误响应**:
  ```json
  {
    "success": false,
    "code": 503,
    "message": "连接失败",
    "data": {
      "reason": "设备离线",
      "message": "摄像头设备当前不在线，请检查设备连接或联系客服"
    }
  }
  ```

### 5.3 获取AI检测历史记录
- **接口**: `/camera/ai-events`
- **方法**: `GET`
- **请求头**: 需要授权（Authorization）
- **请求参数**: 
  ```
  page: 页码（可选，默认1）
  pageSize: 每页数量（可选，默认10）
  ```
- **成功响应**:
  ```json
  {
    "success": true,
    "code": 200,
    "message": "获取成功",
    "data": [
      {
        "id": "事件ID",
        "desc": "检测到农田东侧有动态",
        "type": "movement",
        "time": "2023-01-01 12:00:00",
        "read": false
      },
      {
        "id": "事件ID",
        "desc": "检测到农田南侧有动物",
        "type": "animal",
        "time": "2023-01-01 11:00:00",
        "read": false
      }
    ]
  }
  ```
- **错误响应**:
  ```json
  {
    "success": false,
    "code": 401,
    "message": "未登录",
    "data": null
  }
  ```

## 6. 作物智诊相关API

### 6.1 分析作物图片
- **接口**: `/crop/analyze`
- **方法**: `POST`
- **请求头**: 需要授权（Authorization）
- **请求参数**: 
  - 请求类型为 `multipart/form-data`
  - 参数名：`image`，文件类型

- **成功响应**:
  ```json
  {
    "success": true,
    "code": 200,
    "message": "分析成功",
    "data": {
      "analysisTime": "2023-01-01 12:00",
      "cropType": "水稻",
      "growthStage": "抽穗期",
      "healthStatus": "健康",
      "analysisDetail": "经AI分析，当前水稻处于抽穗期，整体生长状况良好，叶色浓绿，长势均匀，未发现明显病虫害迹象。",
      "suggestions": [
        "继续保持现有管理方式",
        "注意控制水分，保持稻田浅水层",
        "预计20天后可以收获"
      ]
    }
  }
  ```
- **错误响应**:
  ```json
  {
    "success": false,
    "code": 400,
    "message": "未提供图片或图片格式不支持",
    "data": null
  }
  ```

### 6.2 获取作物分析历史
- **接口**: `/crop/analysis-history`
- **方法**: `GET`
- **请求头**: 需要授权（Authorization）
- **请求参数**: 
  ```
  page: 页码（可选，默认1）
  pageSize: 每页数量（可选，默认10）
  ```
- **成功响应**:
  ```json
  {
    "success": true,
    "code": 200,
    "message": "获取成功",
    "data": [
      {
        "id": "记录ID",
        "imagePath": "https://farm-assistant.com/images/analysis/123.jpg",
        "analysisTime": "2023-01-01 12:00",
        "savedAt": 1672502400000,
        "cropType": "水稻",
        "growthStage": "抽穗期",
        "healthStatus": "健康",
        "analysisDetail": "经AI分析，当前水稻处于抽穗期，整体生长状况良好，叶色浓绿，长势均匀，未发现明显病虫害迹象。",
        "suggestions": [
          "继续保持现有管理方式",
          "注意控制水分，保持稻田浅水层",
          "预计20天后可以收获"
        ]
      }
    ]
  }
  ```
- **错误响应**:
  ```json
  {
    "success": false,
    "code": 401,
    "message": "未登录",
    "data": null
  }
  ```

### 6.3 删除作物分析历史记录
- **接口**: `/crop/analysis-record`
- **方法**: `DELETE`
- **请求头**: 需要授权（Authorization）
- **请求参数**:
  ```json
  {
    "recordId": "记录ID"
  }
  ```
- **成功响应**:
  ```json
  {
    "success": true,
    "code": 200,
    "message": "删除成功",
    "data": null
  }
  ```
- **错误响应**:
  ```json
  {
    "success": false,
    "code": 404,
    "message": "记录不存在",
    "data": null
  }
  ```

### 6.4 清空所有作物分析历史
- **接口**: `/crop/clear-analysis-history`
- **方法**: `DELETE`
- **请求头**: 需要授权（Authorization）
- **请求参数**: 无
- **成功响应**:
  ```json
  {
    "success": true,
    "code": 200,
    "message": "清空成功",
    "data": null
  }
  ```
- **错误响应**:
  ```json
  {
    "success": false,
    "code": 401,
    "message": "未登录",
    "data": null
  }
  ```

## 7. 后端实现注意事项

1. 所有API端点必须实现CORS，确保与前端跨域通信
2. 接口应实现访问频率限制，防止DOS攻击
3. 应实现完整的错误处理和日志记录
4. 敏感操作需要验证用户身份
5. 文件上传有大小限制，图片上传最大不超过10MB
6. 实现token验证机制，建议使用JWT
7. 图片存储可考虑使用对象存储服务
8. 作物智诊功能需要集成AI模型或调用第三方AI API
9. 所有密码必须加密存储，推荐使用bcrypt
