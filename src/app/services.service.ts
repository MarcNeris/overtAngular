import { Observable, BehaviorSubject } from 'rxjs';
// import { AlertDialog } from './mat-alert/mat-alert.componet';
// import { DataSource } from '@angular/cdk/table';
import { APPFunctions } from './app.functions';
import { FBServices } from './firebase.services';
import { Injectable, Component, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Routes, Router, ActivatedRoute, ParamMap } from '@angular/router';
import {CollectionViewer, DataSource} from "@angular/cdk/collections";

import numeral from 'numeral'

// numeral.register('locale', 'br', {
//   delimiters: {
//       thousands: '.',
//       decimal: ','
//   },
//   abbreviations: {
//       thousand: 'k',
//       million: 'm',
//       billion: 'b',
//       trillion: 't'
//   },
//   ordinal : function (number) {
//       return number === 1 ? '°' : '';
//   },
//   currency: {
//       symbol: 'R$ '
//   }
// });
// numeral.locale('br');

import {
  MatTableDataSource,
  MatDialog,
  MatPaginator,
  MatSort
} from '@angular/material';


// export interface dataElements {
//   cgcCpf: string;
//   nomCli: string;
//   datEmi: string;
//   datVct: string;
//   numTit: string;
//   vlrTit: string;
//   codCrt: string;
// }

// var ELEMENT_DATA: dataElements[] = [
//   {
//     cgcCpf: null,
//     nomCli: null,
//     datEmi: null,
//     datVct: null,
//     numTit: null,
//     vlrTit: null,
//     codCrt: null
//   }
// ]


@Component({
  selector: 'app-root',
  templateUrl: './services.service.html',
  styleUrls: ['./services.service.scss'],
  // template: `
  //   <notifier-container></notifier-container>
  // `
})

@Injectable({
  providedIn: 'root'
})

export class Services {

  titulos: any
  dataSource: any = new MatTableDataSource(this.titulos)
  displayedColumns: string[] = ['cgcCpf', 'nomCli', 'datEmi', 'datVct', 'numTit', 'vlrTit', 'codCrt']

  @ViewChild(MatSort) sort: MatSort
  @ViewChild(MatPaginator) paginator: MatPaginator

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
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(
    protected httpClient: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private fbServices: FBServices,
    private func: APPFunctions,
    private dialog: MatDialog,
    private fb: FormBuilder,

    // private alertDialog : AlertDialog

    // Import the AlertController from ionic package 
    // Consume it in the constructor as 'alertCtrl' 
    //this.router.navigate(['/login'])

  ) {
    // this.alertDialog = fb.group({
    //   dialogTitle: ['Title', [Validators.required]],
    //   dialogMsg: ['', [Validators.minLength(5), Validators.maxLength(1000)]],
    //   dialogType: ['alert'],
    //   okBtnColor: [''],
    //   okBtnLabel: [''],
    //   cancelBtnColor: [''],
    //   cancelBtnLabel: ['']
    // })
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
        this.fbServices.DB.FB.ref('services').child(this.apiParams.apiKey).child('billing').once('value', services => {
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
              this.titulos = dataSource.result.titulosAbertos
              this.titulos.forEach(titulo => {
                var vlr: String = numeral(titulo.vlrTit).format('$0,0.00')
                titulo.emaCli = args.parameters.emaCli
                titulo.vlrTit = vlr
              })
              this.dataSource = new MatTableDataSource(this.titulos)
              // console.log(this.dataSource)
              setTimeout(() => {
                this.dataSource.paginator = this.paginator
                this.paginator._intl.itemsPerPageLabel = '';
                this.dataSource.sort = this.sort
                this.sort.sortChange.subscribe(()=>{console.log(this.dataSource)});
              }, 20);
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