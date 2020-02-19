import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
@Component({
  selector: 'app-vehiclesignoffnew',
  templateUrl: './vehiclesignoffnew.component.html',
  styleUrls: ['./vehiclesignoffnew.component.css']
})
export class VehiclesignoffnewComponent implements OnInit {
  vehiclesignoffform : FormGroup;
  constructor(private router:Router , private fb : FormBuilder) { 
    var req = Validators.compose([Validators.required]);
    this.vehiclesignoffform = this.fb.group({
      finasid: ["", req],
      purposevehicle: ["", req],
      date: ["", req],
      vehiclesignoff: this.fb.array([]),
   });

  }
  get vehiclesignform() {
    return this.vehiclesignoffform.get('vehiclesignoff') as FormArray;
  }

  addRow() {
    var req = Validators.compose([Validators.required]);
    // var num = Validators.compose([Validators.required, Validators.pattern(this.numbervalidation)]);
    const row = this.fb.group({
      "aggregated": ['',req],
      "aggregate": ['',req],
      "aggregate1":  ['',req],
      "aggregate2":  ['',req],
      "aggregate3":  ['',req],
      "aggregate4":  ['',req],
      "aggregate5":  ['',req],
      "aggregate6": ['',req],
      "aggregate7": ['',req],
      // "check1": [false],
    });

    this.vehiclesignform.push(row);
    console.log(this.vehiclesignform)
  }
  deleteRow(i) {
    this.vehiclesignform.removeAt(i);
  }

  ngOnInit() {
    this.addRow();
  }
  goBack(){
    this.router.navigate(['dashboard/vehiclesignofflist'], {});
  }
}
