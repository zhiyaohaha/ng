import { KV } from './kv';
import { URLSearchParams, RequestOptionsArgs, RequestOptions } from '@angular/http';

import { Md5 } from '../../../node_modules/ts-md5/dist/md5';

export class ConvertUtil {
    /**
     * 返回当前时间戳
     */
    public timestamp(): string {
        return (new Date().getTime()).toString().substr(0, 10);
    }

    /**
     * 返回特定时间戳
     * @param date 传入一个Date时间对象 返回时间戳
     */
    public toTimestamp(date: Date): string {
        return (date.getTime()).toString().substr(0, 10);
    }

    /**
     * MD5加密
     * @param str 
     */
    public toMd5(str: string): string {
        return Md5.hashStr(str).toString();
    }

    /**
     * 字符串转JSON
     * @param str 
     */
    public toT<T>(str: string): T {
        return JSON.parse(str);
    }

    /**
     * JSON转字符串
     * @param t 
     */
    public toJsonStr<T>(t: T): string {
        return JSON.stringify(t);
    }
}