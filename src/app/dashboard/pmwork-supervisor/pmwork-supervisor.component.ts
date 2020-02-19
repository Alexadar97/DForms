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
import { resetFakeAsyncZone } from '@angular/core/testing';
declare var $, moment;

@Component({
  selector: 'app-pmwork-supervisor',
  templateUrl: './pmwork-supervisor.component.html',
  styleUrls: ['./pmwork-supervisor.component.css']
})
export class PmworkSupervisorComponent implements OnInit {
  pmworkreqform: FormGroup
  remarkForm: FormGroup
  master_Form1: FormGroup
  master_Form2: FormGroup
  master_Form3: FormGroup
  master_Form4: FormGroup
  master_Form5: FormGroup
  totalcostForm: FormGroup
  addrowForm: FormGroup
  ShowFilter = false
  limitSelection = false
  myDateValue: Date;
  private listCADFilenameAPI = this.ds.appconstant + 'msw/listCADFilename';
  private saveAPI = this.ds.appconstant + 'msw/updateParts';
  private PmwrTotalSave = this.ds.appconstant + 'msw/addMaterial';

  private appconstant = this.ds.appconstant;
  constructor(private fb: FormBuilder, private router: Router, private ds: DataserviceService, notifierService: NotifierService, private route: ActivatedRoute, private http: Http) {
    var req = Validators.compose([Validators.required]);
    this.pmworkreqform = this.fb.group({
      requesterid: null,
      projectname: [null],
      storagePurpose: [null],
      activity: [null],
      l4: [null],
      iscad: [null],
      mswformid: [null],
      cadtext: [null],
      status: [null],
      createddate: [null],
      requestername: [null],
      department: [null],
      l4remarks: [null],
      costcenter: [null],
      mechbcashortid: [null],
      mechbcapassword: [null],
      protol4remarks: [null],
      supervisorremarks: [null],
      mswParts: this.fb.array([]),
    });
    this.remarkForm = this.fb.group({
      remark: [null, req],
    });
    this.master_Form1 = fb.group({
      length: [{ value: null, disabled: this.MaterialDisabled }, req],
      width: [{ value: null, disabled: this.MaterialDisabled }, req],
      thickness: [{ value: null, disabled: this.MaterialDisabled }, req],
      density: [{ value: null, disabled: this.MaterialDisabled }, req],
      diameter: [null],
      innerdiameter: [null],
      outerdiameter: [null],
      height: [null],
      unitcost: [{ value: null, disabled: this.MaterialDisabled }, req],
      quantity: [{ value: null, disabled: this.MaterialDisabled }, req],
      totalcost: [{ value: null, disabled: this.MaterialDisabled }, req],
      status: "mechsupervisorsubmitted",
      materialname: "sheetmaterial",
      overallcost: [null],
    });
    this.master_Form2 = fb.group({
      length: [{ value: null, disabled: this.MaterialDisabled }, req],
      width: [null],
      density: [{ value: null, disabled: this.MaterialDisabled }, req],
      thickness: [null],
      diameter: [{ value: null, disabled: this.MaterialDisabled }, req],
      innerdiameter: [null],
      outerdiameter: [null],
      height: [null],
      unitcost: [{ value: null, disabled: this.MaterialDisabled }, req],
      quantity: [{ value: null, disabled: this.MaterialDisabled }, req],
      totalcost: [{ value: null, disabled: this.MaterialDisabled }, req],
      status: "mechsupervisorsubmitted",
      materialname: "rod",
      overallcost: [null],
    });
    this.master_Form3 = fb.group({
      length: [{ value: null, disabled: this.MaterialDisabled }, req],
      width: [null],
      thickness: [{ value: null, disabled: this.MaterialDisabled }, req],
      density: [{ value: null, disabled: this.MaterialDisabled }, req],
      diameter: [null],
      // innerdiameter: [null, req],
      outerdiameter: [{ value: null, disabled: this.MaterialDisabled }, req],
      height: [null],
      unitcost: [{ value: null, disabled: this.MaterialDisabled }, req],
      quantity: [{ value: null, disabled: this.MaterialDisabled }, req],
      totalcost: [{ value: null, disabled: this.MaterialDisabled }, req],
      status: "mechsupervisorsubmitted",
      materialname: "pipe",
      overallcost: [null],
    });
    this.master_Form4 = fb.group({
      length: [{ value: null, disabled: this.MaterialDisabled }, req],
      sideaplusb: [{ value: null, disabled: this.MaterialDisabled }, req],
      density: [{ value: null, disabled: this.MaterialDisabled }, req],
      thickness: [null],
      diameter: [null],
      innerdiameter: [null],
      outerdiameter: [null],
      height: [null],
      unitcost: [{ value: null, disabled: this.MaterialDisabled }, req],
      quantity: [{ value: null, disabled: this.MaterialDisabled }, req],
      totalcost: [{ value: null, disabled: this.MaterialDisabled }, req],
      status: "mechsupervisorsubmitted",
      materialname: "langle",
      overallcost: [null],
    });
    this.master_Form5 = fb.group({
      length: [{ value: null, disabled: this.MaterialDisabled }, req],
      width: [{ value: null, disabled: this.MaterialDisabled }, req],
      thickness: [{ value: null, disabled: this.MaterialDisabled }, req],
      density: [{ value: null, disabled: this.MaterialDisabled }, req],
      diameter: [null],
      innerdiameter: [null],
      outerdiameter: [null],
      height: [null],
      unitcost: [{ value: null, disabled: this.MaterialDisabled }, req],
      quantity: [{ value: null, disabled: this.MaterialDisabled }, req],
      totalcost: [{ value: null, disabled: this.MaterialDisabled }, req],
      status: "mechsupervisorsubmitted",
      materialname: "squaretube",
      overallcost: [null],
    });
    this.totalcostForm = fb.group({
      overallcost: [{ value: null, disabled: this.MaterialDisabled }],
    });
    var todayDate = moment(new Date()).format('DD-MM-YYYY');
    this.addrowForm = fb.group({
      id: null,
      technicianname: [null, req],
      date: [null + todayDate],
      workinghrs: [null, req],
    });
  }
  get rowForms() {
    return this.pmworkreqform.get('mswParts') as FormArray;
  }
  get CatrowForms() {
    return this.addrowForm.get('WorkCategory') as FormArray;
  }

  shortid: any
  usertype: any
  ngOnInit() {
    var value = this.route.queryParams
      .subscribe(params => {
        this.fetchFormDetails(params.id);
        this.GetmaterialLIst(params.id)
      });
    // var getshortid = localStorage.getItem("Daim-forms")
    // var jsonData = JSON.parse(getshortid);
    // this.shortid = jsonData.shortid;
    // this.usertype = jsonData['usertype'];
  }
  mswParts: any
  aoyes = false;
  aono = false;
  formId = null
  formtype = null

  formType: any
  card = null
  ApproveSatatus: any
  exigencycase: any
  operationsArray = []
  Operationstatus: any
  servicesutilization = []
  partfabrication = []
  worksubcategory1: any
  worksubcategory2: any
  isDisabled = false
  mechbcashortid = null
  supervisordateval = null
  issupapproved = null
  protol4remarks: any
  supervisorremarks:any
  fetchFormDetails(formid) {
    this.servicesutilization = []
    this.partfabrication = []
    this.formId = formid
    var urlValue = this.appconstant + 'msw/get';
    var submitData = "formid=" + this.formId;;
    this.ds.makeapi(urlValue, submitData, 'post')
      .subscribe(data => {
        this.exigencycase = data.exigencycase
        this.isreqapproved = data.isreqapproved
        this.Operationstatus = data.status
        this.supervisordateval = data.supervisordateval
        this.issupapproved = data.issupapproved
        this.mechbcashortid = data.mechbcashortid
        this.protol4remarks = data.protol4remarks
        this.supervisorremarks = data.supervisorremarks
        if (this.Operationstatus == 'mechsupervisorapproved') {
          this.isDisabled = true;
        }
        this.FileLIst(data.id)
        this.card = data.iscad
        if (data.status == "mechsupervisorapproved") {
          data.status = "Machine Shop Supervisor Approved"
        } else if (data.status == "l4approved") {
          data.status = "Machine Shop Supervisor Approval Pending"
        } else if (data.status == "protol4approved") {
          data.status = "Machine Shop Supervisor Approval Pending"
        }
        this.pmworkreqform.patchValue(data)
        this.mswParts = data.mswParts
        var mswParts = data['mswParts'];

        for (var i = 0; i < mswParts.length; i++) {
          var umvsObj = mswParts[i];
          var push = umvsObj.worksubcategory
          this.workcat(umvsObj.workcategory, i)

          var pushAraray = []
          var addArray = []
          pushAraray.push(push)
          for (var i2 = 0; i2 < pushAraray.length; i2++) {
            for (var j = 0; j < pushAraray[i2].split(",").length; j++) {
              addArray.push(pushAraray[i2].split(",")[j]);
              umvsObj.worksubcategory = addArray
            }
          }
          this.addRow(umvsObj, i);
        }
        this.operationsArray = this.pmworkreqform.value.mswParts
        this.populateOperationList()

      },
        Error => {

        });

  }
  MaterialDisabled = false
  GetmaterialLIst(formId) {
    var urlValue = this.appconstant + 'msw/getMaterialList'
    this.ds.makeapi(urlValue, "formid=" + formId, 'post')
      .subscribe(data => {
        if (data[0] && data[0].status == 'mechsupervisorsubmitted') {
          this.MaterialDisabled = true
          this.master_Form1.patchValue(data[0])
          this.master_Form2.patchValue(data[1])
          this.master_Form3.patchValue(data[2])
          this.master_Form4.patchValue(data[3])
          this.master_Form5.patchValue(data[4])
          this.totalcostForm.patchValue(data[0])
        }
      },
        Error => {

        });
  }

  dropdownList = [[]];
  selectedItems = [[]];
  dropdownSettings = {
    singleSelection: false,
    idField: 'item_id',
    textField: 'item_text',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 2,
    allowSearchFilter: this.ShowFilter
  };
  multiplearray = []
  multipleallarray = []
  select: any
  onItemSelect(item: any, index) {

  }
  onSelectAll(items: any, index) {

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
  map = {}
  servicevalue(value, index) {
    this.map = {
      'Welding': 1,
      'Cutting': 2,
      'Brazing': 3,
      'New Part Fabrication/Rework': 4,

    }
    if (value == 0) {
      this.dropdownList[index] = [
        { item_id: 1, item_text: 'Welding' },
        { item_id: 2, item_text: 'Cutting' },
        { item_id: 3, item_text: 'Brazing' },
      ];

    } else if (value == 1) {
      this.dropdownList[index] = [
        { item_id: 1, item_text: 'Welding' },
        { item_id: 2, item_text: 'Cutting' },
        { item_id: 3, item_text: 'Brazing' },
        { item_id: 4, item_text: 'New Part Fabrication/Rework' },
      ];



    }
  }
  disabled = false
  addRow(data, index) {
    var workSelectedArr = [];
    for (var i = 0; i < data.worksubcategory.length; i++) {
      workSelectedArr.push({
        item_id: this.map[data.worksubcategory[i]],
        item_text: data.worksubcategory[i]
      });
    }

    this.selectedItems[index] = workSelectedArr

    var req = Validators.compose([Validators.required]);
    const row = this.fb.group({
      id: [data.id],
      workcategory: [data.workcategory, req],
      worksubcategory2: [workSelectedArr, req],
      worksubcategory: '',
      partnumber: [{ value: data.partnumber, disabled: this.isDisabled }, req],
      description: [{ value: data.description, disabled: this.isDisabled }, req],
      vehicleno: [{ value: data.vehicleno, disabled: this.isDisabled }],
      quantity: [{ value: data.quantity, disabled: this.isDisabled }, req],
      startdate: [{ value: data.startdate, disabled: this.isDisabled }, req],
      mswformid: [{ value: data.mswformid, disabled: this.isDisabled }]
    });
    this.rowForms.push(row);
  }
  checkDisabled() {
    return false
  }
  deleteRow(i) {
    this.CatrowForms.removeAt(i);
  }
  workvalue: any
  workcat(value, index) {
    this.workvalue = value
    if (value == "servicesutilization") {
      this.servicevalue(0, index)
    } else if (value == "partfabrication") {
      this.servicevalue(1, index)
    }
  }
  loading = false
  status: any
  type: any
  operations = false
  isreqapproved: any
  resArr = []
  updateData(value) {
    if (value == 1) {
      var statuss = 'mechsupervisorapproved'
    } else if (value == 0) {
      var statuss = 'mechsupervisorrejected'
    }

    this.loading = true
    var sendFormData = this.pmworkreqform.value
    var getform = this.pmworkreqform.get('mswParts').value
    for (let i = 0; i < getform.length; i++) {
      var arrselect = []
      var getSelectValue = getform[i].worksubcategory2
      for (let j = 0; j < getSelectValue.length; j++) {
        var setSelectValu = getSelectValue[j].item_text
        arrselect.push(setSelectValu)

      }
      getform[i].worksubcategory = arrselect.join(',');
      getform[i].startdate = $("#date" + i).val()
      delete sendFormData.mswParts
      delete getform[i].worksubcategory2
      sendFormData.mswParts = getform
    }
    sendFormData.iscad = +this.pmworkreqform.value.iscad
    if (sendFormData.iscad == 0) {
      sendFormData.cadtext = this.pmworkreqform.value.cadtext
    } else {
      sendFormData.cadtext = ""
    }
    if (this.remarkForm.invalid) {
      $.notify('Invalid Remark !!', "error");
    } else {
      this.loading = true
      var updateLocationUrl = this.ds.appconstant + 'msw/updateParts';
      return this.ds.makeapi(updateLocationUrl, sendFormData.mswParts, "postjson")
        .subscribe(data => {
          if (data.status === "Success") {
            this.resArr = [];
            // var resObj = {};
            var partsFromForm = this.rowForms;
            for (var i = 0; i < this.mswParts.length; i++) {
              this.resArr.push({
                id: this.mswParts[i].id, // ['id'],
                startdate: $("#date" + i).val(),
                mswformid: this.mswParts[i].mswformid
              });
            }
            var submitData = "formid=" + this.formId + "&status=" + statuss + "&remarks=" + this.remarkForm.value.remark + "&usetype=" + "";
            var urlValue = this.appconstant + 'msw/updateFormStatus';
            this.loading = true;
            this.ds.makeapi(urlValue, submitData, 'post')
              .subscribe(data => {
                if (data.status == "Success" || data.status == "success") {
                  this.remarkForm.reset()
                  this.loading = false
                  if (value == 1) {
                    this.Aprroval_method();
                  }
                  if (statuss == "mechsupervisorrejected") {
                    this.router.navigate(['dashboard/pmworkreqlist']);
                  }
                }
              },
                Error => {

                });

          }
        },
          Error => {
          });
    }
  }
  truestatus: any
  pmwrFileListData = []
  CategorySubmitStatus: any
  technicianArray = []
  private Aprroval_method() {
    var updateDate = this.ds.appconstant + 'msw/updateStartDate';
    this.ds.makeapi(updateDate, this.resArr, "postjson")
      .subscribe(data2 => {
        var id = "tst";
        if (data2.status == "Success") {
          this.loading = false;
          this.operations = true;
          var urlValue = this.appconstant + 'msw/get';
          var submitData = "formid=" + this.formId;
          // this.ds.makeapi(urlValue, submitData, 'post')
          //   .subscribe(data => {
          //   })
          this.ds.makeapi(urlValue, submitData, 'post')
            .subscribe(data => {
              this.exigencycase = data.exigencycase;
              this.isreqapproved = data.isreqapproved;
              this.Operationstatus = data.status;
              this.supervisordateval = data.supervisordateval
              this.issupapproved = data.issupapproved
              this.protol4remarks = data.
              this.supervisorremarks = data.supervisorremarks
              if (data.status == "mechsupervisorapproved") {
                data.status = "Mechanical Supervisor Approved"
              } else if (data.status == "l4approved") {
                data.status = "L4 Approved"
              } else if (data.status == "protol4approved") {
                data.status = "Proto L4 Approved"
              }
              this.pmworkreqform.patchValue(data)
              this.mechbcashortid = data.mechbcashortid
              if (this.Operationstatus == 'mechsupervisorapproved') {
                this.isDisabled = true;
                this.pmworkreqform;
              }
              if ((data.isreqapproved == 0 || data.isreqapproved == 0) && (data.status == "mechsupervisorapproved")) {
                this.router.navigate(['dashboard/pmworkreqlist']);
              }
              this.populateOperationList();
            }, Error => {
            });
        }
      }, Error => {
      });
  }
  OperationsSNo = []
  PartCount: any
  private populateOperationList() {
    var urlValue = this.appconstant + 'msw/listOperations';
    this.loading = true;
    this.ds.makeapi(urlValue, "formid=" + this.formId, 'post')
      .subscribe(data => {
        this.loading = false
        this.servicesutilization = [];
        this.partfabrication = [];
        this.totalCatArray = []
        this.technicianArray = []
        for (let i = 0; i < data.length; i++) {
          var emptObj = data[i];
          this.CategorySubmitStatus = emptObj.status
          // if(this.CategorySubmitStatus == 'submitted'){
          //   this.truestatus = 'false'
          // }else{
          //   this.truestatus = 'true'
          // }
          if (emptObj.technicianDetails == null) {
            emptObj.technicianDetails = []
          }
          if (emptObj.id == undefined || emptObj.id == 0) {
            emptObj.id == null
          }
          if (emptObj.workcategory == 'servicesutilization') {
            this.servicesutilization.push(
              { id: emptObj.id, workcategory: "servicesutilization", mswformid: Number(this.formId), worksubcategory: emptObj.worksubcategory, technicianDetails: emptObj.technicianDetails }
            );
            this.totalCatArray.push(
              { id: emptObj.id, workcategory: "servicesutilization", mswformid: Number(this.formId), worksubcategory: emptObj.worksubcategory, technicianDetails: emptObj.technicianDetails }
            );
            this.worksubcategory1 = emptObj.workcategory;
          }
          if (emptObj.workcategory == 'partfabrication') {
            this.partfabrication.push(
              { id: emptObj.id, workcategory: "partfabrication", mswformid: Number(this.formId), worksubcategory: emptObj.worksubcategory, technicianDetails: emptObj.technicianDetails }
            );
            this.totalCatArray.push(
              { id: emptObj.id, workcategory: "partfabrication", mswformid: Number(this.formId), worksubcategory: emptObj.worksubcategory, technicianDetails: emptObj.technicianDetails }
            );
            this.worksubcategory2 = emptObj.workcategory;
          }
        }
        this.OperationsSNo.push(this.servicesutilization)
        this.OperationsSNo.push(this.partfabrication)
        if (this.OperationsSNo.length == 2 && this.servicesutilization.length != 0) {
          this.PartCount = 2
        } else {
          this.PartCount = 1
        }
      }, Error => {
      });
  }

  FileLIst(id) {
    return this.ds.makeapi(this.listCADFilenameAPI, "formid=" + id, "post")
      .subscribe(data => {
        this.pmwrFileListData = data
      },
        Error => {

        })
  }
  downlaodfile(filename, id) {
    this.loading = true
    var urlValue = this.appconstant + 'msw' + '/downloadCADFile';
    this.ds.method(urlValue + "/" + id, filename, 'downloadfile')
      .subscribe(res => {
        this.loading = false
        if (window.navigator.msSaveOrOpenBlob) {
          var fileData = [res.data];
          var blobObject = new Blob(fileData);
          // $(anchorSelector).click(function(){
          window.navigator.msSaveOrOpenBlob(blobObject, filename);
          window.navigator.msSaveOrOpenBlob(blobObject, filename);
          // });
        } else {
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
      }, Error => {
      });
  }
  // Operation Category Functions

  catValue: any
  OperationName: any
  ShowEnires = false
  workcategory: any
  selectedIndex = null
  opcategoryid = null
  workhoursname: any
  showAddEntires(catValue, value, index) {
    this.addrowForm.reset()

    var todayDate = moment(new Date()).format('DD-MM-YYYY');
    var setDate = this.addrowForm.value
    setDate.date = todayDate
    this.addrowForm.patchValue(setDate)
    this.catValue = catValue
    this.workcategory = value
    if (this.workcategory == "servicesutilization") {
      this.workhoursname = "Services Utilization"
    } else {
      this.workhoursname = "Part Fabrication"
    }
    this.opcategoryid = this.catValue.id
    // this.OperationName = rowValue.item_text
    this.ShowEnires = true
    this.selectedIndex = index
    this.WorkHoursArray = catValue['technicianDetails']

  }
  technicianDetails = []
  totalCatArray = []
  WorkHoursArray = []
  catSaveRow() {
    var index = this.selectedIndex;
    if (this.addrowForm.invalid) {
      $.notify('Invalid Form!', "error");
    } else {
      var entries = [];
      if (this.workcategory == 'servicesutilization') {
        entries = this.servicesutilization[index]["technicianDetails"];
        var reqdata = this.addrowForm.value

        reqdata.date = $("#adddate").val()
        // reqdata.opcategoryid = this.opcategoryid
        // this.technicianDetails.push(reqdata)

        entries.push(reqdata);
        this.servicesutilization[index]["technicianDetails"] = entries
        this.totalCatArray[index]["technicianDetails"] = entries
      } else {
        entries = this.partfabrication[index]["technicianDetails"];
        var reqdata = this.addrowForm.value

        reqdata.date = $("#adddate").val()
        // reqdata.opcategoryid = this.opcategoryid
        // this.technicianDetails.push(reqdata)

        entries.push(reqdata);
        this.partfabrication[index]["technicianDetails"] = entries
        this.totalCatArray[index]["technicianDetails"] = entries
      }

      this.addrowForm.reset()

      // for (let i = 0; i < this.totalCatArray.length; i++) {
      //   this.WorkHoursArray = this.totalCatArray[i].technicianDetails
      // }
      // console.log(this.totalCatArray)
    }
  }
  CatAddrow() {

    // save & add new row

    //update the work array
    //clear the form
    //show the form

    // var emptObj = {
    //   "mswformid": this.formId,"isbcalogin":0, "workcategory": this.workcategory,
    //   "worksubcategory": this.catValue, "technicianDetails": this.technicianDetails
    // }
    // this.totalCatArray.push(emptObj)
    // for (let i = 0; i < this.totalCatArray.length; i++) {
    //   this.WorkHoursArray = this.totalCatArray[i].technicianDetails
    // }

  }

  addrowClose() {
    this.selectedIndex = null
    this.workcategory = null
    this.ShowEnires = false
    $('#confirmClose').modal('hide');
  }


  submitForm() {
    $('#confirmSubmit').modal('show');
  }

  SaveCategory(value) {
    // for(let i=0; i<this.totalCatArray.length; i++){
    //   var deleteWork = this.totalCatArray[i]
    //   delete deleteWork.worksubcategory
    //   delete deleteWork.workcategory
    // }
    var updateLocationUrl = this.ds.appconstant + 'msw/addOperations';
    this.ds.makeapi(updateLocationUrl, this.totalCatArray, "postjson")
      .subscribe(data => {
        var reqdata
        if (value == 0) {
          reqdata = "formid=" + this.formId + "&status=" + "submitted" + "&isdraft=" + 0
          $('#confirmSubmit').modal('hide');
        } else if (value == 1) {
          reqdata = "formid=" + this.formId + "&isdraft=" + 1 + "&status=" + "draft"
        }
        var StatusUpdate = this.ds.appconstant + 'msw/updateOperationsStatus';
        return this.ds.makeapi(StatusUpdate, reqdata, "post")
          .subscribe(data => {
            this.populateOperationList()
            this.remarkForm.reset()
            this.selectedIndex = null
            this.workcategory = null
            this.ShowEnires = false
            $('#confirmSubmit').modal('hide');
          },
            Error => {
              $('#confirmSubmit').modal('hide');
            })
      },
        Error => {

        })

  }

  // Material Calculation

  reqdata1: any
  reqdata2: any
  reqdata3: any
  reqdata4: any
  reqdata5: any
  Calculation(value) {
    var NullValues1 = this.master_Form1.value
    var NullValues2 = this.master_Form2.value
    var NullValues3 = this.master_Form3.value
    var NullValues4 = this.master_Form4.value
    var NullValues5 = this.master_Form5.value

    if (value == 1) {
      if (NullValues1.length == null || NullValues1.width == null || NullValues1.thickness == null || NullValues1.density == null) {
        $.notify('Fill All Required Fields!', "error");
      } else {
        var getValues = this.master_Form1.value
        this.reqdata1 = {
          "materialname": getValues.materialname, "length": getValues.length, "width": getValues.width,
          "thickness": getValues.thickness, "density": getValues.density
        }
        var updateLocationUrl = this.ds.appconstant + 'msw/getUnitCost';
        this.ds.makeapi(updateLocationUrl, this.master_Form1.value, "postjson")
          .subscribe(data => {
            getValues.unitcost = data.unitcost
            this.master_Form1.patchValue(getValues)
          },
            Error => {

            })
      }
    }
    if (value == 2) {
      if (NullValues2.diameter == null || NullValues2.length == null || NullValues2.density == null) {
        $.notify('Fill All Required Fields!', "error");
      } else {
        var getValues = this.master_Form2.value
        this.reqdata2 = { "materialname": getValues.materialname, "diameter": getValues.diameter, "length": getValues.length, "density": getValues.density }
        var updateLocationUrl = this.ds.appconstant + 'msw/getUnitCost';
        this.ds.makeapi(updateLocationUrl, this.master_Form2.value, "postjson")
          .subscribe(data => {
            getValues.unitcost = data.unitcost
            this.master_Form2.patchValue(getValues)
          },
            Error => {

            })
      }
    }
    if (value == 3) {
      if (NullValues3.length == null || NullValues3.thickness == null || NullValues3.density == null || NullValues3.outerdiameter == null) {
        $.notify('Fill All Required Fields!', "error");
      } else {
        var getValues = this.master_Form3.value
        this.reqdata3 = {
          "materialname": getValues.materialname, "outerdiameter": getValues.outerdiameter, "thickness": getValues.thickness,
          "length": getValues.length, "density": getValues.density
        }
        var updateLocationUrl = this.ds.appconstant + 'msw/getUnitCost';
        this.ds.makeapi(updateLocationUrl, this.master_Form3.value, "postjson")
          .subscribe(data => {
            getValues.unitcost = data.unitcost
            this.master_Form3.patchValue(getValues)
          },
            Error => {

            })
      }
    }
    if (value == 4) {
      if (NullValues4.length == null || NullValues4.thickness == null || NullValues4.density == null || NullValues4.sideaplusb == null) {
        $.notify('Fill All Required Fields!', "error");
      } else {
        var getValues = this.master_Form4.value
        this.reqdata4 = {
          "materialname": getValues.materialname, "length": getValues.length,
          "thickness": getValues.thickness, "density": getValues.density, "sideaplusb": getValues.sideaplusb
        }
        var updateLocationUrl = this.ds.appconstant + 'msw/getUnitCost';
        this.ds.makeapi(updateLocationUrl, this.master_Form4.value, "postjson")
          .subscribe(data => {
            getValues.unitcost = data.unitcost
            this.master_Form4.patchValue(getValues)
          },
            Error => {

            })
      }
    }
    if (value == 5) {
      if (NullValues5.length == null || NullValues5.width == null || NullValues5.thickness == null || NullValues5.density == null) {
        $.notify('Fill All Required Fields!', "error");
      } else {
        var getValues = this.master_Form5.value
        this.reqdata5 = {
          "materialname": getValues.materialname, "length": getValues.length, "width": getValues.width,
          "height": getValues.height, "density": getValues.density
        }
        var updateLocationUrl = this.ds.appconstant + 'msw/getUnitCost';
        this.ds.makeapi(updateLocationUrl, this.master_Form5.value, "postjson")
          .subscribe(data => {
            getValues.unitcost = data.unitcost
            this.master_Form5.patchValue(getValues)
          },
            Error => {

            })
      }
    }
  }
  Cal1 = 0
  Cal2 = 0
  Cal3 = 0
  Cal4 = 0
  Cal5 = 0
  calculateQuantity(event, value) {
    if (value == 1) {
      var getValue1 = this.master_Form1.value
      getValue1.totalcost = getValue1.unitcost * event
      this.Cal1 = getValue1.totalcost
      this.master_Form1.patchValue(getValue1)
    }
    if (value == 2) {
      var getValue2 = this.master_Form2.value
      getValue2.totalcost = getValue2.unitcost * event
      this.Cal2 = getValue2.totalcost
      this.master_Form2.patchValue(getValue2)
    }
    if (value == 3) {

      var getValue3 = this.master_Form3.value
      getValue3.totalcost = getValue3.unitcost * event
      this.Cal3 = getValue3.totalcost
      this.master_Form3.patchValue(getValue3)
    }
    if (value == 4) {

      var getValue4 = this.master_Form4.value
      getValue4.totalcost = getValue4.unitcost * event
      this.Cal4 = getValue4.totalcost
      this.master_Form4.patchValue(getValue4)
    }
    if (value == 5) {

      var getValue5 = this.master_Form5.value
      getValue5.totalcost = getValue5.unitcost * event
      this.Cal5 = getValue5.totalcost
      this.master_Form5.patchValue(getValue5)
    }
    var getOveralCost = this.totalcostForm.value
    getOveralCost.overallcost = Number(this.Cal1) + Number(this.Cal2) + Number(this.Cal3) + Number(this.Cal4) + Number(this.Cal5)
    this.totalcostForm.patchValue(getOveralCost)
  }
  TotalCalculationArray = []
  Totalsubmit() {
    this.remark = false
    if ((this.master_Form1.invalid || this.master_Form2.invalid || this.master_Form3.invalid || this.master_Form4.invalid || this.master_Form5.invalid) && (this.CloseId == null)) {
      $.notify('Invalid Form!', "error");
    } else {
      var getValue1 = this.master_Form1.value
      getValue1.mswformid = Number(this.formId)
      getValue1.overallcost = this.totalcostForm.value.overallcost
      this.TotalCalculationArray.push(getValue1)

      var getValue2 = this.master_Form2.value
      getValue2.mswformid = Number(this.formId)
      getValue2.overallcost = this.totalcostForm.value.overallcost
      this.TotalCalculationArray.push(getValue2)

      var getValue3 = this.master_Form3.value
      getValue3.mswformid = Number(this.formId)
      getValue3.overallcost = this.totalcostForm.value.overallcost
      this.TotalCalculationArray.push(getValue3)

      var getValue4 = this.master_Form4.value
      getValue4.mswformid = Number(this.formId)
      getValue4.overallcost = this.totalcostForm.value.overallcost
      this.TotalCalculationArray.push(getValue4)

      var getValue5 = this.master_Form5.value
      getValue5.mswformid = Number(this.formId)
      getValue5.overallcost = this.totalcostForm.value.overallcost
      this.TotalCalculationArray.push(getValue5)

      return this.ds.makeapi(this.PmwrTotalSave, this.TotalCalculationArray, "postjson")
        .subscribe(data => {
          if (data.status == "Success") {
            this.router.navigate(['dashboard/pmworkreqlist'])
            $.notify('Form Submitted Successfully !', "success");
            this.master_Form1.reset()
            this.master_Form2.reset()
            this.master_Form3.reset()
            this.master_Form4.reset()
            this.master_Form5.reset()
          }
        },
          Error => {
          })
    }
  }
  submitClose(){
    if (this.remarkForm.invalid) {
      $.notify('Invalid Remark!', "error");
    } else {
    $('#confirmClose').modal('show');
    }
  }
  remark = false
  CloseId = null
  Close() {
    this.remark = true
    
      var urlValue = this.appconstant + 'msw/updateFormStatus';
      this.loading = true
      var submitData = "formid=" + this.formId + "&status=" + "closed" + "&remarks=" + this.remarkForm.value.remark + "&usetype=" + "";
      this.ds.makeapi(urlValue, submitData, 'post')
        .subscribe(data => {
          if (data.status == "Success") {
            $('#confirmClose').modal('hide');
            this.CloseId = data.id
            $.notify('Form Closed !', "success");
            this.loading = true
            this.Totalsubmit()
            this.router.navigate(['dashboard/pmworkreqlist'])
          }
        },
          Error => {

          });
  }
  addpmwork() {
    this.router.navigate(['dashboard/pmworkreqnew'], {});
  }
  pmlists() {
    this.router.navigateByUrl('/dashboard/pmworkreqlist');
  }
}
