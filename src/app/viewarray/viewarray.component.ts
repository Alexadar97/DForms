import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-viewarray',
  templateUrl: './viewarray.component.html',
  styleUrls: ['./viewarray.component.css']
})
export class ViewarrayComponent implements OnInit {

  constructor() { }
 
  ngOnInit() {

  }
 viewArraylist = [{"creditorname":"","department":"","ionumber":"","phonenumber":"","stoformid":"","ppapproved":"ppa","pprejected":"ppr",
  "iplapproved":"ipla","iplpartialapproved":"iplpa","budgetrejected":"br","l4approved":"l4a","l4rejected":"l4r","l3rejected":"l3r",
  "pending":"pen","l3approved":"l3a","exigencyrequest":"exi","budgetapproved":"ba","smapproved":"sma","smpartialapproved":"smpa",
  "Storeapproved":"stoa","closed":"clo"
  
  }]

}

