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
  descricao_categoria: string
}

@Component({
  selector: 'app-ged-settings',
  templateUrl: './ged-settings.component.html',
  styleUrls: ['./ged-settings.component.scss']
})

export class GedSettingsComponent implements OnInit {

  // myControl = new FormControl();
  // options: string[] = ['One', 'Two', 'Three'];

  apiKey: any
  categoriaControl = new FormControl('', [Validators.required]);
  categoria_documento: any
  categorias_documento: any = [
    { id: 'documentos_pessoais', nome: 'Documentos Pessoais', descricao: "Documentos Sensíveis", sensibilidade: 'alta' },
    { id: 'documentos_profissionais', nome: 'Documentos Profissionais', descricao: "Documentos Sensíveis", sensibilidade: 'media' },
  ]

  peridiocidadeControl = new FormControl('', [Validators.required]);

  peridiocidade_documento: string

  peridiocidades_documento: any = [
    { id: 'anual', nome: 'Anual', descricao: "Documentos emitidos anualmente" },
    { id: 'mensal', nome: 'Mensal', descricao: "Documentos emitidos mensalmente" },
    { id: 'diario', nome: 'Diário', descricao: "Documentos emitidos diariamente" }
  ]

  categoriaDocumentoForm: FormGroup

  departamentosControl = new FormControl('', [Validators.required])
  departamentos_documento: any
  lista_departamentos_documento: any[] = [
    { id: 'contabil', nome: 'Contábil' },
    { id: 'fiscal', nome: 'Fiscal' },
    { id: 'financeiro', nome: 'Financeiro' },
    { id: 'marketing', nome: 'Marketing' },
    { id: 'rh', nome: 'RH' },
    { id: 'pessoal', nome: 'Pessoal' }
  ];

  unidades_documento_Control = new FormControl('', [Validators.required])

  situacao_categoria: boolean = false
  descricao_categoria: string

  btnIsDisabled: boolean = false
  cnpj: string = ''

  // public hasError = (controlName: string, errorName: string) => {
  //   return this.categoriaDocumentoForm.controls[controlName].hasError(errorName);
  // }



  constructor(
    private fbServices: FBServices,
    private auth: AuthGuardService,
    private func: APPFunctions
  ) { }



  criarCategoria() {
    var categoria: any = {
      categoria_documento: this.categoria_documento,
      peridiocidade_documento: this.peridiocidade_documento,
      departamentos_documento: this.departamentos_documento,
      situacao_categoria: this.situacao_categoria,
      descricao_categoria: this.descricao_categoria,
      documentos: false
    }

    console.log(this.apiKey)

    this.fbServices.DB.FB.ref('ged').child('customers').child(this.apiKey).child(this.categoria_documento).update(categoria).catch(error => {
      console.warn(error)
    }).then(() => {
      console.log('ok')
    })

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
    if (user.empresa_ativa) {
      if (user.empresa_ativa.settings.apiKey) {
        this.apiKey = user.empresa_ativa.settings.apiKey
      } else {
        this.apiKey = user.uid
      }
    } else {
      this.apiKey = user.uid
    }

    this.categoriaDocumentoForm = new FormGroup({
      categoria_documento: new FormControl('', [Validators.required]),
      departamentos_documento: new FormControl('', [Validators.required]),
      peridiocidade_documento: new FormControl('', [Validators.required]),
      unidades_documento: new FormControl('', [Validators.required]),
      situacao_categoria: new FormControl('', [Validators.required]),
      descricao_categoria: new FormControl('', [Validators.required]),
      // apiKey: new FormControl('', [Validators.required]),
    })
  }

}