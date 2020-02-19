import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NotifierService } from 'angular-notifier';
import { DataserviceService } from '../../dataservice.service';
import { ActivatedRoute } from '@angular/router';
declare var $, moment;
@Component({
  selector: 'app-protorecalledit',
  templateUrl: './protorecalledit.component.html',
  styleUrls: ['./protorecalledit.component.css']
})
export class ProtorecalleditComponent implements OnInit {

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
  isOFMVisible = false;
  private readonly notifier: NotifierService;
  numbervalidation = /^[0][1-9]\d{9}$|^[1-9]\d{9}$/;
  ProtoReqForm: FormGroup;
  private appconstant = this.ds.appconstant;
  private saveproto = this.appconstant + 'proto/save';
  private protolistusers = this.ds.appconstant + 'user/list';
  private searchvehicleownerapi = this.appconstant + 'proto/searchVehicleOwner';
  private aodrawinguploadapi = this.appconstant + 'proto/uploadAOFile';
  private shortIdSearch = this.appconstant + 'user/search';
  private protolistapi = this.appconstant + 'proto/list';
  private listDownloadAPI = this.appconstant + 'proto/listAOfilename';
  private fileDownloadAPI = this.appconstant + 'proto/downloadAOFile';
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
      id: [this.formId ],
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
      ascorderview: [this.addrow],
      finasid: [null],
      partnumber: ['', req],
      description: ['', req],
      quantity: ['', nonZero],
      zgs: ['', req],
      scraporstored: ['', req]
    });


    this.rowForms.push(row);
  }
  deleteRow(i) {
    this.rowForms.removeAt(i);
  }

  goBack() {
    this.router.navigate(['dashboard/protolist'], {});
  }

  subfunctionMap = {};
  subfunctionListMap = {}
  subfunctionPPSMap = {}

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
    for (var subF of this.subfunction) {
      this.subfunctionMap[subF["item_text"]] = subF["item_id"]
    }
    this.subfunctionlist = [
      { item_id: 1, item_text: 'Vehicle HDT' },
      { item_id: 2, item_text: 'Vehicle MDT' },
      { item_id: 3, item_text: 'E&E' },
      { item_id: 4, item_text: 'PPS' },
      { item_id: 5, item_text: 'Maintenance' },
      { item_id: 6, item_text: 'Proto Mechanical Workshop' }
    ];
    for (var subF of this.subfunctionlist) {
      this.subfunctionListMap[subF["item_text"]] = subF["item_id"]
    }
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
    for (var subF of this.subfunctionppslist) {
      this.subfunctionPPSMap[subF["item_text"]] = subF["item_id"]
    }
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
      ownername: [],
      ownershortid: [, req],
      vehicleaggregateno: [''],
      vehicleownername: [''],
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
    // this.novehicle.removeAt(i);
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
    data.retrofitmenttype = selected;

    /* Set with work request values*/
    var chkboxesArray = [];
    $(".chkboxes:checked").each(function () {
      chkboxesArray.push($(this).val());
    });
    var selected;
    selected = chkboxesArray.join(',');
    console.log(selected);
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
    data.subsupervisor = arrselect.join(',');

    /* no of vehicle and object show the values */

    data.noofvehicleorobj = this.vehicleCount;;

    /*  separated with integer*/
    data.aodrawing = +this.ProtoReqForm.value.aodrawing;
    data.fitmentreport = +this.ProtoReqForm.value.fitmentreport;
    data.finasupdate = +this.ProtoReqForm.value.finasupdate;

    data.usertype = this.status;
    

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

  searchlist = [];
  search(value) {
    let reqdata = "searchstr=" + value;
    let url = this.searchvehicleownerapi;
    this.ds.makeapi(url, reqdata, "post").subscribe(data => {
      this.searchlist = data;
    })
  }


  searchOwner(i) {

    var vehicleOwner = this.novehicle.controls[i]['value']['ownershortid']
    this.ds.makeapi(this.shortIdSearch, 'shortid=' + vehicleOwner, "post")
      .subscribe(data => {
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

  protosupervisor() {
    this.router.navigate(['/protobca'], {});
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
    var elem = document.getElementById('upload'+index);
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

  submitForm() {
    console.log(this.ProtoReqForm);
    let data = this.ProtoReqForm.value;
    if (data.id == null) {
      delete data.id;
    }
    if (this.ProtoReqForm.valid) {
      this.loading = true;

      this.saveProto().subscribe(data => {
        if (data.status == 'Success') {
          if (this.fileName != null && this.fileName != "") {
            this.MultipleFileUpload(data.id);
            this.ds.notify('All AO Drawing File Uploaded successfully !!', "success");
          }
          this.protolistgetform();
          this.ds.notify('Proto Form Submitted successfully !!', "success");
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
        else {
          $.notify('Form Submition Failed!', "error");
          this.loading = false;
        }
        Error => {
          this.loading = false;
        }
      });
    }
    else {
      this.loading = false;
      $.notify('Invalid Form! Please enter the correct data!', "error");
      console.log(this.findInvalidsControls(this.ProtoReqForm));
    }
  }

  arrlist = []
  supervisor = ""

  fetchFormDetails(formid) {
    var urlValue = this.appconstant + 'proto/get';
    var submitData = "formid=" + formid;
    this.ds.makeapi(urlValue,submitData, 'post')
      .subscribe(data => {
        var getForm = data;
        // this.ProtoReqForm.patchValue(getForm);
        // to show the aodrawing value
        this.formId = getForm['id']

        //adding logic to call subfunction.
        this.partFunction(getForm.supervisor);
        console.log(getForm.value);
        this.supervisor = getForm.supervisor
        var subsupervisor = getForm.subsupervisor;
        var arrvalue2 = subsupervisor.split(',')
        for (var i = 0; i < arrvalue2.length; i++) {
          // for (var j = 0; j < arrvalue2[i].split(",").length; j++) {
          this.arrlist.push(arrvalue2[i]);
          // }
        }
        this.populateArrList();
        getForm.subsupervisor = this.selectedItems;
        this.ProtoReqForm.patchValue(getForm);

        if (getForm.aodrawing == 1) {
          $('#aodrawyes').prop('checked', true);
          this.aoyes = true;
          this.aono = false;
          this.fileDownloadList = [];
        }
        else if (getForm.aodrawing == 0) {
          $('#aodrawno').prop('checked', true);
          this.aono = true;
          this.aoyes = false;
        }
        if (getForm.aodrawing == 0) {
          this.downloadlist();
        }
        // to show the finasupdate value

        if (getForm.finasupdate == 1) {
          $('#finasupdateyes').prop('checked', true);
        }
        else if (getForm.finasupdate == 0) {
          $('#finasupdateno').prop('checked', true);
          this.updateno = true;
        }

        // to show the finasupdate value

        if (getForm.fitmentreport == 1) {
          $('#fitmentreportyes').prop('checked', true);
        }
        else if (getForm.fitmentreport == 0) {
          $('#fitmentreportno').prop('checked', true);
          this.reportno = true;
        }
        // set the Category value

        var protoCategory = getForm.category;
        var categoryArr = protoCategory.split(',')
        for (var i = 0; i < categoryArr.length; i++) {
          var categoryVal = categoryArr[i];
          $('#protocat' + categoryVal).prop('checked', true);
          if (categoryVal == 4) {
            this.categoryOthershow = true;
          }
        }
        // set the Types of Activity

        var typeActivity = getForm.retrofitmenttype;
        var typeActivityArr = typeActivity.split(',')
        for (var i = 0; i < typeActivityArr.length; i++) {
          var activityVal = typeActivityArr[i]
          $('#act' + activityVal).prop('checked', true);
          if (activityVal == 5) {
            this.typeOthershow = true;
          }
        }
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



        // this.ProtoReqForm.patchValue(getForm);

      }, Error => {

      });
  }
  get protogetForms() {
    return this.ProtoReqForm.get('umcsParts') as FormArray;
  }

  populateArrList() {

    for (var obj of this.arrlist) {
      var selectedValue = ""
      var seledIndex = 0;
      switch (obj) {

        case "hdtsupervisor":
          selectedValue = "Vehicle HDT";
          break;
        case "aggregateengine":
          selectedValue = "Aggregate Engine";
          break;
        case "aggregatetransmission":
          selectedValue = "Aggregate Transmission";
          break;
        case "aggregateaxle":
          selectedValue = "Aggregate Axle";
          break;
        case "eandesupervisor":
          selectedValue = "E&E";
          break;
        case "mdtsupervisor":
          selectedValue = "Vehicle MDT";
          break;
        case "ppssupervisor":
          selectedValue = "PPS";
          break;
        case "maintenancesupervisor":
          selectedValue = "Maintenance";
          break;
        case "mechanicalsupervisor":
          selectedValue = "Proto Mechanical Workshop";
          break;
      }

      if ((this.supervisor == 'hdtsupervisor' || this.supervisor == 'mdtsupervisor')) {
        seledIndex = this.subfunctionMap[selectedValue]


      } else if ((this.supervisor == 'aggregateengine' || this.supervisor == 'aggregatetransmission' || this.supervisor == 'aggregateaxle')) {
        seledIndex = this.subfunctionListMap[selectedValue]

      } else if (this.supervisor == 'ppssupervisor') {
        seledIndex = this.subfunctionPPSMap[selectedValue]

      }

      this.selectedItems.push({ item_id: seledIndex, item_text: selectedValue })
      //item_id: 1, item_text: 'Aggregate Engine'
    }

    console.log(this.selectedItems);
  }

  protogetRow(data) {
    this.addrow++
    var partRow;
    partRow = this.fb.group({
      id:[data['id']],
      ascorderview: [this.addrow],
      finasid: [data['finasid']],
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
      id:[data['id']],
      ascorderview: [this.addrow1],
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


  fileNameArr = [];
  fileDownloadList = [];
  listfileid;
  downloadlist() {
    this.fileDownloadList = [];
    var submitData = "formid=" + this.formId;
    this.ds.makeapi(this.listDownloadAPI, submitData, 'post')
      .subscribe(data2 => {
        for (var i = 0; i < data2.length; i++) {
          this.fileDownloadList.push(data2[i]);
          this.listfileid = data2[i].id;
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

  addproto() {
    this.router.navigate(['dashboard/protonew'], {});
  }
  protolists(){
    this.router.navigateByUrl('/dashboard/protolist');
  }
}
