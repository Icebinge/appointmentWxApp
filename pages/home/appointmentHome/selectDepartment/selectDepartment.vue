<template>
	<view>
		<department :allData="propsData" ref="department"></department>
	</view>
</template>

<script>
	import departmentVue from '../appointment/department.vue'
import department from '../appointment/department.vue'
	import {getDepartmentHospital} from '@/common/api/department.js'
	
	export default {
		components: {
			department
		},
		data() {
			return {
				propsData: {
					departmentList: [],
					hospitalID: 0
				},
			}
		},
		methods: {
			// 获取某个医院ID所属的专科
			getDepartmentHospital: function(hospitalID) {
				uni.showLoading({
					title: '加载中'
				})
				this.departmentList = [];
				getDepartmentHospital(hospitalID, 1, 50).then(res => {
					if(res.data.code === 200) {
						const data = res.data.data.list
						this.propsData.departmentList = data;
						this.$refs.department.changeInit(data[0].id, data[0].name)
						uni.hideLoading();
					}
				}).catch(() => {
					uni.hideLoading();
					error('网络')
				})
			},
			// 强制跳转到选择时间及医生页面
			toPage: function() {
				const outpatientId = "10018";
				const departmentId = '10011'
				uni.navigateTo({
					url: '/pagesB/pages/appointPages/timeDoctor/timeDoctor?hospitalId=' + 
					 this.propsData.hospitalID + '&departmentId=' + departmentId 
					 + '&outpatientId=' + outpatientId
				})
			},
		},
		onLoad(e) {
			this.propsData.hospitalID = e.hospitalID
			this.getDepartmentHospital(e.hospitalID)
			uni.setStorageSync('hospitalId', e.hospitalID)
			// this.toPage()
		}
	}
</script>

<style>

</style>
