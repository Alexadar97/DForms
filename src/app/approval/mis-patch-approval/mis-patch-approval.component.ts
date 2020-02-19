import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/filter';
import { DataserviceService } from '../../dataservice.service';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/finally';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
declare var $, moment;
@Component({
  selector: 'app-mis-patch-approval',
  templateUrl: './mis-patch-approval.component.html',
  styleUrls: ['./mis-patch-approval.component.css']
})
export class MisPatchApprovalComponent implements OnInit {
  appconstant = this.ds.appconstant;
  formId = null;
  form: FormGroup;
  approvalForm: FormGroup;
  formStatus = null;
  formType = null;
  isApproved = false;
  isPending = false;
  loading = false;
  today = new Date();
  private challanNoAPI = this.ds.appconstant + 'materialdispatch/generateChallanNo';
  constructor(private fb: FormBuilder, private router: Router, private ds: DataserviceService, notifierService: NotifierService, private route: ActivatedRoute, private http: Http) {
    var userDetails = localStorage.getItem("Daim-forms");
    var userJson = JSON.parse(userDetails);
    var req = Validators.compose([Validators.required]);
    this.approvalForm = fb.group({
      remarks: ['', Validators.compose([Validators.required])],
    });

    this.form = this.fb.group({
      id: [null],
      requesterid: [],
      costcenter: [],
      l4: [],
      l3: [],
      createddate: [],
      mdformid: [],
      requestername: [],
      dispatchpurpose: [],
      transportmode: [],
      sapreference: [],
      otherstext: [],
      recipientname: [],
      recipientaddress: [],
      state: [],
      statecode: [],
      gstinuniqueno: [],
      preparedby: [],
      vehicleno: [''],
      department: [''],
      contactno: [''],
      hrid: [''],
      expectchallandate: [],
      returnOrNonReturn: [],
      expectedreturndate: [],
      expectedscrappingdate: [],
      purposeofshipment: [],
      storeremarks:[],
      status: [],
      reqremarks:[],
      l4remarks: [],
      materialDispatchParts: this.fb.array([]),

    });
  }

  ngOnInit() {

    var token = this.route.snapshot.params['token'];
    this.setToken(token);
  }

  formTypes: any;
  SetToken: any;
  isexpired: any;
  setToken(token) {
    this.SetToken = token;
    var token_url = this.ds.appconstant + 'approval/get';
    var submitData = 'token=' + token;
    this.ds.makeapi(token_url,submitData, 'post')
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
  patchValue: any;
  misPartsArr = [];
  saprefVal: any;
  purposeofshipmentVal: any;
  sapreference = [];
  sapreferenceArrList = [];
  purposeofshipment = [];
  purposeofshipmentArrlist = [];
  expectedreturndate: any;
  expectedscrappingdate: any;
  purposeofship: any
  sapotherstext: any;
  transportmode: any;
  createddate: any;
  fetchFormDetails(formtype, formid) {
    var urlValue = this.appconstant + formtype + '/get';
    var submitData = 'formid=' + formid;
    this.ds.makeapi(urlValue,submitData, 'post')
      .subscribe(data2 => {
        this.formType = formtype;
        var editObj = data2;
        console.log(editObj);
        this.form = this.fb.group({
          id: [this.formId],
          formId: [editObj.id],
          createddate: [],
          mdformid: [],
          requestername: [],
          requesterid: [],
          costcenter: [],
          l4: [],
          l3: [],
          dispatchpurpose: [],
          transportmode: [],
          sapreference: [],
          otherstext: [],
          recipientname: [],
          recipientaddress: [],
          state: [],
          statecode: [],
          gstinuniqueno: [],
          preparedby: [],
          vehicleno: [''],
          department: [''],
          contactno: [''],
          hrid: [''],
          l4remarks: [],
          expectchallandate: [],
          ReturnOrNonReturn: [],
          expectedreturndate: [],
          expectedscrappingdate: [],
          storeremarks:[],
          reqremarks:[],
          purposeofshipment: [],
          status: [editObj.status],
          materialDispatchParts: this.fb.array([]),

        });
        /* show information in screen.*/
        /*show approval and reject*/

        this.patchValue = data2;
        this.form.patchValue(this.patchValue);

        this.expectedscrappingdate = data2['expectedscrappingdate'];
        this.expectedreturndate = data2['expectedreturndate'];
        this.purposeofship = data2['purposeofshipment'];
        this.sapotherstext = data2['otherstext'];
        this.createddate = data2['createddate'];
        this.transportmode = data2['transportmode'];

        // show the value in list SAP Reference of Original Document

        this.sapreference = [];
        this.sapreferenceArrList = []
        this.saprefVal = this.patchValue.sapreference;
        this.sapreference.push(this.saprefVal);
        for (var i = 0; i < this.sapreference.length; i++) {
          for (var j = 0; j < this.sapreference[i].split(",").length; j++) {
            this.sapreferenceArrList.push(this.sapreference[i].split(",")[j]);
          }
          console.log(this.sapreferenceArrList)
        }
        // show the value in list Purpose of Shipment
        this.purposeofshipment = [];
        this.purposeofshipmentArrlist = []
        if (this.patchValue.returnOrNonReturn == '0') {
          this.purposeofshipmentVal = this.patchValue.purposeofshipment;
          this.purposeofshipment.push(this.purposeofshipmentVal);
          for (var i = 0; i < this.purposeofshipment.length; i++) {
            for (var j = 0; j < this.purposeofshipment[i].split(",").length; j++) {
              this.purposeofshipmentArrlist.push(this.purposeofshipment[i].split(",")[j]);
            }
            console.log(this.purposeofshipmentArrlist)
          }
        }

        var misdispatchparts = data2['materialDispatchParts'];
        this.misPartsArr = misdispatchparts;
        for (var i = 0; i < misdispatchparts.length; i++) {
          var partObj = misdispatchparts[i];
          this.addRow(partObj);
        }
      }, Error => {

      });

  }
  get rowForms() {
    return this.form.get('materialDispatchParts') as FormArray;
  }
  addRow(data) {
    //if store - use all params
    const row = this.fb.group({
      partnumber: [data['partnumber']],
      description: [data['description']],
      hsncode: [data['hsncode']],
      quantity: [data['quantity']],
      unit: [data['unit']],
      rateperitem: [data['rateperitem']],
      taxablevalue: [data['taxablevalue']],
      cgstrate: [data['cgstrate']],
      cgstamt: [data['cgstamt']],
      sgstrate: [data['sgstrate']],
      sgstamt: [data['sgstamt']],
      igstrate: [data['igstrate']],
      igstamt: [data['igstamt']],
    });
    this.rowForms.push(row);
  }



  acceptForm(result) {
    if (this.approvalForm.valid) {
      var formStatus = this.form.value.status;
      var resultType = '';
      if (formStatus == 'pending') {
        if (result) {
          resultType = 'l4approved';
        }
        else {
          resultType = 'l4rejected';
        }
      }

      else if (formStatus == 'l4approved') {
        if (result) {
          resultType = 'l3approved';
        }
        else {
          resultType = 'l3rejected';
        }
      }
      else if (formStatus == 'packsubmitted') {
        if (result) {
          resultType = 'l4dispatchapproved';
        }
        else {
          resultType = 'l4dispatchrejected';
        }
      }
      var remarks = this.approvalForm.value.remarks;
      var usertype = this.patchValue.deputyapprovertype
      var submitData = "formid=" + this.formId + "&status=" + resultType + "&remarks=" + remarks + "&usertype=" + usertype;
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
                if(resultType == "l4dispatchapproved"){
                  var submitData = "formid=" + this.formId;
                  this.ds.makeapi(this.challanNoAPI, submitData, "post")
                    .subscribe(data4 => {
                    
                      if (data4.status == 'Success') {
                        this.router.navigate(['location_approval'], { queryParams: { id: id } });
                      }
                      else {
                        this.router.navigate(['location_approval'], { queryParams: { id: id } });
                      }
                    },
                      Error => {
                      });
                }
                else{
                  if (data3.status == 'Success') {
                    this.router.navigate(['location_approval'], { queryParams: { id: id } });
                  }
                  else {
                    this.router.navigate(['location_approval'], { queryParams: { id: id } });
                  }
                }
              
              })
          }

        }, Error => {

        });
    }
    else {
      $.notify('Remarks is required', "error");
    }
  }






}
