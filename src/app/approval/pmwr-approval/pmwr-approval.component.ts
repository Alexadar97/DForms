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
declare var $,moment;

@Component({
  selector: 'app-pmwr-approval',
  templateUrl: './pmwr-approval.component.html',
  styleUrls: ['./pmwr-approval.component.css']
})
export class PmwrApprovalComponent implements OnInit {
  pmworkreqform:FormGroup
  remarkForm:FormGroup
  private listCADFilenameAPI = this.ds.appconstant + 'msw/listCADFilename';
  private appconstant = this.ds.appconstant;
  constructor(private fb: FormBuilder, private router: Router, private ds: DataserviceService, notifierService: NotifierService, private route: ActivatedRoute, private http: Http) {
    var req = Validators.compose([Validators.required]);
    this.pmworkreqform = this.fb.group({
      requesterid: null,
      projectname: [null,],
      storagePurpose: [null],
      activity: [null],
      l4: [null],
      iscad: [null],
      mswformid: [null],
      cadtext: [null],
      status: [null],
      createddate: [null],
      requestername: [null],
      costcenter: [null],
      department: [null],
      l4remarks: [null],
      mswParts: this.fb.array([]),
    });
    this.remarkForm = this.fb.group({
      remark: [null, req],
    });
   }
   get rowForms() {
    return this.pmworkreqform.get('mswParts') as FormArray;
  }
  shortid:any
  usertype:any
  token:any
  ngOnInit() {
    var token = this.route.snapshot.params['token'];
    this.token = token
    this.setToken(token);
    // var getshortid = localStorage.getItem("Daim-forms")
    // var jsonData = JSON.parse(getshortid);
    // this.shortid = jsonData.shortid;
    // this.usertype = jsonData['usertype'];
  }
  isDisabled=false
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
  addrowForm: FormGroup
  ShowFilter = false
  limitSelection = false
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
  mswParts:any
  aoyes = false;
  aono = false;
  formId=null
  formtype=null
  setToken(token){
    var urlValue = this.appconstant + 'approval/get';
    var submitData = "token=" + token;
    this.ds.makeapi(urlValue,submitData ,'post')
    .subscribe(data=>{
      this.formId = data.formid
      this.formtype = data.formtype
      this.usertype = data.type
      this.ApproveSatatus = data.status
      this.type = this.usertype.toUpperCase()
      this.FileLIst(this.formId)
      this.fetchFormDetails(this.formtype, this.formId)
    },
    Error=>{

    })
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
  formType:any
  card=null
  ApproveSatatus:any
  l4remarks=null
  fetchFormDetails(formtype, formid) {
    var urlValue = this.appconstant + formtype + '/get';
    var submitData = 'formid=' + formid;
    this.ds.makeapi(urlValue, submitData,'post')
      .subscribe(data => {
        this.card = data.iscad
        this.l4remarks = data.l4remarks
        if(data.status == "pending"){
          data.status = "Requestor L4 Approval Pending"
        }else if(data.status == "l4approved" && data.exigencycase == 1){
          data.status = "Proto L4 Approval Pending"
        }else if(data.status == "l4approved" && data.exigencycase == 0){
          data.status = "Machine Shop Supervisor Approval Pending"
        }else if(data.status == "protol4approved"){
          data.status = "Machine Shop Supervisor Approval Pending"
        }
        this.pmworkreqform.patchValue(data)
        this.mswParts = data.mswParts
        this.FileLIst(data.id)
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
      }, Error => {

      });

  }
  loading=false
  status:any
  type:any
  resArr = []
  updateData(value){ 
    if(value == 1 && this.type == 'L4'){
         var statuss = 'l4approved'
    }else if(value == 0 && this.type == 'L4'){
      var statuss = 'l4rejected'
    }
    if(value == 1 && this.type == 'PROTOL4'){
      var statuss = 'protol4approved'
    }else if(value == 0 && this.type == 'PROTOL4'){
      var statuss = 'protol4rejected'
    }
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
  if(this.remarkForm.invalid){
    $.notify('Remark invalid !!', "error");
  }else{
    this.loading = true
    var submitData = "formid=" + this.formId + "&status=" + statuss + "&remarks=" + this.remarkForm.value.remark + "&usetype=" + this.usertype;
    var urlValue = this.appconstant + 'msw/updateFormStatus';
    this.loading = true;
    this.ds.makeapi(urlValue, submitData, 'post')
      .subscribe(data => {
        if(data.status === "Success") {
          this.loading = false
          this.SetTockenValue();
          if(value == 1){
            this.Update_Startdate();
          }else{
          }
            
        }
      },
    Error => {
    });
    
  }
}
pmwrFileListData=[]
  private Update_Startdate() {

    var updateLocationUrl = this.ds.appconstant + 'msw/updateStartDate';

    this.ds.makeapi(updateLocationUrl, this.resArr, "postjson")
      .subscribe(data2 => {
        
        if (data2.status == "Success") {
        }
      }, Error => {
      });
  }

  private SetTockenValue() {
    var id = "tst";
    var urlValue1 = this.appconstant + '/approval/doExpired';
    this.loading = true;
    var submitData = 'token=' + this.token
    this.ds.makeapi(urlValue1 , submitData, 'post')
      .subscribe(data => {
        if (data.status == "Success") {
          this.loading = false;
          this.router.navigate(['location_approval'], { queryParams: { id: id } });
        }
      }, Error => { });
  }

FileLIst(id){
  return this.ds.makeapi(this.listCADFilenameAPI, "formid="+this.formId ,"post")
  .subscribe(data=>{
       this.pmwrFileListData = data
  },
  Error=>{

  })
}
downlaodfile(filename,id) {
  this.loading = true
  var urlValue = this.appconstant + 'msw' + '/downloadCADFile';
  this.ds.method(urlValue+"/"+id, filename, 'downloadfile')
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
}
