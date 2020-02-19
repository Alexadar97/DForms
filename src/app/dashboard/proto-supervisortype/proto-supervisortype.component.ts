import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { DataserviceService } from '../../dataservice.service';
import { NotifierService } from 'angular-notifier';
declare var $;
@Component({
  selector: 'app-proto-supervisortype',
  templateUrl: './proto-supervisortype.component.html',
  styleUrls: ['./proto-supervisortype.component.css']
})
export class ProtoSupervisortypeComponent implements OnInit {

  ProtosupervisorTypeForm: FormGroup;
  p1 = 1;
  appconstant = this.ds.appconstant;
  private saveFunctionAPI = this.appconstant + 'proto/addSubFunction';
  private functionListAPI = this.appconstant + 'proto/subFunctionList';
  private protolistusers = this.ds.appconstant + 'user/list';
  constructor(notifierService: NotifierService, private fb: FormBuilder, private router: Router, private ds: DataserviceService, private http: Http) {
    this.fb = fb;
    var req = Validators.compose([Validators.required]);
    this.ProtosupervisorTypeForm = this.fb.group({
      id:[null],
      subsupervisortype: ['', req],
    });
  }
 
  ngOnInit() {
    this.getAllFunction();
    this.getUsertype();
  }

  goBack() {
    this.router.navigate(['dashboard/protolist'], {});
  }
  modalname: any;
  addSubFunction() {
    this.modalname = 'Add'
    $('#addNewSubFunction').modal('show');
    this.ProtosupervisorTypeForm.reset();
  }
  getSubfunction:any;
  getUsertype(){
    var usertype = "usertype=supervisor"
    this.ds.makeapi(this.protolistusers, usertype, "post")
      .subscribe(data => {

        this.getSubfunction = data;
        console.log(this.getSubfunction)
      },
        Error => {
        });

  }
  
  allfunctions = [];
  getAllFunction() {
    this.ds.makeapi(this.functionListAPI, '', "post")
      .subscribe(data => {
        this.allfunctions = data;
        console.log(data)
      },
        Error => {
        });
  }
  Edit(index) {
    this.modalname = 'Edit'
    this.ProtosupervisorTypeForm.reset()
    var getform = this.allfunctions[index];
    this.ProtosupervisorTypeForm.patchValue(getform);
    $("#addNewSubFunction").modal("show");
  }
  saveProtoFunction() {
    let reqdata = '';
    let url = this.saveFunctionAPI;
    let data = this.ProtosupervisorTypeForm.value;
    console.log(data)
    reqdata = JSON.stringify(data);
    console.log(reqdata)
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

  Save() {
    var getform = this.ProtosupervisorTypeForm.value;
    if(getform.id==null){
      delete getform.id;
    }
    if (this.ProtosupervisorTypeForm.valid) {
      this.saveProtoFunction().subscribe(data => {
        if (data.status == 'Success') {
          // this.loading = false;
          $.notify('Added the SubFunction', "success");
          $('#addNewSubFunction').modal('hide');

          this.getAllFunction();

        }
        else {
          $('#addNewSubFunction').modal('hide');
          $.notify('Form Submition Failed!', "error");
          // this.loading = false;
        }
        Error => {
          // this.loading = false;
        }
      });
    }
    else {
      // this.loading = false;
      $('#addNewSubFunction').modal('hide');
      $.notify('Invalid Form! Please enter the correct data!', "error");
    }
  }
}
