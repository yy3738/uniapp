<template>
  <view class="login-container">
    <!-- 动态背景网格 -->
    <view class="bg-grid"></view>
    <view class="bg-gradient"></view>

    <!-- 装饰性几何元素 -->
    <view class="deco-circle deco-circle-1"></view>
    <view class="deco-circle deco-circle-2"></view>
    <view class="deco-line deco-line-1"></view>
    <view class="deco-line deco-line-2"></view>

    <!-- 主内容区 -->
    <view class="content-wrapper">
      <!-- 欢迎标题区 -->
      <view class="welcome-section">
        <view class="welcome-badge">SYSTEM ACCESS</view>
        <view class="welcome-title">
          <text class="title-main">神经网络</text>
          <text class="title-sub">接入协议</text>
        </view>
        <view class="welcome-desc">Neural Network Access Protocol</view>
        <view class="status-bar">
          <view class="status-dot"></view>
          <text class="status-text">系统在线 · 等待验证</text>
        </view>
      </view>

      <!-- 登录表单 -->
      <view class="login-form">
        <view class="form-item">
          <view class="input-wrapper">
            <view class="input-icon">👤</view>
            <input
              v-model="username"
              class="input"
              placeholder="输入用户标识符"
              placeholder-class="placeholder"
            />
            <view class="input-border"></view>
          </view>
        </view>

        <view class="form-item">
          <view class="input-wrapper">
            <view class="input-icon">🔐</view>
            <input
              v-model="password"
              class="input"
              type="password"
              placeholder="输入访问密钥"
              placeholder-class="placeholder"
            />
            <view class="input-border"></view>
          </view>
        </view>

        <button class="login-btn" @click="handleLogin" :disabled="loading">
          <view class="btn-bg"></view>
          <view class="btn-content">
            <text class="btn-text">{{ loading ? '验证中' : '启动连接' }}</text>
            <text class="btn-arrow">→</text>
          </view>
        </button>

        <view class="footer-text">
          <text class="footer-line"></text>
          <text class="footer-content">安全加密传输</text>
          <text class="footer-line"></text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { http } from '@/utils/http'
import { useUserStore } from '@/store'

const username = ref('')
const password = ref('')
const loading = ref(false)

const userStore = useUserStore()

interface LoginResponse {
  username: string
  token: string
}

const handleLogin = async () => {
  if (!username.value) {
    uni.showToast({
      title: '请输入账户名',
      icon: 'none'
    })
    return
  }

  if (!password.value) {
    uni.showToast({
      title: '请输入密码',
      icon: 'none'
    })
    return
  }

  loading.value = true

  try {
    const res = await http<LoginResponse>({
      method: 'POST',
      url: '/login',
      data: {
        username: username.value,
        password: password.value
      }
    })

    // 存储用户信息到 store（会自动持久化到 localStorage）
    userStore.setUserInfo(res.data.username, res.data.token)

    uni.showToast({
      title: '登录成功',
      icon: 'success'
    })

    // 延迟跳转，让用户看到成功提示
    setTimeout(() => {
      uni.navigateTo({
        url: '/pages/index/index'
      })
    }, 1500)

  } catch (error) {
    console.error('登录失败:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 主容器 - 科技极限风格 */
.login-container {
  position: relative;
  min-height: 100vh;
  background: #0a0e27;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60rpx 40rpx;
}

/* 动态网格背景 */
.bg-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 50rpx 50rpx;
  animation: grid-move 20s linear infinite;
}

@keyframes grid-move {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50rpx, 50rpx); }
}

/* 渐变光效背景 */
.bg-gradient {
  position: absolute;
  top: -50%;
  left: -50%;
  right: -50%;
  bottom: -50%;
  background: radial-gradient(circle at 30% 50%, rgba(0, 255, 255, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 70% 50%, rgba(138, 43, 226, 0.08) 0%, transparent 50%);
  animation: gradient-rotate 15s ease-in-out infinite;
}

@keyframes gradient-rotate {
  0%, 100% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.1); }
}

/* 装饰性几何元素 */
.deco-circle {
  position: absolute;
  border: 2rpx solid rgba(0, 255, 255, 0.2);
  border-radius: 50%;
  animation: float 8s ease-in-out infinite;
}

.deco-circle-1 {
  width: 300rpx;
  height: 300rpx;
  top: 10%;
  right: -100rpx;
  animation-delay: 0s;
}

.deco-circle-2 {
  width: 200rpx;
  height: 200rpx;
  bottom: 15%;
  left: -50rpx;
  animation-delay: 2s;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-30rpx) rotate(180deg); }
}

.deco-line {
  position: absolute;
  height: 2rpx;
  background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.5), transparent);
  animation: line-scan 4s ease-in-out infinite;
}

.deco-line-1 {
  width: 300rpx;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.deco-line-2 {
  width: 250rpx;
  bottom: 25%;
  right: 15%;
  animation-delay: 2s;
}

@keyframes line-scan {
  0%, 100% { opacity: 0; transform: translateX(-50rpx); }
  50% { opacity: 1; transform: translateX(50rpx); }
}

/* 内容包装器 */
.content-wrapper {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 640rpx;
}

/* 欢迎区域 */
.welcome-section {
  margin-bottom: 80rpx;
  text-align: center;
}

.welcome-badge {
  display: inline-block;
  padding: 8rpx 24rpx;
  background: rgba(0, 255, 255, 0.1);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 40rpx;
  font-size: 20rpx;
  color: #00ffff;
  letter-spacing: 4rpx;
  margin-bottom: 40rpx;
  animation: badge-pulse 2s ease-in-out infinite;
}

@keyframes badge-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0, 255, 255, 0.4); }
  50% { box-shadow: 0 0 0 8rpx rgba(0, 255, 255, 0); }
}

.welcome-title {
  margin-bottom: 20rpx;
  animation: title-appear 1s ease-out;
}

@keyframes title-appear {
  from { opacity: 0; transform: translateY(-20rpx); }
  to { opacity: 1; transform: translateY(0); }
}

.title-main {
  display: block;
  font-size: 72rpx;
  font-weight: 900;
  background: linear-gradient(135deg, #00ffff 0%, #8a2be2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 8rpx;
  line-height: 1.2;
}

.title-sub {
  display: block;
  font-size: 48rpx;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 12rpx;
  margin-top: 8rpx;
}

.welcome-desc {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 2rpx;
  margin-bottom: 30rpx;
  font-family: 'Courier New', monospace;
}

.status-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
}

.status-dot {
  width: 12rpx;
  height: 12rpx;
  background: #00ff00;
  border-radius: 50%;
  box-shadow: 0 0 12rpx #00ff00;
  animation: dot-blink 1.5s ease-in-out infinite;
}

@keyframes dot-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.status-text {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.5);
  font-family: 'Courier New', monospace;
}

/* 登录表单 */
.login-form {
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(20rpx);
  border: 1px solid rgba(0, 255, 255, 0.1);
  border-radius: 24rpx;
  padding: 60rpx 40rpx;
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.5),
              inset 0 1rpx 0 rgba(255, 255, 255, 0.05);
  animation: form-appear 1s ease-out 0.3s both;
}

@keyframes form-appear {
  from { opacity: 0; transform: translateY(30rpx); }
  to { opacity: 1; transform: translateY(0); }
}

.form-item {
  margin-bottom: 40rpx;
}

.form-item:last-of-type {
  margin-bottom: 0;
}

/* 输入框包装器 */
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 16rpx;
  padding: 0 32rpx;
  height: 96rpx;
  transition: all 0.3s ease;
}

.input-wrapper:focus-within {
  border-color: rgba(0, 255, 255, 0.6);
  background: rgba(0, 0, 0, 0.5);
  box-shadow: 0 0 20rpx rgba(0, 255, 255, 0.2);
}

.input-icon {
  font-size: 36rpx;
  margin-right: 20rpx;
  filter: grayscale(1) brightness(1.5);
}

.input {
  flex: 1;
  height: 100%;
  background: transparent;
  border: none;
  font-size: 28rpx;
  color: #ffffff;
  font-family: 'Courier New', monospace;
}

.placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.input-border {
  position: absolute;
  bottom: 0;
  left: 32rpx;
  right: 32rpx;
  height: 2rpx;
  background: linear-gradient(90deg, transparent, #00ffff, transparent);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.input-wrapper:focus-within .input-border {
  transform: scaleX(1);
}

/* 登录按钮 */
.login-btn {
  position: relative;
  width: 100%;
  height: 96rpx;
  background: transparent;
  border: 2px solid #00ffff;
  border-radius: 16rpx;
  margin-top: 60rpx;
  overflow: hidden;
  transition: all 0.3s ease;
}

.login-btn::after {
  content: none;
}

.btn-bg {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.login-btn:active .btn-bg {
  left: 100%;
}

.btn-content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  height: 100%;
}

.btn-text {
  font-size: 32rpx;
  font-weight: bold;
  color: #00ffff;
  letter-spacing: 4rpx;
  text-shadow: 0 0 10rpx rgba(0, 255, 255, 0.5);
}

.btn-arrow {
  font-size: 36rpx;
  color: #00ffff;
  transition: transform 0.3s ease;
}

.login-btn:active .btn-arrow {
  transform: translateX(8rpx);
}

.login-btn[disabled] {
  opacity: 0.5;
  border-color: rgba(255, 255, 255, 0.2);
}

.login-btn[disabled] .btn-text,
.login-btn[disabled] .btn-arrow {
  color: rgba(255, 255, 255, 0.4);
  text-shadow: none;
}

/* 底部文字 */
.footer-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20rpx;
  margin-top: 50rpx;
}

.footer-line {
  flex: 1;
  height: 1rpx;
  background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.3), transparent);
}

.footer-content {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 2rpx;
  font-family: 'Courier New', monospace;
}
</style>
