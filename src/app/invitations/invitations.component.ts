import { FBServices } from './../firebase.services';
import { APPFunctions } from './../app.functions';
import { AuthGuardService } from './../auth-guard.service';
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

interface TrackByFunction<T> {
  (index: number, item: T): any
}


@Component({
  selector: 'app-invitations',
  templateUrl: './invitations.component.html',
  styleUrls: ['./invitations.component.scss']
})

export class InvitationsComponent implements OnInit {


  user: any

  invitations: any = null
  invite: any = null
  isLicenced: boolean = false

  permissions: any = {
    name: '',
    permission: ''
  }

  invitationsDisplayedColumns: string[] = ['cnpj_client', 'nome_client', 'from_email', 'actions']
  permissionsDisplayedColumns: string[] = ['permission']

  invitationsDataSource: any = new MatTableDataSource()
  permissionsDataSource: any

  constructor(
    private auth: AuthGuardService,
    private fbServices: FBServices,
    private func: APPFunctions,
    private changeDetectorRefs: ChangeDetectorRef,
  ) {


  }



  fnUpdateInvite(invite: any, value: boolean) {

    if (this.user) {

      var permissions = invite.permissions

      // https://overt-hcm.firebaseio.com/invitations/users/marcneris@msn-com/CKiK1DkbtzQYQhKphnf229oYU9H3/00387093000159/ged

      var ref_invite = this.fbServices.DB.FB.ref('invitations').child('users').child(this.func.toEmailId(this.user.email)).child(invite.apiKey).child(this.func.toCnpjId(invite.cnpj_client)).child(invite.modulo)

      ref_invite.once('value', invite => {

        console.log(invite.val())

        if (invite.exists()) {
          ref_invite.child('userSaw').set(true)

          ref_invite.child('userAccepted').set(value).then(() => {

            var ref_permission = this.fbServices.DB.FB.ref('system').child('users').child(invite.val().apiKey).child(this.user.uid)

            ref_permission.child('email').set(this.user.email)
            ref_permission.child('uid').set(this.user.uid)

            permissions.forEach(permission => {
              ref_permission.child('permissions').child(invite.val().cnpj_client).child(permission.name).set(value)
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

  fnSetInvite(invite) {

    this.invite = invite

    var invites = []
    Object.values(this.invite.permissions).forEach(permission => {
      Object.keys(permission).map(key => {
        invites.push({ name: key, sitPer: permission[key] })
      })
    })

    this.permissionsDataSource = new MatTableDataSource(invites)

    this.changeDetectorRefs.detectChanges()
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim()
    filterValue = filterValue.toLowerCase()
    this.invitationsDataSource.filter = filterValue
  }

  ngOnInit() {
    /**
     *
     */
    this.user = this.auth.getUser()

    this.auth.invitations.subscribe(res => {
      if (res) {
        var invitations: any = []
        Object.values(res).forEach(cnpj => {
          Object.values(cnpj).forEach(modulo => {
            Object.values(modulo).forEach(invite => {
              if (invite.userSaw == false) {
                var permissons = []
                Object.keys(invite.permissions).map(key => {
                  permissons.push({ name: key, sitPer: invite.permissions[key] })
                })
                invite.permissions = permissons
                invitations.push(invite)
              }
            })
          })
        })
        this.invitationsDataSource = new MatTableDataSource(invitations)
        setInterval(() => { this.changeDetectorRefs.detectChanges() }, 200)
      }
    })
  }



}