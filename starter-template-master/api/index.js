import request from "@/utils/request";
export default {
    getIndexList() {
        return request({
            url: `/eduService/indexFront/index`,
            method: "get",
        });
    },
};
