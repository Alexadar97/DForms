import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { DataserviceService } from '../../dataservice.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
declare var $;
@Component({
  selector: 'app-materialissueslipnew',
  templateUrl: './materialissueslipnew.component.html',
  styleUrls: ['./materialissueslipnew.component.css']
})
export class MaterialissueslipnewComponent implements OnInit {

  private readonly notifier: NotifierService;

  numbervalidation = /^[0][1-9]\d{9}$|^[1-9]\d{9}$/;
  loading = false;


  form: FormGroup;
  private appconstant = this.ds.appconstant;
  fb = null

  private misSaveAPI = this.appconstant + 'mis/save';
  private checkSingleAPI = this.appconstant + 'mis/checkSinglePart';


  constructor(notifierService: NotifierService, fb: FormBuilder,private route: ActivatedRoute, private http: Http, private router: Router, private _location: Location, private ds: DataserviceService) {
    this.fb = fb;
    this.notifier = notifierService;
    var userData = localStorage.getItem("Daim-forms");
    var jsonData = JSON.parse(userData);
    var userShortId = jsonData['shortid'];
    var userid = jsonData.shortid;

    var req = Validators.compose([Validators.required]);

    var num = Validators.compose([Validators.required, Validators.pattern(this.numbervalidation)]);


    this.form = fb.group({
      id: [null],
      requesterid: [userid],
      project: ['', req],
      purpose: ['', req],
      hrid: ['', req],
      prmasterid:[null],
      contactno: ['', req],
      reqremarks: [null, req],  
      misParts: fb.array([]),
    });


  }
  get rowForms() {
    return this.form.get('misParts') as FormArray;

  }

  goBack() {
    this._location.back();
  }
  addrow=0
  addRow() {
    this.addrow++
    var req = Validators.compose([Validators.required]);
    var nonZero = Validators.compose([Validators.required, Validators.pattern(zeroValidation)]);
    var zeroValidation = /^(?=.*\d)(?=.*[1-9]).{1,10}$/;
    var testArr = [1]
    const row = this.fb.group({
      ascorderview: [this.addrow],
      partnumber: [null, req],
      description: ['', req],
      zgs: [null, req],
      quantity: [null, nonZero],
      partavailable: [null, req],
      partremarks: [null],
      // misPartFinas: this.fb.array([])
    });

    this.rowForms.push(row);
    console.log(row.value.partavailable)
    // console.log(row.controls.partnumber.value)
  }
  deleteRow(j) {
    this.rowForms.removeAt(j);
  }
  ngOnInit() {
    var value = this.route.queryParams
    .subscribe(params => {
      if (params.id != null) {
        this.fetchProtoFormDetails(params.id);
      
      }
      else {
        this.addRow();
      }
    });
    // this.addRow();
  }

  removePart(control) {
    control.removeAt(control.length - 1)
  }

  addPart(control) {

    var autoId = "";
    if (control.controls.length == 0) {
      autoId = prompt("Enter FinasId");
    } else {

      var lastPartName = control.controls[0].value['finasid'];
      autoId = lastPartName.substring(0, lastPartName.length - 1);
    }

    control.push(
      this.fb.group({
        finasid: [autoId + "" + parseInt(control.controls.length + 1)]
      }))
  }

  AllowNumber(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  nospace(event: any) {
    const pattern = /^\S*$/
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  partdata;
  partavailablevalue
  saveMIS() {
    let reqdata = "";
    let url = this.misSaveAPI;
    let data = this.form.value;
    data.prmasterid = this.formid;
    for (var i = 0; i < data.misParts.length; i++) {
      // this.partavailablevalue = data.misParts[i].partavailable;
      if (data.misParts[i].partavailable == 'This part is available') {
        data.misParts[i].partavailable = 'partavailable';
      }
      else if (data.misParts[i].partavailable == 'This part is not available') {
        data.misParts[i].partavailable = 'partnotavailable';
      }
      else if (data.misParts[i].partavailable == 'ZGS Mismatch') {
        data.misParts[i].partavailable = 'zgsmismatch';
      }
      else if (data.misParts[i].partavailable == 'Quantity is not available') {
        data.misParts[i].partavailable = 'qtynotavailable';
      }
    }
    
    reqdata = JSON.stringify(data);
    console.log(reqdata)
    return this.postRequest(url, reqdata);
  }

  singlepartvalue;;
  partvalue;
  value;
  issinglepart = false;

  checkforempty(obj){
    return (obj != null && obj.length >0)
  }

  nextLibAvailable(rowValue){
    return !(this.checkforempty(rowValue.partnumber) && this.checkforempty(rowValue.zgs) && this.checkforempty(rowValue.quantity))
  }


  checkforvalue(obj) {
    return (obj != "" || obj.length > 0)
  }


  patchLibAvailable(rowValue){
    return !(this.checkforvalue(rowValue.partnumber) && this.checkforvalue(rowValue.zgs) && this.checkforvalue(rowValue.quantity))
  }


  partno:any;
  zgsvalue:any;
  quantityval:any;
  singlepartobj = {};
  checksinglepart(j) {
      this.loading = true;
    for (var x = 0; x < this.rowForms.value.length; x++) {
      if(j == x){
       this.partno = this.rowForms.controls[x]['value']['partnumber'];
       this.zgsvalue = this.rowForms.controls[x]['value']['zgs'];
       this.quantityval = this.rowForms.controls[x]['value']['quantity'];
      }
    }
    this.singlepartobj = { 'partnumber':  this.partno, 'zgs':  this.zgsvalue, 'quantity':  this.quantityval }
    // if (partno != null && zgsvalue != null && quantityval != null) {
      this.ds.makeapi(this.checkSingleAPI,  this.singlepartobj, "postjson")
        .subscribe(data => {
             this.loading = false;
          console.log(data)
          this.singlepartvalue = data;
          if (this.singlepartvalue.partavailable == 'partavailable') {
            this.partvalue = 'This part is available';
          }
          else if (this.singlepartvalue.partavailable == 'partnotavailable') {
            this.partvalue = 'This part is not available';
            console.log(this.partvalue)
          }
          else if (this.singlepartvalue.partavailable == 'qtynotavailable') {
            this.partvalue = 'Quantity is not available';
            console.log(this.partvalue)
          }
          else if (this.singlepartvalue.partavailable == 'zgsmismatch') {
            this.partvalue = 'ZGS Mismatch';
            console.log(this.partvalue)
          }
          this.rowForms.controls[j].patchValue({
            partavailable:this.partvalue
          }) 
        },

          Error => {
          })
    // }

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
  findInvalidControls(form) {
    const invalid = [];
    const controls = form.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }



  submitForm() {
    $('#confirmSubmit').modal('show');
  }


  confirmSubmit() {
    // console.log(this.findInvalidControls(this.form));
    // for (var i = 0; i < this.form.value.misParts.length; i++) {
    //   var misPart = this.form.value.misParts[i];
    //   this.form.value.misParts[i]['quantity'] = misPart['misPartFinas'].length;
    // }
    // for(var i=0;i<this.form.get('misParts').value.length;i++){
    //   console.log(this.findInvalidControls(this.form.get('misParts').get(''+i)))
    //   var misPartsLength = this.form.get('misParts').get(''+i).get('misPartFinas').value.length;
    //   this.form.get('misParts').get(''+i).patchValue({'quantity':misPartsLength});

    // }
    console.log(this.form);

    if (this.form.valid) {
      this.loading = true;
      let data = this.form.value;
      if (data.id == null) {
        delete data.id;
      }
      if (data.prmasterid == null) {
        delete data.id;
      }
      this.saveMIS().subscribe(data => {
        if (data.status === "Success") {
          var form_id = data.id;
          this.loading = false;
          
          this.ds.notify('MIS Form Submitted successfully !!', "success");
          $('#confirmSubmit').modal('hide');
          // this._location.back();
          this.router.navigate(['dashboard/materialissuesliplist'],{})
          this.form.reset()
        } else if(data['status'] == 'Failure'){
          this.loading = false;
          $.notify('Server error, Please try again!',"error");
          $('#confirmSubmit').modal('hide');
        }
        else{
          $.notify('Form Submition Failed!', "error");
          $('#confirmSubmit').modal('hide');
        }
      },
        Error => {
          this.loading = false;
        });
    } else {
      this.loading = false;
      $.notify('Invalid Form! Please enter the correct data!', "error");
      $('#confirmSubmit').modal('hide');
    }
  }


  umcsPartsArray = []
  formType;
  formid;
  fetchProtoFormDetails(formid) {
    var urlValue = this.appconstant + 'proto/get';
    var submitData = "formid=" + formid;
    this.ds.makeapi(urlValue, submitData,'post')
      .subscribe(data2 => {
        var patchValue = data2;
        this.formid = data2['id']
      
        var userDetails = localStorage.getItem("Daim-forms");
        var userJson = JSON.parse(userDetails);
        var userid = userJson.shortid;
        var usertype = userJson.usertype;
        var req = Validators.compose([Validators.required]);
    
        var num = Validators.compose([Validators.required, Validators.pattern(this.numbervalidation)]);
        this.form = this.fb.group({
          prmasterid: [null],
          id:[null],
          requesterid: [userid],
          project: [patchValue.projectname,req],
          purpose: [patchValue.storagePurpose,req],
          hrid: ['',req],
          contactno: [patchValue.contactno,req],
          reqremarks: [null,req],  
          misParts: this.fb.array([]),
          usertype:[usertype]
    
        });
        console.log(patchValue)
        var misgetParts = data2['umcsParts'];
        for (var i = 0; i < misgetParts.length; i++) {
          var misObj = misgetParts[i];
            var pushvalue = misObj
            this.mispartRow(pushvalue);
            
   }
      }, Error => {

      });

  }
  get getprotoForms() {
    return this.form.get('misParts') as FormArray;

  }

  mispartRow(data) {
    var req = Validators.compose([Validators.required]);
    const getprotorow = this.fb.group({
      partnumber: [data['partnumber']],
      description: [data['description']],
      zgs: [data['zgs']],
      quantity: [data['quantity']],
      partavailable: [null,req],
      partremarks: [null],
    });


    this.getprotoForms.push(getprotorow);
  }
  materialnewlist() {
    this.router.navigate(['dashboard/materialissueslipnew'], {});
  }
  uploadpart() {
    this.router.navigate(['dashboard/materialissueslipupload'], {
      queryParams: { type: 'mis' }
    });
  }
  mislist(){
    this.router.navigateByUrl('/dashboard/materialissuesliplist');
  }
}
