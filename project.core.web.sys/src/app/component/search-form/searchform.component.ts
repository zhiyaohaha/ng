import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    NgModule, Component, OnInit, Input, EventEmitter,
    Output, AfterViewInit, AfterContentInit, ViewChild, ElementRef, Renderer2,
} from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { MdInputModule, MdDatepickerModule } from '@angular/material';
import { ButtonModule } from '../button/button.directive';

@Component({
    selector: "search-form",
    templateUrl: "searchform.component.html",
    styleUrls: ["searchform.component.scss"],
})

export class SearchFormComponent implements OnInit, AfterViewInit, AfterContentInit {

    @Input() filters: any;//搜索UIDOM
    @Input() condition: any[];//搜索关键字KV
    @Output() onSearch: EventEmitter<any> = new EventEmitter();

    constructor() { }

    ngOnInit() { }

    ngAfterViewInit() { }

    ngAfterContentInit() { }

    /**
     * 设置搜索关键字KV
     */
    searchParam($event) {
        let name = $event.target.name;
        this.condition.filter(i => {
            if (i.key == name) {
                i.value = $event.target.value;
            }
        });
    }

    //搜索
    searchParams() {
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