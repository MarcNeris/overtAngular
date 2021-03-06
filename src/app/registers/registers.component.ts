import { FBServices } from './../firebase.services';
import { APPFunctions } from './../app.functions';
import { AuthGuardService } from './../auth-guard.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import {
  MatTableDataSource,
  MatPaginator,
  MatSort
} from '@angular/material';
import * as moment from 'moment';
import { Router } from '@angular/router';


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
  isLoading: boolean = false
  clientDataSource: any
  showTableClient: boolean = false
  inviteDocumentoForm: FormGroup

  displayedColumnsClient: string[] = ['cnpj', 'nome']

  permissoes_ged: any
  lista_permissoes_ged: any[] = [
    { id: 'GED_LER_DOCUMENTO', nome: 'Ler Documento' },
    { id: 'GED_MOVER_DOCUMENTO', nome: 'Mover Documento' },
    { id: 'GED_EXCLUIR_DOCUMENTO', nome: 'Excluir Documento' },
    { id: 'GED_ENVIAR_DOCUMENTO', nome: 'Enviar Documento' }
  ];


  permissoes_documento: any
  lista_permissoes_documento: any[] = [
    { id: 'GED_LER_DOCUMENTO', nome: 'Ler Documento' },
    { id: 'GED_MOVER_DOCUMENTO', nome: 'Mover Documento' },
    { id: 'GED_EXCLUIR_DOCUMENTO', nome: 'Excluir Documento' },
    { id: 'GED_ENVIAR_DOCUMENTO', nome: 'Enviar Documento' }
  ];




  @ViewChild(MatSort) clientSort: MatSort
  @ViewChild(MatPaginator) clientPaginator: MatPaginator
  @ViewChild(MatPaginator) usersPaginator: MatPaginator

  constructor(
    public auth: AuthGuardService,
    public func: APPFunctions,
    public fbServices: FBServices,
    public router: Router
  ) { }
  /**
   * Lista Clientes
   */
  listarClientes() {
    var user = this.auth.getUser()
    this.isLoading = true
    new Promise(resolve => {
      if (user.empresa_ativa) {
        if (user.empresa_ativa._apiKey) {
          this.fbServices.DB.FB.ref('clients').child(user.empresa_ativa._apiKey.apiKey).once('value', clients => {
            if (clients.exists()) {
              this.showTableClient = true
              resolve(Object.values(clients.val()))
            }
          })
        }
      }
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
      this.func.importarCliente(this.func.toCnpjId(this.cnpj_cliente), user.empresa_ativa._apiKey.apiKey).then(result => {
        var res: any = result
        console.log(res)
        if (res.status == 'OK') {
          this.hasError = null
          this.hasSucces = `${res.cnpj} | ${res.fantasia} ${res.nome}`
          this.cnpj_cliente = res.cnpj
        } else {
          if (res.message) {
            this.hasSucces = null
            this.hasError = res.message
          }
        }
      }).then(() => {
        this.listarClientes()
      })
    } else {
      this.hasError = 'Informe o Cnpj'
    }
  }
  /**
   * Convida Usuários pelo email
   */
  permissoesGed() {
    if (this.email_usuario) {
      this.email_usuario = this.email_usuario.toLowerCase()
      if (this.func.isEmail(this.email_usuario)) {
        var user = this.auth.getUser()
        if (user.empresa_ativa._apiKey.apiKey) {
          var invite = this.fbServices.DB.FB.ref('invitations').child('users').child(this.func.toEmailId(this.email_usuario)).child(user.empresa_ativa._apiKey.apiKey)
          invite.child('invite').set({
            client: user.empresa_ativa.nome,
            cnpj: user.empresa_ativa.cnpj,
            apiKey: user.empresa_ativa._apiKey.apiKey,
            keyUserName: user.displayName,
            hasSend: false,
            userSaw: false,
            userAccepted: false,
            to_email: this.email_usuario,
            from_email: user.email,
          })
          invite.child('invite').child('permissions').remove()

          // invite.child('invite').child('permissions').set(this.permissoes_ged)
          this.permissoes_ged.forEach((element) => {
            invite.child('invite').child('permissions').child(element).set(true)
          })

          invite.child('log').child('ged').child(moment().format('YYYYMMDDHHmmss')).set({
            KeyUserUid: user.uid,
            keyUserName: user.displayName,
            email: user.email,
            datLog: moment().format('DD/MM/YYYY HH:mm:ss'),
            permissions: this.permissoes_ged
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
    } else {
      this.hasSucces = null
      this.hasError = 'Informe o email'
    }
  }

  ngOnInit() {

    var user: any = this.auth.getUser()
    if (user.isKeyUser) {
      this.listarClientes()
    } else {
      this.router.navigate(['/dashboard'])
    }

    this.inviteDocumentoForm = new FormGroup({
      email_usuario: new FormControl('', [Validators.required, Validators.email]),
      permissoes_ged: new FormControl('', [Validators.required]),
    })


  }

}
