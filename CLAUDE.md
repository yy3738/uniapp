# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 uni-app 的微信小程序脚手架项目，使用 Vue 3 + TypeScript + Vite 构建，在 VSCode 中开发。

技术栈：
- **框架**: uni-app 3.x (Vue 3 + TypeScript)
- **构建工具**: Vite 4.x
- **状态管理**: Pinia 2.x + pinia-plugin-persistedstate
- **样式方案**: UnoCSS (使用 unocss-preset-weapp 适配小程序)
- **UI 组件**: @dcloudio/uni-ui
- **包管理器**: pnpm (强制使用，通过 preinstall 钩子限制)

## 开发命令

### 启动开发服务器
```bash
# 微信小程序（主要开发平台）
pnpm dev:mp-weixin

# 其他平台
pnpm dev:h5              # H5
pnpm dev:mp-alipay       # 支付宝小程序
pnpm dev:mp-qq           # QQ 小程序
pnpm dev:app             # App
```

### 构建生产版本
```bash
pnpm build:mp-weixin     # 构建微信小程序
pnpm build:h5            # 构建 H5
```

### 类型检查
```bash
pnpm type-check          # 运行 TypeScript 类型检查（不生成文件）
```

### 更新 uni-app 版本
```bash
npx @dcloudio/uvm        # 更新到最新正式版
```

## 项目结构

```
src/
├── pages/              # 页面目录
│   └── index/         # 首页
│   └── login/         # 登录页
├── store/             # Pinia 状态管理
│   ├── index.ts       # Store 入口（配置持久化插件）
│   └── modules/       # Store 模块
├── utils/             # 工具函数
│   └── http.ts        # HTTP 请求封装
├── App.vue            # 应用根组件
├── main.ts            # 应用入口
├── pages.json         # 页面路由配置
└── manifest.json      # 应用配置
```

## 核心架构说明

### 1. HTTP 请求封装 ([src/utils/http.ts](src/utils/http.ts))

项目封装了统一的 HTTP 请求工具，位于 `src/utils/http.ts`：

- **拦截器配置**: 使用 `uni.addInterceptor` 为 `request` 和 `uploadFile` 添加拦截器
- **baseURL**: 默认为 `http://localhost:7788/api/`，需要根据实际后端地址修改
- **请求头**: 自动添加 `source-client: miniprogram` 标识
- **Token 处理**: 预留了 token 获取和添加 Authorization 头的位置（需要实现）
- **错误处理**:
  - 401 状态码需要跳转到登录页（TODO）
  - 其他错误自动显示 toast 提示
  - 网络错误统一提示

使用示例：
```typescript
import { http } from '@/utils/http'

const getData = async () => {
  const res = await http<YourDataType>({
    method: 'GET',
    url: '/test/hello'
  })
}
```

### 2. Pinia 状态管理 ([src/store/index.ts](src/store/index.ts))

- 已配置 `pinia-plugin-persistedstate` 持久化插件
- Store 模块位于 `src/store/modules/` 目录
- 需要持久化的 store 必须配置自定义 storage：

```typescript
{
  persist: {
    storage: {
      getItem(key) {
        return uni.getStorageSync(key);
      },
      setItem(key, value) {
        uni.setStorageSync(key, value);
      },
    },
  },
}
```

### 3. UnoCSS 配置 ([unocss.config.ts](unocss.config.ts))

- 使用 `unocss-preset-weapp` 适配小程序环境
- 支持 attributify 模式
- 预定义 shortcuts：
  - `border-base`: 基础边框样式
  - `center`: flex 居中布局
- 在 [src/main.ts](src/main.ts) 中引入 `uno.css`

### 4. uni-ui 组件库

- 通过 [src/pages.json](src/pages.json) 的 `easycom` 配置自动导入
- 使用方式：直接在模板中使用 `<uni-*>` 组件，无需手动导入
- 类型支持：已配置 `@uni-helper/uni-ui-types`

### 5. TypeScript 配置 ([tsconfig.json](tsconfig.json))

- **路径别名**: `@/*` 映射到 `src/*`
- **类型声明**:
  - `@dcloudio/types` - uni-app 核心类型
  - `@types/wechat-miniprogram` - 微信小程序 API 类型
  - `@uni-helper/uni-app-types` - uni-app 增强类型
  - `@uni-helper/uni-ui-types` - uni-ui 组件类型
- **Vue 编译选项**: 配置了 `nativeTags` 识别小程序原生标签（block, component, template, slot）

## 开发注意事项

### 环境要求
- Node.js 16+
- pnpm 8.x（项目强制使用 pnpm，npm/yarn 会被拒绝）

### VSCode 插件
推荐安装以下插件（配置在 `.vscode/extensions.json`）：
- uni-helper - uni-app 代码提示和补全
- uniapp 小程序扩展 - 小程序开发增强

### 文件关联配置
VSCode 需要配置 `manifest.json` 和 `pages.json` 为 `jsonc` 类型以支持注释：
```json
{
  "files.associations": {
    "manifest.json": "jsonc",
    "pages.json": "jsonc"
  }
}
```

### Git 提交规范
- `feat` - 新功能
- `fix` - 修复 bug
- `perf` - 性能优化
- `style` - 代码风格调整
- `refactor` - 重构
- `docs` - 文档更新
- `chore` - 构建配置或依赖更新
- `types` - 类型定义更新

## 常见开发场景

### 添加新页面
1. 在 `src/pages/` 下创建页面目录和 `.vue` 文件
2. 在 `src/pages.json` 的 `pages` 数组中注册页面路径和配置

### 添加新的 Store 模块
1. 在 `src/store/modules/` 下创建新的 store 文件
2. 在 `src/store/index.ts` 中导出该模块
3. 如需持久化，配置 `persist` 选项使用 `uni.getStorageSync/setStorageSync`

### 修改 API 基础地址
修改 `src/utils/http.ts` 中的 `baseURL` 常量

### 添加请求 Token
在 `src/utils/http.ts` 的 `httpInterceptor.invoke` 方法中实现 token 获取逻辑（标记为 TODO）

### 处理 401 未授权
在 `src/utils/http.ts` 的 401 状态码处理中实现跳转登录页逻辑（标记为 TODO）

---

## 变更记录 - 2026-02-09

### 📋 需求描述
优化登录页面为科技极限风格，并配置 Git commit hook 实现文档自动更新机制。

### 🎯 核心变更

#### 1. 登录页面视觉重构 ([src/pages/login/login.vue](src/pages/login/login.vue))
- **设计风格**: 采用科技极限风格，深空背景 (#0a0e27) + 青色/紫色渐变
- **动态背景**:
  - 青色半透明网格持续移动动画 (20s 循环)
  - 双色径向渐变光效缓慢旋转 (15s 循环)
- **装饰元素**:
  - 浮动圆环 (8s 浮动 + 旋转动画)
  - 扫描线条 (4s 淡入淡出动画)
- **欢迎语设计**:
  - 徽章: "SYSTEM ACCESS" 带脉冲扩散动画
  - 主标题: "神经网络接入协议" (72rpx 渐变色大标题)
  - 副标题: "Neural Network Access Protocol" (等宽字体)
  - 状态指示: 绿色闪烁圆点 + "系统在线 · 等待验证"
- **交互优化**:
  - 输入框聚焦时边框发光 + 底部扫描线动画
  - 登录按钮点击时光波扫过效果 + 箭头右移
  - 使用 Emoji 图标 (👤/🔐) 增强视觉识别
  - 等宽字体 (Courier New) 营造科技感

#### 2. Git Hook 自动化配置
- **Pre-commit Hook** ([.git/hooks/pre-commit](.git/hooks/pre-commit))
  - 在 commit 前自动检测代码变更
  - 如果 CLAUDE.md 未更新，提示用户先更新文档
  - 提供友好的操作指引和确认机制
  - 避免遗漏文档更新

- **Post-conversation Hook** ([.claude/hooks/post-conversation.sh](.claude/hooks/post-conversation.sh))
  - 对话结束后检测文件变更
  - 创建提醒文件记录变更信息
  - 在终端显示友好提示，引导用户在下次对话时更新文档

- **Claude 配置** ([.claude/config.json](.claude/config.json))
  - 注册 post-conversation hook
  - 统一管理 Claude Code 相关配置

### 📁 涉及文件
- `src/pages/login/login.vue` - 登录页面完全重构，采用科技极限风格
- `.git/hooks/pre-commit` - Git 提交前检查文档更新
- `.claude/hooks/post-conversation.sh` - 对话结束后提醒更新文档
- `.claude/config.json` - Claude Code 配置文件

### 💡 技术要点

#### 登录页面动画实现
- **多层动画叠加**: 网格移动 + 光效旋转 + 几何浮动 + 扫描线，营造丰富的视觉层次
- **错开入场动画**: 欢迎区域和表单区域使用不同的 animation-delay，避免同时出现
- **CSS 变量**: 使用 rgba 颜色和统一的青色主题色 (#00ffff)，便于后续调整
- **性能优化**: 使用 transform 和 opacity 实现动画，避免触发重排

#### Hook 工作流程
```
代码变更 → git add → git commit
    ↓
pre-commit hook 检查
    ↓
未更新 CLAUDE.md? → 提示用户 → 取消提交
    ↓
已更新 CLAUDE.md? → 允许提交
```

#### 文档更新流程
```
对话结束 → post-conversation hook
    ↓
检测文件变更 → 创建提醒文件
    ↓
下次对话开始 → 用户说"请更新 CLAUDE.md"
    ↓
Claude 分析变更 → 生成结构化文档 → 追加到 CLAUDE.md
```

### 🔗 相关配置

#### Git Hook 使用说明
1. **提交代码时**: 如果忘记更新文档，hook 会自动提醒
2. **对话结束后**: 终端会显示变更文件列表和操作提示
3. **下次对话时**: 直接说"请根据刚才的变更更新 CLAUDE.md"

#### 登录页面适配
- 使用 rpx 单位完美适配所有微信小程序设备
- 最小高度 100vh 确保全屏显示
- 响应式内容区域 (max-width: 640rpx)
- 适当的内边距 (60rpx/40rpx) 避免边缘裁切

### 🎨 设计亮点
- **色彩方案**: 深蓝黑 + 青色 (#00ffff) + 紫色 (#8a2be2)，科技感十足
- **视觉层次**: 背景 → 装饰 → 内容，清晰的 z-index 层级
- **动画节奏**: 慢速背景 (15-20s) + 中速装饰 (4-8s) + 快速交互 (0.3-0.5s)
- **文字排版**: 大标题渐变色 + 等宽字体 + 大字间距，强化未来感
