import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { DataserviceService } from '../../dataservice.service';
@Component({
  selector: 'app-tcp-dashboard',
  templateUrl: './tcp-dashboard.component.html',
  styleUrls: ['./tcp-dashboard.component.css','./tcp-dashboard.component.scss']
})
export class TcpDashboardComponent implements OnInit {
  private appconstant = this.ds.appconstant;
  private DashboardAPI = this.appconstant + 'dashboard/get';
  constructor(private router: Router, private http: Http, private ds: DataserviceService) { }

  ngOnInit() {
    this.GetWaterFallDashboardAPI()

  }
  DepartData:any;
  CategoryData:any;
  AvailableData:any;
  GetWaterFallDashboardAPI() {
    var reqdata = {"year" : 2020 , "formtype" : "tcplate" , "fromdate" : "01-01-2020" , "todate" : "31-01-2020","category":"","supervisor":""}
    return this.ds.makeapi(this.DashboardAPI, reqdata, "postjson")
      .subscribe(data => {
        this.DepartData = data['tcpWaterFallData']['department']
        this.CategoryData = data['tcpWaterFallData']['category']
        this.AvailableData = data['tcpWaterFallData']['available']
        this.tcpwaterFall()
        this.tcpwaterFall2()
        this.tcpwaterFall3()
      },
        Error => {
        });
  }
  waterfallchart1
  tcpwaterFall(){
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
        y: this.DepartData.total,
        value: this.DepartData.total,
        color: "#010038",
        dataLabels: {
          enabled: true,
        }
      }, {
        name: "FE",
        y: -this.DepartData.fe,
        value: this.DepartData.fe,
        color: "#293a80",
        dataLabels: {
          enabled: true,
          formatter: function () {
            return negateFormat(this.y)
          }
        }
      }, {
        name: " FT",
        y: - this.DepartData.ft,
        value: this.DepartData.ft,
        color: "#537ec5",
        dataLabels: {
          enabled: true,
          formatter: function () {
            return negateFormat(this.y)
          }
        }

      },
      {
        name: "BMC",
        y: -this.DepartData.bmc,
        value: this.DepartData.bmc,
        color: "#3fc5f0",
        dataLabels: {
          enabled: true,
          formatter: function () {
            return negateFormat(this.y)
          }
        }

      },{
        name: "BUS",
        y: -this.DepartData.bus,
        value: this.DepartData.bus,
        color: "#00909e",
        dataLabels: {
          enabled: true,
          formatter: function () {
            return negateFormat(this.y)
          }
        }

      },{
        name: "Durability",
        y: -this.DepartData.durability,
        value: this.DepartData.durability,
        color: "#42dee1",
        dataLabels: {
          enabled: true,
          formatter: function () {
            return negateFormat(this.y)
          }
        }

      },{
        name: "Homologation",
        y: -this.DepartData.homologation,
        value: this.DepartData.homologation,
        color: "#003f5c",
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
  waterfallchart2
  tcpwaterFall2(){
    function negateFormat(y) {
      if (y < 0) {
        y = Math.abs(y)

      }
      return '' + y

    }
  this.waterfallchart2 = new Chart({
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
        y:  this.CategoryData.total,
        value:  this.CategoryData.total,
        color: "#003f5c",
        dataLabels: {
          enabled: true,
        }
      }, {
        name: "MDT",
        y: - this.CategoryData.mdt,
        value:  this.CategoryData.mdt,
        color: "#58508d",
        dataLabels: {
          enabled: true,
          formatter: function () {
            return negateFormat(this.y)
          }
        }
      }, {
        name: "HDT",
        y: -  this.CategoryData.hdt,
        value:  this.CategoryData.hdt,
        color: "#bc5090",
        dataLabels: {
          enabled: true,
          formatter: function () {
            return negateFormat(this.y)
          }
        }

      },
      {
        name: "LDT",
        y: - this.CategoryData.ldt,
        value:  this.CategoryData.ldt,
        color: "#ff6361",
        dataLabels: {
          enabled: true,
          formatter: function () {
            return negateFormat(this.y)
          }
        }

      },
      {
        name: "TT",
        y: - this.CategoryData.tt,
        value:  this.CategoryData.tt,
        color: "#ec9b3b",
        dataLabels: {
          enabled: true,
          formatter: function () {
            return negateFormat(this.y)
          }
        }

      },
      {
        name: "BUS",
        y: - this.CategoryData.bus,
        value:  this.CategoryData.bus,
        color: "#00818a",
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
  waterfallchart3
  tcpwaterFall3(){
    function negateFormat(y) {
      if (y < 0) {
        y = Math.abs(y)

      }
      return '' + y

    }
  this.waterfallchart3 = new Chart({
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
        y:  this.AvailableData.total,
        value:  this.AvailableData.total,
        color: "#015668",
        dataLabels: {
          enabled: true,
        }
      }, {
        name: "Live",
        y: -this.AvailableData.live,
        value: this.AvailableData.live,
        color: "#018383",
        dataLabels: {
          enabled: true,
          formatter: function () {
            return negateFormat(this.y)
          }
        }
      }, {
        name: " Renewal",
        y: - this.AvailableData.renewal,
        value: this.AvailableData.renewal,
        color: "#02a8a8",
        dataLabels: {
          enabled: true,
          formatter: function () {
            return negateFormat(this.y)
          }
        }

      },
      {
        name: "Available",
        y: -this.AvailableData.available,
        value: this.AvailableData.available,
        color: "#46b5d1",
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
}
