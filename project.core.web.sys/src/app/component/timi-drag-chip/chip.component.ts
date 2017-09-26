import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
    NgModule, Component, OnInit, AfterViewInit, OnDestroy,
    Input, ViewChild, ElementRef, Renderer2, EventEmitter, Output,forwardRef
} from '@angular/core';

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TimiDragChipComponent),
    multi: true
  };

@Component({
    selector: 'timi-drag-chip',
    template: `
    <div class="timi-chip">
      <ul><li *ngFor="let chip of value;let i = index;" (click)="delChip(i)">{{chip}}</li></ul>
      <div on-drop="onDrop($event)" on-dragover="allowDrop($event)">拖拽添加标签</div>
    </div>
  `,
    styleUrls: ['./chip.component.scss'],
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})

export class TimiDragChipComponent implements ControlValueAccessor, OnInit {

    @Input()
    set chips(value: any) {
        this.value = [];
        for (const v of value) {
            const isExited = this.value.find((elem, index, array) => {
                return elem === v;
            });
            if (!isExited) {
                this.value.push(v);
            }
        }
        this._propagateChange(this.value);
    }

    get chips(): any {
        return this.value;
    }

    value: any[] = [];
    private _value: any;
    private _propagateChange = (_: any) => {};

    @Output() chipsChange: EventEmitter<any> = new EventEmitter();

    constructor() { }

    ngOnInit() { }

    delChip(index) { 
        this.value.splice(index, 1);
    }

    onDrop($event) { 
        let data = $event.dataTransfer.getData("data");
        if(data){
            this.chips.push(data);
            this.chipsChange.emit(this.chips);
        }
    }

    allowDrop($event) { 
        $event.preventDefault();
    }

    writeValue(value: any){
        if(value){
            this.chips = value;
        }
    }

    registerOnChange(fn: any){
        this._propagateChange = fn;
    }
    
    registerOnTouched(fn: any){}

}

@NgModule({
    imports: [CommonModule],
    declarations: [TimiDragChipComponent],
    exports: [TimiDragChipComponent]
})
export class TimiDragChipModule { }