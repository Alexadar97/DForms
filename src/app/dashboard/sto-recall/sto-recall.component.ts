import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { DataserviceService } from '../../dataservice.service';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute } from '@angular/router';
declare var $, moment;

@Component({
  selector: 'app-sto-recall',
  templateUrl: './sto-recall.component.html',
  styleUrls: ['./sto-recall.component.css']
})
export class StoRecallComponent implements OnInit {
  private readonly notifier: NotifierService;
  form: FormGroup;
  l4Users;
  l3Users;
  budgetApproverUsers;
  nonZero;
  private listusers = this.ds.appconstant + 'user/list';

  private calculateAPI = this.ds.appconstant + 'sto/ratePerPart';
  private appconstant = this.ds.appconstant;
  numbervalidation = /^[0][1-9]\d{9}$|^[1-9]\d{9}$/;
  regexp = /^\S*$/;

  private savemcs = this.appconstant + 'sto/save';
  private searchPartnumberAPI = this.appconstant + 'part/searchPartNo';

  constructor(notifierService: NotifierService, private ds: DataserviceService, private route: ActivatedRoute, private _location: Location, private fb: FormBuilder, private http: Http, private router: Router) {
    this.fb = fb;
    this.notifier = notifierService;

  }
  isBudgetApprover = false;
  isStoreUser = false;
  isSm = false;
  isIpl = false;
  isPartsplanner = false;
  status: any
  isStorerequest = false;
  usertype: any
  ngOnInit() {

    var zeroValidation = /^(?=.*\d)(?=.*[1-9]).{1,10}$/;
    this.nonZero = Validators.compose([Validators.required, Validators.pattern(zeroValidation)]);
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    var userid = jsonData.shortid;
    var usertype = '';

    if (jsonData['usertype']) {
      usertype = jsonData['usertype'].toLowerCase();
      this.usertype = usertype
    }
    if (usertype === "budgetapprover") {
      this.status = 'budgetapprover'
      this.isBudgetApprover = true;

    } else if (usertype === "sm") {
      this.status = 'sm'
      this.isSm = true;
    } else if (usertype === "ipl") {
      this.status = 'ipl'
      this.isIpl = true;
    } else if (usertype === "partsplanner") {
      this.status = 'partsplanner'
      this.isPartsplanner = true;
    } else if (usertype === "store") {
      this.status = 'store'
      this.isStoreUser = true;
    } else if (usertype === "admin") {
      this.status = 'admin'
      // this.isStoreUser = true;
    }
    else if (usertype === "requester") {
      this.status = 'requester'
      this.isStorerequest = true;
    }
    else {
      this.status = '';
    }

    if (userid == null) {
      userid = 'Arul';
    }

    var req = Validators.compose([Validators.required]);
    var phone = Validators.compose([Validators.required, Validators.pattern(this.numbervalidation)]);
    this.form = this.fb.group({
      id: [this.form_id],
      requestorid: [userid, req],
      phonenumber: ['', phone],
      exigency: [null, req],
      l4: [null],
      l3: [null],
      // status: ['test', req],
      purpose: [null, req],
      value: [null],
      stoParts: this.fb.array([]),
    });


    var usertype = "usertype=L4"
    this.ds.makeapi(this.listusers, usertype, "post")
      .subscribe(data => {

        this.l4Users = data;

      },
        Error => {
        });

    var usertype = "usertype=L3"
    this.ds.makeapi(this.listusers, usertype, "post")
      .subscribe(data => {

        this.l3Users = data;

      },
        Error => {
        });


    //budgetApproverUsers
    var usertype = "usertype=budgetapprover"
    this.ds.makeapi(this.listusers, usertype, "post")
      .subscribe(data => {

        this.budgetApproverUsers = data;

      },
        Error => {
        });

    var value = this.route.queryParams
      .subscribe(params => {
        this.setToken(params.id);
      });
  }


  get rowForms() {
    return this.form.get('stoParts') as FormArray;

  }


  addrow = 0
  addRow() {
    this.addrow++
    var numberLimitation = "/^[a-z]{8}([a-z]{4})?$/";
    // var pattern = Validators.compose([Validators.pattern(numberLimitation)]);
    var req = Validators.compose([Validators.required]);
    var partno = Validators.compose([Validators.required, Validators.pattern(this.regexp)]);
    const row = this.fb.group({
      id: [null],
      ascorderview: [this.addrow],
      partnumber: ['', partno],
      description: ['', req],
      unit: ['', req],
      reqquantity: ['', this.nonZero],
      priceperpart: [''],
      priceperqty: [''],
      status: [''],
    });

    this.rowForms.push(row);
  }
  deleteRow(i) {
    this.rowForms.removeAt(i);
  }
  goBack() {
    this._location.back();
  }

  saveData() {
    let reqdata = "usertype=1";

    let url = this.savemcs;
    let data = this.form.value;
    if (data.exigency == 0 || data.exigency == "0") {
      data.l3 = null;
      data.l4 = null;
    }

    console.log(data);
    reqdata = JSON.stringify(data);

    const headers = new Headers();
    headers.append('content-type', 'application/json');
    // headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(url, reqdata, { headers: headers })
      .map((response: Response) => response.json())
      .catch((error: any) => {
        if (error.status === 500) {
          return Observable.throw(new Error(error.status));
        }
        else if (error.status === 400) {
          return Observable.throw(new Error(error.status));
        }
        else if (error.status === 409) {
          return Observable.throw(new Error(error.status));
        }
        else if (error.status === 406) {
          return Observable.throw(new Error(error.status));
        }
        else if (error.status === 403) {


        }
      });
  }
  submitForm() {
    $('#confirmSubmit').modal('show')
  }



  loading = false;

  confirmSubmit() {

    for (var i = 0; i < this.rowForms.length; i++) {
      this.pricePartVal = this.rowForms.value[i].priceperpart;
      this.checkpriceStatus = this.rowForms.value[i].status;
    }
    if ((this.pricePartVal == 0 && this.checkpriceStatus == 'na') || (this.pricePartVal == '' && this.checkpriceStatus == '')) {
      $.notify('Please add the Price Per Part in master!', "error");
      $('#confirmSubmit').modal('hide');

    }
    else if (this.form.valid) {
      this.loading = true;
      this.saveData().subscribe(data => {
        if (data['status'] == 'Success') {
          this.loading = false;
          $.notify('STO Form Submitted Successfully!', "success");
          $('#confirmSubmit').modal('hide');
          // this.notifier.notify( 'success', 'Form Submitted Successfully!' );
          this.router.navigateByUrl('dashboard/stolist')
        } else if (data['status'] == 'Failure') {
          this.loading = false;
          $.notify('Server error, Please try again!', "error");
          $('#confirmSubmit').modal('hide');
        }
        else {
          $.notify('Form Submition Failed!', "error");
          $('#confirmSubmit').modal('hide');
        }
      },
        Error => {
          //console.log("Reponse Error");
          this.loading = false;
        });;
    } else {
      this.findInvalidControls();
      $.notify('Invalid Form! Please fill all mandatory fields', "error");
      $('#confirmSubmit').modal('hide');
      // this.notifier.notify( 'error', 'Invalid Form! Please enter the correct data' );
    }

  }

  findInvalidControls() {
    const invalid = [];
    const controls = this.form.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    //console.log(invalid);
    return invalid;
  }
  keyAlpha(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  nospace(event: any) {
    const pattern = /^\S*$/
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  saveCalculate() {
    let reqdata = "";

    let url = this.calculateAPI;
    let data = this.form.value;
    if (data.exigency == 0 || data.exigency == "0") {
      data.l3 = null;
      data.l4 = null;
    }

    reqdata = JSON.stringify(data);

    const headers = new Headers();
    headers.append('content-type', 'application/json');
    // headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(url, reqdata, { headers: headers })
      .map((response: Response) => response.json())
      .catch((error: any) => {
        if (error.status === 500) {
          return Observable.throw(new Error(error.status));
        }
        else if (error.status === 400) {
          return Observable.throw(new Error(error.status));
        }
        else if (error.status === 409) {
          return Observable.throw(new Error(error.status));
        }
        else if (error.status === 406) {
          return Observable.throw(new Error(error.status));
        }
        else if (error.status === 403) {


        }
      });
  }

  calculateData: any;
  pricePartVal: any;
  pricePartStatus: any;
  checkpriceStatus: any;
  calculateForm() {
    localStorage.setItem('isInitiating', "true");
    this.loading = true;
    this.saveCalculate().subscribe(data => {
      this.loading = false;
      this.form.reset();
      this.rowForms.reset();
      this.form.patchValue(data);
      var StoParts = data['stoParts'];
      this.calculateData = StoParts;
      if (localStorage.getItem('isInitiating') == "true") {
        localStorage.setItem('isInitiating', "");
      }
      else {
        for (var i = 0; i < StoParts.length; i++) {
          var StoObj = StoParts[i];
          this.pricePartVal = StoObj.priceperpart;
          this.checkpriceStatus = StoObj.status;
          this.showRow(StoObj);
        }
      }

    })
  }
  showRow(data) {
    this.addrow++
    const calculaterow = this.fb.group({
      id: [data['id']],
      ascorderview: [this.addrow],
      partnumber: [data['partnumber']],
      description: [data['description']],
      unit: [data['unit']],
      reqquantity: [data['reqquantity']],
      priceperpart: [data['priceperpart']],
      priceperqty: [data['priceperqty']],
      status: [data['status']],
    });

    this.rowForms1.push(calculaterow);
  }
  get rowForms1() {
    return this.form.get('stoParts') as FormArray;
  }
  upload() {
    this.router.navigate(['dashboard/stoupload'], {
      queryParams: { type: 'sto' }
    });
  }
  addsto() {
    this.router.navigate(['dashboard/stonew'], {});
  }
  stolist() {
    this.router.navigate(['dashboard/stolist'], {});
  }
  partNumberList = [];
  searchPartNo(value) {
    let reqdata = "searchstr=" + value;
    let url = this.searchPartnumberAPI;
    this.ds.makeapi(url, reqdata, "post").subscribe(data => {
      this.partNumberList = data;
      console.log(this.partNumberList)
    })
  }


  stoPartsArr = [];
  stoform_id: any;
  form_id: any;
  partform_id: any;
  fetchFormDetails(formid) {
    var urlValue = this.appconstant + 'sto/get';
    var submitData = "formid=" + formid;
    this.ds.makeapi(urlValue, submitData, 'post')
      .subscribe(data2 => {
        //show information in screen.
        //show approval and reject
        console.log(data2)
        var patchValue = data2;
        this.form_id = data2['id'];
        this.form.reset();
        this.form.patchValue(patchValue);
        var stoParts = data2['stoParts'];
        this.stoPartsArr = stoParts;;
        var stoObj = {}
        for (var i = 0; i < stoParts.length; i++) {
          stoObj[i] = stoParts[i];
          // this.stoform_id = stoObj['stoformid'];
          // this.partform_id = stoObj['id'];
        }


        var vKeys = Object.keys(stoObj);
        for (var vk of vKeys) {
          var vendors = stoObj[vk];
          this.addRow1(vendors);
        }


      }, Error => {

      });

  }
  formId: any;
  setToken(formId) {
    this.formId = formId;
    this.fetchFormDetails(this.formId);
  }
  addRow1(data) {
    this.addrow++
    var numberLimitation = "/^[a-z]{8}([a-z]{4})?$/";
    // var pattern = Validators.compose([Validators.pattern(numberLimitation)]);
    var req = Validators.compose([Validators.required]);
    var partno = Validators.compose([Validators.required, Validators.pattern(this.regexp)]);
    const row = this.fb.group({
      id: [data['id']],
      ascorderview: [this.addrow],
      partnumber: [data['partnumber'], partno],
      description: [data['description'], req],
      unit: [data['unit'], req],
      reqquantity: [data['reqquantity'], this.nonZero],
      priceperpart: [data['priceperpart']],
      priceperqty: [data['priceperqty']],
      status: [data['status']],
    });

    this.rowForms2.push(row);
  }

  get rowForms2() {
    return this.form.get('stoParts') as FormArray;

  }

}


