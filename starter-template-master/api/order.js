import request from '@/utils/request'
export default {

    createOrder(courseId) {
        return request({
            url: `/eduOrder/createOrder/${courseId}`,
            method: 'post'
        })
    },
    getOrderInfoById(orderNo) {
        return request({
            url: `/eduOrder/getOrderInfo/${orderNo}`,
            method: 'get'
        })
    },
    //3、生成订单二维码的方法
    createNative(orderNo){
        return request({
            url:`/eduOrder/payLog/createNative/${orderNo}`,
            method:'get'
        })
    },
    ////4、根据id获取订单支付状态
    queryPayStatus(orderNo){
        return request({
            url:`/eduOrder/payLog/queryPayStatus/${orderNo}`,
            method:'get'
        })
    }
}