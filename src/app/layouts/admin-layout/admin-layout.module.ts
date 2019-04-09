
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';

import {
  MatButtonModule,
  MatInputModule,
  MatRippleModule,
  MatFormFieldModule,
  MatTooltipModule,
  MatSelectModule,
  MatPaginatorModule,
  MatSortModule,
  MatCardModule,
  MatProgressSpinnerModule,
  MatMenuModule,
  MatIconModule,
  MatTableModule,
  MatToolbarModule,
  MatDatepickerModule,
  MatNativeDateModule,
  
  
} from '@angular/material';

import { MatMomentDateModule } from "@angular/material-moment-adapter";

//Incluir Páginas
import { HomeComponent } from '../../home/home.component';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { LoginComponent } from './../../login/login.component'
import { LicenseComponent } from 'app/license/license.component'
import { TrackpointComponent } from 'app/trackpoint/trackpoint.component'
import { CustomersComponent } from 'app/customers/customers.component';
import { LayoffComponent } from 'app/layoff/layoff.component';
import { MoodsComponent } from 'app/moods/moods.component';
import { SocialComponent } from 'app/social/social.component';
import { TrackpointMeComponent } from 'app/trackpoint-me/trackpoint-me.component';
//import { ServicesComponent } from 'app/services/services.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    ReactiveFormsModule,
  ],
  declarations: [
    HomeComponent,
    DashboardComponent,
    UserProfileComponent,
    TableListComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
    UpgradeComponent,
    LoginComponent,
    LicenseComponent,
    TrackpointComponent,
    CustomersComponent,
    LayoffComponent,
    MoodsComponent,
    SocialComponent,
    TrackpointMeComponent
  ]
})

export class AdminLayoutModule {}
