import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { DataserviceService } from '../../dataservice.service';

// import { ChartModule } from 'angular-highcharts';


@Component({
  selector: 'app-metric',
  templateUrl: './metric.component.html',
  styleUrls: ['./metric.component.css']
})
export class MetricComponent implements OnInit {

  barchart1;
  barchart2;
  barchart3;
  umcs = {
    requested:0,
    pending:0
  }
  nmcs = {
    requested:0,
    pending:0
  }
  sto = {
    requested:0,
    inprogress:0,
    partial:0,
    completed:0
  }
  constructor( private router: Router, private http: Http, private ds: DataserviceService) { }



  ngOnInit() {
    this.SelectForms(1)

  }
  backHome(){
    this.router.navigateByUrl('/home');
  }
  Formvalue
  SelectForms(value){
    this.Formvalue= value
  }
}
