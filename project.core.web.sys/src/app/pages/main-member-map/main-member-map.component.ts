import { Component, OnInit, Input } from '@angular/core';
import { BaseService } from './../../services/base.service';

@Component({
  selector: 'app-main-member-map',
  templateUrl: './main-member-map.component.html',
  styleUrls: ['./main-member-map.component.scss']
})
export class MainMemberMapComponent implements OnInit {

  @Input() datas;

  constructor(private baseService: BaseService) { }

  ngOnInit() {
    this.baseService.get("/api/wiki/MemberMindMapping").subscribe(r => {
      if (r.code == "0") {
        this.datas = r.data;
      }
    })
  }



}