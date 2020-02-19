import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { NotifierService } from 'angular-notifier';
import { DataserviceService } from '../../dataservice.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
@Component({
  selector: 'app-finasworknew',
  templateUrl: './finasworknew.component.html',
  styleUrls: ['./finasworknew.component.css']
})
export class FinasworknewComponent implements OnInit {
  numbervalidation = /^[0][1-9]\d{9}$|^[1-9]\d{9}$/;
  form: FormGroup;
  fb = null;
  loading = false;
  constructor(notifierService: NotifierService,fb: FormBuilder, private http: Http, private router: Router, private _location: Location, private ds: DataserviceService) {
    this.fb = fb;
    // this.notifier = notifierService;
    // var userDetails = localStorage.getItem("Daim-forms");
    // var userJson = JSON.parse(userDetails);

    var req = Validators.compose([Validators.required]);
    
    var num = Validators.compose([Validators.required,Validators.pattern(this.numbervalidation)]);


    this.form = fb.group({
      // creditorid: [userJson.shortid,req],
      // deptid: ['',req],
      vehicle: ['',req],
      VehilceNo: ['',req],
      Vehilcekm: ['',req],
      VehilceOwner: ['',req],
      VehilceDue:['',req],
      Object:['',req],
      // approverid: ['',req],
      // status: ['test',req],
      // materials: fb.array([]),
    });
   }

  ngOnInit() {
  }
  goBack() {
    this._location.back();
  }


}