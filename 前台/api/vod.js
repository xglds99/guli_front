import request from '@/utils/request'

export default {
    getPlayAuth(videoId) {
        return request(
            {
                url: `/eduVod/getPlayAuth/${videoId}`,
                method: 'get'
            }
        )
    }
}