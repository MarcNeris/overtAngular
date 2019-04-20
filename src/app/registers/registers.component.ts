import { FBServices } from './../firebase.services';
import { APPFunctions } from './../app.functions';
import { AuthGuardService } from './../auth-guard.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MatTableDataSource,
  MatPaginator,
  MatSort
} from '@angular/material';
import * as moment from 'moment';


@Component({
  selector: 'app-registers',
  templateUrl: './registers.component.html',
  styleUrls: ['./registers.component.scss']
})


export class RegistersComponent implements OnInit {
  cnpj_cliente: string
  email_usuario: string
  hasSucces: any = null
  hasError: any = null
  isLoading:boolean = false
  clientDataSource: any
  showTableClient: boolean = false

  displayedColumnsClient: string[] = ['cnpj', 'nome']

  @ViewChild(MatSort) clientSort: MatSort
  @ViewChild(MatPaginator) clientPaginator: MatPaginator
  @ViewChild(MatPaginator) usersPaginator: MatPaginator

  constructor(
    public auth: AuthGuardService,
    public func: APPFunctions,
    public fbServices: FBServices
  ) { }
  /**
   * 
   */
  listarClientes() {
    this.isLoading = true
    var user = this.auth.getUser()
    new Promise(resolve => {
      this.fbServices.DB.FB.ref('clients').child(user.empresa_ativa.settings.apiKey).once('value', clients => {
        if (clients.exists()) {
          this.showTableClient = true
          resolve(Object.values(clients.val()))
        }
      })
    }).then(result => {
      this.isLoading = false
      var dataSource: any = result
      this.clientDataSource = new MatTableDataSource(dataSource)
      this.clientDataSource.sort = this.clientSort
      this.clientDataSource.paginator = this.clientPaginator
    })

  }

  applyFilter(filterValue: string) {
    this.clientDataSource.filter = filterValue.trim().toLowerCase();
  }



  /**
   * Importa Clientes Pelo CNPJ
   */
  importarCliente() {
    if (this.cnpj_cliente) {
      var user = this.auth.getUser()
      this.func.importarCliente(this.func.toCnpjId(this.cnpj_cliente), user.empresa_ativa.settings.apiKey).then(result => {
        var res: any = result
        if (res.status == 'OK') {
          this.hasError = null
          this.hasSucces = `${res.cnpj} | ${res.fantasia} ${res.nome}`
        } else {
          if (res.message) {
            this.hasSucces = null
            this.hasError = res.message
          }
        }
      }).then(()=>{
        this.listarClientes()
      })
    } else {
      this.hasError = 'Informe o Cnpj'
    }
  }
  /**
   * Importa Usuários pelo Email
   */
  convidarUsuarios() {
    if (this.email_usuario) {
      if (this.func.isEmail(this.email_usuario)) {
        var user = this.auth.getUser()

        if (user.empresa_ativa.settings.apiKey) {

          this.fbServices.DB.FB.ref('system').child('users').child(this.func.toEmailId(this.email_usuario)).child(user.empresa_ativa.settings.apiKey).update({
            email_enviado: false,

            permissions: {
              ged: {
                HAS_USER: false,
                LER_DOCUMENTOS: false,
                EDITAR_DOCUMENTOS: false,
                ENVIAR_DOCUMENTOS: false,
                REMOVER_DOCUMENTOS: false,
              }
            },
            log: {
              [moment().format('YYYYMMDDHHmmss')]: {
                KeyUser: user.uid,
                name: user.displayName,
                email: user.email,
                datLog: moment().format('DD/MM/YYYY HH:mm:ss')
              }
            },
            cnpj: this.func.toCnpjId(user.empresa_ativa.cnpj),
            nome: user.empresa_ativa.nome
          })
          this.hasError = null
          this.hasSucces = `${this.email_usuario} foi convidado!`
        } else {
          this.hasSucces = null
          this.hasError = `Você não tem permissão para fazer convites nessa empresa.`
        }
      } else {
        this.hasError = `${this.email_usuario} não foi considerado um email válido.`
        this.hasSucces = null
      }

      // var user = this.auth.getUser()
      // this.fbServices.DB.FB.ref('invitations').child(this.email_usuario).child(user.empresa_ativa.settings.apiKey).set('ok')
      // console.log(this.email_usuario)

    } else {
      this.hasSucces = null
      this.hasError = 'Informe o email'
    }
  }

  ngOnInit() {
    this.listarClientes()
    var user = this.auth.getUser()
    console.log(user)
  }

}
