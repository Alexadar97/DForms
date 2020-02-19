import { Component, OnInit,Input } from '@angular/core';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'disabled-input',
  templateUrl: './disabled-input.component.html',
  styleUrls: []
})
export class DisabledInputComponent implements OnInit {

    @Input() parentForm:FormGroup;
    @Input() prop;
    @Input() input;
    @Input() label;
    @Input() isRequired;
    @Input() placeholder;
    @Input() min;
    @Input() max;
    message;
    ph;
  constructor() { 
  
  }


  ngOnInit() {
    this.ph = this.placeholder;
  }






  
}
