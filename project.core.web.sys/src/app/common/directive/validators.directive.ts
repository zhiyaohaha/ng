import { Directive, ElementRef, Input, HostListener, OnInit, Renderer2, Output, EventEmitter } from '@angular/core';
import { Element } from '@angular/compiler';

@Directive({
  selector: '[customValidator]',
})

//有二种验证方式：1,操作组件时(通过监听事件)验证单个组件；2，点击提交时验证所有组件；

export class CustomValidatorsDirective implements OnInit {
  @Input() validatorRequired: boolean;         //该验证是否必需
  @Input() customValidator: any;                //正则信息（包括报错信息，正则表达式等)
  @Input() validatorComponentType: string;     //绑定验证的组件的类型
  @Input() validatorInputValue: string;        //组件输入的信息
  @Input()                                     //是否点击了提交
  set submitVerify(value) {   //进入页面，直接点击提交的时候，storeErrData还没有传递回去。所以需要ngOnInit
    if (value) {
      this.firstEnterView = false;
      this.submitVerifyFun();
    }
  }
  @Output() storeErrData: EventEmitter<any> = new EventEmitter(); //存储错误信息，用于提交的时候判断。
  pElement: any;  //用于展示错误信息的p元素
  firstEnterView: boolean = true;  //首次进入页面,不显示直接错误信息。

  constructor(private _elRef: ElementRef, private _renderer: Renderer2) { }

  ngOnInit() {
    this.submitVerifyFun();
  }

  /**
   * 提交时手动验证所有组件
   * 
   * @memberof CustomValidatorsDirective
   */
  submitVerifyFun() {
    let validatorInputValue = this.validatorInputValue;
    let validatorComponentType = this.validatorComponentType;
    switch (this.validatorComponentType) {
      case "select": this.verifyInputValue(validatorInputValue, "required", '必选'); break;
      case "file-uploader": this.verifyInputValue(validatorInputValue, "required", '必须上传'); break;
      default: this.verifyInputValue(validatorInputValue, "validator-required", '必填'); break;
    }
  }

  /**
   * 监听组件事件
   * 
   * @param {any} e 
   * @memberof CustomValidatorsDirective
   */
  //input,textarea,timi-chip-group
  @HostListener('blur', ['$event']) onBlur(e) {
    // console.log(e)
    // console.log('input-textarea');
    this.firstEnterView = false;
    // "e.target?e.target.value:e" input,textarea返回的是一个对象；timi-chip-group返回的是一个数组
    this.verifyInputValue(e.target ? e.target.value : e, "validator-required", '必填');
  }
  //select 
  @HostListener('onChange', ['$event']) onChangeSelect(e) {

    if (e) {
      //日历组件，在刚刚加载的时候就触发了onchange事件，所以要区分一下
      if (!e['year']) {  //日历在刚刚加载触发onchange事件的时候，不触发验证事件。
        this.firstEnterView = false;
        this.verifyInputValue(e, "required", '必选');
      } else {  //日历在修改以后，再次触发onchange会,触发验证事件
        if (e['value']) {
          this.firstEnterView = false;
          this.verifyInputValue(e, "required", '必选');
        }
      }
    } else {
      this.firstEnterView = false;
      this.verifyInputValue(e, "required", '必选');
    }

  }
  //timi-file-uploader
  @HostListener('success', ['$event']) onChangeFileUpload(e) {
    // console.log(e)  //返回的是一个没有target属性的对象  
    // console.log('timi-file-uploader')
    this.firstEnterView = false;
    this.verifyInputValue(e.base, "required", '必须上传');  //随意传递一个数组
  }
  //timi-chip-group
  @HostListener('chipsChange', ['$event']) chipsChange(e) {
    // console.log(e)  //返回的是一个数组
    // console.log('timi-chip-group-chipsChange')
    this.firstEnterView = false;
    this.verifyInputValue(e, "validator-required", '必填');
  }



  /**
   *验证输入值
   * 
   * @param {any} validatorValue   //输入值
   * @memberof CustomValidatorsDirective
   */
  verifyInputValue(validatorValue, status, reuiqredMsg) {
    // console.log(1111111111111)
    let validatorRequired = this.validatorRequired;
    let customValidator = this.customValidator;

    if (validatorValue === '' || validatorValue == undefined || validatorValue == null || validatorValue.length == 0) {  //无输入值

      //判断是否是必填
      if (validatorRequired) {
        this.storeErrData.emit(reuiqredMsg);
        if (!this.firstEnterView) {
          this.errorTipsDisplay(reuiqredMsg, true);
        }
      }

    } else {  //有输入值（包括0 的情况）
      // console.log('有值')

      if (status == 'validator-required') {  //验证输入值(必填+正则)
        setTimeout(() => {
          this.verifyInputValueValidatorRequired(validatorValue, this.customValidator);
        }, 0)

      } else if (status == 'required') {   //验证输入值(必填)
        this.storeErrData.emit('');
        this.errorTipsDisplay('', false);
      }

    }
  }

  //验证输入值(必填+正则)
  verifyInputValueValidatorRequired(validatorValue, customValidator) {
    if (customValidator && customValidator.length > 0) { //如果有正则
      let reg;
      let regNum = 0;
      customValidator.forEach(item => {
        reg = new RegExp(item.regular);
        if (!reg.test(validatorValue)) {  //匹配错误，则停止匹配
          // this.storeErrData.emit(item.message);
          this.storeErrData.emit(item.message);
          if (!this.firstEnterView) {
            this.errorTipsDisplay(item.message, true);
          }
          ++regNum;
          return true;
        }
      });
      if (regNum == 0) {  //说明此次输入匹配成功所有正则了
        this.storeErrData.emit('');
        this.errorTipsDisplay('', false);
      }
    } else {   //无正则
      this.storeErrData.emit('');
      this.errorTipsDisplay('', false);
    }
  }


  /**
   * 是否显示错误提示 
   * 
   * @param {any} msg   //错误提示信息
   * @param {any} errTipsDisplay   //错误提示是否展示
   * @memberof CustomValidatorsDirective
   */
  errorTipsDisplay(msg, errTipsDisplay) {
    if (errTipsDisplay) {  //显示
      //组件和errtips的共同父类样式
      let _self = this;
      this.recomposeClass(this.validatorComponentType, function (componentParentClass) {
        _self._renderer.addClass(_self._elRef.nativeElement.parentNode, componentParentClass);
      })
      // this._renderer.addClass(this._elRef.nativeElement.parentNode, 'errBorderParent');

      //组件样式 
      this._renderer.addClass(this._elRef.nativeElement, 'errComponent');

      //errTisps样式 
      if (!this.pElement) {   //动态添加，已经添加过，则不用再添加了
        this.pElement = this._renderer.createElement('p');
        const text = this._renderer.createText(msg);
        this._renderer.appendChild(this.pElement, text);
        this._renderer.addClass(this.pElement, 'errBorder');
        this._renderer.appendChild(this._elRef.nativeElement.parentNode, this.pElement);
      } else {
        // console.log('p存在');
        //修改errborder元素 的text 
        this.pElement.innerHTML = msg;
        //显示errborder元素 
        this._renderer.setStyle(this.pElement, 'display', 'block');
      }

    } else {   //不显示
      //组件和errtips的共同父类样式
      if (this.pElement) {    //为ture说明之前出现过error提示，false这是第一次
        let _self = this;
        this.recomposeClass(this.validatorComponentType, function (componentParentClass) {
          _self._renderer.removeClass(_self._elRef.nativeElement.parentNode, componentParentClass);
        })
        // this._renderer.removeClass(this._elRef.nativeElement.parentNode, this.recomposeClass(this.validatorComponentType));
        //组件样式 
        this._renderer.removeClass(this._elRef.nativeElement, 'errComponent');
        //errTisps样式 ，隐藏errorboder元素
        this._renderer.setStyle(this.pElement, 'display', 'none');
      }

    }
  }
  // 根据不同的组件类型，设置不同的样式
  recomposeClass(componentType, back) {
    let componentParentClass = "";
    switch (componentType) {
      case "select": componentParentClass = "errBorderParentSelect"; break;
      case "file-uploader": componentParentClass = "errBorderParentFileUpLoad"; break;
      case "textarea": componentParentClass = "errBorderParentTextArea"; break;
      case "tags": componentParentClass = "errBorderParentTags"; break;
      case "free-calendar-date": componentParentClass = "errBorderParentCalendarDate"; break;
      case "free-calendar-time": componentParentClass = "errBorderParentCalendarTime"; break;
      default: componentParentClass = "errBorderParent"; break;  //例如input
    }
    // console.log(componentParentClass)
    back(componentParentClass);
  }
}