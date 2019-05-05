import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FBServices } from './../firebase.services';
import { APPFunctions } from './../app.functions';
import { AuthGuardService } from './../auth-guard.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import {
  MatTableDataSource,
  MatPaginator,
  MatSort
} from '@angular/material';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ged-permissions',
  templateUrl: './ged-permissions.component.html',
  styleUrls: ['./ged-permissions.component.scss']
})

export class GedPermissionsComponent implements OnInit {
  user: any = {
    email: '',
    displayName: ''
  }

  invitations: any = []


  cnpj_cliente: string
  client: any = null
  email_usuario: string
  hasSucces: any = null
  hasError: any = null
  isLoading: boolean = false
  showTableClient: boolean = false
  inviteDocumentoForm: FormGroup

  clientDataSource: any
  displayedColumnsClient: string[] = ['cnpj', 'nome', 'fantasia', 'actions']

  // permissionsDataSource: any = new MatTableDataSource()
  // displayedColumnsPermissions: string[] = ['cnpj', 'nome', 'permission']

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
    public changeDetectorRefs: ChangeDetectorRef,
    public fbServices: FBServices,
    public router: Router
  ) {
    this.user = this.auth.getUser()
  }
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

  fnUnsetClient() {
    this.listarClientes()
    this.client = null
  }

  fnSetClient(client: object) {
    this.client = client
    this.getInvitations(client)
  }

  fnSubscribePermission(client) {
    console.log(client)
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
          var Moment = moment()
          invite.child(this.func.toCnpjId(this.client.cnpj)).child('ged').set({
            apiKey: user.empresa_ativa._apiKey.apiKey,
            modulo: 'ged',
            customer_nome: user.empresa_ativa.nome,
            customer_cnpj: user.empresa_ativa.cnpj,
            client_nome: this.client.nome,
            client_cnpj: this.func.toCnpjId(this.client.cnpj),
            data_convite: Moment.format('DD/MM/YYYY HH:mm:ss'),
            email_enviado: false,
            convite_visualizado: false,
            convite_aceito: false,
            keyUser: user.email,
            user: this.email_usuario,
          }).then(() => {
            invite.child(this.func.toCnpjId(this.client.cnpj)).child('ged').child('permissions').remove()
            this.permissoes_ged.forEach((element) => {
              invite.child(this.func.toCnpjId(this.client.cnpj)).child('ged').child('permissions').child(element).set(true)
            })
          })
          invite.child('log').child(Moment.format('YYYYMMDDHHmmss')).set({
            KeyUser: user.email,
            data_log: moment().format('DD/MM/YYYY HH:mm:ss'),
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


  getInvitations(client) {
    if (this.user) {
      var ref_invitations = this.fbServices.DB.FB.ref('invitations').child('users')
      ref_invitations.on('value', invitations => {
        if (invitations.exists()) {
          this.invitations = []
          Object.values(invitations.val()).forEach(apiKey => {
            Object.values(apiKey[this.user.empresa_ativa._apiKey.apiKey]).forEach(invite => {
              if (invite.ged) {
                if (this.func.toCnpjId(client.cnpj) == invite.ged.client_cnpj) {
                  var permissons = []
                  if (invite.ged.permissions) {
                    Object.keys(invite.ged.permissions).map(key => {
                      permissons.push({ name: key, sitPer: invite.ged.permissions[key] })
                    })
                  }
                  invite.ged.permissions = permissons
                  this.invitations.push(invite.ged)
                }
              }
            })
          })
          setInterval(() => { this.changeDetectorRefs.detectChanges() }, 200)
        }
      })
    }
  }


  ngOnInit() {
    /**
     * 
     */
    this.user = this.auth.getUser()
    if (this.user.isKeyUser == true) {
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
