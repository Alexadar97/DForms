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
declare var $, moment,_;
@Component({
  selector: 'app-protoedit',
  templateUrl: './protoedit.component.html',
  styleUrls: ['./protoedit.component.css']
})
export class ProtoeditComponent implements OnInit {
  ProtoReqForm = null;
  approvalForm = null;
  appconstant = this.ds.appconstant;
  formId = null;
  formStatus = null;
  formType = null;
  isApproved = false;
  isExpired = false;
  shortid;
  loading = false;
  // isSupervisorApproved = false;
  isVehicleOwnerApproved = false;
  userType;
  owner;
  isProtoVehicleOwner = false;
  isProtoSupervisor = false;
  protoPartsArr = [];
  protoVehiPartsArr = [];
  disabled = false;
  ShowFilter = false;
  limitSelection = false;
  subfunction: any = [];
  subfunctionMap = {}
  selectedItems: any = [];
  subfunctionlist: any = [];
  subfunctionListMap = {}
  subfunctionppslist: any = [];
  subfunctionPPSMap = {}
  otherCategory:any;
  retrofitmentothers:any;
  dropdownSettings: any = {};
  formdata: any;
  private getsupervisorApi = this.appconstant + 'proto/getSupervisor';
  private protolistapi = this.appconstant + 'proto/list';
  private fileDownloadAPI = this.appconstant + 'proto/downloadAOFile';
  private listDownloadAPI = this.appconstant + 'proto/listAOfilename';
  constructor(private _location: Location, private route: ActivatedRoute, private ds: DataserviceService, private fb: FormBuilder, private http: Http, private router: Router) {

    // var userDetails = localStorage.getItem("Daim-forms");
    // var userJson = JSON.parse(userDetails);


    this.ProtoReqForm = fb.group({
      createddate: [],
      requestorname: ['', Validators.compose([Validators.required])],
      storagePurpose: [null, Validators.compose([Validators.required])],
      contactno: [''],
      prformid: [''],
      department: [],
      category: [],
      subcategory: [],
      workrequest: [],
      projectname: [],
      systemname: [],
      activity: [],
      aodrawing: [],
      retrofitmenttype: [],
      aodrawingtext: [],
      fitmentremarks: [],
      filepath: [],
      finasupdate: [],
      fitmentreport: [],
      finasupdateremarks: [],
      l4: [],
      l4remarks: [],
      status: [],
      umcsParts: this.fb.array([]),
      prvehiclemaster: this.fb.array([])
    });

    this.approvalForm = fb.group({
      remarks: ['', Validators.compose([Validators.required])],

    });
  }

  arrrequest = [];
  arrlist = [];
  protoworkrequest: any;
  arrfunction;
  arrvalue = [];
  arrvalue2 = [];
  arrproto = [];
  arrlists = []
  prototype: any;
  arrcategory = [];
  arrcategorylist = [];
  category: any
  editbcasheet: any
  formVOedit: any;
  formowner: any;
  exigencycase: any;
  today = new Date();
  isVehicleOwner
  finasupdate;
  fitmentreport;
  aodrawing;
  aodrawingtext;
  fitmentremarks;
  finasupdateremarks;
  filepath;

  populateArrList(){

    for(var obj of this.arrlist){
      var selectedValue = ""
      var seledIndex = 0;
      switch(obj){
        
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

      if(this.formOwner == 1 && (this.supervisor == 'hdtsupervisor' || this.supervisor == 'mdtsupervisor')){
        seledIndex = this.subfunctionMap[selectedValue]
  

      }else if(this.formOwner == 1 && (this.supervisor == 'aggregateengine' || this.supervisor == 'aggregatetransmission'  || this.supervisor == 'aggregateaxle')){
        seledIndex = this.subfunctionListMap[selectedValue]
        
      }else if(this.formOwner == 1 && this.supervisor == 'ppssupervisor'){
        seledIndex = this.subfunctionPPSMap[selectedValue]
        
      }

      this.selectedItems.push({item_id: seledIndex, item_text: selectedValue})
      //item_id: 1, item_text: 'Aggregate Engine'
    }

    console.log(this.selectedItems);
  }
  isfillworksheet=null
  ngOnInit() {

    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    console.log(jsonData);
    this.shortid = jsonData['shortid'];
    var value = this.route.queryParams
      .subscribe(params => {
        //console.log(params);
      });
    var editdata = localStorage.getItem('protoformsdata');
    this.userType = localStorage.getItem('proto_usertype');

    console.log("dfgh+" + this.userType)
    var editObj = JSON.parse(editdata);
    console.log(editdata)
    
    this.formId = editObj['id']
    this.editbcasheet = editObj['editbcasheet'];
    this.formVOedit = editObj['formVOedit'];
    this.exigencycase = editObj['exigencycase'];
    this.formowner = editObj['formowner'];
    this.formStatus = editObj['status'];
    // if(this.formStatus == "mdtsupervisorapproved")
    this.fitmentreport = editObj['fitmentreport'];
    this.finasupdate = editObj['finasupdate'];
    this.aodrawing = editObj['aodrawing'];
    this.fitmentremarks = editObj['fitmentremarks'];
    this.finasupdateremarks = editObj['finasupdateremarks'];
    this.aodrawingtext = editObj['aodrawingtext'];
    this.issupervisorapproved = editObj['issupervisorapproved'];
    this.isVehicleOwner = editObj.prvehiclemaster.isVehicleOwner;
    this.otherCategory = editObj['categoryothers'];
    this.retrofitmentothers = editObj['retrofitmentothers'];
    this.umcsParts = editObj['umcsParts']
    if (this.userType == 'hdtsupervisor' || this.userType == 'mdtsupervisor' || this.userType == 'aggregatesupervisor' || this.userType == 'eandesupervisor' || this.userType == 'ppssupervisor'
      || this.userType == 'maintenancesupervisor' || this.userType == 'mechanicalsupervisor') {
      
        this.fetchSupervisorData();
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
    
    for(var subF of this.subfunction){
      this.subfunctionMap[subF["item_text"]] = subF["item_id"]
    }
    console.log(this.subfunctionMap);
    
    this.subfunctionlist = [
      { item_id: 1, item_text: 'Vehicle HDT' },
      { item_id: 2, item_text: 'Vehicle MDT' },
      { item_id: 3, item_text: 'E&E' },
      { item_id: 4, item_text: 'PPS' },
      { item_id: 5, item_text: 'Maintenance' },
      { item_id: 6, item_text: 'Proto Mechanical Workshop' }
    ];

    for(var subF of this.subfunctionlist){
      this.subfunctionListMap[subF["item_text"]] = subF["item_id"]
    }
    console.log(this.subfunctionListMap);
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
    for(var subF of this.subfunctionppslist){
      this.subfunctionPPSMap[subF["item_text"]] = subF["item_id"]
    }
    console.log(this.subfunctionPPSMap);
    
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


    // if (editObj.finasupdate == 1) {
    //   editObj.finasupdate = "Yes";
    // }
    // else if (editObj.finasupdate == 0) {
    //   editObj.finasupdate = "";
    // }
    // if (editObj.fitmentreport == 1) {
    //   editObj.fitmentreport = "Yes";
    // }
    // else if (editObj.fitmentreport == 0) {
    //   editObj.fitmentreport = "";
    // }

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
    console.log(this.arrcategory)
    for (var i = 0; i < this.arrcategory.length; i++) {
      for (var j = 0; j < this.arrcategory[i].split(",").length; j++) {
        this.arrcategorylist.push(this.arrcategory[i].split(",")[j]);
      }

    }
    console.log(this.arrcategorylist);

    // split the subfunctions values

    this.arrvalue = [];
    this.arrvalue2 = [];
    this.arrlist = []
    this.arrfunction = editObj.subsupervisor;
    this.arrvalue2.push(this.arrfunction);
    console.log(this.arrvalue)
    
    for (var i = 0; i < this.arrvalue2.length; i++) {
      for (var j = 0; j < this.arrvalue2[i].split(",").length; j++) {
        this.arrlist.push(this.arrvalue2[i].split(",")[j]);
      }
    }
    console.log(this.arrlist);


   
   


    var tmpSubFunctionArr = [];

    //need to filter from arr list
    for (var d = 0; d < this.subfunction.length; d++) {

      var data = this.subfunction[d];

      var tmp_data = "";
      // tmp_data = this.findLocalValueMap(data, tmp_data);

      if (this.arrlist.indexOf(tmp_data) == -1) {
        tmpSubFunctionArr.push(data)
      }
    }
    for (var d = 0; d < this.subfunctionlist.length; d++) {

      var data = this.subfunctionlist[d];

      var tmp_data = "";
      // tmp_data = this.findLocalValueMap(data, tmp_data);

      if (this.arrlist.indexOf(tmp_data) == -1) {
        tmpSubFunctionArr.push(data)
      }
    }
    for (var d = 0; d < this.subfunctionppslist.length; d++) {

      var data = this.subfunctionppslist[d];

      var tmp_data = "";
      // tmp_data = this.findLocalValueMap(data, tmp_data);

      if (this.arrlist.indexOf(tmp_data) == -1) {
        tmpSubFunctionArr.push(data)
      }
    }
    // console.log(tmpSubFunctionArr);
    // console.log(this.arrlist);`
    // this.subfunction = tmpSubFunctionArr;
    // this.subfunctionlist = tmpSubFunctionArr;
    // this.subfunctionppslist = tmpSubFunctionArr;

    // split the Types of Activity values
    this.freezData(editObj.id)

    this.arrproto = [];
    this.arrlists = []
    var typeactivity = editObj.retrofitmenttype;
    this.prototype = typeactivity;
    this.arrproto.push(this.prototype);
    console.log(this.arrproto)
    for (var i = 0; i < this.arrproto.length; i++) {
      for (var j = 0; j < this.arrproto[i].split(",").length; j++) {
        this.arrlists.push(this.arrproto[i].split(",")[j]);
      }
    }

    if (this.userType == 'requster') {
      this.ProtoReqForm = this.fb.group({
        createddate: [],
        requestorname: ['', Validators.compose([Validators.required])],
        storagePurpose: [null, Validators.compose([Validators.required])],
        contactno: [''],
        department: [],
        prformid: [''],
        category: [],
        supervisor: [],
        subsupervisor: [],
        workrequest: [],
        projectname: [],
        systemname: [],
        activity: [],
        aodrawing: [],
        retrofitmenttype: [],
        aodrawingtext: [],
        fitmentremarks: [],
        filepath: [],
        finasupdate: [],
        fitmentreport: [],
        finasupdateremarks: [],
        l4: [],
        l4remarks: [],
        status: [],
        umcsParts: this.fb.array([]),
        prvehiclemaster: this.fb.array([])
      });
    }
    else if (this.userType == 'protovehicleowner') {
      this.ProtoReqForm = this.fb.group({
        createddate: [],
        requestorname: ['', Validators.compose([Validators.required])],
        storagePurpose: [null, Validators.compose([Validators.required])],
        contactno: [''],
        prformid: [''],
        department: [],
        category: [],
        supervisor: [],
        subsupervisor: [],
        workrequest: [],
        projectname: [],
        systemname: [],
        activity: [],
        aodrawing: [],
        retrofitmenttype: [],
        aodrawingtext: [],
        fitmentremarks: [],
        filepath: [],
        finasupdate: [],
        fitmentreport: [],
        finasupdateremarks: [],
        l4: [],
        l4remarks: [],
        status: [],
        umcsParts: this.fb.array([]),
        prvehiclemaster: this.fb.array([])
      });
    }
    else if (this.userType == 'hdtsupervisor') {
      this.ProtoReqForm = this.fb.group({
        createddate: [],
        requestorname: ['', Validators.compose([Validators.required])],
        storagePurpose: [null, Validators.compose([Validators.required])],
        contactno: [''],
        department: [],
        category: [],
        prformid: [''],
        supervisor: [],
        subsupervisor: [],
        workrequest: [],
        projectname: [],
        systemname: [],
        activity: [],
        aodrawing: [],
        retrofitmenttype: [],
        aodrawingtext: [],
        fitmentremarks: [],
        filepath: [],
        finasupdate: [],
        fitmentreport: [],
        finasupdateremarks: [],
        l4: [],
        l4remarks: [],
        status: [],
        umcsParts: this.fb.array([]),
        prvehiclemaster: this.fb.array([])
      });
    }
    else if (this.userType == 'mdtsupervisor') {
      this.ProtoReqForm = this.fb.group({
        createddate: [],
        requestorname: ['', Validators.compose([Validators.required])],
        storagePurpose: [null, Validators.compose([Validators.required])],
        contactno: [''],
        department: [],
        prformid: [''],
        category: [],
        supervisor: [],
        subsupervisor: [],
        workrequest: [],
        projectname: [],
        systemname: [],
        activity: [],
        aodrawing: [],
        retrofitmenttype: [],
        aodrawingtext: [],
        fitmentremarks: [],
        filepath: [],
        finasupdate: [],
        fitmentreport: [],
        finasupdateremarks: [],
        l4: [],
        l4remarks: [],
        status: [],
        umcsParts: this.fb.array([]),
        prvehiclemaster: this.fb.array([])
      });
    }
    else if (this.userType == 'aggregatesupervisor') {
      this.ProtoReqForm = this.fb.group({
        createddate: [],
        requestorname: ['', Validators.compose([Validators.required])],
        storagePurpose: [null, Validators.compose([Validators.required])],
        contactno: [''],
        prformid: [''],
        department: [],
        category: [],
        supervisor: [],
        subsupervisor: [],
        workrequest: [],
        projectname: [],
        systemname: [],
        activity: [],
        aodrawing: [],
        retrofitmenttype: [],
        aodrawingtext: [],
        fitmentremarks: [],
        filepath: [],
        finasupdate: [],
        fitmentreport: [],
        finasupdateremarks: [],
        l4: [],
        l4remarks: [],
        status: [],
        umcsParts: this.fb.array([]),
        prvehiclemaster: this.fb.array([])
      });
    }
    else if (this.userType == 'eandesupervisor') {
      this.ProtoReqForm = this.fb.group({
        createddate: [],
        requestorname: ['', Validators.compose([Validators.required])],
        storagePurpose: [null, Validators.compose([Validators.required])],
        contactno: [''],
        department: [],
        prformid: [''],
        category: [],
        supervisor: [],
        subsupervisor: [],
        workrequest: [],
        projectname: [],
        systemname: [],
        activity: [],
        aodrawing: [],
        retrofitmenttype: [],
        aodrawingtext: [],
        fitmentremarks: [],
        filepath: [],
        finasupdate: [],
        fitmentreport: [],
        finasupdateremarks: [],
        l4: [],
        l4remarks: [],
        status: [],
        umcsParts: this.fb.array([]),
        prvehiclemaster: this.fb.array([])
      });
    }
    else if (this.userType == 'ppssupervisor') {
      this.ProtoReqForm = this.fb.group({
        createddate: [],
        requestorname: ['', Validators.compose([Validators.required])],
        storagePurpose: [null, Validators.compose([Validators.required])],
        contactno: [''],
        department: [],
        category: [],
        prformid: [''],
        supervisor: [],
        subsupervisor: [],
        workrequest: [],
        projectname: [],
        systemname: [],
        activity: [],
        aodrawing: [],
        retrofitmenttype: [],
        aodrawingtext: [],
        fitmentremarks: [],
        filepath: [],
        finasupdate: [],
        fitmentreport: [],
        finasupdateremarks: [],
        l4: [],
        l4remarks: [],
        status: [],
        umcsParts: this.fb.array([]),
        prvehiclemaster: this.fb.array([])
      });
    }
    else if (this.userType == 'maintenancesupervisor') {
      this.ProtoReqForm = this.fb.group({
        createddate: [],
        requestorname: ['', Validators.compose([Validators.required])],
        storagePurpose: [null, Validators.compose([Validators.required])],
        contactno: [''],
        department: [],
        prformid: [''],
        category: [],
        supervisor: [],
        subsupervisor: [],
        workrequest: [],
        projectname: [],
        systemname: [],
        activity: [],
        aodrawing: [],
        retrofitmenttype: [],
        aodrawingtext: [],
        fitmentremarks: [],
        filepath: [],
        finasupdate: [],
        fitmentreport: [],
        finasupdateremarks: [],
        l4: [],
        l4remarks: [],
        status: [],
        umcsParts: this.fb.array([]),
        prvehiclemaster: this.fb.array([])
      });
    }
    else if (this.userType == 'mechanicalsupervisor') {
      this.ProtoReqForm = this.fb.group({
        createddate: [],
        requestorname: ['', Validators.compose([Validators.required])],
        storagePurpose: [null, Validators.compose([Validators.required])],
        contactno: [''],
        prformid: [''],
        department: [],
        category: [],
        supervisor: [],
        subsupervisor: [],
        workrequest: [],
        projectname: [],
        systemname: [],
        activity: [],
        aodrawing: [],
        retrofitmenttype: [],
        aodrawingtext: [],
        fitmentremarks: [],
        filepath: [],
        finasupdate: [],
        fitmentreport: [],
        finasupdateremarks: [],
        l4: [],
        l4remarks: [],
        status: [],
        umcsParts: this.fb.array([]),
        prvehiclemaster: this.fb.array([])
      });
    }

    editObj.subsupervisor = this.selectedItems;
    this.ProtoReqForm.patchValue(editObj);

    var protoParts = editObj['umcsParts'];
    console.log(protoParts);
    
    this.protoPartsArr = protoParts;

    for (var i = 0; i < protoParts.length; i++) {
      var partVehiObj = protoParts[i];

      this.addRow(partVehiObj);

    }
    var protovehiParts = editObj['prvehiclemaster'];
    this.protoVehiPartsArr = protovehiParts;

    for (var i = 0; i < protovehiParts.length; i++) {
      var partVehicle = protovehiParts[i];
      this.isVehicleOwner = protovehiParts[i]['isVehicleOwner']

      this.addvehicle(partVehicle);
    }

if (this.aodrawing == 0) {
  this.downloadlist();
}
console.log(this.umcsParts)
  }
  
  multiselected = [];
  // private findLocalValueMap(data: any, tmp_data: string) {
  //   switch (data['item_text']) {
  //     case "Vehicle HDT":
  //       tmp_data = "hdtsupervisor";
  //       break;
  //     case "Aggregate Engine":
  //       tmp_data = "aggregateengine";
  //       break;
  //     case "Aggregate Transmission":
  //       tmp_data = "aggregatetransmission";
  //       break;
  //     case "Aggregate Axle":
  //       tmp_data = "aggregateaxle";
  //       break;
  //     case "E&E":
  //       tmp_data = "eandesupervisor";
  //       break;
  //     case "Vehicle MDT":
  //       tmp_data = "mdtsupervisor";
  //       break;
  //     case "PPS":
  //       tmp_data = "ppssupervisor";
  //       break;
  //     case "Maintainence":
  //       tmp_data = "maintenancesupervisor";
  //       break;
  //     case "Proto Mechanical Workshop":
  //       tmp_data = "mechanicalsupervisor";
  //       break;
  //   }
  //   return tmp_data;
  // }

  onItemSelect(item: any) {
    console.log('onItemSelect', item);
    console.log(item)
    if (item.item_text == 'Vehicle HDT') {
      item.item_text = 'hdtsupervisor'
      console.log(item.item_text)
    }
    else if (item.item_text == 'Vehicle MDT') {
      item.item_text = 'mdtsupervisor'
    }
    else if (item.item_text == 'E&E') {
      item.item_text = 'eandesupervisor'
    }
    else if (item.item_text == 'PPS') {
      item.item_text = 'ppssupervisor'
    }
    else if (item.item_text == 'Maintenance') {
      item.item_text = 'maintenancesupervisor'
    }
    else if (item.item_text == 'Proto Mechanical Workshop') {
      item.item_text = 'mechanicalsupervisor'
    }
    else if (item.item_text == 'Aggregate Engine') {
      item.item_text = 'aggregateengine'
    }
    else if (item.item_text == 'Aggregate Transmission') {
      item.item_text = 'aggregatetransmission'
    }
    else if (item.item_text == 'Aggregate Axle') {
      item.item_text = 'aggregateaxle'
    }
    this.multiselected.push(item.item_text);

    console.log(this.multiselected)

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
  get rowForms() {
    return this.ProtoReqForm.get('umcsParts') as FormArray;
  }

  addRow(data) {

    var row;
    if (this.userType == 'requster') {
      row = this.fb.group({
        finasid: [data['finasid']],
        partnumber: [data['partnumber']],
        description: [data['description']],
        quantity: [data['quantity']],
        zgs: [data['zgs']],
        scraporstored: [data['scraporstored']],
        protoid: [data['protoid']],
        protoformid: [data['protoformid']],
        status: [data['status']],
        remarks: ['']
      });
    }
    else if (this.userType == 'protovehicleowner') {
      row = this.fb.group({
        finasid: [data['finasid']],
        partnumber: [data['partnumber']],
        description: [data['description']],
        quantity: [data['quantity']],
        zgs: [data['zgs']],
        scraporstored: [data['scraporstored']],
        protoid: [data['protoid']],
        protoformid: [data['protoformid']],
        status: [data['status']],
        remarks: ['']
      });
    }
    else if (this.userType == 'hdtsupervisor') {
      row = this.fb.group({
        finasid: [data['finasid']],
        partnumber: [data['partnumber']],
        description: [data['description']],
        quantity: [data['quantity']],
        zgs: [data['zgs']],
        scraporstored: [data['scraporstored']],
        protoid: [data['protoid']],
        protoformid: [data['protoformid']],
        status: [data['status']],
        remarks: ['']
      });
    }
    else if (this.userType == 'mdtsupervisor') {
      row = this.fb.group({
        finasid: [data['finasid']],
        partnumber: [data['partnumber']],
        description: [data['description']],
        quantity: [data['quantity']],
        zgs: [data['zgs']],
        scraporstored: [data['scraporstored']],
        protoid: [data['protoid']],
        protoformid: [data['protoformid']],
        status: [data['status']],
        remarks: ['']
      });
    }
    else if (this.userType == 'aggregatesupervisor') {
      row = this.fb.group({
        finasid: [data['finasid']],
        partnumber: [data['partnumber']],
        description: [data['description']],
        quantity: [data['quantity']],
        zgs: [data['zgs']],
        scraporstored: [data['scraporstored']],
        protoid: [data['protoid']],
        protoformid: [data['protoformid']],
        status: [data['status']],
        remarks: ['']
      });
    }
    else if (this.userType == 'eandesupervisor') {
      row = this.fb.group({
        finasid: [data['finasid']],
        partnumber: [data['partnumber']],
        description: [data['description']],
        quantity: [data['quantity']],
        zgs: [data['zgs']],
        scraporstored: [data['scraporstored']],
        protoid: [data['protoid']],
        protoformid: [data['protoformid']],
        status: [data['status']],
        remarks: ['']
      });
    }
    else if (this.userType == 'ppssupervisor') {
      row = this.fb.group({
        finasid: [data['finasid']],
        partnumber: [data['partnumber']],
        description: [data['description']],
        quantity: [data['quantity']],
        zgs: [data['zgs']],
        scraporstored: [data['scraporstored']],
        protoid: [data['protoid']],
        protoformid: [data['protoformid']],
        status: [data['status']],
        remarks: ['']
      });
    }
    else if (this.userType == 'maintenancesupervisor') {
      row = this.fb.group({
        finasid: [data['finasid']],
        partnumber: [data['partnumber']],
        description: [data['description']],
        quantity: [data['quantity']],
        zgs: [data['zgs']],
        scraporstored: [data['scraporstored']],
        protoid: [data['protoid']],
        protoformid: [data['protoformid']],
        status: [data['status']],
        remarks: ['']
      });
    }
    else if (this.userType == 'mechanicalsupervisor') {
      row = this.fb.group({
        finasid: [data['finasid']],
        partnumber: [data['partnumber']],
        description: [data['description']],
        quantity: [data['quantity']],
        zgs: [data['zgs']],
        scraporstored: [data['scraporstored']],
        protoid: [data['protoid']],
        protoformid: [data['protoformid']],
        status: [data['status']],
        remarks: ['']
      });
    }

    this.rowForms.push(row);
  }
  get novehicle() {
    return this.ProtoReqForm.get('prvehiclemaster') as FormArray;

  }
  addvehicle(data) {
    var vehi;
    var todayDate = moment(new Date()).format('DD-MM-YYYY')
    if (this.userType == 'requster') {
      vehi = this.fb.group({
        id: [data['id']],
        quantity: [data['quantity']],
        ownername: [data['ownername']],
        vehicleaggregateno: [data['vehicleaggregateno']],
        modelnumber: [data['modelnumber']],
        startdate: [data['startdate'] + todayDate],
        ownerstatus: [data['ownerstatus']],

      });
    }
    else if (this.userType == 'protovehicleowner') {
      vehi = this.fb.group({
        id: [data['id']],
        quantity: [data['quantity']],
        ownername: [data['ownername']],
        vehicleaggregateno: [data['vehicleaggregateno']],
        modelnumber: [data['modelnumber']],
        startdate: [data['startdate'] + todayDate],
        isVehicleOwner: [data['isVehicleOwner']]
      });
    }
    else if (this.userType == 'hdtsupervisor') {
      vehi = this.fb.group({
        id: [data['id']],
        quantity: [data['quantity']],
        ownername: [data['ownername']],
        vehicleaggregateno: [data['vehicleaggregateno']],
        modelnumber: [data['modelnumber']],
        startdate: [data['startdate'] + todayDate],
      });
    }
    else if (this.userType == 'mdtsupervisor') {
      vehi = this.fb.group({
        id: [data['id']],
        quantity: [data['quantity']],
        ownername: [data['ownername']],
        vehicleaggregateno: [data['vehicleaggregateno']],
        modelnumber: [data['modelnumber']],
        startdate: [data['startdate'] + todayDate],
      });
    }
    else if (this.userType == 'aggregatesupervisor') {
      vehi = this.fb.group({
        id: [data['id']],
        quantity: [data['quantity']],
        ownername: [data['ownername']],
        vehicleaggregateno: [data['vehicleaggregateno']],
        modelnumber: [data['modelnumber']],
        startdate: [data['startdate'] + todayDate],
      });
    }
    else if (this.userType == 'eandesupervisor') {
      vehi = this.fb.group({
        id: [data['id']],
        quantity: [data['quantity']],
        ownername: [data['ownername']],
        vehicleaggregateno: [data['vehicleaggregateno']],
        modelnumber: [data['modelnumber']],
        startdate: [data['startdate'] + todayDate],
      });
    }
    else if (this.userType == 'ppssupervisor') {
      vehi = this.fb.group({
        id: [data['id']],
        quantity: [data['quantity']],
        ownername: [data['ownername']],
        vehicleaggregateno: [data['vehicleaggregateno']],
        modelnumber: [data['modelnumber']],
        startdate: [data['startdate'] + todayDate],
      });
    }
    else if (this.userType == 'maintenancesupervisor') {
      vehi = this.fb.group({
        id: [data['id']],
        quantity: [data['quantity']],
        ownername: [data['ownername']],
        vehicleaggregateno: [data['vehicleaggregateno']],
        modelnumber: [data['modelnumber']],
        startdate: [data['startdate'] + todayDate],
      });
    }
    else if (this.userType == 'mechanicalsupervisor') {
      vehi = this.fb.group({
        id: [data['id']],
        quantity: [data['quantity']],
        ownername: [data['ownername']],
        vehicleaggregateno: [data['vehicleaggregateno']],
        modelnumber: [data['modelnumber']],
        startdate: [data['startdate'] + todayDate],
      });
    }
    this.novehicle.push(vehi);
    console.log(this.novehicle);
  };
  goBack() {
    this.router.navigate(['dashboard/protolist'], {});
  }

  protoMIS(id) {
    this.router.navigate(['dashboard/materialissueslipnew'], {
      queryParams: { id: id }
    });

  }

  getSupervisorTypelist = [];
  subSupervisorId;

  protosupervisor() {
    // this.router.navigate(['/protobca'], {});
     this.router.navigate(['/protosupervisor'], {});
  }

  /* Vehicleowner approve and reject */ /* Vehicleowner approve and reject */

  editVehicleApprove() {
    this.loading = true;
    var arrVehiclePart = [];
    var emptyarr = [];
    var vehiclevalue = [];
    for (var x = 0; x < this.novehicle.value.length; x++) {
      var partstotalvalue = this.novehicle.value[x];
      if (partstotalvalue.isVehicleOwner == 1) {
        emptyarr.push(partstotalvalue);
        vehiclevalue = emptyarr;
        console.log(vehiclevalue)
        for (var i = 0; i < vehiclevalue.length; i++) {
          arrVehiclePart.push({
            id: vehiclevalue[i]['id'],
            vehicleaggregateno: '' + vehiclevalue[i]['vehicleaggregateno'],
            modelnumber: '' + vehiclevalue[i]['modelnumber'],
          })

        }
      }

      console.log(arrVehiclePart);
    }

    var emptydatearr = []
    var arrDate = [];
    var startdatearr =[]
    for (var i = 0; i < this.ProtoReqForm.value.prvehiclemaster.length; i++) {
      this.ProtoReqForm.value.prvehiclemaster[i].startdate = $("#date" + i).val();
    }
    for (var x = 0; x < this.novehicle.value.length; x++) {
      var partstotalvalue = this.novehicle.value[x];
      if (partstotalvalue.isVehicleOwner == 1) {
        emptydatearr.push(partstotalvalue);
        startdatearr = emptydatearr;
        console.log(vehiclevalue)
        for (var i = 0; i < startdatearr.length; i++) {
         arrDate.push({
          id: startdatearr[i]['id'],
          startdate: '' + startdatearr[i]['startdate'],

        })

        }
      }
    }
    var updateVehiclePart = this.ds.appconstant + 'proto' + '/updateVehicleDetails';
    this.ds.makeapi(updateVehiclePart, arrVehiclePart, "postjson")
      .subscribe(data => {
        
        if (data.status == "Success") {
          this.getprotoform()
          var updateStartdate = this.ds.appconstant + 'proto' + '/updateOwnerStartDate';
          this.ds.makeapi(updateStartdate, arrDate, "postjson")
            .subscribe(data2 => {
              if (data2.status == "Success") {
                this.loading = false;
                this.fetchSupervisorData()
                $.notify('Proto Vehicle Owner Request Approved!', "success");
                this.router.navigate(['dashboard/protolist']);
              } else {
                // this.router.navigate(['dashboard/protolist']);
              }

            })
          Error => {

          };
        }
      })
  }
  /* Vehicleowner approve and reject */

  editVehicleReject() {
    if (this.approvalForm.valid) {
      this.loading = true;
      var remarks = this.approvalForm.value.remarks;
      var submitData = "id=" + this.formId + "&status=vehicleownerrejected" + "&remarks=" + remarks;
      var urlValue = this.appconstant + 'proto' + '/updateFormStatus/';
      this.ds.makeapi(urlValue, submitData, 'post')
        .subscribe(data2 => {

          var id = "tst";
          if (data2.status == "Success") {
            this.loading = false;
            $.notify('Proto Vehicle Owner Request Rejected!', "error");
            this.router.navigate(['dashboard/protolist']);
          } else {
            this.router.navigate(['dashboard/protolist']);
          }


        }, Error => {

        });
    }
    else {
      $.notify('Remark is Invalid!', "error");
    }
  }

  /* FOR PROTO  SUPERVISOR FORM OWNER ONE AND EXIGENCYCASE ONE  APPROVAL AND REJECT */

  SupervisorApproveForm(result) {

    var resultType = '';
    if (this.userType == 'hdtsupervisor') {
      if (this.formStatus == "protol4approved" || this.formStatus == "supervisorpending" || this.formStatus == "hdtsupervisorapproved") {
        if (result) {
          resultType = 'hdtsupervisorapproved';
        }
        else {
          resultType = 'hdtsupervisorrejected';
        }
      }
    }
    else if (this.userType == 'mdtsupervisor') {
      if (this.formStatus == "protol4approved" || this.formStatus == "supervisorpending" || this.formStatus == "mdtsupervisorapproved") {
        if (result) {
          resultType = 'mdtsupervisorapproved';
        }
        else {
          resultType = 'mdtsupervisorrejected';
        }
      }
    }
    else if (this.userType == 'aggregatesupervisor') {
      if (this.formStatus == "protol4approved" || this.formStatus == "supervisorpending" || this.formStatus == "aggregatesupervisorapproved") {
        if (result) {
          resultType = 'aggregatesupervisorapproved';
        }
        else {
          resultType = 'aggregatesupervisorrejected';
        }
      }
    }
    else if (this.userType == 'eandesupervisor') {
      if (this.formStatus == "protol4approved" || this.formStatus == "supervisorpending" || this.formStatus == "eandesupervisorapproved") {
        if (result) {
          resultType = 'eandesupervisorapproved';
        }
        else {
          resultType = 'eandesupervisorrejected';
        }
      }
    }
    else if (this.userType == 'ppssupervisor') {
      if (this.formStatus == "protol4approved" || this.formStatus == "supervisorpending" || this.formStatus == "ppssupervisorapproved") {
        if (result) {
          resultType = 'ppssupervisorapproved';
        }
        else {
          resultType = 'ppssupervisorrejected';
        }
      }
    }
    else if (this.userType == 'maintenancesupervisor') {
      if (this.formStatus == "protol4approved" || this.formStatus == "supervisorpending" || this.formStatus == "maintenancesupervisorapproved") {
        if (result) {
          resultType = 'maintenancesupervisorapproved';
        }
        else {
          resultType = 'maintenancesupervisorrejected';
        }
      }
    }
    else if (this.userType == 'mechanicalsupervisor') {
      if (this.formStatus == "protol4approved" || this.formStatus == "supervisorpending" || this.formStatus == "mechanicalsupervisorapproved") {
        if (result) {
          resultType = 'mechanicalsupervisorapproved';
        }
        else {
          resultType = 'mechanicalsupervisorrejected';
        }
      }
    }
    if (this.approvalForm.valid) {

      this.loading = true;
      var remarks = this.approvalForm.value.remarks;
      var submitData = "id=" + this.formId + "&status=" + resultType + "&remarks=" + remarks;
      var urlValue = this.appconstant + 'proto' + '/updateFormStatus/';
      this.ds.makeapi(urlValue, submitData, 'post')
        .subscribe(data2 => {
          this.getprotoform()

          var id = "tst";
          if (data2.status == "Success") {
            this.loading = false;
            if (result == true) {
              this.fetchSupervisorData()
              this.fetchSupervisorData()
              $.notify('Supervisor Request Approved!', "success");
            }
            else if (result == false) {
              $.notify('Supervisor Request Rejected!', "error");
            }
            // this.router.navigate(['dashboard/protolist']);
          } else {
            // this.router.navigate(['dashboard/protolist']);
          }


        }, Error => {

        });
    }
    else {
      $.notify('Remark is Invalid!', "error");
    }
  }

  updateFinaceId(){
   
  }

  /* FOR PROTO  SUPERVISOR EXIGENCYCASE ZERO AND FORMOWNER ONE APPROVAL  */

  acceptForm() {

    var resultType = '';
    if (this.userType == 'hdtsupervisor') {
      if (this.formStatus == "vehicleownerapproved" || this.formStatus == "supervisorpending") {
        resultType = 'hdtsupervisorapproved';
      }
    }
    else if (this.userType == 'mdtsupervisor') {
      if (this.formStatus == "vehicleownerapproved" || this.formStatus == "supervisorpending") {
        resultType = 'mdtsupervisorapproved';
      }
    }
    else if (this.userType == 'aggregatesupervisor') {
      if (this.formStatus == "vehicleownerapproved" || this.formStatus == "supervisorpending") {
        resultType = 'aggregatesupervisorapproved';
      }
    }
    else if (this.userType == 'eandesupervisor') {
      if (this.formStatus == "vehicleownerapproved" || this.formStatus == "supervisorpending") {
        resultType = 'eandesupervisorapproved';
      }
    }
    else if (this.userType == 'ppssupervisor') {
      if (this.formStatus == "vehicleownerapproved" || this.formStatus == "supervisorpending") {
        resultType = 'ppssupervisorapproved';
      }
    }
    else if (this.userType == 'maintenancesupervisor') {
      if (this.formStatus == "vehicleownerapproved" || this.formStatus == "supervisorpending") {
        resultType = 'maintenancesupervisorapproved';
      }
    }
    else if (this.userType == 'mechanicalsupervisor') {
      if (this.formStatus == "vehicleownerapproved" || this.formStatus == "supervisorpending") {
        resultType = 'mechanicalsupervisorapproved';
      }
    }
    if (this.approvalForm.valid) {
      this.loading = true
      var arrDate = [];
      for (var i = 0; i < this.ProtoReqForm.value.prvehiclemaster.length; i++) {
        this.ProtoReqForm.value.prvehiclemaster[i].startdate = $("#date" + i).val();
      }
      for (var x = 0; x < this.novehicle.value.length; x++) {

        arrDate.push({
          id: this.novehicle['value'][x]['id'],
          startdate: '' + this.novehicle['value'][x]['startdate'],

        })
      }
     
      var updateStartdate = this.ds.appconstant + 'proto' + '/updateStartDate';

      this.ds.makeapi(updateStartdate, arrDate, "postjson")
        .subscribe(data => {
          this.getprotoform()
          if (data.status == "Success") {
            
            var remarks = this.approvalForm.value.remarks;

            var submitData = "id=" + this.formId + "&status=" + resultType + "&remarks=" + remarks;
            var urlValue = this.appconstant + 'proto' + '/updateFormStatus/';
            this.ds.makeapi(urlValue, submitData, 'post')
              .subscribe(data2 => {

                if (data2.status == "Success") {
                  this.loading = false
                  this.fetchSupervisorData()
                  this.fetchSupervisorData()
                  $.notify('Proto Supervisor Request Accepted !!', "success");

                  // this.router.navigate(['dashboard/protolist']);
                }
                // else if (data.status == "Pending") {
                //   $.notify('Proto Supervisor Request Accepted !!', "success");

                //   this.router.navigate(['dashboard/protolist']);
                //   } else {
                //   this.router.navigate(['dashboard/protolist']);
                // }


              }, Error => {

              });
          }

        });
        
    }
    else {
      $.notify('Remarks is Invalid!', "error");
    }
  }

  /* FOR PROTO  SUPERVISOR EXIGENCYCASE ZERO AND FORMOWNER ONE  REJECT */

  rejectForm() {

    var resultType = '';
    if (this.userType == 'hdtsupervisor') {
      if (this.formStatus == "vehicleownerapproved" || this.formStatus == "protol4approved" || this.formStatus == "hdtsupervisorapproved") {
        resultType = 'hdtsupervisorrejected';
      }
    }
    else if (this.userType == 'mdtsupervisor') {
      if (this.formStatus == "vehicleownerapproved" || this.formStatus == "protol4approved" || this.formStatus == "mdtsupervisorapproved") {
        resultType = 'mdtsupervisorrejected';
      }
    }
    else if (this.userType == 'aggregatesupervisor') {
      if (this.formStatus == "vehicleownerapproved" || this.formStatus == "protol4approved" || this.formStatus == "aggregatesupervisorapproved") {
        resultType = 'aggregatesupervisorrejected';
      }
    }
    else if (this.userType == 'eandesupervisor') {
      if (this.formStatus == "vehicleownerapproved" || this.formStatus == "protol4approved" || this.formStatus == "eandesupervisorapproved") {
        resultType = 'eandesupervisorrejected';
      }
    }
    else if (this.userType == 'ppssupervisor') {
      if (this.formStatus == "vehicleownerapproved" || this.formStatus == "protol4approved" || this.formStatus == "ppssupervisorapproved") {
        resultType = 'ppssupervisorrejected';
      }
    }
    else if (this.userType == 'maintenancesupervisor') {
      if (this.formStatus == "vehicleownerapproved" || this.formStatus == "protol4approved" || this.formStatus == "maintenancesupervisorapproved") {
        resultType = 'maintenancesupervisorrejected';
      }
    }
    else if (this.userType == 'mechanicalsupervisor') {
      if (this.formStatus == "vehicleownerapproved" || this.formStatus == "protol4approved" || this.formStatus == "mechanicalsupervisorapproved") {
        resultType = 'mechanicalsupervisorrejected';
      }
    }
    if (this.approvalForm.valid) {
      this.loading = true;
      var remarks = this.approvalForm.value.remarks;
      var submitData = "id=" + this.formId + "&status=" + resultType + "&remarks=" + remarks;
      var urlValue = this.appconstant + 'proto' + '/updateFormStatus';
      this.ds.makeapi(urlValue, submitData, 'post')
        .subscribe(data2 => {

          var id = "tst";
          if (data2.status == "Success") {
            this.loading = false;
            $.notify('Proto Supervisor Request Rejected !!', "error");

            this.router.navigate(['dashboard/protolist']);
          } else {
            this.router.navigate(['dashboard/protolist']);
          }


        }, Error => {

        });
    }
    else {
      $.notify('Remark is Invalid!', "error");
    }
  }

  SupervisorForm(result){
    var resultType = '';
    if (this.userType == 'hdtsupervisor') {
      if (this.formStatus == "supervisorpending") {
        if (result) {
          resultType = 'hdtsupervisorapproved';
        }
        else {
          resultType = 'hdtsupervisorrejected';
        }
      }
    }
    else if (this.userType == 'mdtsupervisor') {
      if (this.formStatus == "supervisorpending") {
        if (result) {
          resultType = 'mdtsupervisorapproved';
        }
        else {
          resultType = 'mdtsupervisorrejected';
        }
      }
    }
    else if (this.userType == 'aggregatesupervisor') {
      if (this.formStatus == "supervisorpending") {
        if (result) {
          resultType = 'aggregatesupervisorapproved';
        }
        else {
          resultType = 'aggregatesupervisorrejected';
        }
      }
    }
    else if (this.userType == 'eandesupervisor') {
      if (this.formStatus == "supervisorpending" ) {
        if (result) {
          resultType = 'eandesupervisorapproved';
        }
        else {
          resultType = 'eandesupervisorrejected';
        }
      }
    }
    else if (this.userType == 'ppssupervisor') {
      if (this.formStatus == "supervisorpending") {
        if (result) {
          resultType = 'ppssupervisorapproved';
        }
        else {
          resultType = 'ppssupervisorrejected';
        }
      }
    }
    else if (this.userType == 'maintenancesupervisor') {
      if (this.formStatus == "supervisorpending") {
        if (result) {
          resultType = 'maintenancesupervisorapproved';
        }
        else {
          resultType = 'maintenancesupervisorrejected';
        }
      }
    }
    else if (this.userType == 'mechanicalsupervisor') {
      if (this.formStatus == "supervisorpending") {
        if (result) {
          resultType = 'mechanicalsupervisorapproved';
        }
        else {
          resultType = 'mechanicalsupervisorrejected';
        }
      }
    }
    if (this.approvalForm.valid) {

      this.loading = true;
      var remarks = this.approvalForm.value.remarks;
      var submitData = "id=" + this.formId + "&usertype=" + this.userType + "&status=" + resultType + "&remarks=" + remarks;
      var urlValue = this.appconstant + 'proto' + '/updateFormStatus';
      this.ds.makeapi(urlValue, submitData, 'post')
        .subscribe(data2 => {
          this.getprotoform()

          var id = "tst";
          if (data2.status == "Success") {
            this.loading = false;
            if (result == true) {
              this.fetchSupervisorData()
              this.fetchSupervisorData()
              $.notify('Supervisor Request Approved!', "success");
            }
            else if (result == false) {
              $.notify('Supervisor Request Rejected!', "error");
            }
            // this.router.navigate(['dashboard/protolist']);
          } else {
            // this.router.navigate(['dashboard/protolist']);
          }


        }, Error => {

        });
    }
    else {
      $.notify('Remark is Invalid!', "error");
    }
  }

  /* FOR PROTO  SUPERVISOR FORMOWNER ZERO APPROVAL AND REJECT */

  formOwnerApprove(result) {

    var resultType = '';
    if (this.userType == 'hdtsupervisor') {
      if (this.formStatus == "hdtsupervisorapproved" || this.hdtstate == null) {
        if (result) {
          resultType = 'hdtsupervisorapproved';
        }
        else {
          resultType = 'hdtsupervisorrejected';
        }
      }
    }
    else if (this.userType == 'mdtsupervisor') {
      if (this.formStatus == "mdtsupervisorapproved" || this.mdtstate == null) {
        if (result) {
          resultType = 'mdtsupervisorapproved';
        }
        else {
          resultType = 'mdtsupervisorrejected';
        }
      }
    }
    else if (this.userType == 'aggregatesupervisor') {
      if (this.formStatus == "aggregatesupervisorapproved" || this.aggregatestate == null) {
        if (result) {
          resultType = 'aggregatesupervisorapproved';
        }
        else {
          resultType = 'aggregatesupervisorrejected';
        }
      }
    }
    else if (this.userType == 'eandesupervisor') {
      if (this.formStatus == "eandesupervisorapproved" || this.eandestate == null ) {
        if (result) {
          resultType = 'eandesupervisorapproved';
        }
        else {
          resultType = 'eandesupervisorrejected';
        }
      }
    }
    else if (this.userType == 'ppssupervisor') {
      if (this.formStatus == "ppssupervisorapproved" || this.ppsstate == null) {
        if (result) {
          resultType = 'ppssupervisorapproved';
        }
        else {
          resultType = 'ppssupervisorrejected';
        }
      }
    }
    else if (this.userType == 'maintenancesupervisor') {
      if (this.formStatus == "maintenancesupervisorapproved" || this.maintenancestate == null) {
        if (result) {
          resultType = 'maintenancesupervisorapproved';
        }
        else {
          resultType = 'maintenancesupervisorrejected';
        }
      }
    }
    else if (this.userType == 'mechanicalsupervisor') {
      if (this.formStatus == "mechanicalsupervisorapproved"  || this.mechanicalstate == null) {
        if (result) {
          resultType = 'mechanicalsupervisorapproved';
        }
        else {
          resultType = 'mechanicalsupervisorrejected';
        }
      }
    }
    if (this.approvalForm.valid) {

      this.loading = true;
      var remarks = this.approvalForm.value.remarks;
      var submitData = "formid=" + this.formId + "&usertype=" + this.userType + "&status=" + resultType + "&remarks=" + remarks;
      var urlValue = this.appconstant + 'proto' + '/updateSubSupervisorState';
      this.ds.makeapi(urlValue, submitData, 'post')
        .subscribe(data2 => {
          this.getprotoform()

          var id = "tst";
          if (data2.status == "Success") {
            this.loading = false;
            if (result == true) {
              this.fetchSupervisorData()
              $.notify('Supervisor Request Approved!', "success");
            }
            else if (result == false) {
              $.notify('Supervisor Request Rejected!', "error");
            }
            this.router.navigate(['dashboard/protolist']);
          } else {
            this.router.navigate(['dashboard/protolist']);
          }


        }, Error => {

        });
    }
    else {
      $.notify('Remark is Invalid!', "error");
    }
  }


  /* FOR PROTO  REQUESTER SUBMIT */

  submitForm(){
    $('#confirmSubmit').modal('show');
}


  submitRequster() {
    this.loading = true;
    var requsterArrDate = [];
    for (var i = 0; i < this.ProtoReqForm.value.prvehiclemaster.length; i++) {
      this.ProtoReqForm.value.prvehiclemaster[i].startdate = $("#date" + i).val();
    }
    for (var x = 0; x < this.novehicle.value.length; x++) {

      requsterArrDate.push({
        id: this.novehicle['value'][x]['id'],
        startdate: '' + this.novehicle['value'][x]['startdate'],

      })
    }
    var urlValue = this.ds.appconstant + 'proto' + '/updateStartDate';
    this.ds.makeapi(urlValue, requsterArrDate, 'postjson')
      .subscribe(data2 => {

        var id = "tst";
        if (data2.status == "Success") {
          this.loading = false;
          $.notify('Proto Forms Submitted successfully !!', "success");
          $('#confirmSubmit').modal('hide');
          this.router.navigate(['dashboard/protolist']);
        } else {
          this.router.navigate(['dashboard/protolist']);
        }


      }, Error => {

      });
  }

  /* FOR PROTO  SUBSUPERVISOR ADD FUNCTION */

  subsupervisorList: any;
  addsubSupervisor() {

    var getdata = this.ProtoReqForm.value
    // getdata.subsupervisor
    // var tmp_data = ""
    this.loading = true;
    // var arrselect = [];
    // var getmultipleSelectValue = getdata.subsupervisor;
    // for (let j = 0; j < getmultipleSelectValue.length; j++) {
    //   var setmulitpleValue = getmultipleSelectValue[j].item_text;
    //   if (setmulitpleValue == 'Vehicle HDT') {
    //     setmulitpleValue = 'hdtsupervisor'
    //   }
    //   else if (setmulitpleValue == 'Vehicle MDT') {
    //     setmulitpleValue = 'mdtsupervisor'
    //   }
    //   else if (setmulitpleValue == 'E&E') {
    //     setmulitpleValue = 'eandesupervisor'
    //   }
    //   else if (setmulitpleValue == 'PPS') {
    //     setmulitpleValue = 'ppssupervisor'
    //   }
    //   else if (setmulitpleValue == 'Maintainence') {
    //     setmulitpleValue = 'maintainencesupervisor'
    //   }
    //   else if (setmulitpleValue == 'Proto Mechanical Workshop') {
    //     setmulitpleValue = 'mechanicalsupervisor'
    //   }
    //   else if (setmulitpleValue == 'Aggregate Engine') {
    //     setmulitpleValue = 'aggregateengine'
    //   }
    //   else if (setmulitpleValue == 'Aggregate Transmission') {
    //     setmulitpleValue = 'aggregatetransmission'
    //   }
    //   else if (setmulitpleValue == 'Aggregate Axle') {
    //     setmulitpleValue = 'aggregateaxle'
    //   }
    //   arrselect.push(setmulitpleValue);
    // }
  
    var selectedArr = []
    getdata.subsupervisor.map(function(item){
      if (item.item_text == 'Vehicle HDT') {
        item.item_text = 'hdtsupervisor'
      }
      else if (item.item_text == 'Vehicle MDT') {
        item.item_text = 'mdtsupervisor'
      }
      else if (item.item_text == 'E&E') {
        item.item_text = 'eandesupervisor'
      }
      else if (item.item_text == 'PPS') {
        item.item_text = 'ppssupervisor'
      }
      else if (item.item_text == 'Maintenance') {
        item.item_text = 'maintenancesupervisor'
      }
      else if (item.item_text == 'Proto Mechanical Workshop') {
        item.item_text = 'mechanicalsupervisor'
      }
      else if (item.item_text == 'Aggregate Engine') {
        item.item_text = 'aggregateengine'
      }
      else if (item.item_text == 'Aggregate Transmission') {
        item.item_text = 'aggregatetransmission'
      }
      else if (item.item_text == 'Aggregate Axle') {
        item.item_text = 'aggregateaxle'
      }
      selectedArr.push(item.item_text)
    })

    var selectedFunctionString = ""
    selectedArr.map(function(selected){
      if(selectedFunctionString == ""){
        selectedFunctionString = selected
      }else{
        selectedFunctionString = selectedFunctionString + "," + selected
      }
      
    })
  console.log(this.ProtoReqForm.value)
    let reqdata = "formid=" + this.formId + "&subsupervisor=" + selectedFunctionString;
    var urlValue = this.appconstant + 'proto/updateSubSupervisor';
    this.ds.makeapi(urlValue, reqdata, "post")
      .subscribe(data => {
        if (data.status == "Success") {
          this.fetchSupervisorData();
          this.loading = false;
          $.notify('Sub Function Added Successfully !!', "success");
        }
        //  else{
        //   $.notify('Sub Function Failed!', "error");
        //  }
      },
        Error => {
          this.loading = false;
        });
  }

  /* Supervisor close the form */

  submitClose(){
    $('#confirmClose').modal('show');
  }

  protoClose() {

    if (this.approvalForm.valid) {
      this.loading = true;
      var remarks = this.approvalForm.value.remarks;
      var submitData = "id=" + this.formId + "&status=closed" + "&remarks=" + remarks;
      var urlValue = this.appconstant + 'proto' + '/updateFormStatus/';
      this.ds.makeapi(urlValue, submitData, 'post')
        .subscribe(data2 => {
          var id = "tst";
          if (data2.status == "Success") {
            this.loading = false;
            $.notify('Proto Supervisor Closed !!', "success");
            $('#confirmClose').modal('hide');
            this.router.navigate(['dashboard/protolist']);
          } else {
            this.router.navigate(['dashboard/protolist']);
          }


        }, Error => {

        });
    }
    else {
      $.notify('Remark is Invalid!', "error");
      $('#confirmClose').modal('hide');
    }
  }

  /* Call the getsupervisor api */

  supervisorList: any;
  formOwner;
  subsupervisor;
  status;
  exigencyCase;
  editBcasheet;
  notFormSupervisor;
  hdtstate;
  eandestate;
  aggregatestate;
  mdtstate;
  mechanicalstate;
  ppsstate;
  maintenancestate;
  supervisor;
  issupervisorapproved;
  ismiscreated;
  aggregateval;
  eandeval;
  hdtval;
  maintenanceval;
  mdtval;
  mechanicalval;
  ppsval;
  isfitmentcreated=null
  umcsParts:any
  fetchSupervisorData() {

    let reqdata = "formid=" + this.formId + "&usertype=" + this.userType;

    this.ds.makeapi(this.getsupervisorApi, reqdata, "post")
      .subscribe(data => {
        this.isfitmentcreated = data.isfitmentcreated
        // hdtsupervisor
        // mdtsupervisor
        // aggregateengine
        // aggregatetransmission
        // aggregateaxle
        // ppssupervisor
        this.isfillworksheet = data['isfillworksheet']
        this.supervisorList = data;
        this.formOwner = data['formowner']
        this.subsupervisor = data['subsupervisor'];
        this.status = data['status'];
        this.exigencyCase = data['exigencycase']
        this.editBcasheet = data['editbcasheet'];
        this.notFormSupervisor = data['notformsupervisor'];
        this.hdtstate = data['hdtstate'];
        this.eandestate = data['eandestate'];
        this.aggregatestate = data['aggregatestate'];
        this.mdtstate = data['mdtstate'];
        this.mechanicalstate = data['mechanicalstate'];
        this.maintenancestate = data['maintenancestate'];
        this.ppsstate = data['ppsstate'];
        this.supervisor = data['supervisor']
        this.subsupervisor = data['subsupervisor']
        this.fitmentreport = data['fitmentreport'];
        this.finasupdate = data['finasupdate'];
        this.aodrawing = data['aodrawing'];
        this.fitmentremarks = data['fitmentremarks'];
        this.finasupdateremarks = data['finasupdateremarks'];
        this.aodrawingtext = data['aodrawingtext'];
        this.ismiscreated = data['ismiscreated'];
        this.aggregateval = data['aggregateval'];
        this.eandeval = data['eandeval'];
        this.hdtval = data['hdtval'];
        this.maintenanceval = data['maintenanceval'];
        this.mdtval = data['mdtval'];
        this.mechanicalval = data['mechanicalval'];
        this.ppsval = data['ppsval'];
        this.umcsParts = data.umcsParts
        // this.issupervisorapproved   = data['issupervisorapproved'];

        // this.ProtoReqForm.patchValue( this.supervisorList);

        // var protoParts =  this.supervisorList['umcsParts'];
        // console.log(protoParts);
        // this.protoPartsArr = protoParts;

        // for (var i = 0; i < protoParts.length; i++) {
        //   var partVehiObj = protoParts[i];

        //   this.addRow(partVehiObj);

        // }
        // var protovehiParts =  this.supervisorList['prvehiclemaster'];
        // this.protoVehiPartsArr = protovehiParts;

        // for (var i = 0; i < protovehiParts.length; i++) {
        //   var partVehiObj = protovehiParts[i];
        //    this.isVehicleOwner = protovehiParts[i]['isVehicleOwner']

        //   this.addvehicle(partVehiObj);
        // }
        this.arrvalue = [];
        this.arrvalue2 = [];
        this.arrlist = []
        this.arrfunction = data.subsupervisor;
        this.arrvalue2.push(this.arrfunction);
        console.log(this.arrvalue)
        
        for (var i = 0; i < this.arrvalue2.length; i++) {
          for (var j = 0; j < this.arrvalue2[i].split(",").length; j++) {
            this.arrlist.push(this.arrvalue2[i].split(",")[j]);
          }
        }
        this.populateArrList();

      },
        Error => {
          
          this.loading = false;
        });
  }




  file_id;
  downlaodfile(filename, id) {
    this.file_id = id;
    this.loading= true;
    this.ds.method(this.fileDownloadAPI + "/" + this.file_id, filename, "downloadfile")
      .subscribe(res => {
        if (window.navigator.msSaveOrOpenBlob) {
          this.loading= false;
          var fileData = [res.data];
          var blobObject = new Blob(fileData);
          window.navigator.msSaveOrOpenBlob(blobObject, filename);``
          window.navigator.msSaveOrOpenBlob(blobObject, filename);
        } else {
          this.loading= false;
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
          this.loading= false;
        });
  }

  fileNameArr = [];
  fileDownloadList = [];
  listfileid;
 
  downloadlist() {
    this.fileDownloadList = [];
    var submitData = "formid=" + this.formId  ;
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
  protolists(){
    this.router.navigateByUrl('/dashboard/protolist');
  }
  addproto() {
    this.router.navigate(['dashboard/protonew'], {});
  }
  supervisorSubmit(){
    this.newMethod()
  }
    // FINACE ID UPDATE API CALLING
    resArr=[]
    newMethod() {
       this.resArr = [];
       var finasid = this.ProtoReqForm.value.umcsParts
       for (var i = 0; i < this.umcsParts.length; i++) {
         this.resArr.push({
           id: this.umcsParts[i].id,
           finasid: finasid[i].finasid
         });
       }
       var urlValue1 = this.appconstant + 'proto' + '/updatePartsFinasId/';
       this.ds.makeapi(urlValue1, this.resArr, 'postjson')
         .subscribe(data => {
           if(data.status == "Success"){
              this.fetchSupervisorData()
           }
           this.loading = false
         }), Error => {
         };
     }
     selectedValue=[]
     setItemValue=[]
     freezData(id){
      var urlValue1 = this.appconstant + 'proto' + '/freezeSubFunction';
      this.ds.makeapi(urlValue1, "formid="+id, 'post')
        .subscribe(data => {
            if(data.hdtsupervisor == 1){
              this.selectedValue.push("Vehicle HDT");
            }
            if(data.aggregateengine == 1){
              this.selectedValue.push("Aggregate Engine");
            }
            if(data.aggregatetransmission == 1){
              this.selectedValue.push("Aggregate Transmission");
            }
            if(data.aggregateaxle == 1){
              this.selectedValue.push("Aggregate Axle");
            }
            if(data.eandesupervisor == 1){
              this.selectedValue.push("E&E");
            }
            if(data.ppssupervisor == 1){
              this.selectedValue.push("PPS");
            }
            if(data.maintenancesupervisor == 1){
              this.selectedValue.push("Maintenance");
            }
            if(data.mechanicalsupervisor == 1){
              this.selectedValue.push("Proto Mechanical Workshop");
            }
            if(data.mdtsupervisor == 1){
              this.selectedValue.push("Vehicle MDT");
            }
            
            var tempArr = []
            this.subfunction.map((item)=>{
              if(!_.includes(this.selectedValue,item.item_text)){
                tempArr.push(item)
              }
            })

            
            this.subfunction = tempArr;
            

          this.loading = false
        }), Error => {
        };
     }
     getprotoform() {
      var userData = localStorage.getItem("Daim-forms");
      var jsonData = JSON.parse(userData);
      var userShortId = jsonData['shortid'];
      let reqdata = { "usertype": this.status, "shortid": userShortId, "page":"1", "filterList": [], "fromDate": null, "toDate": null }
      this.ds.makeapi(this.protolistapi, reqdata, "postjson")
        .subscribe(data => {
         
        },
          Error => {
            this.loading = false;
          });
    }
}
