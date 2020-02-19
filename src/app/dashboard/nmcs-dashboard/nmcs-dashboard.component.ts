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
    selector: 'app-nmcs-dashboard',
    templateUrl: './nmcs-dashboard.component.html',
    styleUrls: ['./nmcs-dashboard.component.css', './nmcs-dashboard.component.scss']
})
export class NmcsDashboardComponent implements OnInit {
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
    setFirstdate: any
    setLastDate: any
    datevalue: any
    ngOnInit() {
        this.Year()
        $("#year").val(new Date().getFullYear())
        var year = new Date().getFullYear()
        this.getDashboardCount(year)
        $(document).ready(() => {
            $('[name=year]').val(year);
          });
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
        this.ds.makeapi(this.YearAPI,"formtype="+"nmcs","post")
        .subscribe(data=>{
          this.yearlist = data
        })
        Error=>{
    
        }
      }
    CurrentYear: any
    GetDeptDropDown = []
    GetDeptDropDownList() {
        var reqdata = "formtype=" + "nmcs"
        return this.ds.makeapi(this.gedeptlistAPI, reqdata, "post").
            subscribe(data => {
                this.GetDeptDropDown = data
                this.deptvalue = data[0]
                this.CurrentYear = new Date().getFullYear()
                this.ovralchart(this.deptvalue)
            },
                Error => {


                })
    }
    ovralchart(value) {
        this.deptvalue = value
        var reqdata = {"year" : this.CurrentYear , "formtype" : "nmcs" , "fromdate" : this.setFirstdate , "todate" : this.setLastDate , "department" : this.deptvalue}
        return this.ds.makeapi(this.getDashboardAPI, reqdata, "postjson").
            subscribe(data => {
                this.barChartData = data.barChartData
                this.DeptPieChartData = data.pieChartData.dept
                this.DatePieChartData = data.pieChartData.date
                this.nmcs_chart()
                this.month_trend1()
                this.month_trend2()
                this.month_trend3()
                this.month_trend4()
            },
                Error => {

                })
    }
    barChartData: any
    DeptPieChartData: any
    getDashboardCount(value) {
        this.CurrentYear = value
        var reqdata = {"year" : this.CurrentYear , "formtype" : "nmcs" , "fromdate" : this.setFirstdate , "todate" : this.setLastDate , "department" : this.deptvalue}
        return this.ds.makeapi(this.getDashboardAPI, reqdata, "postjson").
            subscribe(data => {
                this.barChartData = data.barChartData
                this.nmcs_chart()
            },
                Error => {

                })
    }
    deptvalue: any
    departmetSelect(value) {
        this.deptvalue = value
        var reqdata = {"year" : this.CurrentYear , "formtype" : "nmcs" , "fromdate" : this.setFirstdate , "todate" : this.setLastDate , "department" : this.deptvalue}
        return this.ds.makeapi(this.getDashboardAPI, reqdata, "postjson").
            subscribe(data => {
                this.DeptPieChartData = data.pieChartData.dept
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
         
        var reqdata = {"year" : this.CurrentYear , "formtype" : "nmcs" , "fromdate" : this.setFirstdate , "todate" : this.setLastDate , "department" : this.deptvalue}
        return this.ds.makeapi(this.getDashboardAPI, reqdata, "postjson").
            subscribe(data => {
                this.DatePieChartData = data.pieChartData.date
                this.month_trend1()
                this.month_trend2()
            },
                Error => {

                })
            }

    }

    nmcsChart: any
    nmcs_chart() {
        this.nmcsChart = new Chart({
            chart: {
                type: 'column',
                // width:1000,
                height: 350,

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
                pointFormat: '<b>{point.y}</b>'
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
                height:300

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
                pointFormat: '<b>{point.y}</b>'
            },
            series: [{
                name: '',
                data: [
                    ['Total Requester', this.DatePieChartData.total],
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
    checkforvalue(val){
        if(val == undefined || val == null){
            return 0
        }else{
            return val
        }
       
       }
    monthtrend2: any
    month_trend2() {
        var chatdata = [
            { name: 'L4 Approval Pending', y: this.checkforvalue(this.DatePieChartData.accepted), color: '#ffc009' },
            { name: 'Store Approval Pending', y: this.checkforvalue(this.DatePieChartData.pending), color: '#ffc009' },
            { name: 'Location Update Pending', y: this.checkforvalue(this.DatePieChartData.approved), color: '#ffc009' },
            { name: 'Deleted', y: this.checkforvalue(this.DatePieChartData.deleted), color: '#f34747' },
            { name: 'Location Updated', y: this.checkforvalue(this.DatePieChartData.locationupdated), color: '#ffc009' },
            { name: 'Recalled', y: this.checkforvalue(this.DatePieChartData.recalled), color: '#ffc009' },
            { name: 'L4 Rejected', y: this.checkforvalue(this.DatePieChartData.rejected), color: '#f34747' },
            { name: 'Store Rejected', y: this.checkforvalue(this.DatePieChartData.storerejected), color: '#f34747' },
            { name: 'Completed', y: this.checkforvalue(this.DatePieChartData.closed), color: '#51b364' },
        ]
        this.monthtrend2 = new Chart({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
                height:300
            },
            title: {
                text: ''
            },
            tooltip: {
                pointFormat: '<b>{point.y}</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    showInLegend: true,
                    dataLabels: {
                        enabled: true,
                        format: '{point.y}',
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
                data: chatdata
            }]
        });
    }
    monthtrend3: any
    month_trend3() {
        this.monthtrend3 = new Chart({
            chart: {
                type: 'column',
                // width:1000,
                height:300

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
                pointFormat: '<b>{point.y}</b>'
            },
            series: [{
                name: '',
                data: [
                    ['Total Requester', this.DeptPieChartData.total],
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
    month_trend4() {
        var chatdata = [
            { name: 'L4 Approval Pending', y: this.checkforvalue(this.DeptPieChartData.accepted), color: '#ffc009' },
            { name: 'Store Approval Pending', y: this.checkforvalue(this.DeptPieChartData.pending), color: '#ffc009' },
            { name: 'Location Update Pending', y: this.checkforvalue(this.DeptPieChartData.approved), color: '#ffc009' },
            { name: 'Deleted', y: this.checkforvalue(this.DeptPieChartData.deleted), color: '#f34747' },
            { name: 'Location Updated', y: this.checkforvalue(this.DeptPieChartData.locationupdated), color: '#ffc009' },
            { name: 'Recalled', y: this.checkforvalue(this.DeptPieChartData.recalled), color: '#ffc009' },
            { name: 'L4 Rejected', y: this.checkforvalue(this.DeptPieChartData.rejected), color: '#f34747' },
            { name: 'Store Rejected', y: this.checkforvalue(this.DeptPieChartData.storerejected), color: '#f34747' },
            { name: 'Completed', y: this.checkforvalue(this.DeptPieChartData.closed), color: '#51b364' },
        ]
        this.monthtrend4 = new Chart({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
                height:350
            },
            title: {
                text: ''
            },
            tooltip: {
                pointFormat: '<b>{point.y}</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    showInLegend: true,
                    dataLabels: {
                        enabled: true,
                        format: '{point.y}',
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
                data:chatdata
            }]
        });
    }
}
