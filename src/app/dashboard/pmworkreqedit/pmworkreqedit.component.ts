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
  selector: 'app-pmworkreqedit',
  templateUrl: './pmworkreqedit.component.html',
  styleUrls: ['./pmworkreqedit.component.css']
})
export class PmworkreqeditComponent implements OnInit {

  pmworkreqform: FormGroup
  remarkForm: FormGroup
  dateForm: FormGroup
  ShowFilter = false
  limitSelection = false
  myDateValue: Date;
  private protolistusers = this.ds.appconstant + 'user/list';
  private saveAPI = this.ds.appconstant + 'msw/save';
  private aodrawinguploadapi = this.ds.appconstant + 'msw/uploadCADFile';
  private listCADFilenameAPI = this.ds.appconstant + 'msw/listCADFilename';
  // private GetAPI = this.ds.appconstant + 'msw/get';
  private appconstant = this.ds.appconstant;
  constructor(notifierService: NotifierService, private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private ds: DataserviceService, private http: Http) {

    var req = Validators.compose([Validators.required]);
    this.myDateValue = new Date();
    this.pmworkreqform = this.fb.group({
      requesterid: null,
      projectname: [null, req],
      storagePurpose: [null, req],
      activity: [null, req],
      l4: [null, req],
      iscad: [null, req],
      costcenter:[null, req],
      cadtext: "",
      mswParts: this.fb.array([]),
    });
    this.remarkForm = this.fb.group({
      remark: [null, req],
    });
    this.dateForm = this.fb.group({
      remark: [null, req],
    });
  }
  l4ProtoUsers = []
  shortid: any
  formId = null
  setToken(formId) {
    this.formId = formId;

    this.Getpmwrdata(this.formId);
    this.FileLIst(this.formId)

  }
  usertype: any
  Mechusertype: any
  ngOnInit() {
    var value = this.route.queryParams
      .subscribe(params => {
        this.setToken(params.id);
      });
    var getshortid = localStorage.getItem("Daim-forms")
    var jsonData = JSON.parse(getshortid);
    this.shortid = jsonData.shortid;
    this.usertype = jsonData['usertype'];
    this.Mechusertype = jsonData['usertype'];
    this.ds.makeapi(this.protolistusers, this.usertype, "post")
      .subscribe(data => {
        this.l4ProtoUsers = data;
      },
        Error => {
        });
  }
  get rowForms() {
    return this.pmworkreqform.get('mswParts') as FormArray;
  }
  // ShowFilter = false
  // limitSelection = false
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
      // mswformid: [{ value: data.mswformid, disabled: this.isDisabled }]
    });
    this.rowForms.push(row);
  }
  deleteRow(i) {
    this.rowForms.removeAt(i);
  }
  goBack() {
    this.router.navigate(['dashboard/pmworkreqlist'], {});
  }
  aoyes = false;
  aono = false;
  aodrawyes(value) {
    if (value == '1') {
      this.aoyes = false;
      this.aono = true;
    }
    else if (value == '0') {
      this.fileUploadArr = []
      this.aoyes = true;
      this.aono = false;
    }
    else {
      this.aono = false;
    }

  }
  loading = false
  fileName;
  Uploadaodrawfile;
  AodrawFileUpload;
  fileformat = '';
  fileUploadArr = []
  uploadfile(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.loading = true;
      for (var i = 0; i < fileList.length; i++) {
        var file: File = fileList[i];
        this.fileName = file.name;
        var finalfilename = (this.fileName).split(".");
        this.fileName = finalfilename[0];
        var len = finalfilename.length - 1
        this.fileformat = finalfilename[len];

        this.fileUploadArr.push({ "filename": this.fileName, "file": file, "fileformat": this.fileformat })
        this.Uploadaodrawfile = file;[]
        this.AodrawFileUpload = "";
      }
      setTimeout(() => {
        this.loading = false;
      }, 4000)

    }
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
  save() {
    var sendFormData = this.pmworkreqform.value
    sendFormData.requesterid = this.shortid
    this.pmworkreqform.patchValue(sendFormData)
    if (this.pmworkreqform.invalid) {
      $.notify('Invalid Form!', "error");
    } else {
      this.loading = true
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
      return this.ds.makeapi(this.saveAPI, sendFormData, "postjson")
        .subscribe(data => {
          if (data.status == "Success") {
            this.loading = false
            this.MultipleFileUpload(data.id)
            this.ds.notify('Form submitted successfully !!', "success");
            this.router.navigate(['dashboard/pmworkreqlist'], {});
          }
        },
          Error => {

          })
    }

  }
  test() {
    this.MultipleFileUpload(1);
  }
  deleteUpload() {
    var elem = document.getElementById('upload');
    elem.parentNode.removeChild(elem);
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
      promisesArray.push(this.saveUploadFile(finalformdata))
    }
    Promise.all(promisesArray).then((result) => {

    })
  }
  private saveUploadFile(finalformdata) {

    return new Promise((resolve, reject) => {
      console.log(finalformdata);
      this.ds.postFile(this.aodrawinguploadapi, finalformdata)
        .subscribe(aodrawupload => {
          if (aodrawupload.status == 'success') {

            this.fileName = ';';
            resolve('success');
          }
          else {
            $.notify('File not Uploaded !!', "error");
            this.loading = false;
          }
          Error => {
            reject('Failed!')
          };
        });
    })
  }
  mswParts: any
  exigencycase: any
  Protostatus: any
  isreqapproved = null
  Getpmwrdata(id) {
    var urlValue = this.appconstant + 'msw/get';
    var submitData = "formid=" + id;
    this.ds.makeapi(urlValue,submitData, 'post')
      .subscribe(data => {
        this.exigencycase = data.exigencycase
        this.Protostatus = data.status
        this.isreqapproved = data.isreqapproved
        this.FileLIst(data.id)
        this.pmworkreqform.patchValue(data)
        if (data.iscad == 1) {
          $("#value1").prop("checked", true);
          this.aono = true;
        } else if (data.iscad == 0) {
          $("#value2").prop("checked", true);
          this.aoyes = true;
        }
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
      },
        Error => {

        })
  }

  submitForm() {
    $('#confirmSubmit').modal('show');
  }


  Aprrovestatus: any
  resArr = []
  updateData(value) {
    var getshortid = localStorage.getItem("Daim-forms")
    var jsonData = JSON.parse(getshortid);
    this.Mechusertype = jsonData['usertype'];
    if (value == 1 && this.usertype == 'L4') {
      this.Aprrovestatus = 'l4approved'
    } else if (value == 0 && this.usertype == 'L4') {
      this.Aprrovestatus = 'l4rejected'
    }
    if (value == 1 && this.usertype == 'protoL4') {
      this.Aprrovestatus = 'protol4approved'
    } else if (value == 0 && this.usertype == 'protoL4') {
      this.Aprrovestatus = 'protol4rejected'
    }

    this.resArr = [];
    var partsFromForm = this.rowForms;
    for (var i = 0; i < this.mswParts.length; i++) {
      this.resArr.push({
        id: this.mswParts[i].id,
        startdate: $("#date" + i).val(),
        mswformid: this.mswParts[i].mswformid
      });
    }
    if (this.remarkForm.invalid && this.Protostatus != "mechsupervisorapproved" && this.Protostatus != "protol4approved") {
      $.notify('Remark invalid !!', "error");
      $('#confirmSubmit').modal('hide');
    } else {
      if(this.Protostatus != "mechsupervisorapproved" && this.Protostatus != "protol4approved"){
      this.loading = true
      var submitData = "formid=" + this.formId + "&status=" + this.Aprrovestatus + "&remarks=" + this.remarkForm.value.remark + "&usetype=" + this.usertype;
      var urlValue = this.appconstant + 'msw/updateFormStatus';
      this.ds.makeapi(urlValue, submitData, 'post')
        .subscribe(data2 => {
          var id = "tst";
          if (data2.status == "Success") {
            $('#confirmSubmit').modal('hide');
            this.loading = false
            if (value == 1) {
              this.updateStartdate()
              $('#confirmSubmit').modal('hide');
            }else{
              this.router.navigate(['dashboard/pmworkreqlist']);
              $('#confirmSubmit').modal('hide');
            }
          }
        },
          Error => {
          });
        }else{
          this.updateStartdate()
          $('#confirmSubmit').modal('hide');
        }
    }
  }
  updateStartdate() {
    this.loading = true
    var updateLocationUrl = this.ds.appconstant + 'msw/updateStartDate';
    this.ds.makeapi(updateLocationUrl, this.resArr, "postjson")
      .subscribe(data => {
        if (data.status === "Success") {
          this.loading = false
            this.router.navigate(['dashboard/pmworkreqlist']);
        }
      },
        Error => {

        });
  }
  pmwrFileListData = []
  FileLIst(id) {
    return this.ds.makeapi(this.listCADFilenameAPI, "formid=" + this.formId, "post")
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
  addpmwork() {
    this.router.navigate(['dashboard/pmworkreqnew'], {});
  }
  pmlists(){
    this.router.navigateByUrl('/dashboard/pmworkreqlist');
  }
}
