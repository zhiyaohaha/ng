import { CommonModule } from '@angular/common';
import { NgModule, Component, OnInit, Input, Renderer2, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { MdButtonModule } from '@angular/material';
import { DomRenderer } from '../../common/dom';
import { ConvertUtil } from '../../common/convert-util';
import { FileUploader, FileUploadModule } from 'ng2-file-upload';
import { globalUrl } from '../../common/global.config';

@Component({
    selector: 'timi-file-uploader',
    template: `<button md-raised-button>{{btnName}}<input type="file" ng2FileSelect (change)="selectedFileOnChanged($event)" [uploader]="uploader"></button>`,
    styleUrls: ['./timi-ng2-file-uploader.component.scss'],
    providers: [DomRenderer]
})
export class TimiFileUploaderComponent implements OnInit {

    @Input() url: string;
    @Input() multiple: string;
    @Input() btnName: string;
    @Input() allowFiles: string;

    @Output() files: EventEmitter<any> = new EventEmitter();
    @Output() success: EventEmitter<any> = new EventEmitter();

    uploader: FileUploader;

    constructor(private util: ConvertUtil) { }

    ngOnInit() {
        console.log(this.allowFiles.split(","))
        this.uploader = new FileUploader({
            url: this.url,
            method: "POST",
            allowedFileType: this.allowFiles.split(","),
            //autoUpload: true
        });
    }

    selectedFileOnChanged($event) {
        //this.files.emit($event);

        let timestamp = this.util.timestamp();
        let sign = this.util.toMd5(timestamp + globalUrl.private_key);
        this.uploader.options.headers = [{ name: "timestamp", value: timestamp }, { name: "sign", value: sign }];
        this.uploader.uploadAll();

        let _self = this;

        this.uploader.onErrorItem = function (e) {
            console.log("onErrorItem");
            e.progress = 0;
            console.log(_self.uploader)
        }

        this.uploader.onErrorItem = function (e) {
            console.log(e)
        }

        this.uploader.onCompleteItem = function (e) {
            console.log("onCompleteItem");
        }

        this.uploader.onCompleteAll = function () {
            console.log("onCompleteAll");
        }

        this.uploader.queue[0].onSuccess = function (e) {
            _self.success.emit(e);
        }
    }
}

@NgModule({
    imports: [CommonModule, MdButtonModule, FileUploadModule],
    declarations: [TimiFileUploaderComponent],
    exports: [TimiFileUploaderComponent]
})

export class TimiFileUploaderModule { }