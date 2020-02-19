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
  selector: 'app-material-dis-list',
  templateUrl: './material-dis-list.component.html',
  styleUrls: ['./material-dis-list.component.css']
})
export class MaterialDisListComponent implements OnInit {
  remarkform: FormGroup;
  masterform: FormGroup;
  loading = false;
  userShortId: any;
  isStorereq = false;
  status: any;
  usertype: any;
  Shortid;
  p3 = 1
  p2 = 1
  p1 = 1
  isStoreUser = false;
  isStoreLogin = false;
  isAdmin = false;
  private appconstant = this.ds.appconstant;
  misdiapatchlist: any;
  numbervalidation = /^[0][1-9]\d{9}$|^[1-9]\d{9}$/;
  private dispatchlistapi = this.appconstant + '/materialdispatch/list';
  private dispatchpaginationapi = this.appconstant + '/materialdispatch/getPaginationCount';
  private listDownloadAPI = this.appconstant + 'materialdispatch/listScrapfile';
  private fileDownloadAPI = this.appconstant + 'materialdispatch/downloadScrapFile';
  private getChallanApi = this.appconstant + 'master/materialdispatch/addChallanNo';
  private downloadPDFdispatch = this.appconstant + 'materialdispatch/generatePDF/';
  updateForm
  constructor(notifierService: NotifierService, private http: Http, private router: Router, private ds: DataserviceService, private fb: FormBuilder) {
    this.router = router;
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    this.userShortId = jsonData['shortid'];

    var year = moment().year();

    var req = Validators.compose([Validators.required]);
    var phone = Validators.compose([Validators.required, Validators.pattern(this.numbervalidation)]);
    this.remarkform = fb.group({
      remarks: [null, req],
    });
    this.masterform = fb.group({
      challanno: [null, phone],
      year: ['' + year],
    });
    this.updateForm = this.fb.group({
      'id': [''],
      'arr': [null],
    });

  }

  ngOnInit() {
    var currentpage = localStorage.getItem("Pagination")
    if(Number(currentpage) == 0){
        this.currentPage = 1
    }else{
      this.currentPage = Number(currentpage)
    }
    this.loading = true;
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

    if (usertype === "store") {
      this.status = 'store'
      this.isStoreUser = true;
    } else if (usertype === "admin") {
      this.status = 'admin'
      this.isAdmin = true
    }
    else if (usertype === "requster") {
      this.status = ''
      this.isStorereq = true;
    }
    else {
      this.status = '';
    }
    this.status = usertype
    this.getmisdispatch();
    this.dispatchPaginationCount();
    this.get_Master_Challan();
    this.dipatchfilter();
  }

  addmisdispatch() {
    this.router.navigate(['dashboard/matdisnew'], {});
  }
  Edit(id) {
    localStorage.setItem("Pagination",String(this.currentPage))
    this.router.navigate(['dashboard/matdisedit'], {
      queryParams: { id: id }
    });
  }
  totalPartCount: any;
  dispatchPaginationCount() {
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    var userShortId = jsonData['shortid'];
    var submitData = { "usertype": this.status, "shortid": userShortId, 'searchstr': this.alllistsearch, "filterList": this.setvalues, "fromDate": this.setDate1, "toDate": this.setDate2 };

    this.ds.makeapi(this.dispatchpaginationapi, submitData, "postjson")

      .subscribe(data => {
        this.loading = false
        var totalcount = data['pagecount'];
        this.totalPartCount = totalcount;

        this.totalPages = Math.ceil(this.totalPartCount / 10);


        console.log(this.totalPartCount)

      },
        Error => {
        });
  }

  currentPage = 1;
  totalPages = 10;
  paginatePartList(page) {
    // this.checkclicksingle = [];

    if (page == 'prev' && this.currentPage > 1) {
      if (page == 'prev') {
        this.loading = true;
      }
      else {
        this.loading = false;
      }
      this.currentPage = this.currentPage - 1;
      console.log(this.currentPage);
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
    this.getmisdispatch()
    localStorage.setItem("Pagination",String(this.currentPage))
  }

  searchPage() {
    this.loading = true;
    var inputPageValue = parseInt($("#currentPageInput").val())
    if (this.totalPages < inputPageValue) {

      alert("Enter valid page number!");
      $("#currentPageInput").val(this.currentPage)
    } else {
      this.currentPage = inputPageValue;

    }
    localStorage.setItem("Pagination",String(this.currentPage))
    this.getmisdispatch()
  }
  getmisdispatch() {
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    var userShortId = jsonData['shortid'];
    let reqdata = { "usertype": this.status, "shortid": userShortId, "page": this.currentPage, "filterList": this.setvalues, "fromDate": this.setDate1, "toDate": this.setDate2 };
    this.ds.makeapi(this.dispatchlistapi, reqdata, "postjson").subscribe(data => {
      this.misdiapatchlist = data;
      this.loading = false;
      console.log(data)
    })
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

  dispatchdata: any;
  saprefVal: any;
  purposeofshipmentVal: any;
  sapreference = [];
  sapreferenceArrList = [];
  purposeofshipment = [];
  purposeofshipmentArrlist = [];
  formID: any;
  fetchStatus(statusdata) {
    console.log(statusdata);
    var url = this.appconstant + 'materialdispatch/statusTracking';
    this.ds.method(url + "?formid=" + statusdata.id, '', 'get')
      .subscribe(res => {
        // this.partsList = statusdata['umcsParts'];
        console.log(res);
        //  this.statusValues = res;
        this.updateForm.patchValue({ arr: res })
        // $("#addcostcenter").modal("show");



      }, Error => {
        console.log(Error);
      });

  }
  openParts(data) {
    this.fetchStatus(data)
    this.dispatchdata = data;
    this.formID = data['id'];

    $('#dispatchparts').modal('show');

    // show the value in list SAP Reference of Original Document

    this.sapreference = [];
    this.sapreferenceArrList = []
    this.saprefVal = data.sapreference;
    this.sapreference.push(this.saprefVal);
    for (var i = 0; i < this.sapreference.length; i++) {
      for (var j = 0; j < this.sapreference[i].split(",").length; j++) {
        this.sapreferenceArrList.push(this.sapreference[i].split(",")[j]);
      }
      console.log(this.sapreferenceArrList)
    }
    // show the value in list Purpose of Shipment
    this.purposeofshipment = [];
    this.purposeofshipmentArrlist = []
    this.purposeofshipmentVal = data.purposeofshipment;
    if (data.returnOrNonReturn == 0) {
      this.purposeofshipment.push(this.purposeofshipmentVal);
      for (var i = 0; i < this.purposeofshipment.length; i++) {
        for (var j = 0; j < this.purposeofshipment[i].split(",").length; j++) {
          this.purposeofshipmentArrlist.push(this.purposeofshipment[i].split(",")[j]);
        }
        console.log(this.purposeofshipmentArrlist)
      }
    }
    this.downloadlist();
  }



  mislistDelete: any;
  formid: any;
  dispatchDelete(id, data, index) {
    // if(data.status == 'deleted'){
    //   // $("#delete" + index).attr("disabled", true);
    //   $("#delete" + index).prop("disabled", true);
    // }
    // else{
    //   $("#delete" + index).prop("disabled", true);
    // }
    $('#deletelist').modal('show');

    this.mislistDelete = data;
    this.formid = id;
  }
  submitForm() {

    if (this.remarkform.valid) {
      var remarks = this.remarkform.value.remarks;
      var submitData = "formid=" + this.formid + "&status=deleted" + "&remarks=" + remarks + "&usertype=" + this.status;
      var urlValue = this.appconstant + 'materialdispatch' + '/updateFormStatus/';
      this.loading = true;
      this.ds.makeapi(urlValue, submitData, 'post')
        .subscribe(data2 => {
          if (data2.status == "Success") {
            this.loading = false;
            this.remarkform.reset();
            $('#deletelist').modal('hide');
            this.getmisdispatch();
            $.notify('Material Dispatch Form Deleted !!', "success");
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

  fileNameArr = [];
  fileDownloadList = [];
  listfileid;
  FileName: any;
  downloadlist() {
    this.fileDownloadList = [];
    var submitData = "formid=" + this.formID;
    this.ds.makeapi(this.listDownloadAPI, submitData, 'post')
      .subscribe(data2 => {
        for (var i = 0; i < data2.length; i++) {
          this.fileDownloadList.push(data2[i]);
          this.listfileid = data2[i].id;
          this.FileName = data2[i].filename;
        }
        console.log(this.fileDownloadList)
      }, Error => {

      });

  }
  file_id;
  downlaodfile(filename, id) {
    this.file_id = id;
    this.loading = true;
    this.ds.method(this.fileDownloadAPI + "/" + this.file_id, filename, "downloadfile")
      .subscribe(res => {
        if (window.navigator.msSaveOrOpenBlob) {
          var fileData = [res.data];
          var blobObject = new Blob(fileData);
          window.navigator.msSaveOrOpenBlob(blobObject, filename);
          window.navigator.msSaveOrOpenBlob(blobObject, filename);
          this.loading = false;
        } else {
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

  add_Master() {
    $('#master').modal('show');
  }
  submit_Master_Challan() {
    if (this.masterform.valid) {
      var challanumber = this.masterform.value.challanno;
      var currentyear = this.masterform.value.year;
      var submitData = { "challanno": challanumber, "year": currentyear, "isactive": 1 };
      this.loading = true;

      this.ds.makeapi(this.getChallanApi, submitData, 'postjson')
        .subscribe(data2 => {
          if (data2.status == "Success") {
            this.loading = false;
            this.masterform.reset();
            // this.masterform.patchValue({challano:""});

            $('#master').modal('hide');
            this.getmisdispatch();
            $.notify('Challan Number Submitted !!', "success");
          }

        }, Error => {
          this.loading = false;
        });
    }
    else {
      this.loading = false;
      $.notify('Invalid Form!', "error");
    }
  }
  get_Master_Challan() {
    var urlValue = this.appconstant + 'master/materialdispatch/getChallanNo';
    this.ds.makeapi(urlValue, '', 'post')
      .subscribe(data => {
        var masterchallan = data;
        this.masterform.patchValue(masterchallan);
      })
  }
  AllowNumber(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  backHome() {
    this.router.navigateByUrl('/home');
  }

  alllistsearch = "";
  search(value) {
    this.alllistsearch = value;
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    var userShortId = jsonData['shortid'];
    let reqdata = { "usertype": this.status, "shortid": userShortId, 'searchstr': this.alllistsearch }
    return this.ds.makeapi(this.dispatchlistapi, reqdata, "postjson")
      .subscribe(data => {
        this.misdiapatchlist = data;
        this.dispatchPaginationCount();
      },
        Error => {
        });
  }






  getdepartment = [];
  getstatus = [];
  getapproverl4 = [];
  getapproverl3 = [];
  dipatchfilter() {
    var urlValue = this.appconstant + 'materialdispatch/getFilterColumns/';
    this.ds.makeapi(urlValue, '', 'post')
      .subscribe(data => {
        this.getdepartment = data.reqdepartment;
        this.getapproverl4 = data.l4name;
        this.getapproverl3 = data.l3name;
        this.getstatus = data.status;

      }, Error => {

      });

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
    var senddata = { "shortid": userShortId, "usertype": this.status, "page": this.currentPage, "fromDate": this.setDate1, "toDate": this.setDate2, 'searchstr': this.alllistsearch }
    this.ds.makeapi(this.dispatchlistapi, senddata, "postjson")
      .subscribe(data => {
        this.misdiapatchlist = data;
        this.dispatchPaginationCount();
        this.loading = false;

      },
        Error => {
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
  dispatchlistbackup = [];
  setvalues = [];
  departmentfilter(event, key) {
    this.loading = true;
    console.log(event)
    if (event != null && event.target != null) {
      var isChecked = event.target.checked;
      var event = event.target.value;
      if (event == null) {
        this.misdiapatchlist = this.dispatchlistbackup
        console.log(this.misdiapatchlist)
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

        var senddata = { "shortid": userShortId, "usertype": this.usertype, "page": this.currentPage, "filterList": this.setvalues, 'searchstr': this.alllistsearch }

        if (this.alllistsearch.length == 0) {
          senddata = { "shortid": userShortId, "usertype": this.usertype, "page": this.currentPage, "filterList": [], 'searchstr': this.alllistsearch }
        }
        var tmpArrSetValues = [];
        for (var i = 0; i < this.setvalues.length; i++) {
          var obj = this.setvalues[i]
          if (obj.values.length != 0) {
            tmpArrSetValues.push(obj);
          }
        }


        this.setvalues = tmpArrSetValues;

        senddata = { "shortid": userShortId, "usertype": this.usertype, "page": this.currentPage, "filterList": this.setvalues, 'searchstr': this.alllistsearch }
        this.ds.makeapi(this.dispatchlistapi, senddata, "postjson")
          .subscribe(data => {
            this.misdiapatchlist = data;
            this.dispatchPaginationCount();
            this.loading = false;

          },
            Error => {
            });
      }
    } else {

    }


  }


  approverl4values = [];
  approverl4TypeArr(isChecked, event) {
    if (isChecked) {
      //existing logic
      this.approverl4values.push(event)
      this.isselected = "true"

    } else {
      //for loop - remove the event  - this.typevalue
      var tmpArr = []
      for (var x = 0; x < this.approverl4values.length; x++) {
        if (this.approverl4values[x] != event) {
          tmpArr.push(this.approverl4values[x])
        }

      }

      this.approverl4values = tmpArr;
    }
  }

  approverl4ilter(event, key) {
    this.loading = true;
    console.log(event)
    if (event != null && event.target != null) {
      var isChecked = event.target.checked;
      var event = event.target.value;
      if (event == null) {
        this.misdiapatchlist = this.dispatchlistbackup;
      } else {
        this.approverl4TypeArr(isChecked, event)

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

        var reqdata = { "filtertype": key, "values": this.approverl4values }
        if (existingValueIndex == -1) {
          this.setvalues.push(reqdata)
        } else {
          this.setvalues[existingValueIndex] = reqdata
        }
        var userData = localStorage.getItem("Daim-forms");
        var jsonData = JSON.parse(userData);
        var userShortId = jsonData['shortid'];

        var senddata = { "shortid": userShortId, "usertype": this.status, "page": this.currentPage, "filterList": this.setvalues, 'searchstr': this.alllistsearch }

        if (this.alllistsearch.length == 0) {
          senddata = { "shortid": userShortId, "usertype": this.status, "page": this.currentPage, "filterList": [], 'searchstr': this.alllistsearch }
        }
        var tmpArrSetValues = [];
        for (var i = 0; i < this.setvalues.length; i++) {
          var obj = this.setvalues[i]
          if (obj.values.length != 0) {
            tmpArrSetValues.push(obj);
          }
        }


        this.setvalues = tmpArrSetValues;

        senddata = { "shortid": userShortId, "usertype": this.status, "page": this.currentPage, "filterList": this.setvalues, 'searchstr': this.alllistsearch }
        this.ds.makeapi(this.dispatchlistapi, senddata, "postjson")
          .subscribe(data => {
            this.misdiapatchlist = data;
            this.dispatchPaginationCount();
            this.loading = false;


          },
            Error => {
            });
      }
    } else {

    }


  }
  approverl3values = [];
  approverl3TypeArr(isChecked, event) {
    if (isChecked) {
      //existing logic
      this.approverl3values.push(event)
      this.isselected = "true"

    } else {
      //for loop - remove the event  - this.typevalue
      var tmpArr = []
      for (var x = 0; x < this.approverl3values.length; x++) {
        if (this.approverl3values[x] != event) {
          tmpArr.push(this.approverl3values[x])
        }

      }

      this.approverl3values = tmpArr;
    }
  }

  approverl3filter(event, key) {
    console.log(event)
    this.loading = true;
    if (event != null && event.target != null) {
      var isChecked = event.target.checked;
      var event = event.target.value;
      if (event == null) {
        this.misdiapatchlist = this.dispatchlistbackup
      } else {
        this.approverl3TypeArr(isChecked, event)

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

        var reqdata = { "filtertype": key, "values": this.approverl3values }
        if (existingValueIndex == -1) {
          this.setvalues.push(reqdata)
        } else {
          this.setvalues[existingValueIndex] = reqdata
        }
        var userData = localStorage.getItem("Daim-forms");
        var jsonData = JSON.parse(userData);
        var userShortId = jsonData['shortid'];

        var senddata = { "shortid": userShortId, "usertype": this.status, "page": this.currentPage, "filterList": this.setvalues, 'searchstr': this.alllistsearch }

        if (this.alllistsearch.length == 0) {
          senddata = { "shortid": userShortId, "usertype": this.status, "page": this.currentPage, "filterList": [], 'searchstr': this.alllistsearch }
        }
        var tmpArrSetValues = [];
        for (var i = 0; i < this.setvalues.length; i++) {
          var obj = this.setvalues[i]
          if (obj.values.length != 0) {
            tmpArrSetValues.push(obj);
          }
        }


        this.setvalues = tmpArrSetValues;

        senddata = { "shortid": userShortId, "usertype": this.status, "page": this.currentPage, "filterList": this.setvalues, 'searchstr': this.alllistsearch }
        this.ds.makeapi(this.dispatchlistapi, senddata, "postjson")
          .subscribe(data => {
            this.misdiapatchlist = data;
            this.dispatchPaginationCount();
            this.loading = false;


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
    this.loading = true;
    console.log(event)
    if (event != null && event.target != null) {
      var isChecked = event.target.checked;
      var event = event.target.value;
      if (event == null) {
        this.misdiapatchlist = this.dispatchlistbackup
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

        var reqdata = { "filtertype": key, "values": this.statusvalues }
        if (existingValueIndex == -1) {
          this.setvalues.push(reqdata)
        } else {
          this.setvalues[existingValueIndex] = reqdata
        }
        var userData = localStorage.getItem("Daim-forms");
        var jsonData = JSON.parse(userData);
        var userShortId = jsonData['shortid'];

        var senddata = { "shortid": userShortId, "usertype": this.status, "page": this.currentPage, "filterList": this.setvalues, 'searchstr': this.alllistsearch }

        if (this.alllistsearch.length == 0) {
          senddata = { "shortid": userShortId, "usertype": this.status, "page": this.currentPage, "filterList": [], 'searchstr': this.alllistsearch }
        }
        var tmpArrSetValues = [];
        for (var i = 0; i < this.setvalues.length; i++) {
          var obj = this.setvalues[i]
          if (obj.values.length != 0) {
            tmpArrSetValues.push(obj);
          }
        }


        this.setvalues = tmpArrSetValues;

        senddata = { "shortid": userShortId, "usertype": this.status, "page": this.currentPage, "filterList": this.setvalues, 'searchstr': this.alllistsearch }
        this.ds.makeapi(this.dispatchlistapi, senddata, "postjson")
          .subscribe(data => {
            this.misdiapatchlist = data;
            this.dispatchPaginationCount();
            this.loading = false;


          },
            Error => {
            });
      }
    } else {

    }


  }
  isCheckall: any
  FilterByCategorylist = [];
  checkallpart = [];
  form_id: any;
  checkall(ischecked) {
    console.log(ischecked);
    this.isCheckall = ischecked;
    if (ischecked == true) {
      $('.checksingle:checkbox').prop('checked', true);
      var checkforFilter = $('.checksingle:checked').map(function () {
        return $(this).val();
      }).get();
      this.FilterByCategorylist = checkforFilter;
      this.checkallpart = [];
      for (var i = 0; i < this.misdiapatchlist.length; i++) {
        this.form_id = this.misdiapatchlist[i].id;
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
  singlecheck_id: any;
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
        // this.checkclicksingle.push({ "id": this.singlecheck_id })
        this.checkclicksingle = this.removeArr(id);
        this.checkallpart = []
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
      this.loading = true
      if (this.checkallpart != []) {
        var submitData = { "materialDispatchIdList": this.checkallpart, "status": "" };
      }


      return this.ds.method(this.downloadPDFdispatch, submitData, "downloadfileZIPjson")
        .subscribe(res => {

          if (window.navigator.msSaveOrOpenBlob) {
            this.loading = false;
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
      this.loading = true
      if (this.checkclicksingle != []) {
        var submitDatasing = { "materialDispatchIdList": this.checkclicksingle, "status": "" };
      }

      return this.ds.method(this.downloadPDFdispatch, submitDatasing, "downloadfileZIPjson")
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


  mislist() {
    this.router.navigateByUrl('/dashboard/matdislist');
  }

  Recall(id) {
    this.loading = true;
    var submitData = "formid=" + id + "&status=recalled";
    var urlValue = this.appconstant + 'materialdispatch/updateFormStatus/';

    this.ds.makeapi(urlValue, submitData, 'post')
      .subscribe(data2 => {
        if (data2.status == 'Success') {
          this.getmisdispatch();
          this.loading = false;

        }

      }, Error => {

      });
  }
  RecallEdit(id) {
    localStorage.setItem("Pagination",String(this.currentPage))
    this.router.navigate(['dashboard/material-dis-recall'], {
      queryParams: { id: id }
    });
  }
  signature() {
    this.router.navigateByUrl('/dashboard/material-dispatch-signatue');
  }

  downloadExcel(filename) {
    this.loading = true
    var urlValue = this.appconstant + 'materialdispatch' + '/downloadExcel';
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    var userShortId = jsonData['shortid'];

    let reqdata = { "usertype": this.status, "shortid": userShortId, "page": this.currentPage, "filterList": this.setvalues };
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
  pickColor(val) {
    return this.ds.StatusColor(val)
  }
  fileupload(){
    this.router.navigateByUrl('/dashboard/matdisupload');
  }

}


