import { DataSource } from '@angular/cdk/table';
import { APPFunctions } from './app.functions';
import { FBServices } from './firebase.services';
import { Injectable, Component, ViewChild } from '@angular/core';
//import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Routes, Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';



export interface dataElements {
  apeEmp: string;
  nomFun: number;
  numCpf: number;
}

const ELEMENT_DATA: dataElements[] = [
  { apeEmp: null, nomFun: null, numCpf: null }
]



@Component({
  selector: 'app-root',
  templateUrl: './services.service.html',
  styleUrls: ['./services.service.css']
})

@Injectable({
  providedIn: 'root'
})


export class Services {

  //apiKey: 'V4tCSEkEx3Pfq8Sd5EblWQfC5IQ2'

  //dataSource: any
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  displayedColumns: string[] = ['apeEmp', 'nomFun', 'numCpf']

  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort
  //
  apiParams: any
  apiServices: any
  hasSuccess: string = null
  hasError: string = null
  user: any = null
  hideLogin: any = true
  hideLogout: any = true
  emailVerified: any = true
  emailVerifyHasSent: any = true
  hideRecuperarSenha: any = true
  email: string
  password: string
  loadingIsHide: any = true

  constructor(
    protected httpClient: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private fbServices: FBServices,
    private func: APPFunctions,
  ) {
    //this.router.navigate(['/login'])

  }

  fnCurrentUser() {
    return new Promise(resolve => {
      this.fbServices.auth().onAuthStateChanged(user => {
        return resolve(user)
      })
    })
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async fnLogout() {
    await this.fbServices.auth().signOut().then(() => {
      this.fbServices.DB.LS.clear()
      this.hideLogin = false
      this.hideLogout = true
      this.hasError = ''
      this.hasSuccess = ''
      this.emailVerified = true
    })
  }

  async fnReload() {
    window.location.reload()
  }

  async fnLogin() {
    await this.fbServices.auth().signInWithEmailAndPassword(this.email, this.password).then(user => {
      if (user) {
        this.hideLogin = true
        this.hideLogout = false
        this.fnServices()
      }
    }).catch(error => {
      console.log(error.code)
      if (error.code == 'auth/user-not-found') {
        this.hasError = 'Seu email não foi encontrato em nossos registros, verifique ou crie uma nova conta.'
      } else if (error.code == 'auth/wrong-password') {
        this.hideRecuperarSenha = false
        this.hasError = 'Senha inválida.'
      }
      console.log(this.hasError)
    })
  }

  async fnCriarConta() {

    await this.fbServices.auth().createUserWithEmailAndPassword(this.email, this.password).then(user => {

      if (user) {
        if (user.operationType == 'signIn') {
          this.hasSuccess = 'Bem-vindo!'
        }
        this.hideLogin = true
        this.hideLogout = false
        this.fnServices()
      }
    }).catch(error => {

      if (error.code == 'auth/email-already-in-use') {
        this.hasError = 'Este email já está em uso.'

        this.hideRecuperarSenha = false
      }

      if (error.code == 'auth/weak-password') {
        this.hideRecuperarSenha = true
        this.hasError = 'Sua senha precisa ter no mínimo 6 caracteres.'
      }
      console.warn(error)
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });

  }

  fnRecuperarSenha() {
    this.fbServices.auth().sendPasswordResetEmail(this.email).then(() => {
      this.hasError = ''
      this.hasSuccess = `Enviamos instruções de como recuperar a sua senha para '${this.email}' verifique sua caixa de entrada, ou spam.`
    }).catch(error => {
      console.warn(error)
      this.hasError = 'Ocorreu um erro ao enviar o email, tente novamente.'
    })
  }

  fnVerificarEmail(user) {
    user.sendEmailVerification().then(() => {
      this.hasError = 'Enviamos istruções para verificação de seu email. Nosso email pode ter sido considerado um spam.'
      this.emailVerifyHasSent = false
    }).catch(error => {
      console.warn(error)
      if (error.code == 'auth/too-many-requests') {

        this.hasError = 'Bloqueamos o envio de email, muitas requisições por minuto, tente novamente mais tarde.'
      }
    })
  }

  async fnServices() {

    this.fnCurrentUser().then(user => {

      if (user) {

        //this.router.navigate([ `/services/${this.apiParams.apiKey}/${this.apiParams.apiService}/${this.apiParams.apiArgs}`])

        this.hideLogin = true
        this.emailVerified = true
        this.hideLogout = false
        this.user = user

        if (!this.user.emailVerified) {

          this.hasError = 'Seu email ainda não foi verificado, clique no botão "Verificar email", que enviaremos instruções para ativar sua conta.'
          return this.emailVerified = false
        }
        this.fbServices.DB.FB.ref('customers').child(this.apiParams.apiKey).child('services').once('value', services => {

          this.apiServices = services.val()
        })
      } else {

        this.hideLogin = false
        this.hideLogout = true

      }
    })
  }

  fnSetParams(apiParams: any) {
    return this.apiParams = apiParams
  }

  async fnGetParams() {
    var apiParam = await this.route.params.forEach(apiParams => this.fnSetParams(apiParams))
    return apiParam
  }

  async soapCall() {
    this.loadingIsHide=false
    var param = this.apiServices.retornacolaborador

    var args = {
      wsdl: param.wsdl,
      porta: param.porta,
      user: param.user,
      password: param.password,
      encryption: '0',
      parameters: {
        codOpe: 'retornacolaborador',
        intNet: 'junior.ferreira@seniorbh.com.br',
      }
    }
    var params = this.func.encrypt(JSON.stringify(args))
    await this.httpClient.get(`https://overt-hcm.appspot.com/services/erp/params=${params},uid=${this.fbServices.DB.LS._uid}`).subscribe((res) => {
      this.loadingIsHide=true
      var dataSource: any = res
      dataSource = dataSource.result.griCol
      console.log(dataSource)

      this.dataSource = new MatTableDataSource(dataSource)
      this.dataSource.paginator = this.paginator

    })
  }

  ngAfterViewInit() {
    this.fnServices()
  }

  ngOnInit() {
    this.dataSource.sort = this.sort
    this.fnGetParams()
  }
}
