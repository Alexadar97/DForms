import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { NotifierService } from 'angular-notifier';
import { DataserviceService } from '../../dataservice.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
declare var $
@Component({
  selector: 'app-mcsedit',
  templateUrl: './mcsedit.component.html',
  styleUrls: ['./mcsedit.component.css']
})
export class McseditComponent implements OnInit {


  //^[0][1-9]\d{9}$|^[1-9]\d{9}$
  private readonly notifier: NotifierService;
  formType = null
  umcsPartsArr = []
  numbervalidation = /^[0][1-9]\d{9}$|^[1-9]\d{9}$/;
  form: FormGroup;
  formId = null
  name = new FormControl('');
  purpose = new FormControl('');
  storagetype = new FormControl('');
  private appconstant = this.ds.appconstant;
  fb = null
  l4Users = [];
  loading = false;
  isStoreLogin = false;
  deptList = []
  p1;
  Shortid
  status
  isBudgetApprover
  isSm
  isIpl
  isPartsplanner
  isStoreUser
  isStorereq
  usertype;
  approvertype;
  // listdept = this.appconstant + 'dept/list';

  listusers = this.appconstant + 'user/list';

  private savemcs = this.appconstant + 'nmcs/save';

  constructor(notifierService: NotifierService,private route: ActivatedRoute, fb: FormBuilder, private http: Http, private router: Router, private _location: Location, private ds: DataserviceService) {

    this.fb = fb;
    this.notifier = notifierService;
    var userDetails = localStorage.getItem("Daim-forms");
    var userJson = JSON.parse(userDetails);
console.log( "userJson="+userJson)
    var req = Validators.compose([Validators.required]);

    var num = Validators.compose([Validators.required, Validators.pattern(this.numbervalidation)]);


    this.form = fb.group({
      creditorid: [userJson.shortid, req],
      department: ['', req],
      contactno: ['', num],
      storagetype: ['', req],
      storagePurpose: ['', req],
      hrid: ['', req],
      approvername: ['', req],
      l4approveremarks:[],
      status: ['test', req],
      nmcsParts: fb.array([]),
    });

  }



  get rowForms() {
    return this.form.get('nmcsParts') as FormArray;

  }

  goBack() {
    this._location.back();
  }

  // addRow() {
  //   var req = Validators.compose([Validators.required]);

  //   const row = this.fb.group({
  //     finasid: ['', req],
  //     partnumber: ['', req],
  //     description: ['', req],
  //     zgs: ['', req],
  //     issueslipno: ['', req],
  //     quantity: ['', req]
  //   });

  //   this.rowForms.push(row);
  // }
  deleteRow(i) {
    this.rowForms.removeAt(i);
  }
  addRow(data) {
    var req = Validators.compose([Validators.required]);

    const row = this.fb.group({


      finasid: [data['finasid']],
      partnumber: [data['partnumber'],req],
      description: [data['description'],req],
      zgs: [data['zgs'],req],
      issueslipno: '44356',
      quantity: [data['quantity'],req],
      location:[data['location'],req]

    });

    this.rowForms.push(row);
  }
  fetchFormDetails(formtype, formid) {
    // ;
    var urlValue = this.appconstant + formtype + '/get';
    var submitData = "formid=" + formid;
    this.ds.makeapi(urlValue,submitData, 'post')
      .subscribe(data2 => {
        this.formType = formtype;
        //show information in screen.
        //show approval and reject
        console.log(data2)
        var patchValue = data2;
        // var patchValue = {};

        // patchValue[]

        this.form.patchValue(patchValue);

        var umcsParts = data2['nmcsParts'];
        this.umcsPartsArr = umcsParts;

        for (var i = 0; i < umcsParts.length; i++) {
          var umvsObj = umcsParts[i];
          this.addRow(umvsObj);
        }

      }, Error => {

      });

  }

  setToken(formType,formId) {


    this.formId = formId;

    this.fetchFormDetails(formType, this.formId);

}

  ngOnInit() {
    // this.addRow();
    //fetch department list

    var value = this.route.queryParams
    .subscribe(params => {
      this.setToken(params.type,params.id);
    });
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    var userShortId = jsonData['shortid'];
    let reqdata = "userid=" + userShortId;
    // let reqdata = "usertype=SM";
    var usertype = '';

    if (jsonData['usertype']) {
      usertype = jsonData['usertype'].toLowerCase();
      this.usertype = usertype
      this.Shortid = userShortId
    }
    if (usertype === "budgetapprover") {
      this.status = ''
      this.isBudgetApprover = true;
    } else if (usertype === "sm") {
      this.status = ''
      this.isSm = true;
    } else if (usertype === "ipl") {
      this.status = ''
      this.isIpl = true;
    } else if (usertype === "partsplanner") {
      this.status = ''
      this.isPartsplanner = true;
    } else if (usertype === "store") {
      this.status = 'store'
      this.isStoreUser = true;
    } else if (usertype === "admin") {
      this.status = 'admin'
      // this.isStoreUser = true;
    }
    else if (usertype === "requster") {
      this.status = ''
      this.isStorereq = true;
    }
    else {
      this.status = '';
    }


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

  test() {

  }

  fetchDeptList() {
    let reqdata = "usertype=1";

    let url = this.savemcs;
    let data = this.form.value;



    reqdata = JSON.stringify(data);

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


  saveData() {
    let reqdata = "usertype=1";

    let url = this.savemcs;
    let data = this.form.value;

    reqdata = JSON.stringify(data);

    return this.postRequest(url, reqdata);


  }

  getUserList() {
    let reqdata = "usertype=1";

    let url = this.savemcs;
    let data = this.form.value;

    reqdata = JSON.stringify(data);

    return this.postRequest(url, reqdata);
  }

  submitForm() {
    $('#confirmSubmit').modal('show');
  }

  acceptLocation() {
    if(this.form.valid){
    var resArr = [];
    // var resObj = {};
    var partsFromForm = this.rowForms;
    for (var i = 0; i < this.umcsPartsArr.length; i++) {
      resArr.push({
        id: this.umcsPartsArr[i].id, // ['id'],
        location: partsFromForm.value[i]['location'],
      });
    }

    var updateLocationUrl = this.ds.appconstant + this.formType + '/updateLocation';

    this.ds.makeapi(updateLocationUrl, resArr, "postjson")
      .subscribe(data => {
        if(data.status === "Success") {
          // this.submitForm("closed")
          var submitData = "id=" + this.formId + "&status=locationupdated";
          var urlValue = this.appconstant + this.formType + '/updateFormStatus/';
          this.loading=true
          this.ds.makeapi(urlValue, submitData, 'post')
            .subscribe(data2 => {
              var id = "tst";
              if (data2.status == "Success" ) {
                this.loading=false
                // this.isApproved = true;
                this.router.navigate(['dashboard/mcslist'], { queryParams: { id: id } });
              } else {
                this.router.navigate(['dashboard/mcslist'], { queryParams: { id: id } });
              }
              $.notify('Location Updated!', "success");
              $('#confirmSubmit').modal('hide');


            }, Error => {

            });
        }
        // this.router.navigate(['location_approval']);

      },
        Error => {
        });
      }
      else{
        for (var i = 0; i < this.form.get('nmcsParts').value.length; i++) {
          console.log(this.ds.findInvalidControls(this.form.get('nmcsParts').get(''+i)))        
  
        }
        $.notify('Location is required', "error");
        $('#confirmSubmit').modal('hide');
       
      }
    }

  partsvalue:any
  viewfinsid(index){
    this.partsvalue = this.umcsPartsArr[index].nmcsPartFinas;
    $("#finasidmodal").modal("show")
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


  // downloadExcel(filename) {
  //   this.loading = true
  //   var urlValue = this.appconstant + 'nmcs' + '/downloadExcel';
  //   var userData = localStorage.getItem("Daim-forms");
  //   var jsonData = JSON.parse(userData);
  //   var userShortId = jsonData['shortid'];

  //   let reqdata = { "usertype": this.status, "userid": userShortId, "page": this.currentPage,"filterList":this.setvalues };
  //   this.ds.method(urlValue, reqdata, 'downloadfilejson')
  //     .subscribe(res => {
  //       this.loading = false
  //       if (window.navigator.msSaveOrOpenBlob) {
  //         var fileData = [res.data];
  //         var blobObject = new Blob(fileData);
  //         // $(anchorSelector).click(function(){
  //         window.navigator.msSaveOrOpenBlob(blobObject, filename);
  //         window.navigator.msSaveOrOpenBlob(blobObject, filename);
  //         // });
  //       } else {
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
  //     }, Error => {
  //       console.log(Error);
  //     });

  // }
}
