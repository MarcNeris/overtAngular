//import { database, app, auth, firestore } from 'firebase';
import { firebase } from '@firebase/app'
import '@firebase/auth'
import '@firebase/firestore'
import '@firebase/database'
import { Router } from '@angular/router'
import { Injectable } from '@angular/core'
import { async } from '@firebase/util';

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
        values(obj: object): any
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

    public navigateTo: string

    public DB = {
        LS: localStorage,
        FB: firebase.database(),
        FS: firebase.firestore()
    }

    constructor(
        public route: Router
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

            // this.fnGetCustomers('ss').then(customers => {
            //     if (customers) {
            //         this.DB.LS.customers = JSON.stringify(customers).encrypt()
            //     }
            // })
        })
    }

    public toCnpjId(string: string) {
        return ("00000000000000" + string.toLowerCase().replace(/[^0-9]+/g, "")).slice(-14)
    }

    public toEmailId(string: string) {
        return string.toLowerCase().replace(/\./g, "-").replace(/[^a-zA-Z0-9@]+/g, "-")
    }

    public toCpfId(string: string) {
        return ("00000000000" + string.toLowerCase().replace(/[^0-9]+/g, "")).slice(-11)
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
                            code: 8,
                            hasError: true,
                            message: `O email ${user.email} já está validado!`
                        })
                    }
                    user.sendEmailVerification().then(() => {

                        return resolve({
                            code: 9,
                            message: 'Enviamos istruções para verificação de seu email. Este email pode ter sido considerado um spam.',
                            hasError: null
                        })

                    }).catch(error => {

                        if (error.code == 'auth/too-many-requests') {
                            return resolve({
                                code: 10,
                                hasError: true,
                                message: 'Bloqueamos o envio de email, muitas requisições por minuto, tente novamente mais tarde.'
                            })
                        }
                    })
                } else {
                    return resolve({
                        code: null,
                        hasError: true,
                        message: 'Nenhum usuário está Logado'
                    })
                }
            })
        })
    }
    

    public auth() {
        return firebase.auth()
    }


    public login(email: string, password: string, navigateTo: string = null) {
        return new Promise(resolve => {
            firebase.auth().signInWithEmailAndPassword(email, password).then(result => {
                let user = result.user
                if (user.emailVerified) {
                    this.navigateTo = navigateTo
                    resolve({
                        code: 1,
                        hasError: null,
                        user: user,
                        message: ''
                    })
                    return this.route.navigate([this.navigateTo])
                } else {
                    resolve({
                        code: 2,
                        hasError: true,
                        user: user,
                        message: 'Você logou, mas seu email ainda não foi verificado.'
                    })
                }
            }).catch(error => {
                let result: any
                if (error.code == 'auth/user-not-found') {
                    result = {
                        code: 3,
                        hasError: true,
                        message: 'Seu email não foi encontrato em nossos registros, verifique ou crie uma nova conta.'
                    }
                }
                else if (error.code == 'auth/wrong-password') {
                    result = {
                        code: 4,
                        hasError: true,
                        message: 'Seu login e senha não combinam.'
                    }
                }
                else if (error.code == 'auth/invalid-email') {

                    result = {
                        code: 5,
                        hasError: true,
                        message: 'Seu email parece estar errado.'
                    }
                }
                resolve(result)
            })
        })
    }


    public sendPasswordResetEmail = (email) => {
        return new Promise(resolve => {
            this.auth().sendPasswordResetEmail(email).then(() => {
                let result: any = {
                    code: 6,
                    hasError: null,
                    message: `Enviamos instruções de como recuperar a sua senha para '${email}' verifique sua caixa de entrada, ou spam.`
                }
                return resolve(result)
            }).catch(() => {
                let result: any = {
                    code: 7,
                    hasError: true,
                    message: 'Ocorreu um erro ao enviar o email, tente novamente.'
                }
                return resolve(result)
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


    public fnGetCustomers(user: any) {
        return new Promise(resolve => {
            if (user) {
                this.DB.FB.ref('system').child('keyUser').child(user.uid).once('value', keyUser => {
                    if (keyUser.exists()) {
                        let fnGetCusstomers = async (customers: object) => {
                            var data: any = []
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

                        let customers: object = keyUser.val()
                        return resolve(fnGetCusstomers(customers))
                    }
                    else {
                        return resolve(null)
                    }
                })

            } else {//não é Key User
                resolve(null)
            }
        })

    }


    public fnGetEmployees(user: any) {
        return new Promise(resolve => {
            if (user.isKeyUser) {
                if (user.empresa_ativa) {
                    if (user.empresa_ativa.cnpj) {
                        this.DB.FB.ref('employees').child(this.toCnpjId(user.empresa_ativa.cnpj)).on('value', employees => {
                            if (employees.exists()) {
                                var data = []
                                for (let cpf in employees.val()) {
                                    let employee = employees.val()[cpf]
                                    for (let key in employee) {
                                        let value = employee[key]
                                        data.push(value)
                                    }
                                }
                                return resolve(data)
                            } else {
                                resolve(null)
                            }
                        })
                    } else {
                        resolve(null)
                    }
                } else if (user.empresa_logada) {
                    if (user.empresa_logada.cnpjContratoTrabalho) {

                        this.DB.FB.ref('employees').child(this.toCnpjId(user.empresa_logada.cnpjContratoTrabalho)).on('value', employees => {
                            if (employees.exists()) {
                                var data = []
                                for (let cpf in employees.val()) {
                                    let employee = employees.val()[cpf]
                                    for (let key in employee) {
                                        let value = employee[key]
                                        data.push(value)
                                    }
                                }
                                return resolve(data)
                            } else {
                                resolve(null)
                            }
                        })
                    } else {
                        return resolve(null)
                    }
                } else {
                    this.route.navigate(['customers'])
                    return resolve(null)
                }

            } else {

                if (user.empresa_logada) {
                    return resolve([user.empresa_logada])
                } else {
                    return resolve(null)
                }
            }
        })//return
    }



}