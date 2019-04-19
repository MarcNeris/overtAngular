import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  date: Date = new Date()
  is_module: boolean = false
  module_settings: string

  constructor(
    public router: Router
  ) { }


  onUser() {
    this.router.events.subscribe(() => {
      if (this.router.url.includes("ged")) {
        this.is_module = true
        this.module_settings = 'ged-settings'
      } else {
        this.is_module = false
      }
    })
  }

  ngOnInit() {
    // this.onUser()
  }
}
