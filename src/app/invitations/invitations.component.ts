import { FBServices } from './../firebase.services';
import { APPFunctions } from './../app.functions';
import { AuthGuardService } from './../auth-guard.service';
import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-invitations',
  templateUrl: './invitations.component.html',
  styleUrls: ['./invitations.component.scss']
})

export class InvitationsComponent implements OnInit {
  user: any
  isLicenced: boolean = false
  invitations: any

  constructor(
    private auth: AuthGuardService,
    private fbServices: FBServices,
    private func: APPFunctions,
    private router: Router,
    private changeDetectorRefs: ChangeDetectorRef,
  ) {
    this.user = this.auth.getUser()
    this.fnGetInvitations()
  }

  fnUpdateInvite(invite: any, value: boolean) {
    if (this.user) {
      var permissions = invite.permissions
      var ref_invite = this.fbServices.DB.FB.ref('invitations').child('users').child(this.func.toEmailId(this.user.email)).child(invite.apiKey).child(this.func.toCnpjId(invite.client_cnpj)).child(invite.modulo)
      ref_invite.once('value', invite => {
        if (invite.exists()) {
          ref_invite.child('convite_visualizado').set(true)
          ref_invite.child('data_resposta').set(moment().format('DD/MM/YYYY HH:mm:ss'))
          ref_invite.child('convite_aceito').set(value).then(() => {
            var ref_permission = this.fbServices.DB.FB.ref('system').child('users').child(this.user.uid).child('permissions').child(invite.val().apiKey)
            permissions.forEach(permission => {
              ref_permission.child(invite.val().client_cnpj).child(permission.name).set(value)
            })
          })
        }
      })
    }
  }


  fnSubscribePermission(invite) {
    this.fnUpdateInvite(invite, true)
  }

  fnUnSubscribePermission(invite) {
    this.fnUpdateInvite(invite, false)
  }


  fnGetInvitations() {
    if (this.user) {
      var ref_invitations = this.fbServices.DB.FB.ref('invitations').child('users').child(this.func.toEmailId(this.user.email))
      ref_invitations.on('value', invitations => {
        if (invitations.exists()) {
          this.invitations = []
          Object.values(invitations.val()).forEach(cnpj => {
            Object.values(cnpj).forEach(modulo => {
              Object.values(modulo).forEach(invite => {
                if (invite.convite_visualizado == false) {
                  var permissons = []
                  if (invite.permissions) {
                    Object.keys(invite.permissions).map(key => {
                      permissons.push({ name: key, sitPer: invite.permissions[key] })
                    })
                  }
                  invite.permissions = permissons
                  this.invitations.push(invite)
                }
              })
            })
          })
          setInterval(() => {
            this.changeDetectorRefs.detectChanges() 
          }, 100)
        }
      })
    }
  }

  ngOnInit() {
    /**
     *
     */
  }



}