import { AuthGuardService } from './../auth-guard.service';
import { FBServices } from './../firebase.services';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import * as Chartist from 'chartist';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  user: User

  constructor(
    public auth: AuthGuardService,
    public fbServices: FBServices,
    public router: Router,
  ) { }

  fnLogout() {
    this.fbServices.logout()
  }


  ngOnInit() {
    this.user = this.auth.getUser()
  }

}

interface User {
  displayName: string
  email: string
}