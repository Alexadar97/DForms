import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/filter';
import { DataserviceService } from '../dataservice.service';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Location } from '@angular/common';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/finally';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
declare var $, moment;
@Component({
  selector: 'app-protobcaview',
  templateUrl: './protobcaview.component.html',
  styleUrls: ['./protobcaview.component.css']
})
export class ProtobcaviewComponent implements OnInit {
  p1 = 1;
  p2 = 1;
  p3 = 1;
  BCAArrayForm: FormGroup;
  ProtoReqForm: FormGroup;
  BCAProtoForm: FormGroup;
  appconstant = this.ds.appconstant;
  today = new Date();
  loading = false;
  formId = null
  shortid;
  userType;
  protoPartsArr = [];
  protoVehiPartsArr = [];
  partVehiObj;
  arrrequest = [];
  arrlist = [];
  protoworkrequest: any;
  arrfunction;
  arrvalue = [];
  arrproto = [];
  arrlists = []
  prototype: any;
  arrcategory = [];
  arrcategorylist = [];
  category;
  finasupdate;
  fitmentReport;
  formID;
  vehiclemaster;
  fitmentremarks;
  finasupdateremarks;
  isProtoHDTSupervisor = false;
  isProtoMDTSupervisor = false;
  isProtoAggregateSupervisor = false;
  isProtoMaintenanceSupervisor = false;
  isProtoEandESupervisor = false;
  isProtoPPSSupervisor = false;
  isProtoMechanicalSupervisor = false;
  isPrototypeL4 = false;
  isProtol4 = false;
  isProtoVehicleOwner = false;
  isfitment: any;
  fitmentreport;
  aodrawing;
  aodrawingtext;
  formarray = []
  filepath;
  username:any;
  usertype;
  otherCategory:any;
  retrofitmentothers:any;
  input;
  isProtoReq = false;
  private readonly notifier: NotifierService;
  numbervalidation = /^[0][1-9]\d{9}$|^[1-9]\d{9}$/;
  private addBCAApi = this.appconstant + 'proto/bca/add';
  private getBCAApi = this.appconstant + 'proto/bca/get';
  private fileDownloadAPI = this.appconstant + 'proto/downloadAOFile';
  private listDownloadAPI = this.appconstant + 'proto/listAOfilename';
  constructor(notifierService: NotifierService, private _location: Location, private route: ActivatedRoute, private ds: DataserviceService, private fb: FormBuilder, private http: Http, private router: Router) {
    this.fb = fb;
    this.notifier = notifierService;
    var userDetails = localStorage.getItem("Daim-forms");
    var userJson = JSON.parse(userDetails);
    var todayDate = moment(new Date()).format('DD-MM-YYYY')

    this.ProtoReqForm = fb.group({
      createddate: [],
      requestorname: ['', Validators.compose([Validators.required])],
      contactno: [''],
      department: [],
      category: [],
      supervisor: [],
      subsupervisor: [],
      workrequest: [],
      projectname: [],
      systemname: [],
      activity: [],
      aodrawing: [],
      noofvehicleorobj: [],
      retrofitmenttype: [],
      aodrawingtext: [],
      fitmentremarks: [],
      filepath: [],
      finasupdate: [],
      fitmentreport: [],
      finasupdateremarks: [],
      prformid:[],
      l4: [],
      l4remarks: [],
      status: [],

      hdtbcashortid:[],
      hdtbcapassword:[],
      mdtbcapassword:[],
      mdtbcashortid:[],
      aggregatebcashortid:[],
      aggregatebcapassword:[],
      ppsbcapassword:[],
      ppsbcashortid:[],
      eandebcapassword:[],
      eandebcashortid:[],
      maintenancebcapassword:[],
      maintenancebcashortid:[],
      mechanicalbcapassword:[],
      mechanicalbcashortid:[],

      prpartsmaster: this.fb.array([]),
      prvehiclemaster: this.fb.array([]),


    });
    var req = Validators.compose([Validators.required]);
    var num = Validators.compose([Validators.required, Validators.pattern(this.numbervalidation)]);

    this.BCAArrayForm = this.fb.group({
      mdtsupervisor: this.fb.array([])
    });
    var userDetails = localStorage.getItem("Daim-forms");
    var userJson = JSON.parse(userDetails);
    this.username = userJson['firstname'] + " "+userJson['lastname'];
  }

  usertypes;
  status;
  stored
  type;
  umcsstatus;
  dynamicFunctionValue = [];
  subFunctionValue = [];
  functionArray = [];
  supervisorValue;
  subSupervisorValue = [];
  tab;
  supervisor:any;
  loginType:any
  ngOnInit() {
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    this.shortid = jsonData['shortid'];
    this.loginType = jsonData['usertype'];
    var value = this.route.queryParams
      .subscribe(params => {

      });
    var editdata = localStorage.getItem('protoformsdata');
    console.log(editdata)
    this.userType = localStorage.getItem('proto_usertype');
    var editObj = JSON.parse(editdata);
    if (jsonData['usertype']) {
      this.usertype = jsonData['usertype'].toLowerCase();
      this.usertypes = this.usertype
    }
    if (this.usertype === "hdtsupervisor") {
      this.status = 'hdtsupervisor'
      this.isProtoHDTSupervisor = true;
    }
    else if (this.usertype === "mdtsupervisor") {
      this.status = 'mdtsupervisor'
      this.isProtoMDTSupervisor = true;
    }
    else if (this.usertype === "aggregatesupervisor") {
      this.status = 'aggregatesupervisor'
      this.isProtoAggregateSupervisor = true;
    }
    else if (this.usertype === "eandesupervisor") {
      this.status = 'eandesupervisor'
      this.isProtoEandESupervisor = true;
    }
    else if (this.usertype === "ppssupervisor") {
      this.status = 'ppssupervisor'
      this.isProtoPPSSupervisor = true;
    }
    else if (this.usertype === "maintenancesupervisor") {
      this.status = 'maintenancesupervisor'
      this.isProtoMaintenanceSupervisor = true;
    }
    else if (this.usertype === "mechanicalsupervisor") {
      this.status = 'mechanicalsupervisor'
      this.isProtoMechanicalSupervisor = true;
    }
    else if (this.usertype === "protovehicleowner") {
      this.status = 'protovehicleowner'
      this.isProtoVehicleOwner = true;
    }
    else {
      this.status = '';
    }


    this.ProtoReqForm.patchValue(editObj);
    this.fitmentreport = editObj['fitmentreport']
    this.aodrawing = editObj['aodrawing']
    this.aodrawingtext = editObj['aodrawingtext']
    this.finasupdate = editObj['finasupdate']
    this.fitmentremarks = editObj['fitmentremarks']
    this.finasupdateremarks = editObj['finasupdateremarks']
    this.formID = editObj['id']
    this.userType = editObj['usertype']
    this.vehiclemaster = editObj['prvehiclemaster']
    this.umcsstatus = editObj['umcsstatus']
    this.isfitment = editObj['isfitment'];
    this.supervisor = editObj['supervisor'];
    this.otherCategory = editObj['categoryothers'];
    this.retrofitmentothers = editObj['retrofitmentothers'];
    /* show the function values*/
    if (editObj.supervisor == 'mdtsupervisor') {
      editObj.supervisor = 'Vehicle MDT';
    }
    else if (editObj.supervisor == 'hdtsupervisor') {
      editObj.supervisor = 'Vehicle HDT';
    }
    else if (editObj.supervisor == 'aggregateengine') {
      editObj.supervisor = 'Engine';
    }
    else if (editObj.supervisor == 'ppssupervisor') {
      editObj.supervisor = 'PPS';
    }
    else if (editObj.supervisor == 'aggregatetransmission') {
      editObj.supervisor = 'Transmission';
    }
    else if (editObj.supervisor == 'aggregateaxle') {
      editObj.supervisor = 'Axle';
    }
    // split the category values

    this.arrcategory = [];
    this.arrcategorylist = []
    var category = editObj.category;
    this.category = category;
    this.arrcategory.push(this.category);
    for (var i = 0; i < this.arrcategory.length; i++) {
      for (var j = 0; j < this.arrcategory[i].split(",").length; j++) {
        this.arrcategorylist.push(this.arrcategory[i].split(",")[j]);
      }

    }

    // split the subfunctions values

    this.arrvalue = [];
    this.arrlist = []
    this.arrfunction = editObj.subsupervisor;
    this.arrvalue.push(this.arrfunction);
    for (var i = 0; i < this.arrvalue.length; i++) {
      for (var j = 0; j < this.arrvalue[i].split(",").length; j++) {
        this.arrlist.push(this.arrvalue[i].split(",")[j]);
      }
    }

    // this.subFunctionValue = this.arrlist;
    // console.log(this.subFunctionValue)
    // this.supervisorValue = editObj.supervisor;
    // for (var i = 0; i < this.subFunctionValue.length; i++) {
    //   this.subSupervisorValue.push(this.subFunctionValue[i]);
    //   console.log(this.subSupervisorValue);
    // }
    // console.log(this.supervisorValue)

    // this.dynamicFunctionValue = this.subSupervisorValue;
    // this.dynamicFunctionValue.concat(this.supervisorValue);
    // this.dynamicFunctionValue.push(this.supervisorValue)


    // console.log(this.dynamicFunctionValue);

    // split the Types of Activity values

    this.arrproto = [];
    this.arrlists = []
    var typeactivity = editObj.retrofitmenttype;
    this.prototype = typeactivity;
    this.arrproto.push(this.prototype);

    for (var i = 0; i < this.arrproto.length; i++) {
      for (var j = 0; j < this.arrproto[i].split(",").length; j++) {
        this.arrlists.push(this.arrproto[i].split(",")[j]);
      }
    }
    var protoParts = editObj['umcsParts'];
    this.protoPartsArr = protoParts;

    for (var i = 0; i < protoParts.length; i++) {
      var partVehiObj = protoParts[i];
      this.stored = protoParts[i]['scraporstored'];
      this.addRow(partVehiObj);
    }
    var protovehiParts = editObj['prvehiclemaster'];
    this.protoVehiPartsArr = protovehiParts;

    for (var i = 0; i < protovehiParts.length; i++) {
      var partVehiObj = protovehiParts[i];
      this.addvehicle(partVehiObj);
    }

    this.getbca()
    if (this.aodrawing == 0) {
      this.downloadlist();
    }
    this.tab = "hdtsupervisor"
  }


  goBack() {
    this._location.back();
  }

  get rowForms() {
    return this.ProtoReqForm.get('prpartsmaster') as FormArray;
  }

  addRow(data) {
    const row = this.fb.group({
      finasid: [data['finasid']],
      partnumber: [data['partnumber']],
      description: [data['description']],
      quantity: [data['quantity']],
      zgs: [data['zgs']],
      scraporstored: [data['scraporstored']],
      protoid: [data['protoid']],
      protoformid: [data['protoformid']]
    });

    this.rowForms.push(row);
  }
  get novehicle() {
    return this.ProtoReqForm.get('prvehiclemaster') as FormArray;
  }
  addvehicle(data) {
    const vehi = this.fb.group({
      id: [data['id']],
      quantity: [data['quantity']],
      ownername: [data['ownername']],
      vehicleaggregateno: [data['vehicleaggregateno']],
      modelnumber: [data['modelnumber']],
      startdate: [data['startdate']],
    });

    this.novehicle.push(vehi);

    this.addbca()

  };

  get vehicleBCA() {
    return this.BCAArrayForm.get('mdtsupervisor') as FormArray;
  }

  addbca() {
    var todayDate = moment(new Date()).format('DD-MM-YYYY');
    var num = Validators.compose([Validators.required, Validators.pattern(this.numbervalidation)]);
    const bcaform = this.fb.group({
      prmasterid: [this.formID],
      id: [null],
      finasid: [''],
      objfinasid: [''],
      observation: [''],
      workstarteddate: ['' + todayDate],
      workendsdate: ['' + todayDate],
      actualkm: [''],
      workdoneby: [''],
      supervisorname: [''],
      supervisordate: ['' + todayDate],
      supervisorreceiveddate: ['' + todayDate],
      supervisorcompleteddate: ['' + todayDate],
      finasreqname: [''],
      finasreqdate: ['' + todayDate],
      finasreqcontactno: ['', num],
      finasreqreturndate: ['' + todayDate],
      finasreqreceiveddate: ['' + todayDate],
      finasreqremarks: [''],
      usertype: [],
      islogin: [0],
      isDraft: [],
    });

    //define the formgroup
    this.vehicleBCA.push(bcaform);

  }

  getsingledata;
  bcaStatus: any
  emptybca = false
  getbcasingledata() {
    var submitData = "prmasterid=" + this.formID + "&usertype=" + this.status;
    var urlValue = this.appconstant + 'proto/bca/getSingleSupervisorData';
    this.ds.makeapi(urlValue, submitData, 'post')
      .subscribe(data2 => {
        this.bcaStatus = data2;
        this.getsingledata = data2;
        console.log(this.getsingledata);
        console.log(this.vehicleBCA.value);
        this.vehicleBCA.patchValue(this.getsingledata);

      }, Error => {

      });

  }

  bcasaveform() {
    let reqdata = '';
    let url = this.addBCAApi;
    // let data = this.BCAProtoForm.value;
    let data = this.vehicleBCA.value;
    console.log(data[this.bcaposition])

    // set the formid in prmasterid

    data[this.bcaposition].prmasterid = this.formID;
    // set the formtype in usertype

    data[this.bcaposition].usertype = this.status;

    // set the draft value;
    data[this.bcaposition].isDraft = this.draftevent;

    // covert date in correct date format
    data[this.bcaposition].workstarteddate = $('#startdate' + [this.bcaposition]).val();
    data[this.bcaposition].workendsdate = $('#enddate' + [this.bcaposition]).val();
    data[this.bcaposition].supervisordate = $('#date' + [this.bcaposition]).val();
    data[this.bcaposition].supervisorreceiveddate = $('#receiveddate' + [this.bcaposition]).val();
    data[this.bcaposition].supervisorcompleteddate = $('#completeddate' + [this.bcaposition]).val();
    data[this.bcaposition].finasreqdate = $('#finasdate' + [this.bcaposition]).val();
    data[this.bcaposition].finasreqreturndate = $('#returnon' + [this.bcaposition]).val();
    data[this.bcaposition].finasreqreceiveddate = $('#receivedon' + [this.bcaposition]).val();
    reqdata = JSON.stringify(data[this.bcaposition]);
    console.log(reqdata)

    return this.postRequest(url, reqdata);
  }

  draftevent;
  bcaposition;
  saveForm(value, i) {
    this.loading = true;
    this.bcaposition = i;
    this.draftevent = value;
    this.bcasaveform().subscribe(data => {
      if (data.status == 'Success') {
        this.loading = false;
        this.BCAArrayForm.reset();
        this.getbcasingledata();
      }
      else {
        this.loading = false;
      }
      Error => {
        this.loading = false;
      }
    });
  }



  bcasubmitform() {
    let reqdata = '';
    let url = this.addBCAApi;
    let data = this.vehicleBCA.value;
    console.log(data[this.bcasubmitposition])

    // set the formid in prmasterid

    data[this.bcasubmitposition].prmasterid = this.formID;
    // set the formtype in usertype

    data[this.bcasubmitposition].usertype = this.status;

    // set the draft value;
    data[this.bcasubmitposition].isDraft = this.submitdraftevent;

    // covert date in correct date format
    data[this.bcasubmitposition].workstarteddate = $('#startdate' + this.bcasubmitposition).val();
    data[this.bcasubmitposition].workendsdate = $('#enddate' + this.bcasubmitposition).val();
    data[this.bcasubmitposition].supervisordate = $('#date' + this.bcasubmitposition).val();
    data[this.bcasubmitposition].supervisorreceiveddate = $('#receiveddate' + this.bcasubmitposition).val();
    data[this.bcasubmitposition].supervisorcompleteddate = $('#completeddate' + this.bcasubmitposition).val();
    data[this.bcasubmitposition].finasreqdate = $('#finasdate' + this.bcasubmitposition).val();
    data[this.bcasubmitposition].finasreqreturndate = $('#returnon' + this.bcasubmitposition).val();
    data[this.bcasubmitposition].finasreqreceiveddate = $('#receivedon' + this.bcasubmitposition).val();
    reqdata = JSON.stringify(data[this.bcasubmitposition]);
    console.log(reqdata)

    return this.postRequest(url, reqdata);
  }
  bcasubmitposition;
  submitdraftevent;
  submitBca(value, i) {
    this.bcasubmitposition = i;
    this.submitdraftevent = value;
    let data = this.vehicleBCA.value;
    if (data[this.bcasubmitposition].id == null) {
      delete data[this.bcasubmitposition].id;
    }
    this.loading = true;
    this.bcasubmitform().subscribe(data => {
      if (data.status == 'Success') {
        var submitData = "id=" + data.id + "&status=submitted" + "&usertype=" + this.status;
        var urlValue = this.appconstant + 'proto/bca/updateBCAStatus';
        this.ds.makeapi(urlValue, submitData, 'post')
          .subscribe(data2 => {
            this.loading = false;
            if (data2.status == 'Success') {
              this.getbcasingledata();
            }
          }, Error => {

          });
      }

    });
  }

  bcafitmentreport() {
    let reqdata = '';
    let url = this.addBCAApi;
    // let data = this.BCAProtoForm.value;
    let data = this.vehicleBCA.value;
    console.log(data[this.fitmentposition])

    // set the formid in prmasterid

    data[this.fitmentposition].prmasterid = this.formID;
    // set the formtype in usertype

    data[this.fitmentposition].usertype = this.status;

    // set the draft value;
    data[this.fitmentposition].isDraft = this.fitmentevent;

    // covert date in correct date format
    data[this.fitmentposition].workstarteddate = $('#startdate' + [this.fitmentposition]).val();
    data[this.fitmentposition].workendsdate = $('#enddate' + [this.fitmentposition]).val();
    data[this.fitmentposition].supervisordate = $('#date' + [this.fitmentposition]).val();
    data[this.fitmentposition].supervisorreceiveddate = $('#receiveddate' + [this.fitmentposition]).val();
    data[this.fitmentposition].supervisorcompleteddate = $('#completeddate' + [this.fitmentposition]).val();
    data[this.fitmentposition].finasreqdate = $('#finasdate' + [this.fitmentposition]).val();
    data[this.fitmentposition].finasreqreturndate = $('#returnon' + [this.fitmentposition]).val();
    data[this.fitmentposition].finasreqreceiveddate = $('#receivedon' + [this.fitmentposition]).val();
    reqdata = JSON.stringify(data[this.fitmentposition]);
    console.log(reqdata)

    return this.postRequest(url, reqdata);
  }

  fitmentevent;
  fitmentposition;
  id: any;
  saveFitmentReport(value, i, id) {
    this.fitmentposition = i;
    console.log(this.fitmentposition)
    this.fitmentevent = value;
    this.loading = true;
    this.bcafitmentreport().subscribe(data => {
      if (data.status == 'Success') {
        this.loading = false;
        this.id = data.id

        localStorage.setItem("Forms-redirect-url", '/dashboard/retrofitmentnew');
        localStorage.setItem('singlebcadataid', this.id);
        this.router.navigate(['dashboard/retrofitmentnew']);
      }
      // else {
      //   this.router.navigate(['dashboard/retrofitmentnew'], {});
      //  }

    }, Error => {

    });
  }
  suoervisorsubmitform() {
    let reqdata = '';
    let url = this.addBCAApi;
    let data = this.vehicleBCA.value;
    console.log(data[this.supervisorposition])

    // set the formid in prmasterid

    data[this.supervisorposition].prmasterid = this.formID;
    // set the formtype in usertype

    data[this.supervisorposition].usertype = this.status;

    // set the draft value;
    data[this.supervisorposition].isDraft = this.supervisordraftevent;

    // covert date in correct date format
    data[this.supervisorposition].workstarteddate = $('#startdate' + this.supervisorposition).val();
    data[this.supervisorposition].workendsdate = $('#enddate' + this.supervisorposition).val();
    data[this.supervisorposition].supervisordate = $('#date' + this.supervisorposition).val();
    data[this.supervisorposition].supervisorcompleteddate = $('#completeddate' + this.supervisorposition).val();
    data[this.supervisorposition].finasreqdate = $('#finasdate' + this.supervisorposition).val();
    data[this.supervisorposition].finasreqreturndate = $('#returnon' + this.supervisorposition).val();
    data[this.supervisorposition].finasreqreceiveddate = $('#receivedon' + this.supervisorposition).val();
    reqdata = JSON.stringify(data[this.supervisorposition]);
    console.log(reqdata)

    return this.postRequest(url, reqdata);
  }

  supervisorposition;
  supervisordraftevent;
  submitSupervisor(value, i) {
    this.supervisorposition = i;
    this.supervisordraftevent = value;
    let data = this.vehicleBCA.value;
    if (data[this.supervisorposition].id == null) {
      delete data[this.supervisorposition].id;
    }
    console.log(this.supervisorposition);
    console.log(this.supervisordraftevent);
    this.loading = true;
    this.suoervisorsubmitform().subscribe(data => {
      if (data.status == 'Success') {
        var submitData = "id=" + data.id + "&status=submittedtosupervisor" + "&usertype=" + this.status;
        var urlValue = this.appconstant + 'proto/bca/updateBCAStatus';
        this.ds.makeapi(urlValue, submitData, 'post')
          .subscribe(data2 => {
            this.loading = false;
            if (data2.status == 'Success') {
              this.getbcasingledata();
            }
          }, Error => {

          });
      }

    });
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
  keyAlpha(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  file_id;
  downlaodfile(filename, id) {
    this.file_id = id;
    this.loading = true;
    this.ds.method(this.fileDownloadAPI + "/" + this.file_id, filename, "downloadfile")
      .subscribe(res => {
        if (window.navigator.msSaveOrOpenBlob) {
          this.loading = false;
          var fileData = [res.data];
          var blobObject = new Blob(fileData);
          window.navigator.msSaveOrOpenBlob(blobObject, filename); ``
          window.navigator.msSaveOrOpenBlob(blobObject, filename);
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

  fileNameArr = [];
  fileDownloadList = [];
  listfileid;

  downloadlist() {
    this.fileDownloadList = [];
    var submitData = "formid=" + this.formID;
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


  markTab(type, $event) {
    this.tab = type;
    // console.log($event)
    // console.log($event.target)
    $(".tab").removeClass('tab_selected');
    $($event.target).addClass('tab_selected');
    // $($event.target).css("background","red");
  }
  bcadata
  tablist = false
  tablist2 = false
  tablist3 = false
  tablist4 = false
  tablist5 = false
  tablist6 = false
  tablist7 = false
  mdtlist
  aggrelist
  eandelist
  hdtlist
  mainlist
  mechlist
  ppslist
  bcahdtid = [];
  bcamdtid: any;
  bcaeandeid: any;
  bcamechid: any;
  bcamainid: any;
  bcappsid: any;
  bcaaggreid: any;
  bcaid;
  
  getbca() {
    var submitData = 'prmasterid=' + this.formID;
    this.ds.makeapi(this.getBCAApi,submitData, 'post')
      .subscribe(data2 => {
        this.bcadata = data2
        this.mdtlist = this.bcadata.mdtsupervisor;
        this.hdtlist = this.bcadata.hdtsupervisor;
        this.aggrelist = this.bcadata.aggregatesupervisor;
        this.eandelist = this.bcadata.eandesupervisor;
        this.mainlist = this.bcadata.maintenancesupervisor;
        this.mechlist = this.bcadata.mechanicalsupervisor;
        this.ppslist = this.bcadata.ppssupervisor;

        if (this.bcadata.hdtsupervisor.length != 0) {
          this.tablist = true;
          for (var i = 0; i < this.hdtlist.length; i++) {
            this.bcahdtid.push(this.hdtlist[i].id);
            this.bcaid = this.bcahdtid;
          }
        }
        else {
          this.tablist = false;
        }
        if (this.bcadata.eandesupervisor.length != 0) {
          this.tablist2 = true;
          for (var i = 0; i < this.eandelist.length; i++) {
            this.bcaeandeid = this.eandelist[i].id;
          }
        }
        else {
          this.tablist2 = false;
        }
        if (this.bcadata.aggregatesupervisor.length != 0) {
          this.tablist3 = true;
          for (var i = 0; i < this.aggrelist.length; i++) {
            this.bcaaggreid = this.aggrelist[i].id;
          }
        }
        else {
          this.tablist3 = false;
        }
        if (this.bcadata.maintenancesupervisor.length != 0) {
          this.tablist4 = true
          for (var i = 0; i < this.mainlist.length; i++) {
            this.bcamainid = this.mainlist[i].id;
          }
        }
        else {
          this.tablist4 = false;
        }
        if (this.bcadata.mechanicalsupervisor.length != 0) {
          this.tablist5 = true;
          for (var i = 0; i < this.mechlist.length; i++) {
            this.bcamechid = this.mechlist[i].id;
          }
        }
        else {
          this.tablist5 = false;
        }
        if (this.bcadata.ppssupervisor.length != 0) {
          this.tablist6 = true;
          for (var i = 0; i < this.ppslist.length; i++) {
            this.bcappsid = this.ppslist[i].id;
          }
        }
        else {
          this.tablist6 = false;
        }
        if (this.bcadata.mdtsupervisor.length != 0) {
          this.tablist7 = true;
          for (var i = 0; i < this.mdtlist.length; i++) {
            this.bcamdtid = this.mdtlist[i].id;
          }
        }
        else {
          this.tablist7 = false;
        }
      }, Error => {

      });

  }



  // View the retrofitmentform
  retroHDTID: any;
  viewRetroHDT(id,index) {
    this.retroHDTID = id;
    $('#retroview').modal('show');
    this.fetchRetroHDTForm();
  }
  retroMDTID: any;
  viewRetroMDT(id) {
    this.retroMDTID = id;
    $('#retroview').modal('show');
    this.fetchRetroMDTForm();
  }
  retroEandEID: any;
  viewRetroEandE(id) {
    this.retroEandEID = id;
    $('#retroview').modal('show');
    this.fetchRetroEandEForm();
  }
  retroPPSID: any;
  viewRetroPPS(id) {
    this.retroPPSID = id;
    $('#retroview').modal('show');
    this.fetchRetroPPSForm();
  }
  retroMechID: any;
  viewRetroMech(id) {
    this.retroMechID = id;
    $('#retroview').modal('show');
    this.fetchRetroMechForm();
  }
  retroAggreID: any;
  viewRetroAggre(id) {
    this.retroAggreID = id;
    $('#retroview').modal('show');
    this.fetchRetroAggreForm();
  }
  retroMainID: any;
  viewRetroMain(id) {
    this.retroMainID = id;
    $('#retroview').modal('show');
    this.fetchRetroMainForm();
  }


  retroViewData: any;
  retroViewData1: any;
  previewImage:any;
  modaltype:any;
  imageList ;
  showImage;
  fetchRetroHDTForm() {
    var urlValue = this.appconstant + 'fitment/get' ;
    var submitData = 'bcamasterid=' + this.retroHDTID;
    this.ds.makeapi(urlValue,submitData, 'post')
      .subscribe(data => {
        // this.modaltype = 'viewmodal';
        this.retroViewData = data;
        this.imageList = this.retroViewData.imageList;
          $('#imgid3').attr('src', 'data:image/png;base64,' + this.imageList[0].image);
          $('#imgid4').attr('src', 'data:image/png;base64,' + this.imageList[1].image);
            $('#imgid5').attr('src', 'data:image/png;base64,' + this.imageList[2].image);
      
      })
  }

  fetchRetroMDTForm() {
    var urlValue = this.appconstant + 'fitment/get';
    var submitData = 'bcamasterid=' + this.retroMDTID;
    this.ds.makeapi(urlValue,submitData, 'post')
      .subscribe(data => {
        this.retroViewData = data;
        this.imageList = this.retroViewData.imageList;
        $('#imgid3').attr('src', 'data:image/png;base64,' + this.imageList[0].image);
        $('#imgid4').attr('src', 'data:image/png;base64,' + this.imageList[1].image);
          $('#imgid5').attr('src', 'data:image/png;base64,' + this.imageList[2].image);
      })
  }
  fetchRetroAggreForm() {
    var urlValue = this.appconstant + 'fitment/get';
    var submitData = 'bcamasterid=' + this.retroAggreID;
    this.ds.makeapi(urlValue, submitData,'post')
      .subscribe(data => {
        this.retroViewData = data;
        this.imageList = this.retroViewData.imageList;
        $('#imgid3').attr('src', 'data:image/png;base64,' + this.imageList[0].image);
        $('#imgid4').attr('src', 'data:image/png;base64,' + this.imageList[1].image);
          $('#imgid5').attr('src', 'data:image/png;base64,' + this.imageList[2].image);
      })
  }
  fetchRetroEandEForm() {
    var urlValue = this.appconstant + 'fitment/get/';
    var submitData = 'bcamasterid=' + this.retroEandEID;
    this.ds.makeapi(urlValue, submitData,'post')
      .subscribe(data => {
        this.retroViewData = data;
        this.imageList = this.retroViewData.imageList;
        $('#imgid3').attr('src', 'data:image/png;base64,' + this.imageList[0].image);
        $('#imgid4').attr('src', 'data:image/png;base64,' + this.imageList[1].image);
          $('#imgid5').attr('src', 'data:image/png;base64,' + this.imageList[2].image);
      })
  }
  fetchRetroPPSForm() {
    var urlValue = this.appconstant + 'fitment/get';
    var submitData = 'bcamasterid=' + this.retroPPSID;
    this.ds.makeapi(urlValue,submitData ,'post')
      .subscribe(data => {
        this.retroViewData = data;
        this.imageList = this.retroViewData.imageList;
        $('#imgid3').attr('src', 'data:image/png;base64,' + this.imageList[0].image);
        $('#imgid4').attr('src', 'data:image/png;base64,' + this.imageList[1].image);
          $('#imgid5').attr('src', 'data:image/png;base64,' + this.imageList[2].image);
      })
  }
  fetchRetroMechForm() {
    var urlValue = this.appconstant + 'fitment/get';
    var submitData = 'bcamasterid=' + this.retroMechID;
    this.ds.makeapi(urlValue,submitData, 'post')
      .subscribe(data => {
        this.retroViewData = data;
        this.imageList = this.retroViewData.imageList;
        $('#imgid3').attr('src', 'data:image/png;base64,' + this.imageList[0].image);
        $('#imgid4').attr('src', 'data:image/png;base64,' + this.imageList[1].image);
          $('#imgid5').attr('src', 'data:image/png;base64,' + this.imageList[2].image);
      })
  }
  fetchRetroMainForm() {
    var urlValue = this.appconstant + 'fitment/get';
    var submitData = 'bcamasterid=' + this.retroMainID;
    this.ds.makeapi(urlValue,submitData, 'post')
      .subscribe(data => {
        this.retroViewData = data;
        this.imageList = this.retroViewData.imageList;
        $('#imgid3').attr('src', 'data:image/png;base64,' + this.imageList[0].image);
        $('#imgid4').attr('src', 'data:image/png;base64,' + this.imageList[1].image);
          $('#imgid5').attr('src', 'data:image/png;base64,' + this.imageList[2].image);
      })
  }
  priviewimage(imageNumber) {
    $("#viewmodal").modal("hide");
    $("#assignisprmodal").modal("hide");
    $("#preview").modal("show");

    if (imageNumber == 1) {
      setTimeout(() => {
        $('#previewid1').attr('src', 'data:image/png;base64,' + this.previewImage);
      }, 50)
    }
    else if (imageNumber == 2) {
      setTimeout(() => {
        $('#previewid1').attr('src', 'data:image/png;base64,' + this.previewImage);
      }, 50)
    }
    else if (imageNumber == 3) {
      setTimeout(() => {
        $('#previewid1').attr('src', 'data:image/png;base64,' + this.previewImage);
      }, 50)
    }
    else if (imageNumber == 4) {
      setTimeout(() => {
        $('#previewid1').attr('src', 'data:image/png;base64,' + this.previewImage);
      }, 50)
    }

  }
  calcelpreviewimage() {
    if (this.modaltype == 'assignisprmodal') {
      $('#assignisprmodal').modal('show')
    }
    else {
      $('#viewmodal').modal('show')
    }

    $("#preview").modal("hide");
  }
  logout(){
    localStorage.removeItem("Pagination")
    this.router.navigateByUrl('/login');
        localStorage.setItem('Daim-forms',null);
  }
  home(){
    localStorage.removeItem("Pagination")
    this.router.navigateByUrl('/home');
  }
}