import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NotifierService } from 'angular-notifier';
import { DataserviceService } from '../../dataservice.service';
import { ActivatedRoute } from '@angular/router';
import { IfStmt } from '@angular/compiler';
import { idLocale } from 'ngx-bootstrap/chronos/i18n/id';
declare var $, moment;
@Component({
  selector: 'app-protonew',
  templateUrl: './protonew.component.html',
  styleUrls: ['./protonew.component.css']
})
export class ProtonewComponent implements OnInit {
  disabled = false;
  ShowFilter = false;
  limitSelection = false;
  subfunction: any = [];
  subfunctionlist: any = [];
  subfunctionppslist: any = [];
  selectedItems: any = [];
  dropdownSettings: any = {};
  l4ProtoUsers;
  today = new Date();
  formId = null;
  loading = false;
  private readonly notifier: NotifierService;
  numbervalidation = /^[0][1-9]\d{9}$|^[1-9]\d{9}$/;
  ProtoReqForm: FormGroup;
  private appconstant = this.ds.appconstant;
  private saveproto = this.appconstant + 'proto/save';
  private protolistusers = this.ds.appconstant + 'user/list';
  private searchvehicleownerapi = this.appconstant + 'proto/searchVehicleOwner';
  private aodrawinguploadapi = this.appconstant + 'proto/uploadAOFile';
  private supervisorListApi = this.appconstant + 'proto/functionList';
  private supervisorTypeListApi = this.appconstant + 'proto/subFunctionList';
  private shortIdSearch = this.appconstant + 'user/search';
  private protolistapi = this.appconstant + 'proto/list';
  myDateValue: Date;
  protousertype;
  Shortid;
  status;
  isProtoVehicleOwner = false;
  isProtoHDTSupervisor = false;
  isProtoMDTSupervisor = false;
  isProtoAggregateSupervisor = false;
  isProtoMaintenanceSupervisor = false;
  isProtoEandESupervisor = false;
  isProtoPPSSupervisor = false;
  isProtoMechanicalSupervisor = false;
  isProtoadmin = false;
  isProtoreq = false;
  isOFMVisible = false;
  constructor(notifierService: NotifierService, private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private ds: DataserviceService, private http: Http) {
    this.fb = fb;
    this.notifier = notifierService;
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    var userShortId = jsonData['shortid'];
    var userid = jsonData.shortid;

    this.myDateValue = new Date();

    if (userid == null) {
      userid = 'Arul';
    }
    var usertype = "";

    if (jsonData['usertype']) {
      usertype = jsonData['usertype'].toLowerCase();
      this.protousertype = usertype
      this.Shortid = userShortId
    }
    if (usertype === "protovehicleowner") {
      this.status = 'protovehicleowner'
      this.isProtoVehicleOwner = true;
    } else if (usertype === "hdtsupervisor") {
      this.status = 'hdtsupervisor'
      this.isProtoHDTSupervisor = true;
    }
    else if (usertype === "mdtsupervisor") {
      this.status = 'mdtsupervisor'
      this.isProtoMDTSupervisor = true;
    }
    else if (usertype === "aggregatesupervisor") {
      this.status = 'aggregatesupervisor'
      this.isProtoAggregateSupervisor = true;
    }
    else if (usertype === "eandesupervisor") {
      this.status = 'eandesupervisor'
      this.isProtoEandESupervisor = true;
    }
    else if (usertype === "ppssupervisor") {
      this.status = 'ppssupervisor'
      this.isProtoPPSSupervisor = true;
    }
    else if (usertype === "maintenancesupervisor") {
      this.status = 'maintenancesupervisor'
      this.isProtoMaintenanceSupervisor = true;
    }
    else if (usertype === "mechanicalsupervisor") {
      this.status = 'mechanicalsupervisor'
      this.isProtoMechanicalSupervisor = true;
    }
    else if (usertype === "admin") {
      this.status = 'admin'
    }

    else if (usertype === "requster") {
      this.status = 'requster'
      this.isProtoreq = true;
    }
    else {
      this.status = '';
    }
    var req = Validators.compose([Validators.required]);
    var num = Validators.compose([Validators.required, Validators.pattern(this.numbervalidation)]);
    this.ProtoReqForm = this.fb.group({
      id: [null],
      usertype: [this.status],
      requestorid: [userid],
      contactno: [null, num],
      category: [null],
      l4: [null, req],
      categoryothers: "",
      retrofitmentothers: "",
      supervisor: ["", req],
      subsupervisor: [""],
      projectname: ['', req],
      noofvehicleorobj: [1, req],
      systemname: ['', req],
      activity: ['', req],
      storagePurpose: ['', req],
      retrofitmenttype: [''],
      aodrawing: ['', req],
      fitmentreport: ['', req],
      finasupdate: ['', req],
      aodrawingtext: "",
      filepath: "",
      fitmentremarks: [null],
      finasupdateremarks: [null],
      umcsParts: this.fb.array([]),
      prvehiclemaster: this.fb.array([])
    });
  }

  get rowForms() {
    return this.ProtoReqForm.get('umcsParts') as FormArray;
  }
  addrow=0
  addRow() {
    this.addrow++
    var req = Validators.compose([Validators.required]);
    var zeroValidation = /^(?=.*\d)(?=.*[1-9]).{1,10}$/;
    var nonZero = Validators.compose([Validators.required, Validators.pattern(zeroValidation)]);
    const row = this.fb.group({
      finasid: [null],
      ascorderview: [this.addrow],
      partnumber: ['', req],
      description: ['', req],
      quantity: ['', nonZero],
      zgs: ['', req],
      scraporstored: ['', req]
    });


    this.rowForms.push(row);
  }
  
  alertMap = {}
  alertMessage=""
  onChanges(){
    var isUrgent = false;
    this.ProtoReqForm.get('prvehiclemaster').valueChanges.subscribe(data=>{
      
      //startdate
      data.map((vehicle)=>{
        var startVal = vehicle['startdate'];
        var startWeek = moment(new Date(startVal)).week();
        var currentWeek = moment(new Date()).week();
        
        if(startWeek == currentWeek){
          isUrgent = true;
        }

      })

      
      if(isUrgent){
        var alertMessage = "You are raising an Unplanned work request, Kindly make a confirmation with Proto team before initiating the request"
        // $('#confirmSubmit2').modal('show');
        $("#alertMessage").html(alertMessage)
      }else{
        // this.alertMessage = ""
        $("#alertMessage").html('')
      }

    })

    
    
  }

  deleteRow(i) {
    this.rowForms.removeAt(i);
  }

  goBack() {
    this.router.navigate(['dashboard/protolist'], {});
  }


  ngOnInit() {
    var value = this.route.queryParams
      .subscribe(params => {
        if (params.id != null) {
          this.fetchFormDetails(params.id);
        }
        else {
          this.addRow();
          this.addvehicle();
        }
      });
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    var userid = jsonData.shortid;
    if (userid == null) {
      userid = 'Arul';
    }
    this.subfunction = [
      { item_id: 1, item_text: 'Aggregate Engine' },
      { item_id: 2, item_text: 'Aggregate Transmission' },
      { item_id: 3, item_text: 'Aggregate Axle' },
      { item_id: 4, item_text: 'E&E' },
      { item_id: 5, item_text: 'PPS' },
      { item_id: 6, item_text: 'Maintenance' },
      { item_id: 7, item_text: 'Proto Mechanical Workshop' }
    ];
    this.subfunctionlist = [
      { item_id: 1, item_text: 'Vehicle HDT' },
      { item_id: 2, item_text: 'Vehicle MDT' },
      { item_id: 3, item_text: 'E&E' },
      { item_id: 4, item_text: 'PPS' },
      { item_id: 5, item_text: 'Maintenance' },
      { item_id: 6, item_text: 'Proto Mechanical Workshop' }
    ];
    this.subfunctionppslist = [
      { item_id: 1, item_text: 'Aggregate Engine' },
      { item_id: 2, item_text: 'Aggregate Transmission' },
      { item_id: 3, item_text: 'Aggregate Axle' },
      { item_id: 4, item_text: 'Vehicle HDT' },
      { item_id: 5, item_text: 'Vehicle MDT' },
      { item_id: 6, item_text: 'E&E' },
      { item_id: 7, item_text: 'Maintenance' },
      { item_id: 8, item_text: 'Proto Mechanical Workshop' }
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      value: 'value',
      selectAllText: 'Select All',
      unSelectAllText: 'DeSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: this.ShowFilter
    };
    var usertype = "usertype=L4"
    this.ds.makeapi(this.protolistusers, usertype, "post")
      .subscribe(data => {

        this.l4ProtoUsers = data;

      },
        Error => {
        });

        this.onChanges()
  }

  multiselected = [];
  checkedItem;
  onItemSelect(item: any) {
    console.log('onItemSelect', item);
  }
  onSelectAll(items: any) {
    console.log('onSelectAll', items);

  }
  toogleShowFilter() {
    this.ShowFilter = !this.ShowFilter;
    this.dropdownSettings = Object.assign({}, this.dropdownSettings, { allowSearchFilter: this.ShowFilter });
  }

  handleLimitSelection() {
    if (this.limitSelection) {
      this.dropdownSettings = Object.assign({}, this.dropdownSettings, { limitSelection: 2 });
    } else {
      this.dropdownSettings = Object.assign({}, this.dropdownSettings, { limitSelection: null });
    }
  }

  typeOthershow = false;
  targetChecked: any;
  TypesOtherVal: any;
  PartOthers(event, val) {
    console.log(event);
    console.log(val);
    this.targetChecked = event.target.checked;
    if (this.targetChecked == true) {
      console.log(this.targetChecked)
      this.TypesOtherVal = val;
      this.typeOthershow = true;

    } else if (this.targetChecked == false) {
      this.TypesOtherVal = ""
      console.log(this.targetChecked)
      this.typeOthershow = false
      this.ProtoReqForm.patchValue({ retrofitmentothers: '' });
    }
  }


  categoryOthershow = false;
  categoryChecked: any;
  CategoryOtherVal: any;
  CategoryOthers(event, val) {
    console.log(event);
    console.log(val);
    this.categoryChecked = event.target.checked;
    if (this.categoryChecked == true) {
      console.log(this.categoryChecked)
      this.CategoryOtherVal = val;
      this.categoryOthershow = true;

    } else if (this.categoryChecked == false) {
      this.CategoryOtherVal = ""
      console.log(this.categoryChecked)
      this.categoryOthershow = false
      this.ProtoReqForm.patchValue({ categoryothers: '' });
    }
  }

  aoyes = false;
  aono = false;
  AoDrawVal: any;
  aodrawyes(value) {
    this.AoDrawVal = value;
    console.log(this.AoDrawVal)
    if (value == '1') {
      this.aoyes = true;
      this.aono = false;
    }
    else if (value == '0') {
      this.fileUploadArr = [];
      this.aoyes = false;
      this.aono = true;
    }
    else {
      this.aono = false;
    }

  }
  FiementReportYes(event, val) {
    var ReportChecked = event.target.checked;
    if (ReportChecked == true) {
      this.ReportValue = val;
      this.reportno = false;
      this.ProtoReqForm.patchValue({ fitmentremarks: '' });
    }
  }

  ReportValue: any;
  reportno = false;
  FiementReportNo(event, val) {
    var ReportChecked = event.target.checked;
    if (ReportChecked == true) {
      this.ReportValue = val;
      this.reportno = true;
      this.ProtoReqForm.patchValue({ fitmentremarks: '' });
    }
  }
  updateno = false;
  FinasUpdateYes(event, val) {
    var UpdateChecked = event.target.checked;
    if (UpdateChecked == true) {
      this.ReportValue = val;
      this.updateno = false;
      this.ProtoReqForm.patchValue({ finasupdateremarks: '' });
    }
  }

  FinasValue: any;
  FinasUpdateNo(event, val) {
    var UpdateChecked = event.target.checked;
    if (UpdateChecked == true) {
      this.FinasValue = val;
      this.updateno = true;
      this.ProtoReqForm.patchValue({ finasupdateremarks: '' });
    }
  }


  VehicleHDTandMDT = false;
  VehicleEngandTransandAxle = false;
  VehiclePPS = false;

  partFunction(value) {
    this.ProtoReqForm.patchValue({
      'subsupervisor': []
    });


    console.log(value)
    if (value == 'hdtsupervisor' || value == 'mdtsupervisor') {
      this.VehicleHDTandMDT = true;
      this.VehicleEngandTransandAxle = false;
      this.VehiclePPS = false;
    }
    else if (value == 'aggregateengine' || value == 'aggregatetransmission' || value == 'aggregateaxle') {
      this.VehicleHDTandMDT = false;
      this.VehicleEngandTransandAxle = true;
      this.VehiclePPS = false;
    }
    else if (value == 'ppssupervisor') {
      this.VehicleHDTandMDT = false;
      this.VehicleEngandTransandAxle = false;
      this.VehiclePPS = true;
    }
    else {
      this.VehicleHDTandMDT = false;
      this.VehicleEngandTransandAxle = false;
      this.VehiclePPS = false;
    }
  }

  get novehicle() {
    return this.ProtoReqForm.get('prvehiclemaster') as FormArray;

  }
  vehicleCount;
  addrow1=0
  addvehicle() {
    this.addrow1++
    var counter = $('#novchobj').val();
    counter++;
    this.vehicleCount = counter;
    console.log(this.vehicleCount)
    $('#novchobj').val(counter);
    var req = Validators.compose([Validators.required]);
    var todayDate = moment(new Date()).format('DD-MM-YYYY');
    const vehi = this.fb.group({
      ascorderview: [this.addrow1],
      ownername: [''],
      ownershortid: [, req],
      vehicleaggregateno: [''],
      modelnumber: [, req],
      startdate: ['' + todayDate]
    });

    this.novehicle.push(vehi);
  };
  decreasevehicle;
  deletevehicle(control) {
    // var counter = $('#novchobj').val();
    // counter--;
    // this.decreasevehicle = counter;
    // console.log(this.decreasevehicle)
    // $('#novchobj').val(counter);
    this.novehicle.removeAt(control.length-1);
  }


  saveProto() {

    let reqdata = '';
    let url = this.saveproto;
    let data = this.ProtoReqForm.value;

    /*Set with type of activity values*/
    var chkArray = [];
    var selected;
    $(".chk:checked").each(function () {
      chkArray.push($(this).val());
    });
    selected = chkArray.join(',');
    console.log(selected);
    // data.retrofitmenttype = selected + data.retrofitmenttypeother;
     data.retrofitmenttype = selected ;

    /* Set with work request values*/
    var chkboxesArray = [];
    $(".chkboxes:checked").each(function () {
      chkboxesArray.push($(this).val());
    });
    var selected;
    selected = chkboxesArray.join(',');
    console.log(selected);
    // data.category = selected + data.workother;
     data.category = selected ;

    /*set the date value*/

    for (var i = 0; i < data.prvehiclemaster.length; i++) {
      data.prvehiclemaster[i].startdate = $("#date" + i).val();
    }

    /* set with subfunction multiselct values */

    var arrselect = [];
    var getmultipleSelectValue = data.subsupervisor;
    for (let j = 0; j < getmultipleSelectValue.length; j++) {
      var setmulitpleValue = getmultipleSelectValue[j].item_text;
      if (setmulitpleValue == 'Vehicle HDT') {
        setmulitpleValue = 'hdtsupervisor'
      }
      else if (setmulitpleValue == 'Vehicle MDT') {
        setmulitpleValue = 'mdtsupervisor'
      }
      else if (setmulitpleValue == 'E&E') {
        setmulitpleValue = 'eandesupervisor'
      }
      else if (setmulitpleValue == 'PPS') {
        setmulitpleValue = 'ppssupervisor'
      }
      else if (setmulitpleValue == 'Maintenance') {
        setmulitpleValue = 'maintenancesupervisor'
      }
      else if (setmulitpleValue == 'Proto Mechanical Workshop') {
        setmulitpleValue = 'mechanicalsupervisor'
      }
      else if (setmulitpleValue == 'Aggregate Engine') {
        setmulitpleValue = 'aggregateengine'
      }
      else if (setmulitpleValue == 'Aggregate Transmission') {
        setmulitpleValue = 'aggregatetransmission'
      }
      else if (setmulitpleValue == 'Aggregate Axle') {
        setmulitpleValue = 'aggregateaxle'
      }
      arrselect.push(setmulitpleValue);
    }

    data.subsupervisor = arrselect.join(',');

    /* no of vehicle and object show the values */

    data.noofvehicleorobj = this.vehicleCount;;


    // set the aodrawing value

    if (this.AoDrawVal == "1") {
      data.aodrawingtext = this.ProtoReqForm.value.aodrawingtext;
    }
    else {
      data.aodrawingtext = "";
    }

    if(this.TypesOtherVal == '5'){
      data.retrofitmentothers = this.ProtoReqForm.value.retrofitmentothers;
    }
    else{
      data.retrofitmentothers = "";
    }

    if(this.CategoryOtherVal == '4'){
      data.categoryothers = this.ProtoReqForm.value.categoryothers;
    }
    else{
      data.categoryothers = "";
    }






    /*  separated with integer*/
    data.aodrawing = +this.ProtoReqForm.value.aodrawing;
    data.fitmentreport = +this.ProtoReqForm.value.fitmentreport;
    data.finasupdate = +this.ProtoReqForm.value.finasupdate;

    console.log(data)
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
  isVechError = false
  searchlist = [];
  searchvalue:any
  search(value) {
    let reqdata = "searchstr=" + value;
    let url = this.searchvehicleownerapi;
    this.ds.makeapi(url, reqdata, "post").subscribe(data => {
      this.searchlist = data;
      this.searchvalue = value
      this.isVechError = false
    })
  }

  searchOwner(i) {

    var vehicleOwner = this.novehicle.controls[i]['value']['ownershortid']
    this.ds.makeapi(this.shortIdSearch, 'shortid=' + vehicleOwner, "post")
      .subscribe(data => {
        if(this.searchvalue != undefined){
          this.isVechError = true
        }
        console.log(this.novehicle);
        console.log(this.novehicle.controls);
        this.novehicle.controls[i].get('ownershortid').setValue(data.shortid);
        this.novehicle.controls[i].get('ownername').setValue(data.firstname + " " + data.lastname)
      },
        Error => {
        })
  }
  nospace(event: any) {
    const pattern = /^\S*$/
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  keyAlpha(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  fileName;
  Uploadaodrawfile;
  AodrawFileUpload;
  fileformat = '';
  fileUploadArr = []
  uploadfile(event) {
    console.log(event)
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.loading = true;


      // var formid = this.ProtoReqForm.value.id;
      // var filename = this.fileName;
      // var multiplefile = this.Uploadaodrawfile
      // var fileformat = this.fileformat;


      for (var i = 0; i < fileList.length; i++) {
        var file: File = fileList[i];
        this.fileName = file.name;
        var finalfilename = (this.fileName).split(".");
        this.fileName = finalfilename[0];
        var len = finalfilename.length - 1
        this.fileformat = finalfilename[len];

        this.fileUploadArr.push({ "filename": file.name, "file": file, "fileformat": this.fileformat })
        this.Uploadaodrawfile = file;[]
        this.AodrawFileUpload = "";
      }
      //   var file: File = fileList[0];
      //     this.fileName = file.name;
      //     var finalfilename = (this.fileName).split(".");
      //     this.fileName = finalfilename[0];
      //     var len = finalfilename.length - 1
      //     this.fileformat = finalfilename[len];
      //     this.Uploadaodrawfile = file;[]
      //     this.AodrawFileUpload = "";
      //  
      setTimeout(() => {
        this.loading = false;
      }, 4000)

    }

  }


  /* checkForFormValidation() {
  //   //check if the two flags are enabled.
  //   //and forms - array - invalid.
  //   //return true

  //   console.log(this.ProtoReqForm.value);
  //   // console.log(workrequest);


  //   return this.ProtoReqForm.valid;
  // } */

  findInvalidsControls(formValidateControl) {
    const invalid = [];
    const controls = formValidateControl.controls;
    for (const formValidateControl in controls) {
      if (controls[formValidateControl].invalid) {
        invalid.push(formValidateControl);
      }
    }
    return invalid;
  }


  deleteUpload(index) {
    var elem = document.getElementById('upload' + index);
    elem.parentNode.removeChild(elem);
    var tmpArr = [];
    this.fileUploadArr.map(function (item, i) {
      if (index != i) {
        tmpArr.push(item);
      }
    });
    this.fileUploadArr = tmpArr
    return false;
  }


  MultipleFileUpload(form_id) {

    var formArray = [];
    var promisesArray = [];
    for (var i = 0; i < this.fileUploadArr.length; i++) {
      var fileUploadObj = this.fileUploadArr[i];
      console.log(fileUploadObj)
      let finalformdata: FormData = new FormData();
      finalformdata.append("formid", (form_id));
      finalformdata.append("filename", (fileUploadObj.filename));
      finalformdata.append("file", (fileUploadObj.file));
      finalformdata.append("fileformat", (fileUploadObj.fileformat));
      formArray.push(finalformdata);
      // this.saveUploadFile(finalformdata);
      promisesArray.push(this.saveUploadFile(finalformdata))
    }

    console.log(formArray);
    // this.saveUploadFile(formArray[0]);

    Promise.all(promisesArray).then((result) => {
      console.log(result);

      // this.ds.notify('All AO Drawing Files Uploaded successfully !!', "success");
      // this.fileName = ';';

      // // $.notify('File not Uploaded !!', "error");
      // this.loading = false;

    })

    // let finalformdata: FormData = new FormData();
    // finalformdata.append("formid", (form_id));
    // finalformdata.append("filename", (this.fileName));
    // finalformdata.append("file", (this.Uploadaodrawfile));
    // finalformdata.append("fileformat", (this.fileformat));


  }

  private saveUploadFile(finalformdata) {

    return new Promise((resolve, reject) => {
      console.log(finalformdata);
      this.ds.postFile(this.aodrawinguploadapi, finalformdata)
        .subscribe(aodrawupload => {
          // this.loading = false;
          if (aodrawupload.status == 'success') {

            this.fileName = ';';
            resolve('success');
            // this.ds.notify('All AO Drawing File Uploaded successfully !!', "success");

          }
          else {
            $.notify('File not Uploaded !!', "error");
            this.loading = false;
          }
          Error => {
            reject('Failed!')
            // this.loading = false;
          };
        });
    })



  }


  validation() {
    var isvalid = false;
    var formvalid = this.ProtoReqForm.invalid;
    var categoryOtherText = this.categoryChecked == true && this.ProtoReqForm.value.categoryothers == "";
    var typesOtherText = this.targetChecked == true && this.ProtoReqForm.value.retrofitmentothers == "";
    var AOYesDrawingValidate = this.ProtoReqForm.value.aodrawing == '1' && this.ProtoReqForm.value.aodrawingtext == "";
    var AONoDrawingValidate = this.ProtoReqForm.value.aodrawing == '0' && this.fileUploadArr.length == 0;
    var FitmentReportNoValidate = this.ReportValue == '0' && this.ProtoReqForm.value.fitmentremarks == "";
    var FinasUpdateNoValidate = this.FinasValue == '0' && this.ProtoReqForm.value.finasupdateremarks == "";

    if ((formvalid) || (categoryOtherText) || (typesOtherText) ||
      ((AOYesDrawingValidate) || (AONoDrawingValidate)) || (FitmentReportNoValidate) || (FinasUpdateNoValidate)) {
      isvalid = true;
    }
    return isvalid;
  }

  submitForm(){
    $('#confirmSubmit').modal('show');
}

confirmSubmit() {
    console.log(this.ProtoReqForm);
    let data = this.ProtoReqForm.value;
    if (data.id == null) {
      delete data.id;
    }
    if (this.validation() || this.isVechError == false) {
      $.notify('Invalid Form! Please fill all mandatory fields', "error");
      $('#confirmSubmit').modal('hide');
      console.log(this.ds.findInvalidControls(this.ProtoReqForm));
      
    }
    else {
      this.loading = true;

      this.saveProto().subscribe(data => {
        if (data.status == 'Success') {
          if (this.fileName != null && this.fileName != "") {
            this.MultipleFileUpload(data.id);
            this.ds.notify('All AO Drawing File Uploaded successfully !!', "success");
            $('#confirmSubmit').modal('hide');
          }
          this.protolistgetform();
          this.ds.notify('Proto Form Submitted successfully !!', "success");
          $('#confirmSubmit').modal('hide');
          var protoArr = []
          for (var i = 0; i < this.rowForms.value.length; i++) {
            if (this.rowForms.value[i].scraporstored == 'Stored') {
              protoArr.push({
                scraporstored: '' + this.rowForms['value'][i]['scraporstored'],
              })
            }
          }
          var id = data.id;
          if (protoArr.length > 0) {
            this.router.navigate(['dashboard/umcsnew'], { queryParams: { id: id } });
          }
          else {

            this.router.navigateByUrl('dashboard/protolist')
            this.ProtoReqForm.reset();
          }

        }
        else if (data['status'] == 'Failure') {
          this.loading = false;
          $.notify('Server error, Please try again!', "error");
          $('#confirmSubmit').modal('hide');
        }

        else {
          $.notify('Form Submition Failed!', "error");
          $('#confirmSubmit').modal('hide');
          this.loading = false;
        }
        Error => {
          this.loading = false;
        }
      });
    }

    // else {
    //   this.loading = false;
    //   $.notify('Invalid Form! Please enter the correct data!', "error");
    //   console.log(this.findInvalidsControls(this.ProtoReqForm));
    // }
  }


  fetchFormDetails(formid) {
    var urlValue = this.appconstant + 'proto/get';
    var submitData = "formid=" + formid;
    this.ds.makeapi(urlValue,submitData, 'post')
      .subscribe(data => {
        var getForm = data;
        this.ProtoReqForm.patchValue(getForm);
        console.log(getForm);
        var protoParts = data['umcsParts'];
        for (var i = 0; i < protoParts.length; i++) {
          var partVehiObj = protoParts[i];
          this.protogetRow(partVehiObj);
        }
        var protovehiParts = data['prvehiclemaster'];
        for (var i = 0; i < protovehiParts.length; i++) {
          var partVehiObj = protovehiParts[i];
          this.protovehicleRow(partVehiObj);
        }

      }, Error => {

      });
  }
  get protogetForms() {
    return this.ProtoReqForm.get('umcsParts') as FormArray;
  }

  protogetRow(data) {
    this.addrow++
    var partRow;
    partRow = this.fb.group({
      finasid: [data['finasid']],
      ascorderview: [this.addrow],
      partnumber: [data['partnumber']],
      description: [data['description']],
      quantity: [data['quantity']],
      zgs: [data['zgs']],
      scraporstored: [data['scraporstored']],
    });


    this.protogetForms.push(partRow);

  }
  get protovehicleForms() {
    return this.ProtoReqForm.get('prvehiclemaster') as FormArray;
  }

  protovehicleRow(data) {
    this.addrow1++
    var getRow;
    getRow = this.fb.group({
      ascorderview: [this.addrow1],
      quantity: [data['quantity']],
      ownername: [data['ownername']],
      ownershortid: [data['ownershortid']],
      vehicleaggregateno: [data['vehicleaggregateno']],
      modelnumber: [data['modelnumber']],
      startdate: [data['startdate']],
    });


    this.protovehicleForms.push(getRow);

  }

  formValidateControl = {
    "contactno": "Contact Number is Invalid", "l4": "Approver L4 is Invalid", "supervisor": "Function is Invalid",
    "projectname": "Project Name is Invalid", "systemname": "System Name is Invalid", "activity": "Activity is Invalid", "storagePurpose": "Purpose is Invalid", "aodrawing": "Ao Drawing is Invalid"
  }


  // call the protolist at anytime for umcsstatus in save

  protolistgetform() {
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    var userShortId = jsonData['shortid'];
    let reqdata = { "usertype": this.status, "shortid": userShortId, "page": 1, "filterList": [] }
    this.ds.makeapi(this.protolistapi, reqdata, "postjson")
      .subscribe(data => {

      },
        Error => {
        });
  }

  addproto() {
    this.router.navigate(['dashboard/protonew'], {});
  }
  protolists(){
    this.router.navigateByUrl('/dashboard/protolist');
  }
  SelectDate(value){
    var setFirstdate = moment(value).format('DD-MM-YYYY');
    console.log(setFirstdate)
  }
}
