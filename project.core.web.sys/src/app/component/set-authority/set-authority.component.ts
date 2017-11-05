import {Component, Input, NgModule, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";

@Component({
  selector: "app-set-authority",
  templateUrl: "./set-authority.component.html",
  styleUrls: ["./set-authority.component.scss"]
})
export class SetAuthorityComponent implements OnInit {

  menus = [[
    {
      "childrens": null,
      "cascadeDepth": 0,
      "icon": "home",
      "type": "MenuType.CustomizedPage",
      "_type": "定制页",
      "functions": [
        "Home.Brower"
      ],
      "_functions": [
        {
          "menu": "59b4e3e98de9923ab0e189bd",
          "readType": "FunctionReadType.NeedLogined",
          "_readType": "需登陆",
          "type": "FunctionType.Browse",
          "_type": "浏览",
          "url": "",
          "description": null,
          "parentId": null,
          "name": "浏览",
          "code": "Home.Brower",
          "depth": 0,
          "sort": 0,
          "id": "59b4e3ea8de9923ab0e189be",
          "isDelete": false,
          "createdDate": "2017-09-10T15:04:10.0300467+08:00",
          "creater": null,
          "_creater": null,
          "operatedDate": "2017-10-25T15:18:06.4157444+08:00",
          "operater": "common.core.SimpleLoginer",
          "_operater": null
        }
      ],
      "url": "dashboard",
      "hidden": false,
      "disabled": false,
      "description": null,
      "parentId": null,
      "name": "首页",
      "code": "Home",
      "depth": 0,
      "sort": 0,
      "id": "59b4e3e98de9923ab0e189bd",
      "isDelete": false,
      "createdDate": "2017-09-10T15:04:09.0867557+08:00",
      "creater": "59aa3dbffc09232ebc0d6de3",
      "_creater": {
        "id": "59aa3dbffc09232ebc0d6de3",
        "name": "超级管理员",
        "avatar": "http://data.cpf360.com/production/2017/9/3/59ab9704834e451878a773d4.gif",
        "org": null
      },
      "operatedDate": "2017-10-25T15:45:25.2283627+08:00",
      "operater": "common.core.SimpleLoginer",
      "_operater": {
        "id": "59aa3dbffc09232ebc0d6de3",
        "name": "超级管理员",
        "avatar": "http://data.cpf360.com/production/2017/9/3/59ab9704834e451878a773d4.gif",
        "org": null
      }
    }
  ]];

  constructor() { }

  ngOnInit() {
  }

  toggle() {
    console.log(1);
  }

}
