<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			wx.cloud.init({
			// env 参数说明：
			//   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
			//   此处请填入环境 ID, 环境 ID 可打开云控制台查看
			//   如不填则使用默认环境（第一个创建的环境）    
			//env: '你的环境ID',
			env: 'appointment-2gtbdeu953fc3be8',
			traceUser: true,
			})
			//调用云函数
			// wx.cloud.callFunction({
			//   name: 'get_openId',
			//   success: res => {
			// 	//获取用户openid
			// 	this.globalData.user_openid = res.result.openid
			// 	console.log(this.globalData.user_openid)
			//   }
			// })
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		//全局数据
		globalData: {
			//用户openid
			user_openid: '',
			//用户信息
			userInfo: null
		}

	}
</script>

<style>
	/*每个页面公共css */
	@import './common/style/weui.wxss';
	@import "./common/style/colorui/main.css";
	@import "./common/style/colorui/icon.css";
	@import "./common/style/colorui/animation.css";
	/* 去掉H5页面的重复头部的信息 */
	/* #ifdef H5 */
	uni-page-head{
		display: none; 
	} 
	/* #endif */
</style>
