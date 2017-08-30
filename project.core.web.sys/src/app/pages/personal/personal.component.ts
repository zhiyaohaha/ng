import { PersonalService } from './../../services/personal/personal.service';
import { Component, OnInit } from '@angular/core';
import { fadeInUp, fadeIn } from '../../common/animations';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss'],
  animations: [fadeIn]
})
export class PersonalComponent implements OnInit {

  personImg: string = 'https://sfault-avatar.b0.upaiyun.com/245/864/2458645307-59701d16778bd_huge256';
  personInfo;

  constructor(private _personalService: PersonalService) { }

  ngOnInit() {
    this._personalService.getPersonalInfo().subscribe(r => {
      if (r.code == "0") {
        this.personInfo = r.data;
        console.log(r.data)
      }
    })
  }

  /**
   * 上传头像
   */
  onFilesChanges($event) {
    console.log($event);
  }

  onSuccessItem($event) {
    console.log($event)
  }

  onBlur($event) {
    console.log($event);
  }

}
