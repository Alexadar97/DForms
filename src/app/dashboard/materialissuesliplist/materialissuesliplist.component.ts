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
  selector: 'app-materialissuesliplist',
  templateUrl: './materialissuesliplist.component.html',
  styleUrls: ['./materialissuesliplist.component.css']
})
export class MaterialissuesliplistComponent implements OnInit {
  private appconstant = this.ds.appconstant;
  materiallist: any;
  private mislistapi = this.appconstant + '/mis/list';
  private mispaginationapi = this.appconstant + '/mis/getPaginationCount';
  private downloadPDFmis = this.appconstant + 'mis/generatePDF/';
  uploadform: FormGroup;
  private userShortId;
  remarkform: FormGroup;
  isStoreUser = false;
  isStoreLogin = false;
  p3 = 1
  p2 = 1
  p1 = 1
  // isBudgetApprover = false;
  loading = false;
  isStorereq = false;
  status: any
  usertype: any;
  Shortid
  updateForm
  constructor(notifierService: NotifierService, private http: Http, private router: Router, private ds: DataserviceService, private fb: FormBuilder) {
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    this.userShortId = jsonData['shortid'];

    var req = Validators.compose([Validators.required]);
    this.remarkform = fb.group({
      remarks: [null, req],
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
    this.uploadform = this.fb.group({
      filepath: [null],

    });
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
    this.getmaterialform();
    this.misPaginationCount();
    this.misfilter();

  }
  materiallistdata: any = []
  materialnewlist() {
    this.router.navigate(['dashboard/materialissueslipnew'], {});
  }
  edit(id) {
    localStorage.setItem("Pagination",String(this.currentPage))
    this.router.navigate(['dashboard/materialissueslipedit'], {
      queryParams: { id: id }
    });
  }
  editstored(id) {
    localStorage.setItem("Pagination",String(this.currentPage))
    this.router.navigate(['dashboard/materialissueslipedit'], {
      queryParams: { id: id }
    });
  }
  editresent(id) {
    localStorage.setItem("Pagination",String(this.currentPage))
    this.router.navigate(['dashboard/misedit'], {
      queryParams: { id: id }
    });
  }

  finasVal = []
  openFinasid(data) {
    //open the modal to show finasid

    this.finasVal = data

    $("#misparts").modal("hide");
    $("#finasidlist").modal("show");

  }



  totalPartCount: any;
  misPaginationCount() {
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    var userShortId = jsonData['shortid'];
    var submitData = { "usertype": this.status, "shortid": userShortId, 'searchstr': this.alllistsearch, "filterList": this.setvalues, "fromDate": this.setDate1, "toDate": this.setDate2 };
    this.ds.makeapi(this.mispaginationapi, submitData, "postjson")
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
    this.checkclicksingle = [];

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

    this.getmaterialform()
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
    this.getmaterialform()
    localStorage.setItem("Pagination",String(this.currentPage))
  }
  misformlist: any;
  getmaterialform() {
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    var userShortId = jsonData['shortid'];
    let reqdata = { "usertype": this.status, "shortid": userShortId, "page": this.currentPage, "filterList": this.setvalues, "fromDate": this.setDate1, "toDate": this.setDate2 };
    this.ds.makeapi(this.mislistapi, reqdata, "postjson").subscribe(data => {
      this.misformlist = data;
      this.loading = false
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
  partmateriallist: any;
  fetchStatus(statusdata) {
    console.log(statusdata);
    var url = this.appconstant + 'mis/statusTracking';
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
  misdata: any;
  openParts(data) {
    this.fetchStatus(data)
    this.misdata = data;
    $('#misparts').modal('show');
    for (var i = 0; i < data.misParts.length; i++) {
      if (data.misParts[i].partavailable == 'partavailable') {
        data.misParts[i].partavailable = 'This part is available'
      }
      else if (data.misParts[i].partavailable == 'partnotavailable') {
        data.misParts[i].partavailable = 'This part is not available'
      }
      else if (data.misParts[i].partavailable == 'qtynotavailable') {
        data.misParts[i].partavailable = 'Quantity is not available';
      }
      else if (data.misParts[i].partavailable == 'zgsmismatch') {
        data.misParts[i].partavailable = 'ZGS Mismatch';
      }
    }
  }
  finasidmateriallist;
  finasidmaterial(data) {
    $('#materiallist').modal('hide');
    $('#finasidlist').modal('show');
    this.finasidmateriallist = data['misPartFinas'];
  }
  uploadpart() {
    this.router.navigate(['dashboard/materialissueslipupload'], {
      queryParams: { type: 'mis' }
    });
  }

  deleteRow(i) {
    console.log(i)
    // this.materiallistdata.removeAt(i);
    this.materiallistdata.splice(i, 1);
  }
  alllistsearch = "";
  search(value) {
    this.alllistsearch = value;
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    var userShortId = jsonData['shortid'];
    let reqdata = { "usertype": this.status, "shortid": userShortId, "page": this.currentPage, 'searchstr': this.alllistsearch };
    return this.ds.makeapi(this.mislistapi, reqdata, "postjson")
      .subscribe(data => {
        this.misformlist = data;
        this.misPaginationCount();
      },
        Error => {
        });
  }
  downloadExcel(filename) {
    this.loading = true
    var urlValue = this.appconstant + 'mis' + '/downloadExcel';
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





  allcheck = false;
  isCheckall: any
  form_id: any;
  checkallpart = [];
  FilterByCategorylist = [];
  checkall(ischecked) {
    console.log(ischecked)
    this.isCheckall = ischecked;
    if (ischecked == true) {

      $('.checksingle:checkbox').prop('checked', true);

      var checkforFilter = $('.checksingle:checked').map(function () {
        return $(this).val();
      }).get();
      this.FilterByCategorylist = checkforFilter;
      this.checkallpart = [];
      for (var i = 0; i < this.misformlist.length; i++) {
        this.form_id = this.misformlist[i].id;
        this.checkallpart.push({ "id": this.form_id });
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
  singlecheck_id: any
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
    // this.checkclicksingle=[];
    if (this.isCheckall == true) {
      this.loading = true;
      var formlist = []
      if (this.checkallpart != []) {
        var submitData = { "misIdList": this.checkallpart, "status": "" };
      }

      // console.log(filename)
      return this.ds.method(this.downloadPDFmis, submitData, "downloadfileZIPjson")
        .subscribe(res => {
          // console.log(res.data);
          this.loading = false
          if (window.navigator.msSaveOrOpenBlob) {
            var fileData = [res.data];
            var blobObject = new Blob(fileData);
            // $(anchorSelector).click(function(){
            window.navigator.msSaveOrOpenBlob(blobObject, filename);
            window.navigator.msSaveOrOpenBlob(blobObject, filename);
          } else {
            // console.log("not IE browser");
            this.loading = false
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

      // var sigformList = [{ "id": this.checkclicksingle }]
      if (this.checkclicksingle != []) {
        var submitDatasing = { "misIdList": this.checkclicksingle, "status": "" };
      }

      // console.log(filename)
      return this.ds.method(this.downloadPDFmis, submitDatasing, "downloadfileZIPjson")
        .subscribe(res => {
          this.loading = false
          // console.log(res.data);
          if (window.navigator.msSaveOrOpenBlob) {
            var fileData = [res.data];
            var blobObject = new Blob(fileData);
            // $(anchorSelector).click(function(){
            window.navigator.msSaveOrOpenBlob(blobObject, filename);
            window.navigator.msSaveOrOpenBlob(blobObject, filename);
          } else {
            // console.log("not IE browser");
            this.loading = false
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
    else if (this.checkclicksingle.length == 0) {
      $.notify('Please select the form to download the file!', "error");
    }

  }

  getstatus = [];
  getdepartment = [];

  misfilter() {
    var urlValue = this.appconstant + 'mis/getFilterColumns/';
    this.ds.makeapi(urlValue, '', 'post')
      .subscribe(data => {
        this.getdepartment = data.department;
        this.getstatus = data.status;

      }, Error => {

      });

  }
  isselected: any;
  departmentvalues = [];
  departmentTypeArr(isChecked, event) {
    if (isChecked) {
      //existing logic
      this.departmentvalues.push(event)
      this.isselected = "true"

    } else {
      //for loop - remove the event  - this.typevalue
      var tmpArr = []
      for (var x = 0; x < this.departmentvalues.length; x++) {
        if (this.departmentvalues[x] != event) {
          tmpArr.push(this.departmentvalues[x])
        }

      }

      this.departmentvalues = tmpArr;
    }
  }
  mislistbackup = [];
  setvalues = [];
  departmentfilter(event, key) {
    console.log(event);
    this.loading = true;
    if (event != null && event.target != null) {
      var isChecked = event.target.checked;
      var event = event.target.value;
      if (event == null) {
        this.misformlist = this.mislistbackup
        console.log(this.misformlist)
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

        var reqdata = { "filtertype": key, "values": this.departmentvalues }
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
        this.ds.makeapi(this.mislistapi, senddata, "postjson")
          .subscribe(data => {
            this.misformlist = data;
            this.misPaginationCount();
            this.loading = false;
            console.log(this.misformlist)

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
    console.log(event);
    this.loading = true;
    if (event != null && event.target != null) {
      var isChecked = event.target.checked;
      var event = event.target.value;
      if (event == null) {
        this.misformlist = this.mislistbackup
        console.log(this.misformlist)
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
        this.ds.makeapi(this.mislistapi, senddata, "postjson")
          .subscribe(data => {
            this.misformlist = data;
            this.misPaginationCount();
            this.loading = false;
            console.log(this.misformlist)

          },
            Error => {
            });
      }
    } else {

    }


  }

  showfilename = false;
  StockUpload() {
    this.uploadform.reset();
    $("#partStockModal").modal("show");
    this.showfilename = true;
  }
  cancelModal() {
    this.fileName = '';
    this.uploadform.reset();
    $("#partStockModal").modal("hide");
  }
  fileName;
  uploadedFile;

  uploadfile(event) {
    if (!event) event = window.event;
    console.log(event.target);
    console.log(event.srcElement);

    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      var file: File = fileList[0];
      this.fileName = file.name.toLowerCase();
      // var finalfilename = (this.fileName).split(".");
      // this.fileName = finalfilename[0];
      this.uploadedFile = file;

      // $("#uploadpackmaster").modal("show");
    } else {
      console.log(event.srcElement.files);
      var fileList2 = event.srcElement.files;
      var file: File = fileList2[0];
      this.fileName = file.name.toLowerCase();
      // var finalfilename = (this.fileName).split(".");
      // this.fileName = finalfilename[0];
      this.uploadedFile = file;
    }
  }


  uploadStockMaster() {
    if (this.uploadform.valid) {
      var form_id = "";

      let finalformdata: FormData = new FormData();
      finalformdata.append("filename", (this.fileName));
      finalformdata.append("file", (this.uploadedFile));

      var uploadPartMasterUrl = this.appconstant + "mis/storeUploadParts";
      this.loading = true;
      this.ds.postFile(uploadPartMasterUrl, finalformdata)

        .subscribe(uploaddata => {
          if (uploaddata.status == 'success') {
            this.loading = false;

            $("#partStockModal").modal("hide");
            $.notify('File Uploaded successfully !!', "success");
            this.uploadform.reset();
            this.fileName = '';
          }

        });
    }
    else {
      $('#partStockModal').modal("show");
      $.notify('File not Uploaded !!', "error");
    }
  }
  mislistDelete: any;
  formid: any;
  misDelete(id, data) {
    $('#deletelist').modal('show');
    this.mislistDelete = data;
    this.formid = id;
  }
  submitForm() {

    if (this.remarkform.valid) {
      var remarks = this.remarkform.value.remarks;
      var submitData = "formid=" + this.formid + "&status=deleted" + "&remarks=" + remarks + "&usertype=" + this.status;
      var urlValue = this.appconstant + 'mis' + '/updateFormStatus/';
      this.loading = true;
      this.ds.makeapi(urlValue, submitData, 'post')
        .subscribe(data2 => {
          if (data2.status == "Success") {
            this.loading = false;
            this.remarkform.reset();

            $('#deletelist').modal('hide');
            this.getmaterialform();
            $.notify('Material Form Deleted !!', "success");
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

  misrecall(id) {
    var submitData = "formid=" + id + "&status=recalled";
    var urlValue = this.appconstant + 'mis/updateFormStatus/';
    this.ds.makeapi(urlValue, submitData, 'post')
      .subscribe(data2 => {
        if (data2.status == 'Success') {
          this.getmaterialform();

        }

      }, Error => {

      });
  }
  editrecall(id) {
    localStorage.setItem("Pagination",String(this.currentPage))
    this.router.navigate(['dashboard/misedit'], {
      queryParams: { id: id }
    });
  }
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
    var senddata = { "shortid": userShortId, "usertype": this.status, "page": this.currentPage, "fromDate": this.setDate1, "toDate": this.setDate2, 'searchstr': this.alllistsearch }
    this.ds.makeapi(this.mislistapi, senddata, "postjson")
      .subscribe(data => {
        this.misformlist = data;
        this.misPaginationCount();
      },
        Error => {
        });


  }
  mislist() {
    this.router.navigateByUrl('/dashboard/materialissuesliplist');
  }


  pickColor(val) {
    return this.ds.StatusColor(val)
  }

}