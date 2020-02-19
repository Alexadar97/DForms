import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Http, Response, Headers, RequestOptions,ResponseContentType } from '@angular/http';


declare var $: any;
@Injectable({
  providedIn: 'root'
})
export class DataserviceService {

    
  appconstant = 'http://13.234.64.82:8080/DaimForms/forms/';
//   appconstantTCP = 'http://13.234.64.82:8080/DaimForms_TC/forms/';
//
  // nmcs/uploadFile
  // uat live server
//   appconstant = 'http://53.89.192.196:8080/DaimForms/forms/';
// appconstantTCP = 'http://53.89.192.196:8080/DaimForms_TC/forms/';

  //live server
// appconstant = 'http://53.89.192.195:8080/DaimForms/forms/';


  constructor(private http:Http) { }

  notify(msg,type){
    $.notify(msg,type,{position:"bottom right",globalPosition:"bottom right"});
  }

  showNotification(from, align, msg, type) {

    $.notify({
      icon: 'notifications',
      message: msg

    }, {
        type: type,
        timer: 2000,
        placement: {
          from: from,
          align: align
        }
      });
  }

  makeget(url,data): Observable<any>{
    const headers = new Headers();
    // if(type == "post"){
      // headers.append('Content-Type', 'application/x-www-form-urlencoded');
    // }else if(type == "postjson"){
    //   headers.append('content-type', 'application/json');
    // }


      return this.http.get(url, data)
          .map((response: Response) => response.json())
          .catch((error: any) => {
              if (error.status === 500) {
                  return Observable.throw(new Error(error.status));
              }
              else if (error.status === 400) {
                  return Observable.throw(new Error(error.status));
              }
              else if (error.status === 409) {
                  return Observable.throw(new Error(error.status));
              }
              else if (error.status === 406) {
                  return Observable.throw(new Error(error.status));
              }
              else if (error.status === 403) {

              }
          });
  }

  getCookie(cname) {
    var name = cname + "=";
    var cArr = window.document.cookie.split(';');
    for (var i = 0; i < cArr.length; i++) {
        var c = cArr[i].trim();
        if (c.indexOf(name) == 0)
            return c.substring(name.length, c.length);
    }
    return "";
}



  postFile(url,data){
    var token = this.getCookie('disc-cookies');
    let headers = new Headers();
    //console.log("TOKEN",token);
    headers.append('Accept', 'application/json');

    // headers.append('Content-Type', 'multipart/form-data');
    headers.append('Authorization', token);
    let options = new RequestOptions({ headers: headers });
    return this.http.post(url, data, { headers: headers })
        .map((response: Response) => response.json())
        .catch((error: any) => {

            if (error.status === 500) {
                return Observable.throw(new Error(error.status));
            }
            else if (error.status === 400) {
                return Observable.throw(new Error(error.status));
            }
            else if (error.status === 409) {
                return Observable.throw(new Error(error.status));
            }
            else if (error.status === 406) {
                return Observable.throw(new Error(error.status));
            }
            else if (error.status === 403) {
                localStorage.removeItem('disc-portal-session');
                // this.router.navigateByUrl('/login');
                // this.deleteCookie('disc-cookies');
            }
        })
        .finally(() => {

        });
  }


  makeapi(url,data,type): Observable<any>{
    const headers = new Headers();
    if(type == "post"){
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
    }else if(type == "postjson"){
      headers.append('content-type', 'application/json');
    }

    // let headers = new Headers();
    // headers.append('Accept', 'application/json');
    // headers.append('Authorization', this.token);
    let options = new RequestOptions({ headers: headers });


      return this.http.post(url, data, { headers: headers })
          .map((response: Response) => response.json())
          .catch((error: any) => {
              if (error.status === 500) {
                  return Observable.throw(new Error(error.status));
              }
              else if (error.status === 400) {
                  return Observable.throw(new Error(error.status));
              }
              else if (error.status === 409) {
                  return Observable.throw(new Error(error.status));
              }
              else if (error.status === 406) {
                  return Observable.throw(new Error(error.status));
              }
              else if (error.status === 403) {

              }
          });
  }
  methodPDF(url, data, method,filename): Observable<any> {
    var token = this.getCookie('disc-cookies');
    if (method === 'downloadfilejson') {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', token);
        return this.http.post(url, data, {responseType: ResponseContentType.Blob, headers: headers })

        .map(res => {
            return {
                filename:filename,
                data: res.blob()
            };
        })
            .catch((error: any) => {
                if (error.status === 500) {
                    return Observable.throw(new Error(error.status));
                }
                else if (error.status === 400) {
                    return Observable.throw(new Error(error.status));
                }
                else if (error.status === 409) {
                    return Observable.throw(new Error(error.status));
                }
                else if (error.status === 406) {
                    return Observable.throw(new Error(error.status));
                }
                else if (error.status === 403) {
                }
            })
            .finally(() => {
            });
      }
  }
  method(url, data, method): Observable<any> {

  if (method === 'downloadfile') {
    var token = this.getCookie('disc-cookies');
    const headers = new Headers();
    headers.append('Authorization',token);
    return this.http.get(url, { responseType: ResponseContentType.Blob, headers: headers })
        .map(res => {
            return {
                filename: data,
                data: res.blob()
            };
        })
        .catch((error: any) => {
            if (error.status === 500) {
                return Observable.throw(new Error(error.status));
            }
            else if (error.status === 400) {
                return Observable.throw(new Error(error.status));
            }
            else if (error.status === 409) {
                return Observable.throw(new Error(error.status));
            }
            else if (error.status === 406) {
                return Observable.throw(new Error(error.status));
            }
            else if (error.status === 403) {
            }
        })
}
if (method === 'downloadfile') {
    var token = this.getCookie('disc-cookies');
    const headers = new Headers();
    headers.append('Authorization',token);
    return this.http.get(url, { responseType: ResponseContentType.Blob, headers: headers })
        .map(res => {
            return {
                filename: data,
                data: res.blob()
            };
        })
        .catch((error: any) => {
            if (error.status === 500) {
                return Observable.throw(new Error(error.status));
            }
            else if (error.status === 400) {
                return Observable.throw(new Error(error.status));
            }
            else if (error.status === 409) {
                return Observable.throw(new Error(error.status));
            }
            else if (error.status === 406) {
                return Observable.throw(new Error(error.status));
            }
            else if (error.status === 403) {
            }
        })
}
if (method === 'get') {
    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.get(url, { headers: headers })
        .map((response: Response) => response.json())
        .catch((error: any) => {
            if (error.status === 500) {
                return Observable.throw(new Error(error.status));
            }
            else if (error.status === 400) {
                return Observable.throw(new Error(error.status));
            }
            else if (error.status === 409) {
                return Observable.throw(new Error(error.status));
            }
            else if (error.status === 406) {
                return Observable.throw(new Error(error.status));
            }
            else if (error.status === 403) {
            }
        })
}
if (method === 'file') {
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    // headers.append('Authorization', this.token);
    let options = new RequestOptions({ headers: headers });
    return this.http.post(url, data, { headers: headers })
        .map((response: Response) => response.json())
        .catch((error: any) => {
            if (error.status === 500) {
                return Observable.throw(new Error(error.status));
            }
            else if (error.status === 400) {
                return Observable.throw(new Error(error.status));
            }
            else if (error.status === 409) {
                return Observable.throw(new Error(error.status));
            }
            else if (error.status === 406) {
                return Observable.throw(new Error(error.status));
            }
            else if (error.status === 403) {
            }
        })
}
if (method === 'downloadfilePDFjson') {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', token);
    return this.http.post(url, data, {responseType: ResponseContentType.Blob, headers: headers })

    .map(res => {
        return {
            filename:"Generate_PDF.pdf",
            data: res.blob()
        };
    })
        .catch((error: any) => {
            if (error.status === 500) {
                return Observable.throw(new Error(error.status));
            }
            else if (error.status === 400) {
                return Observable.throw(new Error(error.status));
            }
            else if (error.status === 409) {
                return Observable.throw(new Error(error.status));
            }
            else if (error.status === 406) {
                return Observable.throw(new Error(error.status));
            }
            else if (error.status === 403) {
            }
        })
        .finally(() => {
        });
  }
  if (method === 'downloadfilePDF') {
    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Authorization', token);
    return this.http.post(url, data, {responseType: ResponseContentType.Blob, headers: headers })

    .map(res => {
        return {
            filename:"Generate_PDF.pdf",
            data: res.blob()
        };
    })
        .catch((error: any) => {
            if (error.status === 500) {
                return Observable.throw(new Error(error.status));
            }
            else if (error.status === 400) {
                return Observable.throw(new Error(error.status));
            }
            else if (error.status === 409) {
                return Observable.throw(new Error(error.status));
            }
            else if (error.status === 406) {
                return Observable.throw(new Error(error.status));
            }
            else if (error.status === 403) {
            }
        })
        .finally(() => {
        });
  }
  if (method === 'downloadfilePDFTCP') {
    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Authorization', token);
    return this.http.post(url, data, {responseType: ResponseContentType.Blob, headers: headers })

    .map(res => {
        return {
            filename:data,
            data: res.blob()
        };
    })
        .catch((error: any) => {
            if (error.status === 500) {
                return Observable.throw(new Error(error.status));
            }
            else if (error.status === 400) {
                return Observable.throw(new Error(error.status));
            }
            else if (error.status === 409) {
                return Observable.throw(new Error(error.status));
            }
            else if (error.status === 406) {
                return Observable.throw(new Error(error.status));
            }
            else if (error.status === 403) {
            }
        })
        .finally(() => {
        });
  }
  if (method === 'downloadfileZIPjson') {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', token);
    return this.http.post(url, data, {responseType: ResponseContentType.Blob, headers: headers })

    .map(res => {
        return {
            filename:"Generate_ZIP.zip",
            data: res.blob()
        };
    })
        .catch((error: any) => {
            if (error.status === 500) {
                return Observable.throw(new Error(error.status));
            }
            else if (error.status === 400) {
                return Observable.throw(new Error(error.status));
            }
            else if (error.status === 409) {
                return Observable.throw(new Error(error.status));
            }
            else if (error.status === 406) {
                return Observable.throw(new Error(error.status));
            }
            else if (error.status === 403) {
            }
        })
        .finally(() => {
        });
  }

if (method === 'downloadfilejson') {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', token);
  return this.http.post(url, data, {responseType: ResponseContentType.Blob, headers: headers })

  .map(res => {
      return {
          filename:"export.xlsx",
          data: res.blob()
      };
  })
      .catch((error: any) => {
          if (error.status === 500) {
              return Observable.throw(new Error(error.status));
          }
          else if (error.status === 400) {
              return Observable.throw(new Error(error.status));
          }
          else if (error.status === 409) {
              return Observable.throw(new Error(error.status));
          }
          else if (error.status === 406) {
              return Observable.throw(new Error(error.status));
          }
          else if (error.status === 403) {
          }
      })
      .finally(() => {
      });
}

if (method === 'downloadfilejsonpost') {
    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Authorization', token);
    return this.http.post(url, data, {responseType: ResponseContentType.Blob, headers: headers })
  
    .map(res => {
        return {
            filename:"export.xlsx",
            data: res.blob()
        };
    })
        .catch((error: any) => {
            if (error.status === 500) {
                return Observable.throw(new Error(error.status));
            }
            else if (error.status === 400) {
                return Observable.throw(new Error(error.status));
            }
            else if (error.status === 409) {
                return Observable.throw(new Error(error.status));
            }
            else if (error.status === 406) {
                return Observable.throw(new Error(error.status));
            }
            else if (error.status === 403) {
            }
        })
        .finally(() => {
        });
  }
  
if (method === 'downloadpdffilejson') {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', token);
    return this.http.post(url, data, {responseType: ResponseContentType.Blob, headers: headers })
  
    .map(res => {
        return {
            filename:"export.pdf",
            data: res.blob()
        };
    })
        .catch((error: any) => {
            if (error.status === 500) {
                return Observable.throw(new Error(error.status));
            }
            else if (error.status === 400) {
                return Observable.throw(new Error(error.status));
            }
            else if (error.status === 409) {
                return Observable.throw(new Error(error.status));
            }
            else if (error.status === 406) {
                return Observable.throw(new Error(error.status));
            }
            else if (error.status === 403) {
            }
        })
        .finally(() => {
        });
  }
if (method === 'downloadfileUrlencode') {
    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Authorization', token);
    return this.http.post(url, data, {responseType: ResponseContentType.Blob, headers: headers })

    .map(res => {
        return {
            filename:'Export.xlsx',
            data: res.blob()
        };
    })
        .catch((error: any) => {
            if (error.status === 500) {
                return Observable.throw(new Error(error.status));
            }
            else if (error.status === 400) {
                return Observable.throw(new Error(error.status));
            }
            else if (error.status === 409) {
                return Observable.throw(new Error(error.status));
            }
            else if (error.status === 406) {
                return Observable.throw(new Error(error.status));
            }
            else if (error.status === 403) {
            }
        })
        .finally(() => {
        });
  }
  if (method === 'post') {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(url, data, { headers: headers })
        .map((response: Response) => response.json())
        .catch((error: any) => {
            if (error.status === 500) {
                return Observable.throw(new Error(error.status));
            }
            else if (error.status === 400) {
                return Observable.throw(new Error(error.status));
            }
            else if (error.status === 409) {
                return Observable.throw(new Error(error.status));
            }
            else if (error.status === 406) {
                return Observable.throw(new Error(error.status));
            }
            else if (error.status === 403) {
            }
        })
}
  }

  findInvalidControls(form) {
    const invalid = [];
    const controls = form.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }
    return invalid;
}

findInvalidControlsRecursive(formToInvestigate) {
    var invalidControls:string[] = [];
    let recursiveFunc = (form) => {
      Object.keys(form.controls).forEach(field => {
        const control = form.get(field);
        if (control.invalid) invalidControls.push(field);
        if (control) {
          recursiveFunc(control);
        // } else if (control instanceof FormArray) {
        //   recursiveFunc(control);
        // }
        }
      });
    }
    recursiveFunc(formToInvestigate);
    return invalidControls;
  }


  fetchRoleValue(key){
    // var roleMap = {
    //     accepted:"Accepted",
    //     approved:"Approved",
    //     budgetapproved:"Budget Approved",
    //     budgetrejected:"Budget Rejected",
    //     closed:"Closed",
    //     deleted:"Deleted",
    //     exigencyrequest:"Exigency Request",
    //     iplapproved:"IPL Approved",
    //     iplpartialapproved:"IPL Partial Approved",
    //     l4approved:"L4 Approved",
    //     l4rejected:"L4 Rejected",
    //     l3approved:"L3 Approved",
    //     l3rejected:"L3 Rejected",
    //     locationupdated:"Location Updated",
    //     ppapproved:"PP Approved",
    //     pprejected:"PP Rejected",
    //     partialclosed:"Partial Closed",
    //     pending:"Pending",
    //     recalled:"Recalled",
    //     smapproved:"SM Approved",
    //     smpartialapproved:"SM Partial Approved",
    //     storeapproved:"Store Approved",
    //     storerejected:"Store Rejected"
        
    // }

    var roleMap = { 
        accepted: 'Accepted',
        acknowledged: 'Acknowledged',
        aggregatesupervisorapproved: 'Aggregate Supervisor Approved',
        aggregatesupervisorrejected: 'Aggregate Supervisor Rejected',
        approved: 'Approved',
        budgetapproved: 'Budget Approved',
        budgetrejected: 'Budget Rejected',
        closed: 'Closed',
        consigndetailsshared:"Consignment Details Shared",
        deleted: 'Deleted',
        exigencyrequest: 'Exigency Request',
        hdtsupervisorapproved: 'HDT Supervisor Approved',
        hdtsupervisorrejected: 'HDT Supervisor Rejected',
        iplapproved: 'IPL Approved',
        iplpartialapproved: 'IPL Partial Approved',
        l2approved: 'L2 Approved',
        l2rejected: 'L2 Rejected',
        l3approved: 'L3 Approved',
        l3rejected: 'L3 Rejected',
        l4approved: 'L4 Approved',
        l4dispatchapproved: 'Dispatch approved by L4',
        l4dispatchrejected: 'Dispatch Rejected by L4',
        l4rejected: 'L4 Rejected',
        locationupdated: 'Location Updated',
        mdtsupervisorapproved: 'MDT Supervisor Approved',
        mdtsupervisorrejected: 'MDT Supervisor Rejected',
        mechsupervisorapproved: 'Mech Supervisor Approved',
        mechsupervisorrejected: 'Mech Supervisor Rejected',
        packdispatched: 'Packaging Dispatched',
        packinitiated: 'Packaging Initiated',
        packsubmitted: 'Packaging Completed',
        partialclosed: 'Partial Closed',
        partspickingcompleted: 'Parts Picking Completed',
        partspickinginitiated: 'Parts Picking Initiated',
        pending: 'Pending',
        ppapproved: 'PP Approved',
        pprejected: 'PP Rejected',
        ppssupervisorapproved: 'PPS Supervisor Approved',
        ppssupervisorrejected: 'PPS Supervisor Rejected',
        protol4approved: 'Proto L4 Approved',
        protol4rejected: 'Proto L4 Rejected',
        rejected: 'Rejected',
        relocated: 'Relocated',
        resent: 'Resent',
        scrapmoved: 'Scrap Moved',
        smapproved: 'SM Approved',
        smpartialapproved: 'SM Partial Approved',
        storeapproved: 'Store Approved',
        storerejected: 'Store Rejected',
        storesubmitted: 'Store Submitted',
        vehicleownerapproved: 'Vehicle Owner Approved' 
}

    var roleValue = ""
    if(roleMap.hasOwnProperty(key)){
        roleValue = roleMap[key]
    }else{
        roleValue = key
    }

    return roleValue
  }


StatusColor(key){

    var colorsMap = {
        "Aggregate Supervisor Approval Pending":'#ca9a0b',
        "Aggregate Supervisor Approved":'#ca9a0b',
        "Aggregate Supervisor Rejected":'red',
        "Awaiting Parts Return":'#ca9a0b',
        "Budget Approval Pending":'#ca9a0b',
        "Budget Approval Rejected":'red',
        "Completed" :'green',
        "Dispatch Pending":'#ca9a0b',
        "Form Resent":'#ca9a0b',
        "L2 Approval Pending" : '#ca9a0b',
        "L2 Approval Rejected" : 'red',
        "L4 Approval Pending":'#ca9a0b',
        "L4 Approval Rejected":'red',
        "L4 Rejected":'red',
        "L3 Approval Pending":'#ca9a0b',
        "L3 Approval Rejected":'red',
        "L3 Rejected":'red',
        "Date Changed by Requester L4 Approval Pending" : '#ca9a0b',
        "Date Changed by Vehicle Owner Approval Pending" : '#ca9a0b',
        "Date Changed by Aggregate Supervisor Approval Pending" : '#ca9a0b',
        "Date Changed by Vehicle HDT Supervisor Approval Pending" : '#ca9a0b',
        "Date Changed by Vehicle MDT Supervisor Approval Pending" : '#ca9a0b',
        "Date Changed by PPS Supervisor Approval Pending" : '#ca9a0b',
        "Deputy Proto L3 Approval Pending" : '#ca9a0b',
        "Deputy Proto L3 Approval Rejected" : 'red',    
        "Deputy Proto L3 Rejected" : 'red',    
        "Deputy Proto L4 Approval Pending" : '#ca9a0b',
        "Deputy Proto L4 Approval Rejected" : 'red',
        "Deputy Proto L4 Rejected" : 'red',
        "Dispatch L4 Approval Pending" : '#ca9a0b',
        "Form Deleted" : 'red',
        "Form Recalled" : '#ca9a0b',
        "IPL Dispatch Pending":'#ca9a0b',
        "IPL Processed Partial":'#ca9a0b',
        "Requester Acknowledge Pending":'#ca9a0b',
        "Requester L4 Approval Pending":'#ca9a0b',
        "Requester L4 Approval Rejected":'red',
        "Requester L4 Rejected":'red',
        "Requester L3 Approval Pending":'#ca9a0b',
        "Requester L3 Rejected":'red',
        "Requester L3 Approval Rejected":'red',
        "Requester Acknowledged":'#ca9a0b',
        "Location Updated Pending":'#ca9a0b',
        "Location Updated":'#ca9a0b',
        "Machine Shop Supervisor Approval Pending":'#ca9a0b',
        "Machine Shop Supervisor Approved":'#ca9a0b',
        "Machine Shop Supervisor Approval Rejected":'red',  
        "Scrap Certificate Upload Pending":'#ca9a0b',
        "Scrap Certificate Uploaded":'#ca9a0b',
        "SM Approval Pending":'#ca9a0b',
        "SM Processed Partial":'#ca9a0b',
        "Store Approval Pending":'#ca9a0b',
        "Store Approval Rejected":'red',
        "Store Receive Pending":'#ca9a0b',
        "Store Received":'#ca9a0b',
        "Store Location Update Pending":'#ca9a0b',
        "Partial Completed":'#ca9a0b',
        "Parts Returned":'#ca9a0b',
        "Packaging Initiate Pending":'#ca9a0b',
        "Packaging Initiated":'#ca9a0b',
        "Parts Picking Pending":'#ca9a0b',
        "Parts Picking Initiated":'#ca9a0b',
        "Parts Relocated":'#ca9a0b',
        "Parts Planner Approval Pending":'#ca9a0b',
        "Parts Planner Approval Rejected":'red',
        "Proto L3 Approval Pending":'#ca9a0b',
        "Proto L3 Approval Approved":'#ca9a0b',
        "Proto L3 Approval Rejected":'red',
        "Proto L3 Rejected":'red',
        "Proto L4 Approval Pending":'#ca9a0b',
        "Proto L4 Approval Approved":'#ca9a0b',
        "Proto L4 Approval Rejected":'red',
        "Proto L4 Rejected":'red',
        "PPS Supervisor Approval Pending":'#ca9a0b',
        "PPS Supervisor Approved":'#ca9a0b',
        "PPS Supervisor Rejected":'red',
        "Vehicle Owner Approval Pending":'#ca9a0b',
        "Vehicle HDT Supervisor Approval Pending":'#ca9a0b',
        "Vehicle HDT Supervisor Approved":'#ca9a0b',
        "Vehicle HDT Supervisor Rejected":'red',
        "Vehicle MDT Supervisor Approval Pending":'#ca9a0b',
        "Vehicle MDT Supervisor Approved":'#ca9a0b',
        "Vehicle MDT Supervisor Rejected":'red',
    }
    var colorsVal = "";
    if(colorsMap.hasOwnProperty(key)){
        colorsVal = colorsMap[key];
    }else{
        colorsVal = key;
    }

    return colorsVal;
}
UMCSColor(key){

    var colorsMap = {
        "Aggregate Supervisor Approval Pending":'#ca9a0b',
        "Aggregate Supervisor Approved":'#ca9a0b',
        "Aggregate Supervisor Rejected":'red',
        "Awaiting Parts Return":'#ca9a0b',
        "Budget Approval Pending":'#ca9a0b',
        "Budget Approval Rejected":'red',
        "Completed" :'green',
        "Dispatch Pending":'#ca9a0b',
        "Form Resent":'#ca9a0b',
        "L2 Approval Pending" : '#ca9a0b',
        "L2 Approval Rejected" : 'red',
        "L4 Approval Pending":'#ca9a0b',
        "L4 Approval Rejected":'red',
        "L4 Rejected":'red',
        "L3 Approval Pending":'#ca9a0b',
        "L3 Approval Rejected":'red',
        "L3 Rejected":'red',
        "Date Changed by Requester L4 Approval Pending" : '#ca9a0b',
        "Date Changed by Vehicle Owner Approval Pending" : '#ca9a0b',
        "Date Changed by Aggregate Supervisor Approval Pending" : '#ca9a0b',
        "Date Changed by Vehicle HDT Supervisor Approval Pending" : '#ca9a0b',
        "Date Changed by Vehicle MDT Supervisor Approval Pending" : '#ca9a0b',
        "Date Changed by PPS Supervisor Approval Pending" : '#ca9a0b',
        "Deputy Proto L3 Approval Pending" : '#ca9a0b',
        "Deputy Proto L3 Approval Rejected" : 'red',    
        "Deputy Proto L3 Rejected" : 'red',    
        "Deputy Proto L4 Approval Pending" : '#ca9a0b',
        "Deputy Proto L4 Approval Rejected" : 'red',
        "Deputy Proto L4 Rejected" : 'red',
        "Dispatch L4 Approval Pending" : '#ca9a0b',
        "Form Deleted" : 'red',
        "Form Recalled" : '#ca9a0b',
        "IPL Dispatch Pending":'#ca9a0b',
        "IPL Processed Partial":'#ca9a0b',
        "Requester Acknowledge Pending":'#ca9a0b',
        "Requester L4 Approval Pending":'#ca9a0b',
        "Requester L4 Approval Rejected":'red',
        "Requester L4 Rejected":'red',
        "Requester L3 Approval Pending":'#ca9a0b',
        "Requester L3 Rejected":'red',
        "Requester L3 Approval Rejected":'red',
        "Requester Acknowledged":'#ca9a0b',
        "Location Updated Pending":'#ca9a0b',
        "Location Updated":'#ca9a0b',
        "Machine Shop Supervisor Approval Pending":'#ca9a0b',
        "Machine Shop Supervisor Approved":'#ca9a0b',
        "Machine Shop Supervisor Approval Rejected":'red',  
        "Scrap Certificate Upload Pending":'#ca9a0b',
        "Scrap Certificate Uploaded":'#ca9a0b',
        "SM Approval Pending":'#ca9a0b',
        "SM Processed Partial":'#ca9a0b',
        "Store Approval Pending":'#ca9a0b',
        "Store Approval Rejected":'red',
        "Store Receive Pending":'#ca9a0b',
        "Store Received":'#ca9a0b',
        "Store Location Update Pending":'#ca9a0b',
        "Partial Completed":'#ca9a0b',
        "Parts Returned":'#ca9a0b',
        "Packaging Initiate Pending":'#ca9a0b',
        "Packaging Initiated":'#ca9a0b',
        "Parts Picking Pending":'#ca9a0b',
        "Parts Picking Initiated":'#ca9a0b',
        "Parts Relocated":'#ca9a0b',
        "Parts Planner Approval Pending":'#ca9a0b',
        "Parts Planner Approval Rejected":'red',
        "Proto L3 Approval Pending":'#ca9a0b',
        "Proto L3 Approval Approved":'#ca9a0b',
        "Proto L3 Approval Rejected":'red',
        "Proto L3 Rejected":'red',
        "Proto L4 Approval Pending":'#ca9a0b',
        "Proto L4 Approval Approved":'#ca9a0b',
        "Proto L4 Approval Rejected":'red',
        "Proto L4 Rejected":'red',
        "PPS Supervisor Approval Pending":'#ca9a0b',
        "PPS Supervisor Approved":'#ca9a0b',
        "PPS Supervisor Rejected":'red',
        "Vehicle Owner Approval Pending":'#ca9a0b',
        "Vehicle HDT Supervisor Approval Pending":'#ca9a0b',
        "Vehicle HDT Supervisor Approved":'#ca9a0b',
        "Vehicle HDT Supervisor Rejected":'red',
        "Vehicle MDT Supervisor Approval Pending":'#ca9a0b',
        "Vehicle MDT Supervisor Approved":'#ca9a0b',
        "Vehicle MDT Supervisor Rejected":'red',
    }
    var colorsVal = "";
    if(colorsMap.hasOwnProperty(key)){
        colorsVal = colorsMap[key];
    }else{
        colorsVal = key;
    }

    return colorsVal;
}
}