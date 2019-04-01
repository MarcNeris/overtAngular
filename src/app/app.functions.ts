
import { Injectable } from '@angular/core'
import { FBServices } from './firebase.services';
declare function require(name: string)
const CryptoJS = require('crypto-js')
const AES = CryptoJS.AES

@Injectable()

export class APPFunctions {

    constructor(
        private fbServices: FBServices
    ) {

    }

    public encrypt(string: string) {
        return AES.encrypt(string, this.fbServices.DB.LS._uid).toString().replace(/\//g, '*')
    }

    public decrypt(string: string) {

        if (this.fbServices.DB.LS._uid != undefined)
            return AES.decrypt(string.replace(/\*/g, '/'), this.fbServices.DB.LS._uid).toString(CryptoJS.enc.Utf8)

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
        if (this.fbServices.DB.LS.empresaAtiva != undefined) {

            let empresaAtiva = JSON.parse(this.decrypt(this.fbServices.DB.LS.empresaAtiva))
            empresaAtiva.cnpjContrato = this.toCnpjId(JSON.parse(this.decrypt(this.fbServices.DB.LS.empresaAtiva)).cnpj) 
            return empresaAtiva
        } else {
            return null
        }
    }
}
