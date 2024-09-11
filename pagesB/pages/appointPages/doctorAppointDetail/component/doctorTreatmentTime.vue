<template>
	<view>
		<view class="gray-box">
			<view class="date-change-box">
				<image class="icon" src="/static/appointment/time-left.png"></image>
				<text>{{doctorVisitPlan.day | getDate}} {{doctorVisitPlan.day | getDay}}</text>
				<image class="icon" src="/static/appointment/time-right.png"></image>
			</view>
			<view class="time-money-box" v-for="(item, index) in timeList[visitPlan.time - 1].list"
			 :key="index" @click="item.available ? toInsureAppoint(index) : null" :class="{ 'disabled': !item.available }">
				<view class="time-box">
					<view class="time-button">{{timeList[visitPlan.time - 1].list[index].start}}</view>
					<view class="time-button">{{timeList[visitPlan.time - 1].list[index].end}}</view>
				</view>
				<text class="money"><text style="color: #FFD39B;">10</text>元</text>
				<view class="appoint-num" v-if="item.available">
					<text>可预约</text>
					<image class="icon" src="/static/icon-right.png"></image>
				</view>
				<view class="appoint-num" v-else>
					<text>满号</text>
					<image class="icon"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {getVisitPlanList, getHospitalVisitPlan} from '@/common/api/doctor.js'
	import {formDate} from '@/common/js/formDate.js'
	import {error} from '@/common/js/errorTips.js'
	export default {
		props: {
			
		},
		data() {
			return {
				doctorVisitPlan: {},
				doctorInfo: {},
				visitPlan: {},
				timeList: [{
					time: 1,
					list: [{
						start: '09:30',
						end: '10:00',
						available: true // 可预约源的状态
					}, {
						start:' 10:00',
						end: '10:30',
						available: true // 可预约源的状态
					}, {
						start: '10:30',
						end: '11:00',
						available: true // 可预约源的状态
					}, {
						start: '11:00',
						end: '11:30',
						available: true // 可预约源的状态
					}, {
						start: '11:30',
						end: '12:00',
						available: true // 可预约源的状态
					}]
				}, {
					time: 2,
					list: [{
						start: '14:30',
						end: '15:00',
						available: true // 可预约源的状态
					}, {
						start: '15:00',
						end: '15:30',
						available: true // 可预约源的状态
					}, {
						start: '15:30',
						end: '16:00',
						available: true // 可预约源的状态
					}, {
						start: '16:00',
						end: '16:30',
						available: true // 可预约源的状态
					}, {
						start: '16:30',
						end: '17:00',
						available: true // 可预约源的状态
					}, {
						start: '17:00',
						end: '17:30',
						available: true // 可预约源的状态
					}, {
						start: '17:30',
						end: '18:00',
						available: true // 可预约源的状态
					}, {
						start: '18:00',
						end: '18:30',
						available: true // 可预约源的状态
					}, {
						start: '18:30',
						end: '19:00',
						available: true // 可预约源的状态
					}]
				}]
			}
		},
		methods: {
			// 跳转到确认预约页面
			toInsureAppoint: function(index) {
				let timePeriod = 0
				if(this.visitPlan.time === 1) {
					timePeriod = index + 1
				} else {
					timePeriod = index + 6
				}
				let visitInfo = {
					planId: this.visitPlan.id,
					doctorName: this.doctorInfo.name,
					timePeriod: timePeriod,
					date: this.visitPlan.day,
					clinicId: this.visitPlan.clinicId
				}
				uni.setStorageSync('visitInfo', JSON.stringify(visitInfo))
				uni.navigateTo({
					url: '/pagesB/pages/appointPages/doctorAppointDetail/insureAppoint/insureAppoint'
				})
			},
			// 获取医生的该天的出诊计划
			getDoctorVisitPlan: function() {
				uni.showLoading({
					title: '加载中'
				})
				let date = formDate(this.doctorVisitPlan.day, 'YYYY-MM-DD');
				let that = this;
				getHospitalVisitPlan(JSON.parse(uni.getStorageSync('hospital')).id, this.doctorInfo.id, date).then(res => {
					if(res.data.code === 200) {
						uni.hideLoading()
						res.data.data.forEach(function(item) {
							if(that.doctorVisitPlan.time == item.time) {
								that.visitPlan = item
								// 根据后台返回的数据设置每个时间段的号源状态
								item.residues.forEach((residue, index) => {
									that.timeList[item.time - 1].list[index].available = residue > 0;
								});
							}
						})
					}
				}).catch(() => {
					uni.hideLoading();
					error('获取出诊计划失败')
				})
			}
		},
		created() {
			this.doctorVisitPlan = JSON.parse(uni.getStorageSync('visitPlan')).outCallList;
			console.log('this.doctorVisitPlan.time:', this.doctorVisitPlan.time);
			this.doctorInfo = JSON.parse(uni.getStorageSync('doctorInfo')).doctorInfo
			this.getDoctorVisitPlan()
			uni.removeStorageSync("doctorInfo")
			console.log('visitPlan:', this.visitPlan);
			console.log('timeList:', this.timeList);
		}
	}
</script>

<style lang="scss">
	@import '@/common/scss/common.scss';
	.disabled {
	  pointer-events: none;
	  opacity: 0.5; // 可选，表示禁用的状态
	}
	.gray-box{
		@extend .gray-border-box;
		margin-top: 30rpx;
		.date-change-box{
			@include width-margin(90%,100rpx);
			@include flex-direction(row);
			justify-content: center;
			align-items: center;
			border-bottom: 1px solid $border-color;
			.icon{
				@include icon-size(60rpx,60rpx);
			}
			.date-day{
				@include font-style(18px,bold,#000000);
			}
		}
		.time-money-box{
			@include width-margin(90%,170rpx);
			@include flex-direction(row);
			justify-content: space-between;
			align-items: center;
			.time-box{
				width: 30%;
				height: 100%;
				margin: 20rpx 0;
				.time-button{
					width: 130rpx;
					height: 55rpx;
					line-height: 55rpx;
					text-align: center;
					background: $major-color;
					margin-top: 20rpx;
					border-radius: 6px;
					overflow: hidden;
					@include font-style(16px,500,#ffffff);
				}
				.gray-background{
					background: #D1D1D1 !important;
				}
			}
			.money{
				width: 40%;
				@include font-style(16px,500,#000000);
				// 多少钱的数字的颜色为#FFD39B
			}
			.appoint-num{
				width: 30%;
				display: flex;
				justify-content: flex-end;
				@include font-style(16px,500,$gray-color);
				align-items: center;
				.icon{
					@include icon-size(60rpx,60rpx);
					// margin-left: 10rpx;
				}
			}
		}
		.time-money-box:not(:last-child){
			border-bottom: 1px solid $border-color;
		}
	}
</style>
