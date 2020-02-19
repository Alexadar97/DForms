import { Component, OnInit, ɵConsole } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { DataserviceService } from '../../dataservice.service';
import { NotifierService } from 'angular-notifier';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
declare var $, moment;
declare var _;

@Component({
  selector: 'app-stolist',
  templateUrl: './stolist.component.html',
  styleUrls: ['./stolist.component.css']
})
export class StolistComponent implements OnInit {

  private appconstant = this.ds.appconstant;
  loading = false;
  uploadform: FormGroup;
  private sotformapi = this.appconstant + 'sto/list';
  private stoPaginateAPI = this.appconstant + 'sto/getPaginationCount';
  private downloadPDFsto = this.appconstant + 'sto/generatePDF/';
  private statusTracking = this.appconstant + 'sto/statusTracking'
  private validatePartFileAPI = this.appconstant + 'part/validatePartFile'
  stolist;
  remarkform: FormGroup;
  p1 = 1;
  p2 = 1;
  p3 = 1;
  p4 = 1;
  p5 = 1;
  stoData;
  UploadPartmasterfinallfile = '';
  issmpartialapproved;
  isBudgetApprover = false;
  isStoreUser = false;
  isSm = false;
  isIpl = false;
  isPartsplanner = false;
  // isBudgetApprover = false;
  date: any;
  initialDate;
  bsRangeValue;
  maxDate;
  bsConfig;
  firstdate: any
  lastDate: any
  setFirstdate: any
  setLastDate: any
  datevalue: any
  isStorereq = false;
  constructor(private http: Http, private router: Router, private fb: FormBuilder, private ds: DataserviceService, notifierService: NotifierService) {
    var req = Validators.compose([Validators.required]);
    this.remarkform = fb.group({
      remarks: [null, req],
    });
    this.updateForm = this.fb.group({
      'id':[''],
      'arr':[null],
    });
  }

  status: any
  usertype: any;
  Shortid: any;
  form_id: any;

  ngOnInit() {
    var currentpage = localStorage.getItem("Pagination")
    if(Number(currentpage) == 0){
        this.currentPage = 1
    }else{
      this.currentPage = Number(currentpage)
    }
   
    var req = Validators.compose([Validators.required]);
    // this.ds.notify("testing","success");
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
      this.status = ''
      this.isStorereq = true;
    }
    else {
      this.status = '';
    }
    this.status = usertype
    this.loading = true;
    this.getstoform().subscribe(data => {
      // this.stolist = data.sort((a, b) => Number(b.id) - Number(a.id));
      this.stolist = data;
      for (var i = 0; i < this.stolist.length; i++) {
        this.issmpartialapproved = this.stolist['issmpartialapproved'];
      }
      console.log(this.stolist)
      this.loading = false;
    },
      Error => {
        this.loading = false;
      });;

    $("#uploadFilePartidl").on('change', function (e) {
      console.log('file changed');
    });
    this.stoPaginationCount()
    this.stofilter();
  }


  upload() {
    this.router.navigate(['dashboard/stoupload'], {
      queryParams: { type: 'sto' }
    });
  }
  totalPartCount: any;
  stoPaginationCount() {
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    var userShortId = jsonData['shortid'];
    var submitData = { "usertype": this.status, "shortid": userShortId, "searchstr": this.alllistsearch, "filterList": this.setvalues, "fromDate": this.setDate1, "toDate": this.setDate2 };
    this.ds.makeapi(this.stoPaginateAPI, submitData, "postjson")
      .subscribe(data => {

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
      console.log(this.currentPage);

    }


    this.getstoform().subscribe(data => {
      //  this.stolist = data.sort((a, b) => Number(b.id) - Number(a.id));
      this.stolist = data;
      console.log(this.stolist)
      this.loading = false;
    })

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
    this.getstoform().subscribe(data => {
      // this.stolist = data.sort((a, b) => Number(b.id) - Number(a.id));
      this.stolist = data;

      console.log(this.stolist)
      this.loading = false;
    })
    localStorage.setItem("Pagination",String(this.currentPage))
  }
  getstoform() {
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    var userShortId = jsonData['shortid'];
    let reqdata = { "usertype": this.status, "shortid": userShortId, "page": this.currentPage, "filterList": this.setvalues, "fromDate": this.setDate1, "toDate": this.setDate2 };

    let url = this.sotformapi;
    let data = reqdata;


    const headers = new Headers();
    headers.append('content-type', 'application/json');
    return this.http.post(url, data, { headers: headers })
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

  editsot(id) {
    localStorage.setItem("Pagination",String(this.currentPage))
    this.router.navigate(['dashboard/stoedit'], { queryParams: { id: id } });
  }
  addsto() {
    this.router.navigate(['dashboard/stonew'], {});
  }
  statusValues = []
  updateForm;
  fetchStatus(){
  
    
    this.ds.method(this.statusTracking+"?formid="+this.stoData.id, '', 'get')
    .subscribe(res => {
      this.partsList = this.stoData['stoParts'];
      console.log(res);
     this.statusValues = res;
     this.updateForm.patchValue({arr:res})
      $("#editmodal").modal("show");
     
      
      
    }, Error => {
      console.log(Error);
    });
  }
  

  partsList;
  stovendor=[];
  vendorcode:any;
  vendorname:any;
  view(data) {
    this.stoData = data;
    this.fetchStatus()
    // $("#editmodal").modal("show");
    // // localStorage.setItem('stoedit',JSON.stringify(data));
    // // this.router.navigate(['dashboard/stoedit'], { queryParams: { id: data.id,data:data } });

    // this.partsList = data['stoParts'];

  }
  vendorVal = []
  openVendor(data) {
  
    this.vendorVal = data
   
    $("#editmodal").modal("hide");
    $("#vendorcode").modal("show");

  }
  vendorName:any;
  openVendorName(data){
    this.vendorName = data
    $("#editmodal").modal("hide");
    $("#vendorname").modal("show");

  }

LocationVal:any;
  openLocation(data){
    this.LocationVal = data;
    $("#location").modal("hide");
    $("#vendorname").modal("show");

  }
  close() {
    $("#editmodal").modal("hide");

  }

  Edit(data, userType) {
    //console.log(data);
    localStorage.setItem("stoformsdata", JSON.stringify(data));
    localStorage.setItem("sto_usertype", userType);
    this.router.navigate(['dashboard/stoedit']);
  }


  uploadModal() {
    $("#partMasterModal").modal("show");
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
      this.fileName = file.name;
      var finalfilename = (this.fileName).split(".");
      this.fileName = finalfilename[0];
      this.uploadedFile = file;

      // $("#uploadpackmaster").modal("show");
    } else {
      console.log(event.srcElement.files);
      var fileList2 = event.srcElement.files;
      var file: File = fileList2[0];
      this.fileName = file.name;
      var finalfilename = (this.fileName).split(".");
      this.fileName = finalfilename[0];
      this.uploadedFile = file;
    }
  }

  uploadPartMaster() {
    // open a modal and upload the excel file

    // partMasterModal


    if (this.uploadform.valid) {
      var form_id = "";
      let finalformdata: FormData = new FormData();
      finalformdata.append("filename", (this.fileName));
      finalformdata.append("file", (this.uploadedFile));
      this.ds.postFile(this.validatePartFileAPI, finalformdata)
      .subscribe(error => {
           if(error.status == "Success"){
        
      // let finalformdata: FormData = new FormData();
      finalformdata.append("filename", (this.fileName));
      finalformdata.append("file", (this.uploadedFile));

      var uploadPartMasterUrl = this.appconstant + "part/uploadPart";
      this.loading = true;
      this.ds.postFile(uploadPartMasterUrl, finalformdata)

        .subscribe(uploaddata => {
          if (uploaddata.status == 'success') {
            this.loading = false;
            $("#partMasterModal").modal("hide");
            $.notify('File Uploaded successfully !!', "success");
            // this.ds.notify('File Uploaded successfully !!', "success");
            this.uploadform.reset();
          }

        });
      }  else{
          $.notify(error.status+' '+'!!', "error");
          this.loading = false;
         }
      })
      Error=>{}
    }
    else {
      console.log(this.ds.findInvalidControls(this.uploadform));
      $('#partMasterModal').modal("show");
      $.notify('File not Uploaded !!', "error");
      // this.ds.notify('File not Uploaded !!', "error");

    }
  }

  cancelModal() {
    $("#partMasterModal").modal("hide");
  }
  downloadExcel(filename) {
    this.loading = true
    var urlValue = this.appconstant + 'sto' + '/downloadExcel';
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

  alllistsearch = "";
  search(value) {
    this.alllistsearch = value;
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    var userShortId = jsonData['shortid'];
    let reqdata = { "usertype": this.status, "shortid": userShortId, 'searchstr': this.alllistsearch }
    return this.ds.makeapi(this.sotformapi, reqdata, "postjson")
      .subscribe(data => {
        this.stolist = data;
        this.stoPaginationCount();
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
      for (var i = 0; i < this.stolist.length; i++) {
        this.form_id = this.stolist[i].id;
        this.checkallpart.push({ "id": this.form_id })
      }

      this.checkclicksingle = this.checkallpart;

    }
    else {
      $('.checksingle:checkbox').prop('checked', false);
      this.FilterByCategorylist = [];
      this.checkallpart = []
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
    console.log(this.isCheckall);
    console.log(this.checkclicksingle);
    
    if (this.isCheckall == true) {
      this.loading = true
      if (this.checkallpart != []) {
        var submitData = { "stoIdList": this.checkallpart, "status": "" };
      }


      return this.ds.method(this.downloadPDFsto, submitData, "downloadfileZIPjson")
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
        var submitDatasing = { "stoIdList": this.checkclicksingle, "status": "" };
      }

      return this.ds.method(this.downloadPDFsto, submitDatasing, "downloadfileZIPjson")
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

  getexigencycase = [];
  getstatus = [];
  getapproverl4 = [];
  getapproverl3 = [];
  stofilter() {
    var urlValue = this.appconstant + 'sto/getFilterColumns/';
    this.ds.makeapi(urlValue, '', 'post')
      .subscribe(data => {
        this.getexigencycase = data.exigency;
        this.getapproverl4 = data.l4name;
        this.getapproverl3 = data.l3name;
        this.getstatus = data.status;

      }, Error => {

      });

  }
  isselected: any;
  exigencyvalues = [];
  exigencyTypeArr(isChecked, event) {
    if (isChecked) {
      //existing logic
      this.exigencyvalues.push(event)
      this.isselected = "true"

    } else {
      //for loop - remove the event  - this.typevalue
      var tmpArr = []
      for (var x = 0; x < this.exigencyvalues.length; x++) {
        if (this.exigencyvalues[x] != event) {
          tmpArr.push(this.exigencyvalues[x])
        }

      }

      this.exigencyvalues = tmpArr;
    }
  }
  stolistbackup = [];
  setvalues = [];
  exigencyfilter(event, key) {
    this.loading = true;
    console.log(event)
    if (event != null && event.target != null) {
      var isChecked = event.target.checked;
      var event = event.target.value;
      if (event == null) {
        this.stolist = this.stolistbackup
        console.log(this.stolist)
      } else {
        this.exigencyTypeArr(isChecked, event)

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

        var reqdata = { "filtertype": key, "values": this.exigencyvalues }
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
        this.ds.makeapi(this.sotformapi, senddata, "postjson")
          .subscribe(data => {
            this.stolist = data;
            this.stoPaginationCount()
            this.loading = false;
            console.log(this.stolist)

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
        this.stolist = this.stolistbackup
        console.log(this.stolist)
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
        this.ds.makeapi(this.sotformapi, senddata, "postjson")
          .subscribe(data => {
            this.stolist = data;
            this.stoPaginationCount();
            this.loading = false;
            console.log(this.stolist)

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
        this.stolist = this.stolistbackup
        console.log(this.stolist);
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
        this.ds.makeapi(this.sotformapi, senddata, "postjson")
          .subscribe(data => {
            this.stolist = data;
            this.stoPaginationCount();
            this.loading = false;
            console.log(this.stolist)

          },
            Error => {
            });
      }
    } else {

    }


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
    this.ds.makeapi(this.sotformapi, senddata, "postjson")
      .subscribe(data => {
        this.stolist = data;
        this.stoPaginationCount();
        this.loading = false;
        console.log(this.stolist)

      },
        Error => {
        });

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
        this.stolist = this.stolistbackup
        console.log(this.stolist)
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
        this.ds.makeapi(this.sotformapi, senddata, "postjson")
          .subscribe(data => {
            this.stolist = data;
            this.stoPaginationCount();
            this.loading = false;
            console.log(this.stolist)

          },
            Error => {
            });
      }
    } else {

    }


  }
  backHome() {
    this.router.navigateByUrl('/home');
  }
  stodash() {
    this.router.navigate(['dashboard/sto-dashboard'], {});
  }
  tcpdash() {
    this.router.navigate(['dashboard/tcp-dashboard'], {});
  }

  Recall(id) {
    this.loading = true;
    var submitData = "id=" + id + "&status=recalled";
    var urlValue = this.appconstant + 'sto/updateFormStatus/';
    this.ds.makeapi(urlValue, submitData, 'post')
      .subscribe(data2 => {
        if (data2.status == 'Success') {
          this.getstoform().subscribe(data => {

            this.stolist = data;

            this.loading = false;
          })

        }

      }, Error => {

      });
  }
  RecallEdit(id) {
    localStorage.setItem("Pagination",String(this.currentPage))
    this.router.navigate(['dashboard/sto-recall'], {
      queryParams: { id: id }
    });
  }
  pickColor(val){
    return this.ds.StatusColor(val)
  }

  stolistDelete: any;
  formid: any;
  stoDelete(id, data) {
    $('#deletelist').modal('show');
    this.stolistDelete = data;
    this.formid = id;
  }
  submitForm() {
   
    if (this.remarkform.valid) {
      var remarks = this.remarkform.value.remarks;
      var submitData = "id=" + this.formid + "&status=deleted" + "&remarks=" + remarks + "&usertype=" + this.status;
      var urlValue = this.appconstant + 'sto' + '/updateFormStatus/';
      this.loading = true;
      this.ds.makeapi(urlValue, submitData, 'post')
        .subscribe(data2 => {
          if (data2.status == "Success") {
            this.loading = false;
            this.remarkform.reset();
            $('#deletelist').modal('hide');
           
    this.getstoform().subscribe(data => {
      //  this.stolist = data.sort((a, b) => Number(b.id) - Number(a.id));
      this.stolist = data;
      console.log(this.stolist)
      this.loading = false;
    })

            $.notify('Sto Form Deleted !!', "success");
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
