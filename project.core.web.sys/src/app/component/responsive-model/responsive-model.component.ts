import {Component, EventEmitter, Input, NgModule, OnInit, Output, ElementRef, ViewChild} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MdButtonModule, MdDatepickerModule, MdInputModule, MdSelectModule} from "@angular/material";
import {ButtonModule} from "../button/button.directive";
import {ChipModule} from "../chip/chip.component";
import {RadioModule} from "../radio/radio.component";
import {CheckboxModule} from "../checkbox/checkbox.component";
import {TimiFileUploaderModule} from "../timi-ng2-file-uploader/timi-ng2-file-uploader.component";
import {TimiInputModule} from "../timi-input/timi-input.component";
import {TimiChipModule} from "../timi-chip/chip.component";
import {TimiTextareaModule} from "../timi-textarea/timi-textarea.component";
import {TimiCheckboxModule} from "../timi-checkbox/timi-checkbox.component";
import {TimiSelectModule} from "../timi-select/select.component";
import {BaseService} from "../../services/base.service";
import {DynamicDomsModule} from "../dynamic-doms/dynamic-doms.component";
import {NewComponentModule} from "app/newcomponent/newcomponent.module";
import {RegionComponent} from "app/newcomponent/region/region.component";
import {UEditorModule} from "ngx-ueditor";
import {globalUrl} from "../../common/global.config";
import {Md5} from "ts-md5/dist/md5";
import {SharedPipeModule} from "../shared-pipe/shared-pipe.module";
import {forEach} from "@angular/router/src/utils/collection";

@Component({
  selector: "timi-responsive-form",
  templateUrl: "./responsive-model.component.html",
  styleUrls: ["./responsive-model.component.scss"],
})

export class ResponsiveModelComponent implements OnInit {

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
    value.forEach(item => {
      item.childrens.forEach(i => {
        this._modelDOMSData[i.name] = i.value;
      });
    });
  }

  get modelDOMS() {
    return this._modelDOMS;
  }


  @Input() btnType; //按钮类型
  @Input() btnValue; //确定按钮显示的文字
  @Input() modelDOMSData = {}; //需要修改的原数据

  @Output() backClick: EventEmitter<any> = new EventEmitter();
  @Output() ngSubmit: EventEmitter<any> = new EventEmitter();

  @ViewChild('form') formDiv: ElementRef;

  constructor(private baseService: BaseService, private er: ElementRef) {
  }

  ngOnInit() {
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
    //  显示错误提示
    let errs = this.er.nativeElement.getElementsByClassName("ng-valid");
    for (let errItem in errs) {
      if (errs[errItem]) {
        let className = errs[errItem].className;
        if (errs[errItem].className) {
          errs[errItem].className = errs[errItem].className.replace("ng-pristine", "ng-dirty");
        }
      }
    }

    //如果有错误，则停止提交
    let errData = this._errData;
    for (let i in errData) {
      if (errData[i]) {
        return false;   //如果有错误，则停止提交
      }
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
    if (cmds) {
      let param = {};
      param["data"] = data;
      param["cmds"] = cmds;
      this.ngSubmit.emit(param);
    } else {
      this.ngSubmit.emit(data);
    }

  }

  //通过basic.logo 获取 basic._logo的值
  displayLogoFun(value, data) {
    let key = value.split(".");
    if(key.length == 1){
      return data[key[0]];
    }
    return data[key[0]]["_" + key[1]];
  }

  vertifyFun(vertify, data, required, displayMsg, key) {
    let msg;
    if (data && data.length > 0) {
      if (vertify && vertify.length > 0) { //如果有正则
        let reg;
        vertify.forEach(item => {
          reg = new RegExp(item.regular);
          if (!reg.test(data)) {  //匹配错误，显示error
            msg = item.message;
            this._errData[key] = msg;
            return false;
          }
        });
      }
    } else {
      // if (required) {
      //   msg = displayMsg;
      // }
      if (required) {
        if(!data){
          if(data === 0){   //填0的情况是可以的
            return "";
          }else{
            msg = displayMsg;
          }
          
        }
      }
    }
    this._errData[key] = msg;
    return msg;
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
  selectChange($event, option) {
    // if (!$event) {
    //   return false;
    // }
    if (option) {
      let that = this;
      for (let i = option.length - 1; i >= 0; i--) {
        let config = {};
        for (let j = option[i].bindParamFields.length - 1; j >= 0; j--) {

          let receiveKey = option[i].bindParamFields[j];
          if(receiveKey.indexOf(".") !== -1){  //key 的形式 可能key是basic.type的形式 
            let postKey;
            postKey = receiveKey.split(".");
            //增加产品时， 贷款类型，勾选以后再取消， this.modelDOMSData为空。
            config[receiveKey] = this._modelDOMSData[receiveKey] || (this.modelDOMSData[postKey[0]] ? this.modelDOMSData[postKey[0]][postKey[1]] : this.modelDOMSData[postKey[0]]);   
          }else{          //key 的形式是正常的形式。eg：id
            config[receiveKey] = this._modelDOMSData[receiveKey] || this.modelDOMSData[receiveKey];
          }
          
          // config[option[i].bindParamFields[j]] = this._modelDOMSData[option[i].bindParamFields[j]] || this.modelDOMSData[option[i].bindParamFields[j]];
        }
        if (!option[i].triggerUrl) {
          return false;
        }
        this.baseService.get("/api/" + option[i].triggerUrl, config).subscribe(r => {
          if (r.code === "0") {
            if (r.data && r.data.length > 0) {
              if (this.modelDOMSData[option[i].triggerDom] !== undefined) {      // 修改页面

                if (this.modelDOMSData[option[i].triggerDom]) {                                 //修改页面---修改状态(在新增第一个以后)
                  if (this.modelDOMSData[option[i].triggerDom].length > 0) {
                    this.judgeSetChangeData(r.data, option[i].triggerDom, 'edit', function () {
                      let empty = false;
                      let num = 0;
                      for (let k = r.data.length - 1; k >= 0; k--) {
                        for (let j = that.modelDOMSData[option[i].triggerDom].length - 1; j >= 0; j--) {
                          if (r.data[k]['value'] == that.modelDOMSData[option[i].triggerDom][j]) {
                            num++;
                          }
                        }
                      }
                      if (num !== that.modelDOMSData[option[i].triggerDom].length) {
                        that.modelDOMSData[option[i].triggerDom] = r.data;
                      }
                    });

                  } else {                                                                    //修改页面---修改状态----修改删除以后再次添加
                    this.judgeSetChangeData(r.data, option[i].triggerDom, 'edit', '');
                  }
                } else if (this.modelDOMSData[option[i].triggerDom] === null) {                 //修改页面---新增状态(新增第一个时)
                  this.judgeSetChangeData(r.data, option[i].triggerDom, 'edit', '');
                }

              } else {                                                       //新增页面
                this.judgeSetChangeData(r.data, option[i].triggerDom, 'add', function () {
                  // that._modelDOMSData[option[i].triggerDom] = r.data;    //暂时不影响功能使用
                })
              }
            } else {      //都不勾选以后，发送null
              //新增页面-数据
              this._modelDOMSData[option[i].triggerDom] = null;
              // this.setNullData(this._modelDOMSData);    //方法的使用，清空一级附件组时，清空清空二级附件项的展示数据   //暂时使用手动清空二级附件项的展示数据，

              //修改页面-数据
              if (this.modelDOMSData[option[i].triggerDom]) {
                this.modelDOMSData[option[i].triggerDom] = null;
                this.setNullData(this.modelDOMSData);
              }
            }
            this.setSelectOptions(option[i].triggerDom, r.data);
          }
        });
      }
    }
  }


  judgeSetChangeData(res, key, status, back) {
    if (res[0]['id']) {
      this.setChangeData(status, key, res);
    } else {
      typeof back == 'function' ? back() : "";
    }
  }

  setChangeData(status, key, res) {
    let data = [];
    for (let k = res.length - 1; k >= 0; k--) {
      for (const j in res[k]) {
        if (Array.isArray(res[k][j]) && res[k][j].length > 0) {
          data.unshift(res[k]);
        }
      }
    }
    if (status === 'add') {
      this._modelDOMSData[key] = data;
    } else if (status === 'edit') {
      this.modelDOMSData[key] = data;
    }
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
    NewComponentModule,
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
  providers: [RegionComponent],
  exports: [ResponsiveModelComponent]
})

export class ResponsiveModelModule {
}
