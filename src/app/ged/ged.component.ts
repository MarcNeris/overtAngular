import { FBServices } from './../firebase.services';
import { AuthGuardService } from 'app/auth-guard.service';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

export interface clientData {
  cnpj: string;
  nome: string;
  fantasia: string;
}

@Component({
  selector: 'app-ged',
  templateUrl: './ged.component.html',
  styleUrls: ['./ged.component.scss']
})

export class GedComponent implements OnInit {

  @ViewChild(MatPaginator) clientPaginator: MatPaginator
  @ViewChild(MatSort) clientSort: MatSort

  displayedColumnsClient: string[] = ['cnpj', 'nome', 'fantasia', 'actions']
  isLoading: boolean = false
  client: any = null

  clientDataSource: MatTableDataSource<clientData>

  constructor(
    private fbServices: FBServices,
    private auth: AuthGuardService
  ) { }

  fnGedUnsetClient() {
    this.client = null
  }

  fnGedSetClient(client: object) {
    this.client = client
    console.log(client)
  }

  async getClient() {//enviar para o functions
    var clientes: any
    var user = this.auth.getUser()
    if (user.empresa_ativa) {
      if (user.empresa_ativa._apiKey) {
        await this.fbServices.DB.FB.ref('clients').child(user.empresa_ativa._apiKey.apiKey).once('value', clients => {
          if (clients.exists()) {
            clientes = Object.values(clients.val())
          }
        })
      }
    }
    return clientes
  }


  /**
   * Filtrar dados na tabela
   * @param filterValue 
   */
  applyFilter(filterValue: string) {
    this.clientDataSource.filter = filterValue.trim().toLowerCase();

    if (this.clientDataSource.paginator) {
      this.clientDataSource.paginator.firstPage();
    }
  }


  ngAfterViewInit() {

  }





  ngOnInit() {

   



    this.getClient().then(clientes => {
      this.clientDataSource = new MatTableDataSource(clientes)
      this.clientDataSource.sort = this.clientSort
      this.clientDataSource.paginator = this.clientPaginator
    })
  }

}
