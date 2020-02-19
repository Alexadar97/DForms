import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-vehiclesignofflist',
  templateUrl: './vehiclesignofflist.component.html',
  styleUrls: ['./vehiclesignofflist.component.css']
})
export class VehiclesignofflistComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }
  addvehiclesignoff(){
    this.router.navigate(['dashboard/vehiclesignoffnew'], {});
  }
}
