import { AuthGuardService } from './../auth-guard.service';
import { FBServices } from './../firebase.services';
import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import * as Chartist from 'chartist';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  user: User = null

  constructor(
    public auth: AuthGuardService,
    public fbServices: FBServices,
    public router: Router,
    private changeDetectorRefs: ChangeDetectorRef,
  ) {

  }

  fnLogout() {
    this.fbServices.logout()
  }


  ngOnInit() {
    if(!this.user)
    setInterval(() => {
      this.user = this.auth.getUser()
    }, 1000)
    setInterval(() => { this.changeDetectorRefs.detectChanges() }, 100)
  }

}

interface User {
  displayName: string
  email: string
}