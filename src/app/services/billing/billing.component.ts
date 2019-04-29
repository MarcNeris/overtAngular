import { APPFunctions } from './../../app.functions';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthGuardService } from './../../auth-guard.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FBServices } from 'app/firebase.services';
import {
  MatTableDataSource,
  MatPaginator,
  MatSort
} from '@angular/material';

import numeral from 'numeral'

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {
  user: any = {
    displayName: '',
    email: '',
  }

  @ViewChild(MatSort) sort: MatSort
  @ViewChild(MatPaginator) paginator: MatPaginator

  isLoading: boolean = true
  hasSuccess: any = null
  hasError: any = null
  displayedColumns: string[] = ['cgcCpf', 'nomCli', 'datEmi', 'datVct', 'numTit', 'vlrTit', 'codCrt']
  dataSource: any = null
  apiKey: any

  constructor(
    private fbServices: FBServices,
    private auth: AuthGuardService,
    private route: ActivatedRoute,
    private func: APPFunctions,
  ) {

  }

  fnReceberBoleto(titulo) {
    this.isLoading = true
    var apiKey: any = this.apiKey

    if (apiKey.webservices) {
      if (apiKey.webservices.billing) {
        if (apiKey.webservices.billing.sitSrv == true) {
          var param = apiKey.webservices.billing

        } else {
          return this.hasError = 'Serviço está inativo.'
        }

      }
    }

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
    this.func.soap(args).then(res => {
      var result: any = res
      this.isLoading = false
      if (result.result.resultado == "OK") {
        this.hasSuccess = 'Email enviado com sucesso.'
      } else {
        this.hasError = result.result.resultado
      }
    })
  }


  fnLogout() {
    this.fbServices.logout()
  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  fnGetTitulos(apiKey: any) {

    if (apiKey.webservices) {
      if (apiKey.webservices.billing) {
        if (apiKey.webservices.billing.sitSrv == true) {
          var param = apiKey.webservices.billing

        } else {
          return this.hasError = 'Serviço está inativo.'
        }

      }
    }

    var args: any = {
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

    const soapGetTitulos = () => {
      this.user = this.auth.getUser()
      Promise.resolve(
        this.func.soap(args).then(res => {
          var result: any = res
          if (result) {

            if (result.result) {
              if (result.result.resultado == "OK") {
                var titulos = result.result.titulosAbertos
                titulos.forEach(titulo => {
                  var vlr: String = numeral(titulo.vlrTit).format('$0,0.00')
                  titulo.emaCli = args.parameters.emaCli
                  titulo.vlrTit = vlr
                })
              } else {
                this.hasError = result.result.resultado
              }
            }
          }
          this.isLoading = false
          console.warn()
          this.dataSource = new MatTableDataSource(titulos)
        })
      ).then(() => {

        this.dataSource.sort = this.sort
        this.dataSource.paginator = this.paginator
      })
    }

    soapGetTitulos()

  }


  fnApiKey() {
    var params: any
    this.route.params.forEach(apiParams => params = apiParams)
    this.user = this.auth.getUser()
    this.fbServices.DB.FB.ref('_apiKey').child(params.apiKey).once('value', cnpj => {
      if (cnpj.exists()) {
        this.fbServices.DB.FB.ref('_apiKey').child(cnpj.val()).once('value', apiKey => {
          if (apiKey.exists()) {
            this.apiKey = apiKey.val()
          } else {
            this.hasError = 'Cliente não está parametrizado.'
          }
        }).then(() => {
          this.fnGetTitulos(this.apiKey)
        })
      } else {
        this.hasError = 'ApiKey inválida'
      }
    })
  }


  ngAfterViewInit() {
    this.fnApiKey()
  }


  ngOnInit() {

  }

}
