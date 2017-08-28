import { Component, OnInit } from '@angular/core';
import { fadeInUp, fadeIn, flyInOut } from './../../common/animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { passwordValidator, equalValidator } from '../../validators/validator';
import { BaseService } from '../../services/base.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss'],
  animations: [fadeIn]
})
export class UpdatePasswordComponent implements OnInit {

  passwordForm: FormGroup;

  constructor(private fb: FormBuilder, private _service: BaseService) {
    this.passwordForm = fb.group({
      oldPassword: ["", [Validators.required]],
      passwordGroup: fb.group({
        password: ["", [Validators.required, passwordValidator]],
        confirm: ["", Validators.required]
      }, { validator: equalValidator })
    })
  }

  ngOnInit() { }

  onSubmit() {
    if (this.passwordForm.valid) {
      this._service.post('/api/Loginer/RePassword', this.passwordForm.value).subscribe(r =>
        console.log(r)
      );
    }
  }

}
