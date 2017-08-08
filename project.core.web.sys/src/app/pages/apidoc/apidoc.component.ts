import { Http } from '@angular/http';
import { Component, OnInit } from '@angular/core';
import { BaseService } from '../../services/base.service';
import { fadeInUp } from '../../common/animations';
import { NotesXmlDocMember } from '../../models/NotesXmlDocMember';

@Component({
  selector: 'app-apidoc',
  templateUrl: './apidoc.component.html',
  styleUrls: ['./apidoc.component.scss'],
  animations: [fadeInUp]
})
export class ApidocComponent implements OnInit {

  list: NotesXmlDocMember;

  result: NotesXmlDocMember[];

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