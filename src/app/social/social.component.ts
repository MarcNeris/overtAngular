import { FBServices } from './../firebase.services';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.scss']
})
export class SocialComponent implements OnInit {

  constructor(
    public fbServices:FBServices
  ) { }

  ngOnInit() {
    
  }

}
