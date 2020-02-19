import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import 'rxjs/add/operator/filter';
import { DataserviceService } from '../../dataservice.service';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/finally';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
declare var $

@Component({
  selector: 'app-sto-approval',
  templateUrl: './sto-approval.component.html',
  styleUrls: ['./sto-approval.component.css']
})
export class StoApprovalComponent implements OnInit {
  private readonly notifier: NotifierService;
  formType = null
  form = null
  approvalForm = null
  formId = null
  formStatus = null
  appconstant = this.ds.appconstant;
  isApproved = false;
  stoPartsArr = []
  deptList = []
  isPending = false
  loading = false;
  private listdept = this.ds.appconstant + 'dept/list';
  // private updateLocationUrl = this.ds.appconstant + 'umcs/updateLocation';

  constructor(private route: ActivatedRoute, private ds: DataserviceService, private fb: FormBuilder, private http: Http, private router: Router,notifierService: NotifierService) {
    this.notifier = notifierService;
    var userDetails = localStorage.getItem("Daim-forms");
    var userJson = JSON.parse(userDetails);

    var req = Validators.compose([Validators.required]);
    this.approvalForm = fb.group({
      remarks: ['', Validators.compose([Validators.required])],
    });

    this.form = this.fb.group({
      // costcenterid:['',req],
      id: this.formId,
      requestorid: [1, req],
      stoformid:[],
      formId: [''],
      contactno: ['', req],
      value:['',req],
      ionumber: [null],
      exigency: ['', req],
      remarks: [''],
      l4: [1, req],
      // l3: [1, req],
      status: ['', req],
      purpose: ['', req],
      createddate:[''],
      creditorname:[''],
      department:[''],
      l4remarks:[''],
      l3remarks:[''],
      stoParts: this.fb.array([]),
    });








  }

  patchValue:any;
  status:any;
  fetchFormDetails(formtype, formid) {
    var urlValue = this.appconstant + formtype + '/get';
    var submitData = 'formid=' + formid;
    this.ds.makeapi(urlValue, submitData,'post')
      .subscribe(data2 => {

        this.formType = formtype;
        var editObj = data2;
        this.status = editObj['status'];
        var req = Validators.compose([Validators.required]);

        this.form = this.fb.group({
          // costcenterid:['',req],
          id: this.formId,
          requestorid: [1, req],
          formId: [editObj.id],
          stoformid:[],
          contactno: [editObj.phonenumber, req],
          value:[editObj.value,req],
          ionumber: [null],
          exigency: [editObj.exigency, req],
          remarks: [''],
          l4: [1, req],
          // l3: [1, req],
          status: [editObj.status, req],
          purpose: [editObj.purpose, req],
          createddate:[''],
          creditorname:[''],
          department:[''],
          l4remarks:[''],
          stoParts: this.fb.array([]),
        });
        //show information in screen.
        //show approval and reject
        this.patchValue = data2;
        // if(this.patchValue['status'] == 'accepted'){
        //   this.isPending = true
        // }

        this.patchValue['remarks'] = '';

        this.form.patchValue(this.patchValue);

        var stoParts = data2['stoParts'];
        this.stoPartsArr = stoParts;

        for (var i = 0; i < stoParts.length; i++) {
          var umvsObj = stoParts[i];
          this.addRow(umvsObj);
        }



      }, Error => {

      });

  }

  acceptLocation() {
    var resArr = [];
    // var resObj = {};
    var partsFromForm = this.rowForms;
    for (var i = 0; i < this.stoPartsArr.length; i++) {
      resArr.push({
        id: this.stoPartsArr[i]['id'],
        location: partsFromForm.value[i]['location'],
      });
    }

    var updateLocationUrl = this.ds.appconstant + this.formType + '/updateLocation';

    this.ds.makeapi(updateLocationUrl, resArr, "postjson")
      .subscribe(data => {
        this.router.navigate(['location_approval']);

      },
        Error => {
        });

  }
  formTypes
  SetToken
  isexpired
  setToken(token) {
    this.SetToken = token
    var token_url = this.ds.appconstant + 'approval/get';
    var submitData = 'token=' + token;
    this.ds.makeapi(token_url, submitData,'post')
      .subscribe(data => {

        this.formId = data['formid']
        this.formStatus = data['status'];
        this.formTypes = data['type'];
        this.isexpired = data['isexpired']
        this.fetchFormDetails(data['formtype'], this.formId);


      },
        Error => {
        });

  }

  ngOnInit() {

    var token = this.route.snapshot.params['token'];
    this.setToken(token);

  }

  get rowForms() {
    return this.form.get('stoParts') as FormArray;

  }

  addRow(data) {
    var zeroValidation =/^(?=.*\d)(?=.*[1-9]).{1,10}$/;
    var req = Validators.compose([Validators.required]);
    var nonZero = Validators.compose([Validators.required,Validators.pattern(zeroValidation)]);
    const row = this.fb.group({

      partnumber: [data['partnumber'], req],
      description: [data['description'], req],
      unit: [data['unit'], req],
      reqquantity: [data['reqquantity'], nonZero],
      priceperpart:[data['priceperpart']],
      // projectid:[1,req],
      smid: [data['smid'], req],
      stoformid: [data['stoformid'], req],
      status: [data['status'], req],
      priceperqty: [data['priceperqty'], req],
      remarks: ['']


    });

    this.rowForms.push(row);
  }

  acceptForm(result) {
    if(this.approvalForm.valid){


    var formStatus = this.form.value.status;

    console.log(formStatus);
    var resultType = '';
    if (result) {
      if(formStatus == "exigencyrequest"){   //L4
        resultType = 'l4approved';
      }else if(formStatus == "l4approved"){ //l3
        resultType = 'l3approved';
      }

    } else {

      if(formStatus == "exigencyrequest"){
        resultType = 'l4rejected';
      }else if(formStatus == "l4approved"){
        resultType = 'l3rejected';
      }
    }
    console.log(this.form.value);


    var remarks = this.approvalForm.value.remarks;
    var usertype = this.patchValue.deputyapprovertype
    var submitData = "id=" + this.formId + "&status=" + resultType + "&remarks=" + remarks + "&usertype=" + usertype;
    var urlValue = this.appconstant + this.formType + '/updateFormStatus';
    this.loading = true;
    this.ds.makeapi(urlValue, submitData, 'post')
      .subscribe(data2 => {
        var id = "tst";
        if (data2.status == "Success") {
          this.loading = false;
          var submitData = 'token=' + this.SetToken;
          var token_url = this.ds.appconstant + 'approval/doExpired';
          this.ds.makeapi(token_url, submitData, 'post')
            .subscribe(data3 => {
              
              if (data3.status == 'Success') {
                this.router.navigate(['location_approval'], { queryParams: { id: id } });
              }
              else {
                this.router.navigate(['location_approval'], { queryParams: { id: id } });
              }
            })
        }


      }, Error => {

      });
  }
  else{
    // this.notifier.notify( 'error', 'Remarks is Invalid' );
    $.notify('Remarks is required', "error");
  }
}
}
