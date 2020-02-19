import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NotifierService } from 'angular-notifier';
import { DataserviceService } from '../../dataservice.service';
declare var $;
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
@Component({
  selector: 'app-retrofitmentnew',
  templateUrl: './retrofitmentnew.component.html',
  styleUrls: ['./retrofitmentnew.component.css']
})
export class RetrofitmentnewComponent implements OnInit {

  private readonly notifier: NotifierService;
  private appconstant = this.ds.appconstant;
  fb = null;
  numbervalidation = /^[0][1-9]\d{9}$|^[1-9]\d{9}$/;
  private retroSaveAPI = this.appconstant + 'fitment/save';
  private aodrawinguploadapi = this.appconstant + 'proto/uploadAOFile';
  private drawinguploadapi = this.appconstant + 'fitment/uploadImage';
  ///forms/fitment/uploadImage
  getbcaid: any;
  form: FormGroup;
  name = new FormControl('');
  purpose = new FormControl('');
  storagetype = new FormControl('');
  singlebcaid: any;
  loading = false;
  favoriteSeason: string;
  checkOptions: string[] = ['Yes', 'No'];
  TCMSOptions: string[] = ['DS', 'DZ'];
  checkOptions2: string[] = ['OK', 'Not OK'];
  constructor(notifierService: NotifierService, fb: FormBuilder, private route: ActivatedRoute, private http: Http, private router: Router, private _location: Location, private ds: DataserviceService) {

    this.fb = fb;
    this.notifier = notifierService;
    var userDetails = localStorage.getItem("Daim-forms");
    var userJson = JSON.parse(userDetails);
    this.getbcaid = localStorage.getItem('singlebcadataid');



    var req = Validators.compose([Validators.required]);

    var num = Validators.compose([Validators.required, Validators.pattern(this.numbervalidation)]);


    // this.form = fb.group({
    //   creatorid: [userJson.shortid, req],
    //   prmasterid: [],
    //   fitmentformid: [null],
    //   // deptid: ['',req],
    //   fitmentdetails: [''],
    //   // storagetype: ['',req],
    //   vehiclemodel: ['', req],
    //   // hrid: ['',req],
    //   // Department:['',req],
    //   // approverid: ['',req],
    //   status: [, req],
    //   remarks: [, req],
    //   materials: fb.array([]),
    //   retro: fb.array([]),
    //   KTO: fb.array([]),
    //   otherissues: [''],
    //   foulingparts: [''],
    //   partqualityissues: [''],
    //   accessibilityissues: [''],
    //   preparedby: [''],
    //   checkedby: [''],
    //   isfoulingparts: [''],
    //   ispartqualityissues: [''],
    //   isaccessibilityissues: ['']
    // });


  }


  goBack() {
    this._location.back();
  }


  formId: any;
  bcaUsertype: any;
  ngOnInit() {
    var value = this.route.queryParams
      .subscribe(params => {
        //console.log(params);
      });

    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    this.bcaUsertype = jsonData['usertype'];
    var editdata = localStorage.getItem('protoformsdata');

    var editObj = JSON.parse(editdata);
    this.formId = editObj['id']
    var req = Validators.compose([Validators.required]);

    this.form = this.fb.group({
      id: [null],
      creatorid: [jsonData.shortid],
      bcamasterid: [this.getbcaid],
      fitmentdetails: ['', req],
      vehiclemodel: ['', req],
      fitmentstatus: [''],
      remarks: ['', req],
      fitmentParts: this.fb.array([]),
      fitmentObservations: this.fb.array([]),
      fitmentKTODetails: this.fb.array([]),
      otherissues: [''],
      foulingparts: [''],
      partqualityissues: [''],
      accessibilityissues: [''],
      preparedby: ['', req],
      checkedby: ['', req],
      isfoulingparts: [''],
      ispartqualityissues: [''],
      isaccessibilityissues: [''],
      isbcalogin: [],
      aodrawingtext: [editObj.aodrawingtext, req]

    });
    this.form.patchValue(editObj);
    var retroParts = editObj['umcsParts'];
    if (retroParts) {
      for (var i = 0; i < retroParts.length; i++) {
        var retroObj = retroParts[i];
        var retroObj1 = retroParts[i];
        this.addretro(retroObj);
        this.addkto(retroObj1);
      }
    }


    this.addnewRow()

  }


  // partdetails add row fitmentParts
  get rowForms() {
    return this.form.get('fitmentParts') as FormArray;

  }
  addrow1=0
  addRow() {
    this.addrow1++
    var req = Validators.compose([Validators.required]);

    const row1 = this.fb.group({
      ascorderview: [this.addrow1],
      partnumber: [''],
      description: [''],
      quantity: [''],
      zgsnwc: [''],
      actualzgs: [''],
      remarks: [''],
      ds: [null],
      dz: [null],
    });

    this.rowForms.push(row1);
  }
  deleteRow(j) {
    this.rowForms.removeAt(j);
  }
  get rowForms1() {
    return this.form.get('fitmentParts') as FormArray;

  }
  addretro(data) {
    this.addrow1++
    var req = Validators.compose([Validators.required]);
    const row1 = this.fb.group({
      ascorderview: [this.addrow1],
      partnumber: [data['partnumber']],
      description: [data['description']],
      quantity: [data['quantity']],
      zgsnwc: [data['zgsnwc']],
      actualzgs: [''],
      remarks: [''],
      ds: [null],
      dz: [null],
    });

    this.rowForms1.push(row1);
  }
    // Observation row
  get retroForms() {
    return this.form.get('fitmentObservations') as FormArray;

  }
  addrow3=0
  addnewRow() {
    this.addrow3++
    var req = Validators.compose([Validators.required]);

    const row1 = this.fb.group({
      ascorderview: [this.addrow3],
      parameters: [''],
      dimensionsdrawing: [''],
      ds: [null],
      dz: [null],
      actualobservtions: [''],
      remarks: [''],

    });

    this.retroForms.push(row1);
  }

  // KTO details row

  get retroForms1() {
    return this.form.get('fitmentKTODetails') as FormArray;
  }
  addkto(data) {
    this.addrow2++
    var req = Validators.compose([Validators.required]);

    const row1 = this.fb.group({
      ascorderview: [this.addrow2],
      partnumber: [data['partnumber']],
      description: [data['description']],
      quantity: [data['quantity']],
      drawingtorqueval: [''],
      actualtorqueval: [''],
      ds: [null],
      dz: [null],
      altpartno: [''],

    });

    this.retroForms1.push(row1);
  }

  // Observation row

  get KTOForms() {
    return this.form.get('fitmentKTODetails') as FormArray;

  }
  addrow2=0
  addkto1() {
    this.addrow2++
    var req = Validators.compose([Validators.required]);

    const datas = this.fb.group({
      ascorderview: [this.addrow2],
      partnumber: [''],
      description: [''],
      quantity: [''],
      drawingtorqueval: [''],
      actualtorqueval: [''],
      ds: [null],
      dz: [null],
      altpartno: [''],
    });

    this.KTOForms.push(datas);
  }
  deleteKTORow(i){
    this.KTOForms.removeAt(i);
  }
  deletenewRow(i) {
    this.retroForms.removeAt(i);
  }
 

  foulingpart: any;
  foulingpartsvalue;
  foulingparts(value) {
    this.foulingpart = value
    if (this.foulingpart == 'Yes') {
      this.foulingpartsvalue = 1;
    }
    else if (this.foulingpart == 'No') {
      this.foulingpartsvalue = 0;
    }
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
  isfoulingparts: any;
  dsvalue;
  saveRetro() {
    let reqdata = "";
    let url = this.retroSaveAPI;
    let data = this.form.value;

    // isfoulingparts value

    if (this.form.value.isfoulingparts == "Yes") {
      this.form.value.isfoulingparts = 1;
    }
    else if (this.form.value.isfoulingparts == "No" || this.form.value.isfoulingparts == null) {
      this.form.value.isfoulingparts = 0;
    }

    // ispartqualityissue value

    if (this.form.value.ispartqualityissues == "Yes") {
      this.form.value.ispartqualityissues = 1;
    }
    else if (this.form.value.ispartqualityissues == "No" || this.form.value.ispartqualityissues == null) {
      this.form.value.ispartqualityissues = 0;
    }

    // isaccessibilityissues value

    if (this.form.value.isaccessibilityissues == "Yes") {
      this.form.value.isaccessibilityissues = 1;
    }
    else if (this.form.value.isaccessibilityissues == "No" || this.form.value.isaccessibilityissues == null) {
      this.form.value.isaccessibilityissues = 0;
    }

    // KTO ds and dz value

    data = this.KTOArrayFormat(data);

    // materials ds and dz value

    data = this.materialArrayFormat(data);

    // retro ds and dz value

    data = this.retroArrayFormat(data);

    // to set the bcalogin values

    if (this.bcaUsertype == "mdtbca" || this.bcaUsertype == "hdtbca" || this.bcaUsertype == "aggregatebca"
      || this.bcaUsertype == "mechanicalbca" || this.bcaUsertype == "eandebca" || this.bcaUsertype == "ppsbca" || this.bcaUsertype == "maintenancebca") {
      data.isbcalogin = 1;
    }
    else if (this.bcaUsertype == "hdtsupervisor" || this.bcaUsertype == "mdtsupervisor" || this.bcaUsertype == "aggregatesupervisor"
      || this.bcaUsertype == "eandesupervisor" || this.bcaUsertype == "ppssupervisor" || this.bcaUsertype == "maintenancesupervisor" || this.bcaUsertype == "mechanicalsupervisor") {
      data.isbcalogin = 0;
    }

    reqdata = JSON.stringify(data);
    console.log(reqdata);
    return this.postRequest(url, reqdata);
  }

  retroArrayFormat(data: any) {
    for (var k = 0; k < data.fitmentObservations.length; k++) {
      if (data.fitmentObservations[k].ds == true) {
        data.fitmentObservations[k].ds = 1;
      }
      else {
        data.fitmentObservations[k].ds = 0;
      }
      if (data.fitmentObservations[k].dz == true) {
        data.fitmentObservations[k].dz = 1;
      }
      else {
        data.fitmentObservations[k].dz = 0;
      }
    }
    return data
  }

  materialArrayFormat(data: any) {
    var fitmentParts = data.fitmentParts;
    for (var j = 0; j < fitmentParts.length; j++) {
      if (fitmentParts[j].ds == true) {
        fitmentParts[j].ds = 1;
      }
      else {
        fitmentParts[j].ds = 0;
      }
      if (fitmentParts[j].dz == true) {
        fitmentParts[j].dz = 1;
      }
      else {
        fitmentParts[j].dz = 0;
      }
    }
    return data;
  }

  KTOArrayFormat(data: any) {
    var fitmentKTODetails = data.fitmentKTODetails;
    for (var i = 0; i < fitmentKTODetails.length; i++) {
      if (fitmentKTODetails[i].ds == true) {
        fitmentKTODetails[i].ds = "1";
      }
      else {
        fitmentKTODetails[i].ds = "0";
      }
      if (fitmentKTODetails[i].dz == true) {
        fitmentKTODetails[i].dz = "1";
      }
      else {
        fitmentKTODetails[i].dz = "0";
      }
    }
    return data;
  }


  submitForm() {
    $('#confirmSubmit').modal('show');
  }

  
  
  saveFormData() {
    if ((this.form.invalid) || (this.form.value.fitmentstatus == "") || (this.form.value.isfoulingparts == "") || (this.form.value.ispartqualityissues == "")
      || (this.form.value.isaccessibilityissues == "")) {
      $.notify('Form is Invalid', "error");
      $('#confirmSubmit').modal('hide');
      this.loading = false;
    }
    else {
      this.loading = true;
      this.saveRetro().subscribe(data => {
        if (data.status === "Success") {
          this.loading = false;
          var submitData = "id=" + this.getbcaid + "&status=fitmentcreated" + "&usertype=''"
          var urlValue = this.appconstant + 'proto/bca/updateBCAStatus';
          this.ds.makeapi(urlValue, submitData, 'post')
            .subscribe(data2 => {
              this.loading = false;
              if (data2.status == 'Success') {
                this.MultipleFileUpload(data.id);
                this.ds.notify('RetroFitment Form Submitted successfully !!', "success");
                $('#confirmSubmit').modal('hide');
                this.form.reset();
                if (this.bcaUsertype == "mdtbca" || this.bcaUsertype == "hdtbca" || this.bcaUsertype == "aggregatebca"
                  || this.bcaUsertype == "mechanicalbca" || this.bcaUsertype == "eandebca" || this.bcaUsertype == "ppsbca" || this.bcaUsertype == "maintenancebca") {
                  this.router.navigate(['/protobca'], {});
                }
                else if (this.bcaUsertype == "hdtsupervisor" || this.bcaUsertype == "mdtsupervisor" || this.bcaUsertype == "aggregatesupervisor"
                  || this.bcaUsertype == "eandesupervisor" || this.bcaUsertype == "ppssupervisor" || this.bcaUsertype == "maintenancesupervisor" || this.bcaUsertype == "mechanicalsupervisor") {
                  this.router.navigate(['/protosupervisor'], {});
                }

              }

            },
              Error => {
                this.loading = false;
              });

        } else {
          $.notify('Form Submition Failed!', "error");
          $('#confirmSubmit').modal('hide');
          this.loading = false;
        }
        Error => {
          this.loading = false;
          console.log(Error);
        };
      })
    }
  }



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
        if(this.fileUploadArr.length < 3){
          this.fileUploadArr.push({ "filename": file.name, "file": file, "fileformat": this.fileformat });
        } 
        this.Uploadaodrawfile = file;[]
        this.AodrawFileUpload = "";
      }
      setTimeout(() => {
        this.loading = false;
      }, 4000)

    }
  }

  MultipleFileUpload(formid) {

    var formArray = [];
    var promisesArray = [];
    for (var i = 0; i < this.fileUploadArr.length; i++) {
      var fileUploadObj = this.fileUploadArr[i];
      console.log(fileUploadObj)
  
        let finalformdata: FormData = new FormData();
        finalformdata.append("formid", (formid));
        finalformdata.append("filename", (fileUploadObj.filename));
        finalformdata.append("file", (fileUploadObj.file));
        finalformdata.append("fileformat", (fileUploadObj.fileformat));
        formArray.push(finalformdata);
        promisesArray.push(this.saveUploadFile(finalformdata));
      
    }

    console.log(formArray);
    Promise.all(promisesArray).then((result) => {
      console.log(result);
    })

  }

  private saveUploadFile(finalformdata) {

    return new Promise((resolve, reject) => {
      console.log(finalformdata);
      this.ds.postFile(this.drawinguploadapi, finalformdata)
        .subscribe(aodrawupload => {

          if (aodrawupload.status == 'Success') {
            this.fileName = ';';
            resolve('Success');
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
deleteImg(index){
  var elem = document.getElementById('upload'+index);
    elem.parentNode.removeChild(elem);
    console.log(this.fileUploadArr);
    var tmpArr = [];
    this.fileUploadArr.map(function(item,i){
      if(index != i){
        tmpArr.push(item);
      }
    });
    this.fileUploadArr = tmpArr
    return false;
}

  // uploadAOImgFiles() {
  //   var formArray = [];
  //   var promisesArray = [];
  //   for (var i = 0; i < this.imgAOUploadFiles.length; i++) {
  //     var fileUploadObj = this.imgAOUploadFiles[i];
  //     console.log(fileUploadObj)
  //     let finalformdata: FormData = new FormData();
  //     finalformdata.append("formid", (this.form.value.id));
  //     finalformdata.append("filename", (fileUploadObj.filename));
  //     finalformdata.append("file", (fileUploadObj.file));
  //     finalformdata.append("fileformat", (fileUploadObj.fileformat));
  //     formArray.push(finalformdata);
  //     // this.saveUploadFile(finalformdata);
  //     promisesArray.push(this.saveUploadFile(finalformdata, this.aodrawinguploadapi))
  //   }

  //   console.log(formArray);
  //   Promise.all(promisesArray).then((result) => {
  //     console.log(result);

  //     console.log("AO Files Uploaded!");
  //     this.saveFormData()
  //   })
  // }

  // uploadImgFiles(form_id) {
  //   var formArray = [];
  //   var promisesArray = [];
  //   for (var i = 0; i < this.imgUploadFiles.length; i++) {
  //     var fileUploadObj = this.imgUploadFiles[i];
  //     //console.log(fileUploadObj)
  //     let finalformdata: FormData = new FormData();
  //     finalformdata.append("formid", (form_id));
  //     finalformdata.append("filename", (fileUploadObj.filename));
  //     finalformdata.append("file", (fileUploadObj.file));
  //     finalformdata.append("fileformat", (fileUploadObj.fileformat));
  //     formArray.push(finalformdata);
  //     // this.saveUploadFile(finalformdata);
  //     promisesArray.push(this.saveUploadFile(finalformdata, this.drawinguploadapi))
  //   }

  //   //console.log(formArray);
  //   Promise.all(promisesArray).then((result) => {
  //     console.log(result);
  //     console.log("Files Uploaded!");
  //     // this.uploadAOImgFiles();
  //   })
  // }

  // submitForm() {
  //   this.router.navigate(['/protobca'], {});
  //   //console.log(this.form.value);
  //   //Fitment Photograph upload
  //   //AO drawing upload
  //   if (this.form.valid || false) {
  //     this.loading = true;


  //   }


  // }

  // fileName;
  // UploadPartmasterfinallfile;
  // UploadPartmastererrorFileUpload;
  // uploadfile(event) {
  //   let fileList: FileList = event.target.files;
  //   if (fileList.length > 0) {
  //     var file: File = fileList[0];
  //     this.fileName = file.name;
  //     var finalfilename = (this.fileName).split(".");
  //     this.fileName = finalfilename[0];
  //     this.UploadPartmasterfinallfile = file;
  //     this.UploadPartmastererrorFileUpload = "";
  //     // $("#uploadpackmaster").modal("show");
  //   }

  // }

  // imgUploadFiles = [];
  // imgAOUploadFiles = [];
  // imgNames = '';
  // imgAONames = '';
  // uploadPhotofiles(event) {
  //   let fileList: FileList = event.target.files;

  //   if (fileList.length > 0) {
  //     // this.imgUploadFiles = fileList
  //     for (var i = 0; i < fileList.length; i++) {
  //       this.imgUploadFiles.push(fileList[i]);
  //       if (i != 0) {
  //         this.imgNames = this.imgNames + ',' + fileList[i]['name'];
  //       } else {
  //         this.imgNames = fileList[i]['name'];
  //       }

  //     }

  //   }
  // }

  // uploadAOPhotofiles(event) {
  //   let fileList: FileList = event.target.files;

  //   if (fileList.length > 0) {
  //     // this.imgUploadFiles = fileList
  //     for (var i = 0; i < fileList.length; i++) {
  //       this.imgAOUploadFiles.push(fileList[i]);
  //       if (i != 0) {
  //         this.imgAONames = this.imgAONames + ',' + fileList[i]['name'];
  //       } else {
  //         this.imgAONames = fileList[i]['name'];
  //       }

  //     }

  //   }
  // }




  //   fileUploadArr;
  // saveUploadFile(finalformdata, uploadUrl) {

  //     return new Promise((resolve, reject) => {
  //       //console.log(finalformdata);
  //       this.ds.postFile(uploadUrl, finalformdata)
  //         .subscribe(aodrawupload => {
  //           // this.loading = false;
  //           if (aodrawupload.status == 'success') {

  //             this.fileName = ';';
  //             resolve('success');
  //             // this.ds.notify('All AO Drawing File Uploaded successfully !!', "success");

  //           }
  //           else {
  //             $.notify('File not Uploaded !!', "error");
  //             this.loading = false;
  //           }
  //           Error => {
  //             reject('Failed!')
  //             // this.loading = false;
  //           };
  //         });
  //     })
  // }

  addproto() {
    this.router.navigate(['dashboard/protonew'], {});
  }

}