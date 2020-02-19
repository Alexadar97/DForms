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
declare var $
@Component({
  selector: 'app-tcpnew',
  templateUrl: './tcpnew.component.html',
  styleUrls: ['./tcpnew.component.css']
})
export class TcpnewComponent implements OnInit {
  TCPlateInfoForm: FormGroup
  today=new Date();
  private appconstant = this.ds.appconstant;
  private savetcptrip = this.appconstant + 'tcplate/addTrip';
  private TCPListTripapi = this.appconstant + 'tcplate/listTripModel';
  private uploadAPI = this.appconstant + 'tcplate/uploadFormNineteen ';
  private form19DownloadAPI = this.appconstant + 'tcplate/downloadFormNineteenExcel ';
  constructor(notifierService: NotifierService, private _location: Location, private makeapi: DataserviceService, private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private ds: DataserviceService, private http: Http) {
    var req = Validators.compose([Validators.required]);
    this.TCPlateInfoForm = this.fb.group({
      form19srno: [null, req],
      startdate: [null, req],
      enddate: [null, req],
      drivername: [null, req],
      fromloc: [null, req],
      toloc: [null, req],
      startodo: [null, req],
      endodo: [null, req],
      remarks: [null, req],
    });
  }
  formId
  tcpname
  tcpExpiry
  tcpinsurence
  add19Trip
  filepathname
  filepathnameins
  l4Users
  usertype
  Shortid
  status
  isL4
  istcplate
  isUser
  remarks
  insnumber
  assignremarks
  myDateValue: Date;
  ngOnInit() {
    this.myDateValue = new Date();
    var usertype = "usertype=L4"
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    var userShortId = jsonData['shortid'];
    console.log("userShortId=" + userShortId)
    let reqdata = "userid=" + userShortId;
    // let reqdata = "usertype=SM";
    var usertype = '';

    if (jsonData['usertype']) {
      usertype = jsonData['usertype'].toLowerCase();
      this.usertype = usertype
      this.Shortid = userShortId
    }
    if (usertype === "L4") {
      this.status = ''
      this.isL4 = true;
    } else if (usertype === "tcplate") {
      this.status = ''
      this.istcplate = true;
    } else if (usertype === "user") {
      this.status = ''
      this.isUser = true;
    }
    else {
      this.status = '';
    }
    var editdata = localStorage.getItem('tcpdata');
    var editObj = JSON.parse(editdata);

    this.formId = editObj['id']
    this.tcpname = editObj['tcplatename']
    this.remarks = editObj['remarks']
   
    this.add19Trip = editObj['tcPlateTripModel']
    console.log(this.add19Trip)
    for (let i = 0; i < editObj['tcPlateExpiryModel'].length; i++) {
     var active = editObj['tcPlateExpiryModel'][i].isactive
      if (active == 1) {
        this.filepathname = editObj['tcPlateExpiryModel'][i].filepath
        this.tcpExpiry = editObj['tcPlateExpiryModel'][i].expirydate
      }
    }
    for (let j = 0; j < editObj['tcPlateInsuranceModel'].length; j++) {
      var isactive = editObj['tcPlateInsuranceModel'][j].isactive
      if (isactive == 1) {
        this.filepathnameins = editObj['tcPlateInsuranceModel'][j].filepath
        this.tcpinsurence = editObj['tcPlateInsuranceModel'][j].expirydate
        this.insnumber = editObj['tcPlateInsuranceModel'][j].insnumber
      }
    }
    for (let k = 0; k < editObj['tcPlateRespTeamModel'].length; k++) {
      var isactive = editObj['tcPlateRespTeamModel'][k].isactive
      if (isactive == 1) {
        this.assignremarks = editObj['tcPlateRespTeamModel'][k].remarks
      }
    }
    this.getTCPListTrip();
  }
  AddTc19() {
    $("#AddTc19").modal("show")
    this.TCPlateInfoForm.reset()
  }
  goBack() {
    this._location.back();
  }
 
  tcplateid
  submitForm() {
    if (this.TCPlateInfoForm.valid == false) {
      $.notify('Form is invalid!', "error");
    }
    else {
      let data = this.TCPlateInfoForm.value;
      console.log(data)
      data.startdate = $("#dates").val()
      data.enddate = $("#dates2").val()
      var reqdata = {
        "form19srno": this.TCPlateInfoForm.value.form19srno, "startdate": this.TCPlateInfoForm.value.startdate, "enddate": this.TCPlateInfoForm.value.enddate, "drivername": this.TCPlateInfoForm.value.drivername,
        "fromloc": this.TCPlateInfoForm.value.fromloc, "toloc": this.TCPlateInfoForm.value.toloc, "startodo": this.TCPlateInfoForm.value.startodo, "endodo": this.TCPlateInfoForm.value.endodo, "remarks": this.TCPlateInfoForm.value.remarks, "tcplateid": this.formId
      }
      return this.ds.makeapi(this.savetcptrip, reqdata, "postjson")
        .subscribe(data => {
          if (data.status == "Success") {
            this.tcplateid = data.id
            $.notify('Form is Submitted Successfully!', "success");
            $("#AddTc19").modal("hide")
            this.getTCPListTrip()
          }
          else {
            $("#AddTc19").modal("hide")
          }
        },
          Error => {
          });
    }

  }
  TCPlistTrip
  getTCPListTrip() {
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    var userShortId = jsonData['shortid'];
    let reqdata = "tcplateid=" + this.formId 
    this.ds.makeapi(this.TCPListTripapi, reqdata, "post")
      .subscribe(data => {
        this.TCPlistTrip = data;
        console.log(data)
      },
        Error => {
        });
  }
  loading = false
  downloadExpiry() {
    this.loading = true
    var urlValue = this.appconstant + 'tcplate' + '/getExpiryDocument';
    var filename ="filename=" + this.filepathname
    this.ds.method(urlValue, filename, 'downloadfilePDFTCP')
      .subscribe(res => {
        this.loading = false
        if (window.navigator.msSaveOrOpenBlob) {
          // console.log("in IE browser");
          var fileData = [res.data];
          var blobObject = new Blob(fileData);
          // $(anchorSelector).click(function(){
          window.navigator.msSaveOrOpenBlob(blobObject, filename);
          window.navigator.msSaveOrOpenBlob(blobObject, filename);
          // window.navigator.msSaveOrOpenBlob(blobObject, filename);
          // });
        } else {
          // console.log("not IE browser");
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
        console.log(Error);
      });

  }
  downloadInsurence() {
    this.loading = true
    var urlValue = this.appconstant + 'tcplate' + '/getInsuranceDocument';
    var filename ="filename=" + this.filepathnameins
    this.ds.method(urlValue, filename, 'downloadfilePDFTCP')
      .subscribe(res => {
        this.loading = false
        if (window.navigator.msSaveOrOpenBlob) {
          // console.log("in IE browser");
          var fileData = [res.data];
          var blobObject = new Blob(fileData);
          // $(anchorSelector).click(function(){
          window.navigator.msSaveOrOpenBlob(blobObject, filename);
          window.navigator.msSaveOrOpenBlob(blobObject, filename);
          // window.navigator.msSaveOrOpenBlob(blobObject, filename);
          // });
        } else {
          // console.log("not IE browser");
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
        console.log(Error);
      });

  }

  fileName
  UploadPartmasterfinallfile
  uploadfilename = false
  uploadfile(event) {
    this.loading = true;
    if (!event) event = window.event;
    console.log(event.target);
    console.log(event.srcElement);

    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      var file: File = fileList[0];
      this.fileName = file.name;
      var finalfilename = (this.fileName).split(".");
      this.fileName = finalfilename[0];
      this.UploadPartmasterfinallfile = file;
      this.uploadfilename = true;
      this.Confirmupload();
      this.loading = false;
      // $("#uploadpackmaster").modal("show");
    }
    else {
      console.log(event.srcElement.files);
      var fileList2 = event.srcElement.files;
      var file: File = fileList2[0];
      this.fileName = file.name;
      var finalfilename = (this.fileName).split(".");
      this.fileName = finalfilename[0];
      this.UploadPartmasterfinallfile = file;
      this.Confirmupload();
    }

  }

  tcpid:any;
  Confirmupload() {
    let finalformdata: FormData = new FormData();
    finalformdata.append("filename", this.fileName);
    finalformdata.append("file", this.UploadPartmasterfinallfile);
    finalformdata.append("tcplateid", this.formId );
    this.ds.makeapi(this.uploadAPI, finalformdata, 'file')
      .subscribe(data => {
        if(data.status == 'Success'){
          this.getTCPListTrip();
          this.fileName = '';
          $.notify('Upload Successfully!', "success");
        }

        },
        Error => {
        });
  }

  // file_id;
  // form19Download() {
  //   // this.file_id = id;
  //   this.loading = true;
  //   var filename = "tcplateid=" + this.formId +'file=' + this.fileName;
  //   var SubmitData = "tcplateid=" + this.formId +'file=' + this.fileName;
  //   this.ds.makeapi(this.form19DownloadAPI , filename, "downloadfile")
  //     .subscribe(res => {
  //       if (window.navigator.msSaveOrOpenBlob) {
  //         var fileData = [res.data];
  //         var blobObject = new Blob(fileData);
  //         window.navigator.msSaveOrOpenBlob(blobObject, filename);
  //         window.navigator.msSaveOrOpenBlob(blobObject, filename);
  //         this.loading = false;
  //       } else {
  //         this.loading = false;
  //         var url = window.URL.createObjectURL(res.data);
  //         var a = document.createElement('a');
  //         document.body.appendChild(a);
  //         a.setAttribute('style', 'display: none');
  //         a.href = url;
  //         a.download = res.filename;
  //         a.click();
  //         window.URL.revokeObjectURL(url);
  //         a.remove(); // remove the element
  //       }

  //     },
  //       Error => {
  //         this.loading = false;
  //       });
  // }

  form19Download(filename) {
    this.loading = true
 
    let reqdata = "tcplateid=" + this.formId 
    this.ds.method(this.form19DownloadAPI, reqdata, 'downloadfilejsonpost')
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
        console.log(Error);
      });

  }


}
