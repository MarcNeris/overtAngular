

import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http'
import { RouterModule, Router, RouterOutlet } from '@angular/router'
import { AppRoutingModule } from './app.routing'
import { ComponentsModule } from './components/components.module'
import { AppComponent } from './app.component'
// import { HomeComponent } from './home/home.component'
// import { DashboardComponent } from './dashboard/dashboard.component'
// import { UserProfileComponent } from './user-profile/user-profile.component'
// import { TableListComponent } from './table-list/table-list.component'
// import { TypographyComponent } from './typography/typography.component'
// import { IconsComponent } from './icons/icons.component'
// import { MapsComponent } from './maps/maps.component'
// import { NotificationsComponent } from './notifications/notifications.component'
// import { UpgradeComponent } from './upgrade/upgrade.component'

import { FBServices } from './firebase.services'
import { APPFunctions } from './app.functions'
import { AuthGuardService } from './auth-guard.service'
import { Services } from './services.service'

import { AgmCoreModule } from '@agm/core'
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component'
// import { LoginComponent } from './login/login.component'
// import { LicenseComponent } from './license/license.component';
// import { TrackpointComponent } from './trackpoint/trackpoint.component'
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
//import { DataSource } from '@angular/cdk/table';
import { HttpClientModule } from '@angular/common/http';
import {
  MatPaginatorModule,
  MatSortModule,
  MatInputModule,
  MatSelectModule,
  MatCardModule,
  MatProgressSpinnerModule,
  MatMenuModule,
  MatIconModule,
  MatToolbarModule,
  MatButtonModule,
  MatFormFieldModule
} from '@angular/material';

import { NgxSoapModule } from 'ngx-soap';
import {MatDividerModule} from '@angular/material/divider'

@NgModule({
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    MatSelectModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    CdkTableModule,
    MatSortModule,
    NgxSoapModule,
    MatDividerModule,
    AgmCoreModule.forRoot({
      apiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
    })
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    Services,
    
  ],
  providers: [
    // LoginComponent,
    // LicenseComponent,
    // TrackpointComponent,
    FBServices,
    APPFunctions,
    AuthGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
