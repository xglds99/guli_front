import request from "@/utils/request";
export default {
  getList() {
    return request({
      url: `/eduCms/bannerFront/getAllBanner`,
      method: "get",
    });
  },
};
