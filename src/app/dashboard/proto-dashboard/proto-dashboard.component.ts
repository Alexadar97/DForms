import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { DataserviceService } from '../../dataservice.service';
declare var $, moment;
@Component({
  selector: 'app-proto-dashboard',
  templateUrl: './proto-dashboard.component.html',
  styleUrls: ['./proto-dashboard.component.css', './proto-dashboard.component.scss']
})
export class ProtoDashboardComponent implements OnInit {
  highChart: any;
  pieChart: any;
  waterFallChart: any;
  singleHighChart: any;
  date: any;
  initialDate;
  bsRangeValue;
  maxDate;
  bsConfig;
  firstdate: any
  lastDate: any
  setFirstdate: any
  setLastDate: any
  datevalue: any
  ProtoBarData: any;
  ProtoWaterData: any;
  CurrentYear: any;
  private appconstant = this.ds.appconstant;
  private getDashboard = this.appconstant + 'dashboard/get';
  private YearAPI = this.appconstant + 'dashboard/getYear';
  constructor(private router: Router, private http: Http, private ds: DataserviceService) {
    var date = new Date();
    this.initialDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    this.maxDate = new Date(date.getFullYear(), date.getMonth(), 0);
    this.bsRangeValue = [this.initialDate, this.maxDate];
  }

  ngOnInit() {
    this.Year()
    $("#year").val(new Date().getFullYear());
    $(document).ready(() => {
      $('[name=year]').val(new Date().getFullYear());
    });
    this.ChangeYear(new Date().getFullYear())
    // previous month first date and last date
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth(), 0);
    this.CurrentYear = new Date().getFullYear()
    this.bsConfig = Object.assign({}, { containerClass: 'theme-blue', rangeInputFormat: 'DD/MMM/YYYY' })

    this.setFirstdate = moment(firstDay).format('DD-MM-YYYY');
    this.setLastDate = moment(lastDay).format('DD-MM-YYYY');
    this.datevalue = this.setFirstdate + " " + "-" + " " + this.setLastDate



    this.getDashboardAPI();
    // this.PieChartDateExi();
    // this.SingleBarDateExi();
    // this.PieChartCategoryExi();
    // this.SingleBarCategoryExi();

    this.selectCatExigencyVal = "yes";
    this.DateRxigency = "yes";
    this.supervisorExiValue = "yes";
    this.getCategoryDashboard();
    this.getDateDashboard()
    this.getSupervisorDashboard();
  }
  yearlist=[]
  Year(){
    this.ds.makeapi(this.YearAPI,"formtype="+"proto","post")
    .subscribe(data=>{
      this.yearlist = data
    })
    Error=>{

    }
  }
  selectYear: any;
  ChangeYear(year) {
    console.log(year);
    this.selectYear = year;
    var reqdata = { "year": this.selectYear, "formtype": "proto", "fromdate": this.setFirstdate, "todate": this.setLastDate, "category": this.selectedCategory, "supervisor": this.selectedSupervisor };
    this.ds.makeapi(this.getDashboard, reqdata, 'postjson').subscribe(data => {
      console.log(data);
      this.ProtoBarData = data['barChartData'];
      this.BarChart();
    });

  }
  exigencycase:any;
  getDashboardAPI() {
    // var startOfMonth = moment().startOf('month').format('DD-MM-YYYY');
    // var endOfMonth = moment().endOf('month').format('DD-MM-YYYY');
    var reqdata = { "year": this.CurrentYear, "formtype": "proto", "fromdate": this.setFirstdate, "todate": this.setLastDate, "category": this.selectedCategory, "supervisor": this.selectedSupervisor };
    
    this.ds.makeapi(this.getDashboard, reqdata, 'postjson').subscribe(data => {
      console.log(data);
      this.ProtoBarData = data['barChartData'];
      this.ProtoWaterData = data['waterFallData'];
      this.exigencycase = data.dateExigencyPieChartData
      this.BarChart();
      this.WaterFallChart();
      // this.SingleBarDateExi();
      // this.PieChartCategoryExi()
      // this.SingleBarCategoryExi();
    
    });
  }

  BarChart() {
    this.highChart = new Chart({
      chart: {
        type: 'column',
        height: 250,
        width: 500,
      },
      title: {
        text: ''
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
      series: [{
        data: [
          ['Jan', this.ProtoBarData.Jan],
          ['Feb', this.ProtoBarData.Feb],
          ['Mar', this.ProtoBarData.Mar],
          ['Apr', this.ProtoBarData.Apr],
          ['May', this.ProtoBarData.May],
          ['Jun', this.ProtoBarData.June],
          ['Jul', this.ProtoBarData.July],
          ['Aug', this.ProtoBarData.Aug],
          ['Sep', this.ProtoBarData.Sep],
          ['Oct', this.ProtoBarData.Oct],
          ['Nov', this.ProtoBarData.Nov],
          ['Dec', this.ProtoBarData.Dec]
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
        height: 300,
        width: 500,
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
      },

      legend: {
        enabled: false
      },

      tooltip: {
        pointFormat: '<b>{point.value}</b> '
      },

      series: [{

        data: [{
          name: "Total Requested",
          y: this.ProtoWaterData.total,
          value: this.ProtoWaterData.total,
          color: "#aa6cd9",
          dataLabels: {
            enabled: true,
            formatter: function () {
              return negateFormat(this.y)
            }
          }
        },
        {
          name: "Pending",
          y: - this.ProtoWaterData.pending,
          value: this.ProtoWaterData.pending,
          color: "#fa9d66",
          dataLabels: {
            enabled: true,
            formatter: function () {
              return negateFormat(this.y)
            }
          }
        },
        {
          name: "Recalled",
          y: - this.ProtoWaterData.recalled,
          value: this.ProtoWaterData.recalled,
          color: "#96cd5a",
          dataLabels: {
            enabled: true,
            formatter: function () {
              return negateFormat(this.y)
            }
          }

        },

        {
          name: "L4 Approved",
          y: - this.ProtoWaterData.l4approved,
          value: this.ProtoWaterData.l4approved,
          color: "#96cd5a",
          dataLabels: {
            enabled: true,
            formatter: function () {
              return negateFormat(this.y)
            }
          }

        },
        {
          name: "L4 Rejected",
          y: - this.ProtoWaterData.l4rejected,
          value: this.ProtoWaterData.l4rejected,
          color: "#48701c",
          dataLabels: {
            enabled: true,
            formatter: function () {
              return negateFormat(this.y)
            }
          }

        },
        {
          name: "Vehicle Owner Approved",
          y: - this.ProtoWaterData.vehicleownerapproved,
          value: this.ProtoWaterData.vehicleownerapproved,
          color: "#aa6cd9",
          dataLabels: {
            enabled: true,
            formatter: function () {
              return negateFormat(this.y)
            }
          }
        },
        {
          name: "Proto L4 Approved",
          y: - this.ProtoWaterData.protol4approved,
          value: this.ProtoWaterData.protol4approved,
          color: "#aa6cd9",
          dataLabels: {
            enabled: true,
            formatter: function () {
              return negateFormat(this.y)
            }
          }
        },
        {
          name: "Proto L4 Rejected",
          y: - this.ProtoWaterData.protol4rejected,
          value: this.ProtoWaterData.protol4rejected,
          color: "#aa6cd9",
          dataLabels: {
            enabled: true,
            formatter: function () {
              return negateFormat(this.y)
            }
          }
        },
        {
          name: "Supervisor Pending",
          y: - this.ProtoWaterData.supervisorpending,
          value: this.ProtoWaterData.supervisorpending,
          color: "#aa6cd9",
          dataLabels: {
            enabled: true,
            formatter: function () {
              return negateFormat(this.y)
            }
          }
        },
        {
          name: "HDT Approved",
          y: - this.ProtoWaterData.hdtapproved,
          value: this.ProtoWaterData.hdtapproved,
          color: "#aa6cd9",
          dataLabels: {
            enabled: true,
            formatter: function () {
              return negateFormat(this.y)
            }
          }
        },
        {
          name: "HDT Rejected",
          y: - this.ProtoWaterData.hdtrejected,
          value: this.ProtoWaterData.hdtrejected,
          color: "#fa9d66",
          dataLabels: {
            enabled: true,
            formatter: function () {
              return negateFormat(this.y)
            }
          }
        },
        {
          name: "MDT Approved",
          y: - this.ProtoWaterData.mdtapproved,
          value: this.ProtoWaterData.mdtapproved,
          color: "#48701c",
          dataLabels: {
            enabled: true,
            formatter: function () {
              return negateFormat(this.y)
            }
          }

        },
        {
          name: "MDT Rejected",
          y: - this.ProtoWaterData.mdtrejected,
          value: this.ProtoWaterData.mdtrejected,
          color: "#96cd5a",
          dataLabels: {
            enabled: true,
            formatter: function () {
              return negateFormat(this.y)
            }
          }
        },
        {
          name: "Aggregate Approved",
          y: - this.ProtoWaterData.aggregateapproved,
          value: this.ProtoWaterData.aggregateapproved,
          color: "#96cd5a",
          dataLabels: {
            enabled: true,
            formatter: function () {
              return negateFormat(this.y)
            }
          }
        },
        {
          name: "Aggregate Rejected",
          y: - this.ProtoWaterData.aggregaterejected,
          value: this.ProtoWaterData.aggregaterejected,
          color: "#96cd5a",
          dataLabels: {
            enabled: true,
            formatter: function () {
              return negateFormat(this.y)
            }
          }
        },
        {
          name: "EandE Approved",
          y: - this.ProtoWaterData.eandeapproved,
          value: this.ProtoWaterData.eandeapproved,
          color: "#96cd5a",
          dataLabels: {
            enabled: true,
            formatter: function () {
              return negateFormat(this.y)
            }
          }
        },
        {
          name: "EandE Rejected",
          y: - this.ProtoWaterData.eanderejected,
          value: this.ProtoWaterData.eanderejected,
          color: "#96cd5a",
          dataLabels: {
            enabled: true,
            formatter: function () {
              return negateFormat(this.y)
            }
          }
        },
        {
          name: "PPS Approved",
          y: - this.ProtoWaterData.ppsapproved,
          value: this.ProtoWaterData.ppsapproved,
          color: "#96cd5a",
          dataLabels: {
            enabled: true,
            formatter: function () {
              return negateFormat(this.y)
            }
          }
        },
        {
          name: "PPS Rejected",
          y: - this.ProtoWaterData.ppsapproved,
          value: this.ProtoWaterData.ppsapproved,
          color: "#96cd5a",
          dataLabels: {
            enabled: true,
            formatter: function () {
              return negateFormat(this.y)
            }
          }
        },
        {
          name: "Maintenance Approved",
          y: - this.ProtoWaterData.maintenanceapproved,
          value: this.ProtoWaterData.maintenanceapproved,
          color: "#96cd5a",
          dataLabels: {
            enabled: true,
            formatter: function () {
              return negateFormat(this.y)
            }
          }
        },
        {
          name: "Maintenance Rejected",
          y: - this.ProtoWaterData.maintenancerejected,
          value: this.ProtoWaterData.maintenancerejected,
          color: "#96cd5a",
          dataLabels: {
            enabled: true,
            formatter: function () {
              return negateFormat(this.y)
            }
          }
        },
        {
          name: "Mechanical Approved",
          y: - this.ProtoWaterData.mechanicalapproved,
          value: this.ProtoWaterData.mechanicalapproved,
          color: "#96cd5a",
          dataLabels: {
            enabled: true,
            formatter: function () {
              return negateFormat(this.y)
            }
          }
        },
        {
          name: "Mechanical Rejected",
          y: - this.ProtoWaterData.mechanicalrejected,
          value: this.ProtoWaterData.mechanicalrejected,
          color: "#96cd5a",
          dataLabels: {
            enabled: true,
            formatter: function () {
              return negateFormat(this.y)
            }
          }
        },
        {
          name: "Completed",
          y: - this.ProtoWaterData.completed,
          value: this.ProtoWaterData.completed,
          color: "#96cd5a",
          dataLabels: {
            enabled: true,
            formatter: function () {
              return negateFormat(this.y)
            }
          }
        },
        {
          name: "Deleted",
          y: - this.ProtoWaterData.deleted,
          value: this.ProtoWaterData.deleted,
          color: "#96cd5a",
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


  setDate1:any;
  setDate2:any;
  PieDateReqData: any;
  SelectDate(value) {
    if(value != null){
      this.setDate1 = moment(value[0]).format('DD-MM-YYYY');
      this.setDate2 = moment(value[1]).format('DD-MM-YYYY');
      this.getDateDashboard();
    }

  }
  pieChartReqDate: any;
  PieChartDateExi() {
    var chartValue = [
      { name: 'Pending', y: this.DateexigencyData.pending, color: '#337ab7c9' },
      { name: 'Recall', y: this.DateexigencyData.recalled, color: '#337ab7c9' },
      { name: 'L4 Approved', y: this.DateexigencyData.l4approved, color: '#337ab7c9' },
      { name: 'L4 Rejected', y: this.DateexigencyData.l4rejected, color: '#337ab7c9' },
      { name: 'Vehicle Owner Approved', y: this.DateexigencyData.vehicleownerapproved, color: '#337ab7c9' },
      { name: 'Proto L4 Approved', y: this.DateexigencyData.protol4approved, color: '#337ab7c9' },
      { name: 'Proto L4 Rejected', y: this.DateexigencyData.protol4rejected, color: '#337ab7c9' },
      { name: 'HDT Supervisor Approved', y: this.DateexigencyData.hdtsupervisorapproved, color: '#337ab7c9' },
      { name: 'HDT Supervisor Rejected', y: this.DateexigencyData.hdtsupervisorrejected, color: '#337ab7c9' },
      { name: 'MDT Supervisor Approved', y: this.DateexigencyData.mdtsupervisorapproved, color: '#337ab7c9' },
      { name: 'MDT Supervisor Rejected', y: this.DateexigencyData.mdtsupervisorrejected, color: '#337ab7c9' },
      { name: 'Aggregate Supervisor Approved', y: this.DateexigencyData.aggregatesupervisorapproved, color: '#337ab7c9' },
      { name: 'Aggregate Supervisor Rejected', y: this.DateexigencyData.aggregatesupervisorrejected, color: '#337ab7c9' },
      { name: 'EandE Supervisor Approved', y: this.DateexigencyData.eandesupervisorapproved, color: '#337ab7c9' },
      { name: 'EandE Supervisor Rejected', y: this.DateexigencyData.eandesupervisorrejected, color: '#337ab7c9' },
      { name: 'PPS Supervisor Approved', y: this.DateexigencyData.ppssupervisorapproved, color: '#337ab7c9' },
      { name: 'PPS Supervisor Rejected', y: this.DateexigencyData.ppssupervisorrejected, color: '#337ab7c9' },
      { name: 'Maintenance Supervisor Approved', y: this.DateexigencyData.maintenancesupervisorapproved, color: '#337ab7c9' },
      { name: 'Maintenance Supervisor Rejected', y: this.DateexigencyData.maintenancesupervisorrejected, color: '#337ab7c9' },
      { name: 'Mechanical Supervisor Approved', y: this.DateexigencyData.mechanicalsupervisorapproved, color: '#337ab7c9' },
      { name: 'Mechanical Supervisor Rejected', y: this.DateexigencyData.mechanicalsupervisorrejected, color: '#337ab7c9' },
      { name: 'Completed', y: this.DateexigencyData.closed, color: '#337ab7c9' },
      { name: 'Deleted', y: this.DateexigencyData.deleted, color: '#337ab7c9' },
    ]
    
    this.pieChartReqDate = new Chart({
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        height: 250,
        width: 300
      },
      title: {
        text: ''
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          showInLegend: true,
          dataLabels: {
            enabled: true,
            format: '{point.percentage:.1f} %',
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
        data: chartValue
      }]
    });
  }

  PieChartDateNon_Exi() {
    this.pieChartReqDate = new Chart({
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        height: 250,
        width: 300
      },
      title: {
        text: ''
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          showInLegend: true,
          dataLabels: {
            enabled: true,
            format: '{point.percentage:.1f} %',
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
        data: [
          { name: 'Pending', y: this.DatenonexigencyData.pending, color: '#337ab7c9' },
          { name: 'Recall', y: this.DatenonexigencyData.recalled, color: '#337ab7c9' },
          { name: 'L4 Approved', y: this.DatenonexigencyData.l4approved, color: '#337ab7c9' },
          { name: 'L4 Rejected', y: this.DatenonexigencyData.l4rejected, color: '#337ab7c9' },
          { name: 'Vehicle Owner Approved', y: this.DatenonexigencyData.vehicleownerapproved, color: '#337ab7c9' },
          { name: 'Proto L4 Approved', y: this.DatenonexigencyData.protol4approved, color: '#337ab7c9' },
          { name: 'Proto L4 Rejected', y: this.DatenonexigencyData.protol4rejected, color: '#337ab7c9' },
          { name: 'HDT Supervisor Approved', y: this.DatenonexigencyData.hdtsupervisorapproved, color: '#337ab7c9' },
          { name: 'HDT Supervisor Rejected', y: this.DatenonexigencyData.hdtsupervisorrejected, color: '#337ab7c9' },
          { name: 'MDT Supervisor Approved', y: this.DatenonexigencyData.mdtsupervisorapproved, color: '#337ab7c9' },
          { name: 'MDT Supervisor Rejected', y: this.DatenonexigencyData.mdtsupervisorrejected, color: '#337ab7c9' },
          { name: 'Aggregate Supervisor Approved', y: this.DatenonexigencyData.aggregatesupervisorapproved, color: '#337ab7c9' },
          { name: 'Aggregate Supervisor Rejected', y: this.DatenonexigencyData.aggregatesupervisorrejected, color: '#337ab7c9' },
          { name: 'EandE Supervisor Approved', y: this.DatenonexigencyData.eandesupervisorapproved, color: '#337ab7c9' },
          { name: 'EandE Supervisor Rejected', y: this.DatenonexigencyData.eandesupervisorrejected, color: '#337ab7c9' },
          { name: 'PPS Supervisor Approved', y: this.DatenonexigencyData.ppssupervisorapproved, color: '#337ab7c9' },
          { name: 'PPS Supervisor Rejected', y: this.DatenonexigencyData.ppssupervisorrejected, color: '#337ab7c9' },
          { name: 'Maintenance Supervisor Approved', y: this.DatenonexigencyData.maintenancesupervisorapproved, color: '#337ab7c9' },
          { name: 'Maintenance Supervisor Rejected', y: this.DatenonexigencyData.maintenancesupervisorrejected, color: '#337ab7c9' },
          { name: 'Mechanical Supervisor Approved', y: this.DatenonexigencyData.mechanicalsupervisorapproved, color: '#337ab7c9' },
          { name: 'Mechanical Supervisor Rejected', y: this.DatenonexigencyData.mechanicalsupervisorrejected, color: '#337ab7c9' },
          { name: 'Completed', y: this.DatenonexigencyData.closed, color: '#337ab7c9' },
          { name: 'Deleted', y: this.DatenonexigencyData.deleted, color: '#337ab7c9' },
        ]
      }]
    });
  }
  singleDateTotal: any;
  SingleBarDateExi() {
    this.singleDateTotal = new Chart({
      chart: {
        type: 'column',
        height: 250,
      },
      title: {
        text: ''
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
      series: [{
        name: 'Population',
        data: [
          ['Total', this.DateexigencyData.total]
        ],
        color: '#673ab7ad',
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

  SingleBarDateNon_Exi() {
    this.singleDateTotal = new Chart({
      chart: {
        type: 'column',
        height: 250,
      },
      title: {
        text: ''
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
      series: [{
        name: 'Population',
        data: [
          ['Total', this.DatenonexigencyData.total]
        ],
        color: '#673ab7ad',
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
  selectCatExigencyVal:any;
  selectCatExigency(value){
   this.selectCatExigencyVal = value;
   this.getCategoryDashboard();
}

  selectedCategory = "Retro Fitment";
  CategoryNon_ExiData: any;
  CategoryExiData:any;
  selectCategory(value) {
    this.selectedCategory = value;
    this.getCategoryDashboard();
  }

  DateRxigency:any;
  selectExigencyDate(value){
    this.DateRxigency = value;
    this.getDateDashboard();
  }

  DateexigencyData:any;
  DatenonexigencyData:any;
  getDateDashboard() {
    var reqdata = { "year": this.CurrentYear, "formtype": "proto", "fromdate": this.setFirstdate, "todate": this.setLastDate, "category": this.selectedCategory, "supervisor": this.selectedSupervisor };
    return this.ds.makeapi(this.getDashboard, reqdata, "postjson")
      .subscribe(data => {
        this.DateexigencyData = data['dateExigencyPieChartData']['exigencyDate']
        this.DatenonexigencyData = data['dateExigencyPieChartData']['nonExigencyDate']
        if (this.DateRxigency == "yes") {
          console.log(this.DateexigencyData)
          this.SingleBarDateExi()
          this. PieChartDateExi()
        }
        else {
          this.SingleBarDateNon_Exi()
          this.PieChartDateNon_Exi()
        }
      },
        Error => {
        });
  }

  getCategoryDashboard(){
    var reqdata = { "year": this.CurrentYear, "formtype": "proto", "fromdate": this.setFirstdate, "todate": this.setLastDate, "category": this.selectedCategory, "supervisor": this.selectedSupervisor };
    return this.ds.makeapi(this.getDashboard, reqdata, "postjson").
      subscribe(data => {
          this.CategoryExiData = data.dateExigencyPieChartData.exigencyCategory;
  
          this.CategoryNon_ExiData = data.dateExigencyPieChartData.nonExigencyCategory;
          if (this.selectCatExigencyVal == "yes") {
            this.PieChartCategoryExi();
            this.SingleBarCategoryExi();
          }
          else {
            this.PieChartCategoryNonExi()
            this.SingleBarCategoryNon();
          }
          
     },
        Error => {

        })
  }

  singleCategoryTotal: any;
  SingleBarCategoryExi() {
    this.singleCategoryTotal = new Chart({
      chart: {
        type: 'column',
        height: 250,
      },
      title: {
        text: ''
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
        pointFormat: ' <b>{point.y:.1f} millions</b>'
      },
      series: [{
        name: 'Population',
        data: [
          ['Total', this.CategoryExiData.total],
        ],
        color: '#673ab7ad',
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

  SingleBarCategoryNon() {
    this.singleCategoryTotal = new Chart({
      chart: {
        type: 'column',
        height: 250,
      },
      title: {
        text: ''
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
        pointFormat: '<b>{point.y:.1f} millions</b>'
      },
      series: [{
        name: 'Population',
        data: [
          ['Total', this.CategoryNon_ExiData.total],
        ],
        color: '#673ab7ad',
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

  pieChartCategory: any
  PieChartCategoryExi() {
    this.pieChartCategory = new Chart({
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        height: 250,
      },
      title: {
        text: ''
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          showInLegend: true,
          dataLabels: {
            enabled: true,
            format: '{point.percentage:.1f} %',
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
        data: [
          { name: 'Pending', y: this.CategoryExiData.pending, color: '#337ab7c9' },
          { name: 'Recall', y: this.CategoryExiData.recalled, color: '#337ab7c9' },
          { name: 'L4 Approved', y: this.CategoryExiData.l4approved, color: '#337ab7c9' },
          { name: 'L4 Rejected', y: this.CategoryExiData.l4rejected, color: '#337ab7c9' },
          { name: 'Vehicle Owner Approved', y: this.CategoryExiData.vehicleownerapproved, color: '#337ab7c9' },
          { name: 'Proto L4 Approved', y: this.CategoryExiData.protol4approved, color: '#337ab7c9' },
          { name: 'Proto L4 Rejected', y: this.CategoryExiData.protol4rejected, color: '#337ab7c9' },
          { name: 'HDT Supervisor Approved', y: this.CategoryExiData.hdtsupervisorapproved, color: '#337ab7c9' },
          { name: 'HDT Supervisor Rejected', y: this.CategoryExiData.hdtsupervisorrejected, color: '#337ab7c9' },
          { name: 'MDT Supervisor Approved', y: this.CategoryExiData.mdtsupervisorapproved, color: '#337ab7c9' },
          { name: 'MDT Supervisor Rejected', y: this.CategoryExiData.mdtsupervisorrejected, color: '#337ab7c9' },
          { name: 'Aggregate Supervisor Approved', y: this.CategoryExiData.aggregatesupervisorapproved, color: '#337ab7c9' },
          { name: 'Aggregate Supervisor Rejected', y: this.CategoryExiData.aggregatesupervisorrejected, color: '#337ab7c9' },
          { name: 'EandE Supervisor Approved', y: this.CategoryExiData.eandesupervisorapproved, color: '#337ab7c9' },
          { name: 'EandE Supervisor Rejected', y: this.CategoryExiData.eandesupervisorrejected, color: '#337ab7c9' },
          { name: 'PPS Supervisor Approved', y: this.CategoryExiData.ppssupervisorapproved, color: '#337ab7c9' },
          { name: 'PPS Supervisor Rejected', y: this.CategoryExiData.ppssupervisorrejected, color: '#337ab7c9' },
          { name: 'Maintenance Supervisor Approved', y: this.CategoryExiData.maintenancesupervisorapproved, color: '#337ab7c9' },
          { name: 'Maintenance Supervisor Rejected', y: this.CategoryExiData.maintenancesupervisorrejected, color: '#337ab7c9' },
          { name: 'Mechanical Supervisor Approved', y: this.CategoryExiData.mechanicalsupervisorapproved, color: '#337ab7c9' },
          { name: 'Mechanical Supervisor Rejected', y: this.CategoryExiData.mechanicalsupervisorrejected, color: '#337ab7c9' },
          { name: 'Completed', y: this.CategoryExiData.closed, color: '#337ab7c9' },
          { name: 'Deleted', y: this.CategoryExiData.deleted, color: '#337ab7c9' },

        ]
      }]
    });
  }
  PieChartCategoryNonExi() {
    this.pieChartCategory = new Chart({
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        height: 250,
      },
      title: {
        text: ''
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          showInLegend: true,
          dataLabels: {
            enabled: true,
            format: '{point.percentage:.1f} %',
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
        data: [
          { name: 'Pending', y: this.CategoryNon_ExiData.pending, color: '#337ab7c9' },
          { name: 'Recall', y: this.CategoryNon_ExiData.recalled, color: '#337ab7c9' },
          { name: 'L4 Approved', y: this.CategoryNon_ExiData.l4approved, color: '#337ab7c9' },
          { name: 'L4 Rejected', y: this.CategoryNon_ExiData.l4rejected, color: '#337ab7c9' },
          { name: 'Vehicle Owner Approved', y: this.CategoryNon_ExiData.vehicleownerapproved, color: '#337ab7c9' },
          { name: 'Proto L4 Approved', y: this.CategoryNon_ExiData.protol4approved, color: '#337ab7c9' },
          { name: 'Proto L4 Rejected', y: this.CategoryNon_ExiData.protol4rejected, color: '#337ab7c9' },
          { name: 'HDT Supervisor Approved', y: this.CategoryNon_ExiData.hdtsupervisorapproved, color: '#337ab7c9' },
          { name: 'HDT Supervisor Rejected', y: this.CategoryNon_ExiData.hdtsupervisorrejected, color: '#337ab7c9' },
          { name: 'MDT Supervisor Approved', y: this.CategoryNon_ExiData.mdtsupervisorapproved, color: '#337ab7c9' },
          { name: 'MDT Supervisor Rejected', y: this.CategoryNon_ExiData.mdtsupervisorrejected, color: '#337ab7c9' },
          { name: 'Aggregate Supervisor Approved', y: this.CategoryNon_ExiData.aggregatesupervisorapproved, color: '#337ab7c9' },
          { name: 'Aggregate Supervisor Rejected', y: this.CategoryNon_ExiData.aggregatesupervisorrejected, color: '#337ab7c9' },
          { name: 'EandE Supervisor Approved', y: this.CategoryNon_ExiData.eandesupervisorapproved, color: '#337ab7c9' },
          { name: 'EandE Supervisor Rejected', y: this.CategoryNon_ExiData.eandesupervisorrejected, color: '#337ab7c9' },
          { name: 'PPS Supervisor Approved', y: this.CategoryNon_ExiData.ppssupervisorapproved, color: '#337ab7c9' },
          { name: 'PPS Supervisor Rejected', y: this.CategoryNon_ExiData.ppssupervisorrejected, color: '#337ab7c9' },
          { name: 'Maintenance Supervisor Approved', y: this.CategoryNon_ExiData.maintenancesupervisorapproved, color: '#337ab7c9' },
          { name: 'Maintenance Supervisor Rejected', y: this.CategoryNon_ExiData.maintenancesupervisorrejected, color: '#337ab7c9' },
          { name: 'Mechanical Supervisor Approved', y: this.CategoryNon_ExiData.mechanicalsupervisorapproved, color: '#337ab7c9' },
          { name: 'Mechanical Supervisor Rejected', y: this.CategoryNon_ExiData.mechanicalsupervisorrejected, color: '#337ab7c9' },
          { name: 'Completed', y: this.CategoryNon_ExiData.closed, color: '#337ab7c9' },
          { name: 'Deleted', y: this.CategoryNon_ExiData.deleted, color: '#337ab7c9' },

        ]
      }]
    });
  }
  supervisorExiValue:any;
  selectSupervisorExi(value){
    this.supervisorExiValue= value;
    this.getSupervisorDashboard();
  }

  selectedSupervisor = "hdtsupervisor";
  selectSupervisor(value) {
    this.selectedSupervisor = value;
    this.getSupervisorDashboard();
  }
  SupervisorExiData:any;
  SupervisorNon_ExiData:any;
  getSupervisorDashboard(){
    var reqdata = { "year": this.CurrentYear, "formtype": "proto", "fromdate": this.setFirstdate, "todate": this.setLastDate, "category": this.selectedCategory, "supervisor": this.selectedSupervisor };
    return this.ds.makeapi(this.getDashboard, reqdata, "postjson").
      subscribe(data => {
          this.SupervisorExiData = data.dateExigencyPieChartData.exigencySupervisor;
  
          this.SupervisorNon_ExiData = data.dateExigencyPieChartData.nonExigencySupervisor;
          if (this.supervisorExiValue == "yes") {
            this.PieChartSupervisorExi();
            this.SingleBarSupervisorExi();
          }
          else {
            this.PieChartSupervisorNon_Exi()
            this.SingleBarSupervisorNon_Exi();
          }
          
     },
        Error => {

        })
  }

  pieChartSupervisor: any;
  PieChartSupervisorExi() {
    var chartValue= [
      { name: 'Pending', y: this.SupervisorExiData.pending, color: '#337ab7c9' },
      { name: 'Recall', y: this.SupervisorExiData.recalled, color: '#337ab7c9' },
      { name: 'L4 Approved', y: this.SupervisorExiData.l4approved, color: '#337ab7c9' },
      { name: 'L4 Rejected', y: this.SupervisorExiData.l4rejected, color: '#337ab7c9' },
      { name: 'Vehicle Owner Approved', y: this.SupervisorExiData.vehicleownerapproved, color: '#337ab7c9' },
      { name: 'Proto L4 Approved', y: this.SupervisorExiData.protol4approved, color: '#337ab7c9' },
      { name: 'Proto L4 Rejected', y: this.SupervisorExiData.protol4rejected, color: '#337ab7c9' },
      { name: 'HDT Supervisor Approved', y: this.SupervisorExiData.hdtsupervisorapproved, color: '#337ab7c9' },
      { name: 'HDT Supervisor Rejected', y: this.SupervisorExiData.hdtsupervisorrejected, color: '#337ab7c9' },
      { name: 'MDT Supervisor Approved', y: this.SupervisorExiData.mdtsupervisorapproved, color: '#337ab7c9' },
      { name: 'MDT Supervisor Rejected', y: this.SupervisorExiData.mdtsupervisorrejected, color: '#337ab7c9' },
      { name: 'Aggregate Supervisor Approved', y: this.SupervisorExiData.aggregatesupervisorapproved, color: '#337ab7c9' },
      { name: 'Aggregate Supervisor Rejected', y: this.SupervisorExiData.aggregatesupervisorrejected, color: '#337ab7c9' },
      { name: 'EandE Supervisor Approved', y: this.SupervisorExiData.eandesupervisorapproved, color: '#337ab7c9' },
      { name: 'EandE Supervisor Rejected', y: this.SupervisorExiData.eandesupervisorrejected, color: '#337ab7c9' },
      { name: 'PPS Supervisor Approved', y: this.SupervisorExiData.ppssupervisorapproved, color: '#337ab7c9' },
      { name: 'PPS Supervisor Rejected', y: this.SupervisorExiData.ppssupervisorrejected, color: '#337ab7c9' },
      { name: 'Maintenance Supervisor Approved', y: this.SupervisorExiData.maintenancesupervisorapproved, color: '#337ab7c9' },
      { name: 'Maintenance Supervisor Rejected', y: this.SupervisorExiData.maintenancesupervisorrejected, color: '#337ab7c9' },
      { name: 'Mechanical Supervisor Approved', y: this.SupervisorExiData.mechanicalsupervisorapproved, color: '#337ab7c9' },
      { name: 'Mechanical Supervisor Rejected', y: this.SupervisorExiData.mechanicalsupervisorrejected, color: '#337ab7c9' },
      { name: 'Completed', y: this.SupervisorExiData.closed, color: '#337ab7c9' },
      { name: 'Deleted', y: this.SupervisorExiData.deleted, color: '#337ab7c9' },

    ]
    this.pieChartSupervisor = new Chart({
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        height: '300px'
      },
      title: {
        text: ''
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          showInLegend: true,
          dataLabels: {
            enabled: true,
            format: '{point.percentage:.1f} %',
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
        data: chartValue

      }]
    });
  }

  PieChartSupervisorNon_Exi() {
    var chartValue= [
      { name: 'Pending', y: this.SupervisorNon_ExiData.pending, color: '#337ab7c9' },
      { name: 'Recall', y: this.SupervisorNon_ExiData.recalled, color: '#337ab7c9' },
      { name: 'L4 Approved', y: this.SupervisorNon_ExiData.l4approved, color: '#337ab7c9' },
      { name: 'L4 Rejected', y: this.SupervisorNon_ExiData.l4rejected, color: '#337ab7c9' },
      { name: 'Vehicle Owner Approved', y: this.SupervisorNon_ExiData.vehicleownerapproved, color: '#337ab7c9' },
      { name: 'Proto L4 Approved', y: this.SupervisorNon_ExiData.protol4approved, color: '#337ab7c9' },
      { name: 'Proto L4 Rejected', y: this.SupervisorNon_ExiData.protol4rejected, color: '#337ab7c9' },
      { name: 'HDT Supervisor Approved', y: this.SupervisorNon_ExiData.hdtsupervisorapproved, color: '#337ab7c9' },
      { name: 'HDT Supervisor Rejected', y: this.SupervisorNon_ExiData.hdtsupervisorrejected, color: '#337ab7c9' },
      { name: 'MDT Supervisor Approved', y: this.SupervisorNon_ExiData.mdtsupervisorapproved, color: '#337ab7c9' },
      { name: 'MDT Supervisor Rejected', y: this.SupervisorNon_ExiData.mdtsupervisorrejected, color: '#337ab7c9' },
      { name: 'Aggregate Supervisor Approved', y: this.SupervisorNon_ExiData.aggregatesupervisorapproved, color: '#337ab7c9' },
      { name: 'Aggregate Supervisor Rejected', y: this.SupervisorNon_ExiData.aggregatesupervisorrejected, color: '#337ab7c9' },
      { name: 'EandE Supervisor Approved', y: this.SupervisorNon_ExiData.eandesupervisorapproved, color: '#337ab7c9' },
      { name: 'EandE Supervisor Rejected', y: this.SupervisorNon_ExiData.eandesupervisorrejected, color: '#337ab7c9' },
      { name: 'PPS Supervisor Approved', y: this.SupervisorNon_ExiData.ppssupervisorapproved, color: '#337ab7c9' },
      { name: 'PPS Supervisor Rejected', y: this.SupervisorNon_ExiData.ppssupervisorrejected, color: '#337ab7c9' },
      { name: 'Maintenance Supervisor Approved', y: this.SupervisorNon_ExiData.maintenancesupervisorapproved, color: '#337ab7c9' },
      { name: 'Maintenance Supervisor Rejected', y: this.SupervisorNon_ExiData.maintenancesupervisorrejected, color: '#337ab7c9' },
      { name: 'Mechanical Supervisor Approved', y: this.SupervisorNon_ExiData.mechanicalsupervisorapproved, color: '#337ab7c9' },
      { name: 'Mechanical Supervisor Rejected', y: this.SupervisorNon_ExiData.mechanicalsupervisorrejected, color: '#337ab7c9' },
      { name: 'Completed', y: this.SupervisorNon_ExiData.closed, color: '#337ab7c9' },
      { name: 'Deleted', y: this.SupervisorNon_ExiData.deleted, color: '#337ab7c9' },

    ]
    this.pieChartSupervisor = new Chart({
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        height: '300px'
      },
      title: {
        text: ''
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          showInLegend: true,
          dataLabels: {
            enabled: true,
            format: '{point.percentage:.1f} %',
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
        data: chartValue
      }]
    });
  }

 
  singleSupervisorTotal: any;
  SingleBarSupervisorExi() {
    this.singleSupervisorTotal = new Chart({
      chart: {
        type: 'column',
        height: "325px",
      },
      title: {
        text: ''
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
      series: [{
        name: 'Population',
        data: [
          ['Jan', 24.2,],
        ],
        color: '#673ab7ad',
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
  SingleBarSupervisorNon_Exi() {
    this.singleSupervisorTotal = new Chart({
      chart: {
        type: 'column',
        height: "325px",
      },
      title: {
        text: ''
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
      series: [{
        name: 'Population',
        data: [
          ['Jan', 24.2,],
        ],
        color: '#673ab7ad',
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
}
