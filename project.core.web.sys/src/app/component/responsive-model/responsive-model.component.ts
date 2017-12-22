import {Component, EventEmitter, Input, NgModule, OnInit, Output} from "@angular/core";
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

  constructor(private baseService: BaseService) {
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
  onSubmit($event) {
    //console.log($event)
    this.ngSubmit.emit($event);
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
      for (let i = option.length - 1; i >= 0; i--) {
        let config = {};
        for (let j = option[i].bindParamFields.length - 1; j >= 0; j--) {
          config[option[i].bindParamFields[j]] = this._modelDOMSData[option[i].bindParamFields[j]] || this.modelDOMSData[option[i].bindParamFields[j]];
        }
        if (!option[i].triggerUrl) {
          return false;
        }
        // if (!$event) {
        //   this._modelDOMSData[option[i].triggerDom] = "clear";
        //   return false;
        // }
        this.baseService.get("/api/" + option[i].triggerUrl, config).subscribe(r => {
          if (r.code === "0") {
            if (r.data && r.data.length > 0) {
              this._modelDOMSData[option[i].triggerDom] = r.data;  //附件项数据修改，dynamic组件数据随之修改
            } else {
              this._modelDOMSData[option[i].triggerDom] = "clear";
            }
            this.setSelectOptions(option[i].triggerDom, r.data);
          }
        });
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
    UEditorModule.forRoot({
      path: "assets/ueditor/",
      options: {
        themePath: "/assets/ueditor/themes/"
      },
      hook: (UE: any): void => {
        UE.registerUI("button", function (editor, uiName) {
          //注册按钮执行时的command命令，使用命令默认就会带有回退操作
          editor.registerCommand(uiName, {
            execCommand: function () {
              console.log(uiName);
            }
          });
          //创建一个button
          let btn = new UE.ui.Button({
            //按钮的名字
            name: uiName,
            //提示
            title: "上传图片",
            //添加额外样式，指定icon图标，这里默认使用一个重复的icon
            cssRules: "background-position: -380px 0;",
            getHtmlTpl: function () {
              return `<div id="##" class="edui-box %%">
              <div '+ (this.title ? 'title="' + this.title + '"' : '') +' id="##_state" stateful><div class="%%-body">
              <div id="##_button_body" class="edui-box edui-button-body" onclick="$$.onclick(event, this);">
              <div class="edui-box edui-icon">
              <input type="file" accept="image/*" style="width:20px;height:20px;position:absolute;top:0;left:0;opacity:0;" onchange="$$.onupload(this, event);">
              </div>
              </div>
              </div></div></div>`;
            },
            //点击时执行的命令
            onclick: function () {
              //这里可以不用执行命令,做你自己的操作也可
              // editor.execCommand(uiName);
            },
            onupload: function (this, event) {
                console.log(event);
                let formData = new FormData();
                formData.append("file", event.files[0]);
                let xhr = new XMLHttpRequest();
                let timestamp = (new Date().getTime()).toString().substr(0, 10);
                let sign =  Md5.hashStr(timestamp + globalUrl.private_key).toString();
                xhr.open("POST", "http://api2.cpf360.com/api/file/upload");
                xhr.setRequestHeader("timestamp", timestamp);
                xhr.setRequestHeader("sign", sign);
                xhr.setRequestHeader("type", "WithPath");
                xhr.onreadystatechange = function () {
                  if (xhr.readyState === 4 && xhr.status === 200) {
                    let data = JSON.parse(xhr.responseText);
                    if (data.code === "0") {
                      editor.focus();
                      editor.execCommand("inserthtml", `<img class="imgloadding" src="${data.data[0].path}">`);
                      event.value = "";
                    }
                  }
                };
                xhr.send(formData);
            }
          });
          //当点到编辑内容上时，按钮要做的状态反射
          editor.addListener("selectionchange", function () {
            let state = editor.queryCommandState(uiName);
            if (state === -1) {
              btn.setDisabled(true);
              btn.setChecked(false);
            } else {
              btn.setDisabled(false);
              btn.setChecked(state);
            }
          });
          //因为你是添加button,所以需要返回这个button
          return btn;
        });
      }
    })
  ],
  declarations: [ResponsiveModelComponent],
  providers: [RegionComponent],
  exports: [ResponsiveModelComponent]
})

export class ResponsiveModelModule {
}
