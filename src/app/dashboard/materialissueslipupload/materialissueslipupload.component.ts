import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { NotifierService } from 'angular-notifier';
import { DataserviceService } from '../../dataservice.service';
declare var $
@Component({
  selector: 'app-materialissueslipupload',
  templateUrl: './materialissueslipupload.component.html',
  styleUrls: ['./materialissueslipupload.component.css']
})
export class MaterialissueslipuploadComponent implements OnInit {


  uploadApi;
  form;
  deptList;
  l4Users;
  numbervalidation = /^[0][1-9]\d{9}$|^[1-9]\d{9}$/;
  loading = false;
  private readonly notifier: NotifierService;
  private appconstant = this.ds.appconstant;
  fb = null
  private misSaveAPI = this.ds.appconstant + 'mis/saveDummyForm';
  private uploadmis = this.ds.appconstant + 'mis/uploadMisForm';
  private validationAPI = this.ds.appconstant + 'mis/validateMisForm';

  constructor(notifierService: NotifierService, fb: FormBuilder, private http: Http, private router: Router, private _location: Location, private ds: DataserviceService) {
    this.fb = fb;
    this.notifier = notifierService;
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    var userShortId = jsonData['shortid'];
    var userid = jsonData.shortid;

    var req = Validators.compose([Validators.required]);

    var num = Validators.compose([Validators.required, Validators.pattern(this.numbervalidation)]);

    this.form = fb.group({
      requesterid: [userid],
      project: ['', req],
      purpose: ['', req],
      hrid: ['', req],
      contactno: ['', req],
      partavailable:[this.partchecked,req],
    });
  }

  ngOnInit() {


  }
  keyAlpha(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  partchecked;
  value;
  checkedpart(value) {
    this.partchecked=value;
    console.log( this.partchecked);
  }

  fileName;
  file_Name;
  UploadPartmasterfinallfile;
  UploadPartmastererrorFileUpload;

  uploadfile(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      var file: File = fileList[0];
      this.fileName = file.name;
      this.file_Name = this.fileName
      var finalfilename = (this.fileName).split(".");
      this.fileName = finalfilename[0];
      this.UploadPartmasterfinallfile = file;
      this.UploadPartmastererrorFileUpload = "";

    }

  }

  goBack() {
    this._location.back();
  }
  saveMIS() {
    let reqdata = "";
    let url = this.misSaveAPI;
    let data = this.form.value;
    data.fileupload = this.file_Name
    reqdata = JSON.stringify(data);
    console.log(reqdata)
    return this.postRequest(url, reqdata);
  }
  postRequest(url, reqdata) {
    const headers = new Headers();
    headers.append('content-type', 'application/json');
    // headers.append('Content-Type', 'application/x-www-form-urlencoded');
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



  submitForm() {
    $('#confirmSubmit').modal('show');
  }


  confirmSubmit() {
    console.log(this.form)
    if (this.form.valid && this.file_Name != undefined) {
      let finalformdata: FormData = new FormData();
      finalformdata.append("file", (this.UploadPartmasterfinallfile));
      finalformdata.append("filename", (this.file_Name));
      this.ds.postFile(this.validationAPI, finalformdata)
      .subscribe(validation=>{
        if (validation.status === "success") {
          this.saveMIS().subscribe(data => {
            if (data.status === "Success") {
              var form_id = data.id;
              // if(this.value){
              //   this.ischecked = 1
              //  }
              // else{
              //   this.ischecked = 0
              // }
              finalformdata.append("formid", (form_id));
              finalformdata.append("partavailable", (this.partchecked));
               this.ds.postFile(this.uploadmis, finalformdata)
                .subscribe(
                  uploaddata => {
                    if (uploaddata.status == 'Success') {
                      this.loading = false;
                      this.form.reset();
                      this.fileName = ';';
                      $.notify('File uploaded successfully !!',"success");
                      $('#confirmSubmit').modal('hide');
                      // this.router.navigateByUrl('dashboard/materialissuesliplist');
                      this.getUploadPreview( form_id);
                      $('#confirmSubmit').modal('hide');
                    }
                    else {
                      $.notify('File not Uploaded !!',"error");
                      $('#confirmSubmit').modal('hide');
                    }
    
                  },
                  Error => {
    
                    this.loading = false;
                    $.notify('Something went wrong,try again later!',"error");
                    $('#confirmSubmit').modal('hide');
    
                  });
    
            }
           
          })
        }else{
          $.notify(validation.field+' '+'!!',"error");
          this.loading = false;
          $('#confirmSubmit').modal('hide');
        }
      },
      Error=>{

      })
     
    }
    else{
      $.notify('Form is Invalid!', "error");
      $('#confirmSubmit').modal('hide');
    }
  }
  materialnewlist() {
    this.router.navigate(['dashboard/materialissueslipnew'], {});
  }
  uploadpart() {
    this.router.navigate(['dashboard/materialissueslipupload'], {
      queryParams: { type: 'mis' }
    });
  }
  mislist(){
    this.router.navigateByUrl('/dashboard/materialissuesliplist');
  }




  getValue: any;
  isShowValue = false;
  showButton = false;
  uploadStatus:any;
  getUploadPreview(formid) {
    var urlValue = this.appconstant + 'mis/getDummyForm';
    var submitData = "dummyformid=" + formid;
    this.ds.makeapi(urlValue, submitData, 'post')
      .subscribe(data2 => {
        //show information in screen.
        //show approval and reject
        this.isShowValue = true;
        var patchValue = data2;
        this.DummyFormId = data2['id'];
        this.form.reset();
        this.form.patchValue(patchValue);

        var req = Validators.compose([Validators.required]);
        var phone = Validators.compose([Validators.required, Validators.pattern(this.numbervalidation)]);
        var userData = localStorage.getItem("Daim-forms");
        var jsonData = JSON.parse(userData);
        var userid = jsonData.shortid;
    
        this.form = this.fb.group({
          requesterid: [userid],
          project: [patchValue.project],
          purpose: [patchValue.purpose],
          hrid: [patchValue.hrid],
          contactno: [patchValue.contactno],
          partavailable:[patchValue.partavailable],
          misPartsDummy: this.fb.array([]),

        });

        var misParts = data2['misPartsDummy'];
        for (var i = 0; i < misParts.length; i++) {
          var stoObj = misParts[i];
          this.showRow(stoObj);
        }
        Error => {

        };
      })
  }
  showRow(data) {
    const row = this.fb.group({
      partnumber: [data['partnumber']],
      description: [data['description']],
      zgs: [data['zgs']],
      quantity: [data['quantity']],
      partavailable: [data['partavailable']],
      partremarks: [data['partremarks']]
    });
    this.rowForms.push(row);
  }
  get rowForms() {
    return this.form.get('misPartsDummy') as FormArray;
  }
 
  uploadCancel(){
    $('#cancelUpload').modal('show');
  }

  confirmCancel(){
    var urlValue = this.appconstant + 'mis/cancelDummyForm';
    this.loading = true;
    this.ds.makeapi(urlValue, '', 'post')
      .subscribe(data => {
           if(data.status == 'Success'){
            this.loading = false;
          $('#cancelUpload').modal('hide');
           this.router.navigateByUrl('dashboard/materialissuesliplist');
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
    var urlValue = this.appconstant + 'mis/confirmDummyForm';
    var submitData = "dummyformid=" + this.DummyFormId;
    this.loading = true;
    this.ds.makeapi(urlValue, submitData , 'post')
      .subscribe(data => {
        if (data.status == 'Success') {
          $('#confirmUpload').modal('hide');
          $.notify('Form submitted successfully !!', "success");
          this.loading = false;
          this.router.navigateByUrl('dashboard/materialissuesliplist');
         }
         Error => {
          this.loading = false;
        };
      })
    }
}




