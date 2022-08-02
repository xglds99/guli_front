import request from '@/utils/request'

const api_name = '/statistic'
export default {
  createStatistics(day) {
    return request({
      url: `${api_name}/createStatisticsByDate/${day}`,
      method: 'post'
    })
  },
  showChart(searchObj) {
    return request({
      url: `${api_name}/showChart/${searchObj.begin}/${searchObj.end}/${searchObj.type}`,
      method: 'get'
    })
  }
}
