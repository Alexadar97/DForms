import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/filter';
import { DataserviceService } from '../dataservice.service';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/finally';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

@Component({
  selector: 'app-approval',
  templateUrl: './approval.component.html',
  styleUrls: ['./approval.component.css']
})
export class ApprovalComponent implements OnInit {
  formType = null
  form = null
  formId = null
  appconstant = this.ds.appconstant;
  isApproved = false;
  umcsPartsArr = []
  deptList = []

  private listdept = this.ds.appconstant + 'dept/list';
  // private updateLocationUrl = this.ds.appconstant + 'umcs/updateLocation';


  constructor(private route: ActivatedRoute, private ds: DataserviceService, private fb: FormBuilder, private http: Http, private router: Router) {

    // var userDetails = localStorage.getItem("Daim-forms");
    // var userJson = JSON.parse(userDetails);

    this.form = fb.group({
      creditorid: ['', Validators.compose([Validators.required])],
      deptid: [1],
      contactno: ['1'],
      storagePeriod: ['1'],
      storagePurpose: [''],
      deptname: [''],
      hrid: [null, Validators.compose([Validators.required])],
      approverid: [null, Validators.compose([Validators.required])],
      periodofstorage: [''],
      status: ['test'],
      umcsParts: fb.array([]),
    });



  }

  fetchFormDetails(formtype, formid) {
    var submitData = 'formid=' + formid
    var urlValue = this.appconstant + formtype + '/get';
    this.ds.makeapi(urlValue,submitData, 'post')
      .subscribe(data2 => {
        this.formType = formtype;
        //show information in screen.
        //show approval and reject
        var patchValue = data2;
        // var patchValue = {};

        // patchValue[]

        // this.form.patchValue(patchValue);

        // var umcsParts = data2['umcsParts'];
        // this.umcsPartsArr = umcsParts;

        // for (var i = 0; i < umcsParts.length; i++) {
        //   var umvsObj = umcsParts[i];
        //   this.addRow(umvsObj);
        // }

      }, Error => {

      });

  }

  acceptLocation() {
    var resArr = [];
    // var resObj = {};
    var partsFromForm = this.rowForms;
    for (var i = 0; i < this.umcsPartsArr.length; i++) {
      resArr.push({
        id: this.umcsPartsArr[i]['id'],
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

  setToken(token) {
    var url = this.ds.appconstant + 'approval/get';
    var submitData = 'token=' + token;
    this.ds.makeapi(url, submitData,'post')
      .subscribe(data => {

        this.formId = data['formid']
        // this.formId = data['id']

        this.fetchFormDetails(data['formtype'], this.formId);


      },
        Error => {
        });

  }

  ngOnInit() {
    //SAMPLE
    //http://13.234.64.82:8080/DaimForms/forms/umcs/get/11

    var token = this.route.snapshot.params['token'];
    this.setToken(token);

    this.ds.makeapi(this.listdept, '', "post")
      .subscribe(data => {
        this.deptList = data;
      },
        Error => {
        });

  }

  get rowForms() {
    return this.form.get('umcsParts') as FormArray;

  }

  addRow(data) {

    const row = this.fb.group({

      partnumber: [data['partnumber']],
      description: [data['description']],
      vehicleno: [data['vehicleno']],
      quantity: [data['quantity']],
      location: []

    });

    this.rowForms.push(row);
  }

  acceptForm(result) {
    var resultType = '';
    if (result) {
      resultType = 'approved';
    } else {
      resultType = 'rejected';
    }



    var submitData = "id=" + this.formId + "&status='" + resultType + "'";

    var urlValue = this.appconstant + this.formType + '/updateFormStatus/';
    this.ds.makeapi(urlValue, submitData, 'post')
      .subscribe(data2 => {

        var id = "tst";
        if (data2.status == "Success" && result) {
          // this.isApproved = true;
          this.router.navigate(['location_approval'], { queryParams: { id: id } });
        } else {
          this.router.navigate(['location_approval'], { queryParams: { id: id } });
        }


      }, Error => {

      });
  }








}
