import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {Component, EventEmitter, Input, NgModule, OnInit, Output} from "@angular/core";
import {MdButtonModule, MdDatepickerModule, MdInputModule, MdSelectModule} from "@angular/material";
import {ButtonModule} from "../button/button.directive";
import {ConvertUtil} from "../../common/convert-util";
import {TimiInputModule} from "../timi-input/timi-input.component";
import {TimiSelectModule} from "../timi-select/select.component";
import {CalendarModule} from "../calendar/calendar.component";

@Component({
  selector: "search-form",
  templateUrl: "searchform.component.html",
  styleUrls: ["searchform.component.scss"],
})

export class SearchFormComponent implements OnInit {

  @Input() filters: any; //搜索UIDOM
  @Input() condition: any[]; //搜索条件KV
  @Output() onSearch: EventEmitter<any> = new EventEmitter();
  StartTime: Date;
  EndTime: Date;

  constructor(private convertUtil: ConvertUtil) {
  }

  ngOnInit() {
  }

  /**
   * 设置搜索关键字KV
   */
  searchParam($event) {
    let name = $event.target.name;
    this.condition = this.condition.map(i => {
      if (i.key === name) {
        i.value = $event.target.value;
      }
      return i;
    });
  }

  //搜索
  searchParams($event) {

    if (this.condition) {
      this.condition.map(item => {
        item["value"] = $event[item["key"]];
      });
      this.onSearch.emit(this.convertUtil.toJsonStr(this.condition));
    } else {
      this.onSearch.emit(this.convertUtil.toJsonStr($event));
    }

    // if (this.condition) {
    //   this.condition.filter(i => {
    //     if (i.key === "createdDate" && this.StartTime && this.EndTime) {
    //       i.value = this.util.getFullDate(this.StartTime) + " " + this.util.getFullDate(this.EndTime);
    //     } else {
    //       i.value = $event[i.key];
    //     }
    //   });
    //   let filter = false;
    //   this.condition.forEach(item => {
    //     if (item.value && item.value !== 0) {
    //       filter = true;
    //     }
    //   });
    //   if (filter) {
    //     let str = JSON.stringify(this.condition);
    //     this.onSearch.emit(str);
    //   } else {
    //     this.onSearch.emit("");
    //   }
    // } else {
    //   this.onSearch.emit($event);
    // }
  }
}

@NgModule({
  imports: [CommonModule, FormsModule, MdInputModule, MdButtonModule, MdDatepickerModule, MdSelectModule, ButtonModule, TimiInputModule, TimiSelectModule, CalendarModule],
  declarations: [SearchFormComponent],
  exports: [SearchFormComponent]
})

export class SearchFormModule {
}
