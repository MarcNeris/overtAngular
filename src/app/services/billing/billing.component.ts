import { APPFunctions } from './../../app.functions';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthGuardService } from './../../auth-guard.service';
import { Component, OnInit, ViewChild, Output, ChangeDetectionStrategy, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FBServices } from 'app/firebase.services';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import numeral from 'numeral'

// export interface data_titulos {
//   cgcCpf: string
//   nomCli: string
//   datEmi: string
//   datVct: string
//   numTit: string
//   vlrTit: string
//   codCrt: string
// }

// var ELEMENT_DATA: data_titulos[] = []

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class BillingComponent implements OnInit {

  public user: any = {
    displayName: '',
    email: '',
  }

  public displayedColumns: string[] = ['cgcCpf', 'nomCli', 'datEmi', 'datVct', 'numTit', 'vlrTit', 'codCrt']

  public dataSource: any = null

  @Output() titulos = new EventEmitter()

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator

  isLoading: boolean = true
  hasSuccess: any = null
  hasError: any = null
  apiKey: any

  constructor(
    private fbServices: FBServices,
    private auth: AuthGuardService,
    private route: ActivatedRoute,
    private func: APPFunctions,
    private changeDetectorRefs: ChangeDetectorRef
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
      this.isLoading = false
      var result: any = res
      if (result.result.resultado == "OK") {
        this.hasSuccess = 'Email enviado com sucesso.'
      } else {
        this.hasError = result.result.resultado
      }
      setInterval(() => {
        this.changeDetectorRefs.detectChanges()
      }, 100)
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

      return new Promise(resolve => {
        this.func.soap(args).then(res => {
          return new Promise(resolve => {
            var result: any = res
            if (result) {
              if (result.result) {
                if (result.result.resultado == "OK") {

                  var titulos = result.result.titulosAbertos

                  titulos.forEach(titulo => {
                    titulo.emaCli = args.parameters.emaCli
                    titulo.vlrTit2 = titulo.vlrTit
                    titulo.vlrTit = numeral(parseFloat(titulo.vlrTit)).format('$0,0.00')
                  })
                  resolve(titulos)
                } else {
                  resolve(null)
                  this.hasError = result.result.resultado
                }
              }
            }
          }).then(res => {
            resolve(res)
          })
        })
      })
    }

    soapGetTitulos().then(res => {
      this.isLoading = false
      if (res) {
        var titulos: any = res
        this.dataSource = new MatTableDataSource(titulos)
      }
    }).then(() => {
      if (this.dataSource) {
        this.dataSource.sort = this.sort
        this.dataSource.paginator = this.paginator
      }
      setInterval(() => {
        this.changeDetectorRefs.detectChanges()
      }, 100)
    })
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

  }


  ngOnInit() {
    this.fnApiKey()
  }


}

