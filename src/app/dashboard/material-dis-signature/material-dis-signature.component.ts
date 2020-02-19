import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { DataserviceService } from '../../dataservice.service';

declare var $, moment;
@Component({
  selector: 'app-material-dis-signature',
  templateUrl: './material-dis-signature.component.html',
  styleUrls: ['./material-dis-signature.component.css']
})
export class MaterialDisSignatureComponent implements OnInit {
  addORedituserForm: FormGroup
  p1 = 1
  appconstant = this.ds.appconstant;
  private shortIdSearch = this.appconstant + 'user/search';
  private adduserapi = this.appconstant + 'master/addSignatureDetail';
  private listuserapi = this.appconstant + 'master/listSignatureDetails';
  private signImageSizeApi = this.appconstant + 'master/signImageSize';
  private UploadImgapi = this.appconstant + 'master/uploadSignImage';
  constructor(private ds: DataserviceService, private Formbuilder: FormBuilder, private router: Router, private http: Http) {
    this.addORedituserForm = this.Formbuilder.group({
      "id": [null],
      "signatureby": [null, Validators.compose([Validators.required])],
      "shortid": [null, Validators.compose([Validators.required])],
      "filepath":[]
    });
  }

  ngOnInit() {
    this.getAlluser()
  }

  makeapi(url, data, type): Observable<any> {
    const headers = new Headers();
    if (type == "post") {
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
    } else if (type == "postjson") {
      headers.append('content-type', 'application/json');
    }


    return this.http.post(url, data, { headers: headers })
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
  searchUser() {
    var shortName = this.addORedituserForm.value.shortid;


    return this.makeapi(this.shortIdSearch, 'shortid=' + shortName, "post")
      .subscribe(data => {
        // this.allusers = data;
        //  .set = data['firstname'];
        var formValue = {
          'shortid': data['shortid'],
          'signatureby': data['firstname'] + " " +  data['lastname'],

        }
        // this.addORedituserForm.value.name = data[''];

        this.addORedituserForm.patchValue(formValue);

      },
        Error => {
        });

  }
  modalname: any;
  allusers = [];
  addSignature() {
    this.fileName1 = ""
    this.imgURL=""
    this.modalname = 'Add'
    this.addORedituserForm.reset()
    $("#SignatureModal").modal("show")
  }
  getAlluser() {
    return this.makeapi(this.listuserapi, '', "post")
      .subscribe(data => {
        this.allusers = data;


        console.log(this.allusers)
      },
        Error => {
        });
  }
  imageName
  getImage:any
  loading = false
  edituser(index,img) {
    this.imgURL=""
    this.modalname = 'Edit'
    this.imageName = img
    this.fileName1 = ""
    this.addORedituserForm.reset()
    var getform = this.allusers[index];
    this.getImage = "data:image/png;base64," + getform.signimage
    this.addORedituserForm.patchValue(getform);
    $("#EditSignatureModal").modal("show")
  }
  fileName1
  UploadPartmasterfinallfile1
  uploadfilename1 = false
  // uploadfile1(event) {
  //   if (!event) event = window.event;
  //   console.log(event.target);
  //   console.log(event.srcElement);

  //   let fileList: FileList = event.target.files;
  //   if (fileList.length > 0) {
  //     var file: File = fileList[0];
  //     this.fileName1 = file.name;
  //     var finalfilename = (this.fileName1).split(".");
  //     this.fileName1 = finalfilename[0];
  //     this.UploadPartmasterfinallfile1 = file;
  //     this.uploadfilename1 = true
  //   }
  //   else {
  //     console.log(event.srcElement.files);
  //     var fileList2 = event.srcElement.files;
  //     var file: File = fileList2[0];
  //     this.fileName1 = file.name;
  //     var finalfilename = (this.fileName1).split(".");
  //     this.fileName1 = finalfilename[0];
  //     this.UploadPartmasterfinallfile1 = file;
  //   }

  // }
  public imagePath;
  imgURL: any;
  public message: string;
 
  preview(event) {
   var files = event.target.files
    this.fileName1 = files[0].name
    if (files.length === 0)
      return;
 
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }
 
    var reader = new FileReader();
    this.UploadPartmasterfinallfile1 = files[0];
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      this.imgURL = reader.result; 
    }
  }
  Confirmupload() {
    this.loading = true
    let finalformdata: FormData = new FormData();
    finalformdata.append("filename", this.fileName1);
    finalformdata.append("file", this.UploadPartmasterfinallfile1);
    finalformdata.append("masterid", this.masterId);
     
    this.ds.makeapi(this.UploadImgapi, finalformdata, 'file')
      .subscribe(
        data => {
          if(data.status == "Success"){
            this.imgURL = ""
            if(this.modalname == "Add"){
              $.notify('Signatory Added Successfully', "success");
            }else{
              $.notify('Signatory Edited Successfully', "success");
            }
          }else{
            $.notify('Signatory Added Failed', "error");
          }
          
          this.loading = false
        },
        Error => {
        });
  }
  masterId
 
  FileSize(){
    this.loading = true
    let finalformdata: FormData = new FormData();
    finalformdata.append("filename", this.fileName1);
    finalformdata.append("file", this.UploadPartmasterfinallfile1);
    this.ds.makeapi(this.signImageSizeApi, finalformdata, 'file')
      .subscribe(
        data => {
          this.loading = false
          if(data.status == "Success"){
            this.confirmAdduser()
          }else{
            $.notify('Image Size 10KB to 100KB', "error");
          }
        },
        Error => {
        });
  }

  confirmAdduser() {

    if (this.addORedituserForm.invalid) {
      this.markFormGroupTouched(this.addORedituserForm);
      // this.showNotification('bottom', 'right', 'Form is invalid !!', "danger");
      return false;
    }
    else {
      this.loading = true
      var getform = this.addORedituserForm.value;
      getform.filepath = this.fileName1
      if (getform.id == null) {
        delete getform.id;
      }
      
      return this.makeapi(this.adduserapi, getform, "postjson")
        .subscribe(data => {
          this.loading = false
          if(data.status == "Success"){
            this.masterId = data.id
            this.Confirmupload()
           
            $('#SignatureModal').modal('hide');
            $("#EditSignatureModal").modal("hide")
            this.getAlluser()
          }else{
            $.notify('Signatory Added Failed', "error");
          }
        
        },
          Error => {
            $('#SignatureModal').modal('hide');
            $("#EditSignatureModal").modal("hide")
            // this.showNotification('bottom', 'right', 'Server error,try again later !!', "danger");
          });
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }
  addmisdispatch() {
    this.router.navigate(['dashboard/matdisnew'], {});
  }
  
  mislist() {
    this.router.navigateByUrl('/dashboard/matdislist');
  }
  cancel(){
    this.imgURL = ""
    this.addORedituserForm.reset()
  }
}
