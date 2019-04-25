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

  fnAtivarEmpresa(empresa_ativa: any): void {
    this.fbServices.DB.FB.ref('_apiKey').child(this.func.toCnpjId(empresa_ativa.cnpj)).once('value', _apiKey => {
      if (_apiKey.exists()) {
        empresa_ativa._apiKey = _apiKey.val()
        document.querySelector('.empresaAtiva').innerHTML = `${empresa_ativa.cnpj} | ${empresa_ativa.nome}`
        this.empresaAtiva = empresa_ativa
        this.fbServices.DB.FB.ref('users').child(this.auth.getUid()).child('http/empresa_ativa').set(this.empresaAtiva).then(() =>
          this.fbServices.DB.LS.empresa_ativa = JSON.stringify(this.empresaAtiva).encrypt()
        )
      }
    })
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
