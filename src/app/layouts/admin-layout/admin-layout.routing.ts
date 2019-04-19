import { RegistersComponent } from './../../registers/registers.component';
import { AuthGuardService } from './../../auth-guard.service';
import { Routes } from '@angular/router';
// import { LoginComponent } from './../../login/login.component';
import { HomeComponent } from '../../home/home.component';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { LicenseComponent } from 'app/license/license.component';
import { TrackpointComponent } from 'app/trackpoint/trackpoint.component';
import { CustomersComponent } from 'app/customers/customers.component';
import { LayoffComponent } from 'app/layoff/layoff.component';
import { MoodsComponent } from 'app/moods/moods.component';
import { SocialComponent } from 'app/social/social.component';
import { GedComponent } from 'app/ged/ged.component';
import { GedSettingsComponent } from 'app/ged/ged-settings/ged-settings.component';


export const AdminLayoutRoutes: Routes = [
    
    { path: '', component: HomeComponent, canActivate: [AuthGuardService] },
    // { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService] },
    { path: 'user-profile', component: UserProfileComponent },
    { path: 'table-list', component: TableListComponent },
    { path: 'typography', component: TypographyComponent },
    { path: 'icons', component: IconsComponent },
    { path: 'maps', component: MapsComponent },
    { path: 'notifications', component: NotificationsComponent },
    { path: 'upgrade', component: UpgradeComponent },
    { path: 'licence', component: LicenseComponent },
    { path: 'trackpoint', component: TrackpointComponent, canActivate: [AuthGuardService] },
    { path: 'customers', component: CustomersComponent, canActivate: [AuthGuardService] },
    { path: 'layoff', component: LayoffComponent, canActivate: [AuthGuardService] },
    { path: 'moods', component: MoodsComponent, canActivate: [AuthGuardService] },
    { path: 'social', component: SocialComponent, canActivate: [AuthGuardService] },
    { path: 'ged', component: GedComponent, canActivate: [AuthGuardService] },
    { path: 'ged-settings', component: GedSettingsComponent, canActivate: [AuthGuardService] },
    { path: 'registers', component: RegistersComponent, canActivate: [AuthGuardService] },
    // {
    //     path: 'ged',
    //     children: [
    //         {
    //             path: 'settings',
    //             component: GedSettingsComponent
    //         },
    //         {
    //             path: 'upload',
    //             component: UpgradeComponent
    //         }
    //     ]
    // },
];
