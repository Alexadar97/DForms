
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataserviceService } from '../dataservice.service';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: any;
  loading = false;
  saveApi = this.ds.appconstant + 'user/login';
  constructor(private router: Router, private ds: DataserviceService, private FormBuilder: FormBuilder) {

    this.form = this.FormBuilder.group({

      "shortid": [null, Validators.compose([Validators.required])],
      "password": [null],
      "type": [null]

    });

    // this.form = this.FormBuilder.group({

    //   "shortid": ['admin', Validators.compose([Validators.required])],
    //   "password": ['admin', Validators.compose([Validators.required])],
    //   "type":[null]

    // });
  }

  ngOnInit() {
  }

  enterkey(keycode) {
    if (keycode == 13)
      this.onSubmit();
  }

  onSubmit() {

    var data = this.form.value;
    this.loading = true;
    try {
      if (this.form.valid) {
        this.ds.makeapi(this.saveApi, data, "postjson")
          .subscribe(data => {
            this.loading = false;

            //FOR TESTING
            if(this.form.value.type == 'bca'){

            }
            else{
              data["usertype"] = this.form.value.type;
            }
         

            if (data.status == "Success") {
              localStorage.setItem("Daim-forms", JSON.stringify(data));
              if (data.usertype == "mdtbca"|| data.usertype == "hdtbca"|| data.usertype == "aggregatebca"
              || data.usertype == "eandebca"|| data.usertype == "ppsbca"|| data.usertype == "maintenancebca" ) {
                localStorage.setItem("Daim-forms", JSON.stringify(data));
                this.router.navigateByUrl('/protobca');
              }else if(data.usertype == "mechanicalbca"){
                // localStorage.setItem("Daim-forms", JSON.stringify(data));
                this.router.navigate(['/pmwrbca'], { queryParams: { id: data.formid } });
              }
              else {
                this.router.navigateByUrl('/home');
              }

            }
            else {
              //wrong login
              alert("Incorrect Credentials!");
            }
            //   this.router.navigateByUrl('/dashboard');


          },
            Error => {
              this.loading = false;
            });
      } else {
        this.loading = false;
      }

    } catch (e) {
      alert("Incorrect Credentials!");
    }




  }

}
