import { Component, OnInit } from '@angular/core';
import { DataserviceService } from '../../dataservice.service';

import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Location } from '@angular/common';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router'
import { NotifierService } from 'angular-notifier';

declare var $;

@Component({
  selector: 'app-ucmsupload',
  templateUrl: './ucmsupload.component.html',
  styleUrls: ['./ucmsupload.component.css']
})
export class UcmsuploadComponent implements OnInit {

  private readonly notifier: NotifierService;
  form: FormGroup;

  // private appconstant = 'http://13.234.64.82:8080/DaimForms/forms/';
  private appconstant = this.ds.appconstant;
  numbervalidation = /^[0][1-9]\d{9}$|^[1-9]\d{9}$/;

  private saveumcs = this.appconstant + 'umcs/saveDummyForm';
  private uploadumcs = this.appconstant + 'umcs/uploadFile';

  private listdept = this.appconstant + 'dept/list';
  private listusers = this.appconstant + 'user/list';
  private uploadPdf = this.ds.appconstant + 'umcs/uploadPdfDummy';

  isStoreLogin = false;
  deptList = []
  userList = []

  l2Users = [];
  l3Users = [];
  l4Users = [];
  loading = false;


  constructor(notifierService: NotifierService, private _location: Location, private router: Router, private fb: FormBuilder, private http: Http, private ds: DataserviceService) {
    this.fb = fb;
    this.notifier = notifierService;

    var userDetails = localStorage.getItem("Daim-forms");
    var userJson = JSON.parse(userDetails);

    var req = Validators.compose([Validators.required]);

    var num = Validators.compose([Validators.required, Validators.pattern(this.numbervalidation)]);

    this.form = fb.group({
      creditorid: [userJson.shortid, req],
      contactno: ['', num],
      storagePeriod: ['', req],
      storagePurpose: ['', req],
      hrid: [null, req],
      pdfupload: [null],
      fileupload: [null]
    });
  }


  ngOnInit() {
    // this.addRow();

    // this.dataservice.makeapi().subscribe()

    this.ds.makeapi(this.listdept, '', "post")
      .subscribe(data => {

        this.deptList = data;
      },
        Error => {
        });

    var usertype = "usertype=L4"
    this.ds.makeapi(this.listusers, usertype, "post")
      .subscribe(data => {

        this.l4Users = data;
        // this.deptList = data;
      },
        Error => {
        });

    usertype = "usertype=L3"
    this.ds.makeapi(this.listusers, usertype, "post")
      .subscribe(data => {

        this.l3Users = data;
        // this.deptList = data;
      },
        Error => {
        });

    usertype = "usertype=L2"
    this.ds.makeapi(this.listusers, usertype, "post")
      .subscribe(data => {

        this.l2Users = data;
        // this.deptList = data;
      },
        Error => {
        });
  }


  fileName1;
  UploadPartmasterfinallfile1;
  UploadPartmastererrorFileUpload1;

  uploadfile1(event) {
    if (!event) event = window.event;
    let fileList1: FileList = event.target.files;
    if (fileList1.length > 0) {
      var file1: File = fileList1[0];
      this.fileName1 = file1.name;
      var finalfilename1 = (this.fileName1).split(".");
      this.fileName1 = finalfilename1[0];
      this.UploadPartmasterfinallfile1 = file1;
      // this.UploadPartmastererrorFileUpload1 = "";
      // $("#uploadpackmaster").modal("show");
    }
    else {
      var fileList4 = event.srcElement.files;
      var file1: File = fileList4[0];
      this.fileName1 = file1.name;
      var finalfilename1 = (this.fileName1).split(".");
      this.fileName1 = finalfilename1[0];
      this.UploadPartmasterfinallfile1 = file1;
      // this.UploadPartmastererrorFileUpload1 = "";
      // $("#uploadpackmaster").modal("show");
    }
  }
  fileName2;
  UploadPartmasterfinallfile2;
  UploadPartmastererrorFileUpload2;

  uploadfile2(event) {
    if (!event) event = window.event;
    let fileList2: FileList = event.target.files;
    if (fileList2.length > 0) {
      var file2: File = fileList2[0];
      this.fileName2 = file2.name;
      var finalfilename2 = (this.fileName2).split(".");
      this.fileName2 = finalfilename2[0];
      this.UploadPartmasterfinallfile2 = file2;
      // this.UploadPartmastererrorFileUpload2 = "";
      // $("#uploadpackmaster").modal("show");
    }
    else {
      var fileList3 = event.srcElement.files;
      var file2: File = fileList3[0];
      this.fileName2 = file2.name;
      var finalfilename2 = (this.fileName2).split(".");
      this.fileName2 = finalfilename2[0];
      this.UploadPartmasterfinallfile2 = file2;
      // this.UploadPartmastererrorFileUpload2 = "";
    }

  }


  goBack() {
    this._location.back();
  }

  cancel() {
    $("#uploadpackmaster").modal("hide");
  }

  submitForm(){
    $('#confirmSubmit').modal('show');
}
  
  confirmSubmit() {


    if (this.fileName2 == undefined) {
      $.notify('Scrap Note is required !!', "error");
      $('#confirmSubmit').modal('hide');
      // $.notify('Please select a file to upload partlist!!', "error");
    }
    // else if(this.fileName1 == undefined){
    //   $.notify('Please select a file to upload partlist!!', "error");
    // }
    else if (this.form.valid) {
      this.loading = true;
      let finalformdata1: FormData = new FormData();
      let finalformdata2: FormData = new FormData();

      finalformdata1.append("filename", (this.fileName1));
      finalformdata1.append("file", (this.UploadPartmasterfinallfile1));
      finalformdata2.append("filename", (this.fileName2));
      finalformdata2.append("file", (this.UploadPartmasterfinallfile2));
      var validateUrl = this.ds.appconstant + "umcs/validateFile";
      if (this.fileName1 == undefined) {
        $.notify('Please select a file to upload partlist!!', "error");
        $('#confirmSubmit').modal('hide');
      }
      this.ds.postFile(validateUrl, finalformdata1)
        .subscribe(validationdata => {

          if (validationdata.status == 'success') {

            let url = this.saveumcs;
            let data = this.form.value;
            data.pdfupload = this.fileName2;
            data.fileupload = this.fileName1;
            console.log(data);
            var reqdata = JSON.stringify(data);
            
            this.ds.makeapi(url, reqdata, 'postjson')
              .subscribe(
                data => {
                  if (data.status == 'Success') {

                    var form_id = data.id;

                    finalformdata1.append("formid", (form_id));
                    this.ds.postFile(this.uploadumcs, finalformdata1)

                      .subscribe(
                        uploaddata => {
                          if (uploaddata.status == 'success') {

                            $('#uploadpackmaster').modal("hide");
                            $('#confirmSubmit').modal('hide');
                            $.notify('File uploaded successfully !!', "success");
                            // this.ds.notify('Form Uploaded successfully !!', "success");
                            this.form.reset();
                            this.fileName1 = '';
                            // this.router.navigateByUrl('dashboard/umcslist');
                            this.loading = false;

                            this.getUploadPreview(form_id);

                          }
                          else {
                            $('#uploadpackmaster').modal("hide");
                            $('#confirmSubmit').modal('hide');
                            $.notify('File not Uploaded !!', "error");
                            // this.ds.notify('File not Uploaded !!', "error");

                          }

                        },
                        Error => {

                          this.loading = false;
                          $('#uploadpackmaster').modal("hide");
                          $('#confirmSubmit').modal('hide');
                          // this.ds.notify('Something went wrong,try again later!', "error");
                          $.notify('Something went wrong,try again later!', "error");

                        });

                  }
                  if (data.status == 'Success') {
                    var form_id = data.id;
                    finalformdata2.append("dummyformid", (form_id));
                    this.ds.postFile(this.uploadPdf, finalformdata2)

                      .subscribe(
                        uploaddata => {
                          if (uploaddata.status == 'success') {

                            $('#uploadpackmaster').modal("hide");
                            $('#confirmSubmit').modal('hide');
                            // this.ds.notify('Form is added successfully !!', "success");
                            this.form.reset();
                            this.fileName1 = '';
                            // this.router.navigateByUrl('dashboard/umcslist');
                            this.loading = false;

                            this.getUploadPreview(form_id);


                          }
                          else {
                            $('#uploadpackmaster').modal("hide");
                            $('#confirmSubmit').modal('hide');
                            this.ds.notify('PDF not Uploaded !!', "error");

                          }
                        },

                        Error => {
                          this.loading = false;
                          $('#uploadpackmaster').modal("hide");
                          $('#confirmSubmit').modal('hide');
                          this.ds.notify('Something went wrong,try again later!', "error");

                        });
                  }
                },
                Error => {

                });


          }
          else {
            // if (validationdata.field == 'File is Empty') {
            //   this.ds.notify('File is empty!', "error");
            this.ds.notify(validationdata.field+' '+'!', "error");
              this.loading = false;
              $('#confirmSubmit').modal('hide');
            // }
            // else if (validationdata.field == 'Part number is empty') {
            //   this.ds.notify('Part number is empty!', "error");
            //   this.loading = false;

            // }
            // else if (validationdata.field == 'Description is empty') {
            //   this.ds.notify('Description is empty!', "error");
            //   this.loading = false;

            // } else if (validationdata.field == 'Vehicle Number is empty') {
            //   this.ds.notify('Vehicle Number is empty!', "error");
            //   this.loading = false;

            // } else if (validationdata.field == 'Quantity is empty') {
            //   this.ds.notify('Quantity is empty!', "error");
            //   this.loading = false;

            // } else if (validationdata.field == 'Part Number should be 8 / 10 / 12 / 15 characters') {
            //   this.ds.notify('Part Number should be 8 / 10 / 12 / 15 characters!', "error");
            //   this.loading = false;
            // } else {
            //   this.loading = false;
            // }
          }
        },
          Error => {
            console.log(Error);
          });
    } else {
      this.ds.notify('Form is Invalid!', "error");
      $('#confirmSubmit').modal('hide');
      this.loading = false;
      console.log("FORM INVALID");

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


  getValue: any;
  isShowValue = false;
  showButton = false;
  uploadStatus:any;
  getUploadPreview(formid) {
    var urlValue = this.appconstant + 'umcs/getDummyForm';
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
        var userDetails = localStorage.getItem("Daim-forms");
        var userJson = JSON.parse(userDetails);
    
        this.form = this.fb.group({
          creditorid: [userJson.shortid, req],
          contactno: [patchValue.contactno],
          storagePeriod: [patchValue.storagePeriod],
          storagePurpose: [patchValue.storagePurpose],
          hrid: [patchValue.hrid],
          umcsPartsDummy: this.fb.array([]),

        });

        var umcsParts = data2['umcsPartsDummy'];
        for (var i = 0; i < umcsParts.length; i++) {
          var stoObj = umcsParts[i];
          this.showRow(stoObj);
        }
        debugger
        Error => {

        };
      })
  }
  showRow(data) {
    const row = this.fb.group({
      partnumber: [data['partnumber']],
      description: [data['description']],
      quantity: [data['quantity']],
      vehicleno:[data['vehicleno']]
    });
    this.rowForms.push(row);
  }
  get rowForms() {
    return this.form.get('umcsPartsDummy') as FormArray;
  }
 
  uploadCancel(){
    $('#cancelUpload').modal('show');
  }

  confirmCancel(){
    var urlValue = this.appconstant + 'umcs/cancelDummyForm';
    this.loading = true;
    this.ds.makeapi(urlValue, '', 'post')
      .subscribe(data => {
           if(data.status == 'Success'){
            this.loading = false;
          $('#cancelUpload').modal('hide');
           this.router.navigateByUrl('dashboard/umcslist');
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
    var urlValue = this.appconstant + 'umcs/confirmDummyForm';
    var submitData = "dummyformid=" + this.DummyFormId;
    this.loading = true;
    this.ds.makeapi(urlValue, submitData , 'post')
      .subscribe(data => {
        if (data.status == 'Success') {
          $('#confirmUpload').modal('hide');
          this.loading = false;
          $.notify('Form submitted successfully !!', "success");
          this.router.navigateByUrl('dashboard/umcslist');
         }
         Error => {
          this.loading = false;
        };
      })
    }


}
