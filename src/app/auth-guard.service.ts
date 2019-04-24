import { APPFunctions } from './app.functions';
import { FBServices } from './firebase.services';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
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

    interface Object {
        on(obj: object): any
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
        if (isAuthenticated != true) {
            this.router.navigate(['/login'], {
                queryParams: {
                    return: state.url
                }
            })
        }

        return isAuthenticated
    }

    canLoad(route: string) {
        return new Promise(resolve => {
            this.fbServices.auth().onAuthStateChanged(user => {

                if (user) {

                    if (!user.emailVerified) {
                        return resolve(false)
                    }

                    String.prototype.encrypt = function () { return AES.encrypt(this, user.uid).toString().replace(/\//g, '*') }
                    String.prototype.decrypt = function () { return AES.decrypt(this.replace(/\*/g, '/'), user.uid).toString(CryptoJS.enc.Utf8) }

                    let _user = {
                        uid: user.uid,
                        email: user.email,
                        phoneNumber: user.phoneNumber,
                        photoURL: user.photoURL,
                        displayName: user.displayName,
                        emailVerified: user.emailVerified,
                        _token: user.refreshToken
                    }

                    this.fbServices.DB.LS.user = JSON.stringify(_user).encrypt()
                    this.fbServices.DB.LS.uid = JSON.stringify(user.uid).encrypt()

                    this.fbServices.DB.FB.ref('users').child(user.uid).child('http').child('empresa_ativa').once('value', empresa_ativa => {
                        if (empresa_ativa.exists()) {
                            this.fbServices.DB.LS.empresa_ativa = JSON.stringify(empresa_ativa.val()).encrypt()
                        } else {//não existe empresa ativa
                            this.fbServices.DB.LS.empresa_ativa = JSON.stringify(null).encrypt()
                        }
                    })

                    this.fbServices.DB.FB.ref('system').child('users').child('permissions').child(this.func.toEmailId(user.email)).once('value', permissions => {
                        if (permissions.exists()) {
                            this.fbServices.DB.LS.permissions = JSON.stringify(permissions.val()).encrypt()
                        } else {//nenhuma permissao
                            this.fbServices.DB.LS.permissions = JSON.stringify(null).encrypt()
                        }
                    })

                    this.fbServices.DB.FB.ref('users').child(user.uid).child('empresa_logada').once('value', empresa_logada => {

                        if (empresa_logada.exists()) {
                            this.fbServices.DB.LS.empresa_logada = JSON.stringify(empresa_logada.val()).encrypt()
                        } else {//nenhuma empresa logada
                            this.fbServices.DB.LS.empresa_logada = JSON.stringify(null).encrypt()
                        }

                        this.fbServices.DB.FB.ref('system').child('keyUser').child(user.uid).once('value', keyUser => {
                            if (keyUser.exists()) {
                                this.fbServices.DB.LS.isKeyUser = JSON.stringify(true).encrypt()
                                this.fbServices.DB.LS.customers = JSON.stringify(keyUser.val()).encrypt()
                                return resolve(true)
                            } else {
                                this.fbServices.DB.LS.isKeyUser = JSON.stringify(null).encrypt()
                                this.fbServices.DB.LS.customers = JSON.stringify(null).encrypt()
                                if (empresa_logada.exists()) {

                                    let fb_route = this.fbServices.DB.FB.ref('system').child('route').child('http').child(route).child(empresa_logada.val().cnpjContratoTrabalho).child(user.uid)

                                    fb_route.once('value', auth => {
                                        if (!auth.exists()) {
                                            fb_route.update({
                                                hasAccess: true
                                            })
                                            return resolve(false)
                                        } else {
                                            if (auth.val().hasAccess) {
                                                return resolve(true)
                                            } else {
                                                return resolve(false)
                                            }

                                        }
                                    })
                                } else {
                                    this.fbServices.DB.FB.ref(route).child('sitSrv').once('value', sitSrv => {
                                        if (sitSrv.exists()) {
                                            return resolve(true)
                                        } else {
                                            return resolve(false)
                                        }
                                    })
                                }
                            }
                        })
                    })
                } else {
                    return resolve(false)
                }
            })//auth
        })
    }//canLoad
    /**
     * Retorna Usuário Logado
     */
    public getUser(): any {
        if (this.fbServices.DB.LS.user != undefined) {
            try {
                let user: any = JSON.parse(this.func.decrypt(this.fbServices.DB.LS.user))
                user.isKeyUser = JSON.parse(this.func.decrypt(this.fbServices.DB.LS.isKeyUser))
                user.customers = JSON.parse(this.func.decrypt(this.fbServices.DB.LS.customers))
                user.empresa_logada = JSON.parse(this.func.decrypt(this.fbServices.DB.LS.empresa_logada))
                user.empresa_ativa = JSON.parse(this.func.decrypt(this.fbServices.DB.LS.empresa_ativa))
                user.permissions = JSON.parse(this.func.decrypt(this.fbServices.DB.LS.permissions))
                this.fbServices.DB.FB.ref('users').child(user.uid).child('http').update(user)
                return user
            } catch (error) {
                return null
            }

        } else {
            return null
        }
    }

    public getHttpUser() {
        return null
    }

    public getUid() {
        if (this.fbServices.DB.LS.uid != undefined) {
            return JSON.parse(this.func.decrypt(this.fbServices.DB.LS.uid))
        } else {
            return null
        }
    }

    public onEmpresaAtiva(obj: any) {
        return this.fbServices.auth().onAuthStateChanged(user => {
            if (user) {
                this.fbServices.DB.FB.ref('users').child(user.uid).child('http').child('empresa_ativa').on('value', obj)
            }
        })
    }
}