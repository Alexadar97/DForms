import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
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
  selector: 'app-misedit',
  templateUrl: './misedit.component.html',
  styleUrls: ['./misedit.component.css']
})
export class MiseditComponent implements OnInit {

  private readonly notifier: NotifierService;
  private appconstant = this.ds.appconstant;
  numbervalidation = /^[0][1-9]\d{9}$|^[1-9]\d{9}$/;
  private misSaveAPI = this.appconstant + 'mis/save';
  private checkSingleAPI = this.appconstant + 'mis/checkSinglePart';

  form: FormGroup;
  isStoreUser = false;
  fb = null
  p1 = 1;
  usertype: any;
  loading = false;
  constructor(notifierService: NotifierService, fb: FormBuilder, private http: Http, private router: Router, private route: ActivatedRoute, private _location: Location, private ds: DataserviceService) {
    this.fb = fb;
    this.notifier = notifierService;
    this.notifier = notifierService;
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    this.usertype = jsonData['usertype'];
    var req = Validators.compose([Validators.required]); var num = Validators.compose([Validators.required, Validators.pattern(this.numbervalidation)]);
    this.form = fb.group({
      id: [this.form_id],
      project: ['', req],
      purpose: ['', req],
      hrid: ['', req],
      contactno: ['', req],
      reqremarks: ['', req],
      storeremarks: [''],
      misParts: fb.array([]),
    });
  }
  get rowForms() {
    return this.form.get('misParts') as FormArray;
  }

  goBack() {
    this._location.back();
  }


  ngOnInit() {
    var value = this.route.queryParams
      .subscribe(params => {
        this.setToken(params.id);
      });
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
  addrow=0
  addRow(data) {
    this.addrow++
    var req = Validators.compose([Validators.required]);
    var nonZero = Validators.compose([Validators.required, Validators.pattern(zeroValidation)]);
    var zeroValidation = /^(?=.*\d)(?=.*[1-9]).{1,10}$/;
    const row = this.fb.group({
      id: [data['id']],
      ascorderview: [this.addrow],
      partnumber: [data['partnumber'], req],
      description: [data['description'], req],
      zgs: [data['zgs'], req],
      quantity: [data['quantity'], req],
      partavailable: [data['partavailable'], req],
      partremarks: [data['partremarks'], req],
    });
    this.rowForms.push(row);
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


  PartAvailable: any;
  PartAvailableval: any;
  PartNotAvailableval: any;
  PartZGSeval: any;
  form_id: any;
  part_id: any;
  misformid: any;
  status: any;
  issuedqty: any;
  misPartsArr = [];
  PartAvailableArr: [];
  fetchFormDetails(formid) {
    var urlValue = this.appconstant + 'mis/get';
    var submitData = "formid=" + formid;
    this.ds.makeapi(urlValue, submitData,'post')
      .subscribe(data2 => {
        //show information in screen.
        //show approval and reject
        console.log(data2)
        var patchValue = data2;
        this.form_id = data2['id'];
        this.status = data2['status'];

        this.form.reset();
        this.form.patchValue(patchValue);
        var misParts = data2['misParts'];

        this.misPartsArr = misParts;
        for (var i = 0; i < misParts.length; i++) {
          var misObj = misParts[i];
          if (misParts[i].partavailable == 'partavailable') {
            misParts[i].partavailable = 'This part is available';
          }
          else if (misParts[i].partavailable == 'partnotavailable') {
            misParts[i].partavailable = 'This part is not available';
          }
          else if (misParts[i].partavailable == 'zgsmismatch') {
            misParts[i].partavailable = 'ZGS Mismatch';
          }
          else if (misParts[i].partavailable == 'qtynotavailable') {
            misParts[i].partavailable = 'Quantity is not available';
          }
          this.addRow(misObj);
        }

      }, Error => {

      });

  }
  formId: any;
  setToken(formId) {
    this.formId = formId;
    this.fetchFormDetails(this.formId);
  }
  saveMIS() {
    let reqdata = "";
    let url = this.misSaveAPI;
    let data = this.form.value;

    for (var i = 0; i < data.misParts.length; i++) {
      // this.partavailablevalue = data.misParts[i].partavailable;
      if (data.misParts[i].partavailable == 'This part is available') {
        data.misParts[i].partavailable = 'partavailable';
      }
      else if (data.misParts[i].partavailable == 'This part is not available') {
        data.misParts[i].partavailable = 'partnotavailable';
      }
      else if (data.misParts[i].partavailable == 'ZGS Mismatch') {
        data.misParts[i].partavailable = 'zgsmismatch';
      }
      else if (data.misParts[i].partavailable == 'Quantity is not available') {
        data.misParts[i].partavailable = 'qtynotavailable';
      }
      
    }

    reqdata = JSON.stringify(data);
    console.log(reqdata)
    
    return this.postRequest(url, reqdata);
  }

  submitForm() {
    $('#confirmSubmit').modal('show');
  }
  confirmSubmit() {
    // console.log(this.findInvalidControls(this.form));
    // for (var i = 0; i < this.form.value.misParts.length; i++) {
    //   var misPart = this.form.value.misParts[i];
    //   this.form.value.misParts[i]['quantity'] = misPart['misPartFinas'].length;
    // }
    // for(var i=0;i<this.form.get('misParts').value.length;i++){
    //   console.log(this.findInvalidControls(this.form.get('misParts').get(''+i)))
    //   var misPartsLength = this.form.get('misParts').get(''+i).get('misPartFinas').value.length;
    //   this.form.get('misParts').get(''+i).patchValue({'quantity':misPartsLength});

    // }
    console.log(this.form);
    
    if (this.form.valid) {
      this.saveMIS().subscribe(data => {
        if (data.status === "Success") {
          // this.loading = false;
          this.ds.notify('MIS Form Submitted successfully !!', "success");
          $('#confirmSubmit').modal('hide');
          this._location.back();
          this.form.reset()
        } else {
          $.notify('Form Submition Failed!', "error");
          $('#confirmSubmit').modal('hide');
          // this.loading = false;
        }
      },
        Error => {
          // this.loading = false;
          console.log(Error);
        });
    } else {
      this.loading = false;
      $.notify('Invalid Form! Please enter the correct data!', "error");
      $('#confirmSubmit').modal('hide');
    }
  }

  singlepartvalue;;
  partvalue;
  value;
  issinglepart = false;

  checkforempty(obj) {
    return (obj != "" || obj.length > 0)
  }

  nextLibAvailable(rowValue) {
    return !(this.checkforempty(rowValue.partnumber) && this.checkforempty(rowValue.zgs) && this.checkforempty(rowValue.quantity))
  }
  checkavailclick = false;
  partno: any;
  zgsvalue: any;
  quantityval: any;
  singlepartobj;
  checksinglepart(j) {
  
    this.loading = true;

    // for (var x = 0; x < this.rowForms.value.length; x++) {
      // if (j == x) {
        this.partno = this.rowForms.controls[j]['value']['partnumber'];
        this.zgsvalue = this.rowForms.controls[j]['value']['zgs'];
        this.quantityval = this.rowForms.controls[j]['value']['quantity'];
      // }
    // }

    var singlepartobj = { 'partnumber': this.partno, 'zgs': this.zgsvalue, 'quantity': this.quantityval };

    this.ds.makeapi(this.checkSingleAPI,singlepartobj, "postjson")
      .subscribe(data => {
        this.loading = false;
        this.singlepartvalue = data;
        if (this.singlepartvalue.partavailable == 'partavailable') {
          this.partvalue = 'This part is available';
        }
        else if (this.singlepartvalue.partavailable == 'partnotavailable') {
          this.partvalue = 'This part is not available';
          console.log(this.partvalue)
        }
        else if (this.singlepartvalue.partavailable == 'qtynotavailable') {
          this.partvalue = 'Quantity is not available';
          console.log(this.partvalue)
        }
        else if (this.singlepartvalue.partavailable == 'zgsmismatch') {
          this.partvalue = 'ZGS Mismatch';
          console.log(this.partvalue)
        }
        
        this.checkavailclick = true;
        this.rowForms.controls[j].patchValue({
          partavailable:this.partvalue
        })  
      },

        Error => {
        })

  }
  materialnewlist() {
    this.router.navigate(['dashboard/materialissueslipnew'], {});
  }

  uploadpart() {
    this.router.navigate(['dashboard/materialissueslipupload'], {
      queryParams: { type: 'mis' }
    });
  }
}