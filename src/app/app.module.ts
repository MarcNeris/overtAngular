
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
  MatFormFieldModule,
  MatDialogModule,
  MatPaginatorIntl
  
} from '@angular/material';

import { NgxSoapModule } from 'ngx-soap';
import { MatDividerModule } from '@angular/material/divider';
import { LoginComponent } from './login/login.component';
import { GedClientComponent } from './ged/ged-client/ged-client.component';
import { BillingComponent } from './services/billing/billing.component';


export class MatPaginatorIntlBrl extends MatPaginatorIntl {
  itemsPerPageLabel = '';
  nextPageLabel     = 'Próxima';
  previousPageLabel = 'Anterior';

  getRangeLabel = function (page, pageSize, length) {
    if (length === 0 || pageSize === 0) {
      return '0 de ' + length;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;
    return startIndex + 1 + ' - ' + endIndex + ' de ' + length;
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
    BillingComponent
  ],
  providers: [
    FBServices,
    APPFunctions,
    AuthGuardService,
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlBrl}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
