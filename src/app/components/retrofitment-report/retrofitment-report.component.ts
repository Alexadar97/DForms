import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NotifierService } from 'angular-notifier';
import { DataserviceService } from '../../dataservice.service';

@Component({
  selector: 'retrofitment-report',
  templateUrl: './retrofitment-report.component.html',
  styleUrls: ['./retrofitment-report.component.css']
})
export class RetrofitmentReportComponent implements OnInit {

  @Input() report;
  form
  fileUploadArr = []
  checkOptions: string[] = ['Yes', 'No'];
  TCMSOptions: string[] = ['DS', 'DZ'];
  checkOptions2: string[] = ['OK', 'Not OK'];
  uploadedImages = [];
  isfoulingparts
  ispartqualityissues
  isaccessibilityissues
  constructor(notifierService: NotifierService, private fb: FormBuilder, private route: ActivatedRoute, private http: Http, private router: Router, private _location: Location, private ds: DataserviceService) {

  }


  initForm(){
    var editObj = this.report;
    if (this.form != undefined) {
      console.log(editObj);
      this.form.patchValue(editObj);
      this.uploadedImages = editObj['imageList'];
      var retroParts = editObj['fitmentParts'];
      while (this.rowForms1.length !== 0) {
        this.rowForms1.removeAt(0)
      }
      while (this.retroForms1.length !== 0) {
        this.retroForms1.removeAt(0)
      }
      while (this.retroForms.length !== 0) {
        this.retroForms.removeAt(0)
      }
      if (retroParts) {
        for (var i = 0; i < retroParts.length; i++) {
          var retroObj = retroParts[i];

          this.addretro(retroObj);

        }
      }

      var retroParts2 = editObj['fitmentKTODetails'];
      if (retroParts2) {
        for (var i = 0; i < retroParts2.length; i++) {
          var retroObj = retroParts2[i];

          this.addkto(retroObj);

        }
      }

      var retroParts3 = editObj['fitmentObservations'];
      if (retroParts3) {
        for (var i = 0; i < retroParts3.length; i++) {
          var retroObj = retroParts3[i];

          this.addnewRow(retroObj);

        }
      }
    }
    
}

  ngOnInit() {
    console.log(this.report);
    
    

    console.log("TEST");
    var req = Validators.compose([Validators.required]);
    this.form = this.fb.group({
      id: [null],
      creatorid: [''],
      bcamasterid: [''],
      fitmentdetails: ['', req],
      vehiclemodel: ['', req],
      fitmentstatus: [''],
      remarks: ['', req],
      fitmentParts: this.fb.array([]),
      fitmentObservations: this.fb.array([]),
      fitmentKTODetails: this.fb.array([]),
      otherissues: [''],
      foulingparts: [''],
      partqualityissues: [''],
      accessibilityissues: [''],
      preparedby: ['', req],
      checkedby: ['', req],
      isfoulingparts: [''],
      ispartqualityissues: [''],
      isaccessibilityissues: [''],
      isbcalogin: [],
      aodrawingtext: ['', req]

    });

    // var editObj = this.report;
    // if(this.report != undefined){
      // this.form.patchValue(editObj);
      // var retroParts = editObj['umcsParts'];
      // if (retroParts) {
      //   for (var i = 0; i < retroParts.length; i++) {
      //     var retroObj = retroParts[i];
      //     var retroObj1 = retroParts[i];
      //     this.addretro(retroObj);
      //     this.addkto(retroObj1);
      //   }
      // }
  
  
      // this.addnewRow()
      // this.report.valueChanges.subscribe(val2=>{
      //   // console.log(this.kpiform.get('section1Arr').value);
      //   console.log("value changes");
      // })
    // }
    
    console.log(this.report);


  }

  ngOnChanges(changes: any) {
    console.log(changes.report)
    if(changes.report !=undefined){
      this.initForm();

    }
}

  get rowForms1() {
    return this.form.get('fitmentParts') as FormArray;

  }
  get rowForms() {
    return this.form.get('fitmentParts') as FormArray;

  }

  get retroForms() {
    return this.form.get('fitmentObservations') as FormArray;

  }

  get retroForms1() {
    return this.form.get('fitmentKTODetails') as FormArray;
  }


  addRow() {
    var req = Validators.compose([Validators.required]);

    const row1 = this.fb.group({
      partnumber: [''],
      description: [''],
      quantity: [''],
      zgsnwc: [''],
      actualzgs: [''],
      remarks: [''],
      ds: [null],
      dz: [null],
    });

    this.rowForms.push(row1);
  }

  addretro(data) {
    var req = Validators.compose([Validators.required]);
    const row1 = this.fb.group({

      partnumber: [data['partnumber']],
      description: [data['description']],
      quantity: [data['quantity']],
      zgsnwc: [data['zgsnwc']],
      actualzgs: [data['actualzgs']],
      remarks: [data['remarks']],
      ds: [data['ds']],
      dz: [data['dz']],
    });

    this.rowForms1.push(row1);
  }

  addnewRow(data) {
    var req = Validators.compose([Validators.required]);

    const row1 = this.fb.group({

      parameters: [data.parameters],
      dimensionsdrawing: [data.dimensionsdrawing],
      ds: [data.ds],
      dz: [data.dz],
      actualobservtions: [data.actualobservtions],
      remarks: [data.remarks],

    });

    this.retroForms.push(row1);
  }

  addkto(data) {
    var req = Validators.compose([Validators.required]);

    const row1 = this.fb.group({

      partnumber: [data['partnumber']],
      description: [data['description']],
      quantity: [data['quantity']],
      drawingtorqueval: [data['drawingtorqueval']],
      actualtorqueval: [data['actualtorqueval']],
      ds: [data['ds']],
      dz: [data['dz']],
      altpartno: [data['altpartno']],

    });

    this.retroForms1.push(row1);
  }
  get KTOForms() {
    return this.form.get('fitmentKTODetails') as FormArray;

  }
  addkto1() {
    var req = Validators.compose([Validators.required]);

    const datas = this.fb.group({
      partnumber: [''],
      description: [''],
      quantity: [''],
      drawingtorqueval: [''],
      actualtorqueval: [''],
      ds: [null],
      dz: [null],
      altpartno: [''],
    });

    this.KTOForms.push(datas);
  }





}
