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
export const ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard', icon: 'dashboard', class: '' },
  { path: '/trackpoint', title: 'Track Point', icon: 'track_changes', class: '' },
  { path: '/layoff', title: 'Férias', icon: 'flight_takeoff', class: '' },
  { path: '/moods', title: 'Moods', icon: 'question_answer', class: '' },
  { path: '/social', title: 'Social', icon: 'people_outline', class: '' },
  { path: '/ged', title: 'GED', icon: 'data_usage', class: '' },
  //{ path: '/user-profile', title: 'Perfil', icon: 'person', class: '' },
  //{ path: '/table-list', title: 'Table List', icon: 'content_paste', class: '' },
  //{ path: '/typography', title: 'Typography', icon: 'library_books', class: '' },
  //{ path: '/icons', title: 'Icons', icon: 'bubble_chart', class: '' },
  //{ path: '/maps', title: 'Maps', icon: 'location_on', class: '' },
  //{ path: '/notifications', title: 'Notifications', icon: 'notifications', class: '' },
  //{ path: '/upgrade', title: 'Upgrade', icon: 'unarchive', class: '' },
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
    private fbServices:FBServices
  ) {
    this.sidebarVisible = true
  }

  // ngAfterViewInit(){

  //   if (this.router.url.includes("login")) {
  //     this.sidebarVisible = false
  //   } else {
  //     this.sidebarVisible = true
  //   }

  // }

  fnLogout(){
    this.fbServices.logout()
  }

  ngDoCheck(){
    if (this.router.url.includes("login")) {
      this.sidebarVisible = false
    } else {
      this.sidebarVisible = true
    }
  }

  // ngOnChanges(){
  //   console.log('ngAfterContentChecked')
  // }


  // ngAfterViewChecked(){
  //   console.log('ngAfterViewChecked')
  // }

  ngOnInit() {

  

    // console.log(this.router.url)

    // var sidebar = document.getElementsByClassName('sidebar')[0].getAttributeNames

    // console.log(sidebar)

    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {

    if ($(window).width() > 991) {
      return false;
    }
    return true;
  };
}
