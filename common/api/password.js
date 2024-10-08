import request from '@/common/utils/request.js';
import unloginRegister from '@/common/utils/unloginRequest.js'

// 6 修改密码的短信验证
 export function getPasswordCode(phone) {
	 console.log('test')
	 return unloginRegister({
		  url: '/user/basic/password/message?phone=' + phone,
		  method: 'get'
	 })
 }
 // 7 用户修改密码
 export function updatePassword(data) {
	 return unloginRegister({
		 url: '/user/basic/password',
		 method: 'put',
		 data
	 })
 }
 // 8 验证手机号是否已注册
 export function checkPhone(phone) {
	 return unloginRegister({
		 url: '/user/basic/checkPhone?phone=' + phone,
		 method: 'get'
	 })
 }