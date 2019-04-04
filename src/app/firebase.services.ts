
//import { database, app, auth, firestore } from 'firebase';
import { firebase } from '@firebase/app'
import '@firebase/auth'
import '@firebase/firestore'
import '@firebase/database'
import { Router } from '@angular/router'
import { Injectable } from '@angular/core'
import { CanActivate } from '@angular/router';

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



firebase.initializeApp({
    apiKey: "AIzaSyDG9WAEdoJwZuYaRurTIDokgVO_O9P7nyQ",
    authDomain: "overt-hcm.firebaseapp.com",
    databaseURL: "https://overt-hcm.firebaseio.com",
    projectId: "overt-hcm",
    storageBucket: "overt-hcm.appspot.com",
    messagingSenderId: "249853571178"
})

//firebase.firestore().enablePersistence()
//firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
@Injectable({
    providedIn: 'root'
})
export class FBServices {



    public online: boolean

    public DB = {
        LS: localStorage,
        FB: firebase.database(),
        FS: firebase.firestore()
    }

    constructor(
        public router: Router,
    ) {
        firebase.auth().onAuthStateChanged(user => {

            if (user) {

                String.prototype.encrypt = function () { return AES.encrypt(this, user.uid).toString().replace(/\//g, '*') }
                String.prototype.decrypt = function () { return AES.decrypt(this.replace(/\*/g, '/'), user.uid).toString(CryptoJS.enc.Utf8) }

                let _user = {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    emailVerified: user.emailVerified,
                    _token: user.refreshToken
                }
                this.DB.LS.user = JSON.stringify(_user).encrypt()
                this.DB.LS._uid = user.uid
            } else {
                this.DB.LS.clear()
            }

            this.fnGetCustomers().then(customers => {
                if (customers) {
                    this.DB.LS.customers = JSON.stringify(customers).encrypt()
                }
            })
        })
    }

    public getCurrentUser(): any {
        return new Promise(resolve => {
            this.auth().onAuthStateChanged(user => {
                return resolve(user)
            })
        })
    }

    public sendEmailVerification() {

        return new Promise(resolve => {

            this.getCurrentUser().then(user => {

                if (user) {

                    if (user.emailVerified) {
                        return resolve({
                            code: 0,
                            hasError: `O email ${user.email} já está validado!`
                        })
                    }
                    user.sendEmailVerification().then(() => {

                        let result = {
                            code: 1,
                            hasSuccess: 'Enviamos istruções para verificação de seu email. Nosso email pode ter sido considerado um spam.',
                            emailVerifyHasSent: true
                        }
                        return resolve(result)

                    }).catch(error => {

                        if (error.code == 'auth/too-many-requests') {
                            var hasError = 'Bloqueamos o envio de email, muitas requisições por minuto, tente novamente mais tarde.'
                        }

                        let result = {
                            code: 2,
                            hasError: hasError
                        }
                        return resolve(result)
                    })
                } else {
                    return resolve({
                        code: 3,
                        hasError: 'Nenhum usuário está Logado'
                    })
                }
            })
        })
    }


    public canLoad(): void {

        // firebase.auth().onAuthStateChanged(user => {

        //     if (user) {

        //         String.prototype.encrypt = function () { return AES.encrypt(this, user.uid).toString().replace(/\//g, '*') }
        //         String.prototype.decrypt = function () { return AES.decrypt(this.replace(/\*/g, '/'), user.uid).toString(CryptoJS.enc.Utf8) }

        //         let _user = {
        //             uid: user.uid,
        //             email: user.email,
        //             displayName: user.displayName,
        //             emailVerified: user.emailVerified,
        //             _token: user.refreshToken
        //         }

        //         this.DB.LS.user = JSON.stringify(_user).encrypt()
        //         this.DB.LS._uid = user.uid

        //         this.fnGetCustomers().then(customers => {
        //             console.log(this.router.url)
        //             console.log(customers)
        //             if (customers) {

        //             } else {
        //                 this.router.navigate(['login'])
        //             }
        //         })
        //         //xxx


        //         this.DB.FB.ref('system').child('app').child('modules').child('pages').child(this.router.url).child('customers').child('10804639000183').child('users').child(user.uid).once('value', auth => {

        //             if (auth.exists()) {

        //                 console.log(auth.val())

        //                 if (auth.val().access != true) {

        //                     //this.router.navigate(['login'])
        //                 }

        //             } else {

        //                 //this.router.navigate(['login'])
        //             }
        //         })

        //     } else {

        //         //this.router.navigate(['login'])

        //     }
        // })
    }


    public auth() {
        return firebase.auth()
    }

    public async  login(email: string, password: string) {
        try {
            await firebase.auth().signInWithEmailAndPassword(email, password).then(user => {
                this.router.navigate([''])
            })
        } catch (error) {
            alert("Error!" + error.message)
        }
    }


    public sendPasswordResetEmail = () => {
        return new Promise(resolve => {
            this.getCurrentUser().then(user => {
                if (user) {
                    this.auth().sendPasswordResetEmail(user.email).then(() => {
                        let result: any = {
                            code: 1,
                            hasSuccess: `Enviamos instruções de como recuperar a sua senha para '${user.email}' verifique sua caixa de entrada, ou spam.`
                        }
                        return resolve(result)
                    }).catch(error => {
                        let result: any = {
                            code: 2,
                            hasError: 'Ocorreu um erro ao enviar o email, tente novamente.'
                        }
                        return resolve(result)
                    })
                } else {
                    let result: any = {
                        code: 3,
                        hasError: 'Nenhum usuário está logado.'
                    }
                    resolve(result)
                }
            })
        })
    }


    public logout() {
        return firebase.auth().signOut().then(() => {
            localStorage.clear()
            window.location.reload()
        }, (error) => {
            console.warn(error)
        })

    }


    public isOnline() {
        this.DB.FB.ref('.info/connected').on('value', isOnline => {
            if (isOnline.val() == true) {
                this.DB.LS.isOnline = 'true'
                this.online = true
            } else {
                this.DB.LS.isOnline = 'false'
                this.online = false
            }
        })
        return this.online
    }


    public currentUser() {

        if (this.DB.LS.user != undefined) {
            return JSON.parse(AES.decrypt(this.DB.LS.user.replace(/\*/g, '/'), this.DB.LS._uid).toString(CryptoJS.enc.Utf8))
        } else {
            return false
        }
    }

    public fireDB() {
        return this.DB
    }


    public fnGetCustomers() {

        return new Promise(resolve => {

            this.getCurrentUser().then(user => {

                if (user) {

                    this.DB.FB.ref('system').child('keyUser').child(user.uid).child('customers').once('value', cnpj => {

                        if (cnpj.exists()) {

                            let fnGetCustomers = async (customers: object) => {
                                var data = []
                                for (let customer in customers) {
                                    if (customers[customer].sitUsu == true) {
                                        await this.DB.FB.ref('customers').child(customers[customer].cnpj).once('value', customer => {
                                            if (customer.exists()) {
                                                data.push(customer.val())
                                            }
                                        })
                                    }
                                }
                                return data
                            }

                            let customers: object = cnpj.val()

                            return resolve(fnGetCustomers(customers))
                        }
                        else {
                            return resolve(null)
                        }
                    })

                } else {
                    resolve(null)
                }
            })
        })
    }

    // public async fnCountEmployees() {

    //     var numEmployees = 0
    //     this.DB.FB.ref('rep').child('employees/10804639000183').once('value', employes => {

    //         for(let key in employes.val() ){
    //             numEmployees++
    //             console.log(key)
    //         }


    //     })


    //     return numEmployees


    // }



}