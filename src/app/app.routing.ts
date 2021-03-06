import { HomeComponent }    from './home/home.component';
import { NgModule }         from '@angular/core'
import { CommonModule, }    from '@angular/common'
import { BrowserModule }    from '@angular/platform-browser'
import { Routes, RouterModule } from '@angular/router'
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component'
import { AuthGuardService } from './auth-guard.service';
import { LoginComponent } from './login/login.component';
import { Services } from './services.service'
import { GedClientComponent } from './ged/ged-client/ged-client.component';
import { BillingComponent } from './services/billing/billing.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'services/ged/client', component: GedClientComponent, canActivate: [AuthGuardService] },
  { path: 'services/:apiKey/services', component: Services, canActivate: [AuthGuardService] },
  { path: 'services/:apiKey/billing', component: BillingComponent, canActivate: [AuthGuardService] },
  { path: '', component: HomeComponent, canActivate: [AuthGuardService] },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule'
      }]
  }

]

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [

  ],
})
export class AppRoutingModule { }
