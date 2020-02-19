import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { StolistComponent } from './dashboard/stolist/stolist.component';
import { McslistComponent } from './dashboard/mcslist/mcslist.component';
import { McseditComponent } from './dashboard/mcsedit/mcsedit.component';

import { UmcslistComponent } from './dashboard/umcslist/umcslist.component';
import { StonewComponent } from './dashboard/stonew/stonew.component';
import { StoeditComponent } from './dashboard/stoedit/stoedit.component';
import { McsnewComponent } from './dashboard/mcsnew/mcsnew.component';
import { UmcsnewComponent } from './dashboard/umcsnew/umcsnew.component';
import { UmcseditComponent } from './dashboard/umcsedit/umcsedit.component';
import { NmcsuploadComponent } from './dashboard/nmcsupload/nmcsupload.component';
import { UcmsuploadComponent } from './dashboard/ucmsupload/ucmsupload.component';

import { ProtolistComponent } from './dashboard/protolist/protolist.component';
import { ProtonewComponent } from './dashboard/protonew/protonew.component';
import { StouploadComponent } from './dashboard/stoupload/stoupload.component';
import { PmworkreqnewComponent } from './dashboard/pmworkreqnew/pmworkreqnew.component';
import { PmworkreqlistComponent } from './dashboard/pmworkreqlist/pmworkreqlist.component';
import { VehiclesignoffnewComponent } from './dashboard/vehiclesignoffnew/vehiclesignoffnew.component';
import { VehiclesignofflistComponent } from './dashboard/vehiclesignofflist/vehiclesignofflist.component';
import { RetrofitmentnewComponent } from './dashboard/retrofitmentnew/retrofitmentnew.component';
import { RetrofitmentlistComponent } from './dashboard/retrofitmentlist/retrofitmentlist.component';
import { MaterialissueslipnewComponent } from './dashboard/materialissueslipnew/materialissueslipnew.component';
import { MaterialissuesliplistComponent } from './dashboard/materialissuesliplist/materialissuesliplist.component';
import { MaterialissueslipuploadComponent } from './dashboard/materialissueslipupload/materialissueslipupload.component';
import { MaterialissueslipeditComponent } from './dashboard/materialissueslipedit/materialissueslipedit.component';
import { FinasworknewComponent } from './dashboard/finasworknew/finasworknew.component';
import { FinasworklistComponent } from './dashboard/finasworklist/finasworklist.component';
import { FinaidgenerationnewComponent } from './dashboard/finaidgenerationnew/finaidgenerationnew.component';
import { FinaidgenerationlistComponent } from './dashboard/finaidgenerationlist/finaidgenerationlist.component';
import { MetricComponent } from './dashboard/metric/metric.component'
import { LoginComponent } from './login/login.component';
import { UsermanagementComponent } from './usermanagement/usermanagement.component';
import { DepartmentComponent } from './department/department.component';
import { TeamComponent } from './team/team.component';
import { UserComponent } from './user/user.component';
import { ApprovalComponent } from './approval/approval.component';
import { LocationApprovalComponent } from './location-approval/location-approval.component';
import { ProtoeditComponent } from './dashboard/protoedit/protoedit.component';
import { ProtoSupervisorComponent } from './dashboard/proto-supervisor/proto-supervisor.component';
import { ProtoSupervisortypeComponent } from './dashboard/proto-supervisortype/proto-supervisortype.component';
// import { ProtoComponent } from './dashboard/proto.component';
// import { ProtorequestComponent } from './protorequest/protorequest.component';
import { ProtousereditComponent } from './dashboard/protouseredit/protouseredit.component';
import { ProtosupervisorComponent } from './protosupervisor/protosupervisor.component';
import { ProtobcaComponent } from './protobca/protobca.component';
import { OfmViewComponent } from './dashboard/ofm-view/ofm-view.component';
import { MiseditComponent } from './dashboard/misedit/misedit.component';

import { PmworkreqeditComponent } from './dashboard/pmworkreqedit/pmworkreqedit.component';
import { PmwrApprovalComponent } from './approval/pmwr-approval/pmwr-approval.component';
import { PmworkSupervisorComponent } from './dashboard/pmwork-supervisor/pmwork-supervisor.component';
import { PmwrbcaComponent } from './pmwrbca/pmwrbca.component';
import { MaterialDisNewComponent } from './dashboard/material-dis-new/material-dis-new.component';
import { MaterialDisListComponent } from './dashboard/material-dis-list/material-dis-list.component';
import { TcplistComponent } from './dashboard/tcplist/tcplist.component';
import { TcpnewComponent } from './dashboard/tcpnew/tcpnew.component';
import { MisPatchApprovalComponent } from './approval/mis-patch-approval/mis-patch-approval.component';
import { ProtorecalleditComponent } from './dashboard/protorecalledit/protorecalledit.component';
import { ProtobcaviewComponent } from './protobcaview/protobcaview.component';
import { MaterialDisEditComponent } from './dashboard/material-dis-edit/material-dis-edit.component';
import { ProtoDashboardComponent } from './dashboard/proto-dashboard/proto-dashboard.component';
import { PmworkDashboardComponent } from './dashboard/pmwork-dashboard/pmwork-dashboard.component';
import { MaterialDashboardComponent } from './dashboard/material-dashboard/material-dashboard.component';
import { MaterialDisSignatureComponent } from './dashboard/material-dis-signature/material-dis-signature.component';
import { NmcsDashboardComponent } from './dashboard/nmcs-dashboard/nmcs-dashboard.component';
import { UmcsDashboardComponent } from './dashboard/umcs-dashboard/umcs-dashboard.component';
import { MaterialDispatchDashboardComponent } from './dashboard/material-dispatch-dashboard/material-dispatch-dashboard.component';

import { StoDashboardComponent } from './dashboard/sto-dashboard/sto-dashboard.component';
import { TcpDashboardComponent } from './dashboard/tcp-dashboard/tcp-dashboard.component';
import { HomeComponent } from './home/home.component';
import { StoRecallComponent } from './dashboard/sto-recall/sto-recall.component';
import { NmcsRecallComponent } from './dashboard/nmcs-recall/nmcs-recall.component';
import { UmcsRecallComponent } from './dashboard/umcs-recall/umcs-recall.component';
import { PmworkRecalledComponent } from './dashboard/pmwork-recalled/pmwork-recalled.component';
import { PmwrbcaviewComponent } from './pmwrbcaview/pmwrbcaview.component';
import { MaterialDisUploadComponent } from './dashboard/material-dis-upload/material-dis-upload.component';
import { PmwruploadComponent } from './dashboard/pmwrupload/pmwrupload.component';

import { MaterialDisRecallComponent } from './dashboard/material-dis-recall/material-dis-recall.component';
const routes: Routes = [{ path: '', component: LoginComponent },
{ path: 'login', component: LoginComponent },
{ path: 'home', component: HomeComponent },
{path:'approval/:token',component:ApprovalComponent},
{path:'location_approval',component:LocationApprovalComponent},
{ path: 'dashboard', component: DashboardComponent,
  children:[
    { path: 'metric', component: MetricComponent},
    { path: 'stolist', component: StolistComponent},
    { path: 'stonew', component: StonewComponent},
    { path: 'stoedit', component: StoeditComponent},
    { path: 'mcslist', component: McslistComponent},
    { path: 'mcsnew', component: McsnewComponent},
    { path: 'mcsedit', component: McseditComponent},
    { path: 'umcslist', component: UmcslistComponent},
    { path: 'umcsnew', component: UmcsnewComponent},
    { path: 'umcsedit', component: UmcseditComponent},
    { path: 'nmcsupload', component: NmcsuploadComponent},
    { path: 'stoupload', component: StouploadComponent},
    { path: 'umcsupload', component: UcmsuploadComponent},
    { path: 'protonew', component: ProtonewComponent},
    { path: 'protolist', component: ProtolistComponent},
    { path: 'pmworkreqnew', component: PmworkreqnewComponent},
    { path: 'pmworkreqlist', component: PmworkreqlistComponent},
    { path: 'pmworkreqedit', component: PmworkreqeditComponent},
    { path: 'pmwrupload', component: PmwruploadComponent},
    { path: 'pmw-supervisor', component: PmworkSupervisorComponent},
    { path: 'vehiclesignoffnew', component: VehiclesignoffnewComponent},
    { path: 'vehiclesignofflist', component: VehiclesignofflistComponent},
    { path: 'retrofitmentnew', component: RetrofitmentnewComponent},
    { path: 'retrofitmentlist', component: RetrofitmentlistComponent},
    { path: 'materialissueslipnew', component: MaterialissueslipnewComponent},
    { path: 'materialissuesliplist', component: MaterialissuesliplistComponent},
    { path: 'materialissueslipupload', component: MaterialissueslipuploadComponent},
    { path: 'materialissueslipedit', component: MaterialissueslipeditComponent},
    { path: 'finasworknew', component: FinasworknewComponent},
    { path: 'finasworklist', component: FinasworklistComponent},
    { path: 'finaidgenerationnew', component: FinaidgenerationnewComponent},
    { path: 'finaidgenerationlist', component: FinaidgenerationlistComponent},
    { path: 'protoedit', component: ProtoeditComponent},
    { path: 'protouseredit', component: ProtousereditComponent},
    { path: 'protosupervisor', component: ProtoSupervisorComponent},
    { path: 'protosupervisortype', component: ProtoSupervisortypeComponent},
    { path: 'metric', component: MetricComponent},
    { path: 'ofm', component: OfmViewComponent},
    { path: 'misedit', component: MiseditComponent},
    { path: 'approve', component: PmwrApprovalComponent},
    
    
    { path: 'matdisnew', component: MaterialDisNewComponent},   
    { path: 'matdisupload', component: MaterialDisUploadComponent},
    { path: 'matdislist', component: MaterialDisListComponent},   
    { path: 'matdisnew', component: MaterialDisNewComponent },
    { path: 'matdislist', component: MaterialDisListComponent },
    { path: 'tcplist', component: TcplistComponent },
    { path: 'tcpnew', component: TcpnewComponent },
    { path: 'protorecalledit', component: ProtorecalleditComponent},    
    { path: 'matdisedit', component: MaterialDisEditComponent},    
    { path: 'protodashboard', component: ProtoDashboardComponent},    
    { path: 'pmworkdashboard', component: PmworkDashboardComponent},  
    { path: 'materialdashboard', component: MaterialDashboardComponent},  
    { path: 'nmcs-dashbaord', component: NmcsDashboardComponent},
    { path: 'umcs-dashbaord', component: UmcsDashboardComponent},
    { path: 'material-dispatch', component: MaterialDispatchDashboardComponent},
    { path: 'material-dispatch-signatue', component: MaterialDisSignatureComponent},
    
    { path: 'sto-dashboard', component: StoDashboardComponent},
    { path: 'tcp-dashboard', component: TcpDashboardComponent},
    { path: 'sto-recall', component: StoRecallComponent},
    { path: 'nmcs-recall', component: NmcsRecallComponent},
    { path: 'umcs-recall', component: UmcsRecallComponent},
    { path: 'pmwr-recall', component: PmworkRecalledComponent},

    
    { path: 'material-dis-recall', component: MaterialDisRecallComponent},
    //MetricComponent
    {
      path: 'usermanagement', component: UsermanagementComponent,
      children: [
        { path: 'user', component: UserComponent },
        { path: 'department', component: DepartmentComponent },
        { path: 'team', component: TeamComponent },


      ]
    },
  ]
},
{ path: 'protobca', component: ProtobcaComponent},
{ path: 'protosupervisor', component: ProtosupervisorComponent},
{ path: 'protobcaview', component: ProtobcaviewComponent}, 
{ path: 'pmwrbca', component: PmwrbcaComponent},
{ path: 'pmwrView', component: PmwrbcaviewComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
