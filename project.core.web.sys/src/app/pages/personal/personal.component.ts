import { Component, OnInit } from '@angular/core';
import { fadeInUp } from '../../common/animations';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss'],
  animations: [fadeInUp]
})
export class PersonalComponent implements OnInit {

  personImg: string = 'https://sfault-avatar.b0.upaiyun.com/245/864/2458645307-59701d16778bd_huge256';

  constructor() { }

  ngOnInit() {
  }

  onBlur($event) {
    console.log($event);
  }

}
