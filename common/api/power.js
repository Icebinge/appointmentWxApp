import request from '@/common/utils/request.js'

export function getPower(token) {
  return request({
    url: '/power/account/info',
    method: 'get',
  });
}