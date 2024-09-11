import request from '@/common/utils/request.js'
/**
 * 用户预约的api
 * 1 添加预约记录
 * 2 验证预约卡号是否是黑名单
 * 3 获取预约记录
 * 4 获取全部预约记录
 * 5 获取排队队列
 * 6 取消预约
 * **/
 
 // 1 添加预约记录
 export function addAppoint(data) {
	 return request({
		 url: '/visit/appointment',
		 method: 'post',
		 data
	 })
 }
 // 2 验证预约卡号是否是黑名单
 export function valifyBlacklist(cardId) {
	 return request({
		 url: '/visit/black/verify?cardId=' + cardId,
		 method: 'get'
	 })
 }
 // 3 获取预约记录
 export function getAppointRecord(pageNum, pageSize, cardId, status) {
	 return request({
		 url: '/visit/appointment/search?pageNum=' + pageNum + '&pageSize=' + pageSize + '&cardId=' 
		 + cardId + '&status=' + status,
		 method: 'get'
	 })
 }
 
// 4 获取全部预约记录
export function getAllAppointRecord(cardId, accountId, pageNum, pageSize) {
	return request({
		url: '/visit/appointment/all?cardId=' + cardId + '&accountId=' + accountId + '&pageNum=' 
		+ pageNum + '&pageSize=' + pageSize,
		 method: 'get'
	})
}
// 5 获取排队队列
export function getAwaitQueue(cardId, accountId, date) {
	return request({
		url: '/visit/appointment/today?cardId=' + cardId + '&accountId=' + accountId
		     + '&date=' + date,
			 method: 'get'
	})
}
//  6 取消预约
export function cancelAppoint(id) {
	return request({
		url: '/visit/appointment/cancel/' + id,
		method: 'put'
	})
}