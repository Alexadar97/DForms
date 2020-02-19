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
import { ConditionalExpr } from '@angular/compiler';
declare var $
@Component({
  selector: 'app-materialissueslipedit',
  templateUrl: './materialissueslipedit.component.html',
  styleUrls: ['./materialissueslipedit.component.css']
})
export class MaterialissueslipeditComponent implements OnInit {

  private readonly notifier: NotifierService;

  numbervalidation = /^[0][1-9]\d{9}$|^[1-9]\d{9}$/;


  form: FormGroup;
  remarkForm: FormGroup;
  private appconstant = this.ds.appconstant;
  fb = null
  p1 = 1;
  usertype: any;
  loading = false;
  isStoreUser = false;
  isStorereq = false;
  private excelPartsDownload = this.appconstant + 'mis/downloadPartsExcel';
  constructor(notifierService: NotifierService, fb: FormBuilder, private http: Http, private router: Router, private route: ActivatedRoute, private _location: Location, private ds: DataserviceService) {
    this.fb = fb;
    this.notifier = notifierService;
    this.notifier = notifierService;
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    this.usertype = jsonData['usertype'];
    var req = Validators.compose([Validators.required]); var num = Validators.compose([Validators.required, Validators.pattern(this.numbervalidation)]);
    this.form = fb.group({
      project: [''],
      purpose: [''],
      hrid: [''],
      contactno: [''],
      reqremarks: [''],
      misParts: fb.array([]),
    });
    this.remarkForm = fb.group({
      storeremarks: ['', req],

    });
  }
  get rowForms() {
    return this.form.get('misParts') as FormArray;
  }

  goBack() {
    this._location.back();
  }

  addRow(data) {
    if (data.issuedzgs == 0 || data.issuedzgs == 'null' || data.issuedzgs == '0') {
      var issuedzgs = ''
    } else {
      issuedzgs = data.issuedzgs
    }
    var req = Validators.compose([Validators.required]);
    var nonZero = Validators.compose([Validators.required, Validators.pattern(zeroValidation)]);
    var zeroValidation = /^(?=.*\d)(?=.*[1-9]).{1,10}$/;
    const row = this.fb.group({
      id: [data['id']],
      partnumber: [data['partnumber']],
      description: [data['description']],
      zgs: [data['zgs']],
      issuedzgs: issuedzgs,
      quantity: [data['quantity']],
      partavailable: [data['partavailable']],
      location: [data['location'], req],
      issuedqty: [data['issuedqty']],
      partremarks: [data['partremarks']],
      // status: [data['status']],
      misPartFinasIds: this.fb.array([])
    });

    // row.get('misPartFinasIds')
    for (var finasId of data['misPartFinasIds']) {
      // var finasId = data['misPartFinasIds'][finasIdIndex];

      row.get('misPartFinasIds').push(this.fb.group({
        id: [finasId['id']],
        mispartid: [finasId['mispartid']],
        finasid: [finasId['finasid']],
      }));

    }


    this.rowForms.push(row);
    console.log(this.rowForms)
  }
  deleteRow(j) {
    this.rowForms.removeAt(j);
  }
  addvalue = [];
  buttondisabled = false;
  finasidchecked;
  validatefinasid = [];
  addPart(misfinasidcontrol, mispartsvalue, index) {
    // this.addvalue.push(index);
    // console.log(this.addvalue)

    console.log(this.finasidchecked)
    var req = Validators.compose([Validators.required]);
    if (mispartsvalue.quantity > misfinasidcontrol.value.length) {
      misfinasidcontrol.push(

        this.fb.group({
          finasid: ['', req]
        }))
    }
    else {
      $("#addpartbtn" + index).attr("disabled", true);
    }

    // if (misfinasidcontrol.value.length == mispartsvalue.quantity) {
    //   this.buttondisabled = true;
    // }
    // else {
    //   this.buttondisabled = false;
    // }

  }

  removePart(misfinasidcontrol, mispartsvalue, index) {
    misfinasidcontrol.removeAt(misfinasidcontrol.length - 1);


    $("#addpartbtn" + index).attr("disabled", false)


  }
  ngOnInit() {
    this.initiateBtn = false
    this.loading = true;
    var value = this.route.queryParams
      .subscribe(params => {
        this.setToken(params.id);
      });
      
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    var userShortId = jsonData['shortid'];
    console.log("userShortId=" + userShortId)
    let reqdata = "userid=" + userShortId;
    // let reqdata = "usertype=SM";
    var usertype = '';

    if (jsonData['usertype']) {
      usertype = jsonData['usertype'].toLowerCase();
      this.usertype = usertype
    }

    if (usertype === "store") {
      this.status = 'store'
      this.isStoreUser = true;
    } else if (usertype === "admin") {
      this.status = 'admin'
      // this.isStoreUser = true;
    }
    else if (usertype === "requster") {
      this.status = ''
      this.isStorereq = true;
    }
    else {
      this.status = '';
    }
    this.loading = false;
  }
  AllowNumber(event: any) {
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
  relocatestatus: any;
  issuedqty: any;
  misPartsArr = [];
  patchValue: any;
  PartAvailableArr: [];
  initiateBtn=false
  fetchFormDetails(formid) {
    var urlValue = this.appconstant + 'mis/get';
    var submitData = "formid=" + formid;
    this.ds.makeapi(urlValue, submitData, 'post')
      .subscribe(data2 => {
        this.misPartsArr = []
        //show information in screen.
        //show approval and reject
        console.log(data2)
        this.patchValue = data2;
        this.form_id = data2['id'];
        this.status = data2['status'];

        // this.form.reset();
        // this.rowForms.reset();

        this.form.patchValue(this.patchValue);

        var misParts = data2['misParts'];

        this.misPartsArr = misParts;
           
        // if (localStorage.getItem('isInitiating') == "true" || localStorage.getItem('isInitiating') == "") {
        //   localStorage.setItem('isInitiating', "");
        // } else {
          if(this.initiateBtn == false){
            for (var i = 0; i < misParts.length; i++) {
              var misObj = misParts[i];
              this.part_id = misParts[i]['id'];
              this.misformid = misParts[i]['misformid'];
              this.relocatestatus = misParts[i]['status'];
              this.addRow(misObj);
            // }
          }
          }
      }, Error => {

      });
  }
  formId: any;
  setToken(formId) {
    this.formId = formId;
    
    this.fetchFormDetails(this.formId);
  }

  resendarr = []
  misresend() {

    for (var i = 0; i < this.form.value.misParts.length; i++) {
      var misPart = this.form.value.misParts[i];
      this.form.value.misParts[i]['issuedqty'] = misPart['misPartFinasIds'].length;
    }
    for (var x = 0; x < this.rowForms.value.length; x++) {
      this.resendarr.push({
        id: this.rowForms['value'][x]['id'],
        misformid: this.misformid,
        partnumber: '' + this.rowForms['value'][x]['partnumber'],
        description: '' + this.rowForms['value'][x]['description'],
        zgs: '' + this.rowForms['value'][x]['zgs'],
        issuedzgs: '' + this.rowForms['value'][x]['issuedzgs'],
        quantity: '' + this.rowForms['value'][x]['quantity'],
        issuedqty: '' + misPart['misPartFinasIds'].length,
        misPartFinasIds: this.rowForms['value'][x]['misPartFinasIds'],
        partavailable: '' + this.rowForms['value'][x]['partavailable'],
        location: '' + this.rowForms['value'][x]['location'],
        partremarks: '' + this.rowForms['value'][x]['partremarks'],
      })
      console.log(this.resendarr)
    }
    console.log(this.form);
    if (this.remarkForm.valid) {

      var urlValue = this.appconstant + 'mis' + '/updateParts';
      this.ds.makeapi(urlValue, this.resendarr, 'postjson')
        .subscribe(data => {
          if (data.status == 'Success') {
            this.loading = false;
            var storeRemarks = this.remarkForm.value.storeremarks;
            var submitData = "formid=" + this.form_id + "&status=resent" + "&remarks=" + storeRemarks;
            var urlValue = this.appconstant + 'mis' + '/updateFormStatus';
            this.ds.makeapi(urlValue, submitData, 'post')
              .subscribe(data => {
                if (data.status == 'Success') {
                  this.loading = false;
                  $.notify('MIS Form Resend', "success");
                  this.router.navigate(['dashboard/materialissuesliplist']);
                } else {
                  this.router.navigate(['dashboard/materialissuesliplist']);
                }
                this.loading = false;
              }, Error => {

              });
          }
          Error => {

          };
        })
    }
    else {
      $.notify('Remarks is required', "error");

    }
  }

  submitClose() {
    $('#close').modal('show');
  }

  close() {

    if (this.remarkForm.valid) {
      this.loading = true;
      var storeRemarks = this.remarkForm.value.storeremarks;
      var submitData = "formid=" + this.form_id + "&status=closed" + "&remarks=" + storeRemarks;
      var urlValue = this.appconstant + 'mis' + '/updateFormStatus';
      this.ds.makeapi(urlValue, submitData, 'post')
        .subscribe(data => {
          if (data.status == 'Success') {
            this.loading = false;
            $.notify('MIS Form Closed', "success");
            $('#close').modal('hide');
            this.router.navigate(['dashboard/materialissuesliplist']);
          } else {
            this.router.navigate(['dashboard/materialissuesliplist']);
          }
        }, Error => {
          this.loading = false;
        });
    }
    else {
      $.notify('Remarks is required', "error");
      $('#close').modal('hide');
    }
  }
  exceldownlaod(filename) {
    this.loading = true;
    var urlValue = this.appconstant + 'mis' + '/downloadPartsExcel';
    var submitData = "formid=" + this.form_id;
    this.ds.method(urlValue, submitData, 'downloadfileUrlencode')
      .subscribe(res => {
        this.loading = false;
        if (window.navigator.msSaveOrOpenBlob) {
          var fileData = [res.data];
          var blobObject = new Blob(fileData);
          window.navigator.msSaveOrOpenBlob(blobObject, filename);
          window.navigator.msSaveOrOpenBlob(blobObject, filename);
        } else {
          var url = window.URL.createObjectURL(res.data);
          var a = document.createElement('a');
          document.body.appendChild(a);
          a.setAttribute('style', 'display: none');
          a.href = url;
          a.download = res.filename;
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove(); // remove the element
        }

      },
        Error => {
        });
  }
  finsidval = []
  partsArr = [];
  filename
  initiatepartpick(filename) {
    this.initiateBtn = true
    this.filename = filename
    localStorage.setItem('isInitiating', "true");
    this.partsArr = [];
    for (var i = 0; i < this.form.value.misParts.length; i++) {
      var misPart = this.form.value.misParts[i];
      this.form.value.misParts[i]['issuedqty'] = misPart['misPartFinasIds'].length;
    }
    this.finasidchecked = this.rowForms.value;
    for (var i = 0; i < this.finasidchecked.length; i++) {
      this.validatefinasid = this.finasidchecked[i].misPartFinasIds;
    }

    for (var x = 0; x < this.rowForms.value.length; x++) {
      this.partsArr.push({
        id: this.rowForms['value'][x]['id'],
        misformid: this.misformid,
        partnumber: '' + this.rowForms['value'][x]['partnumber'],
        description: '' + this.rowForms['value'][x]['description'],
        zgs: '' + this.rowForms['value'][x]['zgs'],
        issuedzgs: this.rowForms['value'][x]['issuedzgs']!=null?this.rowForms['value'][x]['issuedzgs']:'',
        quantity: '' + this.rowForms['value'][x]['quantity'],
        issuedqty: null + misPart['misPartFinasIds'].length,
        misPartFinasIds: this.rowForms['value'][x]['misPartFinasIds'],
        partavailable: '' + this.rowForms['value'][x]['partavailable'],
        location: '' + this.rowForms['value'][x]['location'],
        partremarks: '' + this.rowForms['value'][x]['partremarks'],


      })
      console.log(this.partsArr);

    }
    if (this.remarkForm.valid && this.form.valid) {
      this.loading = true;

      var urlValue = this.appconstant + 'mis' + '/updateParts';
      this.ds.makeapi(urlValue, this.partsArr, 'postjson')
        .subscribe(data => {
          if (data.status == 'Success') {
            this.loading = false;
            var storeRemarks = this.remarkForm.value.storeremarks;
            var submitData = "formid=" + this.form_id + "&status=partspickinginitiated" + "&remarks=" + storeRemarks;
            var urlValue = this.appconstant + 'mis' + '/updateFormStatus';
            this.ds.makeapi(urlValue, submitData, 'post')
              .subscribe(data2 => {
                if (data2.status == 'Success') {
                  this.loading = false;
                  this.fetchFormDetails(this.form_id);
                  this.form.get('misParts').setValue([]);
                  debugger
                  this.exceldownlaod(filename)
                }
              }, Error => {

              });
          }
        },

          Error => {

          });
    }

    else {
      $.notify('Location and Remarks is required', "error");
      // for (var i = 0; i < this.form.get('stoParts').value.length; i++) {
      //   console.log(this.ds.findInvalidControls(this.form.get('stoParts').get('' + i)))

      // }
      console.log(this.ds.findInvalidControls(this.form));
      // console.log(this.ds.findInvalidControlsRecursive(this.form));
      for (var i = 0; i < this.form.get('misParts').value.length; i++) {
        console.log(this.ds.findInvalidControls(this.form.get('misParts').get('' + i)))

      }
    }
  }

  download(filename) {
    this.exceldownlaod(filename)
  }
  issuedzgsArry=[]
  partsfinasvalue = [];
  finasid(id) {
    console.log(id)
    for (var i = 0; i < this.misPartsArr.length; i++) {
      this.partsfinasvalue = this.misPartsArr[i]
    }
    this.partsfinasvalue = this.misPartsArr[id].misPartFinasIds
    $("#partsfinasvalue").modal("show")
  }
  lastpartpicking_Complete() {
    this.issuedzgsArry = []
    localStorage.setItem('isInitiating', "true");
    this.partsArr = [];
    for (var i = 0; i < this.form.value.misParts.length; i++) {
      var misPart = this.form.value.misParts[i];
      this.form.value.misParts[i]['issuedqty'] = misPart['misPartFinasIds'].length;
    }
    this.finasidchecked = this.rowForms.value;
    for (var i = 0; i < this.finasidchecked.length; i++) {
      this.validatefinasid = this.finasidchecked[i].misPartFinasIds;
    }

    for (var x = 0; x < this.rowForms.value.length; x++) {
      var empobj = this.rowForms.value[x]
      this.partsArr.push({
        id: this.rowForms['value'][x]['id'],
        misformid: this.misformid,
        partnumber: '' + this.rowForms['value'][x]['partnumber'],
        description: '' + this.rowForms['value'][x]['description'],
        zgs: '' + this.rowForms['value'][x]['zgs'],
        issuedzgs: this.rowForms['value'][x]['issuedzgs']!=null?this.rowForms['value'][x]['issuedzgs']:'',
        quantity: '' + this.rowForms['value'][x]['quantity'],
        issuedqty: '' + misPart['misPartFinasIds'].length,
        misPartFinasIds: this.rowForms['value'][x]['misPartFinasIds'],
        partavailable: '' + this.rowForms['value'][x]['partavailable'],
        location: '' + this.rowForms['value'][x]['location'],
        partremarks: '' + this.rowForms['value'][x]['partremarks'],


      })
      console.log(this.partsArr);
     if(empobj.issuedzgs == null || empobj.issuedzgs == 'null' || empobj.issuedzgs == ""){
       this.issuedzgsArry.push()
     }else{
      this.issuedzgsArry.push(1)
     }

    }
    if (this.validatefinasid.length == 0) {
      $.notify('Issued Quantity is required', "error");
    }

    else if (this.remarkForm.valid && this.issuedzgsArry.length != 0) {
      this.loading = true;

      var urlValue = this.appconstant + 'mis' + '/updateParts';
      this.ds.makeapi(urlValue, this.partsArr, 'postjson')
        .subscribe(data => {
          if (data.status == 'Success') {
            // this.initiatepart()
            this.loading = false;
            var storeRemarks = this.remarkForm.value.storeremarks;
            var submitData = "formid=" + this.form_id + "&status=partspickingcompleted" + "&remarks=" + storeRemarks;
            var urlValue = this.appconstant + 'mis' + '/updateFormStatus';
            this.ds.makeapi(urlValue, submitData, 'post')
              .subscribe(data2 => {
                if (data2.status == 'Success') {
                  this.loading = false;
                  $.notify('Parts Picking Completed!', "success");
                  this.router.navigate(['dashboard/materialissuesliplist']);
                } else {
                  this.router.navigate(['dashboard/materialissuesliplist']);
                }
              }, Error => {

              });
          }else{
            this.loading = false;
          }
        },

          Error => {

          });
    }

    else {
      // for (var i = 0; i < this.form.get('stoParts').value.length; i++) {
      //   console.log(this.ds.findInvalidControls(this.form.get('stoParts').get('' + i)))
      $.notify('Issued ZGS and Remarks is required', "error");
      // }
      console.log(this.ds.findInvalidControls(this.form));
      // console.log(this.ds.findInvalidControlsRecursive(this.form));
      for (var i = 0; i < this.form.get('misParts').value.length; i++) {
        console.log(this.ds.findInvalidControls(this.form.get('misParts').get('' + i)))

      }
    }
  }

  initiatepart() {
    if (this.remarkForm.valid) {
      var storeRemarks = this.remarkForm.value.storeremarks;
      var submitData = "formid=" + this.form_id + "&status=partspickingcompleted" + "&remarks=" + storeRemarks;
      var urlValue = this.appconstant + 'mis' + '/updateFormStatus';
      this.loading = true;
      this.ds.makeapi(urlValue, submitData, 'post')
        .subscribe(data => {
          if (data.status == 'Success') {
            this.loading = false;
            $.notify('Parts Picking Completed!', "success");
            this.router.navigate(['dashboard/materialissuesliplist']);
          } else {
            this.router.navigate(['dashboard/materialissuesliplist']);
          }
        }, Error => {
          this.loading = false;
        });
    }
    else {
      // $.notify('Please fill mandatory fields', "error");
    }
  }
  initiatepartcomplete() {
    this.lastpartpicking_Complete()

  }

  finasValArr = [];
  relocatesinglepart(arr_value) {
    localStorage.setItem('isInitiating', "true");

    var singlepart = {};
    this.loading = true;
    var value = this.form.value.misParts[arr_value];
    singlepart = {
      id: value.id,
      misformid: this.misformid,
      partnumber: value.partnumber,
      description: value.description,
      zgs: value.zgs,
      issuedzgs: value.issuedzgs,
      quantity: value.quantity,
      issuedqty: value.issuedqty,
      misPartFinasIds: value.misPartFinasIds,
      partavailable: value.partavailable,
      location: value.location,
      partremarks: value.partremarks
    }
    console.log(singlepart)

    var urlValue = this.appconstant + 'mis' + '/relocatePart';
    this.ds.makeapi(urlValue, singlepart, 'postjson')
      .subscribe(data => {
        this.loading = false;
        // this.form.reset();
        this.fetchFormDetails(this.form_id);
      });
    Error => {

    }
  }


  relocatetotalparts() {
    localStorage.setItem('isInitiating', "true");

    var partsArr = []
    for (var i = 0; i < this.form.value.misParts.length; i++) {
      var misPart = this.form.value.misParts[i];
      this.form.value.misParts[i]['issuedqty'] = misPart['misPartFinasIds'].length;
    }
    for (var x = 0; x < this.rowForms.value.length; x++) {
      var finasArr = [];
      for (var i = 0; i < misPart['misPartFinasIds'].length; i++) {
        finasArr.push(this.rowForms['value'][x]['misPartFinasIds'][i]);
      }
      partsArr.push({
        id: this.rowForms['value'][x]['id'],
        misformid: this.misformid,
        partnumber: '' + this.rowForms['value'][x]['partnumber'],
        description: '' + this.rowForms['value'][x]['description'],
        zgs: '' + this.rowForms['value'][x]['zgs'],
        issuedzgs: '' + this.rowForms['value'][x]['issuedzgs'],
        quantity: '' + this.rowForms['value'][x]['quantity'],
        issuedqty: '' + misPart['misPartFinasIds'].length,
        misPartFinasIds: this.rowForms['value'][x]['misPartFinasIds'],
        partavailable: '' + this.rowForms['value'][x]['partavailable'],
        location: '' + this.rowForms['value'][x]['location'],
        partremarks: '' + this.rowForms['value'][x]['partremarks'],


      })
      console.log(partsArr);
    }

    if (this.remarkForm.valid) {
      this.loading = true;
      var urlValue = this.appconstant + 'mis' + '/relocateParts';
      this.ds.makeapi(urlValue, partsArr, 'postjson')
        .subscribe(data => {
          if (data.status == 'Success') {
            var storeRemarks = this.form.value.storeremarks;
            var submitData = "formid=" + this.form_id + "&status=relocated" + "&remarks=" + storeRemarks;
            var urlValue = this.appconstant + 'mis' + '/updateFormStatus';
            this.ds.makeapi(urlValue, submitData, 'post')
              .subscribe(data2 => {
                if (data2.status == 'Success') {
                  this.loading = false;
                  this.router.navigate(['dashboard/materialissuesliplist']);
                  this.remarkForm.reset()
                }
              }, Error => {

              });
          }
        });
      Error => {
      }
    }
    else {
      $.notify('Remarks is required', "error");
    }
  }
  acknowledgement() {
    if (this.remarkForm.valid) {
      var storeRemarks = this.remarkForm.value.storeremarks;
      this.loading = true;
      var submitData = "formid=" + this.form_id + "&status=acknowledged" + "&remarks=" + storeRemarks;
      var urlValue = this.appconstant + 'mis' + '/updateFormStatus';
      this.ds.makeapi(urlValue, submitData, 'post')
        .subscribe(data => {
          if (data.status == 'Success') {
            this.loading = false;
            $.notify('MIS Form Acknowledged', "success");
            this.router.navigate(['dashboard/materialissuesliplist']);
          } else {
            this.router.navigate(['dashboard/materialissuesliplist']);
          }
        }, Error => {
          this.loading = false;
        });
    }
    else {
      $.notify('Remarks is required', "error");
    }
  }
  materialnewlist() {
    this.router.navigate(['dashboard/materialissueslipnew'], {});
  }
  uploadpart() {
    this.router.navigate(['dashboard/materialissueslipupload'], {
      queryParams: { type: 'mis' }
    });
  }
  mislist() {
    this.router.navigateByUrl('/dashboard/materialissuesliplist');
  }
}
