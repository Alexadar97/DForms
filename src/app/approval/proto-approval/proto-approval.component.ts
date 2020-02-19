import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/filter';
import { DataserviceService } from '../../dataservice.service';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/finally';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
declare var $,moment;
@Component({
  selector: 'app-proto-approval',
  templateUrl: './proto-approval.component.html',
  styleUrls: ['./proto-approval.component.css']
})
export class ProtoApprovalComponent implements OnInit {
  ProtoReqForm = null;
  approvalForm = null;
  appconstant = this.ds.appconstant;
  formId = null;
  formStatus = null;
  formType = null;
  isApproved = false;
  isPending = false;
  today = new Date();
  private fileDownloadAPI = this.appconstant + 'proto/downloadAOFile';
  private listDownloadAPI = this.appconstant + 'proto/listAOfilename';
  loading = false
  exigencycase;
  private readonly notifier: NotifierService;
  constructor(private fb: FormBuilder, private router: Router, private ds: DataserviceService, notifierService: NotifierService, private route: ActivatedRoute, private http: Http) {
    this.notifier = notifierService;
    var userDetails = localStorage.getItem("Daim-forms");
    var userJson = JSON.parse(userDetails);


    this.ProtoReqForm = fb.group({
      createddate: [],
      requestorname: ['', Validators.compose([Validators.required])],
      contactno: [''],
      prformid : [''],
      category: [],
      department: [],
      supervisor: [],
      subsupervisor: [],
      workrequest: [],
      projectname: [],
      systemname: [],
      activity: [],
      retrofitmenttype: [],
      aodrawing: [],
      aodrawingtext: [],
      fitmentremarks: [],
      filepath: [],
      finasupdate: [],
      fitmentreport: [],
      finasupdateremarks: [],
      l4: [],
      l4remarks: [],
      status: [],
      umcsParts: this.fb.array([]),
      prvehiclemaster: this.fb.array([])
    });

    this.approvalForm = fb.group({
      remarks: ['', Validators.compose([Validators.required])],

    });
  }

  ngOnInit() {
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });
 
    var token = this.route.snapshot.params['token'];
    this.setToken(token);
  }
  get rowForms() {
    return this.ProtoReqForm.get('umcsParts') as FormArray;
  }

  addRow(data) {
    const row = this.fb.group({
      finasid: [data['finasid']],
      partnumber: [data['partnumber']],
      description: [data['description']],
      quantity: [data['quantity']],
      zgs: [data['zgs']],
      scraporstored: [data['scraporstored']],
      protoid: [data['protoid']],
      protoformid: [data['protoformid']],
      status: [data['status']],
      remarks: ['']
    });

    this.rowForms.push(row);
    console.log(this.rowForms)
  }
  get novehicle() {
    return this.ProtoReqForm.get('prvehiclemaster') as FormArray;

  }
  addvehicle(data) {
    var todayDate = moment(new Date()).format('DD-MM-YYYY')
    const vehi = this.fb.group({
      id: [data['id']],
      quantity: [data['quantity']],
      ownername: [data['ownername']],
      vehicleaggregateno: [data['vehicleaggregateno']],
      modelnumber: [data['modelnumber']],
      startdate: [data['startdate'],+ todayDate],
      ownerstatus: [data['ownerstatus']]
    });

    this.novehicle.push(vehi);

  };
  protoPartsArr = [];
  protoVehiPartsArr = [];
  patchValue: any
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
  finasupdate;
  fitmentreport;
  aodrawing;
  aodrawingtext;  
  fitmentremarks;   
  finasupdateremarks;
  filepath;
  form_id;
  otherCategory:any;
  retrofitmentothers:any;
  fetchFormDetails(formtype, formid) {
    var urlValue = this.appconstant + formtype + '/get';
    var submitData = 'formid=' + formid;
    this.ds.makeapi(urlValue,submitData, 'post')
      .subscribe(data2 => {
        this.formType = formtype;
        // /*  set the Finas Update values*/
        // if (data2.finasupdate == 1) {
        //   data2.finasupdate = "Yes";
        // }
        // else if (data2.finasupdate == 0) {
        //   data2.finasupdate = "";
        // }

        // /* set the Fitment Report  values*/
        // if (data2.fitmentreport == 1) {
        //   data2.fitmentreport = "Yes";
        // }
        // else if (data2.fitmentreport == 0) {
        //   data2.fitmentreport = "";
        // }
        this.fitmentreport = data2['fitmentreport'];
        this.finasupdate = data2['finasupdate'];
        this.aodrawing  = data2['aodrawing'];
        this.fitmentremarks  = data2['fitmentremarks'];
        this.finasupdateremarks  = data2['finasupdateremarks'];
        this.aodrawingtext   = data2['aodrawingtext'];
        this.exigencycase   = data2['exigencycase'];
        this.form_id = data2['id']
        this.otherCategory = data2['categoryothers'];
        this.retrofitmentothers = data2['retrofitmentothers'];
        /* show the function values*/
        if (data2.supervisor == 'mdtsupervisor') {
          data2.supervisor = 'Vehicle MDT';
        }
        else if (data2.supervisor == 'hdtsupervisor') {
          data2.supervisor = 'Vehicle HDT';
        }
        else if (data2.supervisor == 'aggregateengine') {
          data2.supervisor = 'Engine';
        }
        else if (data2.supervisor == 'ppssupervisor') {
          data2.supervisor = 'PPS';
        }
        else if (data2.supervisor == 'aggregatetransmission') {
          data2.supervisor = 'Transmission';
        }
        else if (data2.supervisor == 'aggregateaxle') {
          data2.supervisor = 'Axle';
        }



        /* split the category values*/
        this.arrcategory = [];
        this.arrcategorylist = []
        var category = data2.category;
        this.category = category;
        this.arrcategory.push(this.category);
        console.log(this.arrcategory)
        for (var i = 0; i < this.arrcategory.length; i++) {
          for (var j = 0; j < this.arrcategory[i].split(",").length; j++) {
            this.arrcategorylist.push(this.arrcategory[i].split(",")[j]);
          }

        }
        console.log(this.arrcategorylist);

        /* split the subfunctions values*/

        this.arrvalue = [];
        this.arrlist = []

        this.arrfunction = data2.subsupervisor;
        console.log(this.arrfunction)

        this.arrvalue.push(this.arrfunction);
        console.log(this.arrvalue)
        for (var i = 0; i < this.arrvalue.length; i++) {
          for (var j = 0; j < this.arrvalue[i].split(",").length; j++) {
            this.arrlist.push(this.arrvalue[i].split(",")[j]);
          }
        }
        console.log(this.arrlist);


        /* split the Types of Activity values*/

        this.arrproto = [];
        this.arrlists = []
        var typeactivity = data2.retrofitmenttype;
        this.prototype = typeactivity;
        this.arrproto.push(this.prototype);
        console.log(this.arrproto)
        for (var i = 0; i < this.arrproto.length; i++) {
          for (var j = 0; j < this.arrproto[i].split(",").length; j++) {
            this.arrlists.push(this.arrproto[i].split(",")[j]);
          }
        }


        var editObj = data2;

        console.log(editObj)


        this.ProtoReqForm = this.fb.group({
          id: this.formId,
          formId: [editObj.id],
          prformid : [''],
          createddate: [],
          requestorname: [],
          contactno: [editObj.contactno],
          department: [],
          category: [editObj.category],
          supervisor: [editObj.supervisor],
          subsupervisor: [editObj.subsupervisor],
          workrequest: [editObj.workrequest],
          projectname: [editObj.purpose],
          systemname: [editObj.systemname],
          activity: [editObj.activity],
          aodrawing: [],
          retrofitmenttype: [editObj.retrofitmenttype],
          aodrawingtext: [editObj.aodrawingtext],
          fitmentremarks: [editObj.fitmentremarks],
          filepath: [editObj.filepath],
          finasupdate: [editObj.finasupdate],
          fitmentreport: [editObj.fitmentreport],
          finasupdateremarks: [editObj.finasupdateremarks],
          l4: [1],
          l4remarks: [],
          status: [editObj.status],
          umcsParts: this.fb.array([]),
          prvehiclemaster: this.fb.array([])
        });
        /* show information in screen.*/
        /*show approval and reject*/
        this.patchValue = data2;
        this.patchValue['remarks'] = '';
         this.editbcasheet = data2['editbcasheet']
    
         
        this.ProtoReqForm.patchValue(this.patchValue);

        var protoParts = data2['umcsParts'];
        this.protoPartsArr = protoParts;

        for (var i = 0; i < protoParts.length; i++) {
          var partObj = protoParts[i];
          this.addRow(partObj);
        }
        var protovehiParts = data2['prvehiclemaster'];
        this.protoVehiPartsArr = protovehiParts;

        for (var i = 0; i < protovehiParts.length; i++) {
          var partVehiObj = protovehiParts[i];
          this.addvehicle(partVehiObj);
        }


      }, Error => {

      });

  }
  formTypes: any;
  editbcasheet:any;
  SetToken:any;
  isexpired:any;
  setToken(token) {
   this.SetToken = token;
    var token_url = this.ds.appconstant + 'approval/get';
    var submitData = 'token=' + token;
    this.ds.makeapi(token_url, submitData,'post')
      .subscribe(data => {
        this.formId = data['formid']
        this.formStatus = data['status'];
        this.formTypes = data['type'];
        this.editbcasheet = data['editbcasheet'];
        this.isexpired = data['isexpired']
        this.fetchFormDetails(data['formtype'], this.formId);
        // this.downloadlist(this.formId);
          this.downloadlist(this.formId);
        
      },
        Error => {
        });

  }

 
  acceptForm(result) {
  
    console.log(this.ProtoReqForm)
    var formStatus = this.ProtoReqForm.value.status;
    console.log(formStatus);
    var resultType = '';

    if (formStatus == 'pending') {
      if (result) {
        resultType = 'l4approved';
      }
      else {
        resultType = 'l4rejected';
      }
    }

    else if (formStatus == 'vehicleownerapproved') {
      if (result) {
        resultType = 'protol4approved';
      }
      else {
        resultType = 'protol4rejected';
      }
    }
    
    if (this.approvalForm.valid) {
      this.loading=true
      if(result == true){


      var arrDate = [];

      for (var i = 0; i < this.ProtoReqForm.value.prvehiclemaster.length; i++) {
        this.ProtoReqForm.value.prvehiclemaster[i].startdate = $("#date" + i).val();
      }
      for (var x = 0; x < this.novehicle.value.length; x++) {

        arrDate.push({
          id: this.novehicle['value'][x]['id'],
          startdate: '' + this.novehicle['value'][x]['startdate'],

        })
      }
        var updateStartdate = this.ds.appconstant + 'proto' + '/updateStartDate';

      this.ds.makeapi(updateStartdate, arrDate, "postjson")
        .subscribe(data => {
          if (data.status == "Success") {
            // this.loading=false
            console.log(this.approvalForm.value)

            var remarks = this.approvalForm.value.remarks;

            var submitData = "id=" + this.formId + "&status=" + resultType + "&remarks=" + remarks;
            var urlValue = this.appconstant + this.formType + '/updateFormStatus';
            this.ds.makeapi(urlValue, submitData, 'post')
              .subscribe(data2 => {
                this.loading=false
                var id = "tst";
                if (data2.status == "Success") {
                  this.loading = false;
                  var submitData = 'token=' + this.SetToken;
                  var token_url = this.ds.appconstant + 'approval/doExpired';
                  this.ds.makeapi(token_url, submitData, 'post')
                    .subscribe(data3 => {
                      if (data3.status == 'Success') {
                        this.router.navigate(['location_approval'], { queryParams: { id: id } });
                      }
                      else {
                        this.router.navigate(['location_approval'], { queryParams: { id: id } });
                      }
                    })
                }

              }, Error => {

              });
          }
        });
      }
      else if(result == false){
        var remarks = this.approvalForm.value.remarks;

        var submitData = "id=" + this.formId + "&status=" + resultType + "&remarks=" + remarks;
        var urlValue = this.appconstant + this.formType + '/updateFormStatus';
        this.ds.makeapi(urlValue, submitData, 'post')
          .subscribe(data2 => {
            this.loading=false
            var id = "tst";
            if (data2.status == "Success") {
              this.loading = false;
              var submitData = 'token=' + this.SetToken;
              var token_url = this.ds.appconstant + 'approval/doExpired';
              this.ds.makeapi(token_url, submitData, 'post')
                .subscribe(data3 => {
                  if (data3.status == 'Success') {
                    this.router.navigate(['location_approval'], { queryParams: { id: id } });
                  }
                  else {
                    this.router.navigate(['location_approval'], { queryParams: { id: id } });
                  }
                })
            }

          }, Error => {

          });
      }
    }
    else {
      $.notify('Remarks is Invalid!', "error");
    }
  }

  file_id;
  downlaodfile(filename, id) {
    this.file_id = id;
    this.loading=true;
    this.ds.method(this.fileDownloadAPI + "/" + this.file_id, filename, "downloadfile")
      .subscribe(res => {
        if (window.navigator.msSaveOrOpenBlob) {
          this.loading= false;
          var fileData = [res.data];
          var blobObject = new Blob(fileData);
          window.navigator.msSaveOrOpenBlob(blobObject, filename);``
          window.navigator.msSaveOrOpenBlob(blobObject, filename);
        } else {
          this.loading= false;
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
          this.loading= false;
        });
  }

  fileNameArr = [];
  fileDownloadList = [];
  listfileid;
 
  downloadlist(formid) {
    this.fileDownloadList = [];
    var submitData = "formid=" + formid  ;
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
}