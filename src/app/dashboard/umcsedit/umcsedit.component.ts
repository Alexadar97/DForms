import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/filter';
import { DataserviceService } from '../../dataservice.service';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Location } from '@angular/common';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/finally';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
declare var $
@Component({
  selector: 'app-umcsedit',
  templateUrl: './umcsedit.component.html',
  styleUrls: ['./umcsedit.component.css']
})
export class UmcseditComponent implements OnInit {
  isStoreLogin = false;
  formType = null
  form = null
  formId = null
  appconstant = this.ds.appconstant;
  isApproved = false;
  umcsPartsArr = []
  isExpired = false;
  remarkForm: FormGroup;


  // private listdept = this.ds.appconstant + 'dept/list';
  // private updateLocationUrl = this.ds.appconstant + 'umcs/updateLocation';


  constructor(private _location: Location, private route: ActivatedRoute, private ds: DataserviceService, private fb: FormBuilder, private http: Http, private router: Router) {


    var userDetails = localStorage.getItem("Daim-forms");
    var userJson = JSON.parse(userDetails);

    this.form = fb.group({
      creditorid: [userJson.shortid, Validators.compose([Validators.required])],
      deptid: [1],
      contactno: ['1'],
      storagePeriod: ['1'],
      storagePurpose: [''],
      department: [''],
      hrid: [null, Validators.compose([Validators.required])],
      approverid: [null, Validators.compose([Validators.required])],
      periodofstorage: [''],
      status: ['test'],
      remarks: [''],
      umcsParts: fb.array([]),
    });



  }
  keyAlpha(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  fetchFormDetails(formtype, formid) {
    var urlValue = this.appconstant + formtype + '/get';
    var submitData = "formid=" + formid;
    this.ds.makeapi(urlValue, submitData,'post')
      .subscribe(data2 => {

        console.log(data2);
        var status = data2['status'];
        if (status == 'expired') {
          this.isExpired = true;
        }
        this.formType = formtype;
        //show information in screen.
        //show approval and reject
        var patchValue = data2;
        // var patchValue = {};


        // patchValue[]

        this.form.patchValue(patchValue);
        // 

        var umcsParts = data2['umcsParts'];
        this.umcsPartsArr = umcsParts;

        for (var i = 0; i < umcsParts.length; i++) {
          var umvsObj = umcsParts[i];
          this.addRow(umvsObj);
        }

      }, Error => {

      });

  }

  submitForm() {
    $('#confirmSubmit').modal('show');
  }



  loading = false
  acceptLocation() {
if(this.form.valid){
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
    this.loading = true
    this.ds.makeapi(updateLocationUrl, resArr, "postjson")
      .subscribe(data => {
        if (data.status == "Success") {
          this.loading = false
          // this.submitForm("closed")
          this.LocationStatus()
          $.notify('Location Updated!', "success");
          $('#confirmSubmit').modal('hide');
        }
        this.router.navigateByUrl("/dashboard/umcslist");

      },
        Error => {
        });
}
else{
  $.notify('Location is required', "error");
  $('#confirmSubmit').modal('hide');
}
  
  }


  setToken(formType, formId) {


    this.formId = formId;

    this.fetchFormDetails(formType, this.formId);

  }

  ngOnInit() {
    //SAMPLE
    //http://13.234.64.82:8080/DaimForms/forms/umcs/get/11

    // var token = this.route.snapshot.params['token'];
    // this.setToken(token);

    var value = this.route.queryParams
      .subscribe(params => {
        this.setToken(params.type, params.id);
      });



    // this.ds.makeapi(this.listdept, '', "post")
    //   .subscribe(data => {
    //     //  this.ds = data;
    //   },
    //     Error => {
    //     });

  }

  get rowForms() {
    return this.form.get('umcsParts') as FormArray;

  }

  addRow(data) {
    var req = Validators.compose([Validators.required]);
    const row = this.fb.group({

      partnumber: [data['partnumber']],
      description: [data['description']],
      vehicleno: [data['vehicleno']],
      quantity: [data['quantity']],
      location: [data['location'],req]

    });

    this.rowForms.push(row);
  }

  // submitForm(resultType) {


  //   var submitData = "id=" + this.formId + "&status=" + resultType + "&remarks=closed";
  //   var urlValue = this.appconstant + this.formType + '/updateFormStatus/';
  //   this.ds.makeapi(urlValue, submitData, 'post')
  //     .subscribe(data2 => {
  //       var id = "tst";

  //       if (data2.status == "Success") {
  //         // this.isApproved = true;
  //         this.router.navigate(['dashboard/umcslist'], { queryParams: { id: id } });
  //       } else {
  //         this.router.navigate(['dashboard/umcslist'], { queryParams: { id: id } });
  //       }


  //     }, Error => {

  //     });
  // }

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
          // this.router.navigate(['location_approval'], { queryParams: { id: id } });
        } else {
          // this.router.navigate(['location_approval'], { queryParams: { id: id } });
        }


      }, Error => {

      });
  }
  LocationStatus() {
    var getdata = this.form.value;
    if (((getdata.status == 'l4approved') && (getdata.storagePeriod == '1month')) || ((getdata.status == 'l3approved') && (getdata.storagePeriod == '2months')) || ((getdata.status == 'l2approved') && (getdata.storagePeriod == '3months'))) {
      var submitData = "id=" + this.formId + "&status=locationupdated" + "&remarks=";
    }
    else {
      var submitData = "id=" + this.formId + "&status=scrapmoved" + "&remarks=" + getdata.remarks;
    }
    // 
    // var submitData = "id=" + this.formId + "&status=scrapmoved" + "&remarks=";
    var urlValue = this.appconstant + this.formType + '/updateFormStatus/';
    this.ds.makeapi(urlValue, submitData, 'post')
      .subscribe(data2 => {
        var id = "tst";

        if (data2.status == "Success") {
          // this.isApproved = true;
          // this.router.navigate(['dashboard/umcslist'], { queryParams: { id: id } });
        } else {
          // this.router.navigate(['dashboard/umcslist'], { queryParams: { id: id } });
        }


      }, Error => {

      });
  }
  goBack() {
    this._location.back()
  }


  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  upload() {
    this.router.navigate(['dashboard/umcsupload'], {
      queryParams: { type: 'umcs' }
    });
  }
  addsto() {
    this.router.navigate(['dashboard/umcsnew'], {});
  }
  umcslists() {
    this.router.navigate(['dashboard/umcslist'], {});
  }
}
