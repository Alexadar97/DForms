import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { DataserviceService } from '../../dataservice.service';
declare var $, moment;
@Component({
  selector: 'app-material-dashboard',
  templateUrl: './material-dashboard.component.html',
  styleUrls: ['./material-dashboard.component.css', './material-dashboard.component.scss']
})
export class MaterialDashboardComponent implements OnInit {

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
  private YearAPI = this.appconstant + 'dashboard/getYear';

  constructor(private router: Router, private http: Http, private ds: DataserviceService) {

    var date = new Date();
    this.initialDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    this.maxDate = new Date(date.getFullYear(), date.getMonth(), 0);
    this.bsRangeValue = [this.initialDate, this.maxDate];

  }

  ngOnInit() {
   this.Year()
    // previous month first date and last date
    // this.currentYear = moment().year();
    // this.date = new Date();
    // this.firstDay = new Date(this.date.getFullYear(), this.date.getMonth() - 1, 1);
    // this.lastDay = new Date(this.date.getFullYear(), this.date.getMonth(), 0);
    // this.lastMonthfrstDay = moment(this.firstDay).format('DD-MM-YYYY');
    // this.beforeMonthcurrentDay = moment(this.lastDay).format('DD-MM-YYYY');
    // $("#date").val(this.lastMonthfrstDay + "-" + this.beforeMonthcurrentDay);
    $("#year").val(new Date().getFullYear());
    $(document).ready(() => {
      $('[name=year]').val(new Date().getFullYear());
    });
    this.ChangeYear(new Date().getFullYear())
    // previous moth first date and last date
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth(), 0);
    this.CurrentYear = new Date().getFullYear()
    this.bsConfig = Object.assign({}, { containerClass: 'theme-blue', rangeInputFormat: 'DD/MMM/YYYY' })

    this.setFirstdate = moment(firstDay).format('DD-MM-YYYY');
    this.setLastDate = moment(lastDay).format('DD-MM-YYYY');
    this.datevalue = this.setFirstdate + " " + "-" + " " + this.setLastDate



    // this.SingleHighChart();
    this.getDashboardAPI();

  }
  yearlist=[]
  Year(){
    this.ds.makeapi(this.YearAPI,"formtype="+"mis","post")
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
    var reqdata ={"year" : this.CurrentYear , "formtype" : "mis" , "fromdate" : this.setFirstdate , "todate" : this.setLastDate};
    this.ds.makeapi(this.getDashboard, reqdata, 'postjson').subscribe(data => {
      console.log(data);
      this.MisBarData = data['barChartData'];
      this.BarChart();
    });

  }

  MisBarData: any;
  MisWaterData: any;
  getDashboardAPI() {
    // var startOfMonth = moment().startOf('month').format('DD-MM-YYYY');
    // var endOfMonth = moment().endOf('month').format('DD-MM-YYYY');
    var reqdata ={"year" : this.CurrentYear , "formtype" : "mis" , "fromdate" : this.setFirstdate , "todate" : this.setLastDate};
    this.ds.makeapi(this.getDashboard, reqdata, 'postjson').subscribe(data => {
      console.log(data);
      this.MisBarData = data['barChartData'];
      this.MisWaterData = data['waterFallData'];
      this.MisPieData = data.pieChartData;
      this.DateReqData = this.MisPieData.date;
      this.BarChart();
      this.WaterFallChart();
      this.PieChart();
      this.SingleHighChart();
    });
  }

  BarChart() {
    this.highChart = new Chart({
      chart: {
        type: 'column',
        height: "260px",
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
          ['Jan', this.MisBarData.Jan],
          ['Feb', this.MisBarData.Feb],
          ['Mar', this.MisBarData.Mar],
          ['Apr', this.MisBarData.Apr],
          ['May', this.MisBarData.May],
          ['Jun', this.MisBarData.June],
          ['Jul', this.MisBarData.July],
          ['Aug', this.MisBarData.Aug],
          ['Sep', this.MisBarData.Sep],
          ['Oct', this.MisBarData.Oct],
          ['Nov', this.MisBarData.Nov],
          ['Dec', this.MisBarData.Dec]
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


  DatePieChartData: any;
  MisPieData: any;
  DateReqData: any;
  SelectDate(value) {
    if (value != null && this.CurrentYear != undefined) {
      var dates1 = new Date(value[0]);
      var dates2 = new Date(value[1]);
      this.setFirstdate = moment(dates1).format('DD-MM-YYYY');
      this.setLastDate = moment(dates2).format('DD-MM-YYYY');

      var reqdata ={"year" : this.CurrentYear , "formtype" : "mis" , "fromdate" : this.setFirstdate , "todate" : this.setLastDate};
      return this.ds.makeapi(this.getDashboard, reqdata, "postjson").
        subscribe(data => {
          this.MisPieData = data.pieChartData;
          this.DateReqData = this.MisPieData.date;
          this.PieChart();
          this.SingleHighChart();
        },
          Error => {

          })
    }

  }

  checkforvalue(val) {
    if (val == undefined || val == null) {
      return 0
    } else {
      return val
    }

  }
  PieChart() {
    var chatdata = [
      { name: 'Pending', y: this.checkforvalue(this.DateReqData.pending), color: '#ffc009' },
      { name: 'Resent', y: this.checkforvalue(this.DateReqData.resent), color: '#51b364' },
      { name: 'Partial Initiated', y: this.checkforvalue(this.DateReqData.partspickinginitiated), color: '#51b364' },
      { name: 'Partial Completed', y: this.checkforvalue(this.DateReqData.partspickingcompleted), color: '#51b364' },
      { name: 'Relocated', y: this.checkforvalue(this.DateReqData.relocated), color: '#51b364' },
      { name: 'Partial Completed', y: this.checkforvalue(this.DateReqData.acknowledged), color: '#51b364' },
      { name: 'Completed', y: this.checkforvalue(this.DateReqData.completed), color: '#51b364' },
      { name: 'Recalled', y: this.checkforvalue(this.DateReqData.recalled), color: '#ffc009' },
      { name: 'Deleted', y: this.checkforvalue(this.DateReqData.deleted), color: '#f34747' },
    ]
    this.pieChart = new Chart({
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
        data: chatdata
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
        width: 480,
      },
      xAxis: {
        type: 'category',
        labels: {
          autoRotation: false
        }
      },

      yAxis: {
        min: 0,
        title: {
          text: ' '
        }
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
          y: this.MisWaterData.total,
          value: this.MisWaterData.total,
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
          y: - this.MisWaterData.pending,
          value: this.MisWaterData.pending,
          color: "#fa9d66",
          dataLabels: {
            enabled: true,
            formatter: function () {
              return negateFormat(this.y)
            }
          }
        },
        {
          name: "Resent",
          y: - this.MisWaterData.resent,
          value: this.MisWaterData.resent,
          color: "#96cd5a",
          dataLabels: {
            enabled: true,
            formatter: function () {
              return negateFormat(this.y)
            }
          }

        },

        {
          name: "Parts Picking Initiated",
          y: - this.MisWaterData.partspickinginitiated,
          value: this.MisWaterData.partspickinginitiated,
          color: "#96cd5a",
          dataLabels: {
            enabled: true,
            formatter: function () {
              return negateFormat(this.y)
            }
          }

        },
        {
          name: "Parts Picking Completed",
          y: - this.MisWaterData.partspickingcompleted,
          value: this.MisWaterData.partspickingcompleted,
          color: "#48701c",
          dataLabels: {
            enabled: true,
            formatter: function () {
              return negateFormat(this.y)
            }
          }

        },
        {
          name: "Relocated",
          y: - this.MisWaterData.relocated,
          value: this.MisWaterData.relocated,
          color: "#aa6cd9",
          dataLabels: {
            enabled: true,
            formatter: function () {
              return negateFormat(this.y)
            }
          }
        },
        {
          name: "Acknowledged",
          y: - this.MisWaterData.acknowledged,
          value: this.MisWaterData.acknowledged,
          color: "#aa6cd9",
          dataLabels: {
            enabled: true,
            formatter: function () {
              return negateFormat(this.y)
            }
          }
        },
        {
          name: "Completed",
          y: - this.MisWaterData.completed,
          value: this.MisWaterData.completed,
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
          y: - this.MisWaterData.recalled,
          value: this.MisWaterData.recalled,
          color: "#48701c",
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

  SingleHighChart() {
    this.singleHighChart = new Chart({
      chart: {
        type: 'column',
        height: "300px",
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
          ['Jan', this.DateReqData.total],
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
