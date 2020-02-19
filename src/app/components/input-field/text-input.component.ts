import { Component, OnInit,Input } from '@angular/core';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'text-input',
  templateUrl: './text-input.component.html',
  styleUrls: []
})
export class TextInputComponent implements OnInit {

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
