import { DataSource } from '@angular/cdk/table';
import { FormBuilder } from '@angular/forms';
import { APPFunctions } from './../../app.functions';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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

  showTable: boolean = true
  titulos: any

  displayedColumns: string[] = ['cgcCpf', 'nomCli', 'datEmi', 'datVct', 'numTit', 'vlrTit', 'codCrt']

  @ViewChild(MatSort) sort: MatSort
  @ViewChild(MatPaginator) paginator: MatPaginator

  apiParams: any
  apiServices: any
  hasSuccess: string = ''
  hasError: string = ''
  dataSource: any = new MatTableDataSource()
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
      
    })
  }


  fnLogout() {
    this.fbServices.logout()
  }


  async fnGetParams() {
    var apiParam = await this.route.params.forEach(apiParams => this.apiParams = apiParams)
    return apiParam
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  fnGetTitulos(param: any) {
    return new Promise(resolve => {
      this.user = this.auth.getUser()
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
      this.func.soap(args).then(res => {
        resolve(res)
        this.isLoading = false
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
              this.displayedColumns = ['cgcCpf', 'nomCli', 'datEmi', 'datVct', 'numTit', 'vlrTit', 'codCrt']
              this.dataSource = new MatTableDataSource(titulos)
              this.dataSource.paginator = this.paginator
              this.dataSource.sort = this.sort
              this.showTable = true
            } else {
              this.showTable = false
              this.isLoading = false
              this.hasSuccess = null
              this.hasError = `Nenhum título vinculado ao seu email (${this.user.email}) foi encontrato. Entre em contato com nosso financeiro.`
            }
          }
        } else {
          this.isLoading = false
        }
      })
    })
  }



  fnBilling() {

    this.user = this.auth.getUser()

    this.fbServices.DB.FB.ref('services').child(this.apiParams.apiKey).child('billing').once('value', services => {

      if (services.exists()) {

        this.apiServices = services.val()
        if (this.apiServices.sitSrv == true) {
          this.fnGetTitulos(this.apiServices)
        } else {
          this.isLoading = false
          this.hasError = 'Erro ao processar este contrato.'
        }
      } else {
        this.isLoading = false
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
