import { DataSource } from '@angular/cdk/table';
import { APPFunctions } from './app.functions';
import { FBServices } from './firebase.services';
import { Injectable, Component, ViewChild, Inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Routes, Router, ActivatedRoute, ParamMap } from '@angular/router';
import {
  MatTableDataSource,
  MatPaginator,
  MatSort
} from '@angular/material';


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
  styleUrls: ['./services.service.css'],
  // template: `
  //   <notifier-container></notifier-container>
  // `
})


@Injectable({
  providedIn: 'root'
})


export class Services {

  dataSource = new MatTableDataSource(ELEMENT_DATA)

  displayedColumns: string[] = ['cgcCpf', 'nomCli', 'datEmi', 'datVct', 'numTit', 'vlrTit', 'codCrt']

  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort

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

    // Import the AlertController from ionic package 
    // Consume it in the constructor as 'alertCtrl' 

  ) {
    //this.router.navigate(['/login'])

  }

  fnReceberBoleto(titulo) {
    var param: any = this.apiServices
    var args = {
      wsdl: param.wsdl,
      porta: param.porta,
      user: param.user,
      password: param.password,
      encryption: '0',
      parameters: {
        tipPro: '2',
        emaCli: this.user.email,
        titulosGerarBoletos: [{
          codCrt: titulo.codCrt,
          codEmp: titulo.codEmp,
          codFil: titulo.codFil,
          codPor: titulo.codPor,
          codTpt: titulo.codTpt,
          numTit: titulo.numTit
        }]
      }
    }

    this.func.soap(args).then(result => {
      console.log(result)
    })



  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async fnReload() {
    window.location.reload()
  }

  fnBilling() {

    this.fbServices.getCurrentUser().then(user => {
      if (user) {
        this.hideLogin = true
        this.emailVerified = true
        this.hideLogout = false
        this.user = user
        this.fbServices.DB.FB.ref('services').child(this.apiParams.apiKey).child(this.apiParams.service).once('value', services => {
          this.apiServices = services.val()
          return this.fnGetTitulos()
        })

      } else {
        this.hideLogin = false
        this.hideLogout = true
      }
    })
  }

  fnLogout() {
    this.fbServices.logout()
  }

  async fnGetParams() {
    var apiParam = await this.route.params.forEach(apiParams => this.apiParams = apiParams)
    return apiParam
  }

  fnGetTitulos() {
    this.loadingIsHide = false
    var param = this.apiServices
    var args: any = null

    if (param) {
      args = {
        wsdl: param.wsdl,
        porta: param.porta,
        user: param.user,
        password: param.password,
        encryption: '0',
        parameters: {
          tipPro: '1',
          emaCli: this.user.email,
        }
      }
    }

    if (args) {
      this.func.soap(args).then(result => {
        this.loadingIsHide = true
        var dataSource: any = []
        if (result) {
          dataSource = result
          if (dataSource.result) {
            if (dataSource.result.titulosAbertos) {
              var titulos: any = dataSource.result.titulosAbertos
              titulos.forEach(titulo => {
                var vlr: number = titulo.vlrTit
                titulo.emaCli = args.parameters.emaCli
                titulo.vlrTit = vlr
              })
              this.dataSource = new MatTableDataSource(titulos)
              this.dataSource.paginator = this.paginator
              this.dataSource.sort = this.sort
            }
          }
        } else {

        }
      })
    } else {
      this.loadingIsHide = true
    }
  }



  ngAfterViewInit() {
    // var argsChefia = {
    //   wsdl: 'http://www.consistema.com.br:8081/g5-senior-services/rubi_Synccom_senior_g5_rh_consistema_portal?wsdl',
    //   porta: 'folha',
    //   user: 'mobile.portal',
    //   password: 'mobile6916',
    //   encryption: '0',
    //   parameters: {
    //     codOpe: 'retornachefia',
    //     intNet: 'marceloneris@hotmail.com',
    //     datChe: '01/04/2019',
    //     numCad: '300',
    //     numEmp: '1',
    //     retAfa: 'N',
    //     tipCol: '1'
    //   }
    // }
    // this.func.soap(argsChefia).then(result => {
    //   console.log(result)
    // })

    this.fnBilling()
  }

  ngOnInit() {
    // console.log(this.router.url)

    this.fnGetParams()
  }

}