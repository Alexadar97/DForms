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
import { send } from 'q';
@Component({
  selector: 'app-pmworkreqnew',
  templateUrl: './pmworkreqnew.component.html',
  styleUrls: ['./pmworkreqnew.component.css']
})
export class PmworkreqnewComponent implements OnInit {
  numbervalidation = /^[0][1-9]\d{9}$|^[1-9]\d{9}$/;
  pmworkreqform: FormGroup
  ShowFilter = false
  limitSelection = false
  myDateValue: Date;
  private protolistusers = this.ds.appconstant + 'user/list';
  private saveAPI = this.ds.appconstant + 'msw/save';
  private aodrawinguploadapi = this.ds.appconstant + 'msw/uploadCADFile';
  // private GetAPI = this.ds.appconstant + 'msw/get';

  constructor(notifierService: NotifierService, private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private ds: DataserviceService, private http: Http) {

    var req = Validators.compose([Validators.required]);
    this.myDateValue = new Date();
    this.pmworkreqform = this.fb.group({
      requesterid: null,
      projectname: [null, req],
      storagePurpose: [null, req],
      activity: [null, req],
      l4: [null, req],
      costcenter:[null, req],
      iscad: [null, req],
      cadtext: "",
      mswParts: this.fb.array([]),
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
    //   this.multipleallarray = []
    //   this.multiplearray.push(item.item_text)
    //   this.select = "single"
    //   console.log(this.selectedItems);
  }
  onSelectAll(items: any, index) {
    //   this.select = "multiple"
    //   this.multiplearray = []
    //   for (var i = 0; i < items.length; i++) {
    //     var arraylist = items[i].item_text
    //     this.multipleallarray.push(arraylist)
    //   }
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
  l4ProtoUsers = []
  shortid: any
  formId = null
  //   setToken(formId) {
  //     this.formId = formId;

  //     this.Getpmwrdata( this.formId);

  // }
  ngOnInit() {
    $(document).ready(() => {
      $('[name=option]').val("null");
    });
    // var value = this.route.queryParams
    // .subscribe(params => {
    //   this.setToken(params.id);
    // });
    var getshortid = localStorage.getItem("Daim-forms")
    var jsonData = JSON.parse(getshortid);
    this.shortid = jsonData.shortid;
    this.addRow()
    var usertype = "usertype=L4"
    this.ds.makeapi(this.protolistusers, usertype, "post")
      .subscribe(data => {
        this.l4ProtoUsers = data;
      },
        Error => {
        });
  }
  get rowForms() {
    return this.pmworkreqform.get('mswParts') as FormArray;
  }
  servicevalue(value, index) {
    if (value == 0) {
      this.dropdownList[index] = [
        { item_id: 1, item_text: 'Welding' },
        { item_id: 2, item_text: 'Cutting' },
        { item_id: 3, item_text: 'Brazing' },
      ];
    } else if (1) {
      this.dropdownList[index] = [
        { item_id: 1, item_text: 'Welding' },
        { item_id: 2, item_text: 'Cutting' },
        { item_id: 3, item_text: 'Brazing' },
        { item_id: 4, item_text: 'New Part Fabrication/Rework' },
      ];
    }
  }
  addrow=0
  addRow() {
    this.addrow++
    var req = Validators.compose([Validators.required]);
    // var num = Validators.compose([Validators.required, Validators.pattern(this.numbervalidation)]);
    var todayDate = moment(new Date()).format('DD-MM-YYYY');
    const row = this.fb.group({
      ascorderview:[this.addrow],
      workcategory: ['', req],
      worksubcategory: "",
      worksubcategory2: ['', req],
      partnumber: [null, req],
      description: [null, req],
      vehicleno: '',
      quantity: [null, req],
      startdate: [null + todayDate]
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
  cartexvalue: any
  aodrawyes(value) {
    this.cartexvalue = value
    if (value == '1') {
      this.aoyes = false;
      this.aono = true;
      this.pmworkreqform.value.cadtext = ''
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


  submitForm() {
    $('#confirmSubmit').modal('show');
  }



  save() {
    var sendFormData = this.pmworkreqform.value
    sendFormData.requesterid = this.shortid
    this.pmworkreqform.patchValue(sendFormData)
    if ((this.pmworkreqform.invalid) || (this.cartexvalue == '0' && this.pmworkreqform.value.cadtext == "") || (this.cartexvalue == '1' && this.fileUploadArr.length == 0)) {
      $.notify('Invalid Form!', "error");
      $('#confirmSubmit').modal('hide');
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

      if (sendFormData.iscad == 0) {
        sendFormData.cadtext = this.pmworkreqform.value.cadtext
      } else {
        sendFormData.cadtext = ""
      }
      return this.ds.makeapi(this.saveAPI, sendFormData, "postjson")
        .subscribe(data => {
          this.loading = false
          if (data.status == "Success") {
            if (sendFormData.iscad == 1) {
              this.MultipleFileUpload(data.id)
              $('#confirmSubmit').modal('hide');
            }
            this.ds.notify('Form submitted successfully !!', "success");
            this.router.navigate(['dashboard/pmworkreqlist'], {});
            $('#confirmSubmit').modal('hide');
          } else if (data.status == 'Failure') {
            this.ds.notify('Server Error Please Try Again.. !!', "error");
            $('#confirmSubmit').modal('hide');
          }
        },
          Error => {

          })
    }
  }
  test() {
    this.MultipleFileUpload(1);
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
  addpmwork() {
    this.router.navigate(['dashboard/pmworkreqnew'], {});
  }
  // Getpmwrdata(id){
  //   return this.ds.makeapi(this.GetAPI + "/"+id ,"","get")
  //   .subscribe(data=>{

  //   },
  //   Error=>{

  //   })
  // }
  pmlists(){
    this.router.navigateByUrl('/dashboard/pmworkreqlist');
  }
}
