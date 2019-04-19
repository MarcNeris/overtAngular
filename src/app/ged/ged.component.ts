import { FBServices } from './../firebase.services';
import { AuthGuardService } from 'app/auth-guard.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ged',
  templateUrl: './ged.component.html',
  styleUrls: ['./ged.component.scss']
})
export class GedComponent implements OnInit {

  constructor(
    private fbServices: FBServices,
    private auth: AuthGuardService
  ) { }

  ngOnInit() {

  }

}
