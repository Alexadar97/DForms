import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Location, getLocaleDateTimeFormat } from '@angular/common';
import { DataserviceService } from '../../dataservice.service';
import { NotifierService } from 'angular-notifier';


declare var $, _, moment;

@Component({
  selector: 'app-umcslist',
  templateUrl: './umcslist.component.html',
  styleUrls: ['./umcslist.component.css']
})
export class UmcslistComponent implements OnInit {

  private appconstant = this.ds.appconstant;
  private userShortId;

  private sotformapi = this.appconstant + 'umcs/list';
  private downloadPDFApi = this.appconstant + 'umcs/downloadPDF/';
  private umcsPaginateAPI = this.appconstant + 'umcs/getPaginationCount';
  private downloadPDFumcs = this.appconstant + 'umcs/generatePDF/';
  private umcsFilter = this.appconstant + 'umcs/getFilterColumns/';
  private statusTracking = this.appconstant + 'umcs/statusTracking';
  umcslist: any;
  isStoreLogin = false;
  loading = false;
  partsList;
  notifier;
  form: FormGroup
  remarkform: FormGroup
  assignUserType;
  changedUserType;
  changedUserTypeL4;
  changedUserTypeL3;
  p1 = 1;
  p2 = 1;
  constructor(notifierService: NotifierService, private router: Router, private http: Http, private ds: DataserviceService, private fb: FormBuilder) {

    var req = Validators.compose([Validators.required]);


    this.form = fb.group({
      id: '',
      usertype: '',
      userprototype: '',
      remarks: [null, req],
      deputyprotol3: [],
      deputyprotol4: [],
      status: '',



    });

    this.remarkform = fb.group({
      remarks: [null, req],
    });

    this.updateForm = this.fb.group({
      'id': [''],
      'arr': [null],
    });


    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    this.userShortId = jsonData['shortid'];
    this.notifier = notifierService;



  }
  Shortid
  status
  isBudgetApprover
  isSm
  isIpl
  isPartsplanner
  isStoreUser
  isStorereq
  ngOnInit() {
    var currentpage = localStorage.getItem("Pagination")
    if(Number(currentpage) == 0){
        this.currentPage = 1
    }else{
      this.currentPage = Number(currentpage)
    }
    this.loading = true
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
    if (usertype === "budgetapprover") {
      this.status = ''
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
      this.isStoreLogin = true;
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
    this.status = usertype
    this.umcsPaginationCount();

    // this.getumcsform().subscribe(data => {


    // },
    //   Error => {
    //   });;
    this.getumcsform();
    this.umcsfilter();
  }
  addsto() {
    this.router.navigate(['dashboard/umcsnew'], {});
  }

  viewAction(id) {
    localStorage.setItem("Pagination",String(this.currentPage))
    this.router.navigate(['dashboard/umcsedit'], {
      queryParams: { type: 'umcs', id: id }
    });
  }
  // recalledit(id) {
  //   this.router.navigate(['dashboard/umcsnew'], {
  //     queryParams: { type: 'umcs', id: id }
  //   });
  // }
  viewScrapAction(id) {
    this.router.navigate(['dashboard/umcsedit'], {
      queryParams: { type: 'umcs', id: id }
    });

  }
  umcsdata;
  openParts(data) {
    this.umcsdata = data
    //open the modal to show parts
    console.log(data);
    $("#addcostcenter").modal("show");
    this.partsList = data;
    this.fetchStatus(data)

  }
  totalPartCount: any;
  currentPage = 1;
  totalPages = 10;
  umcsPaginationCount() {
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    var userShortId = jsonData['shortid'];
    var submitData = { "usertype": this.status, "userid": userShortId, 'searchstr': this.alllistsearch, "filterList": this.setvalues, "fromDate": this.setDate1, "toDate": this.setDate2 };
    this.ds.makeapi(this.umcsPaginateAPI, submitData, "postjson")
      .subscribe(data => {

        var totalcount = data['pagecount'];
        this.totalPartCount = totalcount;

        this.totalPages = Math.ceil(this.totalPartCount / 10);


        console.log(this.totalPartCount)

      },
        Error => {
        });
  }


  paginatePartList(page) {
    console.log(page)
    this.checkclicksingle = [];
    if (page == 'prev' && this.currentPage > 1) {
      if (page == 'prev') {
        this.loading = true;
      }
      else {
        this.loading = false;
      }
      this.currentPage = this.currentPage - 1
      console.log(this.currentPage)
    }
    else {
      if (page == 'next') {
        this.loading = true;
      }
      else {
        this.loading = false;
      }
      this.currentPage = this.currentPage + 1
      console.log(this.currentPage);

    }
    localStorage.setItem("Pagination",String(this.currentPage))
    this.getumcsform();
  }

  searchPage() {
    this.loading = true;
    var inputPageValue = parseInt($("#currentPageInput").val())
    if (this.totalPages < inputPageValue) {

      alert("Enter valid page number!");
      $("#currentPageInput").val(this.currentPage)
    }
    else {

      this.currentPage = inputPageValue;


    }
    this.getumcsform()
    localStorage.setItem("Pagination",String(this.currentPage))
  }
  usertype;
  storagePeriod: any;
  getumcsform() {
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    // let reqdata = "usertype=SM";
    var usertype = '';

    if (jsonData['usertype']) {
      usertype = jsonData['usertype'].toLowerCase();
      this.usertype = usertype
    }
    let reqdata = { "userid": this.userShortId, "usertype": this.usertype, "page": this.currentPage, "filterList": this.setvalues, "fromDate": this.setDate1, "toDate": this.setDate2 };
    // let reqdata = "usertype=SM";


    let url = this.sotformapi;
    let data = reqdata;
    const headers = new Headers();
    this.ds.makeapi(url, reqdata, "postjson").subscribe(data => {
      this.loading = false
      // var sortedList = _.sortBy(data, [function(o) { return -o.id; }]);
      this.umcslist = data;
      for (var i = 0; i < this.umcslist; i++) {
        this.storagePeriod = this.umcslist[i]['storagePeriod']
      }
    })
    headers.append('Content-Type', 'application/json');
    return this.http.post(url, data, { headers: headers })
      .map((response: Response) => response.json())
      .catch((error: any) => {
        this.loading = true;

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


  upload() {
    this.router.navigate(['dashboard/umcsupload'], {
      queryParams: { type: 'umcs' }
    });
  }
  remaksvalue: any
  storeResponse(response) {
    // this.remaksvalue = $('#remarks').val()
    if (this.form.invalid) {
      $.notify('Remark is Required!', "error");
      // this.notifier.notify('error', 'Remark is Required!');
    } else {
      //open a modal and show remarks and save button.
      // $("#storeResponse").modal("show");

      this.loading = true;
      var status = "";
      if (response) {
        status = "accepted"
      } else {
        status = "storerejected"
      }
      var getdata = this.form.value;

      // getdata.usertype = this.deputylists.approvertype



      if (getdata.id == '' || getdata.id == null || getdata.id == undefined) {
        getdata.id = this.apprid
      }
      if (getdata.status == '' || getdata.status == null || getdata.status == undefined) {
        getdata.status = status
      }

      console.log(this.umcsmodallist);
      var umcsData = this.umcsmodallist[0]
      if (this.form.value.deputyprotol4) {
        this.changedUserTypeL4 = 'DeputyProtoL4';
      } else {
        this.changedUserTypeL4 = 'ProtoL4';
      }

      if (this.form.value.deputyprotol3) {
        this.changedUserTypeL3 = 'DeputyProtoL3';
      } else {
        this.changedUserTypeL3 = 'ProtoL3';
      }

      var reqdata = '';
      if (umcsData.storagePeriod == '1month') {
        reqdata = "id=" + getdata.id + "&status=" + getdata.status + "&l4usertype=" + this.changedUserTypeL4 + "&remarks=" + getdata.remarks + "&l3usertype="


      } else if (umcsData.storagePeriod == '2months' || umcsData.storagePeriod == '3months') {
        reqdata = "id=" + getdata.id + "&status=" + getdata.status + "&l4usertype=" + this.changedUserTypeL4 + "&l3usertype=" + this.changedUserTypeL3 + "&remarks=" + getdata.remarks

      }


      //l4usertype = 'ProtoL4' OR 'DeputyProtoL4'
      //l3usertype = 'ProtoL3' OR 'DeputyProtoL3'




      var urlValue = this.appconstant + 'umcs' + '/updateFormStatus';
      this.ds.makeapi(urlValue, reqdata, 'post')
        .subscribe(data2 => {

          this.form.reset();
          this.remaksvalue = ""
          this.loading = false;

          this.getumcsform().subscribe(data => {
            if (data2.status == "Success") {
              //console.log(data);
              this.umcslist = data;
              $.notify('Store Acceptance Saved!', "success");
              // this.notifier.notify('success', 'Store Acceptance Saved!');
              this.loading = false;

            }else{
              $.notify('Store Response failed to Save!', "error");
            }

          },
            Error => {
            });;




        }, Error => {
          this.loading = false;
          $.notify('Store Response failed to Save!', "error");
          // this.notifier.notify('error', 'Store Response failed to Save!');
        });
      this.form.reset();
    }
  }

  Pdfdownlaod(filename, id) {

    // console.log(filename)
    return this.ds.method(this.downloadPDFApi + id, filename, "downloadfile")
      .subscribe(res => {
        // console.log(res.data);
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

      },
        Error => {
        });
  }
  apprid: any
  deputylist: any = []
  umcsmodallist: any
  deputylists: any
  periodOfStorage;
  partsListdata
  approvelreject(data, id, index) {
    this.partsListdata = data['umcsParts'];
    var umcsjson = data
    this.periodOfStorage = umcsjson.storagePeriod;

    var umcslists = [{ "createddate": umcsjson.createddate, "creditorname": umcsjson.creditorname, "hrid": umcsjson.hrid, "department": umcsjson.department, "approvername": umcsjson.approvername, "status": umcsjson.status, "storagePeriod": umcsjson.storagePeriod }]
    this.umcsmodallist = umcslists
    // console.log(this.umcsmodallist)

    this.deputylists = this.umcslist[id - 1]

    this.apprid = id
    // this.assignUserType = this.deputylists['approvertype'];
    $('#approvalreject').modal('show')
    this.remaksvalue = ''


  }
  changedUserTypedeputy;
  deputyvalue: any;
  deputyvalues(event) {
    if (event.target.checked == true) {
      var getdata = this.form.value;
      // getdata.usertype = "Deputy"+this.assignUserType
      // this.changedUserType = "Deputy"+this.assignUserType
      getdata.usertype = this.changedUserType
      this.changedUserType = 'DeputyProtoL4'
      // console.log(this.changedUserType)
      this.form.patchValue(getdata);
      var urlValue = this.appconstant + 'user' + '/checkUser';
      var submitData = "usertype=" + this.changedUserType;
      this.ds.makeapi(urlValue, submitData, 'post')
        .subscribe(data2 => {
          if (data2.status == 'Failure') {
            $.notify('Proto user is not available!', "error");
          }
          // else if (data2.status == 'Failure') {

          // }

          Error => {
          };
        })

    } else if (event.target.checked == false) {
      var getdata = this.form.value;
      getdata.usertype = this.changedUserType
      // getdata.usertype = this.assignUserType
      // this.changedUserType = this.assignUserType
      this.changedUserType = 'ProtoL4'
      // console.log(this.changedUserType)
      this.form.patchValue(getdata)
    }
  }

  deputyprotovalues(event) {
    if (event.target.checked == true) {
      var getdata = this.form.value;
      getdata.userprototype = this.changedUserTypedeputy
      this.changedUserTypedeputy = 'DeputyProtoL3'
      // console.log(this.changedUserTypedeputy);
      this.form.patchValue(getdata);
      var urlValue = this.appconstant + 'user' + '/checkUser';
      var submitData = "usertype=" + this.changedUserTypedeputy;
      this.ds.makeapi(urlValue, submitData, 'post')
        .subscribe(data2 => {
          if (data2.status == 'Failure') {
            $.notify('Proto user is not available!', "error");
          }
          // else if (data2.status == 'Failure') {

          // }

          Error => {
          };
        })

    } else if (event.target.checked == false) {
      var getdata = this.form.value;
      getdata.userprototype = this.changedUserTypedeputy
      this.changedUserTypedeputy = 'ProtoL3'
      // console.log(this.changedUserTypedeputy);
      this.form.patchValue(getdata)
    }
  }
  //   Recallaction(id) {
  // this.loading = true
  //     var submitData = "id=" + id + "&status=recalled";
  //     var urlValue = this.appconstant + 'umcs' + '/updateFormStatus/';
  //     this.ds.makeapi(urlValue, submitData, 'post')
  //       .subscribe(data2 => {
  //         var id = "tst";
  //         if (data2.status == "Success") {
  //           this.loading=false
  //           this.getumcsform()
  //           $.notify('UMCS Form Recalled Successfully!!', "success");
  //         } else {

  //         }


  //       }, Error => {

  //       });
  //   }



  alllistsearch = "";
  search(value) {
    this.alllistsearch = value;
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    var userShortId = jsonData['shortid'];
    let reqdata = { "usertype": this.status, "userid": userShortId, "page": this.currentPage, 'searchstr': this.alllistsearch };
    return this.ds.makeapi(this.sotformapi, reqdata, "postjson")
      .subscribe(data => {
        this.umcslist = data;
        this.umcsPaginationCount();
      },
        Error => {
        });
  }



  isCheckall: any
  form_id: any;
  checkallpart = [];
  FilterByCategorylist = [];
  checkall(ischecked) {
    console.log(ischecked)
    this.isCheckall = ischecked
    if (ischecked == true) {
      $('.checksingle:checkbox').prop('checked', true);
      var checkforFilter = $('.checksingle:checked').map(function () {
        return $(this).val();
      }).get();
      this.FilterByCategorylist = checkforFilter;
      this.checkallpart = [];
      for (var i = 0; i < this.umcslist.length; i++) {
        this.form_id = this.umcslist[i].id;
        this.checkallpart.push({ "id": this.form_id })
      }
      this.checkclicksingle = this.checkallpart;
    }
    else {
      $('.checksingle:checkbox').prop('checked', false);
      this.FilterByCategorylist = [];
      this.checkallpart = [];
      this.checkclicksingle = this.checkallpart;
    }
  }
  singlecheck_id;
  singlevalue: any
  eventchecked: any
  checkclicksingle = []
  removeArr(val) {
    var arr = this.checkclicksingle;
    var tmpArr = [];
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] && arr[i]['id'] != val) {
        tmpArr.push(arr[i])
      }
    }
    return tmpArr;
  }

  arrayCheck(val) {
    var arr = this.checkclicksingle
    var ret = false;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] && arr[i]['id'] == val) {
        ret = true
      }
    }
    return ret;
  }

  singlecheck(event, id) {
    this.isCheckall = false;
    this.singlecheck_id = id;
    this.eventchecked = event.target.checked
    if (this.eventchecked == true) {

      if (!this.arrayCheck(id)) {
        this.checkclicksingle.push({ "id": this.singlecheck_id })
      }
      console.log(this.checkclicksingle)
    }
    else if (this.eventchecked == false) {
      // this.checkclicksingle.push({ "id": this.singlecheck_id });

      if (this.arrayCheck(id)) {
        this.checkallpart = []
        // this.checkclicksingle.push({ "id": this.singlecheck_id })
        this.checkclicksingle = this.removeArr(id);

        console.log(this.checkclicksingle)
      }

    }

    // this.checkclicksingle.push({ "id":this.singlecheck_id })

    if ($('.checksingle:checked').length == $('.checksingle').length) {
      $('#select-all').prop('checked', true);
    }
    else {
      $('#select-all').prop('checked', false);
    }
  }



  downloadZip(filename) {
    if (this.isCheckall == true) {
      this.loading = true;
      if (this.checkallpart != []) {
        var submitData = { "umcsIdList": this.checkallpart, "status": "" };
      }


      return this.ds.method(this.downloadPDFumcs, submitData, "downloadfileZIPjson")
        .subscribe(res => {
          this.loading = false;

          if (window.navigator.msSaveOrOpenBlob) {
            var fileData = [res.data];
            var blobObject = new Blob(fileData);
            // $(anchorSelector).click(function(){
            window.navigator.msSaveOrOpenBlob(blobObject, filename);
            window.navigator.msSaveOrOpenBlob(blobObject, filename);
          } else {
            // console.log("not IE browser");
            this.loading = false;
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
        },
          Error => {
            this.loading = false;
          });
    }

    else if (this.checkclicksingle.length > 0) {
      this.loading = true;
      if (this.checkclicksingle != []) {
        var submitDatasing = { "umcsIdList": this.checkclicksingle, "status": "" };
      }

      return this.ds.method(this.downloadPDFumcs, submitDatasing, "downloadfileZIPjson")
        .subscribe(res => {
          this.loading = false;
          if (window.navigator.msSaveOrOpenBlob) {
            // console.log("in IE browser");
            var fileData = [res.data];
            var blobObject = new Blob(fileData);
            window.navigator.msSaveOrOpenBlob(blobObject, filename);
            window.navigator.msSaveOrOpenBlob(blobObject, filename);
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
        },
          Error => {
            this.loading = false
          });
    }
    else if (this.checkclicksingle.length == 0) {
      $.notify('Please select the form to download the file!', "error");
    }

  }

  downloadExcel(filename) {
    this.loading = true
    var urlValue = this.appconstant + 'umcs' + '/downloadExcel';
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    var userShortId = jsonData['shortid'];

    let reqdata = { "usertype": this.status, "userid": userShortId, "page": this.currentPage, "filterList": this.setvalues, };
    this.ds.method(urlValue, reqdata, 'downloadfilejson')
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
  getdepartment = [];
  getstatus = [];
  getapprover = [];
  umcsfilter() {
    var urlValue = this.appconstant + 'umcs/getFilterColumns/';
    this.ds.makeapi(urlValue, '', 'post')
      .subscribe(data => {
        this.getdepartment = data.department;
        this.getstatus = data.status;
        console.log(this.getstatus)
        this.getapprover = data.approvername;

      }, Error => {

      });

  }
  isselected: any;
  departmetnvalues = [];
  departmentTypeArr(isChecked, event) {
    if (isChecked) {
      //existing logic
      this.departmetnvalues.push(event)
      this.isselected = "true"

    } else {
      //for loop - remove the event  - this.typevalue
      var tmpArr = []
      for (var x = 0; x < this.departmetnvalues.length; x++) {
        if (this.departmetnvalues[x] != event) {
          tmpArr.push(this.departmetnvalues[x])
        }

      }

      this.departmetnvalues = tmpArr;
    }
  }
  departmentlistbackup = [];
  setvalues = [];
  departmentfilter(event, key) {
    console.log(event);
    this.loading = true;
    if (event != null && event.target != null) {
      var isChecked = event.target.checked;
      var event = event.target.value;
      if (event == null) {
        this.umcslist = this.departmentlistbackup
        console.log(this.umcslist)
      } else {
        this.departmentTypeArr(isChecked, event)

        var existingValueIndex = -1;
        for (var i = 0; i < this.setvalues.length; i++) {
          var tmpObj = this.setvalues[i];
          if (tmpObj['filtertype'] == key) {
            existingValueIndex = i;
          }
        }
        if (this.alllistsearch == undefined) {
          this.alllistsearch = ""
        }

        var reqdata = { "filtertype": key, "values": this.departmetnvalues }
        if (existingValueIndex == -1) {
          this.setvalues.push(reqdata)
        } else {
          this.setvalues[existingValueIndex] = reqdata
        }
        var userData = localStorage.getItem("Daim-forms");
        var jsonData = JSON.parse(userData);
        var userShortId = jsonData['shortid'];

        var senddata = { "userid": userShortId, "usertype": this.usertype, "page": this.currentPage, "filterList": this.setvalues, 'searchstr': this.alllistsearch }

        if (this.alllistsearch.length == 0) {
          senddata = { "userid": this.userShortId, "usertype": this.usertype, "page": this.currentPage, "filterList": [], 'searchstr': this.alllistsearch }
        }
        var tmpArrSetValues = [];
        for (var i = 0; i < this.setvalues.length; i++) {
          var obj = this.setvalues[i]
          if (obj.values.length != 0) {
            tmpArrSetValues.push(obj);
          }
        }


        this.setvalues = tmpArrSetValues;

        senddata = { "userid": userShortId, "usertype": this.usertype, "page": this.currentPage, "filterList": this.setvalues, 'searchstr': this.alllistsearch }
        this.ds.makeapi(this.sotformapi, senddata, "postjson")
          .subscribe(data => {
            this.umcslist = data;
            this.umcsPaginationCount();
            this.loading = false;
            console.log(this.umcslist)

          },
            Error => {
            });
      }
    } else {

    }


  }

  statusvalues = [];
  statusTypeArr(isChecked, event) {
    if (isChecked) {
      //existing logic
      this.statusvalues.push(event)
      this.isselected = "true"

    } else {
      //for loop - remove the event  - this.typevalue
      var tmpArr = []
      for (var x = 0; x < this.statusvalues.length; x++) {
        if (this.statusvalues[x] != event) {
          tmpArr.push(this.statusvalues[x])
        }

      }

      this.statusvalues = tmpArr;
    }
  }

  statusfilter(event, key) {
    console.log(event)
    this.loading = true;
    if (event != null && event.target != null) {
      var isChecked = event.target.checked;
      var event = event.target.value;
      if (event == null) {
        this.umcslist = this.departmentlistbackup
        console.log(this.umcslist)
      } else {
        this.statusTypeArr(isChecked, event)

        var existingValueIndex = -1;
        for (var i = 0; i < this.setvalues.length; i++) {
          var tmpObj = this.setvalues[i];
          if (tmpObj['filtertype'] == key) {
            existingValueIndex = i;
          }
        }
        if (this.alllistsearch == undefined) {
          this.alllistsearch = ""
        }

        var reqdata = { "filtertype": key, "values": this.statusvalues };
        if (existingValueIndex == -1) {
          this.setvalues.push(reqdata)
        } else {
          this.setvalues[existingValueIndex] = reqdata
        }
        var userData = localStorage.getItem("Daim-forms");
        var jsonData = JSON.parse(userData);
        var userShortId = jsonData['shortid'];

        var senddata = { "userid": userShortId, "usertype": this.usertype, "page": this.currentPage, "filterList": this.setvalues, 'searchstr': this.alllistsearch }

        if (this.alllistsearch.length == 0) {
          senddata = { "userid": userShortId, "usertype": this.usertype, "page": this.currentPage, "filterList": [], 'searchstr': this.alllistsearch }
        }
        var tmpArrSetValues = [];
        for (var i = 0; i < this.setvalues.length; i++) {
          var obj = this.setvalues[i]
          if (obj.values.length != 0) {
            tmpArrSetValues.push(obj);
          }
        }


        this.setvalues = tmpArrSetValues;

        senddata = { "userid": userShortId, "usertype": this.usertype, "page": this.currentPage, "filterList": this.setvalues, 'searchstr': this.alllistsearch }
        this.ds.makeapi(this.sotformapi, senddata, "postjson")
          .subscribe(data => {
            this.umcslist = data;
            this.umcsPaginationCount();
            this.loading = false;
            console.log(this.umcslist)

          },
            Error => {
            });
      }
    } else {

    }


  }
  approvervalues = [];
  approverTypeArr(isChecked, event) {
    if (isChecked) {
      //existing logic
      this.approvervalues.push(event)
      this.isselected = "true"

    } else {
      //for loop - remove the event  - this.typevalue
      var tmpArr = []
      for (var x = 0; x < this.approvervalues.length; x++) {
        if (this.approvervalues[x] != event) {
          tmpArr.push(this.approvervalues[x])
        }

      }

      this.approvervalues = tmpArr;
    }
  }

  approverfilter(event, key) {
    console.log(event);
    this.loading = true;
    if (event != null && event.target != null) {
      var isChecked = event.target.checked;
      var event = event.target.value;
      if (event == null) {
        this.umcslist = this.departmentlistbackup
        console.log(this.umcslist)
      } else {
        this.approverTypeArr(isChecked, event)

        var existingValueIndex = -1;
        for (var i = 0; i < this.setvalues.length; i++) {
          var tmpObj = this.setvalues[i];
          if (tmpObj['filtertype'] == key) {
            existingValueIndex = i;
          }
        }
        if (this.alllistsearch == undefined) {
          this.alllistsearch = ""
        }

        var reqdata = { "filtertype": key, "values": this.approvervalues };
        if (existingValueIndex == -1) {
          this.setvalues.push(reqdata)
        } else {
          this.setvalues[existingValueIndex] = reqdata
        }
        var userData = localStorage.getItem("Daim-forms");
        var jsonData = JSON.parse(userData);
        var userShortId = jsonData['shortid'];

        var senddata = { "userid": userShortId, "usertype": this.usertype, "page": this.currentPage, "filterList": this.setvalues, 'searchstr': this.alllistsearch }

        if (this.alllistsearch.length == 0) {
          senddata = { "userid": userShortId, "usertype": this.usertype, "page": this.currentPage, "filterList": [], 'searchstr': this.alllistsearch }
        }
        var tmpArrSetValues = [];
        for (var i = 0; i < this.setvalues.length; i++) {
          var obj = this.setvalues[i]
          if (obj.values.length != 0) {
            tmpArrSetValues.push(obj);
          }
        }


        this.setvalues = tmpArrSetValues;

        senddata = { "userid": this.userShortId, "usertype": this.usertype, "page": this.currentPage, "filterList": this.setvalues, 'searchstr': this.alllistsearch }
        this.ds.makeapi(this.sotformapi, senddata, "postjson")
          .subscribe(data => {
            this.umcslist = data;
            this.umcsPaginationCount();
            this.loading = false;
            console.log(this.umcslist)

          },
            Error => {
            });
      }
    } else {

    }


  }

  // checked:any;
  // CheckAll(allchecked){
  //   this.checked = allchecked;
  //     if(this.checked){
  //         $('.singlecheckbox').each(function(){
  //             this.checked = true;
  //         });
  //         this.checkallpart = [];
  //     for (var i = 0; i < this.umcslist.length; i++) {
  //       this.form_id = this.umcslist[i].id;
  //       this.checkallpart.push({ "id": this.form_id })
  //     }

  //     }else{
  //          $('.singlecheckbox').each(function(){
  //             this.checked = false;
  //         });
  //     }
  // }



  // SingleCheck(event,id){
  //   this.singlecheck_id = id;
  //   console.log(this.singlecheck_id)
  //   this.eventchecked = event.target.checked
  //     if($('.singlecheckbox:checked').length == $('.singlecheckbox').length){
  //       $('#select_all').prop('checked',true);

  //       this.checkclicksingle.push({ "id":this.singlecheck_id });
  //   }
  //   else{
  //     $('#select_all').prop('checked',false);
  //   }
  // }
  backHome() {
    this.router.navigateByUrl('/home');
  }
  setDate1: any;
  setDate2: any;
  SelectDate(value, key) {
    console.log(value);
    if (value != null) {
      this.setDate1 = moment(value[0]).format('DD-MM-YYYY');
      this.setDate2 = moment(value[1]).format('DD-MM-YYYY');
    }

    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    var userShortId = jsonData['shortid'];
    var senddata = { "userid": userShortId, "usertype": this.status, "page": this.currentPage, "fromDate": this.setDate1, "toDate": this.setDate2, 'searchstr': this.alllistsearch }
    this.ds.makeapi(this.sotformapi, senddata, "postjson")
      .subscribe(data => {
        this.umcslist = data;
        this.umcsPaginationCount();



      },
        Error => {
        });


  }
  umcslists() {
    this.router.navigate(['dashboard/umcslist'], {});
  }

  Recall(id) {
    this.loading = true;
    var submitData = "id=" + id + "&status=recalled";
    var urlValue = this.appconstant + 'umcs/updateFormStatus/';
    this.ds.makeapi(urlValue, submitData, 'post')
      .subscribe(data2 => {
        if (data2.status == 'Success') {
          this.getumcsform().subscribe(data => {

            this.umcslist = data;

            this.loading = false;
          })

        }

      }, Error => {

      });
  }
  RecallEdit(id) {
    localStorage.setItem("Pagination",String(this.currentPage))
    this.router.navigate(['dashboard/umcs-recall'], {
      queryParams: { id: id }
    });
  }

  statusValues = []
  updateForm;
  fetchStatus(statusdata) {
    this.ds.method(this.statusTracking + "?formid=" + statusdata.id, '', 'get')
      .subscribe(res => {
        // this.partsList = statusdata['umcsParts'];
        console.log(res);
        this.statusValues = res;
        this.updateForm.patchValue({ arr: res })
        $("#addcostcenter").modal("show");



      }, Error => {
        console.log(Error);
      });
  }
  pickColor(val) {
    return this.ds.StatusColor(val)
  }

  umcslistDelete: any;
  formid: any;
  umcsDelete(id, data) {
    $('#deletelist').modal('show');
    this.umcslistDelete = data;
    this.formid = id;
  }
  submitForm() {

    if (this.remarkform.valid) {
      var remarks = this.remarkform.value.remarks;
      var submitData = "id=" + this.formid + "&status=deleted" + "&remarks=" + remarks + "&usertype=" + this.status;
      var urlValue = this.appconstant + 'umcs' + '/updateFormStatus/';
      this.loading = true;
      this.ds.makeapi(urlValue, submitData, 'post')
        .subscribe(data2 => {
          if (data2.status == "Success") {
            this.loading = false;
            this.remarkform.reset();
            $('#deletelist').modal('hide');
            this.getumcsform();
            $.notify('Umcs Form Deleted !!', "success");
          }

        }, Error => {
          this.loading = false;
        });
    }
    else {
      this.loading = false;
      $.notify('Remark is Invalid!', "error");
    }
  }


}
