import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { DataserviceService } from '../../dataservice.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
declare var $

@Component({
  selector: 'app-nmcs-recall',
  templateUrl: './nmcs-recall.component.html',
  styleUrls: ['./nmcs-recall.component.css']
})
export class NmcsRecallComponent implements OnInit {


  //^[0][1-9]\d{9}$|^[1-9]\d{9}$
  private readonly notifier: NotifierService;

  numbervalidation = /^[0][1-9]\d{9}$|^[1-9]\d{9}$/;
  isStoreLogin = false;

  form: FormGroup;
  name = new FormControl('');
  purpose = new FormControl('');
  storagetype = new FormControl('');
  private appconstant = this.ds.appconstant;
  fb = null
  l4Users = [];
  loading = false;
  deptList = []
  listdept = this.appconstant + 'dept/list';

  listusers = this.appconstant + 'user/list';

  private savemcs = this.appconstant + 'nmcs/save';

  constructor(notifierService: NotifierService, fb: FormBuilder, private route: ActivatedRoute, private http: Http, private router: Router, private _location: Location, private ds: DataserviceService) {

    this.fb = fb;
    this.notifier = notifierService;
    var userDetails = localStorage.getItem("Daim-forms");
    var userJson = JSON.parse(userDetails);

    var req = Validators.compose([Validators.required]);

    var num = Validators.compose([Validators.required, Validators.pattern(this.numbervalidation)]);


    this.form = fb.group({
      id: [this.form_id],
      creditorid: [userJson.shortid, req],
      // deptid: ['',req],
      contactno: ['', num],
      storagetype: ['', req],
      storagePurpose: ['', req],
      hrid: ['', req],
      // approverid: ['',req],
      status: ['test', req],
      nmcsParts: fb.array([]),
    });
    var value = this.route.queryParams
      .subscribe(params => {
        this.setToken(params.id);
      });
  }



  get rowForms() {
    return this.form.get('nmcsParts') as FormArray;

  }

  goBack() {
    this._location.back();
  }

  removePart(control) {
    // control.pop()
    control.removeAt(control.length - 1)
  }

  findAugmentedNumber(input) {
    var str = input.match(/\d+$/);
    console.log(str);
    return parseInt(str)
  }

  addPart(control) {

    var autoId = "";
    var restOfFinasNumber = ""
    var partNum = 0;
    if (control.controls.length == 0) {
      autoId = prompt("Enter FinasId: eg:FNum0001");
    } else {


      var lastPartName = control.controls[control.controls.length - 1].value['finasid'];
      // autoId = lastPartName.substring(0, lastPartName.length-1);

      // partNum = parseInt(lastPartName);
      partNum = this.findAugmentedNumber(lastPartName);
      // console.log(lastPartName.match(/\d+/g));
      // partNum = parseInt(lastPartName.match(/\d+/g));

      if (partNum == null || isNaN(partNum)) {
        partNum = 1;
        restOfFinasNumber = lastPartName;

      } else {
        restOfFinasNumber = lastPartName.replace(partNum, '');
        partNum = partNum + 1;

      }

      autoId = restOfFinasNumber + "" + partNum;

    }



    control.push(
      this.fb.group({
        finasid: [autoId]
      }))

    console.log(control);
    console.log(control.controls);
    console.log(control.controls.length);

  }

  addRow() {
    var req = Validators.compose([Validators.required]);

    var testArr = [1]

    const row = this.fb.group({
      // finasid: ['',req],
      partnumber: ['', req],
      description: ['', req],
      zgs: ['', req],
      // issueslipno: ['',req],
      quantity: [''],
      nmcsPartFinas: this.fb.array([]),
    });

    this.rowForms.push(row);
  }

  deleteRow(i) {
    this.rowForms.removeAt(i);
  }
  ngOnInit() {

    // this.addFinasRow();
    //fetch department list


    this.ds.makeapi(this.listdept, '', "post")
      .subscribe(data => {
        this.deptList = data;
      },
        Error => {
          console.log(Error);
        });

    var usertype = "usertype=ProtoL4"
    this.ds.makeapi(this.listusers, usertype, "post")
      .subscribe(data => {
        this.l4Users = data;
      },
        Error => {
          console.log(Error);
        });
  }

  test() {

  }

  fetchDeptList() {
    let reqdata = "usertype=1";

    let url = this.savemcs;
    let data = this.form.value;



    reqdata = JSON.stringify(data);

    return this.postRequest(url, reqdata);



  }

  postRequest(url, reqdata) {
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


  saveData() {
    let reqdata = "usertype=1";

    let url = this.savemcs;

    let data = this.form.value;
    reqdata = JSON.stringify(data);

    return this.postRequest(url, reqdata);


  }

  getUserList() {
    let reqdata = "usertype=1";

    let url = this.savemcs;
    let data = this.form.value;

    reqdata = JSON.stringify(data);

    return this.postRequest(url, reqdata);
  }

  changeQuantity(event, index) {
    //get value
    var value = event.target.value;
    for (var i = 0; i < value; i++) {
      console.log(i)
      // this.addRow()
    }
  }


  submitForm() {
    $('#confirmSubmit').modal('show');
  }

  confirmSubmit() {
    // this.name.setValue('Nancy');
    console.log(this.form);
    for (var i = 0; i < this.form.value.nmcsParts.length; i++) {
      var nmcsPart = this.form.value.nmcsParts[i];
      this.form.value.nmcsParts[i]['quantity'] = nmcsPart['nmcsPartFinas'].length;
    }

    console.log(this.form.value);

    if (this.form.valid) {
      this.loading = true;

      this.saveData().subscribe(data => {
        if (data.status == "Success") {
          this.loading = false;
          // this.notifier.notify('success', 'Form Submitted Successfully!');
          $.notify('NMCS Form Submitted Successfully!', "success");
          $('#confirmSubmit').modal('hide');
          this._location.back();
          this.form.reset()
        } else if (data.status == 'Failure') {
          // this.notifier.notify('error', 'Form Submition Failed!');
          $.notify('Server error, Please try again!', "error");
          $('#confirmSubmit').modal('hide');
          this.loading = false;
        }
        else {
          $.notify('Form Submition Failed!', "error");
          $('#confirmSubmit').modal('hide');
        }
      },
        Error => {
          this.loading = false;
          console.log(Error);

        });
    } else {
      this.loading = false;
      // this.notifier.notify('error', 'Invalid Form! Please enter the correct data');
      $.notify('Invalid Form! Please enter the correct data', "error");
      $('#confirmSubmit').modal('hide');
      console.log(this.ds.findInvalidControls(this.form));
      // console.log(this.ds.findInvalidControlsRecursive(this.form));
      for (var i = 0; i < this.form.get('nmcsParts').value.length; i++) {
        console.log(this.ds.findInvalidControls(this.form.get('nmcsParts').get('' + i)))

      }
    }


  }
  nospace(event: any) {
    const pattern = /^\S*$/
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  keyAlpha(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  addsto() {
    this.router.navigate(['dashboard/mcsnew'], {});
  }
  upload() {
    //navigate to new page for file upload
    //nmcsupload
    this.router.navigate(['dashboard/nmcsupload'], {
      queryParams: { type: 'nmcs' }
    });
  }
  nmcslist() {
    this.router.navigateByUrl('/dashboard/mcslist');
  }



  stoPartsArr = [];
  form_id: any;
  fetchFormDetails(formid) {
    var urlValue = this.appconstant + 'nmcs/get';
    var submitData = "formid=" + formid;
    this.ds.makeapi(urlValue,submitData, 'post')
      .subscribe(data2 => {
        //show information in screen.
        //show approval and reject
        console.log(data2)
        var patchValue = data2;
        this.form_id = data2['id'];
        // this.status = data2['status'];

        this.form.reset();
        this.form.patchValue(patchValue);
        var stoParts = data2['nmcsParts'];
        var stoObj = {};
        this.stoPartsArr = stoParts;
        for (var i = 0; i < stoParts.length; i++) {
          stoObj[i] = stoParts[i];
        }

        var vKeys = Object.keys(stoObj);
        for (var vk of vKeys) {
          var vendors = stoObj[vk];
          console.log(vendors)
          this.addRow1(vendors);
        }
        Error => {

        };

      })
  }

  formId: any;
  setToken(formId) {
    this.formId = formId;
    this.fetchFormDetails(this.formId);
  }

  addRow1(data) {
    var req = Validators.compose([Validators.required]);

    var testArr = [1]

    const row = this.fb.group({
      // finasid: ['',req],
      id: [data['id']],
      partnumber: [data['partnumber']],
      description: [data['description']],
      zgs: [data['zgs'], req],
      // issueslipno: ['',req],
      quantity: [data['quantity']],
      nmcsPartFinas: this.fb.array([]),
    });
    for (var finasId of data['nmcsPartFinas']) {
      row.get('nmcsPartFinas').push(this.fb.group({
        id: [finasId['id']],
        finasid: [finasId['finasid']],
      }));
    }
    this.rowForms1.push(row);
  }
  get rowForms1() {
    return this.form.get('nmcsParts') as FormArray;

  }

}
