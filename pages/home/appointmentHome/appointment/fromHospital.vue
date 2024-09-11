<template>
	<view class="page-backgroud">
		<!-- 单个医院信息 -->
		<view class="left-right-inbox" v-for="(item, index) in hospitalList" 
		:key="item.id" @click="toDepartmentPage(item.id, item.name)">
			<image style="width: 100%;" mode="widthFix" :src="'/static/appointment/hospital/hospital1.jpg'"></image>
			<view class="row-width">
				<image class="icon" src="/static/appointment/hosp-icon.png"></image>
				<text class="hospital-text">{{item.name}}</text>
			</view>
			<view class="row-width">
				<text class="blue-title">地址：</text>
				<text class="address-phone-text cut-long-text">{{item.address}}</text>
			</view>
			<view class="row-width">
				<text class="blue-title">电话：</text>
				<text class="address-phone-text cut-long-text">{{item.phone}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getAllHospital
	} from '@/common/api/hospital.js';
	import {
		error
	} from '@/common/js/errorTips.js';

	export default {
		data() {
			return {
				hospitalList: [] // 单个医院信息
			};
		},
		methods: {
			toDepartmentPage(id, name) {
				let hospital = {
					id: id,
					name: name
				};
				uni.setStorageSync('hospital', JSON.stringify(hospital));
				// uni.navigateTo({
				// 	url: '/pages/home/appointmentHome/' + 
				// 	'selectDepartment/selectDepartment?hospitalID=' + id
				// });
				this.toPage();
			},
			getAllHospitalList() {
				getAllHospital(1, 50, '').then(res => {
					if (res.data.code === 200) {
						this.hospitalList = res.data.data.list;
						uni.setStorageSync('firstHospitalId', this.hospitalList[0].id);
					}
				}).catch(() => {
					error('网络');
				});
			},
			toPage: function() {
				const outpatientId = '10018';
				const departmentId = '10011';
				const hospitalId = '1008'
				uni.navigateTo({
					url: '/pagesB/pages/appointPages/timeDoctor/timeDoctor?hospitalId=' + 
					 hospitalId + '&departmentId=' + departmentId 
					 + '&outpatientId=' + outpatientId
				})
			},
		},
		created() {
			this.getAllHospitalList();
			// this.toPage();
		}
	};
</script>

<style lang="scss">
	@import '@/common/scss/common.scss';

	.page-backgroud {
		background-color: #F2F2F2;
		padding: 0;
	}

	.left-right-inbox {
		width: 100%;
		background: #FFFFFF;
		border: 1px solid #BBBBBB;
		border-radius: 8px;
		padding: 20rpx;
		margin-top: 20rpx;
	}

	.row-width {
		width: 100%;
		height: auto;
		@include flex-direction(row);
		align-items: center;
		margin: 10rpx 0;

		.icon {
			@include icon-size(50rpx, 50rpx);
			margin-right: 10rpx;
		}

		.hospital-text {
			@include font-style(15px, bold, #000000);
		}

		.blue-title {
			width: auto;
			@include font-style(16px, 400, $major-color);
			margin-right: 2%;
		}

		.address-phone-text {
			width: auto;
			@include font-style(16px, 400, $gray-color);
		}
	}
</style>
