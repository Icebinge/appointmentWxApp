<!-- 凡是需要先获取验证码再进行操作的都要这个页面 -->
<template>
	<viem>
		<!-- <view class="top-title">发送验证码至{{phone | getPhone}}</view> -->
		<view class="cu-form-group code-box">
			<view class="title">手机号码</view>
			<input placeholder="请输入手机号码" name="input" v-model="phoneNum"></input>
			<!-- <button class='cu-btn bg-green shadow' v-show="!isGetCode" @click="getPhoneCode()" v-if="codeNum === 0">获取验证码</button> -->
			<!-- <button class='cu-btn bg-gray shadow' v-else>再次获取{{codeNum}}s</button> -->
		</view>
		<button class="button-box" @click="checkPhone()">验证号码</button>
	</viem>
</template>

<script>
	import { getPasswordCode } from '@/common/api/password.js'
	import { checkPhone } from '@/common/api/password.js'
	// import {validataCode} from '@/common/api/quickRegister.js'
	
	export default {
		data() {
			return {
				codeNum: 0,
				phone: JSON.parse(uni.getStorageSync('userInfo')).phone,
				phoneNum: '', // 验证码
			}
		},
		methods: {
			// 获取手机验证码
			getPhoneCode: function() {
				this.codeNum = 60;
				let _this = this
				let time = setInterval(function() {
					if (_this.codeNum == 0) {
						clearInterval(time);
						return;
					}
					_this.codeNum--;
				}, 1000)

				getPasswordCode(this.phone).then(res => {
					// console.log("res.data: ", res.data);
					if(res.data.code === 200) {
					}
				}).catch(() => {
					uni.showToast({
						title: '发送失败，请检查网络',
						icon: 'none'
					})
				})
			},
			
			checkPhone: function() {
				checkPhone(this.phoneNum).then(res => {
					console.log("res.data: ", res.data);
					if(res.data.code === 200) {
						// uni.setStorageSync('phoneCode', this.phoneNum);
						uni.setStorageSync('phone', this.phoneNum);
						// this.$parent.getStep(1)
						this.$emit('getStep', 1); // 发出事件，通知父组件
					} else {
						uni.showToast({
							title: '手机号有误或未注册',
							icon: 'none'
						})
					}
				})
			}
			// 验证验证码
			// validataCode: function() {
			// 	validataCode(this.phone, this.phoneNum).then(res => {
			// 		if(res.data.data === true) {
			// 			uni.setStorageSync('phoneCode', this.phoneNum);
			// 			uni.setStorageSync('phone', this.phone);
			// 			this.$parent.getStep(1)
			// 		} else {
			// 			uni.showToast({
			// 				title: '验证码错误',
			// 				icon: 'none'
			// 			})
			// 		}
			// 	})
			// }
		}
	}
</script>

<style lang="scss">
	@import '@/common/scss/form.scss';
	@import '@/common/scss/common.scss';

	.top-title {
		width: 100%;
		margin: 20rpx auto;
		text-align: center;
		@include font-style(18px, bold, #000000);

		.bg-gray {
			background-color: $gray-color;
			color: #FFFFFF;
		}
	}

	.code-box {
		border-top: 1px solid $gray-color;
		border-bottom: 1px solid $gray-color;
		margin: 50rpx auto;
	}
</style>
