import { ConvertUtil } from './../../common/convert-util';
import { PersonalService } from './../../services/personal/personal.service';
import { Component, OnInit } from '@angular/core';
import { fadeInUp, fadeIn } from '../../common/animations';
import { FileUploader } from 'ng2-file-upload';
import { CommunicationService } from './../../services/share/communication.service';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss'],
  animations: [fadeIn]
})
export class PersonalComponent implements OnInit {

  personImg: string = '';
  personInfo;

  constructor(private _personalService: PersonalService, private util: ConvertUtil, private myService: CommunicationService) { }

  ngOnInit() {
    this._personalService.getPersonalInfo().subscribe(r => {
      if (r.code == "0") {
        this.personInfo = r.data;
        this.personImg = r.data.avatar;
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

  /**
   * 上传头像成功过后获取头像地址
   * @param  
   */
  onSuccessItem($event) {
    let data = this.util.toJSON($event);
    if (data.code == "0") {
      let url = data.data[0].path;
      this._personalService.setPersonalHeader(url).subscribe();
      this.personImg = url;
      localStorage.setItem("avatar", url);
      this.myService.avatar = url;
    }
  }

  /**
   * 失去焦点过后设置改信息
   * @param  
   */
  onBlur($event) {
    if (!$event.isChange) return;
    this._personalService.setPersonalInfo({ key: $event.target.name, value: $event.target.value }).subscribe(r => {
      console.log(r);
    })
  }

}
