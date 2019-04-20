import { APPFunctions } from './../../app.functions';
import { AuthGuardService } from './../../auth-guard.service';
import { Component, OnInit } from '@angular/core';
import { FBServices } from './../../firebase.services';

@Component({
  selector: 'app-ged-settings',
  templateUrl: './ged-settings.component.html',
  styleUrls: ['./ged-settings.component.scss']
})
export class GedSettingsComponent implements OnInit {

  cnpj: string = ''
  btnIsDisabled: boolean = false

  constructor(
    private fbServices: FBServices,
    private auth: AuthGuardService,
    private func: APPFunctions
  ) { }


  getCustomers() {

  }

  importarCliente() {
    var user = this.auth.getUser()
    console.log(user)
    this.func.importarCliente(this.func.toCnpjId(this.cnpj), user.empresa_ativa.settings.apiKey).then(result => {
      console.log(result)
    })
  }

  ngOnInit() {

    var user = this.auth.getUser()
    console.log(user.empresa_ativa.settings.apiKey)



    // this.fbServices.DB.FB.ref('ged').child('users').child(user.uid).set({
    //   customers:{
    //     a:'a',
    //     b:'b'
    //   }

    // })

  }

}