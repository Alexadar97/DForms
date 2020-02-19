import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'errMsg',
  templateUrl: './errMsg.component.html',
  styleUrls: []
})
export class ErrMsgComponent implements OnInit {


    @Input() parentForm:FormGroup;
    @Input() prop;
    @Input() input;
    message;
  constructor() { 
  
  }


  isValid(){
      return !this.parentForm.controls[this.prop].valid && this.parentForm.controls[this.prop].touched
  }
  ngOnInit() {
      // this.message = this.input + " is required"
    
  }






  
}
