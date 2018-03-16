import { Component, EventEmitter, Input, NgModule, OnInit, Output, ElementRef, ViewChild, ViewContainerRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MdButtonModule, MdDatepickerModule, MdInputModule, MdSelectModule } from "@angular/material";
import { ButtonModule } from "../button/button.directive";
import { ChipModule } from "../chip/chip.component";
import { RadioModule } from "../radio/radio.component";
import { CheckboxModule } from "../checkbox/checkbox.component";
import { TimiFileUploaderModule } from "../timi-ng2-file-uploader/timi-ng2-file-uploader.component";
import { TimiInputModule } from "../timi-input/timi-input.component";
import { TimiChipModule } from "../timi-chip/chip.component";
import { TimiTextareaModule } from "../timi-textarea/timi-textarea.component";
import { TimiCheckboxModule } from "../timi-checkbox/timi-checkbox.component";
import { TimiSelectModule } from "../timi-select/select.component";
import { BaseService } from "../../services/base.service";
import { DynamicDomsModule } from "../dynamic-doms/dynamic-doms.component";
// import {NewComponentModule} from "app/newcomponent/newcomponent.module";
import { RegionModule } from "../region/region.component";
import { UEditorModule } from "ngx-ueditor";
import { globalUrl } from "../../common/global.config";
import { Md5 } from "ts-md5/dist/md5";
import { SharedPipeModule } from "../shared-pipe/shared-pipe.module";
import { forEach } from "@angular/router/src/utils/collection";
import { CalendarModule } from "../calendar/calendar.component";
import { TdLoadingService, TdDialogService } from "@covalent/core";
import { BaseUIComponent } from "../../pages/baseUI.component";
import { ActivatedRoute } from "@angular/router";
import { isArray } from "util";
@Component({
  selector: "timi-responsive-form",
  templateUrl: "./responsive-model.component.html",
  styleUrls: ["./responsive-model.component.scss", "../../common/directive/validators.directive.scss"],
})

export class ResponsiveModelComponent extends BaseUIComponent implements OnInit {
  config = {
    toolbars: [["bold", "italic", "underline", "removeformat", "indent", "paragraph", "Fontsize", "forecolor", "|", "justifyleft", "justifycenter", "justifyright", "justifyjustify", "Undo", "Redo"]],
    autoClearinitialContent: true,
    wordCount: false,
    initialFrameHeight: 300,
    initialFrameWidth: "100%",
    serverUrl: "http://api2.cpf360.com",
    imageUrl: "/api/file/upload"
  };

  _modelDOMSData = {}; //添加的数据对象

  _modelDOMS; //模板

  _errData = []; //错误信息集合
  @Input() //模版
  set modelDOMS(value) {
    this._modelDOMS = value;
    if (value) {
      value.forEach(item => {
        item.childrens.forEach(i => {
          if (i.childrens) {
            i.childrens.forEach(iChild => {
              this._modelDOMSData[iChild.name] = iChild.value;
            });
          } else {
            this._modelDOMSData[i.name] = i.value;
          }
        });
      });
    }
  }

  get modelDOMS() {
    return this._modelDOMS;
  }

  @Input() submitBtnNeed: boolean = true;  //是否需要提交按钮（默认是需要的，该字段传入空字符串，则不需要提交按钮）
  @Input() btnType; //按钮类型
  @Input() btnValue; //确定按钮显示的文字
  @Input() modelDOMSData = {}; //需要修改的原数据

  @Output() backClick: EventEmitter<any> = new EventEmitter();
  @Output() ngSubmit: EventEmitter<any> = new EventEmitter();

  submitVerify: boolean = false;   //是否开始组件统一验证（提交时开启）
  eventListenerSubmit: boolean = false; //是否，(使用提交按钮，通过监听组件事件提交表单数据)
  @Output() submitErrorData: EventEmitter<any> = new EventEmitter();
  @Input()
  set manualVerificationForm(value) {  //手动验证
    if (value) {
      //验证：点击提交，开始统一验证所有组件。
      this.submitVerify = true;
      this.submitErrorData.emit(this._errData);
    } else {
      this.submitVerify = false;
    }
  }
  inputKeyDisposeArray: any = []; //存储有管道的，值需要处理的，input控件的key(是一个临时数据)。
  inputDisposeArray: any = [];   //存储有管道的，值需要处理的，input控件的key和pipe。

  eventHandingsArray: any = [];  //存储控件事件处理
  @ViewChild("form") formDiv: ElementRef;

  constructor(private baseService: BaseService,
    private er: ElementRef,
    private loadingService: TdLoadingService,
    private dialogService: TdDialogService,
    private viewContainerRef: ViewContainerRef,
    private routerInfor: ActivatedRoute) {
    super(loadingService, routerInfor);
  }

  ngOnInit() {
    // if (this.btnType !== 'new' && !this.eventListenerSubmit) {  //不使用提交按钮的状态下，表单从新增转换成修改时，进行统一验证。
    //   this.submitVerify = true;
    // }
  }

  /**
   * 返回按钮
   */
  back() {
    this.backClick.emit();
  }

  /**
   * 提交表单
   */
  onSubmit($event, cmds?: any) {

    if (!this.eventListenerSubmit) {   //不使用提交按钮，通过监听组件事件提交表单数据时，不需要统一验证所有组件
      //验证：点击提交，开始统一验证所有组件。
      this.submitVerify = true;

      //验证：如果有验证错误信息，则停止提交
      let errData = this._errData;
      for (let i in errData) {
        if (errData[i]) {
          super.openAlert({ title: "提示", message: "请填写完整相关信息", dialogService: this.dialogService, viewContainerRef: this.viewContainerRef });
          return false;   //如果有错误，则停止提交
        }
      }
    }

    //对，有管道且有处理需求的input 的值，进行处理
    // console.log(this.inputDisposeArray);
    if (this.inputDisposeArray.length > 0) {
      this.inputDisposeArray.forEach(element => {
        if (element.pipe === "HtmlPipe.InterestRate") {  //利率
          $event[element.key] /= 100;
        } else if (element.pipe === "HtmlPipe.TenThousandKM") {  //万公里
          $event[element.key] *= 10000;
        } else if (element.pipe === "HtmlPipe.TenThousandElement") {  //万元
          $event[element.key] *= 10000;
        }
      });
    }

    //没有错误，可以继续提交
    let data = {};
    for (const key in $event) {  //把带点的数据结构处理为，json格式
      if (key.indexOf(".") > 0) {
        let arr = key.split(".");
        if (data[arr[0]]) {
          data[arr[0]][arr[1]] = $event[key];
        } else {
          data[arr[0]] = {};
          if (typeof $event[key] === "number") {
            $event[key] = $event[key].toString();
          }
          data[arr[0]][arr[1]] = $event[key];
        }
      } else {
        data[key] = $event[key];
      }
    }
    // console.log($event)
    // console.log(data)
    if (cmds) {
      let param = {};
      param["data"] = data;
      param["cmds"] = cmds;
      this.ngSubmit.emit(param);
    } else {
      this.ngSubmit.emit(data);
    }

  }

  /**
   * 通过basic.logo 获取 basic._logo的值
   *
   * @param {any} value
   * @param {any} data
   * @returns
   * @memberof ResponsiveModelComponent
   */
  displayLogoFun(value, data) {
    let key = value.split(".");
    if (key.length === 1) {
      return data["_" + key[0]];
    }
    return data[key[0]]["_" + key[1]];
  }

  /**
   * 上传文件
   */
  selected($event) {
  }

  /**
   * 上传成功
   */
  uploaded($event) {
  }

  /**
   * 下拉框的值改变
   * @param $event 改变的值
   * @param option 需要联动的配置
   */
  selectChange(keyName, $event, option, dts) {
    // if (!$event) {
    //   return false;
    // }
    if (option) {
      let that = this;
      for (let i = option.length - 1; i >= 0; i--) {
        let config = {};
        for (let j = option[i].bindParamFields.length - 1; j >= 0; j--) {
          let receiveKey = option[i].bindParamFields[j];

          if (receiveKey.indexOf(".") !== -1) {  //key 的形式 可能key是basic.type的形式
            let postKey;
            postKey = receiveKey.split(".");
            //增加产品时， 贷款类型，勾选以后再取消， this.modelDOMSData为空。
            // config[receiveKey] = this._modelDOMSData[receiveKey] || (this.modelDOMSData[postKey[0]] ? this.modelDOMSData[postKey[0]][postKey[1]] : this.modelDOMSData[postKey[0]]);
            config[receiveKey] = this._modelDOMSData[receiveKey] || (this.modelDOMSData[postKey[0]] ? (this.modelDOMSData[receiveKey] ? this.modelDOMSData[receiveKey] : this.modelDOMSData[postKey[0]][postKey[1]]) : this.modelDOMSData[postKey[0]]);
          } else {          //key 的形式是正常的形式。eg：id
            config[receiveKey] = this._modelDOMSData[receiveKey] || this.modelDOMSData[receiveKey];
          }

          // config[option[i].bindParamFields[j]] = this._modelDOMSData[option[i].bindParamFields[j]] || this.modelDOMSData[option[i].bindParamFields[j]];
        }
        if (!option[i].triggerUrl) {
          return false;
        }
        this.baseService.get("/api/" + option[i].triggerUrl, config).subscribe(r => {
          if (r.code === "0") {

            //附件组和附件项执行此处代码，其它联动select组件，不执行此代码
            if (r.data) {
              if (r.data[0] && r.data[0]["_attachments"]) {
                if (this.modelDOMSData[option[i].triggerDom] !== undefined) {      // 修改页面
                  this.judgeSetChangeData(r.data, option[i].triggerDom, "edit");
                } else {                                                       //新增页面
                  this.judgeSetChangeData(r.data, option[i].triggerDom, "add");
                }
              }
            }
            this.setSelectOptions(option[i].triggerDom, r.data);
          }
        });
      }
    }

    this.commitData();

    //对控件事件的处理
    this.eventHandling(keyName, $event, dts)
  }

  /**
   * 附件组联动附件项，附件项传递数据到附件组预览。
   *
   * @param {any} res
   * @param {any} key
   * @param {any} status
   * @memberof ResponsiveModelComponent
   */
  judgeSetChangeData(res, key, status) {
    // if (res[0]["id"]) {   // 是附件项的时候才执行（但是不应该写成固定的 key。因为后天随时会改变）
    let data = [];
    //for循环：如果某一附件组下面，没有附件项勾选，则不显示该附件组
    for (let k = res.length - 1; k >= 0; k--) {
      for (const j in res[k]) {  //依据于数据结构的写法
        if (Array.isArray(res[k][j]) && res[k][j].length > 0) {    //有子项，才展现父项。 不勾选子项，则不保存父项。
          if (!this.inArray(res[k], data)) {
            data.unshift(res[k]);
          }
        }
      }
    }
    // console.log(data)
    if (status === "add") {
      this._modelDOMSData[key] = data;
    } else if (status === "edit") {
      this.modelDOMSData[key] = data;
    }
    // }
  }

  inArray(search: string, array: Array<string>) {
    for (let i in array) {
      if (array[i] === search) {
        return true;
      }
    }
    return false;
  }

  setNullData(data) {
    for (const key in data) {
      if (Array.isArray(data[key])) {
        if (data[key] && data[key].length > 0) {
          data[key] = null;
        }
      }
    }
  }

  /**
   * 不使用 提交按钮，通过监听组件事件提交表单数据
   *
   * @memberof ResponsiveModelComponent
   */
  commitData() {
    if (!this.submitBtnNeed) {  //不需要提交按钮
      this.eventListenerSubmit = true;
      if (this.btnType === "new") {
        this.onSubmit(this._modelDOMSData);
      } else {
        this.onSubmit(this.modelDOMSData);
      }
    }
  }

  /**
   * 筛选出对应的name 赋值bindData
   */
  setSelectOptions(key, data) {
    let doms = this.modelDOMS;
    for (let i = doms.length - 1; i >= 0; i--) {
      for (let j = doms[i].childrens.length - 1; j >= 0; j--) {
        if (doms[i].childrens[j].name === key) {
          doms[i].childrens[j].bindData = data;
        }
      }
    }
  }

  /**
   * 记录，验证错误信息
   *
   * @param {any} e
   * @param {any} key
   * @memberof ResponsiveModelComponent
   */
  storeErrData(e, key) {
    //对三级联动地区组件的特殊处理
    if (Array.isArray(e)) {
      for (const key1 in e) {
        if (e[key1] === "必选") {
          this._errData[key] = "必选";
          return false;
        }
      }
      this._errData[key] = "";

    } else {
      this._errData[key] = e;
    }
  }


  /**
   * 将需要特殊处理的有管道的input控件，的key存储起来，
   * 
   * @param {any} pipe 
   * @param {any} key
   * @memberof ResponsiveModelComponent
   */
  addDispose(pipe, key) {
    if (pipe && (pipe === "HtmlPipe.InterestRate" || pipe === "HtmlPipe.TenThousandKM" || pipe === "HtmlPipe.TenThousandElement")) {
      let pipeArray = this.inputKeyDisposeArray;  //this.inputKeyDisposeArray
      if (pipeArray.indexOf(key) == -1) {
        pipeArray.push(key);
        this.inputDisposeArray.push({ 'key': key, 'pipe': pipe });

        setTimeout(() => {
          if (this.btnType !== 'new') {  //修改状态下
            if (pipe === "HtmlPipe.InterestRate") {
              this.modelDOMSData[key] *= 100;
            } else if (pipe === "HtmlPipe.TenThousandKM") {
              this.modelDOMSData[key] /= 10000;
            } else if (pipe === "HtmlPipe.TenThousandElement") {
              this.modelDOMSData[key] /= 10000;
            }
          }
        }, 0);

      }
    }
  }

  /**
   * 添加,控件的事件处理
   * 
   * @param {any} event 
   * @memberof ResponsiveModelComponent
   */
  addEventHandlings(event, key) {

    if (event && event.length > 0) {
      // console.log(event)
      //判断是否重复添加。 
      let eventHandingsArray = this.eventHandingsArray;
      let repeatToAdd = false;
      if (eventHandingsArray.length > 0) {
        for (const k in eventHandingsArray) {
          if (eventHandingsArray[k]['triggerKey'] == key) {
            repeatToAdd = true;
            break;
          }
        }
      }
      //非重复添加，可以继续添加 
      if (!repeatToAdd) {
        // console.log('继续');
        let eventHanding = "";
        let relevancyKey = [];   //relevancyKey  触发事件的控件

        event.forEach(e1 => {
          if (e1['bracketsLogic'] && e1['bracketsLogic'].length > 0) {
            e1['bracketsLogic'].forEach(e2 => {

              if (e2['type'] == 'ConditionType.()') {
                if (e2['relationsLogic'] && e2['relationsLogic'].length > 0) {

                  // eventHanding = "@" + eventHanding;
                  e2['relationsLogic'].forEach((e3, index3) => {
                    if (e3['type'] == "ConditionType.RelationalExpression") {

                      let domName = e3['relations']['dom'];
                      if (relevancyKey.indexOf(domName) == -1) {
                        relevancyKey.push(domName);
                      }

                      let e3Relations2 = e3['relations']['relations'].split('.');
                      e3Relations2[1] = e3Relations2[1].replace('=', '==');   //将=修改为 == 
                      e3['relations']['value'] = e3['relations']['value'].trim();  //将返回值的前后空格去除;

                      let bracket;
                      if (index3 == 0) {  //多级表达式括号
                        bracket = "((";
                      } else {
                        bracket = "(";
                      }

                      eventHanding += bracket + "'" + domName + "'" + e3Relations2[1] + "'" + e3['relations']['value'] + "'" + ")";
                    } else if (e3['type'] == "ConditionType.LogicalOperator") {
                      let e3Logic = e3['logic'].split('.');
                      eventHanding += e3Logic[1];
                    }
                  })

                  eventHanding = eventHanding + ")";
                }
              } else if (e2['type'] == "ConditionType.LogicalOperator") {
                let e2Logic = e2['logic'].split('.');
                eventHanding += e2Logic[1];
              }
            });
          }
        });
        // console.log(eventHanding)
        // triggerKey 被触发事件的控件。  //relevancyKey  触发事件的控件  //eventHanding 事件触发的条件
        this.eventHandingsArray.push({ 'triggerKey': key, 'relevancyKey': relevancyKey, 'eventHanding': eventHanding });
        // console.log(this.eventHandingsArray);
      }

    }
  }


  /**
   * chebox组件修改事件
   * 
   * @param {any} keyName  被触发事件的dom的key
   * @param {any} $event   当前值
   * @param {any} dts      用于修改事件的dom的父级的数据
   * @memberof ResponsiveModelComponent
   */
  checkboxChange(keyName, $event, dts) {
    this.eventHandling(keyName, $event, dts);
  }

  /**
   * 对触发事件的处理
   * 
   * @param {any} keyName 
   * @param {any} $event 
   * @param {any} dts 
   * @memberof ResponsiveModelComponent
   */
  eventHandling(keyName, $event, dts) {
    // 默认，没有"同一个dom"  " 有2个值" 使用 "并且"的情况  ( 与或非表达式中，并没有一个值 可以 同时等于2个值 )

    let eventHandingsArray = this.eventHandingsArray;
    if (eventHandingsArray.length > 0) {
      eventHandingsArray.forEach(element => {
        if (element['relevancyKey'].indexOf(keyName) !== -1) {  //该控件，有需要处理的事件
          //使用当前控件的值，对 触发事件的 条件进行处理。
          let that = this;

          if (Array.isArray($event)) {  //多选 （例如:select多选）
            $event.forEach(e => {

              let eventHandingString = element['eventHanding'];
              element['relevancyKey'].forEach(relevancyKey => {
                if (relevancyKey.indexOf(keyName) !== -1) {
                  eventHandingString = eventHandingString.replace(new RegExp("'" + keyName + "'", 'g'), "'" + e + "'");
                } else {
                  eventHandingString = eventHandingString.replace(new RegExp("'" + relevancyKey + "'", 'g'), "'" + this._modelDOMSData[relevancyKey] + "'");
                }
              });
              let res = eval(eventHandingString);
              dts.forEach(dt => {
                if (dt.name == element['triggerKey']) {
                  dt.ui.hidden = !res;
                }
              });

            })
          } else {  //单选（例如:select单选,checkbox）

            if ($event !== null) {
              $event = $event.toString();  //将布尔值转换为字符串。
            }
            let res = eval(element['eventHanding'].replace(new RegExp("'" + keyName + "'", 'g'), "'" + $event + "'", '$event'));
            dts.forEach(dt => {
              if (dt.name == element['triggerKey']) {
                dt.ui.hidden = !res;
              }
            });
          }
        }
      });
    }
  }

}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    MdInputModule,
    MdSelectModule,
    MdDatepickerModule,
    MdButtonModule,
    ChipModule,
    CheckboxModule,
    RadioModule,
    TimiFileUploaderModule,
    TimiInputModule,
    TimiChipModule,
    TimiTextareaModule,
    TimiCheckboxModule,
    TimiSelectModule,
    DynamicDomsModule,
    RegionModule,
    CalendarModule,
    // NewComponentModule,
    SharedPipeModule,
    UEditorModule.forRoot({
      path: "assets/ueditor/",
      options: {
        themePath: "/assets/ueditor/themes/"
      },
      // hook: (UE: any): void => {
      //   UE.registerUI("button", function (editor, uiName) {
      //     //注册按钮执行时的command命令，使用命令默认就会带有回退操作
      //     editor.registerCommand(uiName, {
      //       execCommand: function () {
      //         console.log(uiName);
      //       }
      //     });
      //     //创建一个button
      //     let btn = new UE.ui.Button({
      //       //按钮的名字
      //       name: uiName,
      //       //提示
      //       title: "上传图片",
      //       //添加额外样式，指定icon图标，这里默认使用一个重复的icon
      //       cssRules: "background-position: -380px 0;",
      //       getHtmlTpl: function () {
      //         return `<div id="##" class="edui-box %%">
      //         <div '+ (this.title ? 'title="' + this.title + '"' : '') +' id="##_state" stateful><div class="%%-body">
      //         <div id="##_button_body" class="edui-box edui-button-body" onclick="$$.onclick(event, this);">
      //         <div class="edui-box edui-icon">
      //         <input type="file" accept="image/*" style="width:20px;height:20px;position:absolute;top:0;left:0;opacity:0;" onchange="$$.onupload(this, event);">
      //         </div>
      //         </div>
      //         </div></div></div>`;
      //       },
      //       //点击时执行的命令
      //       onclick: function () {
      //         //这里可以不用执行命令,做你自己的操作也可
      //         // editor.execCommand(uiName);
      //       },
      //       onupload: function (this, event) {
      //           console.log(event);
      //           let formData = new FormData();
      //           formData.append("file", event.files[0]);
      //           let xhr = new XMLHttpRequest();
      //           let timestamp = (new Date().getTime()).toString().substr(0, 10);
      //           let sign =  Md5.hashStr(timestamp + globalUrl.private_key).toString();
      //           xhr.open("POST", "http://api2.cpf360.com/api/file/upload");
      //           xhr.setRequestHeader("timestamp", timestamp);
      //           xhr.setRequestHeader("sign", sign);
      //           xhr.setRequestHeader("type", "WithPath");
      //           xhr.onreadystatechange = function () {
      //             if (xhr.readyState === 4 && xhr.status === 200) {
      //               let data = JSON.parse(xhr.responseText);
      //               if (data.code === "0") {
      //                 editor.focus();
      //                 editor.execCommand("inserthtml", `<img class="imgloadding" src="${data.data[0].path}">`);
      //                 event.value = "";
      //               }
      //             }
      //           };
      //           xhr.send(formData);
      //       }
      //     });
      //     //当点到编辑内容上时，按钮要做的状态反射
      //     editor.addListener("selectionchange", function () {
      //       let state = editor.queryCommandState(uiName);
      //       if (state === -1) {
      //         btn.setDisabled(true);
      //         btn.setChecked(false);
      //       } else {
      //         btn.setDisabled(false);
      //         btn.setChecked(state);
      //       }
      //     });
      //     //因为你是添加button,所以需要返回这个button
      //     return btn;
      //   });
      // }
    })
  ],
  declarations: [ResponsiveModelComponent],
  providers: [],
  exports: [ResponsiveModelComponent]
})

export class ResponsiveModelModule {
}
