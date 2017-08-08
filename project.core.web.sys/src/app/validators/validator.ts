import { Observable } from 'rxjs/Observable';
import { FormControl, FormGroup, Validators } from '@angular/forms';

/**
 * 用户名 纯字母验证
 * @param control 
 */
export function userNameValidator(control: FormControl): any {
    let myreg = /^[A-Za-z]+$/;
    let valid = myreg.test(control.value);
    console.log("userNameValidator校验结果是：" + valid);
    return valid ? null : { userName: true };
}

/**
 * 姓
 * @param control 
 */
export function familyNameValidator(control: FormControl): any {
    let myreg = /^[\u4E00-\u9FA5]{1,5}$/;
    let valid = myreg.test(control.value);
    console.log("familyNameValidator校验结果是：" + valid);
    return valid ? null : { familyName: true };
}

/**
 * 名
 * @param control 
 */
export function givenNameValidator(control: FormControl): any {
    let myreg = /^[\u4E00-\u9FA5]{2,20}$/;
    let valid = myreg.test(control.value);
    console.log("givenNameValidator校验结果是：" + valid);
    return valid ? null : { givenName: true };
}

/**
 * 手机号码验证
 * @param control 
 */
export function mobileValidator(control: FormControl): any {
    let myreg = /(13\d|14[579]|15\d|17[01235678]|18\d)\d{8}/i;
    let valid = myreg.test(control.value);
    console.log("mobileValidator校验结果是：" + valid);
    return valid ? null : { mobile: true };
}

/**
 * email邮箱验证
 * @param control 
 */
export function emailValidator(control: FormControl): any {
    let myreg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    let valid = myreg.test(control.value);
    console.log("emailValidator校验结果是：" + valid);
    return valid ? null : { email: true };
}

/**
 * 密码中必须包含字母、数字、特称字符，至少8个字符，最多30个字符。
 * @param control 
 */
export function passwordValidator(control: FormControl): any {
    let myreg = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,30}$/;
    let valid = myreg.test(control.value);
    console.log("passwordValidator校验结果是：" + valid);
    return valid ? null : { password: true };
}

/**
 * 身份证号验证 15-18位，最后一位是校验位，可能为数字或字符X
 * @param control 
 */
export function IDCardValidator(control: FormControl): any {
    let myreg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    let valid = myreg.test(control.value);
    console.log("IDCardValidator校验结果是：" + valid);
    return valid ? null : { IDCard: true };
}

/**
 * 金额格式
 * @param control 
 */
export function moneyValidator(control: FormControl): any {
    let myreg = /^(([1-9]\d{0,9})|0)(\.\d{1,4})?$/;
    let valid = myreg.test(control.value);
    console.log("moneyValidator校验结果是：" + valid);
    return valid ? null : { money: true };
}

/**
 * 利率格式，小数点后最多三位
 * @param control 
 */
export function rateValidator(control: FormControl): any {
    let myreg = /^(([1-9]\d{0,2})|0)(\.\d{1,4})?$/;
    let valid = myreg.test(control.value);
    console.log("rateValidator校验结果是：" + valid);
    return valid ? null : { rate: true };
}


export function asyncValidator(control: FormControl): any {
    return Observable.of();
}