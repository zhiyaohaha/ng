import { Http } from '@angular/http';
import { Component, OnInit } from '@angular/core';
import { BaseService } from '../../services/base.service';

@Component({
  selector: 'app-apidoc',
  templateUrl: './apidoc.component.html',
  styleUrls: ['./apidoc.component.scss']
})
export class ApidocComponent implements OnInit {

  list: ListModel;

  result: ListModel[];

  constructor(private service: BaseService) {
  }

  ngOnInit() {
    this.service.get("/api/wiki").subscribe(res => {
      this.result = res.data;
      this.list = this.result[0];
    })
  }

  /**
   * 调到第num条
   */
  goTo(num) {
    this.list = this.result[num];
  }

}

export class ListModel {
  example: string;
  name: string;
  params: object[];
  remark: string;
  return: string;
  summary: SummaryModel;
}

export class SummaryModel {
  title: string;
  params: any[];
}