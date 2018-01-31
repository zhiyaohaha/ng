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
  //删除选中的行
  deleteRow(id) {
    return this.baseService.post("/api/PhoneBook/DeletePhoneBook", { data: { "id": id } });
  }
  //删除通话记录中的行
  deleteRocords(id) {
    return this.baseService.post("/api/PhoneBook/DeletePhoneBookRecord", { data: { "ids": id } });
  }
  //删除通讯录中的行
  deleteDetails(id) {
    return this.baseService.post("/api/PhoneBook/DeletePhoneBookDetail", { data: { "ids": id } });
  }

}
