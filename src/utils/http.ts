const baseURL = "http://localhost:7788/api";

const httpInterceptor = {
  invoke(options: UniApp.RequestOptions) {
    if (!options.url.startsWith("http")) {
      options.url = baseURL + options.url;
    }
    options.timeout = 10000;
    options.header = {
      ...options.header,
      "source-client": "miniprogram",
    };
    // 从 localStorage 中获取 token
    const token = uni.getStorageSync("token");
    if (token) {
      options.header.Authorization = `Bearer ${token}`;
    }
    console.log(options);
  },
};

uni.addInterceptor("request", httpInterceptor);
uni.addInterceptor("uploadFile", httpInterceptor);

interface Response<T = unknown> {
  code: string;
  msg: string;
  data: T;
}

export const http = <T>(options: UniApp.RequestOptions) => {
  return new Promise<Response<T>>((resolve, reject) => {
    uni.request({
      ...options,
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data as Response<T>);
        } else if (res.statusCode === 401) {
          // 清除本地存储的 token
          uni.removeStorageSync("token");
          uni.removeStorageSync("username");
          // 跳转到登录页
          uni.reLaunch({
            url: "/pages/login/login",
          });
          reject(res);
        } else {
          uni.showToast({
            icon: "none",
            title: (res.data as Response<T>).msg || "请求错误",
          });
          reject(res);
        }
      },
      fail(err) {
        uni.showToast({
          icon: "none",
          title: "网络错误",
        });
        reject(err);
      },
    });
  });
};
