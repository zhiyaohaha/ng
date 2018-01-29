import { Injectable } from '@angular/core';
import { BaseService } from 'app/services/base.service';

@Injectable()
export class PhoneBookService {

  constructor(private baseService: BaseService) { }

  //获取通话记录的数据
  getRecord(id, index, size) {
    return this.baseService.get("/api/PhoneBook/GetPhoneBookRecordList", { "id": id, "index": index, "size": size });
  }
  //获取通讯录的数据
  getAddressBook(id, index, size) {
    return this.baseService.get("/api/PhoneBook/GetPhoneBookDetailList", { "id": id, "index": index, "size": size });
  }
}
