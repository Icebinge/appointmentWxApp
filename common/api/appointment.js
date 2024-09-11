import request from '@/common/utils/request.js'


// 6 更新预约状态
export function updateAppointmentStatus(appointmentId, status) {
  switch(status) {
    case 2:
      return request({
        url: `/visit/appointment/cancel/${appointmentId}`,
        method: 'put',
      });
    case 1:
      return request({
        url: `/visit/appointment/miss/${appointmentId}`,
        method: 'put',
      });
    case 3:
      return request({
        url: `/visit/appointment/finish/${appointmentId}`,
        method: 'put',
      });
    default:
      throw new Error(`Unhandled status: ${status}`);
  }
}

 // 5 根据医生编号获取出诊信息
 export function getTreatRecord(doctorId, pageNum, pageSize) {
	 return request({
		 url: '/visit/appointment/all/doctor?doctorId=' + doctorId + '&pageNum=' + pageNum + '&pageSize=' + pageSize,
		 method: 'get'
	 })
 }