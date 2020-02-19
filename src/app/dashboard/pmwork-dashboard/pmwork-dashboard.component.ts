import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { DataserviceService } from '../../dataservice.service';
declare var $, moment;
@Component({
  selector: 'app-pmwork-dashboard',
  templateUrl: './pmwork-dashboard.component.html',
  styleUrls: ['./pmwork-dashboard.component.css', './pmwork-dashboard.component.scss']
})
export class PmworkDashboardComponent implements OnInit {
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
  CurrentYear: any;
  private appconstant = this.ds.appconstant;
  private getDashboard = this.appconstant + 'dashboard/get';
  private YearAPI = this.ds.appconstant + 'dashboard/getYear';

  constructor(private router: Router, private http: Http, private ds: DataserviceService) {
    var date = new Date();
    this.initialDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    this.maxDate = new Date(date.getFullYear(), date.getMonth(), 0);
    this.bsRangeValue = [this.initialDate, this.maxDate];
   }

  ngOnInit() {
    this.Year()
    // previous month first date and last date
    $(document).ready(() => {
      $('[name=year]').val(new Date().getFullYear());
    });
    this.ChangeYear(new Date().getFullYear())
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth(), 0);
    this.CurrentYear = new Date().getFullYear()
    this.bsConfig = Object.assign({}, { containerClass: 'theme-blue', rangeInputFormat: 'DD/MMM/YYYY' })

    this.setFirstdate = moment(firstDay).format('DD-MM-YYYY');
    this.setLastDate = moment(lastDay).format('DD-MM-YYYY');
    this.datevalue = this.setFirstdate + " " + "-" + " " + this.setLastDate


  
    this.getDashboardAPI();
    this.DateRxigency = "yes";
    this.getDateDashboard();
  }
  yearlist=[]
  Year(){
    this.ds.makeapi(this.YearAPI,"formtype="+"msw","post")
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
    var reqdata ={"year" : this.CurrentYear , "formtype" : "msw" , "fromdate" : this.setFirstdate , "todate" : this.setLastDate};
    this.ds.makeapi(this.getDashboard, reqdata, 'postjson').subscribe(data => {
      console.log(data);
      this.PMworkBarData = data['barChartData'];
      this.BarChart();
    });

  }
  PMworkWaterData: any;
  PMworkBarData: any;
  getDashboardAPI() {
    // var startOfMonth = moment().startOf('month').format('DD-MM-YYYY');
    // var endOfMonth = moment().endOf('month').format('DD-MM-YYYY');
    var reqdata ={"year" : this.CurrentYear , "formtype" : "msw" , "fromdate" : this.setFirstdate , "todate" : this.setLastDate};
    this.ds.makeapi(this.getDashboard, reqdata, 'postjson').subscribe(data => {
      console.log(data);
      this.PMworkWaterData = data['waterFallData'];
      this.PMworkBarData = data['barChartData'];
      this.BarChart();
      this.WaterFallChart();

    });
  }


  BarChart() {
    this.highChart = new Chart({
      chart: {
        type: 'column',
        height: 250,
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
          ['Jan', this.PMworkBarData.Jan],
          ['Feb', this.PMworkBarData.Feb],
          ['Mar', this.PMworkBarData.Mar],
          ['Apr', this.PMworkBarData.Apr],
          ['May', this.PMworkBarData.May],
          ['Jun', this.PMworkBarData.June],
          ['Jul', this.PMworkBarData.July],
          ['Aug', this.PMworkBarData.Aug],
          ['Sep', this.PMworkBarData.Sep],
          ['Oct', this.PMworkBarData.Oct],
          ['Nov', this.PMworkBarData.Nov],
          ['Dec', this.PMworkBarData.Dec]
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
          y: this.PMworkWaterData.total,
          value: this.PMworkWaterData.total,
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
          y: - this.PMworkWaterData.pending,
          value: this.PMworkWaterData.pending,
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
          y: - this.PMworkWaterData.recalled,
          value: this.PMworkWaterData.recalled,
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
          y: - this.PMworkWaterData.l4approved,
          value: this.PMworkWaterData.l4approved,
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
          y: - this.PMworkWaterData.l4rejected,
          value: this.PMworkWaterData.l4rejected,
          color: "#48701c",
          dataLabels: {
            enabled: true,
            formatter: function () {
              return negateFormat(this.y)
            }
          }

        },
        {
          name: "Proto L4 Approved",
          y: - this.PMworkWaterData.protol4approved,
          value: this.PMworkWaterData.protol4approved,
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
          y: - this.PMworkWaterData.protol4rejected,
          value: this.PMworkWaterData.protol4rejected,
          color: "#aa6cd9",
          dataLabels: {
            enabled: true,
            formatter: function () {
              return negateFormat(this.y)
            }
          }
        },
        {
          name: "Mechanical Approved",
          y: - this.PMworkWaterData.mechanicalapproved,
          value: this.PMworkWaterData.mechanicalapproved,
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
          y: - this.PMworkWaterData.mechanicalrejected,
          value: this.PMworkWaterData.mechanicalrejected,
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
          y: - this.PMworkWaterData.completed,
          value: this.PMworkWaterData.completed,
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
          y: - this.PMworkWaterData.deleted,
          value: this.PMworkWaterData.deleted,
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

  DateRxigency:any;
  selectExigencyDate(value){
    this.DateRxigency = value;
    this.getDateDashboard();
  }

  DateexigencyData:any;
  DatenonexigencyData:any;
  getDateDashboard() {
    var reqdata = { "year": this.CurrentYear, "formtype": "msw", "fromdate": this.setFirstdate, "todate": this.setLastDate };
    return this.ds.makeapi(this.getDashboard, reqdata, "postjson")
      .subscribe(data => {
        this.DateexigencyData = data['dateExigencyPieChartData']['exigencyDate']
        this.DatenonexigencyData = data['dateExigencyPieChartData']['nonExigencyDate']
        if (this.DateRxigency == "yes") {
          this.SingleHighChartExi()
          this.PieChartExi()
        }
        else {
          this.SingleHighChartNon_exi()
          this.PieChartNon_Exi()
        }
      },
        Error => {
        });
  }



  SingleHighChartExi() {
    this.singleHighChart = new Chart({
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
          ['Total', this.DateexigencyData.total],
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
  SingleHighChartNon_exi() {
    this.singleHighChart = new Chart({
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
          ['Total', this.DatenonexigencyData.total],
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
  PieChartExi() {
    var chartValue = [
      { name: 'Pending', y: this.DateexigencyData.pending, color: '#337ab7c9' },
      { name: 'Recall', y: this.DateexigencyData.recalled, color: '#51b364' },
      { name: 'L4 Approved', y: this.DateexigencyData.l4approved, color: '#51b364' },
      { name: 'L4 Rejected', y: this.DateexigencyData.l4rejected, color: '#f34747' },
      { name: 'Proto L4 Approved', y: this.DateexigencyData.protol4approved, color: '#51b364' },
      { name: 'Proto L4 Rejected', y: this.DateexigencyData.protol4rejected, color: '#f34747' },
      { name: 'Mechanical Supervisor Approved', y: this.DateexigencyData.mechanicalsupervisorapproved, color: '#51b364' },
      { name: 'Mechanical Supervisor Rejected', y: this.DateexigencyData.mechanicalsupervisorrejected, color: '#f34747' },
      { name: 'Completed', y: this.DateexigencyData.closed, color: '#51b364' },
      { name: 'Deleted', y: this.DateexigencyData.deleted, color: '#f34747' },

    ]
    this.pieChart = new Chart({
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
        data: chartValue
      }]
    });
  }
  PieChartNon_Exi() {
    var chartValue = [
      { name: 'Pending', y: this.DatenonexigencyData.pending, color: '#337ab7c9' },
      { name: 'Recall', y: this.DatenonexigencyData.recalled, color: '#337ab7c9' },
      { name: 'L4 Approved', y: this.DatenonexigencyData.l4approved, color: '#337ab7c9' },
      { name: 'L4 Rejected', y: this.DatenonexigencyData.l4rejected, color: '#337ab7c9' },
      { name: 'Proto L4 Approved', y: this.DatenonexigencyData.protol4approved, color: '#337ab7c9' },
      { name: 'Proto L4 Rejected', y: this.DatenonexigencyData.protol4rejected, color: '#337ab7c9' },
      { name: 'Mechanical Supervisor Approved', y: this.DatenonexigencyData.mechanicalsupervisorapproved, color: '#337ab7c9' },
      { name: 'Mechanical Supervisor Rejected', y: this.DatenonexigencyData.mechanicalsupervisorrejected, color: '#337ab7c9' },
      { name: 'Completed', y: this.DatenonexigencyData.closed, color: '#337ab7c9' },
      { name: 'Deleted', y: this.DatenonexigencyData.deleted, color: '#337ab7c9' },

    ]
    this.pieChart = new Chart({
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
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
        data: chartValue
      }]
    });
  }
}


