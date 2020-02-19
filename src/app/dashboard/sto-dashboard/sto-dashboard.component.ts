import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { DataserviceService } from '../../dataservice.service';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
declare var $, moment;
@Component({
  selector: 'app-sto-dashboard',
  templateUrl: './sto-dashboard.component.html',
  styleUrls: ['./sto-dashboard.component.css', './sto-dashboard.component.scss']
})
export class StoDashboardComponent implements OnInit {
  private appconstant = this.ds.appconstant;
  initialDate
  maxDate
  bsRangeValue
  private DashboardAPI = this.appconstant + 'dashboard/get';
  private DepartmentAPI = this.appconstant + 'dashboard/deptlist';
  private YearAPI = this.appconstant + 'dashboard/getYear';
  constructor(private router: Router, private http: Http, private fb: FormBuilder, private ds: DataserviceService) {
    var date = new Date();
    this.initialDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    this.maxDate = new Date(date.getFullYear(), date.getMonth(), 0);
    this.bsRangeValue = [this.initialDate, this.maxDate];
  }
  selectDate
  set1
  set2
  bsConfig
  ngOnInit() {
    $("#year").val(new Date().getFullYear())
    this.selectYear(new Date().getFullYear())
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth(), 0);
    this.setDate1 = moment(firstDay).format('DD-MM-YYYY');
    this.setDate2 = moment(lastDay).format('DD-MM-YYYY');
    this.bsConfig = Object.assign({}, { containerClass: 'theme-blue', rangeInputFormat: 'DD/MMM/YYYY' })
    this.stopiechart2()
    this.TrendbarChart2()
    this.GetDepartmentAPI()
    this.selectDate = $("#duration").val()
    console.log(this.selectDate)
    this.GetWaterFallDashboardAPI()
    this.GetBarDashboardAPI()
    this.dateRadio("yes")
    this.Year()
  }

  YearValue: any
  yearlist=[]
  Year(){
    this.ds.makeapi(this.YearAPI,"formtype="+"sto","post")
    .subscribe(data=>{
      this.yearlist = data
    })
    Error=>{

    }
  }
  selectYear(value) {
    this.YearValue = value
    console.log(value)
    this.GetBarDashboardAPI()
  }
  departval
  Department(value) {
    this.firstDepartData = value
    this.GetDepartPieDashboardAPI()
  }
  departmentData
  firstDepartData
  GetDepartmentAPI() {
    var reqdata = "formtype=" + "sto"
    return this.ds.makeapi(this.DepartmentAPI, reqdata, "post")
      .subscribe(data => {
        this.departmentData = data
        this.firstDepartData = data[0]
        console.log(this.firstDepartData)
        this.GetDepartPieDashboardAPI()
      },
        Error => {
        });
  }
  DepartExigency
  deptexigency(value) {
    this.DepartExigency = value
    this.GetDepartPieDashboardAPI()
  }
  SelectDate(value) {
    if (value != null) {
      this.setDate1 = moment(value[0]).format('DD-MM-YYYY');
      this.setDate2 = moment(value[1]).format('DD-MM-YYYY');
      this.GetDatePieDashboardAPI()
    }

  }
  DateRxigency
  DateSelect = []
  setDate1
  setDate2
  dateRadio(value) {
    this.DateRxigency = value
    this.GetDatePieDashboardAPI()
  }
  GetWaterFallDashboardAPI() {
    this.YearValue = moment().year();
    var reqdata = { "year": this.YearValue, "formtype": "sto", "fromdate": this.setDate1, "todate": this.setDate2, "department": this.firstDepartData, "category": "", "supervisor": "" }
    return this.ds.makeapi(this.DashboardAPI, reqdata, "postjson")
      .subscribe(data => {
        this.WaterFallData = data['waterFallData']
        this.stowaterFall()

      },
        Error => {
        });
  }
  StoData: any
  WaterFallData: any
  exigencyData
  nonexigencyData
  DateexigencyData
  DatenonexigencyData
  GetBarDashboardAPI() {
    this.YearValue = moment().year();
    var reqdata = { "year": this.YearValue, "formtype": "sto", "fromdate": this.setDate1, "todate": this.setDate2, "department": this.firstDepartData, "category": "", "supervisor": "" }
    return this.ds.makeapi(this.DashboardAPI, reqdata, "postjson")
      .subscribe(data => {
        this.StoData = data['barChartData']
        this.StobarChart()

      },
        Error => {
        });
  }
  GetDatePieDashboardAPI() {
    var reqdata = { "year" : this.YearValue , "formtype" : "sto" , "fromdate" : this.setDate1 , "todate" : this.setDate2 , "department" : this.firstDepartData, "category": "", "supervisor": "" }
    return this.ds.makeapi(this.DashboardAPI, reqdata, "postjson")
      .subscribe(data => {
        this.DateexigencyData = data['dateExigencyPieChartData']['exigency']
        this.DatenonexigencyData = data['dateExigencyPieChartData']['nonexigency']
        if (this.DateRxigency == "yes") {
          this.stopiechart1Exi()
          this.TrendbarChartDateExi()
        }
        else {
          this.stopiechart1NonExi()
          this.TrendbarChartDateNonExi()
        }
      },
        Error => {
        });
  }
  GetDepartPieDashboardAPI() {
    var reqdata = {"year" : this.YearValue , "formtype" : "sto" , "fromdate" : this.setDate1 , "todate" : this.setDate2 , "department" : this.firstDepartData,"category":"","supervisor":""}
    return this.ds.makeapi(this.DashboardAPI, reqdata, "postjson")
      .subscribe(data => {
        this.exigencyData = data['deptExigencyPieChartData']['exigency']
        this.nonexigencyData = data['deptExigencyPieChartData']['nonexigency']
        if (this.DepartExigency == "yes") {
          this.stopiechartExi()
          this.TrendbarChart3Exi()
        }
        else {
          this.stopiechartNonExi()
          this.TrendbarChart3NonExi()
        }
      },
        Error => {
        });
  }
  barchart
  StobarChart() {

    this.barchart = new Chart({
      chart: {
        type: 'column',
        height: 250,

      },
      title: {
        text: ''
      },
      subtitle: {
        text: ''
      },
      xAxis: {
        type: 'category',
        labels: {
          rotation: -45,
          style: {
            fontSize: '13px',
            // fontFamily: 'Verdana, sans-serif'
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
        pointFormat: '<b>{point.y} </b>'
      },
      series: [{
        name: '',
        color: "#d1274b",
        data: [
          ['JAN', this.StoData.Jan],
          ['FEB', this.StoData.Feb],
          ['MAR', this.StoData.Mar],
          ['APR', this.StoData.Apr],
          ['MAY', this.StoData.May],
          ['JUN', this.StoData.June],
          ['JUL', this.StoData.July],
          ['AUG', this.StoData.Aug],
          ['SEP', this.StoData.Sep],
          ['OCT', this.StoData.Oct],
          ['NOV', this.StoData.Nov],
          ['DEC', this.StoData.Dec],

        ],
        dataLabels: {
          enabled: true,
          rotation: -90,
          color: '#FFFFFF',
          align: 'right',
          format: '{point.y}', // one decimal
          y: 10, // 10 pixels down from the top
          style: {
            fontSize: '11px',
            // fontFamily: 'Verdana, sans-serif'
          }
        }
      }]
    });
  }
  barChartTrend1
  TrendbarChartDateExi() {

    this.barChartTrend1 = new Chart({
      chart: {
        type: 'column',
        height: 250,

      },
      title: {
        text: ''
      },
      subtitle: {
        text: ''
      },
      xAxis: {
        type: 'category',
        labels: {
          rotation: -45,
          style: {
            fontSize: '13px',
            // fontFamily: 'Verdana, sans-serif'
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
        pointFormat: '<b>{point.y} </b>'
      },
      series: [{
        name: '',
        color: "#3690ff",
        data: [
          ['Total Requester', this.DateexigencyData.total],

        ],
        dataLabels: {
          enabled: true,
          rotation: -90,
          color: '#FFFFFF',
          align: 'right',
          format: '{point.y}', // one decimal
          y: 10, // 10 pixels down from the top
          style: {
            fontSize: '11px',
            // fontFamily: 'Verdana, sans-serif'
          }
        }
      }]
    });
  }
  TrendbarChartDateNonExi() {

    this.barChartTrend1 = new Chart({
      chart: {
        type: 'column',
        height: 250,

      },
      title: {
        text: ''
      },
      subtitle: {
        text: ''
      },
      xAxis: {
        type: 'category',
        labels: {
          rotation: -45,
          style: {
            fontSize: '13px',
            // fontFamily: 'Verdana, sans-serif'
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
        pointFormat: '<b>{point.y} </b>'
      },
      series: [{
        name: '',
        color: "#3690ff",
        data: [
          ['Total Requester', this.DatenonexigencyData.total],

        ],
        dataLabels: {
          enabled: true,
          rotation: -90,
          color: '#FFFFFF',
          align: 'right',
          format: '{point.y}', // one decimal
          y: 10, // 10 pixels down from the top
          style: {
            fontSize: '11px',
            // fontFamily: 'Verdana, sans-serif'
          }
        }
      }]
    });
  }
  barChartTrend2
  TrendbarChart2() {

    this.barChartTrend2 = new Chart({
      chart: {
        type: 'column',
        height: 250,

      },
      title: {
        text: ''
      },
      subtitle: {
        text: ''
      },
      xAxis: {
        type: 'category',
        labels: {
          rotation: -45,
          style: {
            fontSize: '13px',
            // fontFamily: 'Verdana, sans-serif'
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
        pointFormat: '<b>{point.y} </b>'
      },
      series: [{
        name: '',
        color: "#58b49f",
        data: [
          ['JAN', 24.2],

        ],
        dataLabels: {
          enabled: true,
          rotation: -90,
          color: '#FFFFFF',
          align: 'right',
          format: '{point.y}', // one decimal
          y: 10, // 10 pixels down from the top
          style: {
            fontSize: '11px',
            // fontFamily: 'Verdana, sans-serif'
          }
        }
      }]
    });
  }
  barChartTrend3
  TrendbarChart3Exi() {

    this.barChartTrend3 = new Chart({
      chart: {
        type: 'column',
        height: 250,

      },
      title: {
        text: ''
      },
      subtitle: {
        text: ''
      },
      xAxis: {
        type: 'category',
        labels: {
          rotation: -45,
          style: {
            fontSize: '13px',
            // fontFamily: 'Verdana, sans-serif'
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
        pointFormat: '<b>{point.y} </b>'
      },
      series: [{
        name: '',
        color: "#3690ff",
        data: [
          ['Total Requester', this.exigencyData.total],

        ],
        dataLabels: {
          enabled: true,
          rotation: -90,
          color: '#FFFFFF',
          align: 'right',
          format: '{point.y}', // one decimal
          y: 10, // 10 pixels down from the top
          style: {
            fontSize: '11px',
            // fontFamily: 'Verdana, sans-serif'
          }
        }
      }]
    });
  }
  TrendbarChart3NonExi() {

    this.barChartTrend3 = new Chart({
      chart: {
        type: 'column',
        height: 250,

      },
      title: {
        text: ''
      },
      subtitle: {
        text: ''
      },
      xAxis: {
        type: 'category',
        labels: {
          rotation: -45,
          style: {
            fontSize: '13px',
            // fontFamily: 'Verdana, sans-serif'
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
        pointFormat: '<b>{point.y} </b>'
      },
      series: [{
        name: '',
        color: "#3690ff",
        data: [
          ['Total Requester', this.nonexigencyData.total],

        ],
        dataLabels: {
          enabled: true,
          rotation: -90,
          color: '#FFFFFF',
          align: 'right',
          format: '{point.y}', // one decimal
          y: 10, // 10 pixels down from the top
          style: {
            fontSize: '11px',
            // fontFamily: 'Verdana, sans-serif'
          }
        }
      }]
    });
  }
  waterfallchart1
  stowaterFall() {
    function negateFormat(y) {
      if (y < 0) {
        y = Math.abs(y)

      }
      return '' + y

    }
    this.waterfallchart1 = new Chart({
      chart: {
        type: 'waterfall',
        height: 250,

      },

      title: {
        text: ''
      },

      xAxis: {
        type: 'category',
        labels: {
          autoRotation: false
        }
      },

      yAxis: {
        min: 0,
        // tickInterval: 1000,
        title: {
          text: ' '
        }
      },

      legend: {
        enabled: false
      },
      // plotOptions: {
      //   column: {
      //     stacking: 'normal',


      //   }
      // },

      tooltip: {
        pointFormat: '<b>{point.value}</b> '
      },

      series: [{

        data: [{
          name: "Total ",
          y: this.WaterFallData.total,
          value: this.WaterFallData.total,
          color: "#3690ff",
          dataLabels: {
            enabled: true,
          }
        }, {
          name: "L4 Approval Pending",
          y: -this.WaterFallData.l4approvalpending,
          value: this.WaterFallData.l4approvalpending,
          color: "#ffc009",
          dataLabels: {
            enabled: true,
            formatter: function () {
              return negateFormat(this.y)
            }
          }
        },
        {
          name: "L4 Approved",
          y: -this.WaterFallData.l4approved,
          value: this.WaterFallData.l4approved,
          color: "#ffc009",
          dataLabels: {
            enabled: true,
            formatter: function () {
              return negateFormat(this.y)
            }
          }
        }, {
          name: " L4 Reject",
          y: - this.WaterFallData.l4rejected,
          value: this.WaterFallData.l4rejected,
          color: "#f34747",
          dataLabels: {
            enabled: true,
            formatter: function () {
              return negateFormat(this.y)
            }
          }

        },
        {
          name: "L3 Reject",
          y: -this.WaterFallData.l3rejected,
          value: this.WaterFallData.l3rejected,
          color: "#f34747",
          dataLabels: {
            enabled: true,
            formatter: function () {
              return negateFormat(this.y)
            }
          }

        },
        {
          name: "BA Approval Pending",
          y: -this.WaterFallData.baapprovalpending,
          value: this.WaterFallData.baapprovalpending,
          color: "#ffc009",
          dataLabels: {
            enabled: true,
            formatter: function () {
              return negateFormat(this.y)
            }
          }

        },
        {
          name: "Budget Rejected",
          y: -this.WaterFallData.budgetrejected,
          value: this.WaterFallData.budgetrejected,
          color: "#ffc009",
          dataLabels: {
            enabled: true,
            formatter: function () {
              return negateFormat(this.y)
            }
          }

        },
        {
          name: "PP Approval Pending",
          y: -this.WaterFallData.budgetapproved,
          value: this.WaterFallData.budgetapproved,
          color: "#ffc009",
          dataLabels: {
            enabled: true,
            formatter: function () {
              return negateFormat(this.y)
            }
          }

        },
        // {
        //   name: "PP Approved",
        //   y: -this.WaterFallData.ppapproved,
        //   value: this.WaterFallData.ppapproved,
        //   color: "#f34747",
        //   dataLabels: {
        //     enabled: true,
        //     formatter: function () {
        //       return negateFormat(this.y)
        //     }
        //   }

        // },
        {
          name: "PP Rejected",
          y: -this.WaterFallData.pprejected,
          value: this.WaterFallData.pprejected,
          color: "#ffc009",
          dataLabels: {
            enabled: true,
            formatter: function () {
              return negateFormat(this.y)
            }
          }

        },
        {
          name: "SM Processed Partial",
          y: -this.WaterFallData.smpartialapproved,
          value: this.WaterFallData.smpartialapproved,
          color: "#f34747",
          dataLabels: {
            enabled: true,
            formatter: function () {
              return negateFormat(this.y)
            }
          }

        },
        {
          name: "SM Approved",
          y: -this.WaterFallData.smapproved,
          value: this.WaterFallData.smapproved,
          color: "#ffc009",
          dataLabels: {
            enabled: true,
            formatter: function () {
              return negateFormat(this.y)
            }
          }

        },
        {
          name: "IPL Processed Partial",
          y: -this.WaterFallData.iplpartialapproved,
          value: this.WaterFallData.iplpartialapproved,
          color: "#ffc009",
          dataLabels: {
            enabled: true,
            formatter: function () {
              return negateFormat(this.y)
            }
          }

        },
        {
          name: "IPL Approved",
          y: -this.WaterFallData.iplapproved,
          value: this.WaterFallData.iplapproved,
          color: "#ffc009",
          dataLabels: {
            enabled: true,
            formatter: function () {
              return negateFormat(this.y)
            }
          }

        },
        {
          name: "Store Approved",
          y: -this.WaterFallData.storeapproved,
          value: this.WaterFallData.storeapproved,
          color: "#ffc009",
          dataLabels: {
            enabled: true,
            formatter: function () {
              return negateFormat(this.y)
            }
          }

        },
        // {
        //   name: "Partial Closed",
        //   y: -this.WaterFallData.partialclosed,
        //   value: this.WaterFallData.partialclosed,
        //   color: "#ffc009",
        //   dataLabels: {
        //     enabled: true,
        //     formatter: function () {
        //       return negateFormat(this.y)
        //     }
        //   }

        // },
        {
          name: "Recalled",
          y: -this.WaterFallData.recalled,
          value: this.WaterFallData.recalled,
          color: "#516364",
          dataLabels: {
            enabled: true,
            formatter: function () {
              return negateFormat(this.y)
            }
          }

        },
        {
          name: "Deleted",
          y: -this.WaterFallData.deleted,
          value: this.WaterFallData.deleted,
          color: "#516364",
          dataLabels: {
            enabled: true,
            formatter: function () {
              return negateFormat(this.y)
            }
          }

        }
        ,
        {
          name: "Closed",
          y: -this.WaterFallData.closed,
          value: this.WaterFallData.closed,
          color: "#516364",
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
  piechart1
  stopiechart1Exi() {
    this.piechart1 = new Chart({
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        height: 300
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
          dataLabels: {
            enabled: true,
            format: '{point.y}',
            distance: -50,
            filter: {
              property: 'percentage',
              operator: '>',
              value: 4
            }
          },
          showInLegend: true
        }
      },
      series: [{
        name: 'Share',
        data: [
          { name: 'Recalled', y: this.DateexigencyData.recalled, color: "#ffada3" },
          { name: 'IPL Approved', y: this.DateexigencyData.iplapproved, color: "#ffc009" },
          { name: 'Store Approved', y: this.DateexigencyData.storeapproved, color: "#ffc009", },
          { name: 'L4 Approval Pending', y: this.DateexigencyData.l4approvalpending, color: "#ffc009" },
          { name: 'Completed', y: this.DateexigencyData.closed, color: "##53cd78" },
          { name: 'BA Approval Pending', y: this.DateexigencyData.baapprovalpending, color: "#ffc009" },
          { name: 'PP Rejected', y: this.DateexigencyData.pprejected, color: "#f34747" },
          { name: 'L4 Rejected', y: this.DateexigencyData.l4rejected, color: "#f34747" },
          { name: 'L3 Rejected', y: this.DateexigencyData.l3rejected, color: "#f34747", },
          { name: 'SM Approved', y: this.DateexigencyData.smapproved, color: "#ffc009" },
          { name: 'PP Approved', y: this.DateexigencyData.ppapproved, color: "#ffc009" },
          { name: 'L4 Approved', y: this.DateexigencyData.l4approved, color: "#ffc009" },
          { name: 'IPL Partial Approved', y: this.DateexigencyData.iplpartialapproved, color: "#ffc009" },
          { name: 'Budget Rejected', y: this.DateexigencyData.budgetrejected, color: "#f34747", },
          { name: 'Budget Approved', y: this.DateexigencyData.budgetapproved, color: "#ffc009", },
          { name: 'SM Partial Approved', y: this.DateexigencyData.smpartialapproved, color: "#ffc009" },
          { name: 'Deleted', y: this.DateexigencyData.deleted, color: "#f34747", },
          { name: 'Partial Completed', y: this.DateexigencyData.partialclosed, color: "##53cd78" },
        ]
      }]
    })
  }
  stopiechart1NonExi() {
    this.piechart1 = new Chart({
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        height: 300
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
          dataLabels: {
            enabled: true,
            format: '{point.y}',
            distance: -50,
            filter: {
              property: 'percentage',
              operator: '>',
              value: 4
            }
          },
          showInLegend: true
        }
      },
      series: [{
        name: 'Share',
        data: [
          { name: 'Recalled', y: this.DatenonexigencyData.recalled, color: "#ffc009" },
          { name: 'SM Partial Approved', y: this.DatenonexigencyData.smpartialapproved, color: "#ffc009" },
          { name: 'IPL Partial Approved', y: this.DatenonexigencyData.iplpartialapproved, color: "#ffc009" },
          { name: 'IPL Approved', y: this.DatenonexigencyData.iplapproved, color: "#ffc009" },
          { name: 'Store Approved', y: this.DatenonexigencyData.storeapproved, color: "#ffc009", },
          { name: 'SM Approved', y: this.DatenonexigencyData.smapproved, color: "#ffc009" },
          { name: 'PP Approved', y: this.DatenonexigencyData.ppapproved, color: "#ffc009", },
          { name: 'Partial Completed', y: this.DatenonexigencyData.partialclosed, color: "##53cd78" },
          { name: 'Completed', y: this.DatenonexigencyData.closed, color: "##53cd78" },
          { name: 'BA Approval Pending', y: this.DatenonexigencyData.baapprovalpending, color: "#ffc009" },
          { name: 'Deleted', y: this.DatenonexigencyData.deleted, color: "#f34747", },
          { name: 'PP Rejected', y: this.DatenonexigencyData.pprejected, color: "#f34747" },
          { name: 'Budget Rejected', y: this.DatenonexigencyData.budgetrejected, color: "#f34747" },
          { name: 'Budget Approved', y: this.DatenonexigencyData.budgetapproved, color: "#ffc009" },
        ]
      }]
    })
  }
  piechart2
  stopiechart2() {
    this.piechart2 = new Chart({
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        height: 300
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
          dataLabels: {
            enabled: true,
            format: '{point.y}',
            distance: -50,
            filter: {
              property: 'percentage',
              operator: '>',
              value: 4
            }
          },
          showInLegend: true
        }
      },
      series: [{
        name: 'Share',
        data: [
          { name: 'Inprogress', y: 61, color: "#7cccba" },
          { name: 'Partially Done', y: 11, color: "#ffb285" },
          { name: 'Completed', y: 10, color: "#908dcc", },
        ]
      }]
    })
  }
  piechart3
  stopiechartExi() {
    this.piechart3 = new Chart({
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        height: 300
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
          dataLabels: {
            enabled: true,
            format: '{point.y}',
            distance: -50,
            filter: {
              property: 'percentage',
              operator: '>',
              value: 4
            }
          },
          showInLegend: true
        }
      },
      series: [{
        name: 'Share',
        data: [
          { name: 'Recalled', y: this.exigencyData.recalled, color: "#ffc009" },
          { name: 'PP Approved', y: this.exigencyData.ppapproved, color: "#ffc009" },
          { name: 'IPL Partial Approved', y: this.exigencyData.iplpartialapproved, color: "#ffc009" },
          { name: 'IPL Approved', y: this.exigencyData.iplapproved, color: "#ffc009" },
          { name: 'Store Approved', y: this.exigencyData.storeapproved, color: "#ffc009", },
          { name: 'L4 Approval Pending', y: this.exigencyData.l4approvalpending, color: "#ffc009" },
          { name: 'Partial Completed', y: this.exigencyData.partialclosed, color: "#ffc009", },
          { name: 'Completed', y: this.exigencyData.closed, color: "##53cd78" },
          { name: 'BA Approval Pending', y: this.exigencyData.baapprovalpending, color: "#ffc009" },
          { name: 'Deleted', y: this.exigencyData.deleted, color: "#ffc009", },
          { name: 'PP Rejected', y: this.exigencyData.pprejected, color: "#f34747" },
          { name: 'Budget Approved', y: this.exigencyData.budgetapproved, color: "#ffc009" },
          { name: 'Budget Rejected', y: this.exigencyData.budgetrejected, color: "#f34747" },
          { name: 'L4 Rejected', y: this.exigencyData.l4rejected, color: "#f34747" },
          { name: 'L3 Rejected', y: this.exigencyData.l3rejected, color: "#f34747", },
          { name: 'SM Approved', y: this.exigencyData.smapproved, color: "#ffc009" },
          { name: 'L4 Approved', y: this.exigencyData.l4approved, color: "#ffc009" },
          { name: 'SM  Partial Approved', y: this.exigencyData.smpartialapproved, color: "#ffc009" },

        ]
      }]
    })
  }
  stopiechartNonExi() {
    this.piechart3 = new Chart({
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        height: 300
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
          dataLabels: {
            enabled: true,
            format: '{point.y}',
            distance: -50,
            filter: {
              property: 'percentage',
              operator: '>',
              value: 4
            }
          },
          showInLegend: true
        }
      },
      series: [{
        name: 'Share',
        data: [
          { name: 'Recalled', y: this.nonexigencyData.recalled, color: "#ffc009" },
          { name: 'SM Approved', y: this.nonexigencyData.smapproved, color: "#ffc009" },
          { name: 'PP Approved', y: this.nonexigencyData.ppapproved, color: "#ffc009" },
          { name: 'IPL Approved', y: this.nonexigencyData.iplapproved, color: "#ffc009" },
          { name: 'IPL Partial Approved', y: this.nonexigencyData.iplpartialapproved, color: "#ffc009" },
          { name: 'Store Approved', y: this.nonexigencyData.storeapproved, color: "#ffc009", },
          { name: 'SM Partial Approved', y: this.nonexigencyData.smpartialapproved, color: "#ffc009" },
          { name: 'Budget Approved', y: this.nonexigencyData.budgetapproved, color: "#ffc009" },
          { name: 'Budget Rejected', y: this.nonexigencyData.budgetrejected, color: "#ffc009" },
          { name: 'Completed', y: this.nonexigencyData.closed, color: "##53cd78" },
          { name: 'Partial Completed', y: this.nonexigencyData.partialclosed, color: "##53cd78" },
          { name: 'BA Approval Pending', y: this.nonexigencyData.baapprovalpending, color: "#ffc009" },
          { name: 'Deleted', y: this.nonexigencyData.deleted, color: "#f34747", },
          { name: 'PP Rejected', y: this.nonexigencyData.pprejected, color: "#f34747" },

        ]
      }]
    })
  }
}
