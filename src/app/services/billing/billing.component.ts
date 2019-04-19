import { FormBuilder } from '@angular/forms';
import { APPFunctions } from './../../app.functions';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthGuardService } from './../../auth-guard.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FBServices } from 'app/firebase.services';
import {
  MatTableDataSource,
  MatDialog,
  MatPaginator,
  MatPaginatorIntl,
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

  showTable: boolean = false
  titulos: any

  displayedColumns: string[] = ['cgcCpf', 'nomCli', 'datEmi', 'datVct', 'numTit', 'vlrTit', 'codCrt']

  @ViewChild(MatSort) sort: MatSort
  @ViewChild(MatPaginator) paginator: MatPaginator

  apiParams: any
  apiServices: any
  hasSuccess: string = null
  hasError: string = null
  dataSource: any
  isLoading: boolean = false

  constructor(
    private fbServices: FBServices,
    private auth: AuthGuardService,
    private route: ActivatedRoute,
    private func: APPFunctions,
  ) {

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


  fnLogout() {
    this.fbServices.logout()
  }


  async fnGetParams() {
    var apiParam = await this.route.params.forEach(apiParams => this.apiParams = apiParams)
    return apiParam
  }


  fnGetTitulos(param: any) {

    this.isLoading = true
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

    if (args) {

      return new Promise(resolve => {
        this.func.soap(args).then(result => {
          var dataSource: any = []
          if (result) {
            dataSource = result
            if (dataSource.result) {
              if (dataSource.result.resultado == "OK") {
                this.titulos = dataSource.result.titulosAbertos
                this.titulos.forEach(titulo => {
                  var vlr: String = numeral(titulo.vlrTit).format('$0,0.00')
                  titulo.emaCli = args.parameters.emaCli
                  titulo.vlrTit = vlr
                })

                this.dataSource = new MatTableDataSource(this.titulos)
                this.isLoading = false

                dataSource.sort = this.sort
                resolve(dataSource)

                dataSource.paginator = this.paginator
              }
            }
          }
        }).then(() => {
          this.showTable = true
        })
      })
    } else {
      this.isLoading = false
    }
  }



  fnBilling() {

    var user: any = this.auth.getUser()
    this.user = user
    this.fbServices.DB.FB.ref('services').child(this.apiParams.apiKey).child('billing').once('value', services => {

      if (services.exists()) {
        this.apiServices = services.val()
        if (this.apiServices.sitSrv == true) {
          this.fnGetTitulos(this.apiServices)
        } else {
          this.hasError = 'Erro ao processar este contrato.'
        }
      } else {
        this.hasError = 'Cliente não está parametrizado.'
      }
    })


  }

  ngAfterViewInit() {
    this.fnBilling()
  }



  ngOnInit() {
    this.fnGetParams()
  }

}
