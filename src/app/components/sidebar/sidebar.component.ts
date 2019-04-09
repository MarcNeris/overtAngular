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

  constructor(
    private router: Router
  ) { }

  ngOnInit() {

    if (this.router.url.includes("login")) {
      document.getElementsByClassName('navbar-toggler')[0].remove()
      document.getElementsByClassName('navbar')[0].remove()
    }




    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {

    if ($(window).width() > 991) {
      return false;
    }
    return true;
  };
}
