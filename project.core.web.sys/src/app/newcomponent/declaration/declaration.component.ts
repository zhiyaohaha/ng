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
  errorCard: string;//用于输出错误信息
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

  //新增部分
  showResult: boolean = false;

  areaArray: Array<any> = []; //富有地区数组

  //新增
  abc: any;
  errorPhone: string;//电话号码的错误内容
  showIdError: boolean;//控制显示身份证错误信息
  showPhoneError: boolean;//控制显示电话号码错误信息
  realId: any;//开始认证返回的id
  showCode: boolean = false; //显示验证码部分
  errorPic: string;//开始认证上面的报错展示信息
  showPicError: boolean;//控制显示上传图片的报错信息

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


  // 新增   点击展示产品详情且进行验证是否需要实名
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
      this.orderService.getRealName(this.productId).subscribe(res => {
        if (res.data.needReal === false) {
          console.log('不需要实名');
        } else {
          console.log('需要实名');
          this.showCertification = 1;
        }
      })
    } else {
      this.addPadding = false;
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
      this.loading.resolve("loading");
      if (res.success) {
        this.showBtn = false;
        super.showToast(this.toastService, '验证码已发送，请注意查收!!');
        if (res.data) {
          this.personRealId = res.data.id;
        }
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
  // 新增部分
  // 开始认证，认证合一
  startReal() {
    if (this.idCardPositiveImage && this.idCardOppositeImage && this.photo) {
      //三个图片都传的时候
      this.loading.register("loading");
      this.orderService.getRealPic(this.productId, {
        "idCardPositiveImage": this.idCardPositiveImage,
        "idCardOppositeImage": this.idCardOppositeImage,
        "photo": this.photo
      }).subscribe(res => {
        this.loading.resolve("loading");
        if (res.success) {
          this.showPicError = false;
          this.realId = res.data.id;
          this.personRealId = res.data.idCard;
          if (!res.data.real) {
            this.showResult = true;
            this.personData = res.data;
          } else {
            this.onPostOrderId.emit(res.data.id);
          }
        } else {
          this.showPicError = true;
          this.errorPic = '请求失败的时候返回的错误信息！目前没有！';
        }
      })
    } else {
      this.showPicError = true;
      this.errorPic = '请上传所需对应的三张图片！'
    }

  }


  //获取银行卡号
  getbankCard(e, bankNum) {
    let regexp = /^[0-9]{10,19}$/;
    this.bankCard = bankNum.value;
    if (regexp.test(this.bankCard)) {
      this.showBankError = false;
      this.errorBank = '';
    } else {
      this.showBankError = true;
      this.errorBank = '输入的银行卡格式不正确!';
    }
  }
  //开户行
  getBank(e) {
    this.bank = e;
    console.log(this.bank);
  }
  //获取电话号码
  getPhoneNum(phoneNum) {
    let regexp = /(13\d|14[579]|15\d|17[01235678]|18\d)\d{8}/i;
    this.phoneNum = phoneNum.value;
    if (regexp.test(this.phoneNum)) {
      this.showPhoneError = false;
      this.errorPhone = '';
    } else {
      this.showPhoneError = true;
      this.errorPhone = '手机号码不正确！';
    }
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
  // 发送验证码并验证
  startVerify() {
    if (this.bank && this.abc && this.bankCard && this.phoneNum) {
      //此时信息才已填写完全
      this.orderService.infoReal(this.productId, {
        'id': this.realId,
        'fuiouBank': this.bank,
        'fuiouBankArea': this.abc,
        'bankCard': this.bankCard,
        'mobilePhone': this.phoneNum,
      }).subscribe(res => {
        if (res.success) {
          if (res.data.real) {
            //true 时 返回订单id 直接跳转到报单页面
            this.onPostOrderId.emit(res.data.id);
          } else {
            //false时 返回认证id  显示验证码部分
            this.showCode = true;
          }
        }else{
          super.openAlert({ title: "提示", message: res.message, dialogService: this.dialogService, viewContainerRef: this.viewContainerRef });
        }
      })
    }else{
      //信息填写不全，报错提示
      super.openAlert({ title: "提示", message: '信息填写不全，请重新填写！', dialogService: this.dialogService, viewContainerRef: this.viewContainerRef });
    }
    
  }
  //提交验证码
  sendCode() {
    this.orderService.realCode(this.productId, this.realId, this.phoneCode).subscribe(res => {
      if(res.success){
        super.showToast(this.toastService, '实名认证已成功，请进行下一步！');
        this.onPostOrderId.emit(res.data.id);
      }else{
        super.showToast(this.toastService, '验证码输入错误，请重新输入！');
      }
    })
  }

}
