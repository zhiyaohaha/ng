import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {Component, EventEmitter, Input, NgModule, OnInit, Output} from "@angular/core";
import {MdButtonModule, MdDatepickerModule, MdInputModule, MdSelectModule} from "@angular/material";
import {ButtonModule} from "../button/button.directive";
import {ConvertUtil} from "../../common/convert-util";
import {TimiInputModule} from "../timi-input/timi-input.component";
import {TimiSelectModule} from "../timi-select/select.component";

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

  constructor(private util: ConvertUtil) {
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

  keyPress($event, params) {
    if ($event.which === 13) {
      this.searchParams(params);
    }
  }

  //搜索
  searchParams($event) {
    this.condition.filter(i => {
      if (i.key === "createdDate" && this.StartTime && this.EndTime) {
        i.value = this.util.getFullDate(this.StartTime) + " " + this.util.getFullDate(this.EndTime);
      } else {
        i.value = $event[i.key];
      }
    });
    let str = JSON.stringify(this.condition);
    this.onSearch.emit(str);
  }
}

@NgModule({
  imports: [CommonModule, FormsModule, MdInputModule, MdButtonModule, MdDatepickerModule, MdSelectModule, ButtonModule, TimiInputModule, TimiSelectModule],
  declarations: [SearchFormComponent],
  exports: [SearchFormComponent]
})

export class SearchFormModule {
}
