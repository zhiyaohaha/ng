import { Component, OnInit } from '@angular/core';
import { fadeInUp } from '../../common/animations';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss'],
  animations: [fadeInUp]
})
export class PersonalComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
