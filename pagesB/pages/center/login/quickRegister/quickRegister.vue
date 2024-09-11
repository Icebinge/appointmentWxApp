<template>
	<view>
		<view class="weui-cells weui-cells_after-title" style="margin-top: 30rpx;">
			<!-- 渲染输入字段 -->
			<view v-for="(item, index) in inputFields" :key="index">
				<view :class="['weui-cell', 'weui-cell_input', item.isVcode ? 'weui-cell_vcode' : '']">
					<view class="weui-cell__hd">
						<view class="weui-label">{{ item.label }}</view>
					</view>
					<view class="weui-cell__bd">
						<input
							:class="['weui-input']"
							:placeholder="item.placeholder"
							v-model="form[item.model]"
							@blur="inputCheck(item.label, item.rule, item.model)"
							:password="item.isPassword"
						/>
					</view>
<!-- 					<view v-if="item.isVcode" class="weui-cell__ft" @tap="getPhoneCode">
						<view class="weui-vcode-btn" :style="{ color: getCodeNum > 0 ? '#A6A6A6' : '' }">
							获取验证码{{ getCodeNum > 0 ? `(${getCodeNum}s)` : '' }}
						</view>
					</view> -->
				</view>
			</view>
			<!-- 渲染提示信息 -->
			<view v-for="(tip, index) in tips" :key="index + 'xuanran'">
				<view class="tips-positon">
					<view class="tips-inbox">
						<image class="icon" :src="tip.icon" />
						<text class="tips-text">{{ tip.text }}</text>
					</view>
				</view>
			</view>
		</view>
		<button class="button" @click="validateCode">立即注册</button>
	</view>
</template>

<script>
	import md5 from 'js-md5';
	import { inputCheck, checkPassword } from '@/common/js/inputCheck.js';
	import { error } from '@/common/js/errorTips.js';
	import { getPhoneCode, validataCode, userRegister } from '@/common/api/quickRegister.js';

	export default {
		data() {
			return {
				form: {
					name: '',
					phone: '',
					identifyCode: '123456',
					password: '',
					checkPassword: ''
				},
				isValidate: true,
				getCodeNum: 0,
				inputFields: [
					{ label: '姓名', model: 'name', placeholder: '请输入姓名', rule: 'string' , isPassword: false},
					{ label: '手机号', model: 'phone', placeholder: '请输入手机号', rule: 'phone', isVcode: true , isPassword: false},
					// { label: '验证码', model: 'identifyCode', placeholder: '请输入验证码', rule: 'identifyCode' },
					{ label: '密码', model: 'password', placeholder: '请输入您的登录密码', rule: 'password', isPassword: true },
					{ label: '确认密码', model: 'checkPassword', placeholder: '请再次输入密码', rule: 'checkPassword', isPassword: true }
				],
				tips: [
					{ icon: '/static/appointment/tips.png', text: '请截图或使用备忘录记住你的密码' }
				]
			}
		},
		methods: {
			getPhoneCode() {
				if (this.isValidate && this.form.phone && this.getCodeNum === 0) {
					this.startCountdown();
					getPhoneCode(this.form.phone)
						.catch(() => {
							uni.showToast({ title: '发送失败，请检查网络', icon: 'none' });
						});
				}
			},
			startCountdown() {
				this.getCodeNum = 60;
				const interval = setInterval(() => {
					this.getCodeNum > 0 ? this.getCodeNum-- : clearInterval(interval);
				}, 1000);
			},
			validateCode() {
				if (this.isFormValid()) {
					if(this.isValidate){
						uni.showLoading({ title: '加载中' });
						// validataCode(this.form.phone, this.form.identifyCode)
						// 	.then(res => {
						// 		res.data.code === 200 ? this.registerUser() : this.showError('验证码错误');
						// 	})
						// 	.catch(() => this.showError('网络'));
						this.registerUser();
					}else{
						this.showError("两次密码不一致");
					}
				} else {
					this.showError('请将信息填写完整');
				}

			},
			registerUser() {
				userRegister({
					avatarUrl: this.getAvatarUrl(),
					name: this.form.name,
					password: md5(this.form.password),
					// password: this.form.password,
					phone: this.form.phone
				})
					.then(res => {
						if (res.data.code === 200) {
							uni.hideLoading();
							uni.showToast({ title: '注册成功', icon: 'success' });
							uni.navigateBack();
						} else {
							this.showError('该手机号已存在，请登录');
						}
					})
					.catch(() => this.showError('网络'));
			},
			getAvatarUrl() {
				return uni.getStorageSync('avatarUrl') || 'http://image.yujian95.cn/FmxdyLFebwrEhId3tyb7AXo5Xryc';
			},
			isFormValid() {
				return Object.values(this.form).every(field => field);
			},
			inputCheck(name, rule, value) {
				if(rule!='checkPassword'){
					const errorMsg = inputCheck(name, rule, this.form[value]);
					if (errorMsg !== 'ok') {
						this.isValidate = false;
						error(errorMsg);
					}
				}else{
					this.checkPassword();
				}
			},
			showError(msg) {
				uni.hideLoading();
				error(msg);
			},
			checkPassword() {
				const errorMsg = checkPassword(this.form.password, this.form.checkPassword);
				this.isValidate = (errorMsg === 'ok');
				if (!this.isValidate) error(errorMsg);
			}
		}
	}
</script>

<style lang="scss">
	@import '@/common/scss/form.scss';

	.button {
		@extend .button-box;
		margin-top: 50rpx;
	}

	.tips-positon {
		margin-top: 30rpx;
		@extend .tips-box;
		margin-bottom: 10rpx;
	}

	.icon {
		@include icon-size(50rpx, 50rpx);
	}
</style>
