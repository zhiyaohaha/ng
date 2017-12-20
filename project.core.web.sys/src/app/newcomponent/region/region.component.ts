import {Component, OnInit, AfterViewInit, ViewChildren, QueryList, forwardRef} from "@angular/core";
import {RegionService} from "../../services/region/region.service";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

export const REGION_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => RegionComponent),
  multi: true
};

@Component({
  selector: "free-region",
  templateUrl: "./region.component.html",
  styleUrls: ["./region.component.css"],
  providers: [REGION_VALUE_ACCESSOR]
})
export class RegionComponent implements OnInit, AfterViewInit, ControlValueAccessor {

  @ViewChildren("province") provinceChild: QueryList<RegionComponent>;
  //@Output("getArr") getArr = new EventEmitter<any>();

  result: any; //获取data
  checked: boolean = false; //给data增加checked字段
  provinceList: Array<any> = []; //全选时的element

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

  private valueChange = (_: any) => {
  };

  constructor(private regionService: RegionService) {
  }

  ngOnInit() {
    this.regionService.getData().subscribe(result => {
      this.setData(result);
    })
  }

  ngAfterViewInit() {
    this.provinceChild.changes.subscribe(data => data._results.forEach(e => this.provinceList.push(e.nativeElement)));
  }

  //获取数据并处理
  setData(result) {
    for (let i = 0; i < result.length; i++) {
      result[i].checked = false;
      for (let j = 0; j < result[i].c.length; j++) {
        result[i].c[j].checked = false;
        for (let l = 0; l < result[i].c[j].c.length; l++) {
          result[i].c[j].c[l].checked = false;
        }
      }
    }
    this.result = result;
    console.log(this.result, "获取的data数据");
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
      this.duplicatesProvinceArr.push(provinceId);

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

    if (county.checked && !isInArray) {
      this.result[i].c[j].c[l].checked = true;
      this.countyArr.push(this.result[i].c[j].c[l].a);
      this.duplicatesCountyArr.push(this.result[i].c[j].c[l].a);
      this.removeByValue(this.duplicatesCityArr, cityId);
    } else if (!county.checked && isInArray) {
      this.result[i].c[j].c[l].checked = false;
      this.removeByValue(this.countyArr, countyId);
      this.removeByValue(this.duplicatesCountyArr, countyId);
    }
    this.onSubmit(this.allCheckedState);
  }

  //实现全选
  allChecked(e, checkedAll) {
    if (checkedAll.checked) {
      for (let i = 0; i < this.provinceList.length; i++) {
        this.provinceList[i].checked = true;
      }
      this.allCheckedState = "all";
    } else {
      for (let i = 0; i < this.provinceList.length; i++) {
        this.provinceList[i].checked = false;
      }
      this.allCheckedState = "";
    }

  }

  writeValue(obj: any): void {
  }

  registerOnChange(fn: any): void {
    this.valueChange = fn;
  }

  registerOnTouched(fn: any): void {

  }


  onSubmit(checkedAll) {
    this.lastChecked = this.duplicatesProvinceArr.concat(this.duplicatesCityArr, this.duplicatesCountyArr);
    if (checkedAll) {
      this.valueChange("all");
    } else {
      this.valueChange(this.lastChecked);
    }
  }

}