import { FBServices } from './firebase.services';
import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, Router, RouterStateSnapshot, RouterLink, RouteConfigLoadStart } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

    route: string = ''
    constructor(
        public fbServices: FBServices,
        public router: Router
    ) {

    }

    async canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot)/*: Observable<boolean> | boolean*/ {
        var isAuthenticated: boolean
        await this.canLoad(state.url).then(result => {
            isAuthenticated = (result == true)
        })
        return isAuthenticated
    }
   

    canLoad(route) {
        return new Promise(resolve => {
            this.fbServices.auth().onAuthStateChanged(user => {
                this.fbServices.DB.FB.ref('system').child('app').child('modules').child('pages').child(route).child('customers').child('10804639000183').child('users').child(user.uid).once('value', auth => {
                    if (auth.exists()) {
                        if (auth.val().access) {
                            resolve(true)
                        } else {
                            resolve(false)
                        }
                    } else {
                        resolve(false)
                    }
                })
            })
        })

        // return this.fbServices.auth().onAuthStateChanged(user => {

        //     if (user) {

        //         // this.fbServices.fnGetCustomers().then(customers => {

        //         //     console.log(this.router.url)
        //         //     console.log(customers)
        //         //     if (customers) {

        //         //     } else {

        //         //     }
        //         // })


        //         let hasPermission = (user) => {

        //             var result = this.fbServices.DB.FB.ref('system').child('app').child('modules').child('pages').child(this.router.url).child('customers').child('10804639000183').child('users').child(user.uid).once('value', auth => {

        //                 if (auth.exists()) {
        //                     if (auth.val().access) {
        //                         return true
        //                     } else {
        //                         return false
        //                     }
        //                 } else {
        //                     return false
        //                 }
        //             })

        //             return result
        //         }

        //         let x = hasPermission(user)

        //         console.log(x)

        //         return hasPermission(user)

        //     } else {
        //         return false
        //     }

        // })


    }





}