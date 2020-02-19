import { Component, OnInit } from '@angular/core';
import { DataserviceService } from '../../dataservice.service';
import { Router } from '@angular/router';
// import $ from 'jquery'
declare var $, moment;
@Component({
  selector: 'app-ofm-view',
  templateUrl: './ofm-view.component.html',
  styleUrls: ['./ofm-view.component.css']
})
export class OfmViewComponent implements OnInit {

  p1 = 1;
  p2 = 1;
  OfmPlannedList;
  OfmUnPlannedList;
  loading = false
  tab;
  getweek: any;
  downloadPDFUrl;
  selectedWeeks = [];
  shortlistedWeeks: any;
  
  constructor(private ds: DataserviceService, private router: Router) {
    this.downloadPDFUrl = this.ds.appconstant + 'proto/generateOFMPDF';
  }

  fetchAPI(dataFormat) {
    this.loading = true;
    var url = this.ds.appconstant + 'proto/formExigencyCaseList';
    this.ds.makeapi(url, dataFormat, 'postjson').subscribe(res => {
      this.loading = false
      console.log(res);
      this.OfmPlannedList = res['plannedProtoList'];
      this.OfmUnPlannedList = res['unplannedProtoList'];
    }, Error => {
      this.loading = false
    });
  }
  fetchOFMForWeek() {

    var weeknumber = moment(new Date()).week();
    var yearnumber = moment(new Date()).year();

    var dataFormat = {
      "weeknumbers": [{ "weekno": weeknumber, "year": yearnumber }],
    };

    this.selectedWeeks.push(weeknumber)

    this.fetchAPI(dataFormat)


  }
  PlannedWeeks = [];
  selectedPlannedWeeks = [];
  selectWeek() {
    // this.shortlistedWeeks = $("#ofmweek").val();
    // var weeknumber = 
    var weeknumber = moment($("#ofmweek").val()).week();
    var yearnumber = moment(new Date()).year();
    this.loading = true;
    
    this.selectedWeeks.push(weeknumber);
    console.log(this.selectedWeeks)
    // this.selectedWeeks.map((item)=>{
    //   if(this.selectedWeeks.length == 1){
    //     this.shortlistedWeeks = item;
    //     console.log(item)
    //   }else{
    //     this.shortlistedWeeks = this.shortlistedWeeks + "," + item.weekno;
    //   }

    // }) 

    // this.selectedWeeks = [];
    this.PlannedWeeks = [];
    this.PlannedWeeks.push({ "weekno": weeknumber, "year": yearnumber });
    console.log(this.PlannedWeeks)
    var dataFormat = {
      "weeknumbers": this.PlannedWeeks,
    };
    this.loading = false;
    this.fetchAPI(dataFormat);

  }
  viewWeeksdata() {
    $('#plannedWeek').modal('show');
  }
  viewUnplanWeeksdata() {
    $('#Weekunplan').modal('show');
  }
  weekReset(index) {
    var elem = document.getElementById('showWeeks' + index);
    elem.parentNode.removeChild(elem);
    var tmpArr = [];
    this.selectedWeeks.map(function (item, i) {
      if (index != i) {
        tmpArr.push(item);
      }
    });
    this.selectedWeeks = tmpArr;
    return false;
  }

  selectedUnPlanWeeks =[];
  UnPlannedWeeks=[];
  selectWeekUnPlan() {
    var weeknumber = moment($("#ofmweek2").val()).week();
    var yearnumber = moment(new Date()).year();
    this.loading = true;
    // this.selectedUnPlanWeeks = [];
    this.selectedUnPlanWeeks.push(weeknumber);
    this.UnPlannedWeeks = [];
    this.UnPlannedWeeks.push({ "weekno": weeknumber, "year": yearnumber });
    console.log(this.UnPlannedWeeks)
    var dataFormat = {
      "weeknumbers": this.UnPlannedWeeks,
    };
    this.loading = false;
    this.fetchAPI(dataFormat)
  }

 
  weekUnplanReset(index){
    var elem = document.getElementById('showUnPlanWeeks' + index);
    elem.parentNode.removeChild(elem);
    var tmpArr = [];
    this.selectedUnPlanWeeks.map(function (item, i) {
      if (index != i) {
        tmpArr.push(item);
      }
    });
    this.selectedUnPlanWeeks = tmpArr;
    return false;
  }

  CurrentYear:any;
  ngOnInit() {

    this.loading = true;
    this.tab = "planned"
    this.fetchOFMForWeek();

    this.CurrentYear = moment(new Date()).year();


  }


  pdfDownload(filename) {
    var weeknumber = moment(new Date()).week();
    var yearnumber = moment(new Date()).year();

    // var dataFormat = {
    //   "weeknumbers": [{ "weekno": 45 }, { "weekno": 22 }, { "weekno": 23 }, { "weekno": 24 }, { "weekno": 43 }],
    //   "year": "2019"
    // };
    var dataFormat = {
      "weeknumbers": [{ "weekno": weeknumber ,  "year": yearnumber}],
    
    };
    
      return this.ds.method(this.downloadPDFUrl, dataFormat, "downloadfileZIPjson")
      .subscribe(res => {
        // console.log(res.data);
        this.loading = false
        if (window.navigator.msSaveOrOpenBlob) {
          var fileData = [res.data];
          var blobObject = new Blob(fileData);
          // $(anchorSelector).click(function(){
          window.navigator.msSaveOrOpenBlob(blobObject, filename);
          window.navigator.msSaveOrOpenBlob(blobObject, filename);
        } else {
          // console.log("not IE browser");
          this.loading = false
          var url = window.URL.createObjectURL(res.data);
          var a = document.createElement('a');
          document.body.appendChild(a);
          a.setAttribute('style', 'display: none');
          a.href = url;
          a.download = res.filename;
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove(); // remove the element
        }

      },
        Error => {
          this.loading = false;
        });
  }
  markTab(type, $event) {
    this.tab = type;
    // console.log($event)
    // console.log($event.target)
    $(".tab").removeClass('tab_selected');
    $($event.target).addClass('tab_selected');
    // $($event.target).css("background","red");
    this.fetchOFMForWeek();
  }

  addproto() {
    this.router.navigate(['dashboard/protonew'], {});
  }
  protolists() {
    this.router.navigateByUrl('/dashboard/protolist');
  }

  showOFM() {
    this.router.navigate(['dashboard/ofm'], {})
  }

}
