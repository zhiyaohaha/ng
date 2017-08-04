
export class JsonResult<T> {
    /**
     * 返回码
     */
    code: string;

    /**
     * 返回信息
     */
    message: string;

    /**
     * 返回数据
     */
    data: T;

}