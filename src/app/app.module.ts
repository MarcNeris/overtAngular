import { HomeComponent } from './home/home.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http'
import { RouterModule, Router, RouterOutlet } from '@angular/router'
import { AppRoutingModule } from './app.routing'
import { ComponentsModule } from './components/components.module'
import { AppComponent } from './app.component'

import { FBServices } from './firebase.services'
import { APPFunctions } from './app.functions'
import { AuthGuardService } from './auth-guard.service'
import { Services } from './services.service'
import { AlertDialog } from './mat-alert/mat-alert.componet';

import { AgmCoreModule } from '@agm/core'
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component'

import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';

import { HttpClientModule } from '@angular/common/http';

import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import {
  MatPaginatorModule,
  MatSortModule,
  MatInputModule,
  MatSelectModule,
  MatCardModule,
  MatProgressSpinnerModule,
  MatMenuModule,
  MatSidenavModule,
  MatIconModule,
  MatToolbarModule,
  MatButtonModule,
  MatFormFieldModule,
  MatDialogModule,
  MatPaginatorIntl,
  MatAutocompleteModule,
  MatListModule,
  MatBadgeModule

} from '@angular/material';

import { NgxSoapModule } from 'ngx-soap';
import { MatDividerModule } from '@angular/material/divider';
import { LoginComponent } from './login/login.component';
import { GedClientComponent } from './ged/ged-client/ged-client.component';
import { BillingComponent } from './services/billing/billing.component';

export class MatPaginatorIntlBrl extends MatPaginatorIntl {
  itemsPerPageLabel = ''
  nextPageLabel = 'Próxima'
  previousPageLabel = 'Anterior'
  firstPageLabel = 'Primeira página'
  lastPageLabel = 'Última página'

  getRangeLabel = (page, pageSize, length) => {
    if (length === 0 || pageSize === 0) {
      return '0 de ' + length
    }
    length = Math.max(length, 0)
    const startIndex = page * pageSize
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize
    return `${startIndex + 1} à ${endIndex} de ${length}`//startIndex + 1 + ' à ' + endIndex + ' de ' + length;
  };

}

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
    MatPaginatorModule,
    CdkTableModule,
    NgxSoapModule,
    MatDividerModule,
    MatDialogModule,
    MatTableModule,
    MatSortModule,
    MatSidenavModule,
    MatAutocompleteModule,
    MatListModule,
    MatBadgeModule,
    SweetAlert2Module.forRoot({
      buttonsStyling: false,
      customClass: 'modal-content',
      confirmButtonClass: 'mat-raised-button',
      cancelButtonClass: 'btn'
    }),
    AgmCoreModule.forRoot({
      apiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
    })
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    Services,
    AlertDialog,
    LoginComponent,
    GedClientComponent,
    BillingComponent,
    HomeComponent
  ],
  providers: [
    FBServices,
    APPFunctions,
    AuthGuardService,
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlBrl }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
