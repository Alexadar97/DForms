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
  selector: 'app-material-dis-upload',
  templateUrl: './material-dis-upload.component.html',
  styleUrls: ['./material-dis-upload.component.css']
})
export class MaterialDisUploadComponent implements OnInit {

  loading = true;
  form: FormGroup;
  fb;
  checkOptions;
  returnVal;
  l4Users;
  l3Users;
  today = new Date();
  todayDate: any;
  numbervalidation = /^[0][1-9]\d{9}$|^[1-9]\d{9}$/;
  private appconstant = this.ds.appconstant;
  private savemispatch = this.appconstant + 'materialdispatch/saveDummyForm';
  private mislistusers = this.ds.appconstant + 'user/list';
  private upload = this.ds.appconstant + 'materialdispatch/uploadExcelFile';
  private validationAPI = this.ds.appconstant + 'materialdispatch/validateFile';
  constructor(notifierService: NotifierService, fb: FormBuilder, private route: ActivatedRoute, private http: Http, private router: Router, private _location: Location, private ds: DataserviceService) {
    this.fb = fb;

  }

  ngOnInit() {
    this.loading = false;
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    var userShortId = jsonData['shortid'];
    var userid = jsonData.shortid;
    var req = Validators.compose([Validators.required]);

    var num = Validators.compose([Validators.required, Validators.pattern(this.numbervalidation)]);
    this.checkOptions = ["Returnable", "Non Returnable"]
    var req = Validators.compose([Validators.required]);
    this.todayDate = moment(new Date()).format('DD-MM-YYYY');
    // this.returnVal = this.checkOptions[0]
    this.form = this.fb.group({
      id: [null],
      requesterid: [userid],
      costcenter: ['', req],
      l4: ['', req],
      l3: [''],
      dispatchpurpose: ['', req],
      transportmode: ['', req],
      sapreference: [''],
      otherstext: "",
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
      returnOrNonReturn: [null, req],
      expectedreturndate: ['' + this.todayDate],
      expectedscrappingdate: ['' + this.todayDate],
      purposeofshipment: "",
      materialDispatchParts: this.fb.array([]),

    });

    // this.addretro();

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
    this._location.back();
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
  returnchked = false;
  nonreturncheked = false;


  checkReturnable(event, val) {
    var targetChecked = event.target.checked;
    if (targetChecked) {
      this.returnVal = val;
      this.returnchked = true;
      this.form.value.expectedreturndate = "";
      this.nonreturncheked = false;
    }
    else {
      this.form.patchValue({ expectedreturndate: '' })
      this.form.value.expectedreturndate = $("#arrivedate").val();
      this.returnchked = false;
    }

  }
  notreturnVal: any;
  checkNonReturnable(event, val) {
    var targetChecked = event.target.checked;
    if (targetChecked) {
      this.notreturnVal = val;
      this.nonreturncheked = true;
      // this.form.value.expectedscrappingdate = "";
      this.form.value.purposeofshipment = "";
      this.returnchked = false;
    }
    else {
      this.form.patchValue({ purposeofshipment: '' });
      $('#shipment1').prop('checked', false);
      $('#shipment2').prop('checked', false);
      $('#shipment3').prop('checked', false);
      $('#shipment4').prop('checked', false);
      $('#shipment5').prop('checked', false);
      this.form.value.expectedscrappingdate = $("#excepteddate").val("");
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
      this.four = "4"
      console.log(this.targetChecked)
      this.purchaseotherVal = val;
      this.workshow = true;

    } else if (this.targetChecked == false) {
      this.four = ""
      this.purchaseotherVal = ""
      console.log(this.targetChecked)
      this.workshow = false
      this.form.patchValue({ otherstext: '' });


    }

  }

  one
  two
  three
  four
  shipment1
  shipment2
  shipment3
  shipment4
  shipment5
  saveData() {
    let reqdata = '';
    let url = this.savemispatch;
    let data = this.form.value;
    console.log(data);

    //  set the SAP Reference of Original Document Value

    // var sapreferenceArr = [];
    // $(".chkboxes:checked").each(function () {
    //   sapreferenceArr.push($(this).val());
    // });

    // var sapreferenceVal = sapreferenceArr.join(',');
    data.sapreference = this.sapreferenceVal;

    // set the Purpose of Shipment Value

    var shipmentyArr = [];
    $(".chkShipment:checked").each(function () {
      shipmentyArr.push($(this).val());
    });

    var chekedshipmentyVal = shipmentyArr.join(',');
    data.purposeofshipment = chekedshipmentyVal;

    //  set the Expected Date of Scrapping date value

    data.expectedscrappingdate = $("#excepteddate").val();
    delete data.materialDispatchParts

    //  set the Expected Date of Arriving date value

    data.expectedreturndate = $("#arrivedate").val();

    // to convert the Mode of Transport value in string to interger

    data.transportmode = +this.form.value.transportmode;

    // set the Approver l4 and l3 null value

    if (data.transportmode == '1') {
      data.l3 = null;
    }

    // set the empty value in othertext

    if (this.purchaseotherVal == '4') {
      data.otherstext = this.form.value.otherstext;
    }
    else {
      data.otherstext = null;
    }

    reqdata = JSON.stringify(data);
    console.log(reqdata)
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
  sapreferenceVal: any
  validation() {
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
    var transPortMode = this.form.value.transportmode == "2" && this.form.value.l3 == "";
    console.log(this.targetChecked)
    console.log(this.form.value.otherstext)
    if ((formvalid) || ((returnDateFormValidation) || (sapReference) ||
      ((purposeShipment) || (expectReturDate)) ||
      (otherTextVal) || (transPortMode))) {
      isvalid = true;
    }
    return isvalid;
  }
  modalvlaue = null
  submitForm() {
    $('#confirmSubmit').modal('show');
  }
  uploadfileid = null
  showeditvalue = false
  confirmSubmit() {

    if (this.validation()) {

      $.notify('Invalid Form! Please fill all mandatory fields', "error");
      $('#confirmSubmit').modal('hide');
      console.log(this.ds.findInvalidControls(this.form));
    }
    else {
      this.loading = true;
      let data = this.form.value;
      if (data.id == null) {
        delete data.id;
      }
      if (this.fileName != undefined) {
        let finalformdata: FormData = new FormData();
        finalformdata.append("filename", (this.fileName));
        finalformdata.append("file", (this.UploadPartmasterfinallfile));
        var validateUrl = this.ds.appconstant + "materialdispatch/validateFile";
        this.ds.postFile(validateUrl, finalformdata)
          .subscribe(validationdata => {
            if (validationdata.status == 'success') {

        this.saveData().subscribe(data => {
          if (data.status == 'Success') {
            this.uploadfileid = data.id
                  finalformdata.append("dummyformid", (this.uploadfileid));
                  this.ds.postFile(this.upload, finalformdata)

                    .subscribe(
                      uploaddata => {
                        this.loading = false;
                        if (uploaddata.status == 'Success') {
                          this.fetchmisdispatch(data.id)
                          // this.fetchmisdispatch(this.uploadfileid)
                          this.showeditvalue = true
                          $('#uploadpackmaster').modal("hide");
                          $('#confirmSubmit').modal('hide');
                          $.notify('File uploaded successfully !!', "success");
                          this.fileName = '';
                        }
                        else {
                          $('#uploadpackmaster').modal("hide");
                          $('#confirmSubmit').modal('hide');
                          $.notify('File not Uploaded !!', "error");

                        }
                      },
                      Error => {

                        this.loading = false;
                        $('#uploadpackmaster').modal("hide");
                        $('#confirmSubmit').modal('hide');
                        $.notify('Something went wrong,try again later!', "error");
                      });
                }
              }), Error => {

              }
            this.loading = false;
            $('#confirmSubmit').modal('hide');
          }
          else {
            $.notify(validationdata.field+' '+'!', "error");
            $('#confirmSubmit').modal('hide');
            this.loading = false;
          }

        },
          Error => {
            this.loading = false;
          });;
      } else {
        $.notify('Invalid Upload File!', "error");
        this.loading = false;
      }
    }
  }
  addmisdispatch() {
    this.router.navigate(['dashboard/matdisnew'], {});
  }
  mislist() {
    this.router.navigateByUrl('/dashboard/matdislist');
  }
  fileName1;
  fileName2

  UploadPartmasterfinallfile1;
  UploadPartmastererrorFileUpload;
  UploadPartmasterfinallfile2;
  UploadPartmasterfinallfile
  // uploadfile
  fileName
  uploadfile(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      var file: File = fileList[0];
      this.fileName = file.name;
      var finalfilename = (this.fileName).split(".");
      this.fileName = finalfilename[0];
      this.UploadPartmasterfinallfile = file;
      this.UploadPartmastererrorFileUpload = "";
      // $("#uploadpackmaster").modal("show");
    }
  }
  patchValue: any;
  form_id: any;
  formstatus: any;
  mdformid: any;
  ismailtrigger
  fileuploadid=null
  fetchmisdispatch(formid) {
    this.loading = false;
    var urlValue = this.appconstant + 'materialdispatch/getDummyForm';
    var submitData = "dummyformid=" + formid;
    this.ds.makeapi(urlValue, submitData, 'post')
      .subscribe(data => {
        this.fileuploadid = data.id
        var stoParts = data['materialDispatchPartsDummy'];
        var stoObj = {};
        for (var i = 0; i < stoParts.length; i++) {
          stoObj = stoParts[i];
          this.showRow(stoObj);
        }
      });

  }
  get rowForms() {
    return this.form.get('materialDispatchParts') as FormArray;
  }
  showRow(data) {
    var req = Validators.compose([Validators.required]);

    const row1 = this.fb.group({

      id: [data['id']],
      mdformid: [data['mdformid']],
      partnumber: [data['partnumber'], req],
      description: [data['description'], req],
      hsncode: [data['hsncode'], req],
      quantity: [data['quantity'], req],
      unit: [data['unit'], req],
      rateperitem: [data['rateperitem'], req],


    });

    this.rowForms.push(row1);
  }
  uploadid=null
  finalconfirmsubmit() {
    var urlValue = this.appconstant + 'materialdispatch/confirmDummyForm';
    var submitData = "dummyformid=" + this.uploadfileid;
    this.loading = true;
    this.ds.makeapi(urlValue, submitData, 'post')
      .subscribe(data => {
        if (data.status == 'Success') {
          this.uploadid = data.id
          $.notify('Form submitted successfully !!', "success");
          this.loading = false;
          $('#confirmUpload').modal('hide');
          this.router.navigateByUrl('dashboard/matdislist');
        }
        Error => {
          this.loading = false;
        };
      })
  }
  confirmCancel() {
    var urlValue = this.appconstant + 'materialdispatch/cancelDummyForm';
    this.loading = true;
    this.ds.makeapi(urlValue, '', 'post')
      .subscribe(data => {

        if (data.status == 'Success') {
          this.loading = false;
          $.notify('Form submitted successfully !!', "success");
          $('#cancelUpload').modal('hide');
          $.notify('Form cancelled !!', "danger");
          this.router.navigateByUrl('dashboard/matdislist');
        }
        Error => {
          this.loading = false;
        };
      })
  }
  checkbox1(event){
    var value = event.target.checked
    if(value == true){
      this.shipment1 = '1'
    }else{
      this.shipment1 = ''
    }
  }
  checkbox2(event){
    var value = event.target.checked
    if(value == true){
      this.shipment2 = '2'
    }else{
      this.shipment2 = ''
    }
  }
  checkbox3(event){
    var value = event.target.checked
    if(value == true){
      this.shipment3 = '3'
    }else{
      this.shipment3 = ''
    }
  }
  checkbox4(event){
    var value = event.target.checked
    if(value == true){
      this.shipment4 = '4'
    }else{
      this.shipment4 = ''
    }
  }
  checkbox5(event){
    var value = event.target.checked
    if(value == true){
      this.shipment5 = '5'
    }else{
      this.shipment5 = ''
    }
  }
  selectbox1(event){
    var value = event.target.checked
    if(value == true){
      this.one = '1'
    }else{
      this.one = ''
    }
  }
  selectbox2(event){
    var value = event.target.checked
    if(value == true){
      this.two = '2'
    }else{
      this.two = ''
    }
  }
  selectbox3(event){
    var value = event.target.checked
    if(value == true){
      this.three = '3'
    }else{
      this.three = ''
    }
  }
  
}
