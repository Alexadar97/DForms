import { Component, OnInit, Input } from '@angular/core';
import { DataserviceService } from '../dataservice.service';
@Component({
  selector: 's-update',
  templateUrl: './status-update.component.html',
  styleUrls: ['./status-update.css']
})
export class StatusUpdateComponent implements OnInit {

  @Input() arr
  dotArr = []
  progress = 0;
  constructor(private ds: DataserviceService) { 
   
  }

  onChanges(){
    this.arr.valueChanges.subscribe(val2=>{
      console.log(JSON.stringify(this.arr.value));
      var arr = this.arr.value.arr;
      var keys = Object.keys(arr)
      var currentProgress = 0;
      var currentTarget = 0
      this.dotArr = []
      keys.map((item)=>{

        var keyValue = arr[item];
        var labelValue = this.ds.fetchRoleValue(item)
        // var labelValue = item

        if(keyValue == 0){
          currentProgress++
          this.dotArr.push({label:labelValue,status:'null'})
          
        }else if(keyValue == 1){
          console.log(currentProgress);
          currentTarget = currentProgress;
          this.progress = currentProgress*(100/(keys.length-1));
          this.dotArr.push({label:labelValue,status:'null'})
        }

        
       
      })
      this.progress = currentTarget*(100/(this.dotArr.length-1));
      // this.dotArr.push({label:'test',status:'red'})
      // this.dotArr.push({label:'test',status:'done'})
      // this.dotArr.push({label:'test',status:'red'})
      // this.dotArr.push({label:'test',status:'green'})
      // this.dotArr.push({label:'test',status:'null'})
      // this.dotArr.push({label:'test',status:'red'})
      // this.dotArr.push({label:'test',status:'red'})
  
      // this.progress = currentProgress*(100/(this.dotArr.length-1));

      console.log(keys);
      console.log(this.dotArr);
      var dupArr = []
      if(currentProgress != 0){
        var tmpCount = 0;
        
        this.dotArr.map((item,index)=>{
          var arrObj = {}
          if(index <= currentTarget){
            // this.dotArr.push({label:item,status:'done'})
            if((item.label.indexOf('approved') != -1 || item.label.indexOf('Approved') != -1 || item.label.indexOf('Closed') != -1) && index==currentTarget){
              arrObj = {label:item.label,status:'green'}
              // dupArr.push(arrObj)
            }else if((item.label.indexOf('reject') != -1 || item.label.indexOf('Reject') != -1)   && index==currentTarget){
              arrObj = {label:item.label,status:'red'}
              // dupArr.push()
            }else{
              arrObj = {label:item.label,status:'done'}
              // dupArr.push()
            }
            
          }else{
            arrObj = {label:item.label,status:'null'}
            // dupArr.push()
          }
          dupArr.push(arrObj)
          // tmpCount++
        })
        this.dotArr = dupArr
        console.log(this.dotArr);
      }
    })
  }

  ngOnInit() {
    // console.log(this.arr.value);
    // this.arr.map((item)=>{
    //   console.log(item);
    //   // this.dotArr.push({label:'test',status:'red'})
    // })
    

    this.onChanges();
  }






  
}
