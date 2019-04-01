import { FBServices } from './../firebase.services';
import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';

interface empresa_logada {
  apeEmp: string,
}

interface user {
  username: string,
  email: string,
  uid: string
}


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
// @Pipe({name: 'exponentialStrength'})
// export class ExponentialStrengthPipe implements PipeTransform {
//   transform(value: number, exponent: string): number {
//     let exp = parseFloat(exponent);
//     return Math.pow(value, isNaN(exp) ? 1 : exp);
//   }
// }
export class LoginComponent implements OnInit {

  email: string
  password: string

  private user: user = {
    username: null,
    email: null,
    uid: null
  }

  private empresa_logada: empresa_logada = {
    apeEmp: null
  }
  private faceId: string = './assets/faces/nofoto.png'

  constructor(
    private fbServices: FBServices
  ) {
    if(this.fbServices.currentUser()){
      this.user = this.fbServices.currentUser()
    }
  }

  private fnLogin() {
    return this.fbServices.login(this.email, this.password)
  }

  private fnLogout() {
    return this.fbServices.logout()
  }

  ngOnInit() {
    //console.log(this.fbServices.currentUser())
  }

  ngAfterViewInit() {
    if (this.user.uid) {

      this.fbServices.DB.FB.ref('users').child(this.user.uid).child('faceId').child('url').once('value', faceId => {
        if (faceId.exists()) {
          this.faceId = faceId.val()
        }
      })

      this.fbServices.DB.FB.ref('users').child(this.user.uid).child('empresa_logada').once('value', empresa_logada => {
        if (empresa_logada.exists()) {
          this.empresa_logada = empresa_logada.val()
        }
      })

    }
  }

}
