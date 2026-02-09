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
