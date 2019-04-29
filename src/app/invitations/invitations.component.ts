import { APPFunctions } from './../app.functions';
import { AuthGuardService } from './../auth-guard.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FBServices } from 'app/firebase.services';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

export interface invitationsData {
  cnpj: string
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
  @ViewChild(MatPaginator) permissionsPaginator: MatPaginator
  @ViewChild(MatSort) permissionsSort: MatSort
  user: any = null
  invitations: any = null
  invite: any = null

  invitationsDisplayedColumns: string[] = ['cnpj', 'client', 'from_email', 'actions']

  permissionsDisplayedColumns: string[] = ['permission', 'unsubscribe', 'subscribe']

  invitationsDataSource: MatTableDataSource<invitationsData>
  permissionsDataSource: any

  constructor(
    private auth: AuthGuardService,
    private fbServices: FBServices,
    private func: APPFunctions
  ) {

  }


  fnUnsetInvite() {
    this.invite = null
  }

  fnSubscribePermission(permission) {
    console.log(permission)
  }

  fnUnSubscribePermission(permission) {
    console.log(permission)
  }

  fnSetInvite(invite) {
    this.invite = invite
    this.permissionsDataSource = new MatTableDataSource(Object.keys(invite.permissions))
    this.permissionsDataSource.sort = this.permissionsSort
    this.permissionsDataSource.paginator = this.permissionsPaginator
  }


  applyFilter(filterValue: string) {
    this.invitationsDataSource.filter = filterValue.trim().toLowerCase();

    if (this.invitationsDataSource.paginator) {
      this.invitationsDataSource.paginator.firstPage();
    }
  }


  getInvitations(user) {
    this.auth.getInvitations(user)
    this.auth.invitations.subscribe(invitations => {
      if (invitations) {
        
        this.invitations = []

        Object.values(invitations).forEach(client => {
          this.invitations.push(client.invite)
        })

        this.invitationsDataSource = new MatTableDataSource(this.invitations)
        this.invitationsDataSource.sort = this.invitationsSort
        this.invitationsDataSource.paginator = this.invitationsPaginator

      }
    })
  }


  ngOnInit() {
    var user = this.auth.getUser()
    this.getInvitations(user)

  }

}
