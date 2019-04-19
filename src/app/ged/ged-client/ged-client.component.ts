import { FBServices } from './../../firebase.services';
import { AuthGuardService } from './../../auth-guard.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ged-client',
  templateUrl: './ged-client.component.html',
  styleUrls: ['./ged-client.component.scss']
})
export class GedClientComponent implements OnInit {
  user: any = {
    displayName: '',
    email: '',
  }
  constructor(
    private auth: AuthGuardService,
    private fbServices: FBServices
  ) { }

  fnLogout() {
    this.fbServices.logout()
  }

  ngOnInit() {
    this.user = this.auth.getUser()

    // this.fbServices.DB.FB.ref()
    console.log(this.user)
  }

}
