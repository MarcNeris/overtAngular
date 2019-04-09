import { DataSource } from '@angular/cdk/table';
import { APPFunctions } from './app.functions';
import { FBServices } from './firebase.services';
import { Injectable, Component, ViewChild, Inject } from '@angular/core';

//import { Observable, of } from 'rxjs';
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
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  displayedColumns: string[] = ['apeEmp', 'nomFun', 'numCpf']

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

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async fnReload() {
    window.location.reload()
  }

  async fnServices() {

    this.fbServices.getCurrentUser().then(user => {

      if (user) {
        //this.router.navigate([ `/services/${this.apiParams.apiKey}/${this.apiParams.apiService}/${this.apiParams.apiArgs}`])
        this.hideLogin = true
        this.emailVerified = true
        this.hideLogout = false
        this.user = user

        console.log(this.user)

     

        console.log(this.apiParams)
        //http://localhost:4200/services/V4tCSEkEx3Pfq8Sd5EblWQfC5IQ2/billing

        this.fbServices.DB.FB.ref('services').child(this.apiParams.apiKey).child(this.apiParams.service).once('value', services => {

          this.apiServices = services.val()

          console.log(this.apiServices)

        })

      } else {

        this.hideLogin = false
        this.hideLogout = true

      }
    })
  }

  fnLogout(){
    this.fbServices.logout()
  }

  async fnGetParams() {
    var apiParam = await this.route.params.forEach(apiParams => this.apiParams = apiParams)
    return apiParam
  }

  async soapCall() {
    
    this.loadingIsHide = false

    var param = this.apiServices.retornacolaborador

    var args: any = null
    if (param) {
      args = {
        wsdl: param.wsdl,
        porta: param.porta,
        user: param.user,
        password: param.password,
        encryption: '0',
        parameters: {
          codOpe: 'retornacolaborador',
          intNet: 'marcelo.neris@seniorbh.com.br',
        }
      }
    }

    if (args) {
      this.func.soap(args).then(result => {
        this.loadingIsHide = true
        console.log(result)
        var dataSource: any = result
        dataSource = dataSource.result.griCol
        //console.log(dataSource)
        this.dataSource = new MatTableDataSource(dataSource)
        this.dataSource.paginator = this.paginator
      })
    } else {
      this.loadingIsHide = true
    }


    // var params = this.func.encrypt(JSON.stringify(args))
    // await this.httpClient.get(`https://overt-hcm.appspot.com/services/erp/params=${params},uid=${this.fbServices.DB.LS._uid}`).subscribe((res) => {
    //   this.loadingIsHide = true
    //   var dataSource: any = res
    //   dataSource = dataSource.result.griCol
    //   //console.log(dataSource)

    //   this.dataSource = new MatTableDataSource(dataSource)
    //   this.dataSource.paginator = this.paginator

    // })
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

    this.fnServices()
  }

  ngOnInit() {
    // console.log(this.router.url)
    this.dataSource.sort = this.sort
    this.fnGetParams()
  }

}