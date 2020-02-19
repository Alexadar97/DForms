import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { DataserviceService } from '../../dataservice.service';
import { NotifierService } from 'angular-notifier';
declare var $,moment;
@Component({
  selector: 'app-protolist',
  templateUrl: './protolist.component.html',
  styleUrls: ['./protolist.component.css']
})
export class ProtolistComponent implements OnInit {
  protolist;
  loading = false;
  remarkform: FormGroup;
  status: any;
  Shortid;
  usertype: any;
  private userShortId;
  p1 = 1;
  p2 = 1;
  p3 = 1;



  formStatus = null;
  isProtoVehicleOwner = false;
  isProtoHDTSupervisor = false;
  isProtoMDTSupervisor = false;
  isProtoAggregateSupervisor = false;
  isProtoMaintenanceSupervisor = false;
  isProtoEandESupervisor = false;
  isProtoPPSSupervisor = false;
  isProtoMechanicalSupervisor = false;
  isProtoadmin = false;
  isL4 = false;
  isProtoreq = false;
  isOFMVisible = false;
  isAggregateShowEdit = false;
  constructor(notifierService: NotifierService, private fb: FormBuilder, private router: Router, private ds: DataserviceService, private http: Http) {
    var req = Validators.compose([Validators.required]);
    this.remarkform = fb.group({
      remarks: [null, req],
    });
    this.updateForm = this.fb.group({
      'id':[''],
      'arr':[null],
    });
  }

  private appconstant = this.ds.appconstant;
  private protolistapi = this.appconstant + 'proto/list';
  private protoPaginateAPI = this.appconstant + 'proto/getPaginationCount';
  private listDownloadAPI = this.appconstant + 'proto/listAOfilename';
  private fileDownloadAPI = this.appconstant + 'proto/downloadAOFile';
  private downloadPDFproto = this.appconstant + 'proto/generatePDF/';
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
    var usertype = '';

    if (jsonData['usertype']) {
      usertype = jsonData['usertype'].toLowerCase();
      this.usertype = usertype
      this.Shortid = userShortId
    }
    if (usertype === "protovehicleowner") {
      this.status = 'protovehicleowner'
      this.isProtoVehicleOwner = true;
    } else if (usertype === "hdtsupervisor") {
      this.status = 'hdtsupervisor'
      this.isProtoHDTSupervisor = true;
    }
    else if (usertype === "mdtsupervisor") {
      this.status = 'mdtsupervisor'
      this.isProtoMDTSupervisor = true;
    }
    else if (usertype === "aggregatesupervisor") {
      this.status = 'aggregatesupervisor'
      this.isProtoAggregateSupervisor = true;
    }
    else if (usertype === "eandesupervisor") {
      this.status = 'eandesupervisor'
      this.isProtoEandESupervisor = true;
    }
    else if (usertype === "ppssupervisor") {
      this.status = 'ppssupervisor'
      this.isProtoPPSSupervisor = true;
    }
    else if (usertype === "maintenancesupervisor") {
      this.status = 'maintenancesupervisor'
      this.isProtoMaintenanceSupervisor = true;
    }
    else if (usertype === "mechanicalsupervisor") {
      this.status = 'mechanicalsupervisor'
      this.isProtoMechanicalSupervisor = true;
    }
    else if (usertype === "admin") {
      this.status = 'admin'
      this.isProtoadmin = true
    }
    else if (usertype === "L4" || usertype === "l4") {
      this.status = 'L4'
      this.isL4 = true;
    }
    else if (usertype === "requester") {
      this.status = ''
      this.isProtoreq = true;
    }
    else {
      this.status = '';
    }
    this.status = usertype
    this.getprotoform();
    this.protoPaginationCount();
    this.protofilter();

    this.isOFMVisible = this.isProtoHDTSupervisor || this.isProtoMDTSupervisor || this.isProtoAggregateSupervisor || this.isProtoEandESupervisor || this.isProtoPPSSupervisor || this.isProtoMaintenanceSupervisor || this.isProtoMechanicalSupervisor || this.isProtoadmin;

    this.isAggregateShowEdit = this.supervisorstatus == 'vehicleownerapproved' || this.supervisorstatus == 'protol4approved' || this.supervisorstatus == 'supervisorpending' || this.supervisorstatus == 'hdtsupervisorapproved' || this.supervisorstatus == 'mdtsupervisorapproved' ||
      this.supervisorstatus == 'aggregatesupervisorapproved' || this.supervisorstatus == 'eandesupervisorapproved' || this.supervisorstatus == 'ppssupervisorapproved' || this.supervisorstatus == 'maintenancesupervisorapproved' ||
      this.supervisorstatus == 'mechanicalsupervisorapproved'

  }

  addproto() {
    this.router.navigate(['dashboard/protonew'], {});
  }

  showOFM() {
    this.router.navigate(['dashboard/ofm'], {})
  }




  EditProtovehicle(data, userType) {
    localStorage.setItem("Pagination",String(this.currentPage))
    localStorage.setItem("protoformsdata", JSON.stringify(data));
    localStorage.setItem("proto_usertype", userType);
    this.router.navigate(['dashboard/protoedit']);
  }
  EditProtoSupervisor(data, userType) {
    localStorage.setItem("Pagination",String(this.currentPage))
    localStorage.setItem("protoformsdata", JSON.stringify(data));
    localStorage.setItem("proto_usertype", userType);
    this.router.navigate(['dashboard/protoedit']);
  }

  EditProto(data, userType) {
    localStorage.setItem("Pagination",String(this.currentPage))
    localStorage.setItem("protoformsdata", JSON.stringify(data));
    localStorage.setItem("proto_usertype", userType);
    this.router.navigate(['dashboard/protoedit']);
  }
  // EditProtoHDTsupervisor(data, userType) {
  //   localStorage.setItem("protoformsdata", JSON.stringify(data));
  //   localStorage.setItem("proto_usertype", userType);
  //   this.router.navigate(['dashboard/protoedit']);
  // }
  // EditProtoMDTsupervisor(data, userType) {
  //   localStorage.setItem("protoformsdata", JSON.stringify(data));
  //   localStorage.setItem("proto_usertype", userType);
  //   this.router.navigate(['dashboard/protoedit']);
  // }
  // EditProtoAggregatesupervisor(data, userType) {
  //   localStorage.setItem("protoformsdata", JSON.stringify(data));
  //   localStorage.setItem("proto_usertype", userType);
  //   this.router.navigate(['dashboard/protoedit']);
  // }
  // EditProtoEandEsupervisor(data, userType) {
  //   localStorage.setItem("protoformsdata", JSON.stringify(data));
  //   localStorage.setItem("proto_usertype", userType);
  //   this.router.navigate(['dashboard/protoedit']);
  // }
  // EditProtoPPSsupervisor(data, userType) {
  //   localStorage.setItem("protoformsdata", JSON.stringify(data));
  //   localStorage.setItem("proto_usertype", userType);
  //   this.router.navigate(['dashboard/protoedit']);
  // }
  // EditProtoMaintenancesupervisor(data, userType) {
  //   localStorage.setItem("protoformsdata", JSON.stringify(data));
  //   localStorage.setItem("proto_usertype", userType);
  //   this.router.navigate(['dashboard/protoedit']);
  // }
  // EditProtoMechanicalsupervisor(data, userType) {
  //   localStorage.setItem("protoformsdata", JSON.stringify(data));
  //   localStorage.setItem("proto_usertype", userType);
  //   this.router.navigate(['dashboard/protoedit']);
  // }

  protoBCAForm(data) {
    this.router.navigate(['/protobcaview']);
    localStorage.setItem("protoformsdata", JSON.stringify(data));
    // localStorage.setItem("proto_usertype", userType);
  }

  protoRecall(id) {
    var submitData = "id=" + id + "&status=recalled";
    var urlValue = this.appconstant + 'proto/updateFormStatus/';
    this.ds.makeapi(urlValue, submitData, 'post')
      .subscribe(data2 => {
        if (data2.status == 'Success') {
          this.getprotoform();

        }

      }, Error => {

      });
  }
  protoRecallEdit(id) {
    localStorage.setItem("Pagination",String(this.currentPage))
    this.router.navigate(['dashboard/protorecalledit'], {
      queryParams: { id: id }
    });
  }
  totalPartCount: any;
  protoPaginationCount() {
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    var userShortId = jsonData['shortid'];
    var submitData = { "usertype": this.status, "shortid": userShortId, "searchstr": this.alllistsearch, "filterList": this.setvalues, "fromDate": this.setDate1, "toDate": this.setDate2 }
    this.ds.makeapi(this.protoPaginateAPI, submitData, "postjson")
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
    console.log(page)
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
      console.log(this.currentPage)
    }

    this.getprotoform()
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
    this.getprotoform()
    localStorage.setItem("Pagination",String(this.currentPage))
  }
  editbcasheet;
  id;
  requestorid;
  finasupdate;
  supervisorstatus;
  isreqapproved;
  getprotoform() {
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    var userShortId = jsonData['shortid'];
    let reqdata = { "usertype": this.status, "shortid": userShortId, "page": this.currentPage, "filterList": this.setvalues, "fromDate": this.setDate1, "toDate": this.setDate2  }
    this.ds.makeapi(this.protolistapi, reqdata, "postjson")
      .subscribe(data => {
        // this.protolist =data.sort((a, b) => Number(b.id) - Number(a.id))

        this.protolist = data;

        for (var i = 0; i < data.length; i++) {
          if(data[i]['isreqapproved'] == 0){
            this.isreqapproved = 0;
          } 
        }
        // debugger
        this.loading = false
        console.log(data)
      },
        Error => {
          this.loading = false;
        });
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

  partdetaillist: any;

  partdetails(data) {
    $('#partdetails').modal('show');
    this.partdetaillist = data['umcsParts'];
    console.log(this.partdetaillist);
  }
  fileNameArr = [];
  fileDownloadList = [];
  listfileid;
  downloadlist() {
    this.fileDownloadList = [];
    var submitData = "formid=" + this.form_id;
    this.ds.makeapi(this.listDownloadAPI, submitData, 'post')
      .subscribe(data2 => {
        for (var i = 0; i < data2.length; i++) {
          this.fileDownloadList.push(data2[i]);
          this.listfileid = data2[i].id;
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


  arrrequest = [];
  arrlist = [];
  protoworkrequest: any;
  arrfunction;
  arrvalue = [];
  arrproto = [];
  arrlists = []
  prototype: any;
  arrcategory = [];
  arrcategorylist = [];
  category: any
  protoData: any;
  form_id;
  fitmentreport;
  aodrawing;
  updateForm
  fetchStatus(statusdata){
    console.log(statusdata);
    var url = this.appconstant + 'proto/statusTracking';
    this.ds.method(url+"?formid="+statusdata.id, '', 'get')
    .subscribe(res => {
      // this.partsList = statusdata['umcsParts'];
      console.log(res);
    //  this.statusValues = res;
     this.updateForm.patchValue({arr:res})
      $("#addcostcenter").modal("show");
     
      
      
    }, Error => {
      console.log(Error);
    });

  }

  viewForm(data) {
    this.fetchStatus(data)
    $('#protototalform').modal('show');
    this.protoData = data;
    this.finasupdate = data['finasupdate'];
    this.fitmentreport = data['fitmentreport'];
    this.aodrawing = data['aodrawing'];
    this.form_id = data['id']
    

    // split the category values

    this.arrcategory = [];
    this.arrcategorylist = []
    var category = data.category;
    this.category = category;
    this.arrcategory.push(this.category);
   
    for (var i = 0; i < this.arrcategory.length; i++) {
      for (var j = 0; j < this.arrcategory[i].split(",").length; j++) {
        this.arrcategorylist.push(this.arrcategory[i].split(",")[j]);
      }

    }
   

    // split the subfunctions values

    this.arrvalue = [];
    this.arrlist = []
    this.arrfunction = data.subsupervisor;
    this.arrvalue.push(this.arrfunction);
  
    for (var i = 0; i < this.arrvalue.length; i++) {
      for (var j = 0; j < this.arrvalue[i].split(",").length; j++) {
        this.arrlist.push(this.arrvalue[i].split(",")[j]);
      }
    }
  

    // split the Types of Activity values

    this.arrproto = [];
    this.arrlists = []
    var typeactivity = data.retrofitmenttype;
    this.prototype = typeactivity;
    this.arrproto.push(this.prototype);
 
    for (var i = 0; i < this.arrproto.length; i++) {
      for (var j = 0; j < this.arrproto[i].split(",").length; j++) {
        this.arrlists.push(this.arrproto[i].split(",")[j]);
      }
    }

    if (this.aodrawing == 0) {
      this.downloadlist();
    }
  }

  protolistDelete: any;
  formid: any;
  protoDelete(id, data) {
    $('#deletelist').modal('show');
    this.protolistDelete = data;
    this.formid = id;
  }
  submitForm() {
   
    if (this.remarkform.valid) {
      var remarks = this.remarkform.value.remarks;
      var submitData = "id=" + this.formid + "&status=deleted" + "&remarks=" + remarks + "&usertype=" + this.status;
      var urlValue = this.appconstant + 'proto' + '/updateFormStatus';
      this.loading = true;
      this.ds.makeapi(urlValue, submitData, 'post')
        .subscribe(data2 => {
          if (data2.status == "Success") {
            this.loading = false;
            this.remarkform.reset();
            $('#deletelist').modal('hide');
            this.getprotoform();
            $.notify('Proto Form Deleted !!', "success");
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

  umcsInitiate(id) {
    // var id = this.formid
    this.router.navigate(['dashboard/umcsnew'], { queryParams: { id: id } });
    this.getprotoform();
  }

  alllistsearch = "";
  search(value) {
    this.alllistsearch = value;
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    var userShortId = jsonData['shortid'];
    let reqdata = { "usertype": this.status, "shortid": userShortId, "page": this.currentPage, "filterList": [], "searchstr": this.alllistsearch };
    return this.ds.makeapi(this.protolistapi, reqdata, "postjson")
      .subscribe(data => {
        this.protolist = data;
        this.protoPaginationCount();
      },
        Error => {
        });

  }


  isCheckall: any
  FilterByCategorylist = [];
  checkallpart = [];
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
      for (var i = 0; i < this.protolist.length; i++) {
        this.form_id = this.protolist[i].id;
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
    var arr = this.checkclicksingle;
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
   
    }
    else if (this.eventchecked == false) {
      // this.checkclicksingle.push({ "id": this.singlecheck_id });

      if (this.arrayCheck(id)) {
        // this.checkclicksingle.push({ "id": this.singlecheck_id })
        this.checkclicksingle = this.removeArr(id);
        this.checkallpart = [];
      
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
        var submitData = { "protoIdList": this.checkallpart, "status": "" };
      }

      // console.log(filename)
      return this.ds.method(this.downloadPDFproto, submitData, "downloadfileZIPjson")
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
        var submitDatasing = { "protoIdList": this.checkclicksingle, "status": "" };
      }

      // console.log(filename)
      return this.ds.method(this.downloadPDFproto, submitDatasing, "downloadfileZIPjson")
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
  downloadExcel(filename) {
    this.loading = true
    var urlValue = this.appconstant + 'proto' + '/downloadExcel';
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



  getstatus = [];
  getfunction = [];
  getumcsstatus = [];
  getapproverl4=[]
  protofilter() {
    var urlValue = this.appconstant + 'proto/getFilterColumns/';
    this.ds.makeapi(urlValue, '', 'post')
      .subscribe(data => {
        this.getfunction = data.supervisor;
        this.getumcsstatus = data.umcsstatus;
        this.getstatus = data.status;
        this.getapproverl4 = data.l4name;

      }, Error => {

      });

  }
  isselected: any;
  functionvalues = [];
  functionTypeArr(isChecked, event) {
    if (isChecked) {
      //existing logic
      this.functionvalues.push(event)
      this.isselected = "true"

    } else {
      //for loop - remove the event  - this.typevalue
      var tmpArr = []
      for (var x = 0; x < this.functionvalues.length; x++) {
        if (this.functionvalues[x] != event) {
          tmpArr.push(this.functionvalues[x])
        }

      }

      this.functionvalues = tmpArr;
    }
  }
  protolistbackup = [];
  setvalues = [];
  functionfilter(event, key) {
    console.log(event);
    this.loading = true;
    if (event != null && event.target != null) {
      var isChecked = event.target.checked;
      var event = event.target.value;
      if (event == null) {
        this.protolist = this.protolistbackup
        console.log(this.protolist)
      } else {
        this.functionTypeArr(isChecked, event)

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

        var reqdata = { "filtertype": key, "values": this.functionvalues }
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
        this.ds.makeapi(this.protolistapi, senddata, "postjson")
          .subscribe(data => {
            this.protolist = data;
            this.protoPaginationCount();
            this.loading = false;
            console.log(this.protolist)

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
        this.protolist = this.protolistbackup
        console.log(this.protolist)
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
        this.ds.makeapi(this.protolistapi, senddata, "postjson")
          .subscribe(data => {
            this.protolist = data;
            this.protoPaginationCount();
            this.loading = false;
            console.log(this.protolist)

          },
            Error => {
            });
      }
    } else {

    }


  }
  umcsstatusvalues = [];
  umcsstatusTypeArr(isChecked, event) {
    if (isChecked) {
      //existing logic
      this.umcsstatusvalues.push(event)
      this.isselected = "true"

    } else {
      //for loop - remove the event  - this.typevalue
      var tmpArr = []
      for (var x = 0; x < this.umcsstatusvalues.length; x++) {
        if (this.umcsstatusvalues[x] != event) {
          tmpArr.push(this.umcsstatusvalues[x])
        }

      }

      this.umcsstatusvalues = tmpArr;
    }
  }

  umcsstatusfilter(event, key) {
    console.log(event)
    this.loading = true;
    if (event != null && event.target != null) {
      var isChecked = event.target.checked;
      var event = event.target.value;
      if (event == null) {
        this.protolist = this.protolistbackup
        console.log(this.protolist)
      } else {
        this.umcsstatusTypeArr(isChecked, event)

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

        var reqdata = { "filtertype": key, "values": this.umcsstatusvalues }
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
        this.ds.makeapi(this.protolistapi, senddata, "postjson")
          .subscribe(data => {
            this.protolist = data;
            this.protoPaginationCount();
            this.loading = false;
            console.log(this.protolist)

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
  stolistbackup=[]
  approverl4ilter(event, key) {
    this.loading = true;
    console.log(event)
    if (event != null && event.target != null) {
      var isChecked = event.target.checked;
      var event = event.target.value;
      if (event == null) {
        this.protolist = this.protolistbackup
        console.log(this.protolist)
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
        this.ds.makeapi(this.protolistapi, senddata, "postjson")
          .subscribe(data => {
            this.protolist = data;
            this.protoPaginationCount();
            this.loading = false;
            console.log(this.protolist)

          },
            Error => {
            });
      }
    } else {

    }


  }
  protolists(){
    this.router.navigateByUrl('/dashboard/protolist');
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
    this.ds.makeapi(this.protolistapi, senddata, "postjson")
      .subscribe(data => {
        this.protolist = data;
        this.protoPaginationCount();


      },
        Error => {
        });

  }

  pickColor(val) {
    return this.ds.StatusColor(val)
  }
  umcsColor(val){
    return this.ds.UMCSColor(val)
  }
  
}
