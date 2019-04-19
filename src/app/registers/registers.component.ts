import { FBServices } from './../firebase.services';
import { APPFunctions } from './../app.functions';
import { AuthGuardService } from './../auth-guard.service';
import { Component, OnInit } from '@angular/core';
import * as moment  from 'moment';

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

  constructor(
    public auth: AuthGuardService,
    public func: APPFunctions,
    public fbServices: FBServices
  ) { }
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

      console.log(this.func.isEmail(this.email_usuario))

      if (this.func.isEmail(this.email_usuario)) {
        var user = this.auth.getUser()
        console.log(user)
        this.fbServices.DB.FB.ref('system').child('users').child('permissions').child(this.func.toEmailId(this.email_usuario)).child(user.empresa_ativa.settings.apiKey).update({
          email_enviado: false,
          system: {
            permissions: {
              modules: {
                ged: {
                  HAS_USER: false,
                  LER_DOCUMENTOS: false,
                  EDITAR_DOCUMENTOS: false,
                  ENVIAR_DOCUMENTOS: false,
                  REMOVER_DOCUMENTOS: false,
                }
              },
            },
          },
          log: {
            keyUser: {
              uid: user.uid,
              email: user.email,
              datLog: moment().format('DD/MM/YYY HH:mm:ss')
            }
          }
        })
        this.hasError = null
        this.hasSucces = `${this.email_usuario} foi convidado!`
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
  }

}
