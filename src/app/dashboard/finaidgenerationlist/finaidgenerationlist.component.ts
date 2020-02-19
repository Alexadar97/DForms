import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-finaidgenerationlist',
  templateUrl: './finaidgenerationlist.component.html',
  styleUrls: ['./finaidgenerationlist.component.css']
})
export class FinaidgenerationlistComponent implements OnInit {

  isStoreLogin;
  loading;
  constructor(private router:Router) { }

  ngOnInit() {
  }
  finasidlist(){
    this.router.navigate(['dashboard/finaidgenerationnew'], {});
  }
}
