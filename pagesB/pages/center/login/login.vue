<template>
	<!-- pages/index/index.wxml -->
	<view>
	  <!-- 小程序授权登录 -->
	  <!-- #ifdef MP -->
	  <view v-if="!isAuthrization" class="input-inbox">
		<button class="button" @tap="getUserProfile">微信授权登录</button>
	  </view>
	  <view v-else>
		<view class="login-success">
		  <text>登录成功，正在跳转...</text>
		</view>
	  </view>
	  <!-- #endif -->

	  <!-- H5不做授权登录 -->
	  <!-- #ifdef H5 -->
	  <view class="input-inbox">
		<input class="input" placeholder="请输入手机号码" v-model="name"/>
	  </view>
	  <view class="password-row-box">
		<input class="input" :password="!isVisible" v-model="password" placeholder="请输入登录密码" />
		<image class="eye-icon" :src="isVisible ? '/static/login/eye.png' : '/static/login/eye-off.png'" @click="changeVisible()"></image>
	  </view>
	  <button class="button" @click="toPageCenter()">登录</button>
	  <view class="enroll-changepassword-box">
		<text class="left" @click="toRegister()">立即注册</text>
		<text class="right" @click="toForgotPassword()">忘记密码</text>
	  </view>
	  <!-- #endif -->
	</view>

</template>

<script>
	import { userLogin, weChatLogin } from '@/common/api/quickRegister.js';
	import { inputCheck } from '@/common/js/inputCheck.js';
	import { setToken } from '@/common/utils/auth.js';
	import md5 from 'js-md5';
	import { error } from '@/common/js/errorTips.js';

	export default {
	  data() {
		return {
		  userInfo: {},
		  name: uni.getStorageSync('phone') || '',
		  password: '',
		  isVisible: false,
		  isAuthrization: uni.getStorageSync("isAuthrization") || false,
		};
	  },
	  methods: {
		// 切换是否可见密码
		changeVisible() {
		  this.isVisible = !this.isVisible;
		},
		// 跳转到注册页面
		toRegister() {
		  uni.navigateTo({
			url: '/pagesB/pages/center/login/quickRegister/quickRegister'
		  });
		},
		// 跳转到忘记密码页面
		toForgotPassword() {
		  uni.navigateTo({
			url: '/pagesB/pages/center/login/fotgotPassword/fotgotPassword'
		  });
		},
		// 授权获取用户信息
		getUserProfile() {
		  wx.getUserProfile({
			desc: '用于完善用户资料', // 声明获取用户个人信息后的用途
			success: (res) => {
			  this.userInfo = res.userInfo;
			  this.weChatLogin();
			},
			fail: () => {
			  uni.showToast({
				title: '获取用户信息失败',
				icon: 'none'
			  });
			}
		  });
		},
		// 微信登录逻辑
		weChatLogin() {
		  wx.login({
			success: (loginRes) => {
			  const code = loginRes.code;
			  // 这里调用后台接口，使用 code 获取 openid
			  weChatLogin({ code }).then((res) => {
				if (res.data.code === 200) {
				  // 登录成功，存储token，跳转到用户中心
				  setToken(res.data.data);
				  uni.setStorageSync("isAuthrization", true);
				  this.isAuthrization = true;
				  uni.showToast({
					title: '登录成功',
					icon: 'success',
					duration: 2000
				  });
				  // 跳转到中心页
				  uni.switchTab({
					url: '/pages/center/center'
				  });
				} else {
				  uni.showToast({
					title: '登录失败',
					icon: 'none'
				  });
				}
			  });
			},
			fail: () => {
			  uni.showToast({
				title: '微信登录失败',
				icon: 'none'
			  });
			}
		  });
		},
		// 跳转到用户中心页面
		toPageCenter() {
		  uni.showLoading({
			title: '加载中'
		  });
		  userLogin(this.name, md5(this.password)).then(res => {
			if (res.data.code === 200) {
			  setToken(res.data.data);
			  uni.setStorageSync('isAlreadyLogin', true);
			  uni.showToast({
				title: '登录成功',
				icon: 'success'
			  });
			  uni.switchTab({
				url: '/pages/center/center'
			  });
			} else {
			  uni.hideLoading();
			  error('账号或密码错误');
			}
		  }).catch(() => {
			uni.hideLoading();
			error('网络错误');
		  });
		}
	  }
	};

</script>

<style lang="scss">
	@import '@/common/scss/form.scss';
	@import '@/common/scss/common.scss';

	.input-inbox {
		margin: 20px;
	}

	.password-row-box {
		display: flex;
		align-items: center;
		margin: 10px;
	}

	.eye-icon {
		width: 30px;
		height: 30px;
		cursor: pointer;
		margin-left: 10px;
	}

	.button {
		width: 100%;
		margin: 20px 0;
		background-color: #007aff;
		color: white;
		text-align: center;
		line-height: 50px;
		border-radius: 5px;
	}

	.login-success {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100px;
		color: #007aff;
		font-size: 18px;
	}
</style>
