import { FBServices } from './../../firebase.services';
import { AuthGuardService } from './../../auth-guard.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

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
  invitations: number = 0
  constructor(
    private changeDetectorRefs: ChangeDetectorRef,
    private auth: AuthGuardService,
    private fbServices: FBServices
  ) {
    this.user = this.auth.getUser()
    this.auth.invitations.subscribe(res => {
      this.invitations = 0
      if (res) {
        Object.values(res).forEach(cnpj => {
          Object.values(cnpj).forEach(modulo => {
            Object.values(modulo).forEach(invite => {
              if (invite.convite_visualizado == false)
                this.invitations++
              console.log(this.invitations)
            })
          })
        })
      }
      this.changeDetectorRefs.detectChanges()
    })
  }

  fnLogout() {
    this.fbServices.logout()
  }

  ngOnInit() {



    // this.fbServices.DB.FB.ref()
    // console.log(this.user)
  }

}
