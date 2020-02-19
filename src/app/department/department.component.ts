import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';

// import { DatatransferService } from '../datatransfer.service'
// import { WebserviceService } from '../webservice.service'
import {DataserviceService} from '../dataservice.service';
declare var $;

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {

  addOReditdepartForm:any;
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
  appconstant = this.dataservice.appconstant;

  private adddeptapi = this.dataservice.appconstant + 'dept/save';
  private listdeptapi = this.dataservice.appconstant + 'dept/list';
  private searchdeptapi = this.dataservice.appconstant + 'dept/list';
  private searchuserapi = this.dataservice.appconstant + 'user/list';

  constructor(private Formbuilder: FormBuilder, private router: Router ,private dataservice:DataserviceService) { 
    this.addOReditdepartForm = this.Formbuilder.group({
      "id":[null],
      "name": [null, Validators.compose([Validators.required])],
      "l3name": [null],
      "l3userid": [null],
    });
  }

  ngOnInit() {
    this.getAlldepartment();
  }

  
  
  l3managerlist = [];
  todall3userdata: any;
  l3usernamekeydown(value) {
    if (this.l3managerlist.indexOf(value) != -1) {

      var getdata = this.addOReditdepartForm.value;
      getdata.l3userid = this.todall3userdata[this.l3managerlist.indexOf(value)].id;
      getdata.l3name = this.todall3userdata[this.l3managerlist.indexOf(value)].name;
      this.addOReditdepartForm.patchValue(getdata);

    }
    else {

      var getdata = this.addOReditdepartForm.value;
      getdata.l3userid = null;
      this.addOReditdepartForm.patchValue(getdata);
      
      this.l3managerlist = [];
      let reqdata = "searchstr=" + value
      return this.dataservice.makeapi(this.searchuserapi, reqdata, "post")
        .subscribe(data => {
          this.todall3userdata = data
          for (var i = 0; i < data.length; i++) {
            this.l3managerlist[i] = data[i].shortid;
          }
        },
          Error => {
          });
    }
  }
 
  alldepartment = [];
  getAlldepartment() {
    return this.dataservice.makeapi(this.listdeptapi, '', "post")
      .subscribe(data => {
        this.alldepartment = data;
        // this.dataservice.showNotification('bottom', 'right', 'Form is invalid !!', "danger");
      },
        Error => {
        });
  }
 
  search(value) {
    return this.dataservice.makeapi(this.searchdeptapi, 'searchstr=' + value, "post")
      .subscribe(data => {
        this.alldepartment = data;
      },
        Error => {
        });
  }
  modalname:any;
  add() {
    this.modalname='Add'
    this.addOReditdepartForm.reset()
    $("#add").modal("show");
  }
  edit(index) {
    this.modalname='Edit'
    this.addOReditdepartForm.reset()
    var getform = this.alldepartment[index];
    this.addOReditdepartForm.patchValue(getform);
    $("#add").modal("show");
  }
  confirmadd() {
  if (this.addOReditdepartForm.invalid) {
      this.markFormGroupTouched(this.addOReditdepartForm);
      // this.getdata.showNotification('bottom', 'right', 'Form is invalid !!', "danger");
      return false;
    }
    else {
      var getform = this.addOReditdepartForm.value;
      delete getform.l3name;

      if(getform.id==null){
        delete getform.id;
      }
      return this.dataservice.makeapi(this.adddeptapi, getform, "postjson")
        .subscribe(data => {
          if (data.status == 'Success') {
            $('#add').modal('hide');

            // if(getform.id!=null)
            // this.getdata.showNotification('bottom', 'right', 'Department Edited Successfully !!', "success");

            // else
            // this.getdata.showNotification('bottom', 'right', 'Department Added Successfully !!', "success");

            this.getAlldepartment();
          }
          else {
            $('#add').modal('hide');
            // this.getdata.showNotification('bottom', 'right', 'Server error,try again later !!', "danger");
          }
        },
          Error => {
            $('#add').modal('hide');
            // this.getdata.showNotification('bottom', 'right', 'Server error,try again later !!', "danger");
          });
    }
  }
  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

}
