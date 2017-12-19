import { Component, OnInit, ViewChildren, QueryList, } from '@angular/core';
import { RegionService } from '../../services/region/region.service';


@Component({
  selector: 'free-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.css']
})
export class RegionComponent implements OnInit {

  @ViewChildren('province') provinceChild: QueryList<RegionComponent>
  //@Output('getArr') getArr = new EventEmitter<any>();

  result: any;//获取data
  checked: boolean = false;//给data增加checked字段
  provinceList: Array<any> = [];//全选时的element

  //用于处理跨级点击时的数据处理
  provinceArr: Array<any> = [];
  cityArr: Array<any> = [];
  countyArr: Array<any> = [];

  //副本省市区数组，用于处理规定数据
  duplicatesProvinceArr: Array<any> = [];
  duplicatesCityArr: Array<any> = [];
  duplicatesCountyArr: Array<any> = [];
  lastChecked: Array<any> = [];//最后的选中传值数组

  constructor(private regionService: RegionService) { }

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
    console.log(this.result, '获取的data数据');
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
      if (arr[i] == value) {
        arr.splice(i, 1);
        break;
      }
    }
  }

  //省
  getProvince(e, province, i) {
    let provinceId = this.result[i].b;
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
        cityAllArray.push(this.result[i].c[j].b);
        for (let n = 0; n < this.result[i].c[j].c.length; n++) {
          this.result[i].c[j].c[n].checked = false;
          countyAllArray.push(this.result[i].c[j].c[n].b);
        }
      }

      //删除省级
      this.removeByValue(this.provinceArr, provinceId);
      this.removeByValue(this.duplicatesProvinceArr, provinceId);
      //删除市级
      for (let i = 0; i < duplicatesCityArray.length; i++) {
        let isInArray = this.inArray(duplicatesCityArray[i], cityAllArray)
        if (isInArray) {
          this.removeByValue(this.cityArr, duplicatesCityArray[i])
          this.removeByValue(this.duplicatesCityArr, duplicatesCityArray[i])
        }
      }
      //删除县级
      for (let i = 0; i < duplicatesCountyArray.length; i++) {
        let isInArray = this.inArray(duplicatesCountyArray[i], countyAllArray)
        if (isInArray) {
          this.removeByValue(this.countyArr, duplicatesCountyArray[i])
          this.removeByValue(this.duplicatesCountyArr, duplicatesCountyArray[i])
        }
      }

    }

  }
  //市
  getCity(e, province, city, i, j) {
    let provinceId = this.result[i].b;
    let cityId = this.result[i].c[j].b;
    let isInArray = this.inArray(cityId, this.cityArr);
    let countyAllArray = [];
    let duplicatesCountyArray = this.countyArr.concat();

    if (city.checked && !isInArray) {
      this.result[i].c[j].checked = true;
      this.cityArr.push(this.result[i].c[j].b);
      this.duplicatesCityArr.push(this.result[i].c[j].b);
      this.removeByValue(this.duplicatesProvinceArr, provinceId);
    } else if (!city.checked && isInArray) {
      this.result[i].c[j].checked = false;

      for (let n = 0; n < this.result[i].c[j].c.length; n++) {
        this.result[i].c[j].c[n].checked = false;
        countyAllArray.push(this.result[i].c[j].c[n].b);
      }

      //删除市
      this.removeByValue(this.cityArr, cityId);
      this.removeByValue(this.duplicatesCityArr, cityId);
      //删除县
      for (let i = 0; i < duplicatesCountyArray.length; i++) {
        let isInArray = this.inArray(duplicatesCountyArray[i], countyAllArray)
        if (isInArray) {
          this.removeByValue(this.countyArr, duplicatesCountyArray[i]);
          this.removeByValue(this.duplicatesCountyArr, duplicatesCountyArray[i]);
        }
      }

    }


  }
  //区
  getCounty(e, county, i, j, l) {
    let cityId = this.result[i].c[j].b;
    let countyId = this.result[i].c[j].c[l].b;
    let isInArray = this.inArray(countyId, this.countyArr);

    if (county.checked && !isInArray) {
      this.result[i].c[j].c[l].checked = true;
      this.countyArr.push(this.result[i].c[j].c[l].b);
      this.duplicatesCountyArr.push(this.result[i].c[j].c[l].b);
      this.removeByValue(this.duplicatesCityArr, cityId);
    } else if (!county.checked && isInArray) {
      this.result[i].c[j].c[l].checked = false;
      this.removeByValue(this.countyArr, countyId);
      this.removeByValue(this.duplicatesCountyArr, countyId);
    }

  }

  //实现全选
  allChecked(e, checkedAll) {
    if (checkedAll.checked) {
      for (let i = 0; i < this.provinceList.length; i++) {
        this.provinceList[i].checked = true;
      }
    } else {
      for (let i = 0; i < this.provinceList.length; i++) {
        this.provinceList[i].checked = false;
      }
    }

  }

  onSubmit(e,checkedAll) {
    this.lastChecked = this.duplicatesProvinceArr.concat(this.duplicatesCityArr, this.duplicatesCountyArr);
    // console.log(this.duplicatesProvinceArr);
    // console.log(this.duplicatesCityArr);
    // console.log(this.duplicatesCountyArr);
    console.log(this.lastChecked);
    if(checkedAll.checked){
      console.log('All');
    }
  }

}
