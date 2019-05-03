import { FBServices } from './../../firebase.services';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const MAIN_ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard', icon: 'dashboard', class: '' },
  { path: '/trackpoint', title: 'Track Point', icon: 'track_changes', class: '' },
  { path: '/layoff', title: 'Férias', icon: 'flight_takeoff', class: '' },
  { path: '/moods', title: 'Moods', icon: 'question_answer', class: '' },
  { path: '/social', title: 'Social', icon: 'people_outline', class: '' },
  { path: '/ged', title: 'GED', icon: 'data_usage', class: '' },
  { path: '/login', title: 'Login', icon: 'person', class: '' },
];

export const TRACKPOINT_ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard', icon: 'dashboard', class: '' },
  { path: '/trackpoint', title: 'Track Point', icon: 'track_changes', class: '' },
  { path: '/login', title: 'Login', icon: 'person', class: '' },
];

export const GED_ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard', icon: 'dashboard', class: '' },
  { path: '/ged', title: 'GED', icon: 'data_usage', class: '' },
  { path: '/ged-share', title: 'Compartilhamento', icon: 'share', class: '' },
  { path: '/ged-settings', title: 'Configurações', icon: 'settings', class: '' },
  { path: '/ged-permissions', title: 'Permissões', icon: 'verified_user', class: '' },
  { path: '/login', title: 'Login', icon: 'person', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  menuItems: any[];

  sidebarVisible: boolean

  constructor(
    private router: Router,
    private fbServices: FBServices
  ) {
    this.sidebarVisible = true
  }

  fnLogout() {
    this.fbServices.logout()
  }

  ngDoCheck() {

    // switch (key) {
    //   case value:

    //     break;

    //   default:
    //     break;
    // }

    if (this.router.url.includes("login")) {
      this.menuItems = []
    } else if (this.router.url.includes("ged")) {
      this.menuItems = GED_ROUTES.filter(menuItem => menuItem);
    } else if (this.router.url.includes("trackpoint")) {
      this.menuItems = TRACKPOINT_ROUTES.filter(menuItem => menuItem);
    } else {
      this.menuItems = MAIN_ROUTES.filter(menuItem => menuItem);
    }

  }



  // onModule() {
  //   this.router.events.subscribe(() => {
  //     console.log(this.router.url)

  //   })
  // }

  ngOnInit() {

  }

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  };
}
