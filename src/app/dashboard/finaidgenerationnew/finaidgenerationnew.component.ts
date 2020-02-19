import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-finaidgenerationnew',
  templateUrl: './finaidgenerationnew.component.html',
  styleUrls: ['./finaidgenerationnew.component.css']
})
export class FinaidgenerationnewComponent implements OnInit {
  numbervalidation = /^[0][1-9]\d{9}$|^[1-9]\d{9}$/;
  form: FormGroup;
  fb = null;
  finasidgenerationform;
  loading = false;
  constructor(fb: FormBuilder,private _location: Location) { 
    this.fb = fb;
    // this.notifier = notifierService;
    // var userDetails = localStorage.getItem("Daim-forms");
    // var userJson = JSON.parse(userDetails);

    var req = Validators.compose([Validators.required]);
    
    var num = Validators.compose([Validators.required,Validators.pattern(this.numbervalidation)]);


    this.form = fb.group({
      // creditorid: [userJson.shortid,req],
      // deptid: ['',req],
     
      vehiclespec: ['',req],
      buildbY:['',req],
      vinnumber:['',req],
      vehiclenickname:['',req],
      testpurpose:['',req],
      reciveddate:['',req],
      invoice:['',req],
      approver:['',req],
      cabinmodel:['',req],
      cabincolor:['',req],
      cabintype:['',req],
      cabinPartno:['',req],
      cabinserialno:['',req],
      cabinmake:['',req],
      idgenerationdate:['',req],
      enginespecification:['',req],
      engineserialnumber:['',req],
      suppliername:[''],
      enginepartno:['',req],
      enginemake: ['',req],
      idgenerationdate1: ['',req],
      axlespecifiaction: ['',req],
      axlepartno: ['',req],
      axleserialnumber: ['',req],
      frontaxlemake: ['',req],
      frontidgenerationdate: ['',req],
      frontaxlespecifiaction: ['',req],
      frontaxlepartno: ['',req],
      frontaxleserialnumber: ['',req],
      rearaxlespecifiaction: ['',req],
      rearaxlepartno: ['',req],
      rearaxleserialnumber: ['',req],
      rearaxlemake: ['',req],
      rearidgenerationdate: ['',req],
      twinaxlespecifiaction: ['',req],
      twinaxlepartno: ['',req],
      twinaxleserialnumber: ['',req],
      twinaxlemake: ['',req],
      twinaxleidgenerationdate: ['',req],
      tagaxlespecifiaction: ['',req],
      tagaxlepartno: ['',req],
      tagaxleserialnumber: ['',req],
      tagaxlemake: ['',req],
      tagaxleidgenerationdate: ['',req],
      tandum1axlespecifiaction: ['',req],
      tandum1axlepartno: ['',req],
      tandum1axleserialnumber: ['',req],
      tandum1make: ['',req],

      tandum1idgenerationdate: ['',req],
      tandum2axlespecifiaction: ['',req],
      tandum2axlepartno: ['',req],
      tandum2axleserialnumber: ['',req],
      tandum2make: ['',req],
      tandum2idgenerationdate: ['',req],

      pusheraxlespecifiaction: ['',req],
      pusheraxlepartno: ['',req],
      pusheraxleserialnumber: ['',req],
      pusheraxlemake: ['',req],

      pusheraxleidgenerationdate: ['',req],

      
     
      // status: ['test',req],
     FWOparts: fb.array([]),
    });
    
  }
  get rowForms() {
    return this.form.get('FWOparts') as FormArray;

  }
  goBack(){
    this._location.back();
  }
  addRow() {
    var req = Validators.compose([Validators.required]);

    const row = this.fb.group({
      technicianname: ['',req],
      date: ['',req],
      hours: ['',req],
    });

    this.rowForms.push(row);
  }
  deleteRow(i) {
    this.rowForms.removeAt(i);
  }

  ngOnInit() {
    this.addRow()
  }
 
}
