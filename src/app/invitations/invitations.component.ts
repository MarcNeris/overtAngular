import { APPFunctions } from './../app.functions';
import { AuthGuardService } from './../auth-guard.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FBServices } from 'app/firebase.services';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

export interface invitationsData {
  cnpj: string;
  client: string;
  email: string;
}

@Component({
  selector: 'app-invitations',
  templateUrl: './invitations.component.html',
  styleUrls: ['./invitations.component.scss']
})

export class InvitationsComponent implements OnInit {
  @ViewChild(MatPaginator) invitationsPaginator: MatPaginator
  @ViewChild(MatSort) invitationsSort: MatSort
  user: any = null
  invitations: any = null
  invite: any = null
  invitationsDisplayedColumns: string[] = ['cnpj', 'client', 'email', 'actions']
  invitationsDataSource: MatTableDataSource<invitationsData>

  constructor(
    private auth: AuthGuardService,
    private fbServices: FBServices,
    private func: APPFunctions
  ) {

  }

  fnUnsetInvite(){
    this.invite = null
  }

  fnSetInvite(invite) {
    this.invite = invite
  }


  applyFilter(filterValue: string) {
    this.invitationsDataSource.filter = filterValue.trim().toLowerCase();

    if (this.invitationsDataSource.paginator) {
      this.invitationsDataSource.paginator.firstPage();
    }
  }


  getInvitations() {
    return new Promise(resolve => {
      var user = this.auth.getUser()
      if (user) {
        this.user = user
        this.fbServices.DB.FB.ref('invitations').child('users').child(this.func.toEmailId(user.email)).on('value', invitations => {
          if (invitations.exists()) {
            this.invitations = []
            Object.values(invitations.val()).forEach(client => {
              this.invitations.push(client.invite)
            })
            this.invitationsDataSource = new MatTableDataSource(this.invitations)
            this.invitationsDataSource.sort = this.invitationsSort
            this.invitationsDataSource.paginator = this.invitationsPaginator
            resolve(invitations.val())
          } else {
            this.invitations = null
          }
        })
      }
    })
  }

  ngOnInit() {
    this.getInvitations().then()
  }

}
