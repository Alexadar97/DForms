import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute } from '@angular/router';
import { DataserviceService } from '../../dataservice.service';

declare var $;
@Component({
  selector: 'app-umcs-recall',
  templateUrl: './umcs-recall.component.html',
  styleUrls: ['./umcs-recall.component.css']
})
export class UmcsRecallComponent implements OnInit {

  private readonly notifier: NotifierService;
  form: FormGroup;

  // private appconstant = 'http://13.234.64.82:8080/DaimForms/forms/';
  private appconstant = this.ds.appconstant;
  numbervalidation = /^[0][1-9]\d{9}$|^[1-9]\d{9}$/;

  private savemcs = this.appconstant + 'umcs/save';
  // private listdept = this.appconstant + 'dept/list';
  // private listusers = this.appconstant + 'user/list';
  private uploadPdf = this.appconstant + 'umcs/uploadPdf';


  isStoreLogin = false;
  deptList = []
  userList = []

  l2Users = [];
  l3Users = [];
  l4Users = [];
  loading = false;


  constructor(notifierService: NotifierService, private route: ActivatedRoute, private _location: Location, private router: Router, private fb: FormBuilder, private http: Http, private ds: DataserviceService) {
    this.fb = fb;
    this.notifier = notifierService;

    var userDetails = localStorage.getItem("Daim-forms");
    var userJson = JSON.parse(userDetails);

    var req = Validators.compose([Validators.required]);
    // var length = Validators.compose([Validators.required]);

    var num = Validators.compose([Validators.required, Validators.pattern(this.numbervalidation)]);

    this.form = fb.group({
      creditorid: [userJson.shortid],
      contactno: [null, num],
      id: [this.form_id],
      storagePurpose: [null, req],
      storagePeriod: [null, req],
      hrid: [null, req],
      filepath: [''],
      umcsParts: fb.array([])
      // approverid:[null,req],

      // status: ['test', req],


    });

  }

  prmasteridvalue;
  ngOnInit() {
    var value = this.route.queryParams
      .subscribe(params => {
        this.setToken(params.id);
      });
    // var value = this.route.queryParams
    //   .subscribe(params => {
    //     if (params.id != null) {
    //       this.fetchProtoFormDetails(params.id);

    //     }
    //     else {
    //       this.addRow();
    //     }
    //   });

    // this.dataservice.makeapi().subscribe()

    // this.ds.makeapi(this.listdept, '', "post")
    //     .subscribe(data => {
    //      this.deptList = data;
    //     },
    //       Error => {
    //       });

    // var usertype = "usertype=L4"
    // this.ds.makeapi(this.listusers,usertype,"post")
    // .subscribe(data => {

    //   this.l4Users = data;

    //  },
    //    Error => {
    //    });

    //    usertype = "usertype=L3"
    // this.ds.makeapi(this.listusers,usertype,"post")
    // .subscribe(data => {
    //   this.l3Users = data;
    //  },
    //    Error => {
    //    });

    //    usertype = "usertype=L2"
    // this.ds.makeapi(this.listusers,usertype,"post")
    // .subscribe(data => {
    //   this.l2Users = data;
    //  },
    //    Error => {
    //    });
  }

  fileName;
  pdfFileName;
  pdfFile;
  UploadPartmastererrorFileUpload: any;
  UploadPartmasterfinallfile: any;
  uploadedFile: any;
  checkedfilename = false;
  uploadfile(event) {
    this.checkedfilename = true;
    if (!event) event = window.event;
    console.log(event.target);
    console.log(event.srcElement);

    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      var file: File = fileList[0];
      this.fileName = file.name;
      var finalfilename = (this.fileName).split(".");
      this.fileName = finalfilename[0];
      this.uploadedFile = file;

      // $("#uploadpackmaster").modal("show");
    }
    else {
      console.log(event.srcElement.files);
      var fileList2 = event.srcElement.files;
      var file: File = fileList2[0];
      this.fileName = file.name;
      var finalfilename = (this.fileName).split(".");
      this.fileName = finalfilename[0];
      this.uploadedFile = file;
    }
  }



  get rowForms() {
    return this.form.get('umcsParts') as FormArray;

  }
  get getprotoForms() {
    return this.form.get('umcsParts') as FormArray;

  }
  addrow=0
  addRow() {
    this.addrow++
    var req = Validators.compose([Validators.required]);
    const row = this.fb.group({
      ascorderview: [this.addrow],
      partnumber: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])],
      quantity: ['', Validators.compose([Validators.required])],
      vehicleno: ['', Validators.compose([Validators.required])],
      // partnumber: ['',req],
      // description: ['',req],
      // vehicleno: ['', Validators.compose([Validators.required])],
      // quantity: ['',req],
    });

    this.rowForms.push(row);
  }
  showRow(data) {
    this.addrow++
    const getprotorow = this.fb.group({
      ascorderview: [this.addrow],
      partnumber: [data['partnumber']],
      description: [data['description']],
      quantity: [data['quantity']],
      vehicleno: ['', Validators.compose([Validators.required])],
    });


    this.getprotoForms.push(getprotorow);
  }
  deleteRow(i) {
    this.rowForms.removeAt(i);
  }
  goBack() {
    // this._location.back();
    this.router.navigate(['dashboard/umcslist'], {});
  }
  keyAlpha(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  saveData() {

    let reqdata = "usertype=1";
    let url = this.savemcs;
    let data = this.form.value;


    data['deptid'] = parseInt(data['deptid']);

    reqdata = JSON.stringify(data);

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
  submitForm(){
    $('#confirmSubmit').modal('show');
}
confirmSubmit() {
    if (this.fileName == undefined) {
      $.notify('Scrap Note is required!!', "error");
      $('#confirmSubmit').modal('hide');
    }
    
    else if (this.form.valid) {
      this.loading = true;
      let url = this.savemcs;
      let data = this.form.value;
      data.prmasterid = this.formid;
      data.filepath = this.fileName;
      console.log(data);


      var reqdata = JSON.stringify(data);
      this.ds.makeapi(url, reqdata, 'postjson')
        .subscribe(data => {
          console.log("FORM DATA");
          console.log(data);

          if (data.status == 'Success') {
            var form_id = data.id;


            let finalformdata: FormData = new FormData();
            finalformdata.append("formid", (form_id));
            finalformdata.append("filename", (this.fileName));
            finalformdata.append("file", (this.uploadedFile));
            // var url = this.ds.appconstant + "nmcs/uploadFile";

            this.ds.postFile(this.uploadPdf, finalformdata)
              .subscribe(
                uploaddata => {
                  this.loading = false;
                  console.log("UPLOADED DATA");
                  console.log(uploaddata);
                  if (uploaddata.status == 'success') {
                    if (this.formid > 0) {
                      var submitData = "prmasterid=" + this.formid;
                      var urlValue = this.appconstant + 'proto/updateUmcsStatus';
                      this.ds.makeapi(urlValue, submitData, 'post')
                        .subscribe(data2 => {


                        })
                    }

                    $('#uploadpackmaster').modal("hide");
                    // this.fileName.nativeElement.value = "";
                    // this.UploadPartmasterfilename = ""
                    // this.ds.notify('Form Submitted successfully !!', "success");
                    $.notify('UMCS Form Submitted successfully !!', "success ");
                    $('#confirmSubmit').modal('hide');
                    // this.getdata.showNotification('bottom', 'right', 'File Uploaded successfully !!', "success");
                    // this.getpartlist();
                    this.form.reset();
                    this.fileName = ';'
                    this.router.navigate(['dashboard/umcslist'], {});
                  }

                  else {
                    $('#uploadpackmaster').modal("hide");
                    // this.fileName.nativeElement.value = "";
                    // this.UploadPartmasterfilename = ""
                    // this.ds.notify('File not Uploaded !!', "error");
                    $.notify('File not Uploaded !!', "error");
                    $('#confirmSubmit').modal('hide');
                    // this.getdata.showNotification('bottom', 'right', + data.field + '!!', "danger");
                  }
                },
                Error => {
                  //console.log(Error);
                  this.loading = false;
                  $('#uploadpackmaster').modal("hide");
                  $('#confirmSubmit').modal('hide');
                  // this.fileName.nativeElement.value = "";
                  // this.UploadPartmasterfilename = ""
                  // this.ds.notify('Something went wrong,try again later!', "error");
                  $.notify('Something went wrong,try again later!', "error");
                  // this.getdata.showNotification('bottom', 'right', 'Something went wrong,try again later !!', "danger");


                })




          }

          else if (data.status == 'Failure') {
            this.loading = false;
            $.notify('Server error, Please try again!', "error");
            $('#confirmSubmit').modal('hide');
          }
          else {
            $.notify('Form Submition Failed!', "error");
            $('#confirmSubmit').modal('hide');
          }
        },
          Error => {
            console.log(Error);
          });
    }
    else {
      // this.ds.notify('Form is Invalid!', "error");
      $.notify('Form Invalid!', "error");
      $('#confirmSubmit').modal('hide');
      this.loading = false;
      console.log("FORM INVALID");
    }

  }
  periodstorage(event) {
    console.log(event)
  }
  umcsPartsArray = []
  formType;
  formid;
  protoStored: any;
  fetchProtoFormDetails(formid) {
    var urlValue = this.appconstant + 'proto/get';
    var submitData = "formid=" + formid;
    // var urlValue = this.appconstant + formtype + '/get/' + formid;
    this.ds.makeapi(urlValue,submitData, 'post')
      .subscribe(data2 => {
        var patchValue = data2;
        this.formid = data2['id']
        patchValue.storagePurpose = data2.storagePurpose + "/" + data2.projectname;
        console.log(patchValue.storagePurpose)

        // this.form.patchValue(patchValue);
        var userDetails = localStorage.getItem("Daim-forms");
        var userJson = JSON.parse(userDetails);

        var req = Validators.compose([Validators.required]);
        // var length = Validators.compose([Validators.required]);

        var num = Validators.compose([Validators.required, Validators.pattern(this.numbervalidation)]);
        this.form = this.fb.group({
          prmasterid: [null],
          id: [null],
          contactno: [data2.contactno],
          storagePurpose: [patchValue.storagePurpose],
          creditorid: [userJson.shortid],
          storagePeriod: [null, req],
          hrid: [null, req],
          filepath: [''],
          umcsParts: this.fb.array([])

        });
        console.log(patchValue)
        var umcsParts = data2['umcsParts'];
        this.umcsPartsArray = umcsParts;

        for (var i = 0; i < umcsParts.length; i++) {
          var umvsObj = umcsParts[i];
          this.protoStored = umcsParts[i];
          if (umvsObj.scraporstored == "Stored") {
            var pushvalue = umvsObj
            this.showRow(pushvalue);
          }

        }

      }, Error => {

      });

  }

  nospace(event: any) {
    const pattern = /^\S*$/
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  upload() {
    this.router.navigate(['dashboard/umcsupload'], {
      queryParams: { type: 'umcs' }
    });
  }
  addsto() {
    this.router.navigate(['dashboard/umcsnew'], {});
  }
  umcslists() {
    this.router.navigate(['dashboard/umcslist'], {});
  }

  stoObj = {};
  stoPartsArr = [];
  form_id: any;
  fetchFormDetails(formid) {
    var urlValue = this.appconstant + 'umcs/get';
    var submitData = "formid=" + formid;
    this.ds.makeapi(urlValue, submitData,'post')
      .subscribe(data2 => {
        //show information in screen.
        //show approval and reject
        console.log(data2)
        var patchValue = data2;
        this.form_id = data2['id'];
        // this.status = data2['status'];
        this.fileName = patchValue.filepath;
        console.log(this.fileName)
        this.form.reset();
        this.form.patchValue(patchValue);


        var stoParts = data2['umcsParts'];
        this.stoObj = {};
        this.stoPartsArr = stoParts;
        for (var i = 0; i < stoParts.length; i++) {
          this.stoObj[i] = stoParts[i];

        }


        var vKeys = Object.keys(this.stoObj);
        for (var vk of vKeys) {
          var vendors = this.stoObj[vk];
          console.log(vendors)
          this.addRow1(vendors);
        }
        Error => {

        };
      })
  }

  formId: any;
  setToken(formId) {
    this.formId = formId;
    this.fetchFormDetails(this.formId);
  }
  addRow1(data) {
    this.addrow++
    const getrow = this.fb.group({
      id: [data['id']],
      ascorderview: [this.addrow],
      partnumber: [data['partnumber']],
      description: [data['description']],
      quantity: [data['quantity']],
      vehicleno: [data['vehicleno']],
    });


    this.getRowumcsForms.push(getrow);
  }

  get getRowumcsForms() {
    return this.form.get('umcsParts') as FormArray;

  }
}
