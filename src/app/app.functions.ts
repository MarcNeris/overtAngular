
import { Injectable } from '@angular/core'
import { FBServices } from './firebase.services'
import { HttpClient } from '@angular/common/http'
import { resolve } from 'url';
declare function require(name: string)
const CryptoJS = require('crypto-js')
const AES = CryptoJS.AES

@Injectable()

export class APPFunctions {

    constructor(
        private fbServices: FBServices,
        private httpClient: HttpClient,
    ) {

    }

    public async soap(args) {
        var params = this.encrypt(JSON.stringify(args))
        var wsdl = `https://overt-hcm.appspot.com/services/erp/params=${params},uid=${this.fbServices.DB.LS._uid}`
        return await new Promise(resolve => {
            console.log(wsdl)
            this.httpClient.get(wsdl).subscribe((res) => {
                resolve(res)
            })
        })
    }

    public encrypt(string: string) {
        try {
            if (this.fbServices.DB.LS._uid != undefined)
                return AES.encrypt(string, this.fbServices.DB.LS._uid).toString().replace(/\//g, '*')
        } catch (error) {

        }
    }

    public decrypt(string: string) {
        try {
            if (this.fbServices.DB.LS._uid != undefined)
                return AES.decrypt(string.replace(/\*/g, '/'), this.fbServices.DB.LS._uid).toString(CryptoJS.enc.Utf8)
        } catch (error) {

        }
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

    public getEmpresaAtiva() {
        try {
            if (this.fbServices.DB.LS.empresaAtiva != undefined) {
                let empresaAtiva = JSON.parse(this.decrypt(this.fbServices.DB.LS.empresaAtiva))
                empresaAtiva.cnpjContrato = this.toCnpjId(JSON.parse(this.decrypt(this.fbServices.DB.LS.empresaAtiva)).cnpj)
                return empresaAtiva
            } else {
                return null
            }
        } catch (error) {

        }
    }
}
