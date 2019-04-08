import { AuthGuardService } from './../auth-guard.service';
import { APPFunctions } from './../app.functions';
import { FBServices } from './../firebase.services';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})


export class CustomersComponent implements OnInit {

  displayedColumns: string[] = ['cnpj', 'nome', 'email']
  dataSource: any
  customers: any
  empresaAtiva: any

  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort

  constructor(
    private fbServices: FBServices,
    private func: APPFunctions,
    private auth: AuthGuardService
  ) {

  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase()
  }

  fnAtivarEmpresa(empresa: object): void {
    this.fbServices.DB.FB.ref('users').child(this.auth.getUid()).child('http/empresa_ativa').set(empresa)
  }

  fnTableCustomers() {
    this.fbServices.fnGetCustomers(this.auth.getUser()).then(customers => {
      if (customers) {
        var dataSource: any = customers
        this.dataSource = new MatTableDataSource(dataSource)
        this.dataSource.paginator = this.paginator
        this.dataSource.sort = this.sort
      }
    })
  }

  ngAfterViewInit() {


  }

  ngOnInit() {

    this.fnTableCustomers()

  }

}
