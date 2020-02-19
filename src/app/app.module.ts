import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule, MatRadioModule } from '@angular/material';
import { NotifierModule } from 'angular-notifier';
import { HighchartsChartModule } from 'highcharts-angular';
import { ChartModule,HIGHCHARTS_MODULES } from 'angular-highcharts';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { StolistComponent } from './dashboard/stolist/stolist.component';
import { StonewComponent } from './dashboard/stonew/stonew.component';
import { McslistComponent } from './dashboard/mcslist/mcslist.component';
import { McsnewComponent } from './dashboard/mcsnew/mcsnew.component';
import { UmcslistComponent } from './dashboard/umcslist/umcslist.component';
import { UmcsnewComponent } from './dashboard/umcsnew/umcsnew.component';
import { UsermanagementComponent } from './usermanagement/usermanagement.component';
import { DepartmentComponent } from './department/department.component';
import { TeamComponent } from './team/team.component';
import { UserComponent } from './user/user.component';
import { ApprovalComponent } from './approval/approval.component';
import { LocationApprovalComponent } from './location-approval/location-approval.component';
import { UmcseditComponent } from './dashboard/umcsedit/umcsedit.component';
import { UmcsApprovalComponent } from './approval/umcs-approval/umcs-approval.component';
import { NmcsApprovalComponent } from './approval/nmcs-approval/nmcs-approval.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { McseditComponent } from './dashboard/mcsedit/mcsedit.component';
import { DotComponent } from './components/dot.component';
import { StatusUpdateComponent } from './components/status-update.component';
import { ErrMsgComponent } from './components/errMsg.component';
import { TextInputComponent } from './components/input-field/text-input.component';
import { NumberInputComponent } from './components/input-field/number-input.component';
import { DisabledInputComponent } from './components/input-field/disabled-input.component';
import { NmcsuploadComponent } from './dashboard/nmcsupload/nmcsupload.component';
import { UcmsuploadComponent } from './dashboard/ucmsupload/ucmsupload.component';
import { StoeditComponent } from './dashboard/stoedit/stoedit.component';
import { StoApprovalComponent } from './approval/sto-approval/sto-approval.component'
import { ProtolistComponent } from './dashboard/protolist/protolist.component';
import { ProtonewComponent } from './dashboard/protonew/protonew.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { MetricComponent } from './dashboard/metric/metric.component';
import { ReportsComponent } from './reports/reports.component';
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
import { ProtoApprovalComponent } from './approval/proto-approval/proto-approval.component';
import { ViewarrayComponent } from './viewarray/viewarray.component';
import { ProtoeditComponent } from './dashboard/protoedit/protoedit.component';
import { ProtousereditComponent } from './dashboard/protouseredit/protouseredit.component';
import { ProtobcaComponent } from './protobca/protobca.component';
import { ProtosupervisorComponent } from './protosupervisor/protosupervisor.component';
import { ProtoSupervisorComponent } from './dashboard/proto-supervisor/proto-supervisor.component';
import { ProtoSupervisortypeComponent } from './dashboard/proto-supervisortype/proto-supervisortype.component';
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

import * as more from 'highcharts/highcharts-more.src';
import * as exporting from 'highcharts/modules/exporting.src';
import { PmworkDashboardComponent } from './dashboard/pmwork-dashboard/pmwork-dashboard.component';
import { MaterialDashboardComponent } from './dashboard/material-dashboard/material-dashboard.component';
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
import { MaterialDisRecallComponent } from './dashboard/material-dis-recall/material-dis-recall.component';
import { MaterialDisSignatureComponent } from './dashboard/material-dis-signature/material-dis-signature.component';
import { PmwrbcaviewComponent } from './pmwrbcaview/pmwrbcaview.component';
import { MaterialDisUploadComponent } from './dashboard/material-dis-upload/material-dis-upload.component';
import { PmwruploadComponent } from './dashboard/pmwrupload/pmwrupload.component';
import { RetrofitmentReportComponent } from './components/retrofitment-report/retrofitment-report.component';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    StolistComponent,
    StonewComponent,
    McslistComponent,
    McsnewComponent,
    UmcslistComponent,
    UmcsnewComponent,
    UsermanagementComponent,
    DepartmentComponent,
    TeamComponent,
    UserComponent,
    ApprovalComponent,
    LocationApprovalComponent,
    UmcseditComponent,
    UmcsApprovalComponent,
    NmcsApprovalComponent,
    SpinnerComponent,
    McseditComponent,
    DotComponent,
    StatusUpdateComponent,
    ErrMsgComponent,
    TextInputComponent,
    NumberInputComponent,
    NmcsuploadComponent,
    UcmsuploadComponent,
    StoeditComponent,
    StoApprovalComponent,
    ProtolistComponent,
    ProtonewComponent,
    MetricComponent,
    ReportsComponent,
    StouploadComponent,
    PmworkreqnewComponent,
    PmworkreqlistComponent,
    VehiclesignoffnewComponent,
    VehiclesignofflistComponent,
    RetrofitmentnewComponent,
    RetrofitmentlistComponent,
    MaterialissueslipnewComponent,
    MaterialissuesliplistComponent,
    FinasworknewComponent,
    FinasworklistComponent,
    FinaidgenerationnewComponent,
    FinaidgenerationlistComponent,
    ProtoApprovalComponent,
    ViewarrayComponent,
    ProtoeditComponent,
    ProtousereditComponent,
    ProtobcaComponent,
    MaterialissueslipuploadComponent,
    MaterialissueslipeditComponent,
    ProtosupervisorComponent,
    ProtoSupervisorComponent,
    ProtoSupervisortypeComponent,
    OfmViewComponent,
    MiseditComponent,
    PmworkreqeditComponent,
    PmwrApprovalComponent,
    PmworkSupervisorComponent,
    PmwrbcaComponent,
    MaterialDisNewComponent,
    MaterialDisListComponent,
    TcplistComponent, 
    TcpnewComponent,
    MisPatchApprovalComponent,
    ProtorecalleditComponent,
    ProtobcaviewComponent,
    MaterialDisEditComponent,
    DisabledInputComponent,
    ProtoDashboardComponent,
    PmworkDashboardComponent,
    MaterialDashboardComponent,
    MaterialDisSignatureComponent,
    NmcsDashboardComponent,
    UmcsDashboardComponent,
    MaterialDispatchDashboardComponent,
    
    StoDashboardComponent,
    TcpDashboardComponent,
    HomeComponent,
    StoRecallComponent,
    NmcsRecallComponent,
    UmcsRecallComponent,
    PmworkRecalledComponent,
    MaterialDisRecallComponent,
    PmwrbcaviewComponent,
    MaterialDisUploadComponent,
    PmwruploadComponent,
    RetrofitmentReportComponent
  ],
  imports: [
    NgxPaginationModule,
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatRadioModule,
    MatCheckboxModule,
    NotifierModule,
    ChartModule,
    HighchartsChartModule,
    BsDatepickerModule.forRoot(),
    NgMultiSelectDropDownModule

  ],
  providers: [
    { provide: HIGHCHARTS_MODULES, useFactory: () => [ more, exporting ] }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
