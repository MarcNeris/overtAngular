import { APPFunctions } from './../../app.functions';
import { AuthGuardService } from './../../auth-guard.service';
import { Component, OnInit } from '@angular/core';
import { FBServices } from './../../firebase.services';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-ged-settings',
  templateUrl: './ged-settings.component.html',
  styleUrls: ['./ged-settings.component.scss']
})
export class GedSettingsComponent implements OnInit {

  
  categoriaControl = new FormControl('', [Validators.required]);
  categoria_documento: any
  categorias_documento: any = [
    { id:'documentos_pessoais', nome: 'Documentos Pessoais', descricao: "Documentos Sensíveis", sensibilidade: 'alta' }, 
    { id:'documentos_profissionais', nome: 'Documentos Profissionais', descricao: "Documentos Sensíveis", sensibilidade: 'media' },
  ]
  
  peridiocidadeControl = new FormControl('', [Validators.required]);
  peridiocidade_documento: string
  peridiocidades_documento: any = [
    { id:'anual', nome: 'Anual', descricao: "Documentos emitidos anualmente"}, 
    { id:'mensal', nome: 'Mensal', descricao: "Documentos emitidos mensalmente"}, 
    { id:'diario', nome: 'Diário', descricao: "Documentos emitidos diariamente"}
  ]

  departamentosControl = new FormControl('', [Validators.required]);
  departamentos_documento: any
  lista_departamentos_documento: any[] = ['Contábil', 'Fiscal', 'Financeiro', 'Marketing', 'RH', 'Pessoal'];







  situacao_categoria: boolean = false
  descricao_documento: string

  btnIsDisabled: boolean = false
  cnpj: string = ''

  constructor(
    private fbServices: FBServices,
    private auth: AuthGuardService,
    private func: APPFunctions
  ) { }



  criarCategoria() {
    console.log(this.categoria_documento, this.peridiocidade_documento, this.departamentos_documento, this.situacao_categoria, this.descricao_documento)

  }

  importarCliente() {
    var user = this.auth.getUser()
    console.log(user)
    this.func.importarCliente(this.func.toCnpjId(this.cnpj), user.empresa_ativa.settings.apiKey).then(result => {
      console.log(result)
    })
  }

  ngOnInit() {

    var user = this.auth.getUser()
    console.log(user.empresa_ativa.settings.apiKey)



    // this.fbServices.DB.FB.ref('ged').child('users').child(user.uid).set({
    //   customers:{
    //     a:'a',
    //     b:'b'
    //   }

    // })

  }

}