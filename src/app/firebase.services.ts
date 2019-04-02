
//import { database, app, auth, firestore } from 'firebase';
import { firebase } from '@firebase/app'
import '@firebase/auth'
import '@firebase/firestore'
import '@firebase/database'
import { Router } from '@angular/router'
import { Injectable } from '@angular/core'
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
@Injectable()
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
                //this.DB.FS.collection('users/' + user.uid + '/_token').doc('_token').set({ _token: user.email.encrypt() })

            } else {
                this.DB.LS.clear()
                //this.DB.LS.user = null
                //return this.router.navigate(['/login'])
            }

            this.fnGetCustomers().then(customers => {
                if (customers) {
                    this.DB.LS.customers = JSON.stringify(customers).encrypt()
                }
            })
        })
    }


    canLoad(): void {

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

                //https://overt-hcm.firebaseio.com/system/app/modules/pages/dashboard/customers/10804639000183/users/z9povQBJ5TXYZJCVBhhpLmjJZj53

                console.log(this.router.url)

                this.DB.FB.ref('system').child('app').child('modules').child('pages').child(this.router.url).child('customers').child('10804639000183').child('users').child(user.uid).once('value', auth=>{
                    if(auth.exists()){
                        console.log(auth.val())

                        if(auth.val().access!=true){

                            this.router.navigate(['login'])
                        }

                    }else{

                        this.router.navigate(['login'])
                    }
                })

            } else {

                this.router.navigate(['login'])

            }
        })
    }


    auth() {
        return firebase.auth()
    }

    async  login(email: string, password: string) {
        try {
            await firebase.auth().signInWithEmailAndPassword(email, password).then(user => {
                this.router.navigate(['dashboard'])
            })
        } catch (error) {
            alert("Error!" + error.message)
        }
    }

    async  logout() {
        try {
            await firebase.auth().signOut().then(() => {
                localStorage.clear()
                this.router.navigate(['dashboard'])
            }, (error) => {
                console.warn(error)
            })

        } catch (error) {
            console.warn(error)
        }
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

            if(this.currentUser().uid!=undefined){

                this.DB.FB.ref('system').child('keyUser').child(this.currentUser().uid).child('customers').once('value', customers => {
                    if (customers.exists()) {
    
                        return resolve(customers.val())
                    }
                    else {
                        return resolve()
                    }
                })
            }else{
                resolve(null)
            }
            
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