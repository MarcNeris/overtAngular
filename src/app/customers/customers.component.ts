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

  // displayedColumns: string[] = ['position'];
  // dataSource = new MatTableDataSource(ELEMENT_DATA);

  displayedColumns: string[] = ['cnpj', 'nome', 'email']
  dataSource: any
  customers: any
  empresaAtiva: any

  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort

  constructor(
    private fbServices: FBServices,
    private func: APPFunctions,
  ) { }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async fnGetCustomers(customers: object) {
    var data = []
    for (let customer in customers) {
      if (customers[customer].sitUsu == true) {
        await this.fbServices.DB.FB.ref('customers').child(customers[customer].cnpj).once('value', customer => {
          if (customer.exists()) {
            data.push(customer.val())
          }
        })
      }
    }
    return data
  }

  fnAtivarEmpresa(empresa: object): void {
    this.fbServices.DB.FB.ref('users').child(this.fbServices.currentUser().uid).child('customers/empresaAtiva').set(empresa)
    this.empresaAtiva = empresa
    let empresaAtiva = this.func.encrypt(JSON.stringify(empresa))
    this.fbServices.DB.LS.empresaAtiva = empresaAtiva
  }



  async fnTableCustomers() {

    if (this.fbServices.DB.LS.customers != undefined) {
      var customers: object = JSON.parse(this.func.decrypt(this.fbServices.DB.LS.customers))

      var dataSource = await this.fnGetCustomers(customers)
    } else {
      var dataSource = []
    }

    this.dataSource = new MatTableDataSource(dataSource)
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
  }

  ngAfterViewInit() {
  }

  ngOnInit() {

    this.fbServices.canLoad()
    
    this.fnTableCustomers()
    
  }

}
