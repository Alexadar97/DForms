import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var $
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  username;
  userdetail;
  showtabs= true
  showlocaltabs=true
  constructor(private router:Router) {
    var userDetails = localStorage.getItem("Daim-forms");
    if(userDetails === null){

      alert("Invalid Login!");
      this.router.navigateByUrl('/login');
    }else{
      var userJson = JSON.parse(userDetails);
      this.userdetail = userJson;
      this.username = userJson['firstname'] + " "+userJson['lastname'];
      
      var routeNewLink =  localStorage.getItem("Forms-redirect-url");
      if(routeNewLink == null || routeNewLink == ''){
        this.router.navigateByUrl('/home/dashboard');
        
      }else{
        localStorage.setItem("Forms-redirect-url",'');
        this.router.navigateByUrl(routeNewLink);
        
      }
      
    }
   }

  ngOnInit() {
    // live  sidemenu
    this.showtabs = true

    // local sidemenu
    this.showlocaltabs = true

    $(document).ready(function(){
      $('[data-toggle="tooltip"]').tooltip();
    });
  }

  logout(){
    localStorage.removeItem("Pagination")
    this.router.navigateByUrl('/login');
        localStorage.setItem('Daim-forms',null);
  }
  home(){
    localStorage.removeItem("Pagination")
    this.router.navigateByUrl('/home');
  }
}
