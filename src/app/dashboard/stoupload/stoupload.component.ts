import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { DataserviceService } from '../../dataservice.service';
import { NotifierService } from 'angular-notifier';

declare var $;

@Component({
  selector: 'app-stoupload',
  templateUrl: './stoupload.component.html',
  styleUrls: ['./stoupload.component.css']
})
export class StouploadComponent implements OnInit {
  form: FormGroup;
  numbervalidation = /^[0][1-9]\d{9}$|^[1-9]\d{9}$/;
  budgetApproverUsers;
  private appconstant = this.ds.appconstant;
  private savesto = this.ds.appconstant + 'sto/saveDummyForm';
  private uploadsto = this.ds.appconstant + 'sto/uploadExcelFile';

  // private listdept = this.ds.appconstant + 'dept/list';
  private listusers = this.ds.appconstant + 'user/list';
  // private uploadPdf = this.ds.appconstant + 'sto/uploadPdf';


  deptList = []
  userList = []

  l2Users = [];
  l3Users = [];
  l4Users = [];
  loading = false;
  fileName1;
  fileName2

  UploadPartmasterfinallfile1;
  UploadPartmastererrorFileUpload;
  UploadPartmasterfinallfile2;
  UploadPartmasterfinallfile
  // uploadfile
  fileName


  constructor(notifierService: NotifierService, private ds: DataserviceService, private _location: Location, private fb: FormBuilder, private http: Http, private router: Router) { }
  isBudgetApprover = false;
  isStoreUser = false;
  isSm = false;
  isIpl = false;
  isPartsplanner = false;
  status: any
  isStorerequest = false;
  usertype: any
  ngOnInit() {

    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    var userid = jsonData.shortid;
    var usertype = '';

    if (jsonData['usertype']) {
      usertype = jsonData['usertype'].toLowerCase();
      this.usertype = usertype
    }
    if (usertype === "budgetapprover") {
      this.status = 'budgetapprover'
      this.isBudgetApprover = true;

    } else if (usertype === "sm") {
      this.status = 'sm'
      this.isSm = true;
    } else if (usertype === "ipl") {
      this.status = 'ipl'
      this.isIpl = true;
    } else if (usertype === "partsplanner") {
      this.status = 'partsplanner'
      this.isPartsplanner = true;
    } else if (usertype === "store") {
      this.status = 'store'
      this.isStoreUser = true;
    } else if (usertype === "admin") {
      this.status = 'admin'
      // this.isStoreUser = true;
    }
    else if (usertype === "requester") {
      this.status = 'requester'
      this.isStorerequest = true;
    }
    else {
      this.status = '';
    }

    var req = Validators.compose([Validators.required]);
    var phone = Validators.compose([Validators.required, Validators.pattern(this.numbervalidation)]);

    this.form = this.fb.group({
      requestorid: [userid, req],
      phonenumber: ['', phone],
      exigency: [null, req],
      l4: [null],
      l3: [null],
      purpose: [null, req],
    });

    var usertype = "usertype=L4"
    this.ds.makeapi(this.listusers, usertype, "post")
      .subscribe(data => {

        this.l4Users = data;

      },
        Error => {
        });

    var usertype = "usertype=L3"
    this.ds.makeapi(this.listusers, usertype, "post")
      .subscribe(data => {

        this.l3Users = data;

      },
        Error => {
        });

    var usertype = "usertype=budgetapprover"
    this.ds.makeapi(this.listusers, usertype, "post")
      .subscribe(data => {

        this.budgetApproverUsers = data;

      },
        Error => {
        });
  }

  cancel() {
    $("#uploadpackmaster").modal("hide");
  }

  goBack() {
    this._location.back();
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

  submitForm() {
    $('#confirmSubmit').modal('show');
  }

  confirmSubmit() {
    this.loading = true;
    let url = this.savesto;
    console.log(this.form)
    if (this.form.valid) {
      let finalformdata: FormData = new FormData();
      finalformdata.append("filename", (this.fileName));
      finalformdata.append("file", (this.UploadPartmasterfinallfile));
      var validateUrl = this.ds.appconstant + "sto/validateFile";
      this.ds.postFile(validateUrl, finalformdata)
        .subscribe(validationdata => {

          if (validationdata.status == 'success') {

            let data = this.form.value;
            if (data.exigency == 0 || data.exigency == "0") {
              data.l3 = null;
              data.l4 = null;
            }
            var reqdata = JSON.stringify(data);
            this.ds.makeapi(url, reqdata, 'postjson')
              .subscribe(
                data => {
                  if (data.status == 'Success') {

                    var form_id = data.id;

                    finalformdata.append("formid", (form_id));
                    this.ds.postFile(this.uploadsto, finalformdata)

                      .subscribe(
                        uploaddata => {
                          if (uploaddata.status == 'success') {
                            this.loading = false;
                            $('#uploadpackmaster').modal("hide");
                            $('#confirmSubmit').modal('hide');
                            $.notify('File uploaded successfully !!', "success");
                            // this.ds.notify('Form Uploaded successfully !!', "success");
                            this.form.reset();
                            this.fileName = '';
                            // this.router.navigateByUrl('dashboard/stolist');
                            this.getUploadPreview(form_id);
                          }
                          else {
                            this.loading = false;
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
                  else if (data.status = 'Failure') {
                    this.loading = false;
                    $.notify('Server error, Please try again!', "error");
                    $('#confirmSubmit').modal('hide');
                  }
                  // if (data.status == 'Success') {
                  //   var form_id = data.id;
                  //   finalformdata.append("formid", (form_id));
                  //   this.ds.postFile(this.uploadPdf, finalformdata)

                  //     .subscribe(
                  //       uploaddata => {
                  //         if (uploaddata.status == 'success') {

                  //           $('#uploadpackmaster').modal("hide");
                  //           this.ds.notify('PDF Uploaded successfully !!', "success");
                  //           this.form.reset();
                  //           this.fileName1 = '';
                  //           this.router.navigateByUrl('dashboard/stolist');

                  //         }
                  //         else {
                  //           $('#uploadpackmaster').modal("hide");
                  //           this.ds.notify('PDF not Uploaded !!', "error");

                  //         }
                  //       },
                  //       Error => {
                  //         this.loading = false;
                  //         $('#uploadpackmaster').modal("hide");
                  //         this.ds.notify('Something went wrong,try again later!', "error");

                  //       });
                  // }
                },
                Error => {

                });


          }
          else {
            $.notify(validationdata.field+' '+'!', "error");
            // if (validationdata.field == 'File is Empty') {
            //   $.notify(validationdata.field+' '+'File is empty!', "error");

            //   // this.ds.notify('File is empty!', "error");
              this.loading = false;
              $('#confirmSubmit').modal('hide');
            // }
            // else if (validationdata.field == 'Part number is empty') {
            //   $.notify('Part number is empty!', "error");

            //   // this.ds.notify('Part number is empty!', "error");
            //   this.loading = false;

            // }
            // else if (validationdata.field == 'Description is empty') {
            //   $.notify('Description is empty!', "error");

            //   // this.ds.notify('Description is empty!', "error");
            //   this.loading = false;

            // } else if (validationdata.field == 'Vehicle Number is empty') {
            //   $.notify('Vehicle Number is empty!', "error");

            //   // this.ds.notify('Vehicle Number is empty!', "error");
            //   this.loading = false;

            // } else if (validationdata.field == 'Quantity is empty') {
            //   $.notify('Quantity is empty!', "error");

            //   // this.ds.notify('Quantity is empty!', "error");
            //   this.loading = false;
            // }
            // else if (validationdata.field == 'Unit is empty') {
            //   $.notify('Unit is empty!', "error");

            //   // this.ds.notify('Unit is empty!', "error");
            //   this.loading = false;

            // } else if (validationdata.field == 'Part Number should be 8 / 10 / 12 / 15 characters') {
            //   $.notify('Part Number should be 8 / 10 / 12 / 15 characters!', "error");

            //   // this.ds.notify('Part Number should be 8 / 10 / 12 / 15 characters!', "error");
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
      $('#confirmSubmit').modal('hide');
      $.notify('Form is Invalid!', "error");

      // this.ds.notify('Form is Invalid!', "error");
      this.loading = false;
      console.log("FORM INVALID");

    }

  }
  upload() {
    this.router.navigate(['dashboard/stoupload'], {
      queryParams: { type: 'sto' }
    });
  }
  addsto() {
    this.router.navigate(['dashboard/stonew'], {});
  }
  stolist() {
    this.router.navigate(['dashboard/stolist'], {});
  }

  getValue: any;
  isShowValue = false;
  showButton = false;
  uploadStatus:any;
  getUploadPreview(formid) {
    var urlValue = this.appconstant + 'sto/getDummyForm';
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
          requestorid: [userid],
          phonenumber: [patchValue.phonenumber],
          exigency: [patchValue.exigency],
          l4: [patchValue.l4],
          l3: [patchValue.l3],
          purpose: [patchValue.purpose],
          value: [patchValue.value],
          stoPartsDummy: this.fb.array([]),

        });

        var stoParts = data2['stoPartsDummy'];

        for (var i = 0; i < stoParts.length; i++) {
          var stoObj = stoParts[i];
          if(stoObj.status == 'available'){
            this.showButton = true;
          }
          this.uploadStatus = stoObj.status;
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
      unit: [data['unit']],
      status: [data['status']],
      reqquantity: [data['reqquantity']],
      priceperpart: [data['priceperpart']],
      priceperqty:[data['priceperqty']]
    });

    this.rowForms.push(row);
  }
  get rowForms() {
    return this.form.get('stoPartsDummy') as FormArray;
  }

  uploadCancel(){
    $('#cancelUpload').modal('show');
  }

  confirmCancel(){
    var urlValue = this.appconstant + 'sto/cancelDummyForm';
    this.loading = true;
    this.ds.makeapi(urlValue, '', 'post')
      .subscribe(data => {
  
           if(data.status == 'Success'){
            this.loading = false;
            $('#cancelUpload').modal('hide');
             this.router.navigateByUrl('dashboard/stolist');
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
    var urlValue = this.appconstant + 'sto/confirmDummyForm';
    var submitData = "dummyformid=" + this.DummyFormId;
    this.loading = true;
    this.ds.makeapi(urlValue, submitData , 'post')
      .subscribe(data => {
        if (data.status == 'Success') {
          $.notify('Form submitted successfully !!', "success");
          this.loading = false;
          $('#confirmUpload').modal('hide');
          this.router.navigateByUrl('dashboard/stolist');
         }
         Error => {
          this.loading = false;
        };
      })
  }

}
