import { Component, OnInit, Output, EventEmitter, ViewContainerRef } from '@angular/core';
import { OrderService } from "app/services/order/order.service";
import { BaseUIComponent } from '../../pages/baseUI.component';
import { TdLoadingService, TdDialogService } from '@covalent/core';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../../component/toast/toast.service';

@Component({
  selector: 'free-declaration',
  templateUrl: './declaration.component.html',
  styleUrls: ['./declaration.component.scss'],
  providers: [OrderService]
})
export class DeclarationComponent extends BaseUIComponent implements OnInit {


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
  personData: object; //个人信息数据
  showPersonData: boolean = false;//是否展示人物详细信息

  productsStyle: boolean = false;//点击产品展示产品详情
  index: number;//用于展示，当前方法略low，有时间的话重写
  showCertification: number; //用于切换展示
  personRealId: string;

  searchValue: any;
  chooseValue: any;

  addPadding: boolean = false;

  bankData: any;//开户行数据

  selectedProduct; // 选择的产品

  bank: string;//开户行

  showBtn: boolean = true;//设置disabled

  @Output() onPostOrderId = new EventEmitter();  //发送最新上传的文件数据

  constructor(private orderService: OrderService,
    private loading: TdLoadingService,
    private routerInfor: ActivatedRoute,
    private toastService: ToastService,
    private dialogService: TdDialogService,
    private viewContainerRef: ViewContainerRef) {
    super(loading, routerInfor);
  }

  ngOnInit() {
    this.orderService.getType().subscribe(res => {
      this.getProductType(res.data[0].childrens);
    })
    this.orderService.getProductDetail().subscribe(res => {
      this.getProductDetail(res.data);
    })
    this.orderService.getBank().subscribe(res => {
      this.getBankType(res.data);
    })
  }
  //获取开户行数据
  getBankType(res) {
    this.bankData = res;
  }

  //产品类型数据
  getProductType(res) {
    this.productType = res;
  }
  //产品详情数据
  getProductDetail(res) {
    for (let i = 0; i < res.length; i++) {
      res[i].checked = false;
    }
    this.productDetail = res;
  }
  //获取电话号码
  getPhoneNum(phoneNum) {
    let phoneReg = /(13\d|14[579]|15\d|17[01235678]|18\d)\d{8}/i;
    this.phoneNum = phoneNum.value;
  }
  //输入的验证码
  getCode(code) {
    let regexp = /^[0-9]{6}$/;
    this.phoneCode = code.value;
    if (regexp.test(this.phoneCode)) {
      this.showCodeError = false;
    } else {
      this.showCodeError = true;
      this.errorCode = '验证码格式不正确，请输入长度为6的数字';
    }
  }
  //点击展示产品详情
  changeStyle(product, i) {
    this.productId = product.id;
    product.checked = !product.checked;
    this.showAuthentication = true;
    for (let j = 0; j < this.productDetail.length; j++) {
      if (i != j) {
        this.productDetail[j].checked = false;
      }
    }
    if (product.checked) {
      this.addPadding = true;
    } else {
      this.addPadding = false;
    }
  }
  //开户行
  getBank(e) {
    this.bank = e;
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
      this.orderService.getPersonInfo(this.idCard, this.productId).subscribe(res => {
        this.errorOfPerson = 1;
        this.errorMessage = res.message;
        console.log(res);
        if (res.code == 0) {
          this.showCertification = 1;
          this.personData = res.data;
          this.personRealId = res.data.id;
        } else if (res.code == 'NeedReal') {
          this.showCertification = 2;
        }
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
  //发送验证码
  onCertification() {
    this.loading.register("loading");
    this.orderService.getInfo(this.idCard, this.bank, this.bankCard, this.phoneNum, this.idCardPositiveImage, this.idCardOppositeImage, this.photo).subscribe(res => {
      console.log(res);
      //super.showToast(this.toastService, res.message);
      this.loading.resolve("loading");
      if (res.success) {
        this.showBtn = false;
        super.showToast(this.toastService, '验证码已发送，请注意查收!!');
        if (res.data) {
          this.personRealId = res.data.id;
        }
      } else {
        super.openAlert({ title: "提示", message: res.message, dialogService: this.dialogService, viewContainerRef: this.viewContainerRef });
        // super.showToast(this.toastService, res.message);
      }
    })
  }

  //开始认证
  startVerify() {
    this.loading.register("loading");
    this.orderService.sendCode(this.personRealId, this.phoneCode).subscribe(res => {
      this.loading.resolve("loading");
      console.log(res);
      this.showPersonData = res.success;
      this.personData = res.data;
      if (res.success) {
        super.showToast(this.toastService, '认证成功，请进行下一步!');
      } else {
        // super.showToast(this.toastService, res.message);
        super.openAlert({ title: "提示", message: res.message, dialogService: this.dialogService, viewContainerRef: this.viewContainerRef });
      }
    })
  }

  //申请贷款
  onSubmit() {
    this.loading.register("loading");
    this.orderService.onSubmitLoan(this.personRealId, this.productId).subscribe(res => {
      this.loading.resolve("loading");
      if (res.success) {
        super.showToast(this.toastService, '申请贷款已成功!');
        this.onPostOrderId.emit(res.data.id);
      } else {
        super.openAlert({ title: "提示", message: res.message, dialogService: this.dialogService, viewContainerRef: this.viewContainerRef });
      }
    })
  }
  //搜索产品
  searchProduct(e, name) {
    this.searchValue = name;
    this.addPadding = false;
    if (this.chooseValue && name) {
      this.orderService.getProductDetail(name, this.chooseValue).subscribe(res => {
        this.getProductDetail(res.data);
      })
    } else if (!(this.chooseValue) && name) {
      this.orderService.getProductDetail(name).subscribe(res => {
        this.getProductDetail(res.data);
      })
    } else if (this.chooseValue && !name) {
      this.orderService.getProductDetail('', this.chooseValue).subscribe(res => {
        this.getProductDetail(res.data);
      });
    } else {
      this.orderService.getProductDetail().subscribe(res => {
        this.getProductDetail(res.data);
      });
    }
  }
  //匹配产品类型
  choseType(e, code) {
    this.chooseValue = code;
    this.addPadding = false;
    if (this.searchValue && code) {
      this.orderService.getProductDetail(this.searchValue, code).subscribe(res => {
        this.getProductDetail(res.data);
      })
    } else if (!(this.searchValue) && code) {
      this.orderService.getProductDetail('', code).subscribe(res => {
        this.getProductDetail(res.data);
      })
    }
  }
}
