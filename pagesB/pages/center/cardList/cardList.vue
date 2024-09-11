<template>
	<view>
		<text class="gray-tips">最多可添加5个预约卡，左滑可以编辑预约卡</text>
		<view class="main-container">
			<view class="main" v-if="isGetData">
				<view class="main_item" v-for="(item, index) in cardList" :key="item.relationId">
					<movable-area>
						<movable-view damping="100" :out-of-bounds="true" direction="horizontal" :x="show==item.relationId?x:''"
						 :animation="false" @change="handleSlide" @touchend="handleTouchEnd" :data-name="item.relationId">
							<view class="info-box">
								<view class="row-box" style="margin-top: 20rpx;">
									<text class="name">{{ item.name }}</text>
									<image class="icon" :src="item.gender === 1 ? `${iconPath}male.png` : `${iconPath}female.png`"></image>
								</view>
								<view class="row-box">
									<text class="gray-text">卡号：</text>
									<text class="gray-text">{{ item.id }}</text>
								</view>
								<view class="row-box">
									<text class="gray-text">身份证号：</text>
									<text class="gray-text">{{ item.identify | getIdentityNum }}</text>
								</view>
							</view>
						</movable-view>
					</movable-area>
					<view class="delete_box" v-if="show === item.relationId">
						<view class="round-outbox">
							<view class="round-box" :class="{ 'blue-background': handle === 1 }" @click="handleEdit(item)">
								<image class="icon" src="/static/appointment/edit.png"></image>
							</view>
						</view>
						<view class="round-outbox">
							<view class="round-box" :class="{ 'red-background': handle === 2 }" @click="openConfirm(item.name, show)">
								<image class="icon" src="/static/appointment/delete.png"></image>
							</view>
						</view>
					</view>
				</view>
			</view>
			<noDataPage :message="message" v-else></noDataPage>
		</view>
		<image class="add-button" src="/static/appointment/add.png" @click="toAddCard"></image>
	</view>
</template>

<script>
import { getIsCardOverIimit, getUserCardInfo, deleteCardInfo } from '@/common/api/userInfo.js'
import { error } from '@/common/js/errorTips.js'

export default {
	data() {
		return {
			x: 0,
			currentX: 0,
			show: false,
			iconPath: '/static/center/',
			cardList: [],
			handle: 0,
			isGetData: true,
			message: '家人预约卡',
			isOverLimit: false,
		}
	},
	methods: {
		handleSlide(e) {
			this.currentX = e.detail.x;
		},
		stopSlideView() {
			this.x = 0;
			this.show = false;
			this.handle = 0;
		},
		handleTouchEnd(e) {
			if (this.currentX < -46) {
				this.x = -92;
				this.show = e.currentTarget.dataset.name;
			} else {
				this.stopSlideView();
			}
		},
		handleEdit(item) {
			this.handle = 1;
			uni.navigateTo({
				url: `/pagesB/pages/center/addCard/editCard/editCard?cardInfo=${JSON.stringify(item)}`
			});
			this.stopSlideViewAfterDelay();
		},
		stopSlideViewAfterDelay() {
			setTimeout(this.stopSlideView, 2000);
		},
		handleDelete(relationId) {
			this.handle = 2;
			uni.showLoading({ title: '加载中' });
			deleteCardInfo(relationId)
				.then(res => {
					if (res.data.code === 200) {
						this.getUserCardInfo();
					}
					this.stopSlideView();
					uni.hideLoading();
				})
				.catch(() => {
					uni.hideLoading();
					error('删除失败');
				});
		},
		toAddCard() {
			uni.navigateTo({ url: '/pagesB/pages/center/addCard/addCard' });
		},
		getIsCardOverIimit() {
			getIsCardOverIimit(uni.getStorageSync('accountID'))
				.then(res => {
					if (res.data.code === 200) {
						this.isOverLimit = res.data.data;
					}
				})
				.catch(() => error('网络'));
		},
		getUserCardInfo() {
			uni.showLoading({ title: '加载中' });
			this.cardList = [];
			getUserCardInfo(uni.getStorageSync('accountID'))
				.then(res => {
					if (res.data.code === 200) {
						const data = res.data.data;
						this.isGetData = data.some(item => item.type !== 0);
						this.cardList = data.filter(item => item.type !== 0).map(item => ({
							relationId: item.relationId,
							type: item.type,
							id: item.id,
							name: item.name,
							gender: item.gender,
							phone: item.phone,
							identify: item.identificationNumber,
							birthDate: item.birthDate,
						}));
					}
					uni.hideLoading();
				})
				.catch(() => {
					uni.hideLoading();
					error('网络');
				});
		},
		openConfirm(name, relationId) {
			uni.showModal({
				title: '删除',
				content: `确认解绑${name}的预约卡吗？`,
				confirmText: "确认",
				cancelText: "取消",
				success: res => {
					if (res.confirm) {
						this.handleDelete(relationId);
					} else {
						this.stopSlideView();
					}
				}
			});
		},
	},
	onShow() {
		this.getUserCardInfo();
	}
}
</script>

<style lang="scss">
@import '@/common/scss/common.scss';

.page {
	@extend .page-backgroud;
}

.gray-tips {
	width: 100%;
	height: 70rpx;
	line-height: 70rpx;
	text-align: center;
	@include font-style(16px, 500, $gray-color);
	position: fixed;
	top: 0px;
	z-index: 10;
	background-color: #fff; /* 确保提示文字背景为白色，避免被卡片内容覆盖 */
}

.main-container {
	margin-top: 70rpx; /* 确保卡片与提示文字有足够的间距 */
}

.main {
	@include flex-direction(column);
	align-items: center;

	.main_item {
		margin-top: 30rpx;
		@include flex-direction(row);

		movable-area {
			width: 740rpx;
			height: 201rpx;
			background: #fff;

			movable-view {
				width: 1016rpx;
				height: 201rpx;
			}
		}

		.delete_box {
			width: 300rpx;
			height: 201rpx;
			background: #F2F2F2;
			@include flex-direction(row);
			position: absolute;
			right: 0px;

			.round-outbox {
				width: 50%;
				height: 100%;
				display: flex;
				align-items: center;

				.round-box {
					@include width-margin(100rpx, 100rpx);
					border-radius: 50%;
					background: #FFFFFF;
					display: flex;
					align-items: center;

					.icon {
						margin: 0 auto;
						@include icon-size(60rpx, 60rpx);
					}
				}

				.blue-background {
					background: $major-color !important;
				}

				.red-background {
					background: red !important;
				}
			}
		}

		.main_item:nth-of-type(1) {
			margin-top: 70rpx;
		}
	}
}

.info-box {
	@include width-margin(90%, 95%);

	.row-box {
		width: 100%;
		height: 60rpx;
		line-height: 60rpx;
		@include flex-direction(row);
		align-items: center;

		.name {
			@include font-style(18px, bold, #000000);
			margin-right: 30rpx;
		}

		.icon {
			@include icon-size(70rpx, 70rpx);
		}

		.gray-text {
			@include font-style(16px, 500, $gray-color);
			margin-right: 30rpx;
		}
	}
}

.add-button {
	@include icon-size(85rpx, 85rpx);
	position: fixed;
	bottom: 30rpx;
	right: 30rpx;
}
</style>
