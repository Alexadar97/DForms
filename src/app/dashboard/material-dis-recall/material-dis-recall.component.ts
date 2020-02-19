import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NotifierService } from 'angular-notifier';
import { DataserviceService } from '../../dataservice.service';
declare var $, moment;
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-material-dis-recall',
  templateUrl: './material-dis-recall.component.html',
  styleUrls: ['./material-dis-recall.component.css']
})
export class MaterialDisRecallComponent implements OnInit {
  loading = false;
  form: FormGroup;
  remarkForm: FormGroup;
  fb;
  returnVal;
  usertype: any;
  status: any;
  isStoreUser = false;
  isStoreLogin = false;
  today = new Date();
  toDate: any;
  todayDate: any;
  l4Users: any;
  l3Users: any;
  numbervalidation = /^[0][1-9]\d{9}$|^[1-9]\d{9}$/;
  private appconstant = this.ds.appconstant;
  private savemispatch = this.appconstant + 'materialdispatch/save';
  private mislistusers = this.ds.appconstant + 'user/list';

  constructor(notifierService: NotifierService, fb: FormBuilder, private route: ActivatedRoute, private http: Http, private router: Router, private _location: Location, private ds: DataserviceService) {
    this.fb = fb;

    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    var userShortId = jsonData['shortid'];
    var userid = jsonData.shortid;


  }

  ngOnInit() {

    this.loading = true;

    var value = this.route.queryParams
      .subscribe(params => {
        this.setToken(params.id);
      });
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    var userShortId = jsonData['shortid'];
    var userid = jsonData.shortid;

    var usertype = '';

    if (jsonData['usertype']) {
      usertype = jsonData['usertype'].toLowerCase();
      this.usertype = usertype
    }

    if (usertype === "store") {
      this.status = 'store'
      this.isStoreUser = true;
    }
    else {
      this.status = '';
    }

    // var getDate = this.form.value;
    // getDate.expectchallandate = this.todayDate
    // this.form.patchValue(getDate);

    var num = Validators.compose([Validators.required, Validators.pattern(this.numbervalidation)]);
    var req = Validators.compose([Validators.required]);


    this.form = this.fb.group({
      id: [this.form_id],
      requesterid: [userid],
      costcenter: ['', req],
      l4: [],
      l3: [],
      dispatchpurpose: ['', req],
      transportmode: ['', req],
      sapreference: [''],
      otherstext: [],
      recipientname: ['', req],
      recipientaddress: ['', req],
      state: ['', req],
      statecode: ['', req],
      gstinuniqueno: ['', req],
      preparedby: ['', req],
      vehicleno: [''],
      department: ['', req],
      contactno: ['', num],
      hrid: ['', req],
      reqremarks:[''],
      challanno: [],
      expectchallandate: [this.todayDate],
      returnOrNonReturn: ['', req],
      expectedreturndate: [this.todayDate],
      expectedscrappingdate: [this.todayDate],
      purposeofshipment: [null],
      materialDispatchParts: this.fb.array([]),

    });



    var req = Validators.compose([Validators.required]);
    this.remarkForm = this.fb.group({
      storeremarks: ['', req],

    });



    this.todayDate = moment(new Date()).format('DD-MM-YYYY');

    var usertype = "usertype=L4"
    this.ds.makeapi(this.mislistusers, usertype, "post")
      .subscribe(data => {

        this.l4Users = data;

      },
        Error => {
        });

    var usertype = "usertype=L3"
    this.ds.makeapi(this.mislistusers, usertype, "post")
      .subscribe(data => {

        this.l3Users = data;

      },
        Error => {
        });
  }

  goBack() {
    this.router.navigate(['dashboard/matdislist'], {});
  }
  addrow=0
  addRow() {
    this.addrow++
    //if store - use all params
    var req = Validators.compose([Validators.required]);

    const row = this.fb.group({
      id: [null],
      ascorderview: [this.addrow],
      mdformid: [this.form_id],
      partnumber: ['', req],
      description: ['', req],
      hsncode: ['', req],
      quantity: ['', req],
      unit: ['', req],
      rateperitem: ['', req],

    });

    this.rowForms.push(row);
  }
  get rowForms() {
    return this.form.get('materialDispatchParts') as FormArray;
  }

  deleteRow(j) {
    this.rowForms.removeAt(j);
  }
  returnchked = false;
  nonreturncheked = true;
  checkReturnable(event, val) {
    var targetChecked = event.target.checked;
    if (targetChecked) {
      this.returnVal = val;
      this.returnchked = true;
      this.form.value.expectedreturndate = "";
      this.nonreturncheked = false;
      var getDate = this.form.value;
      getDate.expectedreturndate = this.todayDate
      this.form.patchValue(getDate);
    }
    else {
      this.form.patchValue({ expectedreturndate: '' })
      // this.form.value.expectedreturndate = $("#arrivedate").val();
      this.returnchked = false;
    }

  }
  notreturnVal: any;
  checkNonReturnable(event, val) {
    this.todayDate = moment(new Date()).format('DD-MM-YYYY');
    var targetChecked = event.target.checked;
    if (targetChecked) {
      this.notreturnVal = val;
      this.nonreturncheked = true;
      // this.form.value.expectedscrappingdate = "";
      this.form.value.purposeofshipment = "";
      this.returnchked = false;
      var getDate = this.form.value;
      getDate.expectedscrappingdate = this.todayDate;
      this.form.patchValue(getDate);
    }
    else {
      this.form.patchValue({ purposeofshipment: '' });
      $('#shipment1').prop('checked', false);
      $('#shipment2').prop('checked', false);
      $('#shipment3').prop('checked', false);
      $('#shipment4').prop('checked', false);
      $('#shipment5').prop('checked', false);
      // this.form.value.expectedscrappingdate = $("#excepteddate").val("");
      this.nonreturncheked = false;
    }
  }

  workshow = false;
  purchaseotherVal: any;
  targetChecked: any;
  purchaseother(event, val) {
    console.log(event);
    this.targetChecked = event.target.checked;
    if (this.targetChecked == true) {
      console.log(this.targetChecked)
      this.purchaseotherVal = val;
      this.workshow = true;

    } else if (this.targetChecked == false) {
      this.purchaseotherVal = ""
      console.log(this.targetChecked)
      this.workshow = false
      this.form.patchValue({ otherstext: '' });
    }

  }

  formId: any;
  setToken(formId) {
    this.formId = formId;
    this.fetchmisdispatch(this.formId);
  }

  patchValue: any;
  form_id: any;
  mdformid: any;
  fetchmisdispatch(formid) {
    this.loading = false;
    var urlValue = this.appconstant + 'materialdispatch/get';
    var submitData = "formid=" + formid;
    this.ds.makeapi(urlValue,submitData ,'post')
      .subscribe(data2 => {
        //show information in screen.
        //show approval and reject
        console.log(data2)
        this.patchValue = data2;
        this.form_id = data2['id'];
        this.form.reset();
        this.form.patchValue(this.patchValue);
        
        // show the SAP Reference of Original Document value checked
        var saPref = this.patchValue.sapreference;
        var saPrefArr = saPref.split(',')
        for (var i = 0; i < saPrefArr.length; i++) {
          var value = saPrefArr[i]
          $('#sap' + value).prop('checked', true);
          if (value == 4) {
            this.workshow = true;
          }
        }
        // to show the returnable and non-returnable value

        if (this.patchValue.returnOrNonReturn == 1) {
          $('#return1').prop('checked', true);
          this.returnchked = true;
          this.nonreturncheked = false;
        }
        else if (this.patchValue.returnOrNonReturn == 0) {
          $('#return2').prop('checked', true);
          this.nonreturncheked = true;
          this.returnchked = false;
          var shipmentval = this.patchValue.purposeofshipment;
          var shipArr = shipmentval.split(',')

          for (var i = 0; i < shipArr.length; i++) {
            var shipValue = shipArr[i]
            console.log($('#shipment' + (shipValue)));
            $('#shipment' + shipValue).prop('checked', true);
          }
        };
        var stoParts = data2['materialDispatchParts'];
        var stoObj = {};
        for (var i = 0; i < stoParts.length; i++) {
          stoObj[i] = stoParts[i];

        }


        var vKeys = Object.keys(stoObj);
        for (var vk of vKeys) {
          var vendors = stoObj[vk];
          this.showRow(vendors);
        }
      });

  }


  get rowForms1() {
    return this.form.get('materialDispatchParts') as FormArray;
  }
  showRow(data) {
    this.addrow++
    var req = Validators.compose([Validators.required]);

    const row1 = this.fb.group({

      id: [data['id']],
      ascorderview: [this.addrow],
      mdformid: [data['mdformid']],
      partnumber: [data['partnumber'], req],
      description: [data['description'], req],
      hsncode: [data['hsncode'], req],
      quantity: [data['quantity'], req],
      unit: [data['unit'], req],
      rateperitem: [data['rateperitem'], req],


    });

    this.rowForms1.push(row1);
  }
  sapreferenceVal:any
  validation(){
    var isvalid = false;
    var formvalid = this.form.invalid;
    console.log(this.form.value);
     var sapreferenceArr = [];
    $(".chkboxes:checked").each(function () {
      sapreferenceArr.push($(this).val());
    });

    this.sapreferenceVal = sapreferenceArr.join(',');
    
    var returnDateFormValidation = this.returnVal == '1' && this.form.value.expectedreturndate == "";
    var sapReference = sapreferenceArr.length == 0;
    var otherTextVal = this.purchaseotherVal == "4" && this.form.value.otherstext == "";
    var purposeShipment = this.returnVal == '0' && this.form.value.purposeofshipment == "";
    var expectReturDate = this.returnVal == '0' && this.form.value.expectedscrappingdate == "";
    var transPortMode = this.form.value.transportmode == "2" && this.form.value.l3 == "" ;
    console.log(this.targetChecked )
    console.log(this.form.value.otherstext)
    if ((formvalid) || ((returnDateFormValidation) || (sapReference) ||
    (( purposeShipment) || (expectReturDate)) ||
    (otherTextVal) || (transPortMode))){ 
      isvalid = true;
    } 
    return isvalid;
  }

  saveData() {
    let reqdata = '';
    let url = this.savemispatch;
    let data = this.form.value;
    console.log(data);

    // set the returnable and this.nonreturnable value

    if (this.returnVal == 'Returnable') {
      data.returnOrNonReturn = 1;
    }
    if (this.returnVal == 'Non Returnable') {
      data.returnOrNonReturn = 0;
    }

    //  set the SAP Reference of Original Document Value


    var sapreferenceArr = [];
    $(".chkboxes:checked").each(function () {
      sapreferenceArr.push($(this).val());
    });

    var sapreferenceVal = sapreferenceArr.join(',');
    data.sapreference = sapreferenceVal;

    // set the Purpose of Shipment Value

    var shipmentyArr = [];
    $(".chkShipment:checked").each(function () {
      shipmentyArr.push($(this).val());
    });

    var chekedshipmentyVal = shipmentyArr.join(',');
    data.purposeofshipment = chekedshipmentyVal;

    //  set the Expected Date of Scrapping date value

    data.expectedscrappingdate = $("#excepteddate").val();

    //  set the Expected Date of Arriving date value

    data.expectedreturndate = $("#arrivedate").val();


    // to convert the Mode of Transport value in string to interger

    data.transportmode = +this.form.value.transportmode;

    // set the Approver l4 and l3 null value

    if(data.transportmode == '1'){
      data.l3 = null;
    }

    // set the empty value in othertext

    if(this.purchaseotherVal == '4'){
      data.otherstext = this.form.value.otherstext;
    }
    else{
      data.otherstext = null;
    }


    reqdata = JSON.stringify(data);
    console.log(reqdata);

    return this.postRequest(url, reqdata);
  }
  postRequest(url, reqdata) {
    const headers = new Headers();
    headers.append('content-type', 'application/json');
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
    $('#confirmSubmit').modal('show');
  }


  confirmSubmit() {

    if(this.validation()) {
      
       $.notify('Invalid Form! Please fill all mandatory fields', "error");
       $('#confirmSubmit').modal('hide');
       console.log(this.ds.findInvalidControls(this.form));
       for (var i = 0; i < this.form.get('materialDispatchParts').value.length; i++) {
        console.log(this.ds.findInvalidControls(this.form.get('materialDispatchParts').get('' + i)))

      }
     }
     else {
       this.loading = true;
       let data = this.form.value;
       if (data.id == null) {
         delete data.id;
       }
       this.saveData().subscribe(data => {
 
         if (data.status == 'Success') {
           this.loading = false;
           $.notify('Material Dispatch Form Submitted Successfully!', "success");
           $('#confirmSubmit').modal('hide');
           this.router.navigateByUrl('dashboard/matdislist')
         } 
         else if(data['status'] == 'Failure'){
           this.loading = false;
           $.notify('Server error, Please try again!',"error");
           $('#confirmSubmit').modal('hide');
         }
         else{
           $.notify('Form Submition Failed!', "error");
           $('#confirmSubmit').modal('hide');
         }
         
       },
         Error => {
           this.loading = false;
         });;
     }
   }
  addmisdispatch() {
    this.router.navigate(['dashboard/matdisnew'], {});
  }
  mislist() {
    this.router.navigateByUrl('/dashboard/matdislist');
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
}
