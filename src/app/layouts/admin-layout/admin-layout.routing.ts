import { Routes }                           from '@angular/router';
import { RegistersComponent }               from './../../registers/registers.component';
import { AuthGuardService }                 from './../../auth-guard.service';
import { DashboardComponent }               from '../../dashboard/dashboard.component';
import { UserProfileComponent }             from '../../user-profile/user-profile.component';
import { TableListComponent }               from '../../table-list/table-list.component';
import { TypographyComponent }              from '../../typography/typography.component';
import { IconsComponent }                   from '../../icons/icons.component';
import { MapsComponent }                    from '../../maps/maps.component';
import { NotificationsComponent }           from '../../notifications/notifications.component';
import { UpgradeComponent }                 from '../../upgrade/upgrade.component';
import { LicenseComponent }                 from 'app/license/license.component';
import { TrackpointComponent }              from 'app/trackpoint/trackpoint.component';
import { CustomersComponent }               from 'app/customers/customers.component';
import { LayoffComponent }                  from 'app/layoff/layoff.component';
import { MoodsComponent }                   from 'app/moods/moods.component';
import { SocialComponent }                  from 'app/social/social.component';
import { GedComponent }                     from 'app/ged/ged.component';
import { GedSettingsComponent }             from 'app/ged/ged-settings/ged-settings.component';
import { InvitationsComponent }             from 'app/invitations/invitations.component';
import { GedPermissionsComponent }          from 'app/ged-permissions/ged-permissions.component';


export const AdminLayoutRoutes: Routes = [
    { path: '', component: DashboardComponent, canActivate: [AuthGuardService] },
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
    { path: 'ged-permissions', component: GedPermissionsComponent, canActivate: [AuthGuardService] },
    { path: 'registers', component: RegistersComponent, canActivate: [AuthGuardService] },
    { path: 'invitations', component: InvitationsComponent, canActivate: [AuthGuardService] },
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
