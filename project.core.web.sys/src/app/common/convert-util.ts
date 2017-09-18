import { URLSearchParams, RequestOptionsArgs, RequestOptions } from '@angular/http';

import { Md5 } from '../../../node_modules/ts-md5/dist/md5';

import { KV } from '../models/KV';

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
    public toJSON(str: string) {
        return JSON.parse(str);
    }

    /**
     * JSON转字符串
     * @param t 
     */
    public toJsonStr<T>(t: T): string {
        return t ? JSON.stringify(t) : "";
    }

    /**
     * 对象Key转小写
     * @param obj 
     */
    public objToLowerCase(obj: object): object {
        for (var key in obj) {
            if (Array.isArray(obj[key]) && obj[key][0] === "object") {
                this.arrayToLowerCase(obj[key]);
            } else {
                obj[this.firstLetterToLowerCase(key)] = obj[key];
            }
        }
        return obj
    }

    /**
     * 数组对象Key转小写
     * @param array 
     */
    public arrayToLowerCase(array: object[]): object[] {
        for (var index = 0; index < array.length; index++) {
            for (var key in array[index]) {
                array[index][this.firstLetterToLowerCase(key)] = array[index][key];
            }
        }
        return array
    }

    /**
     * 字符串首字母小写
     * @param str 
     */
    public firstLetterToLowerCase(str: string): string {
        return str.substr(0, 1).toLowerCase() + str.substr(1);
    }

    /**
     * 对象按KEY排序，返回字符串
     * @param obj 排序传入的对象
     */
    public firstLetterSort(obj: any): string {
        if (typeof obj === "string") {
            return obj;
        }
        let params = [];
        for (var key in obj) {
            params.push(key)
        }
        params.sort();
        let _params = "";
        for (var i = 0; i < params.length; i++) {
            _params += params[i] + "=" + obj[params[i]] + (i == params.length - 1 ? "" : "&");
        }
        return _params;
    }

    /**
     * JSON对象转成KV对象数组
     * @param json 传入JSON
     */
    public JSONtoKV(json): KV[] {
        let arr: KV[] = [];
        for (let key in json) {
            let obj: KV;
            obj = { "key": key, "value": json[key] };
            arr.push(obj);
        }
        return arr;
    }

    /**
     * 时间对象转具体日期
     * @param date 时间对象
     */
    public getFullDate(date: Date): string {
        let Y = date.getFullYear();
        let M = date.getMonth() + 1;
        let D = date.getDate();
        return Y + "-" + M + "-" + D;
    }

    /**
     * 时间对象转具体时间
     * @param date 时间对象
     */
    public getFullTime(date: Date): string {
        let h = date.getHours();
        let m = date.getMinutes();
        let s = date.getSeconds();
        return h + ":" + m + ":" + s;
    }

    /**
     * 时间对象转具体年月日时分秒
     * @param date 时间对象
     */
    public getFullDateTime(date: Date): string {
        return this.getFullDate + " " + this.getFullTime;
    }

}