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
declare var $
@Component({
  selector: 'app-tcplist',
  templateUrl: './tcplist.component.html',
  styleUrls: ['./tcplist.component.css']
})
export class TcplistComponent implements OnInit {

  AddTCForm: FormGroup
  TCPlateInfoForm: FormGroup
  today = new Date();
  myDateValue: Date;
  AssignTCForm: FormGroup
  AddTCFormExpiry: FormGroup
  AddTCFormInsrance: FormGroup
  p1 = 1
  p2 = 1
  p3 = 1
  p4 = 1
  AddTCFormEdit: FormGroup
  private appconstant = this.ds.appconstant;
  private savetcp = this.appconstant + 'tcplate/save';
  private TCPlateListapi = this.appconstant + 'tcplate/list';
  private TCPlateGetapi = this.appconstant + 'tcplate/get';
  private uploadexpiry = this.appconstant + 'tcplate/uploadExpiryDocument';
  private uploadinsure = this.appconstant + 'tcplate/uploadInsuranceDocument ';
  private listusers = this.ds.appconstant + 'user/list';
  private AssignAdd = this.ds.appconstant + 'tcplate/assignTCPlate ';
  private ReleaseAdd = this.ds.appconstant + 'tcplate/releaseTCPlate ';
  private ExpiryAdd = this.ds.appconstant + 'tcplate/addTCExpiry ';
  private InsuranceAdd = this.ds.appconstant + 'tcplate/addTCInsurance ';
  private shortIdSearch = this.appconstant + 'user/search';
  private PaginateAPI = this.appconstant + 'tcplate/getPaginationCount';
  private RenewalPendingAPI = this.appconstant + '/tcplate/renewalPending';
  constructor(notifierService: NotifierService, private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private ds: DataserviceService, private http: Http) {

    var req = Validators.compose([Validators.required]);
    this.myDateValue = new Date();

    this.AddTCForm = this.fb.group({
      tcplatename: [null, req],
      tcPlateExpiryModel: [null, req],
      tcPlateInsuranceModel: [null],
      insnumber: [null],
      category: [null],
      filepathins: [null],
      filepath: [null],
      remarks: [null],
    });
    this.AddTCFormEdit = this.fb.group({
      tcPlateExpiryModel: [null, req],
      tcPlateInsuranceModel: [null],
      insnumber: [null],
      category: [null],
      filepathins: [null],
      filepath: [null],
      remarks: [null],
    });
    this.AssignTCForm = this.fb.group({
      l4: [null, req],
      username: [null, req],
      subuser: [null, req],
      teamname: [null, req],
      remarks: [null, req],
    });
    this.AddTCFormExpiry = this.fb.group({
      tcPlateExpiryModel: [null, req],
      filepath: [null],
    });
    this.AddTCFormInsrance = this.fb.group({
      tcPlateInsuranceModel: [null, req],
      filepathins: [null],
      insnumber: [null],
    });
  }
  tab
  l4Users
  usertype
  Shortid
  status
  isL4
  istcplate
  isUser
  isAdmin
  ngOnInit() {
    var currentpage = localStorage.getItem("Pagination")
    if(Number(currentpage) == 0){
        this.currentPage = 1
    }else{
      this.currentPage = Number(currentpage)
    }
    this.tab = "live"
    var usertype = "usertype=L4"
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
    if (usertype === "L4") {
      this.status = ''
      this.isL4 = true;
    } else if (usertype === "tcplate") {
      this.status = ''
      this.istcplate = true;
    } else if (usertype === "user") {
      this.status = ''
      this.isUser = true;
    }
    else if (usertype === "admin") {
      this.status = ''
      this.isAdmin = true;
    }
    else {
      this.status = '';
    }
    this.status = usertype
    /** L4 user API-Start */
    var usertype = "usertype=L4"
    this.ds.makeapi(this.listusers, usertype, "post")
      .subscribe(data => {
        this.l4Users = data;
      },
        Error => {
        });
    /** L4 user API-End */
    this.getTCPList()
    this.PaginationCount()
  }
  selectl4(value){
    console.log(value)
  }
  markTab(type, $event) {
    this.tab = type;
    $(".tab").removeClass('tab_selected');
    $($event.target).addClass('tab_selected');
    if (type == "live") {
      this.getTCPList()
      this.PaginationCount()
    }
    else if (type == "pending") {
      this.getTCPListPending()
      this.PaginationCount()
    }
    else if (type == "available") {
      this.getTCPListAvail()
      this.PaginationCount()
    }
    else {
      this.getTCPListHistory()
      this.PaginationCount()
    }

  }
  /** Add TCPlate Modal */
  AddTcPlate() {
    $("#TCPlateModal").modal("show")
    this.AddTCForm.reset()
    this.uploadfilename1 = false
    this.uploadfilename = false
  }

  /** TC Plate Document Upload-Start */
  fileName
  UploadPartmasterfinallfile
  uploadfilename = false
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
      this.UploadPartmasterfinallfile = file;
      this.uploadfilename = true
      // $("#uploadpackmaster").modal("show");
    }
    else {
      console.log(event.srcElement.files);
      var fileList2 = event.srcElement.files;
      var file: File = fileList2[0];
      this.fileName = file.name;
      var finalfilename = (this.fileName).split(".");
      this.fileName = finalfilename[0];
      this.UploadPartmasterfinallfile = file;
    }

  }
  Confirmuploadexpiry() {
    let finalformdata: FormData = new FormData();
    finalformdata.append("filename", this.fileName);
    finalformdata.append("file", this.UploadPartmasterfinallfile);
    finalformdata.append("tcplateid", this.tcpid);
    this.ds.makeapi(this.uploadexpiry, finalformdata, 'file')
      .subscribe(
        data => {
        },
        Error => {
        });
  }
  /** TC Plate Document Upload-End */
  /** Insurance Document Upload-Start */
  fileName1
  UploadPartmasterfinallfile1
  uploadfilename1 = false
  uploadfile1(event) {

    if (!event) event = window.event;
    console.log(event.target);
    console.log(event.srcElement);

    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      var file: File = fileList[0];
      this.fileName1 = file.name;
      var finalfilename = (this.fileName1).split(".");
      this.fileName1 = finalfilename[0];
      this.UploadPartmasterfinallfile1 = file;
      this.uploadfilename1 = true
      // $("#uploadpackmaster").modal("show");
    }
    else {
      console.log(event.srcElement.files);
      var fileList2 = event.srcElement.files;
      var file: File = fileList2[0];
      this.fileName = file.name;
      var finalfilename = (this.fileName).split(".");
      this.fileName = finalfilename[0];
      this.UploadPartmasterfinallfile1 = file;
    }

  }


  Confirmuploadinsurence() {
    let finalformdata: FormData = new FormData();
    finalformdata.append("filename", this.fileName1);
    finalformdata.append("file", this.UploadPartmasterfinallfile1);
    finalformdata.append("tcplateid", this.tcpid);
    this.ds.makeapi(this.uploadinsure, finalformdata, 'file')
      .subscribe(
        data => {
        },
        Error => {
        });
  }
  /** Insurance Document Upload-End */
  /** List is working on status based "live":0,"renewal pending":1,"available":2 and "history":3 */
  alllistsearch
  searchlive(value) {
    this.alllistsearch = value;
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    var userShortId = jsonData['shortid'];
    if (this.usertype == "admin" || this.usertype == "tcplate") {
      var reqdata = "usertype=" + 0 + "&status=" + 0 + "&userid=" + userShortId + "&searchstr=" + this.alllistsearch + "&pagination=" + this.currentPage
    }
    else {
      var reqdata = "usertype=" + 1 + "&status=" + 0 + "&userid=" + userShortId + "&searchstr=" + this.alllistsearch + "&pagination=" + this.currentPage
    }
    return this.ds.makeapi(this.TCPlateListapi, reqdata, "post")
      .subscribe(data => {
        this.TCPlist = data;
        this.PaginationCountsearch()
      },
        Error => {
        });
  }
  alllistsearchpen
  searchpen(value) {
    this.alllistsearchpen = value;
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    var userShortId = jsonData['shortid'];
    if (this.usertype == "admin" || this.usertype == "tcplate") {
      var reqdata = "usertype=" + 0 + "&status=" + 1 + "&userid=" + userShortId + "&searchstr=" + this.alllistsearchpen + "&pagination=" + this.currentPage
    }
    else {
      var reqdata = "usertype=" + 1 + "&status=" + 1 + "&userid=" + userShortId + "&searchstr=" + this.alllistsearchpen + "&pagination=" + this.currentPage
    }
    return this.ds.makeapi(this.TCPlateListapi, reqdata, "post")
      .subscribe(data => {
        this.TCPlistPending = data;
        this.PaginationCountsearch()
      },
        Error => {
        });
  }
  alllistsearchavai
  searchavai(value) {
    this.alllistsearchavai = value;
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    var userShortId = jsonData['shortid'];
    if (this.usertype == "admin" || this.usertype == "tcplate") {
      var reqdata = "usertype=" + 0 + "&status=" + 2 + "&userid=" + userShortId + "&searchstr=" + this.alllistsearchavai + "&pagination=" + this.currentPage
    }
    else {
      var reqdata = "usertype=" + 1 + "&status=" + 2 + "&userid=" + userShortId + "&searchstr=" + this.alllistsearchavai + "&pagination=" + this.currentPage
    }
    return this.ds.makeapi(this.TCPlateListapi, reqdata, "post")
      .subscribe(data => {
        this.TCPlistavailable = data;
        this.PaginationCountsearch()
      },
        Error => {
        });
  }
  alllistsearchhist
  searchhist(value) {
    this.alllistsearchhist = value;
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    var userShortId = jsonData['shortid'];
    if (this.usertype == "admin" || this.usertype == "tcplate") {
      var reqdata = "usertype=" + 0 + "&status=" + 3 + "&userid=" + userShortId + "&searchstr=" + this.alllistsearchhist + "&pagination=" + this.currentPage
    }
    else {
      var reqdata = "usertype=" + 1 + "&status=" + 3 + "&userid=" + userShortId + "&searchstr=" + this.alllistsearchhist + "&pagination=" + this.currentPage
    }
    return this.ds.makeapi(this.TCPlateListapi, reqdata, "post")
      .subscribe(data => {
        this.TCPlistHistory = data;
        this.PaginationCountsearch()
      },
        Error => {
        });
  }
  /** Add TCPlate submission API-Start */
  tcpid
  submitForm() {
    if (this.fileName == undefined) {
      $.notify('Form is invalid!', "error");
    }
    else if (this.AddTCForm.valid) {
      this.loading = true
      var getdata = this.AddTCForm.value
      var tcpname = getdata.tcplatename
      var category = getdata.category
      var insnumber = getdata.insnumber
      var remarks = getdata.remarks
      var expirtydate = $("#dates").val()
      var insurencedate = $("#dates2").val()

      var reqdata = {
        "tcplatename": tcpname, "status": 0, "category": category, "remarks": remarks , "tcPlateExpiryModel": [{ "expirydate": expirtydate, "isactive": 1 }],
        "tcPlateInsuranceModel": [{ "isactive": 1, "expirydate": insurencedate, "insnumber": insnumber}]
      };
      return this.ds.makeapi(this.savetcp, reqdata, "postjson")
        .subscribe(data => {
          this.loading = false
          this.tcpid = data.id
          if (data.status == "Success") {
            $.notify('Form is Submitted Successfully!', "success");
            /** Hide on TCPlateModal Modal */
            $("#TCPlateModal").modal("hide")
            /** Recall the upload functionality */
            this.Confirmuploadinsurence()
            this.Confirmuploadexpiry()
            this.getTCPListAvail()
            this.tab = "available"
          }
          else {
            /** Hide on TCPlateModal Modal */
            $("#TCPlateModal").modal("hide")
          }
        },
          Error => {
          });
    }
    else {
      // this.ds.notify('Form is Invalid!', "error");
      $.notify('Form Invalid!', "error");
      this.loading = false;
      console.log("FORM INVALID");
    }
  }
  /** Add TCPlate submission API-End */

  /** Add TCPlate List API-Start */
  loading = false
  TCPlist
  TCPListExLive = {}
  TCPListInsLive = {}
  tcPlateRespTeamModel={}
  getTCPList() {
    this.loading = true
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    var userShortId = jsonData['shortid'];
    if (this.usertype == "admin" || this.usertype == "tcplate") {
      var reqdata = "usertype=" + 0 + "&status=" + 0 + "&userid=" + userShortId + "&searchstr=" + "" + "&pagination=" + this.currentPage
    }
    else {
      var reqdata = "usertype=" + 1 + "&status=" + 0 + "&userid=" + userShortId + "&searchstr=" + "" + "&pagination=" + this.currentPage
    }

    this.ds.makeapi(this.TCPlateListapi, reqdata, "post")
      .subscribe(data => {
        this.loading = false
        this.TCPlist = data;
        for (var k = 0; k < data.length; k++) {
          for (var i = 0; i < data[k]['tcPlateExpiryModel'].length; i++) {

            var active = data[k]['tcPlateExpiryModel'][i].isactive
            if (active == 1) {
              this.TCPListExLive[data[k]['id']] = (data[k]['tcPlateExpiryModel'][i])
              this.expirydata = data[k]['tcPlateExpiryModel'][i].expirydate
            }
            else {

            }
          }
          for (var j = 0; j < data[k]['tcPlateInsuranceModel'].length; j++) {
            var isactive = data[k]['tcPlateInsuranceModel'][j].isactive
            if (isactive == 1) {
              this.TCPListInsLive[data[k]['id']] = (data[k]['tcPlateInsuranceModel'][j])
              this.expirydatains = data[k]['tcPlateInsuranceModel'][j].expirydate
              this.insnumbers = data[k]['tcPlateInsuranceModel'][j].insnumber
            }
          }
          for (var j = 0; j < data[k]['tcPlateRespTeamModel'].length; j++) {
            var isactive = data[k]['tcPlateRespTeamModel'][j].isactive
            if (isactive == 1) {
              this.tcPlateRespTeamModel[data[k]['id']] = (data[k]['tcPlateRespTeamModel'][j])
              this.RespTeamModelusername = data[k]['tcPlateRespTeamModel'][j].username
              this.RespTeamModelsubusername = data[k]['tcPlateRespTeamModel'][j].subusername
              this.RespTeamModell4 = data[k]['tcPlateRespTeamModel'][j].l4name
            }
          }
          // for(let i=0; i<this.TCPlist.length; i++){
          //   var array = this.TCPlist[i]
          //   this.tcPlateRespTeamModel = array.tcPlateRespTeamModel
          //   console.log(this.tcPlateRespTeamModel +"alex")
          // }
        }
      },
        Error => {
          this.loading = false;
        });
  }
  TCPlistPending
  RespTeamModelusername
  RespTeamModelsubusername
  RespTeamModell4
  one = {}
  TCPListExPend = {}
  TCPListInsPend = {}
  getTCPListPending() {
    this.loading = true
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    var userShortId = jsonData['shortid'];
    if (this.usertype == "admin" || this.usertype == "tcplate") {
      var reqdata = "usertype=" + 0 + "&status=" + 1 + "&userid=" + userShortId + "&searchstr=" + "" + "&pagination=" + this.currentPage
    }
    else {
      var reqdata = "usertype=" + 1 + "&status=" + 1 + "&userid=" + userShortId + "&searchstr=" + "" + "&pagination=" + this.currentPage
    }

    this.ds.makeapi(this.TCPlateListapi, reqdata, "post")
      .subscribe(data => {
        this.loading = false
        this.TCPlistPending = data;
        for (var k = 0; k < data.length; k++) {
          for (var i = 0; i < data[k]['tcPlateExpiryModel'].length; i++) {

            var active = data[k]['tcPlateExpiryModel'][i].isactive
            if (active == 1) {
              this.TCPListExPend[data[k]['id']] = (data[k]['tcPlateExpiryModel'][i])
              this.expirydata = data[k]['tcPlateExpiryModel'][i].expirydate
            }
            else {

            }
          }
          for (var j = 0; j < data[k]['tcPlateInsuranceModel'].length; j++) {
            var isactive = data[k]['tcPlateInsuranceModel'][j].isactive
            if (isactive == 1) {
              this.TCPListInsPend[data[k]['id']] = (data[k]['tcPlateInsuranceModel'][j])
              this.expirydatains = data[k]['tcPlateInsuranceModel'][j].expirydate
              this.insnumbers = data[k]['tcPlateInsuranceModel'][j].insnumber
            }
          }
        }
      },
        Error => {
          this.loading = false;
        });
  }
  TCPlistavailable
  expirydata
  expirydatains
  insnumbers
  TCPListEx = {}
  TCPListIns = {}
  getTCPListAvail() {
    this.loading = true
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    var userShortId = jsonData['shortid'];
    if (this.usertype == "admin" || this.usertype == "tcplate") {
      var reqdata = "usertype=" + 0 + "&status=" + 2 + "&userid=" + userShortId + "&searchstr=" + "" + "&pagination=" + this.currentPage
    }
    else {
      var reqdata = "usertype=" + 1 + "&status=" + 2 + "&userid=" + userShortId + "&searchstr=" + "" + "&pagination=" + this.currentPage
    }
    this.ds.makeapi(this.TCPlateListapi, reqdata, "post")
      .subscribe(data => {
        this.loading = false
        this.TCPlistavailable = data;
        for (var k = 0; k < data.length; k++) {
          for (var i = 0; i < data[k]['tcPlateExpiryModel'].length; i++) {

            var active = data[k]['tcPlateExpiryModel'][i].isactive
            if (active == 1) {
              this.TCPListEx[data[k]['id']] = (data[k]['tcPlateExpiryModel'][i])
              this.expirydata = data[k]['tcPlateExpiryModel'][i].expirydate
            }
            else {

            }
          }
          for (var j = 0; j < data[k]['tcPlateInsuranceModel'].length; j++) {
            var isactive = data[k]['tcPlateInsuranceModel'][j].isactive
            if (isactive == 1) {
              this.TCPListIns[data[k]['id']] = (data[k]['tcPlateInsuranceModel'][j])
              this.expirydatains = data[k]['tcPlateInsuranceModel'][j].expirydate
              this.insnumbers = data[k]['tcPlateInsuranceModel'][j].insnumber
            }
          }
        }
      },
        Error => {
          this.loading = false;
        });
  }
  TCPlistHistory
  TCPListHis = {}
  TCPListInsHis = {}
  getTCPListHistory() {
    this.loading = true
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    var userShortId = jsonData['shortid'];
    if (this.usertype == "admin" || this.usertype == "tcplate") {
      var reqdata = "usertype=" + 0 + "&status=" + 3 + "&userid=" + userShortId + "&searchstr=" + "" + "&pagination=" + this.currentPage
    }
    else {
      var reqdata = "usertype=" + 1 + "&status=" + 3 + "&userid=" + userShortId + "&searchstr=" + "" + "&pagination=" + this.currentPage
    }

    this.ds.makeapi(this.TCPlateListapi, reqdata, "post")
      .subscribe(data => {
        this.loading = false
        this.TCPlistHistory = data;


        for (var k = 0; k < data.length; k++) {
          for (var i = 0; i < data[k]['tcPlateExpiryModel'].length; i++) {

            var active = data[k]['tcPlateExpiryModel'][i].isactive
            if (active == 1) {
              this.TCPListHis[data[k]['id']] = (data[k]['tcPlateExpiryModel'][i])
              this.expirydata = data[k]['tcPlateExpiryModel'][i].expirydate
            }
            else {

            }
          }
          for (var j = 0; j < data[k]['tcPlateInsuranceModel'].length; j++) {
            var isactive = data[k]['tcPlateInsuranceModel'][j].isactive
            if (isactive == 1) {
              this.TCPListInsHis[data[k]['id']] = (data[k]['tcPlateInsuranceModel'][j])
              this.expirydatains = data[k]['tcPlateInsuranceModel'][j].expirydate
              this.insnumbers = data[k]['tcPlateInsuranceModel'][j].insnumber
            }
          }
        }
      },
        Error => {
          this.loading = false;
        });
  }
  /** Add TCPlate List API-End */
  /** AssignTeam Modal */
  assignID
  assignTeam(data) {
    this.assignID = data.id
    $("#AssignTeam").modal("show")
    this.AssignTCForm.reset()
  }
  /** Add AssignTeam submission API-Start */
  submitFormAssign() {
    if (this.AssignTCForm.valid == false) {
      $.notify('Form is invalid!', "error");
    }
    else {
      this.loading = true
      var Data = this.AssignTCForm.value
     for(let i=0; i<this.l4Users.length; i++){
       var empobj = this.l4Users[i]
       if(empobj.shortid == Data.l4){
         var l4name = empobj.firstname +" "+ empobj.lastname
       }
     }
      // data.enddate = $("#dates2").val()
      Data.usershortid = this.ShortID
      Data.subuser = this.SubShortID
      Data.tcplateid = this.assignID
      Data.subusername = Data.username
      Data.l4name = l4name
      Data.isactive = 1
      var reqdata = JSON.stringify(Data) 
      return this.ds.makeapi(this.AssignAdd, reqdata, "postjson")
        .subscribe(data => {
          this.tcpid = data.id
          if (data.status == "Success") {
            this.loading = false
            $.notify('Form is Submitted Successfully!', "success");
            /** Hide on AssignTeam Modal */
            $("#AssignTeam").modal("hide")
            this.getTCPListAvail()
          }
          else {
            /** Hide on AssignTeam Modal */
            $("#AssignTeam").modal("hide")
          }
        },
          Error => {
          });
    }
  }
  /** Add AssignTeam submission API-End */
  TcPlateInfo() {
    if (this.TCPlateInfoForm.invalid) {
      $.notify('Invalid Form!', "error");
    } else {
      $("#AddTc19").modal("hide")
    }
  }
  openform19(data) {
    localStorage.setItem("tcpdata", JSON.stringify(data));
    this.router.navigateByUrl('dashboard/tcpnew')
  }

  /** ReleaseTeam Modal */
  tcpidRelease
  RevokeTeam(id) {
    this.tcpidRelease = id
    $("#Confirm").modal("show")
  }
  /** Add ReleaseTeam submission API-Start */
  ReleaseTeam() {
    this.loading = true
    var reqdata = "formid=" + this.tcpidRelease

    return this.ds.makeapi(this.ReleaseAdd, reqdata, "post")
      .subscribe(data => {
        if (data.status == "Success") {
          $("#Confirm").modal("hide")
          this.loading = false
          this.getTCPList()
        }
        else {
        }
      },
        Error => {
        });

  }
  /** Add ReleaseTeam submission API-End */
  tcplateid
  expiryid
  Insexpiryid
  Editfilepath
  Editfilepathins
  assignEdit(data) {
    $("#TCPlateModalEdit").modal("show")
    this.tcplateid = data.id
    var getdata = this.AddTCForm.value
    getdata.tcplatename = data.tcplatename
    getdata.category = data.category
    getdata.remarks = data.remarks



    for (var i = 0; i < data['tcPlateExpiryModel'].length; i++) {
      var active = data['tcPlateExpiryModel'][i].isactive
      console.log(active)
      if (active == 1) {
        getdata.tcPlateExpiryModel = data['tcPlateExpiryModel'][i].expirydate
        this.expiryid = data['tcPlateExpiryModel'][i].id
        this.Editfilepath = data['tcPlateExpiryModel'][i].filepath
        console.log(getdata.tcPlateExpiryModel)
        console.log(this.expiryid)
      }
      else {

      }
    }
    for (var j = 0; j < data['tcPlateInsuranceModel'].length; j++) {
      var isactive = data['tcPlateInsuranceModel'][j].isactive
      if (isactive == 1) {
        getdata.tcPlateInsuranceModel = data['tcPlateInsuranceModel'][j].expirydate
        this.Editfilepathins = data['tcPlateInsuranceModel'][j].filepath
        getdata.insnumber = data['tcPlateInsuranceModel'][j].insnumber
        this.Insexpiryid = data['tcPlateExpiryModel'][j].id
        console.log(getdata.tcPlateExpiryModel)
        console.log(getdata.insnumber)
        console.log(this.Insexpiryid)

      }
      else {

      }
    }
    this.AddTCFormEdit.patchValue(getdata)

  }
  submitFormEdit() {
    if (this.AddTCFormEdit.valid == false) {
      $.notify('Form is invalid!', "error");
    }
    else {
      this.loading = true
      var getdata = this.AddTCFormEdit.value
      var tcpname = getdata.tcplatename
      var category = getdata.category
      var remarks = getdata.remarks
      var insnumber = getdata.insnumber
      var expirtydate = $("#datese").val()
      var insurencedate = $("#datese2").val()
      var tcpid = this.tcplateid
      var reqdata = {
        "tcplatename": tcpname, "status": 0, "category": category, "id": tcpid, "remarks": remarks ,  "tcPlateExpiryModel": [{ "id": this.expiryid, "expirydate": expirtydate, "isactive": 1 }],
        "tcPlateInsuranceModel": [{ "id": this.Insexpiryid, "isactive": 1, "expirydate": insurencedate, "insnumber": insnumber}]
      };

      return this.ds.makeapi(this.savetcp, reqdata, "postjson")
        .subscribe(data => {
          this.tcpid = data.id
          this.loading = false
          if (data.status == "Success") {
            $.notify('Form is Submitted Successfully!', "success");
            /** Hide on TCPlateModal Modal */
            $("#TCPlateModalEdit").modal("hide")
            /** Recall the upload functionality */
            this.Confirmuploadinsurence()
            this.Confirmuploadexpiry()
            this.getTCPListAvail()
          }
          else {
            /** Hide on TCPlateModal Modal */
            $("#TCPlateModalEdit").modal("hide")
          }
        },
          Error => {
          });
    }
  }
  Expiryid
  assignExpiry(data) {
    this.Expiryid = data.id
    $("#AddExpiry").modal("show")
    this.AddTCFormExpiry.reset()
  }
  ConfirmuploadassignExp() {
    let finalformdata: FormData = new FormData();
    finalformdata.append("filename", this.fileName);
    finalformdata.append("file", this.UploadPartmasterfinallfile);
    finalformdata.append("tcplateid", this.Expiryid);
    this.ds.makeapi(this.uploadexpiry, finalformdata, 'file')
      .subscribe(
        data => {
        },
        Error => {
        });
  }
  submitFormExpiry() {
    if (this.AddTCFormExpiry.valid == false) {
      $.notify('Form is invalid!', "error");
    }
    else {
      var Data = this.AddTCFormExpiry.value
      Data.expirydate = $("#datesexp").val()
      Data.tcplateid = this.Expiryid
      Data.isactive = 1
      var reqdata = JSON.stringify(Data)

      return this.ds.makeapi(this.ExpiryAdd, reqdata, "postjson")
        .subscribe(data => {
          if (data.status == "Success") {
            var reqdata = "tcplateid=" + this.Expiryid
            this.ds.makeapi(this.RenewalPendingAPI, reqdata, 'post')
              .subscribe(
                data => {
                  $.notify('Form is Submitted Successfully!', "success");
                  /** Hide on ReleaseTeams Modal */
                  $("#AddExpiry").modal("hide")
                  if (this.tab == "available") {
                    this.getTCPListAvail()
                  }
                  else {
                    this.getTCPListPending()
                  }
                  this.ConfirmuploadassignExp()
                },
                Error => {
                });

          }
          else {
            /** Hide on ReleaseTeams Modal */
            $("#AddExpiry").modal("hide")
          }
        },
          Error => {
          });
    }
  }
  Insuranceid
  assignInsurance(data) {
    this.Insuranceid = data.id
    $("#AddInsurance").modal("show")
    this.AddTCFormInsrance.reset()
  }

  Confirmuploadassignins() {
    let finalformdata: FormData = new FormData();
    finalformdata.append("filename", this.fileName1);
    finalformdata.append("file", this.UploadPartmasterfinallfile1);
    finalformdata.append("tcplateid", this.Insuranceid);
    this.ds.makeapi(this.uploadinsure, finalformdata, 'file')
      .subscribe(
        data => {
        },
        Error => {
        });
  }
  submitFormInsurance() {
    if (this.AddTCFormInsrance.valid == false) {
      $.notify('Form is invalid!', "error");
    }
    else {
      this.loading = true
      var Data = this.AddTCFormInsrance.value
      Data.expirydate = $("#datesins").val()
      Data.tcplateid = this.Insuranceid
      Data.isactive = 1
      var reqdata = JSON.stringify(Data)

      return this.ds.makeapi(this.InsuranceAdd, reqdata, "postjson")
        .subscribe(data => {
          if (data.status == "Success") {
            var reqdata = "tcplateid=" + this.Insuranceid
            this.ds.makeapi(this.RenewalPendingAPI, reqdata, 'post')
              .subscribe(
                data => {
                  this.loading = false
                  $.notify('Form is Submitted Successfully!', "success");
                  /** Hide on ReleaseTeams Modal */
                  $("#AddInsurance").modal("hide")
                  if (this.tab == "available") {
                    this.getTCPListAvail()
                  }
                  else {
                    this.getTCPListPending()
                  }
                  this.Confirmuploadassignins()
                },
                Error => {
                });


          }
          else {
            /** Hide on ReleaseTeams Modal */
            $("#AddInsurance").modal("hide")
          }
        },
          Error => {
          });
    }
  }
  ShortID
  searchUser() {
    var shortName = this.AssignTCForm.value.username;
    return this.ds.makeapi(this.shortIdSearch, 'shortid=' + shortName, "post")
      .subscribe(data => {
        var formValue = {
          'username': data['firstname'] + " " + data['lastname'],
        }
        this.ShortID = data['shortid']
        this.AssignTCForm.patchValue(formValue);

      },
        Error => {
        });

  }
  SubShortID
  searchSubUser() {
    var shortName = this.AssignTCForm.value.subuser;
    return this.ds.makeapi(this.shortIdSearch, 'shortid=' + shortName, "post")
      .subscribe(data => {
        var formValue = {
          'subuser': data['firstname'] + " " + data['lastname'],
        }
        this.SubShortID = data['shortid']
        this.AssignTCForm.patchValue(formValue);

      },
        Error => {
        });

  }
  totalPartCount: any;
  PaginationCount() {
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    var userShortId = jsonData['shortid'];
    if (this.tab == "live") {
      if (this.usertype == "admin" || this.usertype == "tcplate") {
        var reqdata = "usertype=" + 0 + "&status=" + 0 + "&userid=" + userShortId + "&searchstr=" + "" + "&pagination=" + this.currentPage
      }
      else {
        var reqdata = "usertype=" + 1 + "&status=" + 0 + "&userid=" + userShortId + "&searchstr=" + "" + "&pagination=" + this.currentPage
      }
    }
    else if (this.tab == "pending") {
      if (this.usertype == "admin" || this.usertype == "tcplate") {
        var reqdata = "usertype=" + 0 + "&status=" + 1 + "&userid=" + userShortId + "&searchstr=" + "" + "&pagination=" + this.currentPage
      }
      else {
        var reqdata = "usertype=" + 1 + "&status=" + 1 + "&userid=" + userShortId + "&searchstr=" + "" + "&pagination=" + this.currentPage
      }
    }
    else if (this.tab == "available") {
      if (this.usertype == "admin" || this.usertype == "tcplate") {
        var reqdata = "usertype=" + 0 + "&status=" + 2 + "&userid=" + userShortId + "&searchstr=" + "" + "&pagination=" + this.currentPage
      }
      else {
        var reqdata = "usertype=" + 1 + "&status=" + 2 + "&userid=" + userShortId + "&searchstr=" + "" + "&pagination=" + this.currentPage
      }
    }
    else if (this.tab == "history") {
      if (this.usertype == "admin" || this.usertype == "tcplate") {
        var reqdata = "usertype=" + 0 + "&status=" + 3 + "&userid=" + userShortId + "&searchstr=" + "" + "&pagination=" + this.currentPage
      }
      else {
        var reqdata = "usertype=" + 1 + "&status=" + 3 + "&userid=" + userShortId + "&searchstr=" + "" + "&pagination=" + this.currentPage
      }
    }

    this.ds.makeapi(this.PaginateAPI, reqdata, "post")
      .subscribe(data => {

        var totalcount = data.pagecount;
        this.totalPartCount = totalcount;

        this.totalPages = Math.ceil(this.totalPartCount / 10);


        console.log(this.totalPartCount)

      },
        Error => {
        });
  }
  PaginationCountsearch() {
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    var userShortId = jsonData['shortid'];
    if (this.tab == "live") {
      if (this.usertype == "admin" || this.usertype == "tcplate") {
        var reqdata = "usertype=" + 0 + "&status=" + 0 + "&userid=" + userShortId + "&searchstr=" + this.alllistsearch + "&pagination=" + this.currentPage
      }
      else {
        var reqdata = "usertype=" + 1 + "&status=" + 0 + "&userid=" + userShortId + "&searchstr=" + this.alllistsearch + "&pagination=" + this.currentPage
      }
    }
    else if (this.tab == "pending") {
      if (this.usertype == "admin" || this.usertype == "tcplate") {
        var reqdata = "usertype=" + 0 + "&status=" + 1 + "&userid=" + userShortId + "&searchstr=" + this.alllistsearchpen + "&pagination=" + this.currentPage
      }
      else {
        var reqdata = "usertype=" + 1 + "&status=" + 1 + "&userid=" + userShortId + "&searchstr=" + this.alllistsearchpen + "&pagination=" + this.currentPage
      }
    }
    else if (this.tab == "available") {
      if (this.usertype == "admin" || this.usertype == "tcplate") {
        var reqdata = "usertype=" + 0 + "&status=" + 2 + "&userid=" + userShortId + "&searchstr=" + this.alllistsearchavai + "&pagination=" + this.currentPage
      }
      else {
        var reqdata = "usertype=" + 1 + "&status=" + 2 + "&userid=" + userShortId + "&searchstr=" + this.alllistsearchavai + "&pagination=" + this.currentPage
      }
    }
    else if (this.tab == "history") {
      if (this.usertype == "admin" || this.usertype == "tcplate") {
        var reqdata = "usertype=" + 0 + "&status=" + 3 + "&userid=" + userShortId + "&searchstr=" + this.alllistsearchhist + "&pagination=" + this.currentPage
      }
      else {
        var reqdata = "usertype=" + 1 + "&status=" + 3 + "&userid=" + userShortId + "&searchstr=" + this.alllistsearchhist + "&pagination=" + this.currentPage
      }
    }

    this.ds.makeapi(this.PaginateAPI, reqdata, "post")
      .subscribe(data => {

        var totalcount = data.pagecount;
        this.totalPartCount = totalcount;

        this.totalPages = Math.ceil(this.totalPartCount / 10);


        console.log(this.totalPartCount)

      },
        Error => {
        });
  }

  currentPage = 1;
  totalPages
  paginatePartList(page) {
    if (page == 'prev' && this.currentPage > 1) {
      if (page == 'prev') {
        this.loading = true;
      }
      else {
        this.loading = false;
      }
      this.currentPage = this.currentPage - 1
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
    this.getTCPList()
    this.getTCPListPending()
    this.getTCPListAvail()
    this.getTCPListHistory()
    this.loading = false;
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
    this.getTCPList()
    this.getTCPListPending()
    this.getTCPListAvail()
    this.getTCPListHistory()
    this.loading = false;
    localStorage.setItem("Pagination",String(this.currentPage))
  }
  backHome(){
    this.router.navigateByUrl('/home');
  }
}