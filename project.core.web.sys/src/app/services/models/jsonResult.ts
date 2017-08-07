
export class JsonResult<T> {
    /**
     * 返回码
     */
    Code: string;

    /**
     * 返回信息
     */
    Message: string;

    /**
     * 返回数据
     */
    Data: T;

}