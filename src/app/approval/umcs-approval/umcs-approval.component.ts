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
declare var $
@Component({
  selector: 'app-umcs-approval',
  templateUrl: './umcs-approval.component.html',
  styleUrls: ['./umcs-approval.component.css']
})
export class UmcsApprovalComponent implements OnInit {
   private readonly notifier: NotifierService;
  formType = null
  form = null
  approvalForm = null
  formId = null
  formStatus = null
  appconstant = this.ds.appconstant;
  isApproved = false;
  umcsPartsArr = []
  deptList = []
  isPending = false

  private listdept = this.ds.appconstant + 'dept/list';
  // private updateLocationUrl = this.ds.appconstant + 'umcs/updateLocation';
  constructor(private route: ActivatedRoute, private ds: DataserviceService, private fb: FormBuilder, private http: Http, private router: Router,notifierService: NotifierService) {
    this.notifier = notifierService;

    // var userDetails = localStorage.getItem("Daim-forms");
    // var userJson = JSON.parse(userDetails);


    this.approvalForm = fb.group({
      remarks: ['', Validators.compose([Validators.required])],

    });
    this.form = fb.group({
      // creditorid: ['', Validators.compose([Validators.required])],
      deptid: [1],
      contactno: ['1'],
      umcsformid:[],
      storagePeriod: ['1'],
      storagePurpose: [''],
      creditorname:[''],
      department: [''],
      hrid: [null, Validators.compose([Validators.required])],
      approverid: [null, Validators.compose([Validators.required])],
      periodofstorage: [''],
      storeacceptremarks:[''],
      status: ['test'],
      createddate: [],
      l4remarks:[''],
      l3remarks:[''],
      umcsParts: fb.array([]),
      remarks: []
    });



  }

  patchValue: any
  fetchFormDetails(formtype, formid) {
    var urlValue = this.appconstant + formtype + '/get';
    var submitData = 'formid=' + formid;
    this.ds.makeapi(urlValue, submitData,'post')
      .subscribe(data2 => {
        console.log(data2);
        //get status using data2.status
        this.formStatus = data2.status;

        ;

        this.formType = formtype;
        //show information in screen.
        //show approval and reject
        this.patchValue = data2;
        if (this.patchValue['status'] == 'accepted' && (this.patchValue['storagePeriod'] == '1month' || this.patchValue['storagePeriod'] == '2months' || this.patchValue['storagePeriod'] == '3months')) {
          this.isPending = true
        }
        if (this.patchValue['status'] == 'l4approved' && (this.patchValue['storagePeriod'] == '2months' || this.patchValue['storagePeriod'] == '3months')) {
          this.isPending = true
        }
        if (this.patchValue['status'] == 'l3approved' && this.patchValue['storagePeriod'] == '3months') {
          this.isPending = true
        }


        this.form.patchValue(this.patchValue);

        var umcsParts = data2['umcsParts'];
        this.umcsPartsArr = umcsParts;

        for (var i = 0; i < umcsParts.length; i++) {
          var umvsObj = umcsParts[i];
          this.addRow(umvsObj);
        }

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
  formTypes
  SetToken
  isexpired
  setToken(token) {
    this.SetToken = token
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

  ngOnInit() {
    //SAMPLE
    //http://13.234.64.82:8080/DaimForms/forms/umcs/get/11

    var token = this.route.snapshot.params['token'];
    this.setToken(token);





    // this.ds.makeapi(this.listdept, '', "post")
    //   .subscribe(data => {
    //     this.deptList = data;
    //   },
    //     Error => {
    //     });

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
  loading=false
  acceptForm(result) {

    if (this.approvalForm.valid) {
      ;
      var resultType = '';
      if(this.formStatus == 'accepted'){
        if (result) {
          resultType = 'l4approved';
        } else {
          resultType = 'l4rejected';
        }  
      }else if(this.formStatus == 'l4approved'){
        if (result) {
          resultType = 'l3approved';
        } else {
          resultType = 'l3rejected';
        }
      }else if(this.formStatus == 'l3approved'){
        if (result) {
          resultType = 'l2approved';
        } else {
          resultType = 'l2rejected'; 
        }
      } 
      
      

      var remarks = this.approvalForm.value.remarks;
      var usertypeprotol4 = this.patchValue.protol4type;
      var userprototypel3 = this.patchValue.protol3type
      var submitData = "id=" + this.formId + "&status=" + resultType + "&remarks=" + remarks + "&l4usertype=" + usertypeprotol4 + "&l3usertype=" + userprototypel3;
      var urlValue = this.appconstant + this.formType + '/updateFormStatus';
      this.loading=true
      this.ds.makeapi(urlValue, submitData, 'post')
        .subscribe(data2 => {
          var id = "tst";
          if (data2.status == "Success") {
            this.loading = false;
            var submitData = 'token=' + this.SetToken
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
      $.notify('Remarks is Invalid', "error");
    }
  }
}
