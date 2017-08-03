import { Component, OnInit, HostBinding } from '@angular/core';
import { fadeInUp } from "../../common/animations";
import { LoginOutService } from '../../services/loginOut-service/loginOut.service';

@Component({
  selector: 'app-root',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  animations: [fadeInUp],
  providers: [LoginOutService]
})
export class MainComponent implements OnInit {

  // @HostBinding("@fadeInUpState") fadeInUpState;
  // @HostBinding('style.display') display = 'block';

  constructor(private _loginoutservice: LoginOutService) { }

  ngOnInit() {
  }

  loginOut() {
    this._loginoutservice.loginOut();
  }

}
