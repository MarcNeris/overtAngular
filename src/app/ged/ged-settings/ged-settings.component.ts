import { APPFunctions } from './../../app.functions';
import { AuthGuardService } from './../../auth-guard.service';
import { Component, OnInit } from '@angular/core';
import { FBServices } from './../../firebase.services';
import { FormControl, Validators, FormGroup } from '@angular/forms';



type categoria = {
  apiKey: string
  categoria_documento: string
  peridiocidade_documento: string
  departamentos_documento: any
  situacao_categoria: boolean
  descricao_documento: string
}

@Component({
  selector: 'app-ged-settings',
  templateUrl: './ged-settings.component.html',
  styleUrls: ['./ged-settings.component.scss']
})

export class GedSettingsComponent implements OnInit {

  categoriaDocumentoForm = new FormGroup({
    categoria_documento: new FormControl('', [Validators.required]),
    departamentos_documento: new FormControl('', [Validators.required]),
    peridiocidade_documento: new FormControl('', [Validators.required]),
    clientes_documento: new FormControl('', [Validators.required]),
    situacao_categoria: new FormControl('', [Validators.required]),
    descricao_documento: new FormControl('', [Validators.required]),
  })

  apiKey: string

  categoria_documento: any
  categorias_documento: any = [
    { id: 'documentos_pessoais', nome: 'Documentos Pessoais', descricao: "Documentos Sensíveis", sensibilidade: 'alta' },
    { id: 'documentos_profissionais', nome: 'Documentos Profissionais', descricao: "Documentos Sensíveis", sensibilidade: 'media' },
  ]

  peridiocidade_documento: string
  peridiocidades_documento: any = [
    { id: 'YYYY', nome: 'Anual', descricao: "Documentos emitidos anualmente" },
    { id: 'MM', nome: 'Mensal', descricao: "Documentos emitidos mensalmente" },
    { id: 'DD', nome: 'Diário', descricao: "Documentos emitidos diariamente" }
  ]

  departamentos_documento: any
  lista_departamentos_documento: any[] = [
    { id: 'contabil', nome: 'Contábil' },
    { id: 'fiscal', nome: 'Fiscal' },
    { id: 'financeiro', nome: 'Financeiro' },
    { id: 'marketing', nome: 'Marketing' },
    { id: 'rh', nome: 'RH' },
    { id: 'pessoal', nome: 'Pessoal' }
  ];

  clientes_documento: any
  lista_clientes_documento: any

  situacao_categoria: boolean = false
  descricao_documento: string

  btnIsDisabled: boolean = false
  cnpj: string = ''


  constructor(
    private fbServices: FBServices,
    private auth: AuthGuardService,
    private func: APPFunctions
  ) { }

  fnCriarDocumento() {
    var categoria: any = {
      categoria_documento: this.categoria_documento,
      peridiocidade_documento: this.peridiocidade_documento,
      departamentos_documento: this.departamentos_documento,
      situacao_categoria: this.situacao_categoria,
      clientes_documento: this.clientes_documento,
      descricao_documento: this.descricao_documento,
      documentos: false
    }

    console.log(categoria)

    // this.fbServices.DB.FB.ref('ged').child('customers').child(this.apiKey).child(this.categoria_documento).update(categoria).catch(error => {
    //   console.warn(error)
    // }).then(() => {
    //   console.log('ok')
    // })

  }

  importarCliente() {
    var user = this.auth.getUser()
    console.log(user)
    if (this.apiKey) {
      this.func.importarCliente(this.func.toCnpjId(this.cnpj), this.apiKey).then(result => {
        console.log(result)
      })
    }
  }

  ngOnInit() {

    var user: any = this.auth.getUser()

    console.log(user)
    console.log(user.empresa_ativa._apiKey.apiKey)

    if (user.empresa_ativa) {
      if (user.empresa_ativa._apiKey) {
        if (user.empresa_ativa._apiKey.apiKey) {
          this.apiKey = user.empresa_ativa._apiKey.apiKey
        } else {
          this.apiKey = user.uid
        }
      } else {
        this.apiKey = user.uid
      }
    } else {
      this.apiKey = user.uid
    }
    /**
     *  
     */
    this.fbServices.DB.FB.ref('clients').child(this.apiKey).once('value', clients => {
      if (clients.exists()) {
        this.lista_clientes_documento = []
        Object.values(clients.val()).forEach(client => {
          this.lista_clientes_documento.push({
            nome: client.nome,
            cnpj: this.func.toCnpjId(client.cnpj) 
          })
        })
      }
    })

  }

}