<template>
	<view>
		<view class="list">
			<view class="item">
				<view class="textAvatarUrl">头像</view>
				<view class="center_img">
					<image :src="userBaseInfo.avatarUrl" class="user_head"></image>
				</view>
			</view>
		</view>
		<view class="list">
			<view class="titleStyle">
				<view>基础信息</view>
				<view @tap="openBaseShow()">修改</view>
			</view>
			<view class="item">
				<view class="textStyle">姓名</view>
				<view class="textimg">
					<view class="textData">{{ userBaseInfo.name || '未填写' }}</view>
					<image class="turn_img" src="/static/turn.png"></image>
				</view>
			</view>
			<view class="item">
				<view class="textStyle">电话</view>
				<view class="textimg">
					<view class="textData">{{ userBaseInfo.phone || '未填写' }}</view>
					<image class="turn_img" src="/static/turn.png"></image>
				</view>
			</view>
		</view>

		<view class="list" v-show="isGetCard">
			<view class="titleStyle">
				<view>预约卡信息</view>
				<view @click="openCardShow()">修改</view>
			</view>
			<view class="item">
				<view class="textStyle">预约卡号</view>
				<text class="textData">{{ userCardInfo.id || '未填写' }}</text>
			</view>
			<view class="item">
				<view class="textStyle">姓名</view>
				<text class="textData">{{ userCardInfo.name || '未填写' }}</text>
			</view>
			<view class="item">
				<view class="textStyle">证件号码</view>
				<text class="textData">{{ userCardInfo.identificationNumber | getIdentityNum}}</text>
			</view>
			<view class="item">
				<view class="textStyle">性别</view>
				<text class="textData">{{ userCardInfo.gender | getGender}}</text>
			</view>
			<view class="item">
				<view class="textStyle">出生日期</view>
				<text class="textData">{{ userCardInfo.birthDate | getDate}}</text>
			</view>
			<view class="item">
				<view class="textStyle">手机号码</view>
				<text class="textData">{{ userCardInfo.phone || '未填写' }}</text>
			</view>
		</view>

		<view class="list addCard" v-show="!isGetCard" @click="toAddCard">
			<image class="icon" src="/static/add-crads.png"></image>
			<text class="text">添加专属于自己的预约卡</text>
		</view>

		<view class="cu-modal" :class="showBaseInfo ? 'show' : ''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">修改基本信息</view>
					<view class="action" @tap="closeBaseShow">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl">
					<view class="weui-cells weui-cells_after-title">
						<view class="weui-cell weui-cell_input">
							<view style="width: 20%;">
								<view>姓名：</view>
							</view>
							<view class="weui-cell__bd">
								<input class="weui-input" placeholder="请输入姓名" 
								v-model="userBaseInfo.name" @blur="inputCheck('姓名', 'string', userBaseInfo.name)" />
							</view>
						</view>
					</view>
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						<button class="cu-btn line-green text-green" @tap="closeBaseShow">取消</button>
						<button class="cu-btn bg-green margin-left" @tap="updateBaseInfo">确定</button>
					</view>
				</view>
			</view>
		</view>

		<view class="cu-modal" :class="showCardInfo ? 'show' : ''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">修改预约卡信息</view>
					<view class="action" @tap="closeCardShow">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl">
					<view class="weui-cells weui-cells_after-title">
						<view class="weui-cell weui-cell_input">
							<view style="width: 20%;">
								<view>姓名</view>
							</view>
							<view class="weui-cell__bd">
								<input class="weui-input" placeholder="请输入姓名" 
								v-model="userCardInfo.name" @blur="inputCheck('姓名', 'string', userCardInfo.name)" />
							</view>
						</view>

						<view class="weui-cell weui-cell_input">
							<view style="width: 20%;">
								<view>+86</view>
							</view>
							<view class="weui-cell__bd">
								<input class="weui-input" placeholder="请输入手机号码" 
								v-model="userCardInfo.phone" @blur="inputCheck('电话号码', 'phone', userCardInfo.phone)" />
							</view>
						</view>
					</view>
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						<button class="cu-btn line-green text-green" @tap="closeCardShow">取消</button>
						<button class="cu-btn bg-green margin-left" @tap="updateCardInfo">确定</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { getUserCardInfo } from '@/common/api/userInfo.js'
import { error } from '@/common/js/errorTips.js'
import { updateCardInfo, updateBaseInfo } from '@/common/api/userInfo.js'
import { inputCheck } from '@/common/js/inputCheck.js'

export default {
	data() {
		return {
			showBaseInfo: false,
			showCardInfo: false,
			isGetCard: false,
			userBaseInfo: {
				avatarUrl: '',
				name: '',
				phone: ''
			},
			userCardInfo: {
				id: '',
				name: '',
				identificationNumber: '',
				gender: '',
				birthDate: '',
				phone: '',
				relationId: '',
				type: ''
			},
			modalBaseName: '',
			modalCardInfo: {}
		}
	},
	methods: {
		openBaseShow() {
			this.modalBaseName = this.userBaseInfo.name
			this.showBaseInfo = true
		},
		closeBaseShow() {
			this.userBaseInfo.name = this.modalBaseName
			this.showBaseInfo = false
		},
		openCardShow() {
			this.modalCardInfo = JSON.parse(JSON.stringify(this.userCardInfo))
			this.showCardInfo = true
		},
		closeCardShow() {
			this.userCardInfo = this.modalCardInfo
			this.showCardInfo = false
		},
		updateBaseInfo() {
			const validate = inputCheck('姓名', 'string', this.userBaseInfo.name)
			if (validate === 'ok') {
				uni.showLoading({
					title: '修改中'
				})
				updateBaseInfo(uni.getStorageSync('userID'), {
					avatarUrl: this.userBaseInfo.avatarUrl,
					name: this.userBaseInfo.name
				}).then(res => {
					uni.hideLoading()
					if (res.data.code === 200) {
						uni.showToast({
							title: '修改成功',
							icon: 'success'
						})
						this.showBaseInfo = false
					} else {
						this.userBaseInfo.name = this.modalBaseName
						this.showBaseInfo = false
						error('更新失败')
					}
				}).catch(() => {
					uni.hideLoading()
					this.userBaseInfo.name = this.modalBaseName
					this.showBaseInfo = false
					error('更新失败，请检查网络')
				})
			} else {
				error(validate)
			}
		},
		updateCardInfo() {
			const nameValidate = inputCheck('姓名', 'string', this.userCardInfo.name)
			const phoneValidate = inputCheck('手机号', 'phone', this.userCardInfo.phone)
			if (nameValidate !== 'ok') {
				error(nameValidate)
			} else if (phoneValidate !== 'ok') {
				error(phoneValidate)
			} else {
				uni.showLoading({
					title: '修改中'
				})
				updateCardInfo(this.userCardInfo.relationId, {
					gender: this.userCardInfo.gender,
					name: this.userCardInfo.name,
					phone: this.userCardInfo.phone,
					type: this.userCardInfo.type
				}).then(res => {
					uni.hideLoading()
					if (res.data.code === 200) {
						this.showCardInfo = false
						uni.showToast({
							title: '修改成功',
							icon: 'success'
						})
					} else {
						this.userCardInfo = this.modalCardInfo
						this.showCardInfo = false
						error('修改失败')
					}
				}).catch(() => {
					uni.hideLoading()
					this.userCardInfo = this.modalCardInfo
					this.showCardInfo = false
					error('修改失败，请检查网络')
				})
			}
		},
		toAddCard() {
			uni.navigateTo({
				url: '/pagesB/pages/center/addCard/addCard?isMyself=' + true
			})
		},
		getMyselfCardInfo() {
			uni.showLoading({
				title: '加载中'
			})
			getUserCardInfo(uni.getStorageSync('accountID')).then(res => {
				uni.hideLoading()
				if (res.data.code === 200) {
					const cardList = res.data.data
					if (cardList.length !== 0) {
						cardList.forEach(item => {
							if (item.type === 0) {
								this.isGetCard = true
								this.userCardInfo = item
								uni.setStorageSync('cardID', item.id)
							}
						})
					} else {
						this.isGetCard = false
					}
				}
			}).catch(() => {
				uni.hideLoading()
				error('网络错误')
			})
		}
	},
	onShow() {
		this.userBaseInfo = JSON.parse(uni.getStorageSync('userInfo') || '{}')
		this.getMyselfCardInfo()
	}
}
</script>

<style lang="scss">
@import '@/common/scss/common.scss';
.list {
	width: 95%;
	margin: 0 auto;
	margin-top: 8px;
	margin-bottom: 5px;
	border: 1px;
	background-color: white;
	box-shadow: 0 0 5px 5px #F6F6FA;
	border-radius: 3%;
}

.item {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	padding: 2% 3%;
	border-bottom: 1px solid #f3f3f3;
}

.textAvatarUrl {
	font-size: 14px;
	line-height: 55px;
	font-weight: bold;
}

.textStyle {
	font-size: 14px;
	line-height: 33px;
	font-weight: bold;
}

.textData {
	font-size: 14px;
	line-height: 33px;
	color: #8F8F94;
}

.center_img {
	width: 55px;
	height: 55px;
	border-radius: 50%;
	overflow: hidden;
	margin-right: 3%;
}

.center_img image {
	width: 100%;
	height: 100%;
	border-radius: 50%;
	margin-top: 8rpx;
}

.turn_img {
	width: 13px;
	height: 13px;
	margin-left: 2px;
}

.titleStyle {
	color: #AAAAAA;
	border-bottom: 1px solid #f3f3f3;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	padding: 2% 3%;
}

.textimg {
	display: flex;
	flex-direction: row;
	justify-content: center;
	vertical-align: middle;
	align-items: center;
}

.addCard {
	@include width-margin(90%, 80rpx);
	@include flex-direction(row);
	align-items: center;
	justify-content: center;
	padding: 2% 3%;
	margin-top: 40rpx;
}

.icon {
	@include icon-size(50rpx, 50rpx);
	margin-right: 30rpx;
}

.text {
	@include font-style(16px, 500, $major-color);
}
</style>
