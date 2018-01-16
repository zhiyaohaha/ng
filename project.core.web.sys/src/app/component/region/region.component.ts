import { Component, OnInit, AfterViewInit, ViewChildren, QueryList, forwardRef, Input } from "@angular/core";
import { RegionService } from "../../services/region/region.service";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { TimiSelectModule } from "../timi-select/select.component";
export const REGION_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => RegionComponent),
  multi: true
};

@Component({
  selector: "free-region",
  templateUrl: "./region.component.html",
  styleUrls: ["./region.component.scss"],
  providers: [REGION_VALUE_ACCESSOR]
})
export class RegionComponent implements OnInit, AfterViewInit, ControlValueAccessor {

  @ViewChildren("province") provinceChild: QueryList<RegionComponent>;
  //@Output("getArr") getArr = new EventEmitter<any>();

  result: any; //获取data
  checked: boolean = false; //给data增加checked字段
  provinceList: Array<any> = []; //全选时的element

  isShowBox: boolean = true;

  allCheckedState: string; //是否全选 "all" or ""

  //用于处理跨级点击时的数据处理
  provinceArr: Array<any> = [];
  cityArr: Array<any> = [];
  countyArr: Array<any> = [];

  //副本省市区数组，用于处理规定数据
  duplicatesProvinceArr: Array<any> = [];
  duplicatesCityArr: Array<any> = [];
  duplicatesCountyArr: Array<any> = [];
  lastChecked: Array<any> = []; //最后的选中传值数组

  @Input() multiple: boolean; //是否多选
  multipleFalseData: any = [];  //非多选情况下，使用的三级联动地区数据
  multipleFalseCityData: any = [];
  multipleFalseCountyData: any = [];
  modifiedData: any = [];  //修改状态下，用于修改的数据；
  @Input() inputData: any;  //修改状态下，用于展示的数据
  resCheckedAll: boolean; //根据返回结果判断是否进行全选。

  fun(val) {
    // console.log(val)
  }

  private valueChange = (_: any) => {
  };

  constructor(private regionService: RegionService) {
  }

  ngOnInit() {
    // console.log(2222)
    this.regionService.getData().subscribe(result => {
      // console.log(this.modifiedData)
      this.setData(result);
      if (!this.multiple) { //非多选的情况下
        this.multipleFalseFun(result);
      }
    })
  }

  ngAfterViewInit() {
    this.provinceChild.changes.subscribe(data => data._results.forEach(e => this.provinceList.push(e.nativeElement)));
  }

  //获取数据并处理
  setData(result) {
    if (!this.modifiedData) {  //新增状态下
      for (let i = 0; i < result.length; i++) {
        result[i].checked = false;
        for (let j = 0; j < result[i].c.length; j++) {
          result[i].c[j].checked = false;
          for (let l = 0; l < result[i].c[j].c.length; l++) {
            result[i].c[j].c[l].checked = false;
          }
        }
      }
    } else {  //修改状态下

      for (let i = 0; i < result.length; i++) {
        // result[i].checked = false;
        this.setInputChecked(result[i], '1');

        for (let j = 0; j < result[i].c.length; j++) {
          // result[i].c[j].checked = false;
          this.setInputChecked(result[i].c[j], '2');

          for (let l = 0; l < result[i].c[j].c.length; l++) {
            // result[i].c[j].c[l].checked= false;
            this.setInputChecked(result[i].c[j].c[l], '3');
          }
        }
      }
      // console.log(result)
    }

    this.result = result;
    // console.log(this.result, "获取的data数据");
  }

  //根据 输入的值，修改view 每个input的checked状态   (同时循环json数据源result和输入数据inputData)
  setInputChecked(data, level) {
    data.checked = false;   //每一项的checked字段
    let inputData = this.inputData;  //输入，用于展示的字段

    switch (level) {
      case '1':
        for (let key in inputData) {
          if (key == data.a) {
            data.checked = true;
          }
        };
        break;
      case '2':
        for (let key in inputData) {
          for (let key2 in inputData[key]) {
            if (key2 == data.a) {
              data.checked = true;
            }
          }
        };
        break;
      case '3':
        for (let key in inputData) {
          for (let key2 in inputData[key]) {
            for (let key3 in inputData[key][key2]) {
              if (inputData[key][key2][key3] == data.a) {
                data.checked = true;
              }
            }
          }
        };
        break;
    }
  }


  //判断元素是否在数组中
  inArray(search: string, array: Array<string>) {
    for (let i in array) {
      if (array[i] === search) {
        return true;
      }
    }
    return false;
  }

  //删除数组中的特定元素
  removeByValue(arr, value) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === value) {
        arr.splice(i, 1);
        break;
      }
    }
  }

  //省
  getProvince(e, province, i) {
    let provinceId = this.result[i].a;
    let isInArray = this.inArray(provinceId, this.provinceArr);
    let cityAllArray = [];
    let countyAllArray = [];
    let duplicatesCityArray = this.cityArr.concat();
    let duplicatesCountyArray = this.countyArr.concat();
    if (province.checked && !isInArray) {
      this.result[i].checked = true;
      this.provinceArr.push(provinceId);
      this.duplicatesProvinceArr.push(provinceId);
    } else if (!province.checked && isInArray) {
      this.result[i].checked = false;

      for (let j = 0; j < this.result[i].c.length; j++) {
        this.result[i].c[j].checked = false;
        cityAllArray.push(this.result[i].c[j].a);
        for (let n = 0; n < this.result[i].c[j].c.length; n++) {
          this.result[i].c[j].c[n].checked = false;
          countyAllArray.push(this.result[i].c[j].c[n].a);
        }
      }

      //删除省级
      this.removeByValue(this.provinceArr, provinceId);
      this.removeByValue(this.duplicatesProvinceArr, provinceId);
      //删除市级
      for (let i = 0; i < duplicatesCityArray.length; i++) {
        let isInArray = this.inArray(duplicatesCityArray[i], cityAllArray);
        if (isInArray) {
          this.removeByValue(this.cityArr, duplicatesCityArray[i]);
          this.removeByValue(this.duplicatesCityArr, duplicatesCityArray[i])
        }
      }
      //删除县级
      for (let i = 0; i < duplicatesCountyArray.length; i++) {
        let isInArray = this.inArray(duplicatesCountyArray[i], countyAllArray);
        if (isInArray) {
          this.removeByValue(this.countyArr, duplicatesCountyArray[i]);
          this.removeByValue(this.duplicatesCountyArr, duplicatesCountyArray[i])
        }
      }

    }

    this.onSubmit(this.allCheckedState);

  }

  //市
  getCity(e, province, city, i, j) {
    let provinceId = this.result[i].a;
    let cityId = this.result[i].c[j].a;
    let isInArray = this.inArray(cityId, this.cityArr);
    let countyAllArray = [];
    let duplicatesCountyArray = this.countyArr.concat();

    if (city.checked && !isInArray) {
      this.result[i].c[j].checked = true;
      this.cityArr.push(this.result[i].c[j].a);
      this.duplicatesCityArr.push(this.result[i].c[j].a);
      this.removeByValue(this.duplicatesProvinceArr, provinceId);
    } else if (!city.checked && isInArray) {
      this.result[i].c[j].checked = false;
      if (!this.inArray(provinceId, this.duplicatesProvinceArr)) { //避免添加重复的id
        this.duplicatesProvinceArr.push(provinceId);
      }


      for (let n = 0; n < this.result[i].c[j].c.length; n++) {
        this.result[i].c[j].c[n].checked = false;
        countyAllArray.push(this.result[i].c[j].c[n].a);
      }

      //删除市
      this.removeByValue(this.cityArr, cityId);
      this.removeByValue(this.duplicatesCityArr, cityId);
      //删除县
      for (let i = 0; i < duplicatesCountyArray.length; i++) {
        let isInArray = this.inArray(duplicatesCountyArray[i], countyAllArray);
        if (isInArray) {
          this.removeByValue(this.countyArr, duplicatesCountyArray[i]);
          this.removeByValue(this.duplicatesCountyArr, duplicatesCountyArray[i]);
        }
      }

    }
    this.onSubmit(this.allCheckedState);
  }

  //区
  getCounty(e, county, i, j, l) {
    let cityId = this.result[i].c[j].a;
    let countyId = this.result[i].c[j].c[l].a;
    let isInArray = this.inArray(countyId, this.countyArr);
    let duplicatesCountyArray = this.countyArr.concat();

    if (county.checked && !isInArray) {
      this.result[i].c[j].c[l].checked = true;
      this.countyArr.push(this.result[i].c[j].c[l].a);
      this.duplicatesCountyArr.push(this.result[i].c[j].c[l].a);
      this.removeByValue(this.duplicatesCityArr, cityId);
    } else if (!county.checked && isInArray) {
      this.result[i].c[j].c[l].checked = false;
      this.removeByValue(this.countyArr, countyId);
      this.removeByValue(this.duplicatesCountyArr, countyId);
      if (!this.inArray(cityId, this.duplicatesCityArr)) {  //避免添加重复的id
        this.duplicatesCityArr.push(cityId);
      }

    }
    this.onSubmit(this.allCheckedState);
  }

  //实现全选
  allChecked(e, checkedAll) {
    if (checkedAll.checked) {
      //选择全国时,隐藏省市区
      this.isShowBox = false;
      // for (let i = 0; i < this.provinceList.length; i++) {
      //   this.provinceList[i].checked = true;
      // }

      //选择全国时,取消之前选择的单个省/市/区信息
      let result = this.result;
      if (result) {
        for (let i = 0; i < result.length; i++) {
          result[i].checked = false;

          for (let j = 0; j < result[i].c.length; j++) {
            result[i].c[j].checked = false;

            for (let l = 0; l < result[i].c[j].c.length; l++) {
              result[i].c[j].c[l].checked = false;
            }
          }
        }
      }
      this.allCheckedState = "all";
    } else {
      this.isShowBox = true;
      for (let i = 0; i < this.provinceList.length; i++) {
        this.provinceList[i].checked = false;
      }
      this.allCheckedState = "";
    }
    this.onSubmit(this.allCheckedState);
  }

  writeValue(obj: any): void {
    if (obj) {
      this.modifiedData = obj;
      let inputData = this.inputData;
      // console.log(inputData)
      //将inputdata 的值，经过  obj 的筛选。push到三级数组里面。
      for (let key in inputData) {
        if (key == 'All') {  //选择的是全国的
          this.resCheckedAll = true;
          this.allChecked({}, { 'checked': true });
          return;
        }
        this.objFilterInputDataPushArr(key, obj, this.duplicatesProvinceArr, this.provinceArr)

        for (let key2 in inputData[key]) {
          this.objFilterInputDataPushArr(key2, obj, this.duplicatesCityArr, this.cityArr)

          for (let key3 in inputData[key][key2]) {
            this.objFilterInputDataPushArr(inputData[key][key2][key3], obj, this.duplicatesCountyArr, this.countyArr)
          }
        }
      }

    }

  }

  //将inputdata 的值，经过  obj 的筛选。push到三级数组里面。
  objFilterInputDataPushArr(key, obj, arr, arr2) {
    arr2.push(key);   //用于跨级删除。
    for (let key11 in obj) {
      if (key == obj[key11]) {
        arr.push(key);
      }
    }
  }

  registerOnChange(fn: any): void {
    this.valueChange = fn;
  }

  registerOnTouched(fn: any): void {

  }


  onSubmit(checkedAll) {
    this.lastChecked = this.duplicatesProvinceArr.concat(this.duplicatesCityArr, this.duplicatesCountyArr);
    // console.log(this.lastChecked);
    // console.log(checkedAll)
    if (checkedAll) {
      this.valueChange(["All"]);
    } else {
      this.valueChange(this.lastChecked);
    }
  }

  ///三级地区联动，不多选的情况下 :

  //将返回结果，修改为timi-select 可以直接使用的格式
  multipleFalseFun(res) {
    // console.log(res)
    let _self = this;
    if (res) {
      res.forEach((item1, index1) => {
        _self.multipleFalseData[index1] = { 'text': item1.b, 'value': item1.a, 'childrens': item1.c };

        _self.multipleFalseData[index1]['childrens'].forEach((item2, index2) => {
          _self.multipleFalseData[index1]['childrens'][index2] = { 'text': item2.b, 'value': item2.a, 'childrens': item2.c };

          _self.multipleFalseData[index1]['childrens'][index2]['childrens'].forEach((item3, index3) => {
            _self.multipleFalseData[index1]['childrens'][index2]['childrens'][index3] = { 'text': item3.b, 'value': item3.a };
          })
        })

      })
      //  console.log(_self.multipleFalseData)
    }
  }

  //通过这一级的val。设置下一级的数据源
  changeMultipleFalseData(provinceCode, data) {
    let _self = this;
    let res = data ? data : _self.multipleFalseData;

    res.forEach((item1, index1) => {
      if (item1.value == provinceCode) {
        if (!data) {
          _self.multipleFalseCityData = item1.childrens;
        } else {

          _self.multipleFalseCountyData = item1.childrens;
        }
        return false;
      }
    })
  }
}
