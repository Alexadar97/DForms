import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { NotifierService } from 'angular-notifier';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { DataserviceService } from '../../dataservice.service';

declare var $,moment;

@Component({
  selector: 'app-mcslist',
  templateUrl: './mcslist.component.html',
  styleUrls: ['./mcslist.component.css']
})
export class McslistComponent implements OnInit {

  // private appconstant = 'http://13.234.64.82:8080/DaimForms/forms/';
  private appconstant = this.ds.appconstant;

  private sotformapi = this.appconstant + 'nmcs/list';
  private nmcsPaginateAPI = this.appconstant + 'nmcs/getPaginationCount'; 
  private downloadPDFnmcs = this.appconstant + 'nmcs/generatePDF/';
  mcslist;
  isStoreLogin = false;
  loading = false;
  notifier
  partsList;
  umcsremarkForm: FormGroup;
  remarkform: FormGroup;
  remarkdeleteform: FormGroup;
  p1 = 1;
  p2 = 1;
  selectedUserType = "ProtoL4"
  updateForm

  constructor(notifierService: NotifierService, private http: Http, private router: Router, private ds: DataserviceService, private fb: FormBuilder) {
    this.notifier = notifierService;
    var req = Validators.compose([Validators.required]);
    this.remarkform = fb.group({
      remarks: [null, req],
    });
    this.remarkdeleteform = fb.group({
      remarks: [null, req],
      check: []
    });

    this.updateForm = this.fb.group({
      'id':[''],
      'arr':[null],
    });

  }
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
    this.status = usertype
    this.loading = true;
    this.getnmcsform().subscribe(data => {
      // this.mcslist = data.sort((a, b) => Number(b.id) - Number(a.id));
      this.mcslist = data;
      for(var i=0;i<this.mcslist.length;i++ ){
       this.approvertype = this.mcslist[i]['approvertype'];
      }
      console.log(this.mcslist)
      this.loading = false;
    },
      Error => {
      });;

      this.nmcsPaginationCount();
      this.nmcsfilter();
  }
  partvalue: any
  openParts(data) {
    console.log(data)
    this.mcsdata = data
    //open the modal to show parts
    // $("#addcostcenter").modal("show");
    this.partsList = data['nmcsParts'];
    console.log(this.partsList)
    this.fetchStatus(data)
  }

  fetchStatus(statusdata){
    console.log(statusdata);
    var url = this.appconstant + 'nmcs/statusTracking';
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

  finasidval = []
  finasmodal(data) {
    //open the modal to show finasid

    this.finasidval = data

    $("#addcostcenter").modal("hide");
    $("#addfinasid").modal("show");

  }
  remaksvalue: any
  ConvertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    var row = "";

    for (var index in objArray[0]) {
      //Now convert each value to string and comma-separated
      row += index + ',';
    }
    row = row.slice(0, -1);
    //append Label row with line break
    str += row + '\r\n';

    for (var i = 0; i < array.length; i++) {
      var line = '';
      for (var index in array[i]) {
        if (line != '') line += ','

        line += array[i][index];
      }
      str += line + '\r\n';
    }
    return str;
  }
  // download(filename) {
  //   this.loading = true
  //   var urlValue = this.appconstant + 'nmcs' + '/downloadExcel/';
  //   var submitData = "";
  //   var userData = localStorage.getItem("Daim-forms");
  //   var jsonData = JSON.parse(userData);
  //   var userShortId = jsonData['shortid'];

  //   let reqdata = "usertype=" + this.status + "&shortid=" + userShortId;
  //   this.ds.method(urlValue, reqdata, 'downloadfileUrlencode')
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
  storeResponse(response) {
    if (this.remarkform.valid) {
      this.remaksvalue = $('#remarks').val()
      if (this.remaksvalue == '') {
        this.notifier.notify('error', 'Remark is Required!');
      } else {

        this.loading = true;
        var status = "";
        if (response) {
          status = "accepted"
        } else {
          status = "storerejected"
        }

        var submitData = "id=" + this.apprid + "&remarks=" + this.remaksvalue + "&status=" + status + "&usertype=" + this.selectedUserType;

        var urlValue = this.appconstant + 'nmcs' + '/updateFormStatus/';
        this.ds.makeapi(urlValue, submitData, 'post')
          .subscribe(data2 => {

            this.loading = false;
            this.getnmcsform().subscribe(data => {
              // this.mcslist = data.sort((a, b) => Number(b.id) - Number(a.id));
              this.mcslist = data
              $.notify('Store Acceptance Saved!', "success");
              // this.ds.notify('Store Acceptance Saved!','success');
              // this.notifier.notify('success', 'Store Acceptance Saved!');
              this.loading = false;
              this.remaksvalue = ''
            },
              Error => {
              });;




          }, Error => {
            this.loading = false;
            // this.notifier.notify('error', 'Store Response failed to Save!');
            $.notify('Store Response failed to Save!', "error");
          });
      }
      this.remarkform.reset();
    }
    else {
      // this.notifier.notify( 'error', 'Remark is Required!' );
      $.notify('Remark is Required!', "error");
    }
  }

  totalPartCount:any;
  currentPage = 1;
  totalPages = 10;
  nmcsPaginationCount(){
   
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    var userShortId = jsonData['shortid'];
    var submitData = {"usertype": this.status,"userid": userShortId,'searchstr': this.alllistsearch,"filterList":this.setvalues, "fromDate": this.setDate1, "toDate": this.setDate2 };
    this.ds.makeapi(this.nmcsPaginateAPI, submitData, "postjson")
      .subscribe(data => {
  
        var totalcount = data['pagecount'];
        this.totalPartCount = totalcount;
        this.totalPages = Math.ceil(this.totalPartCount/10)
        console.log(this.totalPages)

      },
        Error => {
        });
  }

  
  paginatePartList(page){
    console.log(page)
    if(page == 'prev' && this.currentPage > 1){
      if(page == 'prev'){
        this.loading = true;
      }
     else{
      this.loading = false;
     }
      this.currentPage = this.currentPage - 1
      console.log(this.currentPage)
   }
    else{
      if(page == 'next'){
        this.loading = true;
      }
     else{
      this.loading = false;
     }
      this.currentPage = this.currentPage + 1
      console.log(this.currentPage)
    }


    this.getnmcsform().subscribe(data => {
      // this.mcslist = data.sort((a, b) => Number(b.id) - Number(a.id));
      this.mcslist = data
      console.log(this.mcslist);
      this.loading = false;
  
    })
    localStorage.setItem("Pagination",String(this.currentPage))
  }
 
  searchPage(){
    this.loading = true;
    var inputPageValue = parseInt($("#currentPageInput").val())
    if(this.totalPages < inputPageValue){
     
      alert("Enter valid page number!");
      $("#currentPageInput").val(this.currentPage)
    }else{
      this.currentPage = inputPageValue;
  }
  this.getnmcsform().subscribe(data => {
    // this.mcslist = data.sort((a, b) => Number(b.id) - Number(a.id));
    this.mcslist = data
    this.loading = false
    console.log(this.mcslist)
  
  })
  localStorage.setItem("Pagination",String(this.currentPage))
}

  getnmcsform() {
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    var userShortId = jsonData['shortid'];
    let reqdata = {"userid":userShortId ,"usertype": this.usertype,"page" :this.currentPage,"filterList":this.setvalues, "fromDate": this.setDate1, "toDate": this.setDate2 };
    var usertype = '';
    if (jsonData['usertype']) {
      usertype = jsonData['usertype'].toLowerCase();
    }
    if (usertype === "store") {
      this.isStoreLogin = true;
    }

    // let reqdata = "usertype="+usertype;

    let url = this.sotformapi;
    let data = reqdata;
    const headers = new Headers();
    headers.append ('content-type', 'application/json');
    return this.http.post(url, data, { headers: headers })
      .map((response: Response) => response.json())
      .catch((error: any) => {
        this.loading = false;
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
    this.router.navigate(['dashboard/stoedit'], { queryParams: { id: id } });
  }
  addsto() {
    this.router.navigate(['dashboard/mcsnew'], {});
  }

  viewAction(id) {
    localStorage.setItem("Pagination",String(this.currentPage))
    let myObj = { name: 'praveen' };
    this.router.navigate(['dashboard/mcsedit'], {
      queryParams: { type: 'nmcs', id: id }
    });
  }

  upload() {
    //navigate to new page for file upload
    //nmcsupload
    this.router.navigate(['dashboard/nmcsupload'], {
      queryParams: { type: 'nmcs' }
    });
  }
  apprid: any
  mcsmodallist: any
  mcsdata
  approvelreject(id, data) {
    this.apprid = id

    console.log(this.partsList)
    $('#approvalreject').modal('show')
    this.partsList = data['nmcsParts'];
    var mcsjson = data
    var mcslist = [{ "creditorname": mcsjson.creditorname, "createddate": mcsjson.createddate, "department": mcsjson.department, "hrid": mcsjson.hrid, "approvername": mcsjson.approvername, "status": mcsjson.status }]
    this.mcsmodallist = mcslist
  }


  deputyvalues(event) {
    var userType = "L4"
    if (event.target.checked == true) {
      this.selectedUserType = "DeputyProtoL4";
      var urlValue = this.appconstant + 'user' + '/checkUser';
      var submitData = "usertype=" + this.selectedUserType;
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
      this.selectedUserType = "ProtoL4"
    }

  }

  alllistsearch = "";
  search(value) {
    this.alllistsearch = value;
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    var userShortId = jsonData['shortid'];
    let reqdata = {"usertype":this.status ,"userid": userShortId, "page":this.currentPage ,'searchstr':this.alllistsearch};
    return this.ds.makeapi(this.sotformapi, reqdata, "postjson")
      .subscribe(data => {
        this.mcslist = data;
        console.log(this.mcslist)
        this.nmcsPaginationCount();
      },
        Error => {
        });
  }

  
  isCheckall: any
  form_id:any;
  checkallpart=[];
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
      for(var i=0;i< this.mcslist.length;i++){
        this.form_id= this.mcslist[i].id;
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


  removeArr(val){
    var arr = this.checkclicksingle;
    var tmpArr = [];
    for(var i=0;i<arr.length;i++){
      if(arr[i] && arr[i]['id'] != val){
        tmpArr.push(arr[i])
      }
    }
    return tmpArr;
  }

  arrayCheck(val){
    var arr = this.checkclicksingle
    var ret = false;
    for(var i=0;i<arr.length;i++){
      if(arr[i] && arr[i]['id'] == val){
        ret = true
      }
    }
    return ret;
  }

  singlecheck(event, id) {
    this.isCheckall = false;
    this.singlecheck_id = id;
    this.eventchecked = event.target.checked
    if (this.eventchecked == true ) {

     if(!this.arrayCheck(id)){
      this.checkclicksingle.push({ "id": this.singlecheck_id })
     }
      console.log( this.checkclicksingle)
    }
    else if(this.eventchecked == false ){
      // this.checkclicksingle.push({ "id": this.singlecheck_id });
      
      if(this.arrayCheck(id)){
        this.checkallpart=[]
        // this.checkclicksingle.push({ "id": this.singlecheck_id })
        this.checkclicksingle = this.removeArr(id);
        
        console.log( this.checkclicksingle)
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
      this.loading=true;
      var formlist = []
      if(this.checkallpart != []){
        var submitData = { "nmcsIdList": this.checkallpart, "status": "" };
      }
    
     
      // console.log(filename)
      return this.ds.method(this.downloadPDFnmcs, submitData, "downloadfileZIPjson")
        .subscribe(res => {
          this.loading=false;
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
            this.loading=false;
          });
    }

    else if (this.checkclicksingle.length >0) {

      this.loading=true;
      if(this.checkclicksingle != []){
        var submitDatasing = { "nmcsIdList": this.checkclicksingle, "status": "" };
      }
   
      // console.log(filename)
      return this.ds.method(this.downloadPDFnmcs, submitDatasing, "downloadfileZIPjson")
        .subscribe(res => {
          this.loading=false;
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
            this.loading=false;
          });
    }
    else if(this.checkclicksingle.length == 0  ){
      $.notify('Please select the form to download the file!', "error");
  }
  }
  downloadExcel(filename) {
    this.loading = true
    var urlValue = this.appconstant + 'nmcs' + '/downloadExcel';
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    var userShortId = jsonData['shortid'];

    let reqdata = { "usertype": this.status, "userid": userShortId, "page": this.currentPage,"filterList":this.setvalues };
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
  nmcsfilter() {
    var urlValue = this.appconstant + 'nmcs/getFilterColumns/';
    this.ds.makeapi(urlValue, '', 'post')
      .subscribe(data => {
        this.getdepartment = data.department;
        this.getstatus = data.status;
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
  nmcslistbackup = [];
  setvalues = [];
  departmentfilter(event, key) {
    this.loading = true;
    console.log(event)
    if (event != null && event.target != null) {
      var isChecked = event.target.checked;
      var event = event.target.value;
      if (event == null) {
        this.mcslist = this.nmcslistbackup
        console.log(this.mcslist)
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
          senddata = { "userid":userShortId, "usertype": this.usertype, "page": this.currentPage, "filterList": [], 'searchstr': this.alllistsearch }
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
            this.mcslist = data;
            this.nmcsPaginationCount();
            this.loading = false;
            console.log(this.mcslist)

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
        this.mcslist = this.nmcslistbackup
        console.log(this.mcslist)
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
          senddata = { "userid":userShortId, "usertype": this.usertype, "page": this.currentPage, "filterList": [], 'searchstr': this.alllistsearch }
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
            this.mcslist = data;
            this.nmcsPaginationCount();
            this.loading = false;
            console.log(this.mcslist)

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
        this.mcslist = this.nmcslistbackup
        console.log(this.mcslist)
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

        senddata = { "userid": userShortId, "usertype": this.usertype, "page": this.currentPage, "filterList": this.setvalues, 'searchstr': this.alllistsearch }
        this.ds.makeapi(this.sotformapi, senddata, "postjson")
          .subscribe(data => {
            this.mcslist = data;
            this.nmcsPaginationCount(); 
            this.loading = false;
            console.log(this.mcslist)

          },
            Error => {
            });
      }
    } else {

    }


  }

  nmcslist(){
    this.router.navigateByUrl('/dashboard/mcslist');
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
        this.mcslist = data;
        this.nmcsPaginationCount();

        console.log(this.mcslist)

      },
        Error => {
        });

  }


  Recall(id) {
    this.loading =true;
    var submitData = "id=" + id + "&status=recalled";
    var urlValue = this.appconstant + 'nmcs/updateFormStatus/';
    this.ds.makeapi(urlValue, submitData, 'post')
      .subscribe(data2 => {
        if (data2.status == 'Success') {
          this.getnmcsform().subscribe(data => {
  
            this.mcslist = data;
      
            this.loading = false;
          })
        
        }

      }, Error => {

      });
  }
  RecallEdit(id) {
    localStorage.setItem("Pagination",String(this.currentPage))
    this.router.navigate(['dashboard/nmcs-recall'], {
      queryParams: { id: id }
    });
  }
  pickColor(val){
    return this.ds.StatusColor(val)
  }
  nmcslistDelete: any;
  formid: any;
  nmcsDelete(id, data) {
    $('#deletelist').modal('show');
    this.nmcslistDelete = data;
    this.formid = id;
  }
  submitForm() {
   
    if (this.remarkform.valid) {
      var remarks = this.remarkform.value.remarks;
      var submitData = "id=" + this.formid + "&status=deleted" + "&remarks=" + remarks + "&usertype=" + this.status;
      var urlValue = this.appconstant + 'nmcs' + '/updateFormStatus/';
      this.loading = true;
      this.ds.makeapi(urlValue, submitData, 'post')
        .subscribe(data2 => {
          if (data2.status == "Success") {
            this.loading = false;
            this.remarkform.reset();
            $('#deletelist').modal('hide');
            this.getnmcsform().subscribe(data => {
              this.mcslist = data;
              this.loading = false;
            }),
            $.notify('Nmcs Form Deleted !!', "success");
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
