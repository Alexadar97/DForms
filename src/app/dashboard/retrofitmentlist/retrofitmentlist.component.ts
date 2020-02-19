import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { DataserviceService } from '../../dataservice.service';
declare var $;
@Component({
  selector: 'app-retrofitmentlist',
  templateUrl: './retrofitmentlist.component.html',
  styleUrls: ['./retrofitmentlist.component.css']
})
export class RetrofitmentlistComponent implements OnInit {
  private appconstant = this.ds.appconstant;
  private retrofitementlist = this.appconstant + 'fitment/list';
  isStoreLogin;
  constructor(notifierService: NotifierService, private http: Http, private router: Router, private ds: DataserviceService, private fb: FormBuilder) { }

  ngOnInit() {
    this.getretrofitmentform()
  }
  retrolist() {
    this.router.navigate(['dashboard/retrofitmentnew'], {});

  }
  getretrofitmentform() {

    let reqdata = "";
    let url = this.retrofitementlist;
    let data = reqdata;
    const headers = new Headers();
    this.ds.makeapi(url, reqdata, "post").subscribe(data => {
      this.retrofitementlist = data;
      console.log(data)
    })
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
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
}
