import { APPFunctions } from './app.functions';
import { FBServices } from './firebase.services';
import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, Router, RouterStateSnapshot, RouterLink, RouteConfigLoadStart } from '@angular/router';
import { Observable } from 'rxjs';
declare function require(name: string)
const CryptoJS = require('crypto-js')
const AES = CryptoJS.AES
declare global {
    interface String {
        encrypt(): string
    }
    interface String {
        decrypt(): string
    }
}

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

    route: string = ''
    constructor(
        public fbServices: FBServices,
        public router: Router,
        public func: APPFunctions
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
                String.prototype.encrypt = function () { return AES.encrypt(this, user.uid).toString().replace(/\//g, '*') }
                String.prototype.decrypt = function () { return AES.decrypt(this.replace(/\*/g, '/'), user.uid).toString(CryptoJS.enc.Utf8) }

                let _user = {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    emailVerified: user.emailVerified,
                    _token: user.refreshToken
                }
                this.fbServices.DB.LS.user = JSON.stringify(_user).encrypt()
                this.fbServices.DB.LS._uid = user.uid

                this.fbServices.DB.FB.ref('users').child(user.uid).child('empresa_logada').once('value', empresa_logada => {

                    if (empresa_logada.exists()) {
                        this.fbServices.DB.LS.empresa_logada = JSON.stringify(empresa_logada.val()).encrypt()
                    } else {//nenhuma empresa logada
                        this.fbServices.DB.LS.empresa_logada = JSON.stringify(null).encrypt()
                    }

                    this.fbServices.DB.FB.ref('system').child('keyUser').child(user.uid).once('value', keyUser => {
                        if (keyUser.exists()) {
                            this.fbServices.DB.LS.keyUser = JSON.stringify(keyUser.val()).encrypt()
                            return resolve(true)
                        } else {
                            this.fbServices.DB.LS.keyUser = JSON.stringify(null).encrypt()
                            if (empresa_logada.exists()) {
                                this.fbServices.DB.FB.ref('system').child('route').child('http').child(route).child(empresa_logada.val().cnpjContratoTrabalho).child(user.uid).once('value', auth => {
                                    if (auth.exists()) {
                                        if (auth.val().hasAccess) {
                                            return resolve(true)
                                        } else {
                                            return resolve(false)
                                        }
                                    } else {
                                        return resolve(false)
                                    }
                                })
                            } else {
                                return resolve(false)
                            }
                        }
                    })
                })
            })
        })
    }//canLoad

    public getEmpresaLogada() {
        if (this.fbServices.DB.LS.empresa_logada != undefined) {
            return JSON.parse(this.func.decrypt(this.fbServices.DB.LS.empresa_logada))
        } else {
            return null
        }
    }//getEmpresaLogada

    public getKeyUser() {
        if (this.fbServices.DB.LS.keyUser != undefined) {
            return JSON.parse(this.func.decrypt(this.fbServices.DB.LS.keyUser))
        } else {
            return null
        }
    }//getEmpresaLogada

}