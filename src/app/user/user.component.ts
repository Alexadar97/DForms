import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/finally';
import {DataserviceService} from '../dataservice.service';

import { Http, Response, Headers, RequestOptions } from '@angular/http';

declare var $;
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  addORedituserForm:any;
  appconstant = this.ds.appconstant;
  private adduserapi = this.appconstant + 'user/save';
  private listuserapi = this.appconstant + 'user/list';
  private searchuserapi = this.appconstant + 'user/list';
  private getallteamsapi = this.appconstant + 'team/list';
  private shortIdSearch = this.appconstant + 'user/search';
  private  upadtestatusapi = this.appconstant + 'user/changeIsActive';


  emailvalidation = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+")){2,}@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  numbervalidation = /^[0-9]+$/;
  alphaWithoutSpace = /^[a-zA-Z]+$/;
  alphanumeric = /^[a-zA-Z0-9]+$/;
  decimalnumber = /^(0|[1-9]\d*)(\.\d+)?$/;
  alphawithdot = /^[a-zA-Z. ]+$/;
  alpha = /^[A-Za-z\d\s]+$/;
  passwordvalidation = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
  contactnmber = /^[0-9\-+()\d\s]+$/
  p1 = 1;

  constructor( private ds:DataserviceService, private Formbuilder: FormBuilder, private router: Router,private http: Http) {
    this.addORedituserForm = this.Formbuilder.group({
      "id":[null],
      "firstname":[null, Validators.compose([Validators.required])],
      "lastname":[null, Validators.compose([Validators.required])],
      'email': [null, Validators.compose([Validators.required, Validators.pattern(this.emailvalidation)])],
      "shortid": [null, Validators.compose([Validators.required])],
      "usertype": [null, Validators.compose([Validators.required])],
      "isactive":"",
    });
   }

  ngOnInit() {
    // this.getAllteams();
    this.getAlluser();
  }

  makeapi(url,data,type): Observable<any>{
    const headers = new Headers();
    if(type == "post"){
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
    }else if(type == "postjson"){
      headers.append('content-type', 'application/json');
    }
    

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

  allusers = [];
  getAlluser() {
    return this.makeapi(this.listuserapi, '', "post")
      .subscribe(data => {
        this.allusers = data;
        console.log(this.allusers)
      },
        Error => {
        });
  }
  allteams = [];
  getAllteams() {
    return this.makeapi(this.getallteamsapi, '', "post")
      .subscribe(data => {
        this.allteams = data;
      },
        Error => {
        });
  }
  search(value) {
    return this.makeapi(this.searchuserapi, 'searchstr=' + value, "post")
      .subscribe(data => {
        this.allusers = data;
      },
        Error => {
        });
  }
  modalname:any;
  adduser() {
    this.modalname='Add'
    this.addORedituserForm.reset()
    $("#adduser").modal("show");
  }
  edituser(index) {
    this.modalname='Edit'
    this.addORedituserForm.reset()
    var getform = this.allusers[index];
    this.addORedituserForm.patchValue(getform);
    $("#adduser").modal("show");
  }
  confirmAdduser() {
    
  if (this.addORedituserForm.invalid) {
      this.markFormGroupTouched(this.addORedituserForm);
      // this.showNotification('bottom', 'right', 'Form is invalid !!', "danger");
      return false;
    }
    else {
      var getform = this.addORedituserForm.value;
      if(getform.id==null){
        delete getform.id;
        getform.isactive = 1
      }
      return this.makeapi(this.adduserapi, getform, "postjson")
        .subscribe(data => {
          if (data.status == 'Success') {
            $('#adduser').modal('hide');
            $.notify('User is updated successfully!', "success");
            // if(getform.id!=null)
            // this.showNotification('bottom', 'right', 'User Edited Successfully !!', "success");

            // else
            // this.showNotification('bottom', 'right', 'User Added Successfully !!', "success");

            this.getAlluser();
          }
          else {
            $('#adduser').modal('hide');
            $.notify('Short ID is already exist!', "error");
            // this.showNotification('bottom', 'right', 'Server error,try again later !!', "danger");
          }
        },
          Error => {
            $('#adduser').modal('hide');
            // this.showNotification('bottom', 'right', 'Server error,try again later !!', "danger");
          });
    }
  }

  searchUser(){
    var shortName = this.addORedituserForm.value.shortid;

    
    return this.makeapi(this.shortIdSearch, 'shortid=' + shortName, "post")
      .subscribe(data => {
        // this.allusers = data;
        //  .set = data['firstname'];
        var formValue =  {
            'shortid':data['shortid'],
            'firstname':data['firstname'],
            'lastname':data['lastname'],
            'email':data['email'],

         }
        // this.addORedituserForm.value.name = data[''];
        
        this.addORedituserForm.patchValue(formValue);

      },
        Error => {
        });

  }

  showNotification(from, align, msg, type) {

    $.notify({
      icon: 'notifications',
      message: msg

    }, {
        type: type,
        timer: 2000,
        placement: {
          from: from,
          align: align
        }
      });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }
  dissuserindex: any;
  dissusertype: any;
  disschecked = false;
  dissuserval: any;
  dissableid: any;
  modal:any
  head:any
  disableuser(type,checked, index, id) {
    this.dissusertype = type
    this.dissableid = id;
    this.disschecked = checked;
    this.dissuserindex = index;
    if (checked == false) {
      $("#disableenableuser").modal("show");
      this.dissuserval = 'inactivated'
      this.modal = "Inactive"
      this.head = "inactive"
    }
    else {
      $("#disableenableuser").modal("show");
      this.dissuserval = 'activated'
      this.modal = "Active"
      this.head = "active"
    }
  }
  status:any
confirmdisableenableuser() {
  var url;
  if(this.dissusertype == 'activated') {
    this.status = 1
  }
  else{
    this.status = 0
  }

  return this.makeapi(this.upadtestatusapi ,"id="+this.dissableid +"&isactive="+this.status, "post")
    .subscribe(data => {
      if (data.status == 'Success') {
        $("#disableenableuser").modal("hide");
        this.ds.notify("User" + " " +this.dissuserval + ' successfully !!', "success");
       
      }
      else {
        $("#disableenableuser").modal("hide");
        this.ds.notify("Something went wrong try again later", "danger");
      }
    },
      Error => {
        $("#disableenableuser").modal("hide");
        this.ds.notify("Something went wrong try again later", "danger");
      });

}
cancelsisable() {
  if (this.disschecked == true) {
      $("#togBtn" + this.dissuserindex).prop('checked', false);
  }
  else {
      $("#togBtn" + this.dissuserindex).prop('checked', true);
  }
}

}



