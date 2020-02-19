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
  selector: 'app-pmwrupload',
  templateUrl: './pmwrupload.component.html',
  styleUrls: ['./pmwrupload.component.css']
})
export class PmwruploadComponent implements OnInit {
  numbervalidation = /^[0][1-9]\d{9}$|^[1-9]\d{9}$/;
  pmworkreqform: FormGroup
  ShowFilter = false
  limitSelection = false
  myDateValue: Date;
  private appconstant = this.ds.appconstant;
  private protolistusers = this.ds.appconstant + 'user/list';
  private saveAPI = this.ds.appconstant + 'msw/saveDummyForm';
  private aodrawinguploadapi = this.ds.appconstant + 'msw/uploadCADDummyFile';
  private upload = this.ds.appconstant + 'msw/uploadExcelFile';
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
    });
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
    var usertype = "usertype=L4"
    this.ds.makeapi(this.protolistusers, usertype, "post")
      .subscribe(data => {
        this.l4ProtoUsers = data;
      },
        Error => {
        });
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
  fileName1;
  fileName2

  UploadPartmasterfinallfile1;
  UploadPartmastererrorFileUpload;
  UploadPartmasterfinallfile2;
  UploadPartmasterfinallfile
  // uploadfile
  uploadfile1(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      var file: File = fileList[0];
      this.fileName1 = file.name;
      var finalfilename = (this.fileName1).split(".");
      this.fileName1 = finalfilename[0];
      this.UploadPartmasterfinallfile = file;
      this.UploadPartmastererrorFileUpload = "";
      // $("#uploadpackmaster").modal("show");
    }
  }
  showeditvalue=false
  uploadfileid = null
  save() {
    if(this.fileName1 != undefined){
    var sendFormData = this.pmworkreqform.value
    sendFormData.requesterid = this.shortid
    this.pmworkreqform.patchValue(sendFormData)
    if ((this.pmworkreqform.invalid) || (this.cartexvalue == '0' && this.pmworkreqform.value.cadtext == "") || (this.cartexvalue == '1' && this.fileUploadArr.length == 0)) {
      $.notify('Invalid Form!', "error");
      $('#confirmSubmit').modal('hide');
    } else {
      this.loading = true
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
            this.uploadfileid = data.id
            if (sendFormData.iscad == 1) {
              this.MultipleFileUpload(data.id)
            }
            let finalformdata: FormData = new FormData();
            finalformdata.append("filename", (this.fileName1));
            finalformdata.append("file", (this.UploadPartmasterfinallfile));
            var validateUrl = this.ds.appconstant + "msw/validateFile";
            this.ds.postFile(validateUrl, finalformdata)
              .subscribe(validationdata => {
                if(validationdata.status == 'Success'){
                  finalformdata.append("dummyformid", (this.uploadfileid));
                  this.ds.postFile(this.upload, finalformdata)
  
                    .subscribe(
                      uploaddata => {
                        this.loading = false;
                        if (uploaddata.status == 'Success') {
                          this.showeditvalue = true
                          // this.fetchmisdispatch(this.uploadfileid)
                          $('#uploadpackmaster').modal("hide");
                          $('#confirmSubmit').modal('hide');
                          $.notify('File uploaded successfully !!', "success");
                          this.fileName1 = '';
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
              }),Error=>{
  
              }
                $('#confirmSubmit').modal('hide');
            // this.router.navigate(['dashboard/pmworkreqlist'], {});
            $('#confirmSubmit').modal('hide');
          } else if (data.status == 'Failure') {
            this.ds.notify('Server Error Please Try Again.. !!', "error");
            $('#confirmSubmit').modal('hide');
          }
        },
          Error => {

          })
    }
  }else{
    $.notify('Invalid Form!', "error");
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
      finalformdata.append("dummyformid", (form_id));
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
          if (aodrawupload.status == 'Success') {

            this.fileName = ';';
            resolve('Success');
          }
          else {
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
  confirmCancel(){
    var urlValue = this.appconstant + 'msw/cancelDummyForm';
    this.loading = true;
    this.ds.makeapi(urlValue, '', 'post')
      .subscribe(data => {
  
           if(data.status == 'Success'){
            this.loading = false;
            $('#cancelUpload').modal('hide');
            this.ds.notify('Form submitted successfully !!', "cancelled");
             this.router.navigateByUrl('dashboard/pmworkreqlist');
           }
        Error => {
          this.loading = false;
        };
      })
  }
  uploadConfirm(){
    $('#confirmUpload').modal('show');
  }
  DummyFormId:any;
  confirmUploadForm(){
    var urlValue = this.appconstant + 'msw/confirmDummyForm';
    var submitData = "dummyformid=" + this.uploadfileid;
    this.loading = true;
    this.ds.makeapi(urlValue, submitData , 'post')
      .subscribe(data => {
        if (data.status == 'Success') {
          this.loading = false;
          $('#confirmUpload').modal('hide');
          this.ds.notify('Form submitted successfully !!', "success");
          this.router.navigateByUrl('dashboard/pmworkreqlist');
         }
         Error => {
          this.loading = false;
        };
      })
  }
}
