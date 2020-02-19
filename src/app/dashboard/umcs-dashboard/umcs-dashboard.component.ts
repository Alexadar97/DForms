import { Component, OnInit } from '@angular/core';
import { DataserviceService } from '../../dataservice.service';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Chart } from 'angular-highcharts';

declare var $, moment

@Component({
    selector: 'app-umcs-dashboard',
    templateUrl: './umcs-dashboard.component.html',
    styleUrls: ['./umcs-dashboard.component.css','./umcs-dashboard.component.scss']
  })
  export class UmcsDashboardComponent implements OnInit {
    initialDate;
    bsRangeValue;
    maxDate;
    bsConfig;
    private getDashboardAPI = this.ds.appconstant + 'dashboard/get';
    private gedeptlistAPI = this.ds.appconstant + 'dashboard/deptlist';
    private YearAPI = this.ds.appconstant + 'dashboard/getYear';
    constructor(private ds: DataserviceService, private _location: Location, fb: FormBuilder, private router: Router) { 
        var date = new Date();
        this.initialDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        this.maxDate = new Date(date.getFullYear(), date.getMonth(), 0);
        this.bsRangeValue = [this.initialDate, this.maxDate];
    }
    firstdate: any
    lastDate: any
    setFirstdate:any
    setLastDate:any
    datevalue:any
    ngOnInit() {
        this.Year()
        $("#year").val(new Date().getFullYear())
        $(document).ready(() => {
            $('[name=options]').val(new Date().getFullYear());
          });
          this.getDashboardCount(new Date().getFullYear())
       // previous moth first date and last date
       var date = new Date();
       var firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
       var lastDay = new Date(date.getFullYear(), date.getMonth(), 0);
      
       this.bsConfig = Object.assign({}, {containerClass: 'theme-blue', rangeInputFormat: 'DD/MMM/YYYY' })
       
       this.setFirstdate = moment(firstDay).format('DD-MM-YYYY');
       this.setLastDate = moment(lastDay).format('DD-MM-YYYY');
       this.datevalue = this.setFirstdate + " " + "-" + " " + this.setLastDate

       this.GetDeptDropDownList()
   }
   yearlist=[]
    Year(){
        this.ds.makeapi(this.YearAPI,"formtype="+"umcs","post")
        .subscribe(data=>{
          this.yearlist = data
        })
        Error=>{
    
        }
      }
    CurrentYear:any
    GetDeptDropDown = []
    GetDeptDropDownList() {
        var reqdata = "formtype=" + "umcs"
        return this.ds.makeapi(this.gedeptlistAPI, reqdata, "post").
            subscribe(data => {
                this.GetDeptDropDown = data
                this.deptvalue = data[0]
                this.CurrentYear = new Date().getFullYear()
                this.overalchart(this.deptvalue)
            },
                Error => {


                })
    }
    SelectValue:any
    overalchart(value){
        this.deptvalue = value
        var reqdata = {"year" : this.CurrentYear , "formtype" : "umcs" , "fromdate" : this.setFirstdate , "todate" : this.setLastDate , "department" : this.deptvalue}
        return this.ds.makeapi(this.getDashboardAPI, reqdata, "postjson").
            subscribe(data => {
                this.barChartData = data.barChartData
                this.DeptPieChartData = data.pieChartData.oneMonthDept
                this.DatePieChartData = data.pieChartData.oneMonthDate
                this.SelectValue = data.pieChartData
                this.umcs_chart()
                this.month_trend1()
                this.month_trend2()
                this.month_trend3()
                this.month_trend4()
            },
                Error => {

                })
    }
    barChartData: any
    DeptPieChartData:any
    getDashboardCount(value) {
        this.CurrentYear = value
        var reqdata = {"year" : this.CurrentYear , "formtype" : "umcs" , "fromdate" : this.setFirstdate , "todate" : this.setLastDate , "department" : this.deptvalue}
        return this.ds.makeapi(this.getDashboardAPI, reqdata, "postjson").
            subscribe(data => {
                this.barChartData = data.barChartData
                this.SelectValue = data.pieChartData
                this.umcs_chart()
            },
                Error => {

                })
    }
    deptvalue: any
    departmetSelect(value) {
        this.deptvalue = value
        var reqdata = {"year" : this.CurrentYear , "formtype" : "umcs" , "fromdate" : this.setFirstdate , "todate" : this.setLastDate , "department" : this.deptvalue}
        return this.ds.makeapi(this.getDashboardAPI, reqdata, "postjson").
            subscribe(data => {
                this.DeptPieChartData = data.pieChartData.dept
                if(this.MonthandDeptvalue == 1){
                    this.DeptPieChartData = this.SelectValue.oneMonthDept
                }else if(this.MonthandDeptvalue == 2){
                    this.DeptPieChartData = this.SelectValue.twoMonthDept
                }else if(this.MonthandDeptvalue == 3){
                    this.DeptPieChartData = this.SelectValue.threeMonthDept
                }
                this.month_trend4()
                this.month_trend3()
            },
                Error => {

                })
    }
    DatePieChartData:any
    SelectDate(value){
        if(value != null && this.CurrentYear != undefined){
        var dates1 = new Date(value[0]);
        var dates2 = new Date(value[1]);
        this.setFirstdate = moment(dates1).format('DD-MM-YYYY');
        this.setLastDate = moment(dates2).format('DD-MM-YYYY');
         
        var reqdata = {"year" : this.CurrentYear , "formtype" : "umcs" , "fromdate" : this.setFirstdate , "todate" : this.setLastDate , "department" : this.deptvalue}
        return this.ds.makeapi(this.getDashboardAPI, reqdata, "postjson").
            subscribe(data => {
                debugger
                this.DatePieChartData = data.pieChartData
                if(this.MonthandDeptvalue == 1){
                    this.DatePieChartData = this.SelectValue.oneMonthDate
                }else if(this.MonthandDeptvalue == 2){
                    this.DatePieChartData = this.SelectValue.twoMonthDate
                }else if(this.MonthandDeptvalue == 3){
                    this.DatePieChartData = this.SelectValue.threeMonthDate
                }
                debugger
                this.month_trend1()
                this.month_trend2()
            },
                Error => {

                })
            }

    }
    MonthandDeptvalue = 1
    selectMonthandDept(value){
        this.MonthandDeptvalue = value
        if(this.MonthandDeptvalue == 1){
            this.DeptPieChartData = this.SelectValue.oneMonthDept
            this.DatePieChartData = this.SelectValue.oneMonthDate
        }else if(this.MonthandDeptvalue == 2){
            this.DeptPieChartData = this.SelectValue.twoMonthDept
            this.DatePieChartData = this.SelectValue.twoMonthDate
        }else if(this.MonthandDeptvalue == 3){
            this.DeptPieChartData = this.SelectValue.threeMonthDept
            this.DatePieChartData = this.SelectValue.threeMonthDate
        }
        this.month_trend1()
        this.month_trend2()
        this.month_trend3()
        this.month_trend4()
    }
    umcsChart: any
    umcs_chart() {
        this.umcsChart = new Chart({
            chart: {
                type: 'column',
                // width:1000,
                height: 300

            },
            colors: ["#FE8867"],
            title: {
                text: ''
            },
            subtitle: {
                // text: 'Source: <a href="http://en.wikipedia.org/wiki/List_of_cities_proper_by_population">Wikipedia</a>'
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
                pointFormat: 'Series: <b>{point.y}'
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
                dataLabels: {
                    enabled: true,
                    rotation: -90,
                    color: '#FFFFFF',
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
    monthtrend1: any
    month_trend1() {
        this.monthtrend1 = new Chart({
            chart: {
                type: 'column',
                // width:1000,
                height: 300

            },
            colors: ["#3690ff"],
            title: {
                text: ''
            },
            subtitle: {
                // text: 'Source: <a href="http://en.wikipedia.org/wiki/List_of_cities_proper_by_population">Wikipedia</a>'
            },
            xAxis: {
                type: 'category',
                labels: {
                    rotation: 0,
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
            },
            yAxis: {
                rotation: 0,
                min: 0,
                title: {
                    text: ''
                }
            },
            legend: {
                enabled: false
            },
            tooltip: {
                pointFormat: 'Series: <b>{point.y}'
            },
            series: [{
                name: '',
                data: [
                    ['Total Requester',this.DatePieChartData.total],
                ],
                dataLabels: {
                    enabled: true,
                    rotation: 0,
                    color: '#3690ff',
                    align: 'center',
                    format: '{point.y}', // one decimal
                    y: this.DatePieChartData.total, // 10 pixels down from the top
                    style: {
                        fontSize: '13px',
                        // fontFamily: 'Verdana, sans-serif'

                    }
                }
            }]
        });
    }
    monthtrend2: any
    month_trend2() {
        var chardata =  [
            { name: 'L4 Approval Pending', y: this.checkforvalue(this.DatePieChartData.accepted), color: '#51b364' },
            { name: 'Deleted', y: this.checkforvalue(this.DatePieChartData.deleted), color: '#f34747' },
            { name: 'L2 Approved', y: this.checkforvalue(this.DatePieChartData.l2approved), color: '#51b364' },
            { name: 'L2 Rejected', y: this.checkforvalue(this.DatePieChartData.l2rejected), color: '#f34747' },
            { name: 'L3 Approved', y: this.checkforvalue(this.DatePieChartData.l3approved), color: '#51b364' },
            { name: 'L3 Rejected', y: this.checkforvalue(this.DatePieChartData.l3rejected), color: '#f34747' },
            { name: 'L4 Approved', y: this.checkforvalue(this.DatePieChartData.l4approved), color: '#51b364' },
            { name: 'L4 Rejected', y: this.checkforvalue(this.DatePieChartData.l4rejected), color: '#f34747' },
            { name: 'Location Updated', y: this.checkforvalue(this.DatePieChartData.locationupdated), color: '#ffc009' },
            { name: 'Store Approval Pending', y: this.checkforvalue(this.DatePieChartData.pending), color: '#ffc009' },
            { name: 'Recalled', y: this.checkforvalue(this.DatePieChartData.recalled), color: '#ffc009' },
            { name: 'Scrap Moved', y: this.checkforvalue(this.DatePieChartData.scrapmoved), color: '#f34747' },
            { name: 'Store Rejected', y: this.checkforvalue(this.DatePieChartData.storerejected), color: '#f34747' },
            { name: 'Completed', y: this.checkforvalue(this.DatePieChartData.closed), color: '#51b364' },
        ]
        this.monthtrend2 = new Chart({
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
                pointFormat: '{series.name}: <b>{point.percentage}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    showInLegend: true,
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b><br>{point.percentage} %',
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
                data:chardata
            }]
        });
    }
    monthtrend3: any
    month_trend3() {
        this.monthtrend3 = new Chart({
            chart: {
                type: 'column',
                // width:1000,
                height: 300

            },
            colors: ["#3690ff"],
            title: {
                text: ''
            },
            subtitle: {
                // text: 'Source: <a href="http://en.wikipedia.org/wiki/List_of_cities_proper_by_population">Wikipedia</a>'
            },
            xAxis: {
                type: 'category',
                labels: {
                    rotation: 0,
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
            },
            yAxis: {
                rotation: 0,
                min: 0,
                title: {
                    text: ''
                }
            },
            legend: {
                enabled: false
            },
            tooltip: {
                pointFormat: 'Series: <b>{point.y}'
            },
            series: [{
                name: '',
                data: [
                    ['Total Requester',this.DeptPieChartData.total],
                ],
                dataLabels: {
                    enabled: true,
                    rotation: 0,
                    color: '#3690ff',
                    align: 'center',
                    format: '{point.y}', // one decimal
                    y: this.DeptPieChartData.total, // 10 pixels down from the top
                    style: {
                        fontSize: '13px',
                        // fontFamily: 'Verdana, sans-serif'

                    }
                }
            }]
        });
    }
    monthtrend4: any
    checkforvalue(val){
     if(val == undefined || val == null){
         return 0
     }else{
         return val
     }
    
    }
    month_trend4() {
        var chatdata = [
           { name: 'L4 Approval Pending', y: this.checkforvalue(this.DeptPieChartData.accepted), color: '#51b364' },
            { name: 'Deleted', y: this.checkforvalue(this.DeptPieChartData.deleted), color: '#f34747' },
            { name: 'L2 Approved', y: this.checkforvalue(this.DeptPieChartData.l2approved), color: '#51b364' },
            { name: 'L2 Rejected', y: this.checkforvalue(this.DeptPieChartData.l2rejected), color: '#f34747' },
            { name: 'L3 Approved', y: this.checkforvalue(this.DeptPieChartData.l3approved), color: '#51b364' },
            { name: 'L3 Rejected', y: this.checkforvalue(this.DeptPieChartData.l3rejected), color: '#f34747' },
            { name: 'L4 Approved', y: this.checkforvalue(this.DeptPieChartData.l4approved), color: '#51b364' },
            { name: 'L4 Rejected', y: this.checkforvalue(this.DeptPieChartData.l4rejected), color: '#f34747' },
            { name: 'Location Updated', y: this.checkforvalue(this.DeptPieChartData.locationupdated), color: '#ffc009' },
            { name: 'Store Approval Pending', y: this.checkforvalue(this.DeptPieChartData.pending), color: '#ffc009' },
            { name: 'Recalled', y: this.checkforvalue(this.DeptPieChartData.recalled), color: '#ffc009' },
            { name: 'Scrap Moved', y: this.checkforvalue(this.DeptPieChartData.scrapmoved), color: '#f34747' },
            { name: 'Store Rejected', y: this.checkforvalue(this.DeptPieChartData.storerejected), color: '#f34747' },
            { name: 'Completed', y: this.checkforvalue(this.DeptPieChartData.closed), color: '#51b364' },
        ]
        this.monthtrend4 = new Chart({
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
                pointFormat: '{series.name}: <b>{point.y}</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    showInLegend: true,
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b><br>{point.y}',
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
                name: 'Series',
                data: chatdata
            }]
        });
    }
}
