import { BaseService } from './../base.service';
import { Injectable } from '@angular/core';

@Injectable()
export class PersonalService {

    constructor(private _baseSerive: BaseService) { }

    public getPersonalInfo() {
        return this._baseSerive.get("/api/Loginer/GetPersonalBasicInfo");
    }

}