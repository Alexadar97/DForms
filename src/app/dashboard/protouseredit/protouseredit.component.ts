import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/filter';
import { DataserviceService } from '../../dataservice.service';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Location } from '@angular/common';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/finally';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
declare var $;

@Component({
  selector: 'app-protouseredit',
  templateUrl: './protouseredit.component.html',
  styleUrls: ['./protouseredit.component.css']
})
export class ProtousereditComponent implements OnInit {
  ProtoReqForm:FormGroup;
  BCAProtoForm:FormGroup;
  numbervalidation = /^[0][1-9]\d{9}$|^[1-9]\d{9}$/;
  constructor(private _location: Location, private route: ActivatedRoute, private ds: DataserviceService, private fb: FormBuilder, private http: Http, private router: Router) {

    var userDetails = localStorage.getItem("Daim-forms");
    var userJson = JSON.parse(userDetails);


    this.ProtoReqForm = fb.group({
      createddate: [],
      requestorname: ['', Validators.compose([Validators.required])],
      purpose: [null, Validators.compose([Validators.required])],
      contactno: [''],
      department: [],
      category: [],
      subcategory: [],
      workrequest: [],
      projectname: [],
      systemname: [],
      activity: [],
      aodrawing: [],
      retrofitmenttype: [],
      aodrawingtext: [],
      fitmentremarks: [],
      filepath: [],
      finasupdate: [],
      fitmentreport: [],
      finasupdateremarks: [],
      l4: [],
      l4remarks: [],
      status: [],
      prpartsmaster: this.fb.array([]),
      prvehiclemaster: this.fb.array([])
    });
    var req = Validators.compose([Validators.required]);
    var num = Validators.compose([Validators.required, Validators.pattern(this.numbervalidation)]);
    this.BCAProtoForm = this.fb.group({
      category: ['', req],
      finasid: ['', req],
      vehicleno: ['', req],
      vehicleobjectfinasid: ['', req],
      observation: ['', req],
      startdate: ['', req],
      enddate: ['', req],
      fitmentkm: ['', req],
      workdone: ['', req],
      supervisorname: ['', req],
      date: ['', req],
      receiveddate: ['', req],
      completeddate: ['', req],
      finasrequestername: ['', req],
      finasdate: ['', req],
      mobileno: ['', req],
      returnon: ['', req],
      receivedon: ['', req],
      remarks: ['', req],
      noofvehicleorobj: [1, req],
      requstername: ['', req],
      department: ['', req],
      contactno: ['', req],
      addtionaldate: ['', req],
      Protopartsmaster: this.fb.array([]),
      Protovehiclemaster: this.fb.array([])
    });

  }

  ngOnInit() {
    this.addRow();
    this.addvehicle();
    this.protoaddRow();
    this.partaddvehicle();
 }
  goBack(){
  this.router.navigate(['dashboard/protolist'], {});
  }

  get rowForms() {
    return this.ProtoReqForm.get('prpartsmaster') as FormArray;
  }

  addRow() {
      const row = this.fb.group({
      finasid: [null],
      partno: [''],
      description: [''],
      quantity: [''],
      zgs: [''],
      scraporstored: ['']
    });

    this.rowForms.push(row);
    // console.log(this.rowForms)
  }
  get novehicle() {
    return this.ProtoReqForm.get('prvehiclemaster') as FormArray;

  }

  addvehicle() {
    const vehi = this.fb.group({
      vehicleno: [null],
      ownerofvehicle: [''],
      modelnumber: [''],
      startdate: ['']
    });

    this.novehicle.push(vehi);

  };
  get protorowForms() {
    return this.BCAProtoForm.get('Protopartsmaster') as FormArray;
  }

  protoaddRow() {
    var req = Validators.compose([Validators.required]);
    // var num = Validators.compose([Validators.required, Validators.pattern(this.numbervalidation)]);
    const row = this.fb.group({
      objectfinaid: [null],
      partnumber: ['', req],
      partdescription: ['', req],
      quantity: ['', req],
      zgs: ['', req],
      partremark: ['', req]
    });

    this.protorowForms.push(row);
  }
  protodeleteRow(i) {
    this.protorowForms.removeAt(i);
  }
  get partnovehicle() {
    return this.BCAProtoForm.get('Protovehiclemaster') as FormArray;

  }

  partaddvehicle() {
    var counter = $('#partnovchobj').val();
    counter++;
    $('#partnovchobj').val(counter);
    var req = Validators.compose([Validators.required]);
    const vehi = this.fb.group({
      vehiclename: [,req],
      vehicleorobjfinasid: [, req],
      vehiclekm: [, req],
      datestart: [''],
      dateend: ['']
    });

    this.partnovehicle.push(vehi);

  };
  partdeletevehicle(i) {
    var counter = $('#partnovchobj').val();
    counter--;
    $('#partnovchobj').val(counter);
    this.partnovehicle.removeAt(i);
  }
  protolists(){
    this.router.navigateByUrl('/dashboard/protolist');
  }
}
