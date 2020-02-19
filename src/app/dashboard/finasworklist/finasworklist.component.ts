import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { DataserviceService } from '../../dataservice.service';

declare var $;
@Component({
  selector: 'app-finasworklist',
  templateUrl: './finasworklist.component.html',
  styleUrls: ['./finasworklist.component.css']
})
export class FinasworklistComponent implements OnInit {
  private appconstant = this.ds.appconstant;
  private finasworkorderapi = this.appconstant + 'fwo/list';
  isStoreLogin;
  loading = false;
  constructor(notifierService: NotifierService, private http: Http, private router: Router, private ds: DataserviceService,private fb: FormBuilder) { }

  ngOnInit() {
    this.getworkorderform()
  }
  finaslist(){
    this.router.navigate(['dashboard/finasworknew'], {});
  }
  finasworkorderlist=[]
  getworkorderform() {

    let reqdata ="" ; 
    let url = this.finasworkorderapi;
    let data = reqdata;
    const headers = new Headers();
    this.ds.makeapi(url, reqdata, "post").subscribe(data => {
      this.finasworkorderlist = data;
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
  backHome(){
    this.router.navigateByUrl('/home');
  }
}
