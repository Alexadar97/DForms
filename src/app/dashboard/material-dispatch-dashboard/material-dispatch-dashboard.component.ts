import { Component, OnInit } from '@angular/core';
import { DataserviceService } from '../../dataservice.service';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Chart } from 'angular-highcharts';
declare var $, moment;

@Component({
  selector: 'app-material-dispatch-dashboard',
  templateUrl: './material-dispatch-dashboard.component.html',
  styleUrls: ['./material-dispatch-dashboard.component.css','./material-dispatch-dashboard.scss']
})
export class MaterialDispatchDashboardComponent implements OnInit {
  initialDate;
  bsRangeValue;
  maxDate;
  bsConfig;
    highChart: any;
    pieChart: any;
    waterFallChart: any;
    singleHighChart: any;
    private getDashboardAPI = this.ds.appconstant + 'dashboard/get';
    private YearAPI = this.ds.appconstant + 'dashboard/getYear';

    constructor(private ds: DataserviceService, private _location: Location, fb: FormBuilder, private router: Router) {
      var date = new Date();
      this.initialDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
      this.maxDate = new Date(date.getFullYear(), date.getMonth(), 0);
      this.bsRangeValue = [this.initialDate, this.maxDate];
     }
     firstdate: any
     lastDate: any
     setFirstdate: any
     setLastDate: any
     datevalue: any
     CurrentYear:any
    ngOnInit() {
      this.Year()
      this.CurrentYear = new Date().getFullYear()
      $("#year").val(new Date().getFullYear());
    $(document).ready(() => {
      $('[name=year]').val(new Date().getFullYear());
    });
    this.SelectYear(new Date().getFullYear())
      // previous moth first date and last date
      var date = new Date();
      var firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
      var lastDay = new Date(date.getFullYear(), date.getMonth(), 0);
     
      this.bsConfig = Object.assign({}, {containerClass: 'theme-blue', rangeInputFormat: 'DD/MMM/YYYY' })

      this.setFirstdate = moment(firstDay).format('DD-MM-YYYY');
      this.setLastDate = moment(lastDay).format('DD-MM-YYYY');

      this.datevalue = this.setFirstdate + " " + "-" + " " + this.setLastDate
    this.getDashboardCount()
    }
    yearlist=[]
    Year(){
      this.ds.makeapi(this.YearAPI,"formtype="+"materialdispatch","post")
      .subscribe(data=>{
        this.yearlist = data
      })
      Error=>{
  
      }
    }
    barChartData:any
    MisWaterData:any
    piechardata:any
    exigencycase:any
    getDashboardCount(){
      var reqdata = {"year" : this.CurrentYear , "formtype" : "materialdispatch" , "fromdate" : this.setFirstdate , "todate" : this.setLastDate}
      return this.ds.makeapi(this.getDashboardAPI,reqdata,"postjson").
        subscribe(data=>{
            this.barChartData = data.barChartData
            this.MisWaterData = data.waterFallData
            this.piechardata = data.dateExigencyPieChartData.exigency
            this.exigencycase = data.dateExigencyPieChartData
          this.HighChart();
          this.PieChart();
          this.WaterFallChart();
          this.SingleHighChart();
        },
        Error=>{
  
        })
    }
    SelectYear(value){
      this.CurrentYear = value
      var reqdata = {"year" : this.CurrentYear , "formtype" : "materialdispatch" , "fromdate" : this.setFirstdate , "todate" : this.setLastDate}
      return this.ds.makeapi(this.getDashboardAPI,reqdata,"postjson").
        subscribe(data=>{
            this.barChartData = data.barChartData
            this.MisWaterData = data.waterFallData
            this.piechardata = data.dateExigencyPieChartData.exigency
            this.exigencycase = data.dateExigencyPieChartData
          this.HighChart();
          this.PieChart();
          this.WaterFallChart();
          this.SingleHighChart();
        },
        Error=>{
  
        })
    }
    DatePieChartData:any
    SelectDate(value){
        if(value != null && this.CurrentYear != undefined){
        var dates1 = new Date(value[0]);
        var dates2 = new Date(value[1]);
        this.setFirstdate = moment(dates1).format('DD-MM-YYYY');
        this.setLastDate = moment(dates2).format('DD-MM-YYYY');
         
        var reqdata = {"year" : this.CurrentYear , "formtype" : "materialdispatch" , "fromdate" : this.setFirstdate , "todate" : this.setLastDate}
        return this.ds.makeapi(this.getDashboardAPI, reqdata, "postjson").
            subscribe(data => {
              if(this.exigencyvalue == 1){
                this.piechardata = data.dateExigencyPieChartData.exigency
              }else if(this.exigencyvalue == 2){
                this.piechardata = data.dateExigencyPieChartData.nonexigency
              }
               this.SingleHighChart()
               this.PieChart()
            },
                Error => {

                })
            }

    }
    exigencyvalue = 1
    roadandhir(value){
      this.exigencyvalue = value
      if(this.exigencyvalue == 1){
        this.piechardata = this.exigencycase.exigency
      }else if(this.exigencyvalue == 2){
        this.piechardata = this.exigencycase.nonexigency
      }
    }
    HighChart() {
      this.highChart = new Chart({
        chart: {
          type: 'column',
          height: 350,
        },
        title: {
          text: ''
        },
        subtitle: {
          text: 'Source: <a href="http://en.wikipedia.org/wiki/List_of_cities_proper_by_population">Wikipedia</a>'
        },
        xAxis: {
          type: 'category',
          labels: {
            rotation: -45,
            style: {
              fontSize: '13px',
              fontFamily: 'Verdana, sans-serif'
            }
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: ''
          }
        },
        legend: {
          enabled: false
        },
        tooltip: {
          pointFormat: 'Population in 2017: <b>{point.y:.1f} millions</b>'
        },
        series: [{
          name: 'Population',
          data: [
            ['Jan', this.barChartData.Jan],
            ['Feb', this.barChartData.Feb],
            ['Mar', this.barChartData.Mar],
            ['Apr', this.barChartData.Apr],
            ['May', this.barChartData.May],
            ['Jun', this.barChartData.June],
            ['Jul', this.barChartData.July],
            ['Aug', this.barChartData.Aug],
            ['Sep', this.barChartData.Sep],
            ['Oct', this.barChartData.Oct],
            ['Nov', this.barChartData.Nov],
            ['Dec', this.barChartData.Dec],
          ],
          color: '#fb655ad1',
          dataLabels: {
            enabled: true,
            rotation: -90,
            color: '#FFFFFF',
            align: 'right',
            format: '{point.y:.1f}', // one decimal
            y: 10, // 10 pixels down from the top
            style: {
              fontSize: '13px',
              fontFamily: 'Verdana, sans-serif'
            }
          }
        }]
      });
    }
  
    SingleHighChart() {
      this.singleHighChart = new Chart({
        chart: {
          type: 'column',
          height:300
        },
        title: {
          text: ''
        },
        subtitle: {
          text: 'Source: <a href="http://en.wikipedia.org/wiki/List_of_cities_proper_by_population">Wikipedia</a>'
        },
        xAxis: {
          type: 'category',
          labels: {
            rotation: -45,
            style: {
              fontSize: '13px',
              fontFamily: 'Verdana, sans-serif'
            }
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: ''
          }
        },
        legend: {
          enabled: false
        },
        tooltip: {
          pointFormat: 'Series: <b>{point.y}</b>'
        },
        series: [{
          name: 'Population',
          data: [
            ['', this.piechardata.total],
          ],
          color: '#3690ff',
          dataLabels: {
            enabled: true,
            rotation: -90,
            color: '#3690ff',
            align: 'right',
            format: '{point.y}', // one decimal
            y: 10, // 10 pixels down from the top
            style: {
              fontSize: '13px',
              fontFamily: 'Verdana, sans-serif'
            }
          }
        }]
      });
    }
    checkforvalue(val){
      if(val == undefined || val == null){
          return 0
      }else{
          return val
      }
     
     }
    PieChart() {
      var setchatdata = [
        { name: 'Completed', y:  this.checkforvalue(this.piechardata.closed), color: '#51b364' },
        { name: 'Deleted', y:  this.checkforvalue(this.piechardata.deleted), color: '#f34747' },
        { name: 'L3 Approved', y:  this.checkforvalue(this.piechardata.l3approved), color: '#51b364' },
        { name: 'L3 Rejected', y:  this.checkforvalue(this.piechardata.l3rejected), color: '#f34747' },
        { name: 'L3 Approved', y:  this.checkforvalue(this.piechardata.l3approved), color: '#51b364' },
        { name: 'L4 Approved', y:  this.checkforvalue(this.piechardata.l4approved), color: '#51b364' },
        { name: 'L4 Rejected', y:  this.checkforvalue(this.piechardata.l4rejected), color: '#f34747' },
        { name: 'Pack Dispached', y:  this.checkforvalue(this.piechardata.packdispatched), color: '#ffc009' },
        { name: 'Pack Initiated', y:  this.checkforvalue(this.piechardata.packinitiated), color: '#ffc009' },
        { name: 'Pack Submitted', y:  this.checkforvalue(this.piechardata.packsubmitted), color: '#ffc009' },
        { name: 'Recalled', y:  this.checkforvalue(this.piechardata.recalled), color: '#ffc009' },
        
      ]
      this.pieChart = new Chart({
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie',
          height: 350,
        },
        title: {
          text: ''
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.y}%</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            showInLegend: true,
            dataLabels: {
              enabled: true,
              format: '{point.y} %',
              distance: -50,
              filter: {
                property: 'percentage',
                operator: '>',
                value: 4,
              }
            }
          }
        },
        series: [{
          name: 'Share',
          data: setchatdata
        }]
      });
    }
  
  
    WaterFallChart() {
      function negateFormat(y) {
        if (y < 0) {
          y = Math.abs(y)
  
        }
        return '' + y
  
      }
      this.waterFallChart = new Chart({
        chart: {
          type: 'waterfall',
          height: 300
        },
  
        title: {
          text: ''
        },
  
        xAxis: {
          type: 'category'
        },
  
        yAxis: {
          title: {
            text: ''
          }
        },
  
        legend: {
          enabled: false
        },
  
        tooltip: {
          pointFormat: 'Series:<b>{point.y}</b>'
        },
  
        series: [{

          data: [{
            name: "Total Requested",
            y: this.MisWaterData.total,
            value: this.MisWaterData.total,
            color: "#3690ff",
            dataLabels: {
              enabled: true,
              formatter: function () {
                return negateFormat(this.y)
              }
            }
          },
          {
            name: "Deleted",
            y: - this.MisWaterData.deleted,
            value: this.MisWaterData.deleted,
            color: "#f34747",
            dataLabels: {
              enabled: true,
              formatter: function () {
                return negateFormat(this.y)
              }
            }
          },
          {
            name: "L3 Approved",
            y: - this.MisWaterData.l3approved,
            value: this.MisWaterData.l3approved,
            color: "#51b364",
            dataLabels: {
              enabled: true,
              formatter: function () {
                return negateFormat(this.y)
              }
            }
  
          },
        
             {
            name: "L3 Rejected",
            y: - this.MisWaterData.l3rejected,
            value: this.MisWaterData.l3rejected,
            color: "#f34747",
            dataLabels: {
              enabled: true,
              formatter: function () {
                return negateFormat(this.y)
              }
            }
  
          },
          {
            name: "L4 Approved",
            y: - this.MisWaterData.l4approved,
            value: this.MisWaterData.l4approved,
            color: "#51b364",
            dataLabels: {
              enabled: true,
              formatter: function () {
                return negateFormat(this.y)
              }
            }
  
          },
            {
            name: "L4 Rejected",
            y: - this.MisWaterData.l4rejected,
            value: this.MisWaterData.l4rejected,
            color: "#f34747",
            dataLabels: {
              enabled: true,
              formatter: function () {
                return negateFormat(this.y)
              }
            }
          },
          {
            name: "Pack Dispatched",
            y: - this.MisWaterData.packdispatched,
            value: this.MisWaterData.packdispatched,
            color: "#ffc009",
            dataLabels: {
              enabled: true,
              formatter: function () {
                return negateFormat(this.y)
              }
            }
          },
          {
            name: "Pack Initiated",
            y: - this.MisWaterData.packinitiated,
            value: this.MisWaterData.packinitiated,
            color: "#ffc009",
            dataLabels: {
              enabled: true,
              formatter: function () {
                return negateFormat(this.y)
              }
            }
          },
          {
            name: "Pack Submitted",
            y: - this.MisWaterData.packsubmitted,
            value: this.MisWaterData.packsubmitted,
            color: "#ffc009",
            dataLabels: {
              enabled: true,
              formatter: function () {
                return negateFormat(this.y)
              }
            }
  
          },
          {
            name: "Recalled",
            y: - this.MisWaterData.recalled,
            value: this.MisWaterData.recalled,
            color: "#ffc009",
            dataLabels: {
              enabled: true,
              formatter: function () {
                return negateFormat(this.y)
              }
            }
  
          },
          {
            name: "Store Submitted",
            y: - this.MisWaterData.storesubmitted,
            value: this.MisWaterData.storesubmitted,
            color: "#ffc009",
            dataLabels: {
              enabled: true,
              formatter: function () {
                return negateFormat(this.y)
              }
            }
  
          },
          {
            name: "Completed",
            y: - this.MisWaterData.closed,
            value: this.MisWaterData.closed,
            color: "#51b364",
            dataLabels: {
              enabled: true,
              formatter: function () {
                return negateFormat(this.y)
              }
            }
  
          }
          ],
  
        }]
      });
    }
  
    dateformat(){
     var setdata =  $("#date").val()
     var demo = (setdata).split("-");
     var dates1 = new Date(demo[0]);
     var dates2 = new Date(demo[1]);
     var set1 = moment(dates1).format('DD-MM-YYYY');
     var set2 = moment(dates2).format('DD-MM-YYYY');
  }
  }
  