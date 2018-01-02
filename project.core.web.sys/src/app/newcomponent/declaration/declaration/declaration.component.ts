import { Component, OnInit } from '@angular/core';
import { OrderService } from "app/services/order/order.service";
@Component({
  selector: 'my-declaration',
  templateUrl: './declaration.component.html',
  styleUrls: ['./declaration.component.scss'],
  providers: [OrderService]
})
export class DeclarationComponent implements OnInit {
  

  //新增部分
  productType: Array<any> = [];
  productDetail: any;
  checked: boolean = false;
  productId: string;
  showAuthentication: boolean = false;
  errorOfPerson: number;//用于判断展示错误信息
  errorMessage: string = '身份证号码格式不正确!';//用于输出错误信息
  phoneNum: string;//手机号码
  phoneCode: string;//手机验证码
  showCodeError: boolean = false;
  errorCode: string;
  showBankError: boolean = false;
  errorBank: string;
  idCard: string;//身份证号码
  bankCard: string;//银行卡号
  idCardPositiveImage: string;//身份证正面
  idCardOppositeImage: string;//身份证背面
  photo: string;//个人生活照片
  //personData: object = { "id": "5a435c273aa0a708ac67c1d6", "portrait": "http://data.cpf360.com/development/2017/12/27/5a4309943bc243c0280778bc.png?x-oss-process=image/crop,x_868,y_411,w_188,h_228", "face": "http://data.cpf360.com/development/2017/12/27/5a4308a43bc243c0280778b4.png?x-oss-process=image/crop,x_787,y_960,w_977,h_1402", "confidence": 78, "similarity": "高", "name": "李萌", "_sex": "男", "age": 23, "nation": "汉", "domicile": "湖北省房县白鹤乡石堰河村3组131号"};//人物详细信息
  personData: object;
  showPersonData: boolean = false;//是否展示人物详细信息
  btnDisabled: boolean = true;//验证码按钮是否打开
  productsStyle: boolean = false;
  index: any;

  constructor(private orderService: OrderService) { }

  ngOnInit() {
    this.orderService.getType().subscribe(res => {
      this.getProductType(res.data[0].childrens);
    })
    this.orderService.getProductDetail().subscribe(res => {
      this.getProductDetail(res.data);
    })
  }

  //产品数据
  getProductType(res) {
    this.productType = res;
  }
  //产品详情数据
  getProductDetail(res) {
    this.productDetail = res;
  }
  //获取电话验证码
  getPhoneNum($event, phoneNum) {
    let phoneReg = /(13\d|14[579]|15\d|17[01235678]|18\d)\d{8}/i;
    this.phoneNum = phoneNum.value;
    if (phoneReg.test(this.phoneNum)) {
      this.btnDisabled = false;
      console.log(this.phoneNum);
    }
    this.orderService.getCodeInfo(this.phoneNum).subscribe(res => {
      console.log(res);
    })
  }
  //输入的验证码
  getCode(e, code) {
    let regexp = /^[0-9]{4}$/;
    this.phoneCode = code.value;
    if (regexp.test(this.phoneCode)) {
      this.showCodeError = false;
    } else {
      this.showCodeError = true;
      this.errorCode = '验证码格式不正确，请输入长度为4的数字'
    }
  }
  //点击展示产品详情
  changeStyle(e, liActive, i) {
    this.productsStyle = true;
    this.index = i;
    this.productId = this.productDetail[i].id;
    this.showAuthentication = true;

  }
  //银行卡号
  getbankCard(e, bankNum) {
    let regexp = /^[0-9]{10,19}$/;
    this.bankCard = bankNum.value;
    if (regexp.test(this.bankCard)) {
      this.showBankError = false;
    } else {
      this.showBankError = true;
      this.errorBank = '输入的银行卡格式不正确!';
    }
  }
  //验证身份证号码
  authentication(e, person) {
    let regexp = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
    this.idCard = person.value;
    if (regexp.test(this.idCard)) {
      this.errorOfPerson = 1;
      this.orderService.getPersonInfo(this.idCard, this.productId).subscribe(res => {
        console.log(res);
        this.errorMessage = res.message;
      })
    } else {
      this.errorOfPerson = 2;
      this.errorMessage = '身份证号码格式不正确!';
    }
  }
  //上传成功
  uploaded1(e) {
    this.idCardPositiveImage = e.id;
  }
  uploaded2(e) {
    this.idCardOppositeImage = e.id;
  }
  uploaded3(e) {
    this.photo = e.id;
  }
  //认证数据
  onSubmit() {
    this.orderService.getInfo(this.phoneCode, this.idCard, this.bankCard, this.phoneNum, this.idCardPositiveImage, this.idCardOppositeImage, this.photo).subscribe(res => {
      this.personData = res.data;
      this.showPersonData = res.success;
    })
  }


}