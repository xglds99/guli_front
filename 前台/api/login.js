import request from '@/utils/request'

export default {
    //登录
    submitLoginUser(userInfo) {
        return request({
            url: `/eduCenter/member/login`,
            method: 'post',
            data: userInfo
        })
    },
    getUserInfo() {
        return request({
            url: `/eduCenter/member/GetMemberInfo`,
            method: 'get'
        })
    }
}
