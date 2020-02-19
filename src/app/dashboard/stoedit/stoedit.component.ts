import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/finally';
import { DataserviceService } from '../../dataservice.service';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { NotifierService } from 'angular-notifier';

declare var $, moment;

@Component({
  selector: 'app-stoedit',
  templateUrl: './stoedit.component.html',
  styleUrls: ['./stoedit.component.css']
})
export class StoeditComponent implements OnInit {
  private readonly notifier: NotifierService;
  form: FormGroup;
  p1 = 1;
  private appconstant = this.ds.appconstant;
  today = new Date();
  // private savemcs = this.appconstant + 'sto/save';
  private formId;
  stoPartsArr;
  userType;
  formStatus;
  loading = false;
  smUsers = [];
  nonZero;
  remarkForm;
  hasValidSMValue = false;
  isStoreApproved = false;
  isPartsplanner = false;
  stoVendor;
  stoVendorName: any
  isSMComplete = 1;  //1 - Complete, 2- Partial, 3 - hide both buttons
  isIPLComplete = 1; //1 - Complete, 2- Partial, 3 - hide both buttons
  private shortIdSearch = this.appconstant + 'user/search';
  private calculateAPI = this.ds.appconstant + 'sto/ratePerPart';
  constructor(notifierService: NotifierService, private ds: DataserviceService, private route: ActivatedRoute, private _location: Location, private fb: FormBuilder, private http: Http, private router: Router) {
    this.fb = fb;
    this.notifier = notifierService;
    var req = Validators.compose([Validators.required]);

  }
  isBudgetApprover = false
  shortid;
  formclosed;
  myDateValue: Date;
  vendorMap = {};
  vendorNameMap = {};
  iplLocationMap = {};
  ngOnInit() {
    // this.addRow();

    this.myDateValue = new Date();
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);

    this.shortid = jsonData['shortid'];

    var value = this.route.queryParams
      .subscribe(params => {
        //console.log(params);
      });
    // localStorage.setItem("stoformsdata",data);
    var editdata = localStorage.getItem('stoformsdata');
    this.userType = localStorage.getItem('sto_usertype');


    var zeroValidation = /^(?=.*\d)(?=.*[1-9]).{1,10}$/;
    //(0)
    var req = Validators.compose([Validators.required]);
    this.nonZero = Validators.compose([Validators.required, Validators.pattern(zeroValidation)]);
    var editObj = JSON.parse(editdata);
    this.formId = editObj['id']

    this.formStatus = editObj['status'];

    this.formclosed = editObj['formclose']
    // *ngIf="userType == 'partsplanner'"
    if (this.userType == 'budgetapprover') {
      this.form = this.fb.group({
        // costcenterid:['',req],
        id: this.formId,
        requestorid: [null],
        formId: [editObj.id],
        stoformid: [editObj.stoformid],
        creditorname: [editObj.creditorname],
        phonenumber: [editObj.phonenumber],
        ionumber: [null, req],
        exigency: [editObj.exigency],
        remarks: [''],
        l4: [null],
        // l3: [1, req],
        status: [editObj.status],
        purpose: [editObj.purpose],
        stoParts: this.fb.array([]),
        value: [null],

      });
      this.isBudgetApprover = true;
    } else if (this.userType == 'partsplanner') {


      if (editObj.status == 'Storeapproved' || editObj.status == 'Storepartialapproved') {
        this.isStoreApproved = true
      }
      this.form = this.fb.group({
        // costcenterid:['',req],
        id: this.formId,
        requestorid: [1, req],
        stoformid: [editObj.stoformid],
        creditorname: [editObj.creditorname],
        formId: [editObj.id],
        phonenumber: [editObj.phonenumber, req],
        ionumber: [],
        exigency: [editObj.exigency, req],
        remarks: [''],
        l4: [null],
        l3: [null],
        // smid: ['', req],
        status: [editObj.status, req],
        purpose: [editObj.purpose, req],
        stoParts: this.fb.array([]),
        value: [null],

      });
    } else if (this.userType == 'sm') {
      this.form = this.fb.group({
        // costcenterid:['',req],
        id: this.formId,
        requestorid: [1, req],
        formId: [editObj.id],
        stoformid: [editObj.stoformid],
        creditorname: [editObj.creditorname],
        phonenumber: [editObj.phonenumber, req],
        ionumber: [],
        exigency: [editObj.exigency, req],
        remarks: [''],
        l4: [null],
        l3: [null],
        // smid: ['', req],
        status: [editObj.status, req],
        purpose: [editObj.purpose, req],
        stoParts: this.fb.array([]),
        value: [null],

      });
      // if(  this.formStatus == 'ppapproved' || this.formStatus == 'iplpartialapproved' || this.formStatus == 'smpartialapproved'){
      //   $.notify('Please enter the SM Quantity', "error");
      // }
    } else if (this.userType == 'ipl') {
      this.form = this.fb.group({
        // costcenterid:['',req],
        id: this.formId,
        requestorid: [null, req],
        formId: [editObj.id],
        stoformid: [editObj.stoformid],
        creditorname: [editObj.creditorname],
        phonenumber: [editObj.phonenumber, req],
        ionumber: [],
        exigency: [editObj.exigency, req],
        remarks: [''],
        l4: [null],
        l3: [null],
        // smid: ['', ],
        status: [editObj.status, req],
        purpose: [editObj.purpose, req],
        stoParts: this.fb.array([]),
        value: [null],

      });
      // if(  this.formStatus == 'smpartialapproved' ||  this.formStatus == 'iplpartialapproved' ){
      //   $.notify('Please enter the IPL Quantity', "error");
      // }
    } else if (this.userType == 'store') {
      this.form = this.fb.group({
        // costcenterid:['',req],
        id: this.formId,
        requestorid: [1, req],
        formId: [editObj.id],
        stoformid: [editObj.stoformid],
        creditorname: [editObj.creditorname],
        phonenumber: [editObj.phonenumber, req],
        ionumber: [],
        exigency: [editObj.exigency, req],
        remarks: [''],
        l4: [null],
        l3: [null],
        // smid: ['', req],
        status: [editObj.status, req],
        purpose: [editObj.purpose, req],
        stoParts: this.fb.array([]),
        value: [null],

      });
    }

    if (this.userType == 'partsplanner') {
      // smUsers
      var usertype = "usertype=SM"
      var listusersUrl = this.ds.appconstant + 'user/list';
      this.ds.makeapi(listusersUrl, usertype, "post")
        .subscribe(data => {

          this.smUsers = data;
          // this.deptList = data;
        },
          Error => {
          });
    }

    // remarkForm
    if (this.userType == 'sm') {
      this.remarkForm = this.fb.group({
        remarks: [''],
        // remarks: [null],
        duedate: ['', Validators.compose([Validators.required])],
      });
    }
    else {
      this.remarkForm = this.fb.group({
        remarks: ['', Validators.compose([Validators.required])],
        // remarks: [null],
        duedate: [''],
      });
    }




    this.form.patchValue(editObj);

    var stoParts = editObj['stoParts'];

    this.stoPartsArr = stoParts;
    this.vendorMap = {}
    this.stoVendor = []


    for (var i = 0; i < stoParts.length; i++) {
      var stoObj = stoParts[i];
      // this.stoVendor = this.stoVendor.concat(stoParts[i].stoVendors);
      this.vendorMap[i] = stoParts[i].stoVendors;
      this.iplLocationMap[i] = stoParts[i].stoLocations;
      console.log(stoObj);
      //vendorcode
      var vendorList = stoObj['stoVendors'];
      vendorList.map((vendor)=>{
        if(vendor.isactive == 1){
          stoObj['vendorcode']=vendor['vendorcode']
          stoObj['vendorname']=vendor['vendorname']
        }
      })

      var locationList = stoObj['stoLocations'];
      console.log(locationList)
      locationList.map((location)=>{
        if(location.isactive == 1){
          stoObj['location']=location['location']
        }
      })
      this.addRow(stoObj);
    }


    var vKeys = Object.keys(this.vendorMap);
    for (var vk of vKeys) {
      var vendors = this.vendorMap[vk];
      for (var i = 0; i < vendors.length; i++) {
        this.vendorNameMap[vendors[i]["vendorcode"]] = { name: vendors[i]["vendorname"], i: i };
      }
      this.rowForms.controls[vk].patchValue({
        "vendorcode": vendors[0].vendorcode,
        "vendorname": vendors[0].vendorname,
      })
    }
    var vKeys = Object.keys(this.iplLocationMap);
    for (var vk of vKeys) {
      var location = this.iplLocationMap[vk];
      this.location = location[vk]
      this.rowForms.controls[vk].patchValue({
        "location": location[0].location,
      })
    }
    this.updateStoVendors();
    this.updateStoLocation();
    
    
    //remarkForm
  }
  location
  updateStoVendors(){
    for(var i=0;i<this.rowForms.controls.length;i++){
      var tmpArr = this.vendorMap[i]
      this.rowForms.controls[i].patchValue({
        "stoVendors": tmpArr
      })
    }
  }

  updateStoLocation(){
    for(var i=0;i<this.rowForms.controls.length;i++){
      var tmpArr = this.iplLocationMap[i]
      this.rowForms.controls[i].patchValue({
        "stoLocations": tmpArr
      })
    }
  }
  btnshowqnt: any
  btnshowqntpart: any
  showcomplete = false
  showpartial = false
  partialbtnshide = false
  smStatus
  get rowForms() {
    return this.form.get('stoParts') as FormArray;

  }

 

  addRow(data) {
    var req = Validators.compose([Validators.required]);
    var row;
     var smcal = (data['baquantity'] - data['smquantity']).toFixed(3)
     var iplcal = (data['smquantity'] - data['iplquantity']).toFixed(3)
    if (this.userType == 'partsplanner') {
      row = this.fb.group({
        id: [data['id']],
        partnumber: [data['partnumber']],
        description: [data['description']],
        unit: [data['unit']],
        // reqquantity: [data['reqquantity'], req],
        // projectid:[1,req],
        sm: [data['sm']],
        smid: [data['smid']],
        stoformid: [data['stoformid']],
        // status: [data['status'], req],
        remarks: [''],
        smname: [data['smname'], req],
        baquantity: [data['baquantity'], req],

      });
    }
    else if (this.userType == 'budgetapprover') {
      row = this.fb.group({
        id: [data['id']],
        partnumber: [data['partnumber']],
        description: [data['description']],
        unit: [data['unit']],
        sm: [data['sm']],
        smid: [data['smid']],
        stoformid: [data['stoformid']],
        reqquantity: [data['reqquantity'], req],
        smname: [data['smname']],
        priceperpart: [data['priceperpart']],
        priceperqty: [data['priceperqty']],
      });
    }
    else if (this.userType == 'sm') {
      row = this.fb.group({
        id: [data['id'], req],
        partnumber: [data['partnumber']],
        description: [data['description']],
        unit: [data['unit'], req],
        reqquantity: [data['reqquantity'], req],
        smquantity: [data['smquantity']],
        // projectid:[1,req],
        smid: [data['smid']],
        stoformid: [data['stoformid']],
        // status: [data['status'], req],
        // remarks: [''],
        baquantity: [data['baquantity'], req],
        sm: [data['sm']],
        smstatus: [data['smstatus']],
        smbalqty: [smcal, req],
        vendorcode: [data['vendorcode'], req],
        vendorname: [data['vendorname'], req],
        stoVendors: []

      });
    } else if (this.userType == 'ipl') {
      // console.log(data['status']);

      row = this.fb.group({
        id: [data['id'], req],
        partnumber: [data['partnumber'], req],
        description: [data['description'], req],
        unit: [data['unit'], req],
        reqquantity: [data['reqquantity'], req],
        smquantity: [data['smquantity'], req],
        iplquantity: [data['iplquantity']],
        // projectid:[1,req],
        sm: [data['sm'], req],
        smid: [data['smid'], req],
        stoformid: [data['stoformid'], req],
        // status: [data['status'], req],
        remarks: [''],
        baquantity: [data['baquantity'], req],
        iplstatus: [data['iplstatus']],
        iplbalqty: [iplcal, req],
        location: [data['location'], req],
        stoLocations: [],
        
      });

   }
    else {
      row = this.fb.group({
        id: [data['id']],
        partnumber: [data['partnumber']],
        description: [data['description']],
        unit: [data['unit'],],
        reqquantity: [data['reqquantity'], req],
        sm: [data['sm']],
        // projectid:[1,req],
        smid: [data['smid']],
        stoformid: [data['stoformid']],
        // status: [data['status'], req],
        remarks: [''],
        iplquantity: [data['iplquantity']],
        baquantity: [data['baquantity']]

      });
    }

    this.rowForms.push(row);
    // console.log("editObj"+ this.rowForms.push(row));
  }

  deleteRow(i) {
    this.rowForms.removeAt(i);
  }

  goBack() {
    this._location.back();
  }

  savePartPlanner() {
    if (this.remarkForm.valid && this.form.valid) {
      var resArr = [];
      //console.log(this.rowForms);

      for (var x = 0; x < this.rowForms.value.length; x++) {

        resArr.push({
          id: this.rowForms['value'][x]['id'],
          smid: '' + this.rowForms['value'][x]['smid'],
          sm: '' + this.rowForms['value'][x]['smname']
          // smname: '' + this.rowForms['value'][x]['smname'],
        });
      }


      var updateSMUrl = this.ds.appconstant + 'sto' + '/updateSMIDs';
      //id [part id], smid
      // var submitData = "id=" + this.formId + "&smid='" + this.form.value.smid + "'";

      this.ds.makeapi(updateSMUrl, resArr, "postjson")
        .subscribe(data => {

          if (data.status == "Success") {
            // this.submitForm("closed")
            var submitData = "id=" + this.formId + "&status=ppapproved" + "&remarks=" + this.remarkForm.value.remarks;
            var urlValue = this.appconstant + 'sto' + '/updateFormStatus/';
            this.loading = true;
            this.ds.makeapi(urlValue, submitData, 'post')
              .subscribe(data2 => {
                var id = "tst";
                if (data2.status == "Success") {
                  this.loading = false;
                  $.notify('STO Request Approved Successfully!', "success");
                  // this.isApproved = true;
                  this.router.navigate(['dashboard/stolist']);
                } else {
                  this.router.navigate(['dashboard/stolist']);
                }


              }, Error => {

              });
          }
          // this.router.navigate(['location_approval']);

        },
          Error => {
          });

    }
    else {
      $.notify('SM Short ID and Remarks is required', "error");
      // this.notifier.notify('error', 'Remarks is invalid');
      // console.log(this.ds.findInvalidControls(this.form ))

      // console.log(this.form.get('stoParts'));

      // console.log(this.ds.findInvalidControlsRecursive(this.form));
      for (var i = 0; i < this.form.get('stoParts').value.length; i++) {
        // console.log(this.ds.findInvalidControls(this.form.get('stoParts').get(''+i)))        

      }

    }
  }
  RejectPartPlanner() {
    if (this.remarkForm.valid) {
      var resArr = [];
      //console.log(this.rowForms);

      for (var x = 0; x < this.rowForms.value.length; x++) {

        resArr.push({
          id: this.rowForms['value'][x]['id'],
          smid: '' + this.rowForms['value'][x]['smid'],
          // smname: '' + this.rowForms['value'][x]['smname'],
        });
      }


      var updateLocationUrl = this.ds.appconstant + 'sto' + '/updateSMIDs';
      //id [part id], smid
      // var submitData = "id=" + this.formId + "&smid='" + this.form.value.smid + "'";

      this.ds.makeapi(updateLocationUrl, resArr, "postjson")

        .subscribe(data => {

          if (data.status == "Success") {
            // this.submitForm("closed")
            var submitData = "id=" + this.formId + "&status=pprejected" + "&remarks=" + this.remarkForm.value.remarks;
            var urlValue = this.appconstant + 'sto' + '/updateFormStatus/';
            this.loading = true;
            this.ds.makeapi(urlValue, submitData, 'post')
              .subscribe(data2 => {

                var id = "tst";
                if (data2.status == "Success") {
                  this.loading = false;
                  // this.isApproved = true;
                  $.notify('STO Request Rejected Successfully!', "error");
                  this.router.navigate(['dashboard/stolist']);
                } else {
                  this.router.navigate(['dashboard/stolist']);
                }


              }, Error => {

              });
          }
          // this.router.navigate(['location_approval']);

        },
          Error => {
          });

    }
    else {
      $.notify('Remarks is required', "error");
      // this.notifier.notify('error', 'Remarks is invalid');
    }
  }
  validionum = []
  rejectBudgetApprover() {

    // $.notify("Hello World","error");
    if (this.remarkForm.valid) {
      // this.name.setValue('Nancy');
      //updateIONumber
      var resArr = [];
      // if(this.form.valid){

      // var getdata = this.form.value
      //   if(getdata.ionumber == null ){
      //     getdata.ionumber = ""
      //   }

      var updateIONumberUrl = this.ds.appconstant + 'sto' + '/updateIONumber';
      //id, ionumber
      var submitData = "id=" + this.formId + "&ionumber=" + this.form.value.ionumber + "&value=" + this.form.value.value;

      this.ds.makeapi(updateIONumberUrl, submitData, "post")
        .subscribe(data => {


          if (data.status == "Success") {
            // this.submitForm("closed")
            var submitData = "id=" + this.formId + "&status=budgetrejected" + "&remarks=" + this.remarkForm.value.remarks;
            var urlValue = this.appconstant + 'sto' + '/updateFormStatus/';
            this.loading = true;
            this.ds.makeapi(urlValue, submitData, 'post')
              .subscribe(data2 => {
                var id = "tst";
                if (data2.status == "Success") {
                  this.loading = false;
                  // this.isApproved = true;
                  $.notify('STO Request Rejected Successfully!', "error");
                  this.router.navigate(['dashboard/stolist']);
                } else {
                  this.router.navigate(['dashboard/stolist']);
                }


              }, Error => {

              });
          } else {
            this.router.navigate(['dashboard/stolist']);
          }

        },
          Error => {
          });
    }
    else {
      $.notify('Remarks is required', "error");
      //  console.log(this.ds.findInvalidControls(this.remarkForm ))
      // console.log(this.ds.findInvalidControls(this.form ))

      // console.log(this.form.get('stoParts'));

      // console.log(this.ds.findInvalidControlsRecursive(this.form));
      for (var i = 0; i < this.form.get('stoParts').value.length; i++) {
        // console.log(this.ds.findInvalidControls(this.form.get('stoParts').get(''+i)))        

      }

      // this.notifier.notify('error', 'Remarks is invalid');
    }
  }
  saveBudgetApprover() {
    if (this.remarkForm.valid && this.form.valid) {
      // this.name.setValue('Nancy');
      //updateIONumber
      var resArr = [];
      // if(this.form.valid){


      var updateIONumberUrl = this.ds.appconstant + 'sto' + '/updateIONumber';
      //id, ionumber
      var submitData = "id=" + this.formId + "&ionumber=" + this.form.value.ionumber + "&value=" + this.form.value.value;

      this.ds.makeapi(updateIONumberUrl, submitData, "post")
        .subscribe(data => {


          if (data.status == "Success") {

            var resArr = [];
            //console.log(this.rowForms);

            for (var x = 0; x < this.rowForms.value.length; x++) {

              resArr.push({
                id: this.rowForms['value'][x]['id'],
                reqquantity: '' + this.rowForms['value'][x]['reqquantity'],
                priceperpart: '' + this.rowForms['value'][x]['priceperpart'],
              })
            }
            var BAurlValue = this.appconstant + 'sto' + '/updateBAQuantity';
            this.ds.makeapi(BAurlValue, resArr, 'postjson')
              .subscribe(data1 => {

                if (data1.status == "Success") {

                  // this.submitForm("closed")
                  var submitData = "id=" + this.formId + "&status=budgetapproved" + "&remarks=" + this.remarkForm.value.remarks;
                  var urlValue = this.appconstant + 'sto' + '/updateFormStatus/';
                  this.loading = true;
                  this.ds.makeapi(urlValue, submitData, 'post')

                    .subscribe(data2 => {
                      var id = "tst";
                      if (data2.status == "Success") {
                        this.loading = false;
                        // this.isApproved = true;
                        $.notify('STO Request Approved Successfully!', "success");
                        this.router.navigate(['dashboard/stolist']);
                      } else {
                        this.router.navigate(['dashboard/stolist']);
                      }


                    }, Error => {

                    });
                }
                else {
                  this.router.navigate(['dashboard/stolist']);
                }
              }, Error => {

              });
          } else {
            this.router.navigate(['dashboard/stolist']);
          }

        },
          Error => {
          });
    }
    else {
      $.notify('IO Number and Remarks is required', "error");
      // this.notifier.notify('error', 'Remarks is invalid');
      //  console.log(this.ds.findInvalidControls(this.remarkForm ))
      // console.log(this.ds.findInvalidControls(this.form ))

      // console.log(this.form.get('stoParts'));

      // console.log(this.ds.findInvalidControlsRecursive(this.form));
      for (var i = 0; i < this.form.get('stoParts').value.length; i++) {
        // console.log(this.ds.findInvalidControls(this.form.get('stoParts').get(''+i)))        

      }
    }
  }
  savePartialSM() {

    if (this.remarkForm.valid && this.form.valid) {

      // this.name.setValue('Nancy');
      //updateIONumber

      var smquantityArr = [];
      var updateLocationUrl = this.ds.appconstant + 'sto' + '/updateSMQuantity';
      //id, ionumber {id,smquantity}  - use part id
      var tmpObj = {};
      for (let i = 0; i < this.form.value.stoParts.length; i++) {
        var smquantity = parseFloat(this.form.value.stoParts[i].smquantity);
        var smbalqty = parseFloat(this.form.value.stoParts[i].smbalqty).toFixed(3);
        var smVendors = this.form.value.stoParts[i]['stoVendors']
        // console.log(smquantity)

        smquantityArr.push({
          "id": this.form.value.stoParts[i]['id'],
          "smquantity": smquantity,
          "smbalqty": smbalqty,
          "stoVendors": smVendors

        })
        // console.log(smquantityArr)

      }
      if (this.remarkForm.value.remarks == null) {
        this.remarkForm.value.remarks = ''
      }
      var targetDate = this.remarkForm.value.duedate;
      // var correctedDateFormat = "22-08-2019";
      var newDate = new Date(targetDate);

      var correctedDateFormat = moment(newDate).format('DD-MM-YYYY');

      var submitData = { "target": correctedDateFormat, "partList": smquantityArr }

      //dd-mm-yyyy  - date format
      // var submitData = { "target": "", "partList": smquantityArr }
      // console.log(submitData)
      this.loading = true;
      this.ds.makeapi(updateLocationUrl, submitData, "postjson")
        .subscribe(data => {

          if (data.status == "Success") {
            this.loading = false;
            var id = "tst";
            $.notify('STO Request Partialy accepted', "success");
            this.router.navigate(['dashboard/stolist']);
          } else {
            this.router.navigate(['dashboard/stolist']);

            // var submitData = "id=" + this.formId + "&status=smapproved";
            // var urlValue = this.appconstant + 'sto' + '/updateFormStatus/';
            // this.ds.makeapi(urlValue, submitData, 'post')
            //   .subscribe(data2 => {
            //     var id = "tst";
            //     if (data2.status == "Success") {
            //       this.router.navigate(['dashboard/stolist']);
            //     } else {
            //       this.router.navigate(['dashboard/stolist']);
            //     }


            //   }, Error => {

            //   });
          }


        },
          Error => {
          });
    }
    else {

      $.notify('Due Date and Vendor Code is required', "error");
      // this.notifier.notify('error', 'Remarks is invalid');
      // console.log(this.ds.findInvalidControls(this.remarkForm ))
      // console.log(this.ds.findInvalidControls(this.form ))

      // console.log(this.form.get('stoParts'));
      console.log(this.ds.findInvalidControls(this.form));
      // console.log(this.ds.findInvalidControlsRecursive(this.form));
      for (var i = 0; i < this.form.get('stoParts').value.length; i++) {
        console.log(this.ds.findInvalidControls(this.form.get('stoParts').get('' + i)))

      }
    }
  }

  saveSM() {
    if (this.form.valid) {
      // this.name.setValue('Nancy');
      //updateIONumber
      var smquantityArr = [];

      var updateLocationUrl = this.ds.appconstant + 'sto' + '/updateSMQuantity';
      //id, ionumber {id,smquantity}  - use part id
      var tmpObj = {};
      for (let i = 0; i < this.form.value.stoParts.length; i++) {
        var smquantity = parseFloat(this.form.value.stoParts[i].smquantity)
        var smbalqty = parseFloat(this.form.value.stoParts[i].smbalqty).toFixed(3)
        // console.log(smquantity)
        var smVendors = this.form.value.stoParts[i]['stoVendors']

        smquantityArr.push({
          "id": this.form.value.stoParts[i]['id'],
          "smquantity": smquantity,
          "smbalqty": smbalqty,
          "stoVendors": smVendors
        })

        // console.log(smquantityArr)

      }


      var targetDate = this.remarkForm.value.duedate;
      // var correctedDateFormat = "22-08-2019";
      var newDate = new Date(targetDate);

      var correctedDateFormat = moment(newDate).format('DD-MM-YYYY');
      //dd-mm-yyyy  - date format
      var submitData = { "target": correctedDateFormat, "partList": smquantityArr }
      // console.log(submitData)
      this.loading = true;
      this.ds.makeapi(updateLocationUrl, submitData, "postjson")
        .subscribe(data => {

          if (data.status == "Success") {
            this.loading = false;
            var id = "tst";
            $.notify('STO Request completely accepted', "success");
            // this.isApproved = true;
            this.router.navigate(['dashboard/stolist']);
          } else {
            this.router.navigate(['dashboard/stolist']);
          }



          // var submitData = "id=" + this.formId + "&status=smapproved";
          // var urlValue = this.appconstant + 'sto' + '/updateFormStatus/';
          // this.ds.makeapi(urlValue, submitData, 'post')
          //   .subscribe(data2 => {
          //     var id = "tst";
          //     if (data2.status == "Success") {

          //       this.router.navigate(['dashboard/stolist']);
          //     } else {
          //       this.router.navigate(['dashboard/stolist']);
          //     }


          //   }, Error => {

          //   });

          // this.router.navigate(['location_approval']);

        },
          Error => {
          });

    }
    else {
      $.notify('Remarks and Vendor Code are required', "error");
      // this.notifier.notify('error', 'Remarks is invalid');
      // console.log(this.ds.findInvalidControls(this.remarkForm ))
      // console.log(this.ds.findInvalidControls(this.form ))

      // console.log(this.form.get('stoParts'));

      // console.log(this.ds.findInvalidControlsRecursive(this.form));

      for (var i = 0; i < this.form.get('stoParts').value.length; i++) {
        // console.log(this.ds.findInvalidControls(this.form.get('stoParts').get(''+i)))        

      }
    }
  }
  savePartialIPL() {
    console.log(this.form.value);

    if (this.remarkForm.valid && this.form.valid) {
      //TARGET FORMAT: dd-mm-yyyy
      // this.name.setValue('Nancy');
      //updateIONumber
      var resArr = [];
      var iplquantityArr = [];

      var updateLocationUrl = this.ds.appconstant + 'sto' + '/updateIPLQuantity';
      //req - postJSON
      // {id,ipl[rquantity}

      for (let i = 0; i < this.form.value.stoParts.length; i++) {
        var iplquantity = parseFloat(this.form.value.stoParts[i].iplquantity);
        var iplbalqty = parseFloat(this.form.value.stoParts[i].iplbalqty).toFixed(3);
        var ipllocation = this.form.value.stoParts[i]['stoLocations'];
      
        iplquantityArr.push({ "id": this.form.value.stoParts[i]['id'], 
        "iplquantity": iplquantity, 
        "iplbalqty": iplbalqty,
        "stoLocations": ipllocation
      })
        // console.log(iplquantityArr)
        
      }

      var targetDate = this.remarkForm.value.duedate;
      // var correctedDateFormat = "22-08-2019";
      var newDate = new Date(targetDate);

      var correctedDateFormat = moment(newDate).format('DD-MM-YYYY');
      var submitData = { "target": correctedDateFormat, "partList": iplquantityArr }

      this.ds.makeapi(updateLocationUrl, submitData, "postjson")
        .subscribe(data => {
          if (data.status == "Success") {

            // this.submitForm("closed")
            var submitData = "id=" + this.formId + "&status=iplpartialapproved" + "&remarks=" + this.remarkForm.value.remarks;
            var urlValue = this.appconstant + 'sto' + '/updateFormStatus/';
            this.loading = true;
            this.ds.makeapi(urlValue, submitData, 'post')
              .subscribe(data2 => {
                var id = "tst";
                if (data2.status == "Success") {
                  this.loading = false;
                  // this.isApproved = true;
                  $.notify('STO Request partially dispatched', "success");
                  this.router.navigate(['dashboard/stolist']);
                } else {
                  this.router.navigate(['dashboard/stolist']);
                }


              }, Error => {

              });
          }
          // this.router.navigate(['location_approval']);

        },
          Error => {
          });
    }
    else {
      $.notify('Remarks and Location are required', "error");
      // this.notifier.notify('error', 'Remarks is invalid');
      // console.log(this.ds.findInvalidControls(this.remarkForm ))
      // console.log(this.ds.findInvalidControls(this.form ))

      // console.log(this.form.get('stoParts'));

      // console.log(this.ds.findInvalidControlsRecursive(this.form));

      for (var i = 0; i < this.form.get('stoParts').value.length; i++) {
        // console.log(this.ds.findInvalidControls(this.form.get('stoParts').get(''+i)))        

      }
    }
  }

  saveStore() {

    if (this.remarkForm.valid && this.form.valid) {

      var remark = "";
      var remarks = this.remarkForm.value.remarks;
      var submitData = "id=" + this.formId + "&status=Storeapproved" + "&remarks=" + this.remarkForm.value.remarks;
      var urlValue = this.appconstant + 'sto' + '/updateFormStatus/';
      this.loading = true;
      this.ds.makeapi(urlValue, submitData, 'post')
        .subscribe(data2 => {
          this.loading = false;
          var id = "tst";
          if (data2.status == "Success") {
            // this.isApproved = true;
            $.notify('Parts Received Successfully', "success");
            this.router.navigate(['dashboard/stolist']);
          } else {
            this.router.navigate(['dashboard/stolist']);
          }


        }, Error => {

        });
    } else {
      $.notify('Remarks is required', "error");
      //  console.log(this.ds.findInvalidControls(this.remarkForm ))
      // console.log(this.ds.findInvalidControls(this.form ))

      // console.log(this.form.get('stoParts'));

      // console.log(this.ds.findInvalidControlsRecursive(this.form));
      for (var i = 0; i < this.form.get('stoParts').value.length; i++) {
        // console.log(this.ds.findInvalidControls(this.form.get('stoParts').get(''+i)))        

      }
    }

  }
  savePartialReceive() {

    if (this.remarkForm.valid && this.form.valid) {

      var remark = "";
      var remarks = this.remarkForm.value.remarks;
      var submitData = "id=" + this.formId + "&status=Storepartialapproved" + "&remarks=" + this.remarkForm.value.remarks;
      var urlValue = this.appconstant + 'sto' + '/updateFormStatus/';
      this.loading = true;
      this.ds.makeapi(urlValue, submitData, 'post')
        .subscribe(data2 => {
          this.loading = false;
          var id = "tst";
          if (data2.status == "Success") {
            // this.isApproved = true;
            $.notify('Parts Received Successfully', "success");
            this.router.navigate(['dashboard/stolist']);
          } else {
            this.router.navigate(['dashboard/stolist']);
          }


        }, Error => {

        });
    } else {
      $.notify('Remarks is required', "error");
      //  console.log(this.ds.findInvalidControls(this.remarkForm ))
      // console.log(this.ds.findInvalidControls(this.form ))

      // console.log(this.form.get('stoParts'));

      // console.log(this.ds.findInvalidControlsRecursive(this.form));
      for (var i = 0; i < this.form.get('stoParts').value.length; i++) {
        // console.log(this.ds.findInvalidControls(this.form.get('stoParts').get(''+i)))        

      }
    }

  }
  saveIPL() {
    if (this.remarkForm.valid && this.form.valid) {
      // this.name.setValue('Nancy');
      //updateIONumber
      var resArr = [];
      var iplquantityArr = [];
      var updateLocationUrl = this.ds.appconstant + 'sto' + '/updateIPLQuantity';
      //req - postJSON
      // {id,ipl[rquantity}

      for (let i = 0; i < this.form.value.stoParts.length; i++) {
        var iplquantity = parseFloat(this.form.value.stoParts[i].iplquantity);
        var iplbalqty = parseFloat(this.form.value.stoParts[i].iplbalqty).toFixed(3);
        var ipllocation = this.form.value.stoParts[i]['stoLocations'];
        var tmpArr = this.iplLocationMap[i];
        for (var j = 0; j < tmpArr.length; j++) {
            tmpArr[j]['isactive'] = 1;
        }
    
    
        console.log(tmpArr);
    
        this.rowForms.controls[i].patchValue({
          "stoLocations": tmpArr
        })
        // console.log(iplquantity)
        // tmpObj[""+(i+1)] = smquantity;
        iplquantityArr.push({ "id": this.form.value.stoParts[i]['id'],
         "iplquantity": iplquantity,
          "iplbalqty": iplbalqty,
          "stoLocations":ipllocation
        })
        

      }


      var submitData = { "target": "", "partList": iplquantityArr }

      this.ds.makeapi(updateLocationUrl, submitData, "postjson")
        .subscribe(data => {
          if (data.status == "Success") {

            // this.submitForm("closed")
            var submitData = "id=" + this.formId + "&status=iplapproved" + "&remarks=" + this.remarkForm.value.remarks;
            var urlValue = this.appconstant + 'sto' + '/updateFormStatus/';
            this.loading = true;
            this.ds.makeapi(urlValue, submitData, 'post')
              .subscribe(data2 => {
                var id = "tst";
                if (data2.status == "Success") {
                  this.loading = false;
                  // this.isApproved = true;
                  $.notify(' STO Request completely dispatched', "success");
                  this.router.navigate(['dashboard/stolist']);
                } else {
                  this.router.navigate(['dashboard/stolist']);
                }


              }, Error => {

              });
          }
          // this.router.navigate(['location_approval']);

        },
          Error => {
          });
    }
    else {
      $.notify('Remarks and Location are required', "error");
      // this.notifier.notify('error', 'Remarks is invalid');
    }

  }

  markComplete() {
    //mark the sto status as closed
    var submitData = "id=" + this.formId + "&status=closed";
    var urlValue = this.appconstant + 'sto' + '/updateFormStatus/';
    this.ds.makeapi(urlValue, submitData, 'post')
      .subscribe(data2 => {
        var id = "tst";
        if (data2.status == "Success") {
          // this.isApproved = true;
          this.router.navigate(['dashboard/stolist']);
        }
        else {
          this.router.navigate(['dashboard/stolist']);
        }


      }, Error => {

      });
  }

  submitClose(){
    $('#confirmClose').modal('show');
  }


  markClose() {
    if (this.remarkForm.valid) {
      //closed
      var submitData = "id=" + this.formId + "&status=closed" + "&remarks=" + this.remarkForm.value.remarks;
      var urlValue = this.appconstant + 'sto' + '/updateFormStatus/';
      this.loading = true;
      this.ds.makeapi(urlValue, submitData, 'post')
        .subscribe(data2 => {
          var id = "tst";
          if (data2.status == "Success") {
            // this.isApproved = true;
            this.loading = false;
            $.notify('STO Request Closed', "success");
            $('#confirmClose').modal('hide');
            this.router.navigate(['dashboard/stolist']);
          } else {
            this.router.navigate(['dashboard/stolist']);
          }


        }, Error => {

        });


    }
    else {
      $.notify('Remarks is required', "error");
      $('#confirmClose').modal('hide');
      // this.notifier.notify('error', 'Remarks is invalid');
    }
  }
  savePartialClosed() {
    if (this.remarkForm.valid) {
      //closed
      var submitData = "id=" + this.formId + "&status=partialclosed" + "&remarks=" + this.remarkForm.value.remarks;
      var urlValue = this.appconstant + 'sto' + '/updateFormStatus/';
      this.loading = true;
      this.ds.makeapi(urlValue, submitData, 'post')
        .subscribe(data2 => {
          var id = "tst";
          if (data2.status == "Success") {
            // this.isApproved = true;
            this.loading = false;
            $.notify('STO Request partially Closed', "success");
            this.router.navigate(['dashboard/stolist']);
          } else {
            this.router.navigate(['dashboard/stolist']);
          }


        }, Error => {

        });


    }
    else {
      $.notify('Remarks is required', "error");
      // this.notifier.notify('error', 'Remarks is invalid');
    }
  }
  /*Check quantity*/
  quantityValue: any
  showbuttons = false
  SMquantitys() {
    this.showcomplete = false
    this.showpartial = true
    var getform = this.form.value

    $("#errorMessage").html("");

    var allValid = true;
    var hasErrorType = 0;

    for (var i = 0; i < getform.stoParts.length; i++) {
      var value = parseFloat(getform.stoParts[i].smquantity);
      var baquantity = parseFloat(getform.stoParts[i].baquantity);
      var smbalqty = parseFloat(getform.stoParts[i].smbalqty);
      smbalqty = isNaN(smbalqty) ? 0 : smbalqty;
      var totalsmquantity = parseFloat(getform.stoParts[i].smquantity) + smbalqty
      console.log("totalquantity = >" + totalsmquantity)
      if (totalsmquantity == 0 || isNaN(totalsmquantity)) {
        // $("#btncomplete").css({ "display": "none", "float": "right" })
        // $("#btnparts").css({ "display": "none", "float": "right" })
        // hasErrorType = 1;
        allValid = false;
      }
      else if (baquantity == totalsmquantity) {
        // $("#btncomplete").css({ "display": "block", "float": "right" })
        // $("#btnparts").css({ "display": "none", "float": "right" })
        // $("#duedatepic").css({ "display": "none", "float": "right" })
        // allValid = false;
      }
      else if (baquantity > totalsmquantity) {
        // $("#btncomplete").css({ "display": "none", "float": "right" })
        // $("#btnparts").css({ "display": "block", "float": "right" })
        // $("#duedatepic").css({ "display": "block", "float": "right" })
        allValid = false;
      }
      else if (baquantity < totalsmquantity) {
        // $("#btncomplete").css({ "display": "none", "float": "right" })
        // $("#btnparts").css({ "display": "none", "float": "right" })
        // allValid = false;
        //show error message
        allValid = false;
        hasErrorType = 2;
      }
    }


    // $("#btncomplete").css({ "display": "none", "float": "right" })
    // $("#btnparts").css({ "display": "none", "float": "right" })
    $("#duedatepic").css({ "display": "none", "float": "right" })


    if (allValid && hasErrorType == 0) {
      //show complete
      // $("#btncomplete").css({ "display": "block", "float": "right" })
      // $("#btnparts").css({ "display": "none", "float": "right" })
      this.isSMComplete = 1;
      $("#duedatepic").css({ "display": "none", "float": "right" })
    } else if (hasErrorType == 0) {
      //show incomplete
      // $("#btncomplete").css({ "display": "none", "float": "right" })
      // $("#btnparts").css({ "display": "block", "float": "right" })
      this.isSMComplete = 2;
      $("#duedatepic").css({ "display": "block", "float": "right" })
    } else {
      //hasErrorType
      this.isSMComplete = 3;
      if (hasErrorType == 1) {
        $("#errorMessage").html("Value should not be 0");
      } else if (hasErrorType == 2) {
        $("#errorMessage").html("Value should not be greater than Required Quantity");
      }
    }



  }
  iplquantitys() {
    var getform = this.form.value

    $("#errorMessage").html("");

    var allValid = true;
    var hasErrorType = 0;

    for (var i = 0; i < getform.stoParts.length; i++) {
      var value = parseFloat(getform.stoParts[i].iplquantity);
      var reqQuantity = parseFloat(getform.stoParts[i].smquantity);

      var iplbalqty = parseFloat(getform.stoParts[i].iplbalqty);
      iplbalqty = isNaN(iplbalqty) ? 0 : iplbalqty;
      var totaliplquantity = parseInt(getform.stoParts[i].iplquantity) + iplbalqty;
      // var totaliplquantity = parseInt(getform.stoParts[i].iplquantity) + parseInt(getform.stoParts[i].iplbalqty)
      if (totaliplquantity == 0 || isNaN(totaliplquantity)) {
        // $("#btncomplete").css({ "display": "none", "float": "right" })
        // $("#btnparts").css({ "display": "none", "float": "right" })
        // hasErrorType = 1;
        allValid = false;
      }
      else if (reqQuantity == totaliplquantity) {
        // $("#btncomplete").css({ "display": "block", "float": "right" })
        // $("#btnparts").css({ "display": "none", "float": "right" })
        // $("#duedatepic").css({ "display": "none", "float": "right" })
        // allValid = false;
      }
      else if (reqQuantity > totaliplquantity) {
        // $("#btncomplete").css({ "display": "none", "float": "right" })
        // $("#btnparts").css({ "display": "block", "float": "right" })
        // $("#duedatepic").css({ "display": "block", "float": "right" })
        allValid = false;
      }
      else if (reqQuantity < totaliplquantity) {
        // $("#btncomplete").css({ "display": "none", "float": "right" })
        // $("#btnparts").css({ "display": "none", "float": "right" })
        // allValid = false;
        //show error 
        allValid = false;
        hasErrorType = 2;
      }
    }


    // $("#btncompleteipl").css({ "display": "none", "float": "right" })
    // $("#btnpartsipl").css({ "display": "none", "float": "right" })
    $("#duedatepic").css({ "display": "none", "float": "right" })


    if (allValid && hasErrorType == 0) {
      //show complete
      this.isIPLComplete = 1;
      // $("#btncompleteipl").css({ "display": "block", "float": "right" })
      // $("#btnpartsipl").css({ "display": "none", "float": "right" })
      $("#duedatepic").css({ "display": "none", "float": "right" })
    } else if (hasErrorType == 0) {
      //show incomplete
      this.isIPLComplete = 2;
      // $("#btncompleteipl").css({ "display": "none", "float": "right" })
      // $("#btnpartsipl").css({ "display": "block", "float": "right" })
      $("#duedatepic").css({ "display": "block", "float": "right" })
    } else {
      //hasErrorType
      this.isIPLComplete = 3;
      if (hasErrorType == 1) {
        $("#errorMessage").html("Value should not be 0");
      } else if (hasErrorType == 2) {
        $("#errorMessage").html("Value should not be greater than SM Quantity");
      }
    }
  }
  makeapi(url, data, type): Observable<any> {
    const headers = new Headers();
    if (type == "post") {
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
    } else if (type == "postjson") {
      headers.append('content-type', 'application/json');
    }


    return this.http.post(url, data, { headers: headers })
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

  searchName: any
  shortidvalue: any
  fname: any;
  lname: any
  showshortid = false
  searchUser(i) {
    console.log(i)
    this.showshortid = true
    var smid = this.rowForms.controls[i]['value']['smid']
    return this.makeapi(this.shortIdSearch, 'shortid=' + smid, "post")
      .subscribe(data => {
        // this.searchName = data
        console.log(this.rowForms);
        console.log(this.rowForms.controls);
        this.rowForms.controls[i].get('smid').setValue(data.shortid);
        this.rowForms.controls[i].get('smname').setValue(data.firstname + " " + data.lastname)

      },
        Error => {
        });

  }
  keyAlpha(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  upload() {
    this.router.navigate(['dashboard/stoupload'], {
      queryParams: { type: 'sto' }
    });
  }
  addsto() {
    this.router.navigate(['dashboard/stonew'], {});
  }


  saveCalculate() {
    let reqdata = "";

    let url = this.calculateAPI;
    let data = this.form.value;

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
          this.showRow(StoObj);
        }
      }

    })
  }
  showRow(data) {
    var req = Validators.compose([Validators.required]);
    const calculaterow = this.fb.group({
      // partnumber: [data['partnumber']],
      // description: [data['description']],
      // unit: [data['unit']],
      // reqquantity: [data['reqquantity']],
      // priceperpart: [data['priceperpart']],
      // status: [data['status']],
      // id: [data['id'], req],
      id: [data['id']],
      partnumber: [data['partnumber']],
      description: [data['description']],
      unit: [data['unit']],
      sm: [data['sm']],
      smid: [data['smid']],
      stoformid: [data['stoformid']],
      reqquantity: [data['reqquantity']],
      smname: [data['smname']],
      priceperpart: [data['priceperpart']],

    });

    this.rowForms1.push(calculaterow);
  }
  get rowForms1() {
    return this.form.get('stoParts') as FormArray;
  }


  selectVendorCode(value, i) {
    console.log(value);
    var vendorname = this.vendorNameMap[value]["name"];
    // this.form.get('stoParts')
    var tmpArr = this.vendorMap[i];
    for (var j = 0; j < tmpArr.length; j++) {
        tmpArr[j]['isactive'] = 1;
     
    }


    console.log(tmpArr);

    this.rowForms.controls[i].patchValue({
      "vendorname": vendorname,
      "stoVendors": tmpArr
    })
  }
  locationVal:any;
  selectLocation(value, i) {
    this.locationVal = value;
    var tmpArr = this.iplLocationMap[i];
    for (var j = 0; j < tmpArr.length; j++) {
      if (tmpArr[j]['location'] == value) {
        tmpArr[j]['isactive'] = 1;
      } else {
        tmpArr[j]['isactive'] = 0;
      }
    }


    console.log(tmpArr);

    this.rowForms.controls[i].patchValue({
      "stoLocations": tmpArr
    })


  }
  stolist() {
    this.router.navigate(['dashboard/stolist'], {});
  }
}
