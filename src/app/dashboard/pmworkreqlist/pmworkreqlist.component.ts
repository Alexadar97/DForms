import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NotifierService } from 'angular-notifier';
import { DataserviceService } from '../../dataservice.service';
declare var $, moment;
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
@Component({
  selector: 'app-pmworkreqlist',
  templateUrl: './pmworkreqlist.component.html',
  styleUrls: ['./pmworkreqlist.component.css']
})
export class PmworkreqlistComponent implements OnInit {
  private appconstant = this.ds.appconstant;
  remarkform: FormGroup
  master_Form1: FormGroup
  master_Form2: FormGroup
  master_Form3: FormGroup
  master_Form4: FormGroup
  master_Form5: FormGroup


  private ListAPI = this.ds.appconstant + 'msw/list';
  private nmcsPaginateAPI = this.ds.appconstant + 'msw/getPaginationCount';
  private downloadCADFileAPI = this.ds.appconstant + 'msw/downloadCADFile';
  private listCADFilenameAPI = this.ds.appconstant + 'msw/listCADFilename';
  private PMWRmasterSave = this.ds.appconstant + 'master/msw/addMaterialCost';
  private listMaterialCostAPI = this.ds.appconstant + 'master/msw/listMaterialCost';
  private downloadPDF = this.appconstant + 'msw/generatePDF/';
  updateForm
  constructor(notifierService: NotifierService, private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private ds: DataserviceService, private http: Http) {
    var req = Validators.compose([Validators.required]);
    this.remarkform = fb.group({
      remarks: [null, req],
    });
    this.master_Form1 = fb.group({
      id: null,
      costperkg: [null, req],
      materialname: "sheetmaterial",
    });
    this.master_Form2 = fb.group({
      id: null,
      costperkg: [null, req],
      materialname: "rod",
    });
    this.master_Form3 = fb.group({
      id: null,
      costperkg: [null, req],
      materialname: "pipe",
    });
    this.master_Form4 = fb.group({
      id: null,
      costperkg: [null, req],
      materialname: "langle",
    });
    this.master_Form5 = fb.group({
      id: null,
      costperkg: [null, req],
      materialname: "squaretube",
    });
    this.updateForm = this.fb.group({
      'id':[''],
      'arr':[null],
    });
  }
  userShortId: any
  p1 = 1;
  p2 = 1;
  protolist;
  ngOnInit() {
    var currentpage = localStorage.getItem("Pagination")
    if(Number(currentpage) == 0){
        this.currentPage = 1
    }else{
      this.currentPage = Number(currentpage)
    }
    this.loading = true;
    this.umcsfilter();
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    this.userShortId = jsonData['shortid'];
    this.usertype = jsonData['usertype'];
    this.ListData()
    this.nmcsPaginationCount()
  }
  pmwrListData = []
  pendingStatus: any
  ListData() {
    let reqdata = { "usertype": this.usertype,fromDate : this.Firstdate, toDate : this.LastDate, "shortid": this.userShortId, "page": this.currentPage, 'searchstr': "" };
    return this.ds.makeapi(this.ListAPI, reqdata, "postjson")
      .subscribe(data => {
        this.pmwrListData = data;
        this.loading = false
      },
        Error => {

        })
  }
  pmwrFileListData = []
  downloadFileLIst(id) {
    return this.ds.makeapi(this.listCADFilenameAPI, "formid=" + id, "post")
      .subscribe(data => {
        this.pmwrFileListData = data
      },
        Error => {

        })
  }
  alllistsearch = "";
  search(value) {
    this.alllistsearch = value;
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    var userShortId = jsonData['shortid'];
    let reqdata = { "usertype": this.usertype,fromDate : this.Firstdate, toDate : this.LastDate, "shortid": userShortId, "page": this.currentPage, 'searchstr': this.alllistsearch };
    return this.ds.makeapi(this.ListAPI, reqdata, "postjson")
      .subscribe(data => {
        this.pmwrListData = data;
        this.nmcsPaginationCount();
      },
        Error => {
        });
  }
  addpmwork() {
    this.router.navigate(['dashboard/pmworkreqnew'], {});
  }
  ViewListModal: any
  ViewArrayListModal: any
  status: any
  exigencycase:any
  card: any
  remarks: any
  viewForm(value) {
    this.fetchStatus(value)
    $("#mswparts").modal("show")
    this.ViewListModal = value
    this.ViewArrayListModal = value.mswParts
    this.status = value.status
    this.exigencycase = value.exigencycase 
    this.card = value.iscad
    this.remarks = value.l4remarks
    this.downloadFileLIst(value.id)
  }
  fetchStatus(statusdata){
    console.log(statusdata);
    var url = this.appconstant + 'msw/statusTracking';
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


  // checkallvalue: any
  // checkAllbox(value) {
  //   this.checkallvalue = value
  // }

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
        this.pmwrListData = this.npmwrListDatabackup
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

        var senddata = { "shortid": userShortId,fromDate : this.Firstdate, toDate : this.LastDate, "usertype": this.usertype, "page": this.currentPage, "filterList": this.setvalues, 'searchstr': this.alllistsearch }

        if (this.alllistsearch.length == 0) {
          senddata = { "shortid": userShortId,fromDate : this.Firstdate, toDate : this.LastDate, "usertype": this.usertype, "page": this.currentPage, "filterList": [], 'searchstr': this.alllistsearch }
        }
        var tmpArrSetValues = [];
        for (var i = 0; i < this.setvalues.length; i++) {
          var obj = this.setvalues[i]
          if (obj.values.length != 0) {
            tmpArrSetValues.push(obj);
          }
        }


        this.setvalues = tmpArrSetValues;

        senddata = { "shortid": userShortId, fromDate : this.Firstdate, toDate : this.LastDate,"usertype": this.usertype, "page": this.currentPage, "filterList": this.setvalues, 'searchstr': this.alllistsearch }
        this.ds.makeapi(this.ListAPI, senddata, "postjson")
          .subscribe(data => {
            this.pmwrListData = data;
            this.loading = false;

          },
            Error => {
            });
      }
    } else {

    }


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
  usertype: any
  npmwrListDatabackup = [];
  setvalues = [];
  loading = false
  departmentfilter(event, key) {
    this.loading = true;
    if (event != null && event.target != null) {
      var isChecked = event.target.checked;
      var event = event.target.value;
      if (event == null) {
        this.pmwrListData = this.npmwrListDatabackup
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

        var senddata = { "shortid": userShortId,fromDate : this.Firstdate, toDate : this.LastDate, "usertype": this.usertype, "page": this.currentPage, "filterList": this.setvalues, 'searchstr': this.alllistsearch }

        if (this.alllistsearch.length == 0) {
          senddata = { "shortid": userShortId,fromDate : this.Firstdate, toDate : this.LastDate, "usertype": this.usertype, "page": this.currentPage, "filterList": [], 'searchstr': this.alllistsearch }
        }
        var tmpArrSetValues = [];
        for (var i = 0; i < this.setvalues.length; i++) {
          var obj = this.setvalues[i]
          if (obj.values.length != 0) {
            tmpArrSetValues.push(obj);
          }
        }


        this.setvalues = tmpArrSetValues;

        senddata = { "shortid": userShortId,fromDate : this.Firstdate, toDate : this.LastDate, "usertype": this.usertype, "page": this.currentPage, "filterList": this.setvalues, 'searchstr': this.alllistsearch }
        this.ds.makeapi(this.ListAPI, senddata, "postjson")
          .subscribe(data => {
            this.pmwrListData = data;
            this.loading = false;

          },
            Error => {
            });
      }
    } else {

    }


  }
  Firstdate:any
  LastDate:any
  SelectDate(event){
    var userData = localStorage.getItem("Daim-forms");
        var jsonData = JSON.parse(userData);
        var userShortId = jsonData['shortid'];
    if(event != null){
      var dates1 = new Date(event[0]);
      var dates2 = new Date(event[1]);
      this.Firstdate = moment(dates1).format('DD-MM-YYYY');
      this.LastDate = moment(dates2).format('DD-MM-YYYY');
      this.loading = true;
          var senddata = { "shortid": userShortId,fromDate : this.Firstdate, toDate : this.LastDate, "usertype": this.usertype, "page": this.currentPage, "filterList": this.setvalues, 'searchstr': this.alllistsearch }
          this.ds.makeapi(this.ListAPI, senddata, "postjson")
            .subscribe(data => {
              this.pmwrListData = data;
              this.loading = false;
  
            },
              Error => {
              });
        }
      } 
  totalPartCount: any;
  currentPage = 1;
  totalPages = 10;
  nmcsPaginationCount() {

    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    var userShortId = jsonData['shortid'];
    var submitData = { "usertype": this.usertype, "shortid": userShortId };
    this.ds.makeapi(this.nmcsPaginateAPI, submitData, "postjson")
      .subscribe(data => {

        var totalcount = data['pagecount'];
        this.totalPartCount = totalcount;
        this.totalPages = Math.ceil(this.totalPartCount / 10)

      },
        Error => {
        });
  }
  paginatePartList(page) {
    if (page == 'prev' && this.currentPage > 1) {
      if (page == 'prev') {
        this.loading = false;
      }
      else {
        this.loading = true;
      }
      this.currentPage = this.currentPage - 1
    }
    else {
      if (page == 'next') {
        this.loading = false;
      }
      else {
        this.loading = true;
      }
      this.currentPage = this.currentPage + 1
    }
    this.ListData()
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
    this.getnmcsform().subscribe(data => {
      // this.mcslist = data.sort((a, b) => Number(b.id) - Number(a.id));
      this.ListData = data
      this.loading = false

    })
    localStorage.setItem("Pagination",String(this.currentPage))
  }
  getnmcsform() {
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    var userShortId = jsonData['shortid'];
    let reqdata = { "shortid": userShortId, "usertype": this.usertype, "page": this.currentPage, "filterList": [] };
    var usertype = '';
    if (jsonData['usertype']) {
      usertype = jsonData['usertype'].toLowerCase();
    }
    if (usertype === "store") {
      // this.isStoreLogin = true;
    }

    // let reqdata = "usertype="+usertype;

    let url = this.ListAPI;
    let data = reqdata;
    const headers = new Headers();
    headers.append('content-type', 'application/json');
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
  downlaodfile(filename, id) {
    this.loading = true
    var urlValue = this.appconstant + 'msw' + '/downloadCADFile';
    this.ds.method(urlValue + "/" + id, filename, 'downloadfile')
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
      });

  }
  edit(id) {
    localStorage.setItem("Pagination",String(this.currentPage))
    this.router.navigate(['dashboard/pmworkreqedit'], { queryParams: { id: id } });
  }
  edit_Sup(id) {
    localStorage.setItem("Pagination",String(this.currentPage))
    this.router.navigate(['dashboard/pmw-supervisor'], { queryParams: { id: id } });
  }
  edit_bca(id) {
    localStorage.setItem("Pagination",String(this.currentPage))
    this.router.navigate(['../pmwrbca'], { queryParams: { id: id } });
  }
  formid = null
  Delete(id) {
    this.formid = id
    $("#deletelist").modal("show")
  }
  ConfirmDelete() {
    this.loading = true;
    if (this.remarkform.valid) {
      var remarks = this.remarkform.value.remarks;
      var submitData = "formid=" + this.formid + "&status=deleted" + "&remarks=" + remarks;
      var urlValue = this.appconstant + 'msw' + '/updateFormStatus';
      this.ds.makeapi(urlValue, submitData, 'post')
        .subscribe(data => {
          if (data.status == "Success") {
            this.loading = false;
            this.remarkform.reset();
            $('#deletelist').modal('hide');
            this.ListData();
            $.notify('Deleted Successfully !!', "success");
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
  Material_master() {
    $("#pmwr").modal("show")
    this.PatchAllfiles()
  }
  master_submit() {
    if (this.master_Form1.invalid || this.master_Form2.invalid || this.master_Form3.invalid || this.master_Form4.invalid || this.master_Form5.invalid) {
      $.notify('Form Invalid!', "error");
    } else {
      var reqdata = []
      var getValue1 = this.master_Form1.value
      reqdata.push(getValue1)
      var getValue2 = this.master_Form2.value
      reqdata.push(getValue2)
      var getValue3 = this.master_Form3.value
      reqdata.push(getValue3)
      var getValue4 = this.master_Form4.value
      reqdata.push(getValue4)
      var getValue5 = this.master_Form5.value
      reqdata.push(getValue5)
      return this.ds.makeapi(this.PMWRmasterSave, reqdata, "postjson")
        .subscribe(data => {
          if (data.status == "Success") {
            this.master_Form1.reset()
            this.master_Form2.reset()
            this.master_Form3.reset()
            this.master_Form4.reset()
            this.master_Form5.reset()
            $("#pmwr").modal("hide")
          }
        },
          Error => {
          })
    }
  }
  PatchAllfiles() {
    return this.ds.makeapi(this.listMaterialCostAPI, '', "post")
      .subscribe(data => {
        this.master_Form1.patchValue(data[0])
        this.master_Form2.patchValue(data[1])
        this.master_Form3.patchValue(data[2])
        this.master_Form4.patchValue(data[3])
        this.master_Form5.patchValue(data[4])
      },
        Error => {

        })
  }
  backHome() {
    this.router.navigateByUrl('/home');
  }
  pmlists(){
    this.router.navigateByUrl('/dashboard/pmworkreqlist');
  }
  getdepartment = [];
  getstatus = [];
  getapprover = [];
  l4nameList=[]
  umcsfilter() {
    var urlValue = this.appconstant + 'msw/getFilterColumns/';
    this.ds.makeapi(urlValue, '', 'post')
      .subscribe(data => {
        this.getdepartment = data.department;
        this.getstatus = data.status;
        this.l4nameList = data.l4name
        console.log(this.getstatus)
      }, Error => {

      });

  }

   
  isCheckall: any
  FilterByCategorylist = [];
  form_id:any;
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
      for (var i = 0; i < this.pmwrListData.length; i++) {
        this.form_id = this.pmwrListData[i].id;
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
      console.log(this.checkclicksingle)
    }
    else if (this.eventchecked == false) {
      // this.checkclicksingle.push({ "id": this.singlecheck_id });

      if (this.arrayCheck(id)) {
        // this.checkclicksingle.push({ "id": this.singlecheck_id })
        this.checkclicksingle = this.removeArr(id);
        this.checkallpart = [];
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
        this.pmwrListData = this.pmwrListData
        console.log(this.pmwrListData)
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
        this.ds.makeapi(this.ListAPI, senddata, "postjson")
          .subscribe(data => {
            this.pmwrListData = data;
            this.nmcsPaginationCount();
            this.loading = false;
            console.log(this.pmwrListData)

          },
            Error => {
            });
      }
    } else {

    }


  }
  downloadZip(filename) {
    // this.checkclicksingle=[];
    if (this.isCheckall == true) {
      this.loading = true;
      var formlist = []
      if (this.checkallpart != []) {
        var submitData = { "mswIdList": this.checkallpart, "status": "" };
      }

      // console.log(filename)
      return this.ds.method(this.downloadPDF, submitData, "downloadfileZIPjson")
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
        var submitDatasing = { "mswIdList": this.checkclicksingle, "status": "" };
      }

      // console.log(filename)
      return this.ds.method(this.downloadPDF, submitDatasing, "downloadfileZIPjson")
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
  MSW_Recall(id) {
    var submitData = "formid=" + id + "&status=recalled";
    var urlValue = this.appconstant + 'msw/updateFormStatus/';
    this.ds.makeapi(urlValue, submitData, 'post')
      .subscribe(data => {
        if (data.status == 'Success') {
          this.ListData();

        }

      }, Error => {

      });
  }
  MSW_Edit(id){
    localStorage.setItem("Pagination",String(this.currentPage))
    this.router.navigate(['dashboard/pmwr-recall'], {
      queryParams: { id: id }
    });
  }
  downloadExcel(filename) {
    this.loading = true
    var urlValue = this.appconstant + 'msw' + '/downloadExcel';
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    var userShortId = jsonData['shortid'];

    let reqdata = { "usertype": this.usertype,"shortid": userShortId, "page": this.currentPage, "filterList": this.setvalues };
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
  pmwrData(id){
    this.router.navigate(['/pmwrView'], {
      queryParams: { id: id }
    });
  }
  fileupload(){
    this.router.navigateByUrl('/dashboard/pmwrupload');
  }
}