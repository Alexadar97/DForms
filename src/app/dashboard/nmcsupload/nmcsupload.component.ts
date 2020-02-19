import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { DataserviceService } from '../../dataservice.service';


declare var $;

@Component({
  selector: 'app-nmcsupload',
  templateUrl: './nmcsupload.component.html',
  styleUrls: ['./nmcsupload.component.css']
})


export class NmcsuploadComponent implements OnInit {

  fileName = '';
  uploadfilenamepart;
  UploadPartmasterfinallfile;
  UploadPartmastererrorFileUpload;
  uploadApi;
  form;
  deptList;
  fb = null
  p1=1;
  l4Users;
  numbervalidation = /^[0][1-9]\d{9}$|^[1-9]\d{9}$/;
  loading = false;
  private appconstant = this.ds.appconstant;
  isStoreLogin = false;
  private savemcs = this.ds.appconstant + 'nmcs/saveDummyForm';
  private listdept = this.ds.appconstant + 'dept/list';
  private listusers = this.ds.appconstant + 'user/list';
  private uploadnmcs = this.ds.appconstant + 'nmcs/uploadFile';

  constructor(notifierService: NotifierService, fb: FormBuilder, private route: ActivatedRoute, private http: Http, private router: Router, private _location: Location, private ds: DataserviceService) {
    this.fb = fb;
    var req = Validators.compose([Validators.required]);
    var num = Validators.compose([Validators.required, Validators.pattern(this.numbervalidation)]);

    var userDetails = localStorage.getItem("Daim-forms");
    var userJson = JSON.parse(userDetails);

    this.form = fb.group({
      creditorid: [userJson.shortid],
      contactno: ['', num],
      storagePurpose: ['', req],
      hrid: ['', req],
      storagetype:['',req]
    });
  }

  ngOnInit() {

    // this.ds.makeapi(this.listdept, '', "post")
    //   .subscribe(data => {
    //     this.deptList = data;
    //   },
    //     Error => {
    //     });


    var usertype = "usertype=L4"
    this.ds.makeapi(this.listusers, usertype, "post")
      .subscribe(data => {
        this.l4Users = data;
      },
        Error => {
        });

  }

  uploadfile(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      var file: File = fileList[0];
      this.fileName = file.name;
      var finalfilename = (this.fileName).split(".");
      this.fileName = finalfilename[0];
      this.UploadPartmasterfinallfile = file;
      this.UploadPartmastererrorFileUpload = "";
      // $("#uploadpackmaster").modal("show");
    }

  }

  confirm() {
    let finalformdata: FormData = new FormData();
    // finalformdata.append("projectid", (this.projectid));
    // finalformdata.append("filename", (this.uploadfilenamepart));
    // finalformdata.append("file", (this.UploadPartmasterfinallfile));
    //formid 
    var savemcs = this.ds.appconstant + 'nmcs/save';
    // this.ds.makeapi(savemcs,) 
    let dataValue = this.form.value;
    var reqdata = JSON.stringify(dataValue);

    this.ds.makeapi(savemcs, reqdata, 'postjson')
      .subscribe(
        saveData => {


          if (saveData.status == 'Success') {
            //console.log("SUCCESS");
          }

        }
      );

    // var url = this.ds.appconstant + "nmcs/uploadFile";
    // this.ds.postFile(url, finalformdata)
    //   .subscribe(
    //     data => {
    //       if (data.status == 'Success') {
    //         $('#uploadpackmaster').modal("hide");
    //         this.fileName.nativeElement.value = "";
    //         // this.UploadPartmasterfilename = ""
    //         // this.getdata.showNotification('bottom', 'right', 'File Uploaded successfully !!', "success");
    //         // this.getpartlist();
    //       }
    //       else {
    //         $('#uploadpackmaster').modal("hide");
    //         this.fileName.nativeElement.value = "";
    //         // this.UploadPartmasterfilename = ""
    //         // this.getdata.showNotification('bottom', 'right', + data.field + '!!', "danger");
    //       }
    //     },
    //     Error => {
    //       $('#uploadpackmaster').modal("hide");
    //       this.fileName.nativeElement.value = "";
    //       // this.UploadPartmasterfilename = ""
    //       // this.getdata.showNotification('bottom', 'right', 'Something went wrong,try again later !!', "danger");
    //     });
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
    this.loading = true;
    let url = this.savemcs;
    if (this.form.valid) {
      let finalformdata: FormData = new FormData();

      finalformdata.append("filename", (this.fileName));
      finalformdata.append("file", (this.UploadPartmasterfinallfile));
      var validateUrl = this.ds.appconstant + "nmcs/validateFile";
      this.ds.postFile(validateUrl, finalformdata)
        .subscribe(validationdata => {

          if (validationdata.status == 'success') {

            let data = this.form.value;
            var reqdata = JSON.stringify(data);
            this.ds.makeapi(url, reqdata, 'postjson')
              .subscribe(
                data => {
                  if (data.status == 'success') { }
                  var form_id = data.id;

                  finalformdata.append("formid", (form_id));
                  this.ds.postFile(this.uploadnmcs, finalformdata)
                    .subscribe(
                      uploaddata => {
                        this.loading = false;
                        if (uploaddata.status == 'success') {
                          $('#uploadpackmaster').modal("hide");
                          // this.fileName.nativeElement.value = "";
                          // this.UploadPartmasterfilename = ""
                          // this.ds.notify('Form Uploaded successfully !!', "success");
                          $.notify('File uploaded successfully !!', "success");
                          $('#confirmSubmit').modal('hide');
                          // this.getdata.showNotification('bottom', 'right', 'File Uploaded successfully !!', "success");
                          // this.getpartlist();
                          this.form.reset();
                          this.fileName = '';
                          // this._location.back();
                          // this.router.navigateByUrl('dashboard/mcslist');
                          this.getUploadPreview(form_id);
                        }
                        else {
                          $('#uploadpackmaster').modal("hide");
                          $('#confirmSubmit').modal('hide');
                          // this.fileName.nativeElement.value = "";
                          // this.UploadPartmasterfilename = ""
                          // this.ds.notify('File not Uploaded !!', "error");
                          $.notify('File not Uploaded !!', "error");
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
                      });

                },
                Error => {

                });


          } else {
            if (validationdata.field == 'File is Empty') {
              // this.ds.notify('File is empty!', "error");
              $.notify('File is empty!', "error");
              this.loading = false;
            }
            else if (validationdata.field == 'Finas id is empty') {
              // this.ds.notify('Finas id is empty!', "error");
              $.notify('Finas id is empty!', "error");
              this.loading = false;

            } else if (validationdata.field == 'Part number is empty') {
              // this.ds.notify('Part number is empty!', "error");
              $.notify('Part number is empty!', "error");
              this.loading = false;

            } else if (validationdata.field == 'Description is empty') {
              // this.ds.notify('Description is empty!', "error");
              $.notify('Description is empty!', "error");
              this.loading = false;

            } else if (validationdata.field == 'ZGS is empty') {
              // this.ds.notify('ZGS is empty!', "error");
              $.notify('ZGS is empty!', "error");
              this.loading = false;

            } else if (validationdata.field == 'Quantity is empty') {
              // this.ds.notify('Quantity is empty!', "error");
              $.notify('Quantity is empty!', "error");
              this.loading = false;
            }
            else if (validationdata.field == 'Part Number should be 8 / 10 / 12 / 15 characters') {
              // this.ds.notify('Part Number should be 8 / 10 / 12 / 15 characters!', "error");
              $.notify('Part Number should be 8 / 10 / 12 / 15 characters!', "error");
              this.loading = false;
            }

          }
        },
          Error => {
            //console.log(Error);
          });
    } else {
      // this.ds.notify('Form Invalid!', "error");
      $.notify('Form Invalid!', "error");
      $('#confirmSubmit').modal('hide');
      this.loading = false;
    }

  }
  addsto() {
    this.router.navigate(['dashboard/mcsnew'], {});
  }
  upload() {
    //navigate to new page for file upload
    //nmcsupload
    this.router.navigate(['dashboard/nmcsupload'], {
      queryParams: { type: 'nmcs' }
    });
  }
  nmcslist(){
    this.router.navigateByUrl('/dashboard/mcslist');
  }


  getValue: any;
  isShowValue = false;
  showButton = false;
  uploadStatus:any;
  getUploadPreview(formid) {
    var urlValue = this.appconstant + 'nmcs/getDummyForm';
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
          creditorid: [userJson.shortid],
          contactno: [patchValue.contactno],
          storagePurpose: [patchValue.storagePurpose],
          storagetype: [patchValue.storagetype],
          hrid: [patchValue.hrid],
          nmcsPartsDummy: this.fb.array([]),

        });

        var umcsParts = data2['nmcsPartsDummy'];
        this.umcsPartsArr = umcsParts;
        for (var i = 0; i < umcsParts.length; i++) {
          var stoObj = umcsParts[i];
          this.showRow(stoObj);
        }
        Error => {

        };
      })
  }
  umcsPartsArr = [];
  partsvalue:any;
  viewFinasid(index) {
    //open the modal to show finasid

    this.partsvalue = this.umcsPartsArr[index].nmcsPartFinasDummy;
    $("#addfinasid").modal("show");

  }
  showRow(data) {
    const row = this.fb.group({
      id: [data['id']],
      partnumber: [data['partnumber']],
      description: [data['description']],
      zgs: [data['zgs']],
      quantity: [data['quantity']],
      nmcsPartFinasDummy: this.fb.array([]),
    });
    this.rowForms.push(row);
  }
  get rowForms() {
    return this.form.get('nmcsPartsDummy') as FormArray;
  }
 
  uploadCancel(){
    $('#cancelUpload').modal('show');
  }

  confirmCancel(){
    var urlValue = this.appconstant + 'nmcs/cancelDummyForm';
    this.loading = true;
    this.ds.makeapi(urlValue, '', 'post')
      .subscribe(data => {
           if(data.status == 'Success'){
            this.loading = false;
          $('#cancelUpload').modal('hide');
           this.router.navigateByUrl('dashboard/nmcslist');
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
    var urlValue = this.appconstant + 'nmcs/confirmDummyForm';
    var submitData = "dummyformid=" + this.DummyFormId;
    this.loading = true;
    this.ds.makeapi(urlValue, submitData , 'post')
      .subscribe(data => {
        if (data.status == 'Success') {
          $.notify('Form submitted successfully !!', "success");
          $('#confirmUpload').modal('hide');
          this.loading = false;
          this.router.navigateByUrl('dashboard/mcslist');
         }
         Error => {
          this.loading = false;
        };
      })
  }



}
