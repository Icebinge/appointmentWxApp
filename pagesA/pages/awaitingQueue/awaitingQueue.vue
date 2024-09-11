<template>
	<view>
		<!-- 假如有数据的时候显示数据的样子 -->
		<view class="out-box" v-show="isGetData" v-for="item in awaitQueueList" :key="item.appointmentId">
			<view class="row-in-box">
				<view class="left-icon-text left">
					<image class="icon" src="/static/center/paidui.png"></image>
					<text class="gray-text">前面还有</text>
				</view>
				<text class="gray-text right">
					<text class="orange-text">{{item.waitPeopleNum}}</text>
					人预约
				</text>
			</view>
			<view class="row-in-box">
				<text class="left gray-text">您的预约号为：</text>
				<text class="gray-text right">
					<text class="orange-text">{{item.queueNum}}</text>
					号
				</text>
			</view>
			<view class="row-in-box">
				<text class="left gray-text">距离您预约大约还有：</text>
				<text class="gray-text right">
					<text class="orange-text">{{item.waitTime}}</text>
					分钟
				</text>
			</view>
			<view class="row-in-box">
				<text class="gray-text">
					项目： 
					<text class="orange-text">{{item.hospitalName}}</text>
				</text>
			</view>
			<view class="row-in-box">
				<text class="gray-text">
					地点： 
					<text class="orange-text">{{item.clinicName}}</text>
				</text>
			</view>
		</view>
		<!-- 当没有数据或者当前还没到预约的预约时间时显示没有预约详情 -->
		<noDataPage :message='message' v-if="!isGetData"></noDataPage>
	</view>
</template>

<script>
	import { getAwaitQueue } from '@/common/api/appoint.js';
	import { getUserCardInfo } from '@/common/api/userInfo.js';
	import { formDate } from '@/common/js/formDate.js';

	export default {
		data() {
			return {
				isGetData: false,
				awaitQueueList: [],
				message: '暂无预约', // 提示信息
				isShowModal: false,
				modalVisited: 0,
				insureVisited: 0,
				cardList: [],
				timer: null // 初始化 timer 变量
			};
		},
		methods: {
			// 打开模态框
			showModal() {
				this.isShowModal = true;
			},
			// 关闭模态框
			hideModal() {
				this.isShowModal = false;
				this.modalVisited = this.insureVisited;
			},
			// 点击弹出框的确定按钮，改变预约状态
			changeCardId() {
				this.insureVisited = this.modalVisited;
				this.isShowModal = false;
				this.getAwaitQueue();
			},
			// 点击选择预约卡
			selectCardId(index) {
				this.modalVisited = index;
			},
			// 获取用户预约卡信息
			getUserCardInfo() {
				uni.showLoading({ title: '加载中' });
				this.cardList = [];
				getUserCardInfo(uni.getStorageSync('accountID')).then(res => {
					if (res.data.code === 200) {
						this.cardList = res.data.data;
						if (this.cardList.length > 0) {
							this.modalVisited = this.cardList[0].id;
							this.insureVisited = this.cardList[0].id;
							this.getAwaitQueue();
						}
					}
					uni.hideLoading();
				}).catch(() => {
					uni.hideLoading();
					uni.showToast({ title: '获取预约卡列表失败', icon: 'none' });
				});
			},
			// 获取排队队列
			getAwaitQueue() {
				this.awaitQueueList = [];
				uni.showLoading({ title: '加载中' });
				getAwaitQueue(uni.getStorageSync('cardID'), uni.getStorageSync('accountID'), 
				formDate(new Date(), 'YYYY-MM-DD')).then(res => {
					if (res.data.code === 200) {
						if (res.data.data.list.length > 0) {
							this.isGetData = true;
							this.awaitQueueList = res.data.data.list;
							this.startTimer(); // 启动定时器
						} else {
							this.isGetData = false;
						}
					}
					uni.hideLoading();
				}).catch(() => {
					uni.hideLoading();
					uni.showToast({ title: '获取排队列表失败', icon: 'none' });
				});
			},
			// 启动定时器方法
			startTimer() {
				this.clearTimer(); // 启动前先清除已有的定时器
				this.timer = setTimeout(() => {
					this.getAwaitQueue(); // 重新获取排队队列
				}, 60000); // 1分钟刷新一次
			},
			// 清除定时器方法
			clearTimer() {
				if (this.timer) {
					clearTimeout(this.timer);
					this.timer = null;
				}
			}
		},
		onLoad() {
			this.getUserCardInfo();
		},
		beforeDestroy() {
			this.clearTimer(); // 组件销毁前清除定时器
		}
	};
</script>

<style lang="scss">
	@import '@/common/scss/common.scss';

	.out-box {
		@include width-margin(90%, 100%);
		margin-top: 50rpx;
		margin-bottom: 40rpx;
		background-color: #FFFFFF;
		border-radius: 5px;

		.row-in-box {
			width: 95%;
			height: 130rpx;
			margin: 0 auto;
			border-bottom: 1px solid $border-color;
			@include row-left-right(70%, 30%);
			line-height: 130rpx;

			.left-icon-text {
				display: flex;
				align-items: center;

				.icon {
					@include icon-size(80rpx, 80rpx);
					margin-right: 30rpx;
				}
			}

			.gray-text {
				@include font-style(18px, 500, $gray-color);
			}

			.orange-text {
				@include font-style(18px, 500, #FFD39B);
				margin: 0 10rpx;
			}
		}
	}

	.icon-up-position {
		@include icon-size(70rpx, 70rpx);
		position: fixed;
		/* 针对H5和小程序不同的平台处理底部导航栏的距离 */
		/* #ifdef H5 */
		bottom: 100rpx;
		/* #endif */
		/* #ifdef MP */
		bottom: 0px;
		/* #endif */
		right: 0rpx;
	}

	.bottom-hospital-box {
		width: 100%;
		height: 100%;
		background: #FFFFFF;
		display: flex;
		flex-wrap: wrap;

		.hospital-box {
			width: 33%;
			height: 80rpx;
			display: flex;
			align-items: center;
			margin-bottom: 20rpx;

			.hospital {
				@include width-margin(85%, 85%);
				border-radius: 10px;
				text-align: center;
				display: table;

				.text {
					width: 100%;
					height: 100%;
					@include font-style(16px, 500, #FFFFFF);
					display: table-cell;
					vertical-align: middle;
				}
			}

			.visited-background {
				background: $major-color;
			}

			.invisited-background {
				background: #D1D1D1;
			}
		}
	}
</style>
