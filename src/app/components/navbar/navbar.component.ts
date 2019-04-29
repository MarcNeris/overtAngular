import { APPFunctions } from './../../app.functions';
import { FBServices } from './../../firebase.services';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AuthGuardService } from 'app/auth-guard.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {

    location: Location;
    invitations: any = null
    mobile_menu_visible: any = 0;

    empresaAtiva: any = {
        cnpj: '',
        nome: '',
        isKeyUser: null
    }

    user: any = {
        displyName: '',
        email: ''
    }

    private sidebarVisible: boolean;

    constructor(
        location: Location,
        private auth: AuthGuardService,
        private func: APPFunctions,
        private fbServices: FBServices,
        private router: Router) {
        this.location = location;
        this.sidebarVisible = false;
    }


    fnGetEmpresaAtiva(): void {
        var user = this.auth.getUser()
        if (user) {
            if (user.empresa_ativa) {
                this.empresaAtiva = user.empresa_ativa
            }
        }
    }

    fnLogout(): void {
        this.fbServices.logout()
    }
    /**
     * Monitora o usuário Logado
     */
    onUser(user): void {

        this.auth.invitations.subscribe(invitations => {
            this.invitations = 0
            if (invitations) {
                Object.values(invitations).forEach(client => {
                    if (client.invite) {
                        if (client.invite.userSaw == false) {
                            this.invitations++
                        }
                    }
                })
            }
        })

        this.router.events.subscribe(() => {
            if (user) {
                if (user.empresa_ativa) {

                    this.empresaAtiva = user.empresa_ativa
                }
            }
        })
    }
    /**
     *
     */
    ngOnInit() {

        var user = this.auth.getUser()
        
        this.user = user

        this.auth.getInvitations(user)

        this.onUser(user)

        this.fnGetEmpresaAtiva()

        this.router.events.subscribe((event) => {
            this.sidebarClose();
            var $layer: any = document.getElementsByClassName('close-layer')[0];
            if ($layer) {
                $layer.remove();
                this.mobile_menu_visible = 0;
            }
        });
    }

    sidebarOpen() {
        const body = document.getElementsByTagName('body')[0];
        body.classList.add('nav-open');
        this.sidebarVisible = true;
    }

    sidebarClose() {
        const body = document.getElementsByTagName('body')[0];
        this.sidebarVisible = false;
        body.classList.remove('nav-open');
    }

    sidebarToggle() {
        // const toggleButton = this.toggleButton;
        // const body = document.getElementsByTagName('body')[0];
        var $toggle = document.getElementsByClassName('navbar-toggler')[0];

        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
        const body = document.getElementsByTagName('body')[0];

        if (this.mobile_menu_visible == 1) {
            // $('html').removeClass('nav-open');
            body.classList.remove('nav-open');
            if ($layer) {
                $layer.remove();
            }
            setTimeout(function () {
                $toggle.classList.remove('toggled');
            }, 400);

            this.mobile_menu_visible = 0;
        } else {
            setTimeout(function () {
                $toggle.classList.add('toggled');
            }, 430);

            var $layer = document.createElement('div');
            $layer.setAttribute('class', 'close-layer');


            if (body.querySelectorAll('.main-panel')) {
                document.getElementsByClassName('main-panel')[0].appendChild($layer);
            } else if (body.classList.contains('off-canvas-sidebar')) {
                document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
            }

            setTimeout(function () {
                $layer.classList.add('visible');
            }, 100);

            $layer.onclick = function () { //asign a function
                body.classList.remove('nav-open');
                this.mobile_menu_visible = 0;
                $layer.classList.remove('visible');
                setTimeout(function () {
                    $layer.remove();
                    $toggle.classList.remove('toggled');
                }, 400);
            }.bind(this);

            body.classList.add('nav-open');
            this.mobile_menu_visible = 1;

        }
    };

    getTitle() {
        var titlee = this.location.prepareExternalUrl(this.location.path())



        return titlee
        //   if(titlee.charAt(0) === '#'){
        //       titlee = titlee.slice( 2 );
        //   }
        //   titlee = titlee.split('/').pop();

        //   for(var item = 0; item < this.listTitles.length; item++){
        //       if(this.listTitles[item].path === titlee){
        //           return this.listTitles[item].title;
        //       }
        //   }
        //   return 'Dashboard';
    }
}
