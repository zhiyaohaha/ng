// export class globalVar {
//     pageSize: number[] = [10, 30, 50, 100, 200];
// }

export const globalVar = {
  pageSizes: [10, 30, 50, 100, 200], //可选的每页数量
  pageSize: 10, //每页条数
  pageLinkCount: 5, //显示多少页码
  pageCode: "" // 每个页面的pageCode
};

export const customized = {
    SysParam: "SysParam",
    SysArea: "SysArea",
    SysParamDetail: "SysParamDetail",
    SysOperationLogConfig: "SysOperationLogConfig"
};

export const globalUrl = {
    private_key: "84qudMIhOkX5JMQXVd0f4jneqfP2Lp",
    baseUrl: "http://api.cpf360.com",
    wsUrl: "ws://120.26.39.240:8181/"
};

export const defaultValue = {
  imgSrc: "http://data.cpf360.com/default/default.jpg",
  imgQuality: "?x-oss-process=image/resize,m_fill,w_100,h_100,limit_0/auto-orient,0/quality,q_30",
  defaultAvatar: "http://data.cpf360.com/default/avatar.jpg"
};
