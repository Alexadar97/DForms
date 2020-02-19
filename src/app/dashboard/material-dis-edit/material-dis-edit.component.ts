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
  selector: 'app-material-dis-edit',
  templateUrl: './material-dis-edit.component.html',
  styleUrls: ['./material-dis-edit.component.css']
})
export class MaterialDisEditComponent implements OnInit {
  loading = false;
  form: FormGroup;
  remarkForm: FormGroup;
  DocketForm: FormGroup;
  fb;
  returnVal;
  usertype: any;
  status: any;
  isStoreUser = false;
  isStoreLogin = false;
  today = new Date();
  toDate: any;
  todayDate: any;

  numbervalidation = /^[0][1-9]\d{9}$|^[1-9]\d{9}$/;
  private appconstant = this.ds.appconstant;
  private updatetotaldispatch = this.appconstant + 'materialdispatch/updateMaterialDispatchForm';
  private updatedispatch = this.appconstant + 'materialdispatch/updateParts';
  private uploaddispatch = this.appconstant + 'materialdispatch/uploadScrapFile';
  private fileDownloadAPI = this.appconstant + 'materialdispatch/downloadScrapFile';
  private listDownloadAPI = this.appconstant + 'materialdispatch/listScrapfile';
  private downloadPDFdispatch = this.appconstant + 'materialdispatch/generatePDF/';
  private MailTriggerAPI = this.appconstant + 'materialdispatch/mailTrigger';
  private updateDocNoAPI = this.appconstant + 'materialdispatch/updateDocNo';
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
      reqremarks: [''],
      challanno: [],
      overalltaxvalues:[''],
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
    var req = Validators.compose([Validators.required]);
    this.DocketForm = this.fb.group({
      docketno: ['', req],
      transporter: ['', req],

    });

    this.todayDate = moment(new Date()).format('DD-MM-YYYY');
  }

  goBack() {
    this.router.navigate(['dashboard/matdislist'], {});
  }

  addRow1(data) {
    var req = Validators.compose([Validators.required]);

    const row = this.fb.group({

      id: [data['id']],
      mdformid: [data['mdformid']],
      partnumber: [data['partnumber'], req],
      description: [data['description'], req],
      hsncode: [data['hsncode'], req],
      quantity: [data['quantity'], req],
      unit: [data['unit'], req],
      rateperitem: [data['rateperitem'], req],
      taxablevalue: [data['taxablevalue'], req],
      cgstrate: [data['cgstrate'], req],
      cgstamt: [data['cgstamt'], req],
      sgstrate: [data['sgstrate'], req],
      sgstamt: [data['sgstamt'], req],
      igstrate: [data['igstrate'], req],
      igstamt: [data['igstamt'], req],

    });

    this.rowForms1.push(row);
  }
  addRow() {
    //if store - use all params
    var req = Validators.compose([Validators.required]);

    const row = this.fb.group({
      id: [null],
      mdformid: [this.form_id],
      partnumber: ['', req],
      description: ['', req],
      hsncode: ['', req],
      quantity: ['', req],
      unit: ['', req],
      rateperitem: ['', req],
      taxablevalue: ['', req],
      cgstrate: ['', req],
      cgstamt: ['', req],
      sgstrate: ['', req],
      sgstamt: ['', req],
      igstrate: ['', req],
      igstamt: ['', req],

    });

    this.rowForms.push(row);
  }
  get rowForms() {
    return this.form.get('materialDispatchParts') as FormArray;
  }
  get rowForms1() {
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
      getDate.expectedscrappingdate = this.todayDate
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
  formstatus: any;
  mdformid: any;
  ismailtrigger
  checkallpartId=null
  fetchmisdispatch(formid) {
    this.loading = false;
    var urlValue = this.appconstant + 'materialdispatch/get';
    var submitData = "formid=" + formid;
    this.ds.makeapi(urlValue, submitData,'post')
      .subscribe(data2 => {
        this.checkallpartId = formid
        //show information in screen.
        //show approval and reject
        console.log(data2)
        this.patchValue = data2;
        this.form_id = data2['id'];
        this.formstatus = data2['status'];
        this.ismailtrigger = data2['ismailtrigger']
        this.form.patchValue(this.patchValue);
        this.DocketForm.patchValue(this.patchValue)
        // var getform = this.remarkForm.value
        // getform.storeremarks = this.patchValue.storeremarks
        // this.remarkForm.patchValue(getform);

        // call the scrap file download list
        if (this.formstatus == 'storesubmitted') {
          this.downloadlist(formid);
        }
        // set the current date
        if( this.patchValue.expectchallandate == null ){
          var getDate = this.form.value;
          getDate.expectchallandate = this.todayDate
          this.form.patchValue(getDate);
  
        }
        
       
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
        }
        // disabled the checkbox and radin button 
        if (this.formstatus == 'packinitiated' || this.formstatus == 'packsubmitted' || this.formstatus == 'l4dispatchapproved'
          || this.formstatus == 'storesubmitted' || this.formstatus == 'packdispatched') {
          $('#shipment1').prop("disabled", true);
          $('#shipment2').prop("disabled", true);
          $('#shipment3').prop("disabled", true);
          $('#shipment4').prop("disabled", true);
          $('#shipment5').prop("disabled", true);
          $('#sap1').prop("disabled", true);
          $('#sap2').prop("disabled", true);
          $('#sap3').prop("disabled", true);
          $('#sap4').prop("disabled", true);
          $("#return1").prop("disabled", true);
          $('#return2').prop("disabled", true);
        }

        var misdispatchParts = data2['materialDispatchParts'];

        for (var i = 0; i < misdispatchParts.length; i++) {
          var misObj = misdispatchParts[i];
          this.mdformid = misdispatchParts[i]['mdformid'];
          this.addRow1(misObj);
        }

      });

  }

  sapreferenceVal: any;
  validation() {
    var isvalid = false;
    var formvalid = this.form.invalid;
    var remarkformvalid = this.remarkForm.invalid;
    console.log(this.form.value);
    var sapreferenceArr = [];
    $(".chkboxes:checked").each(function () {
      sapreferenceArr.push($(this).val());
    });
    this.sapreferenceVal = sapreferenceArr.join(',');

    var returnDateFormValidation = this.returnVal == '1' && this.form.value.expectedreturndate == "";
    var sapReference = sapreferenceArr.length == 0;
    var purposeShipment = this.returnVal == '0' && this.form.value.purposeofshipment == "";
    var expectReturDate = this.returnVal == '0' && this.form.value.expectedscrappingdate == "";
    var otherTextValue = this.purchaseotherVal == '4' && this.form.value.otherstext == "";
    var transPortMode = this.form.value.transportmode == "2" && this.form.value.l3 == "";

    if ((formvalid) || (remarkformvalid) || ((returnDateFormValidation) || (sapReference) ||
      ((purposeShipment) || (expectReturDate)) ||
      (otherTextValue) || (transPortMode))) {
      isvalid = true;
    }
    return isvalid;
  }



  updateArr = [];
  packinitiate() {
    this.updateArr = [];
    for (var x = 0; x < this.rowForms.value.length; x++) {
      this.updateArr.push({
        id: this.rowForms['value'][x]['id'],
        mdformid: this.rowForms['value'][x]['mdformid'],
        partnumber: '' + this.rowForms['value'][x]['partnumber'],
        description: '' + this.rowForms['value'][x]['description'],
        hsncode: '' + this.rowForms['value'][x]['hsncode'],
        quantity: '' + this.rowForms['value'][x]['quantity'],
        unit: '' + this.rowForms['value'][x]['unit'],
        rateperitem: this.rowForms['value'][x]['rateperitem'],
        taxablevalue: '' + this.rowForms['value'][x]['taxablevalue'],
        cgstrate: '' + this.rowForms['value'][x]['cgstrate'],
        cgstamt: '' + this.rowForms['value'][x]['cgstamt'],
        sgstrate: '' + this.rowForms['value'][x]['sgstrate'],
        sgstamt: '' + this.rowForms['value'][x]['sgstamt'],
        igstrate: '' + this.rowForms['value'][x]['igstrate'],
        igstamt: '' + this.rowForms['value'][x]['igstamt'],
      })
      console.log(this.updateArr)
    }
    let data = this.form.value;

    // if(data.expectchallan == '' || data.expectchallan == null){
    //   delete data.expectchallan;
    // }
    if (this.validation()) {

      $.notify('Invalid Form! Please fill all mandatory fields', "error");
      console.log(this.ds.findInvalidControls(this.form));
    }
    else {
      this.loading = true;
      this.saveData().subscribe(data1 => {
        if (data1.status == 'Success') {
          this.ds.makeapi(this.updatedispatch, this.updateArr, 'postjson')
            .subscribe(data2 => {
              if (data2.status == 'Success') {
                var Remarks = this.remarkForm.value.storeremarks;
                var submitData = "formid=" + this.form_id + "&status=packinitiated" + "&remarks=" + Remarks + "&usertype=" + this.usertype;
                var urlValue = this.appconstant + 'materialdispatch' + '/updateFormStatus';
                this.ds.makeapi(urlValue, submitData, 'post')
                  .subscribe(data3 => {

                    if (data3.status == 'Success') {
                      $.notify('Material Dispatch Form Packaging Initiated', "success");
                      this.router.navigate(['dashboard/matdislist']);
                    }
                    else {
                      this.router.navigate(['dashboard/matdislist']);
                    }
                  })
              }
            })
            , Error => {
              this.loading = false;

            };
        }
      })

    }
    // else {
    //   $.notify('Invalid Form', "error");
    //   console.log(this.ds.findInvalidControls(this.form));
    //   // console.log(this.ds.findInvalidControlsRecursive(this.form));
    //   for (var i = 0; i < this.form.get('materialDispatchParts').value.length; i++) {
    //     console.log(this.ds.findInvalidControls(this.form.get('materialDispatchParts').get('' + i)))

    //   }
    // }
  }
  packCompleteArr = [];
  packcomplete() {
    this.packCompleteArr = [];
    for (var x = 0; x < this.rowForms.value.length; x++) {
      this.packCompleteArr.push({
        id: this.rowForms['value'][x]['id'],
        mdformid: this.rowForms['value'][x]['mdformid'],
        partnumber: '' + this.rowForms['value'][x]['partnumber'],
        description: '' + this.rowForms['value'][x]['description'],
        hsncode: '' + this.rowForms['value'][x]['hsncode'],
        quantity: '' + this.rowForms['value'][x]['quantity'],
        unit: '' + this.rowForms['value'][x]['unit'],
        rateperitem: this.rowForms['value'][x]['rateperitem'],
        taxablevalue: '' + this.rowForms['value'][x]['taxablevalue'],
        cgstrate: '' + this.rowForms['value'][x]['cgstrate'],
        cgstamt: '' + this.rowForms['value'][x]['cgstamt'],
        sgstrate: '' + this.rowForms['value'][x]['sgstrate'],
        sgstamt: '' + this.rowForms['value'][x]['sgstamt'],
        igstrate: '' + this.rowForms['value'][x]['igstrate'],
        igstamt: '' + this.rowForms['value'][x]['igstamt'],
      })
    }
    let data = this.form.value;

    // if(data.expectchallan == '' || data.expectchallan == null){
    //   delete data.expectchallan;
    // }
    console.log(this.form.value);
    if (this.remarkForm.valid) {
      this.loading = true;
      this.saveData().subscribe(data1 => {
        if (data1.status == 'Success') {
          this.ds.makeapi(this.updatedispatch, this.packCompleteArr, 'postjson')
            .subscribe(data2 => {
              if (data2.status == 'Success') {
                var Remarks = this.remarkForm.value.storeremarks;
                var submitData = "formid=" + this.form_id + "&status=packsubmitted" + "&remarks=" + Remarks + "&usertype=" + this.usertype;
                var urlValue = this.appconstant + 'materialdispatch' + '/updateFormStatus';
                this.ds.makeapi(urlValue, submitData, 'post')
                  .subscribe(data3 => {

                    if (data3.status == 'Success') {
                      $.notify('Material Dispatch Form Packaging Completed', "success");
                      this.router.navigate(['dashboard/matdislist']);
                    }
                    else {
                      this.router.navigate(['dashboard/matdislist']);
                    }
                  })
              }
            })
            , Error => {
              this.loading = false;

            };
        }
      })

    }
    else {
      $.notify('Invalid Form', "error");
      console.log(this.ds.findInvalidControls(this.form));
      // console.log(this.ds.findInvalidControlsRecursive(this.form));
      for (var i = 0; i < this.form.get('materialDispatchParts').value.length; i++) {
        console.log(this.ds.findInvalidControls(this.form.get('materialDispatchParts').get('' + i)))

      }
    }
  }

  disatchArr = [];
  dispatch() {

    if (this.form.valid && this.remarkForm.valid && this.DocketForm.valid) {
      this.loading = true;
      // let data = this.form.value;
      this.saveData().subscribe(data1 => {
        if (data1.status == 'Success') {
              this.updateDocNo()
              }else{

              } 
               Error => {
              this.loading = false;

            };
        
      })

    }
    else {
      $.notify('Invalid Form', "error");
      console.log(this.ds.findInvalidControls(this.form));
      // console.log(this.ds.findInvalidControlsRecursive(this.form));
      for (var i = 0; i < this.form.get('materialDispatchParts').value.length; i++) {
        console.log(this.ds.findInvalidControls(this.form.get('materialDispatchParts').get('' + i)))

      }
    }
  }
  updateDocNo(){
    var docketno = this.DocketForm.value.docketno 
    var transporter = this.DocketForm.value.transporter
    var submitData = "formid=" + this.form_id + "&docketno=" + docketno + "&transporter=" + transporter;;
    this.ds.makeapi(this.updateDocNoAPI, submitData, 'post')
      .subscribe(data4 => {

        if (data4.status == 'Success') {
          var Remarks = this.remarkForm.value.storeremarks;
                var submitData = "formid=" + this.form_id + "&status=packdispatched" + "&remarks=" + Remarks + "&usertype=" + this.usertype;
                var urlValue = this.appconstant + 'materialdispatch' + '/updateFormStatus';
                this.ds.makeapi(urlValue, submitData, 'post')
                  .subscribe(data4 => {

                    if (data4.status == 'Success') {
                      $.notify('Material Dispatch Form Dispatched', "success");
                      this.router.navigate(['dashboard/matdislist']);
                    }
                    else {
                      this.router.navigate(['dashboard/matdislist']);
                    }
                  })
        }
        else {
        }
      })
   Error => {
  this.loading = false;

}
  }
  saveData() {
    let reqdata = '';
    let url = this.updatetotaldispatch;
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
    if(this.patchValue.expectchallandate == null){
      data.expectchallandate = $("#challandate").val();

    }
 
    // to convert the Mode of Transport value in string to interger

    data.transportmode = +this.form.value.transportmode;
    // set the empty value in othertext

    // if (this.purchaseotherVal == '4') {
    //   data.otherstext = this.form.value.otherstext;
    // }
    // else {
    //   data.otherstext = null;
    // }
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

  submitClose(){
    $('#confirmClose').modal('show');
  }


  close() {
    if (this.remarkForm.valid) {
      this.loading = true;
      var Remarks = this.remarkForm.value.storeremarks;
      var submitData = "formid=" + this.form_id + "&status=closed" + "&remarks=" + Remarks + "&usertype=" + this.usertype;
      var urlValue = this.appconstant + 'materialdispatch' + '/updateFormStatus';
      this.ds.makeapi(urlValue, submitData, 'post')
        .subscribe(data => {
          if (data.status == 'Success') {
            this.loading = false;
            $.notify('Material Dispatch Form Dispatched', "success");
            $('#confirmClose').modal('hide');
            this.router.navigate(['dashboard/matdislist']);
          } else {
            this.router.navigate(['dashboard/matdislist']);
          }
        }, Error => {

        });
    }
    else {
      $.notify('Remarks is Invalid', "error");
      $('#confirmClose').modal('hide');
    }
  }


  fileName;
  file_Name;
  UploadPartmasterfinallfile;
  UploadPartmastererrorFileUpload;
  fileformat: any;
  uploadfile(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      var file: File = fileList[0];
      this.fileName = file.name;
      this.file_Name = this.fileName
      var finalfilename = (this.fileName).split(".");
      this.fileName = finalfilename[0];
      var len = finalfilename.length - 1
      this.fileformat = finalfilename[len];
      this.UploadPartmasterfinallfile = file;
      this.UploadPartmastererrorFileUpload = "";

    }
  }



  //   MultipleFileUpload(form_id) {

  //     var formArray = [];
  //     var promisesArray = [];
  //     for (var i = 0; i < this.fileUploadArr.length; i++) {
  //       var fileUploadObj = this.fileUploadArr[i];
  //       console.log(fileUploadObj)
  //       let finalformdata: FormData = new FormData();
  //       finalformdata.append("formid", (form_id));
  //       finalformdata.append("filename", (fileUploadObj.filename));
  //       finalformdata.append("file", (fileUploadObj.file));
  //       finalformdata.append("fileformat", (fileUploadObj.fileformat));
  //       formArray.push(finalformdata);

  //       promisesArray.push(this.saveUploadFile(finalformdata))
  //     }

  //    Promise.all(promisesArray).then((result) => {
  //       console.log(result);
  //     })


  //   }

  //   private saveUploadFile(finalformdata) {

  //     return new Promise((resolve, reject) => {
  //       console.log(finalformdata);
  //       // this.ds.postFile(this.uploaddispatch, finalformdata)
  //       return this.ds.method(this.uploaddispatch, finalformdata, "downloadfileUrlencode")
  //         .subscribe(aodrawupload => {
  //           if (aodrawupload.status == 'success') {

  //             this.fileName = ';';
  //             resolve('success');

  //           }
  //           else {
  //             $.notify('File not Uploaded !!', "error");
  //             this.loading = false;
  //           }
  //           Error => {
  //             reject('Failed!')

  //           };
  //         });
  //     })
  // }


  submitForm() {
    $('#confirmSubmit').modal('show');
  }

  storesubmit() {
    if ((this.remarkForm.value.storeremarks == "") || (this.fileName == undefined)) {
      $.notify('Form is Invalid', "error");
      $('#confirmSubmit').modal('hide');
    }
    else {
      this.loading = true;
      var Remarks = this.remarkForm.value.storeremarks;
      var submitData = "formid=" + this.form_id + "&status=storesubmitted" + "&remarks=" + Remarks + "&usertype=" + this.usertype;
      var urlValue = this.appconstant + 'materialdispatch' + '/updateFormStatus';
      this.ds.makeapi(urlValue, submitData, 'post')
        .subscribe(data => {
          if (data.status == 'Success') {
            this.loading = false;
            let finalformdata: FormData = new FormData();
            var form_id = this.form_id;
            finalformdata.append("formid", (form_id));
            finalformdata.append("file", (this.UploadPartmasterfinallfile));
            finalformdata.append("filename", (this.file_Name));
            finalformdata.append("fileformat", (this.fileformat));
            this.ds.postFile(this.uploaddispatch, finalformdata)
              .subscribe(
                uploaddata => {
                  if (uploaddata.status == 'success') {
                    this.loading = false;
                    this.fileName = '';
                    $.notify('File Uploaded successfully !!', "success");
                    $('#confirmSubmit').modal('hide');
                  }
                  else {
                    this.loading = false;
                    $.notify('File not Uploaded !!', "error");
                    $('#confirmSubmit').modal('hide');
                  }

                },
                Error => {

                  this.loading = false;
                  $.notify('Something went wrong,try again later!', "error");
                  $('#confirmSubmit').modal('hide');

                });
            $.notify('Material Store Dispatch Form Submitted', "success");
            $('#confirmSubmit').modal('hide');
            this.router.navigate(['dashboard/matdislist']);
          } else {
            this.router.navigate(['dashboard/matdislist']);
          }
        }, Error => {
          this.loading = false;
        });
    }

  }

  deleteUpload(i) {
    var elem = document.getElementById('upload' + i);
    elem.parentNode.removeChild(elem);
    return false;
  }
  fileNameArr = [];
  fileDownloadList = [];
  listfileid;
  FileName: any;
  downloadlist(formid) {
    this.fileDownloadList = [];
    var submitData = "formid=" + formid;
    this.ds.makeapi(this.listDownloadAPI, submitData, 'post')
      .subscribe(data2 => {
        for (var i = 0; i < data2.length; i++) {
          this.fileDownloadList.push(data2[i]);
          this.listfileid = data2[i].id;
          this.FileName = data2[i].filename;
        }
        console.log(this.fileDownloadList)
      }, Error => {

      });

  }
  file_id;
  downlaodfile(filename, id) {
    this.file_id = id;
    this.loading = true;
    this.ds.method(this.fileDownloadAPI + "/" + this.file_id, filename, "downloadfile")
      .subscribe(res => {
        if (window.navigator.msSaveOrOpenBlob) {
          var fileData = [res.data];
          var blobObject = new Blob(fileData);
          window.navigator.msSaveOrOpenBlob(blobObject, filename);
          window.navigator.msSaveOrOpenBlob(blobObject, filename);
          this.loading = false;
        } else {
          this.loading = false;
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
          this.loading = false;
        });
  }
  MailTrigger() {
    this.loading = true
    var submitData = "formid=" + this.form_id;
    this.ds.makeapi(this.MailTriggerAPI, submitData, 'post')
      .subscribe(data2 => {
        if (data2.status == 'Success') {
          this.loading = false;
          $.notify('Mail sented successfully !!', "success");
        }
        else {
          this.loading = false;
          $.notify('Mail is not sent !!', "error");
        }
      }, Error => {

      });

  }
  addmisdispatch() {
    this.router.navigate(['dashboard/matdisnew'], {});
  }
  mislist() {
    this.router.navigateByUrl('/dashboard/matdislist');
  }
  downloadZip(filename) {
      this.loading = true
      var Id = [{"id":this.checkallpartId}]
        var submitData = { "materialDispatchIdList": Id, "status": "" };
      


      return this.ds.method(this.downloadPDFdispatch, submitData, "downloadfileZIPjson")
        .subscribe(res => {

          if (window.navigator.msSaveOrOpenBlob) {
            this.loading = false;
            var fileData = [res.data];
            var blobObject = new Blob(fileData);
            // $(anchorSelector).click(function(){
            window.navigator.msSaveOrOpenBlob(blobObject, filename);
            window.navigator.msSaveOrOpenBlob(blobObject, filename);
          } else {
            // console.log("not IE browser");
            this.loading = false;
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
            this.loading = false;
          });
    }
}
