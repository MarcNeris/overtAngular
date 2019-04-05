import { AuthGuardService } from './../../auth-guard.service';
//import { FBServices } from './../../firebase.services';
import { Routes } from '@angular/router';
import { LoginComponent } from './../../login/login.component';
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
import { TrackpointMeComponent } from 'app/trackpoint-me/trackpoint-me.component';
import { CustomersComponent } from 'app/customers/customers.component';
import { LayoffComponent } from 'app/layoff/layoff.component';
import { MoodsComponent } from 'app/moods/moods.component';
import { SocialComponent } from 'app/social/social.component';
//import { ServicesComponent } from './../../services/services.component';


export const AdminLayoutRoutes: Routes = [
    // {
    //   path: '',
    //   children: [ {
    //     path: 'dashboard',
    //     component: DashboardComponent
    // }]}, {
    // path: '',
    // children: [ {
    //   path: 'userprofile',
    //   component: UserProfileComponent
    // }]
    // }, {
    //   path: '',
    //   children: [ {
    //     path: 'icons',
    //     component: IconsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'notifications',
    //         component: NotificationsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'maps',
    //         component: MapsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'typography',
    //         component: TypographyComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'upgrade',
    //         component: UpgradeComponent
    //     }]
    // }
    { path: '',               component: HomeComponent},
    { path: 'login',          component: LoginComponent },
    { path: 'dashboard',      component: DashboardComponent, canActivate: [AuthGuardService]},
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'table-list',     component: TableListComponent },
    { path: 'typography',     component: TypographyComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    { path: 'notifications',  component: NotificationsComponent },
    { path: 'upgrade',        component: UpgradeComponent },
    { path: 'licence',        component: LicenseComponent },
    { path: 'trackpoint',     component: TrackpointComponent, canActivate: [AuthGuardService]},
    { path: 'trackpoint/me',  component: TrackpointMeComponent, canActivate: [AuthGuardService]},
    { path: 'customers',      component: CustomersComponent, canActivate: [AuthGuardService]},
    { path: 'layoff',         component: LayoffComponent, canActivate: [AuthGuardService]},
    { path: 'moods',          component: MoodsComponent, canActivate: [AuthGuardService]},
    { path: 'social',         component: SocialComponent, canActivate: [AuthGuardService]},
    //{ path: 'services',       component: ServicesComponent }
];
