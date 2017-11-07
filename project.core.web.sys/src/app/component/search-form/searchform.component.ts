import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {
    NgModule, Component, OnInit, Input, EventEmitter,
    Output, AfterViewInit, AfterContentInit
} from "@angular/core";
import { MdInputModule, MdDatepickerModule } from "@angular/material";
import { ButtonModule } from "../button/button.directive";
import { ConvertUtil } from "../../common/convert-util";

@Component({
    selector: "search-form",
    templateUrl: "searchform.component.html",
    styleUrls: ["searchform.component.scss"],
})

export class SearchFormComponent implements OnInit, AfterViewInit, AfterContentInit {

    @Input() filters: any; //搜索UIDOM
    @Input() condition: any[]; //搜索条件KV
    @Output() onSearch: EventEmitter<any> = new EventEmitter();
    StartTime: Date;
    EndTime: Date;

    constructor(private util: ConvertUtil) { }

    ngOnInit() { }

    ngAfterViewInit() { }

    ngAfterContentInit() { }

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
    searchParams() {
        this.condition.filter(i => {
            if (i.key === "createdDate" && this.StartTime && this.EndTime) {
                i.value = this.util.getFullDate(this.StartTime) + " " + this.util.getFullDate(this.EndTime);
            }
        });
        let str = JSON.stringify(this.condition);
        this.onSearch.emit(str);
    }
}

@NgModule({
    imports: [CommonModule, FormsModule, MdInputModule, MdDatepickerModule, ButtonModule],
    declarations: [SearchFormComponent],
    exports: [SearchFormComponent]
})

export class SearchFormModule { }
