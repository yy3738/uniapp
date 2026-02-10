import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    const username = ref('')
    const token = ref('')

    const setUserInfo = (user: string, userToken: string) => {
      username.value = user
      token.value = userToken
    }

    const clearUserInfo = () => {
      username.value = ''
      token.value = ''
    }

    return {
      username,
      token,
      setUserInfo,
      clearUserInfo,
    }
  },
  {
    persist: {
      storage: {
        getItem(key) {
          return uni.getStorageSync(key)
        },
        setItem(key, value) {
          uni.setStorageSync(key, value)
        },
      },
    },
  }
)
