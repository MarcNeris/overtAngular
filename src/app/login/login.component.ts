import { FBServices } from './../firebase.services';
import { Component, OnInit, Pipe, PipeTransform, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  private email: string
  private password: string
  private navigateTo: string
  private header: string = "Login"
  private placeholderEmail: string = "Email"
  private placeholderSenha: string = "Senha"


  // pdfEncode: string = 'data:application/octet-stream;base64,'
  // pdf: string = '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IDMzMyAxMDAwIDU1NiAzMzMgOTQ0IDc1MCA1MDAgNjY3IDI3OCAzMzMgNTU2CjU1NiA1NTYgNTU2IDI4MCA1NTYgMzMzIDczNyAzNzAgNTU2IDU4NCAzMzMgNzM3IDU1MiA0MDAgNTQ5IDMzMyAzMzMgMzMzIDU3Ngo1NTYgMzMzIDMzMyAzMzMgMzY1IDU1NiA4MzQgODM0IDgzNCA2MTEgNzIyIDcyMiA3MjIgNzIyIDcyMiA3MjIgMTAwMCA3MjIgNjY3CjY2NyA2NjcgNjY3IDI3OCAyNzggMjc4IDI3OCA3MjIgNzIyIDc3OCA3NzggNzc4IDc3OCA3NzggNTg0IDc3OCA3MjIgNzIyIDcyMgo3MjIgNjY3IDY2NyA2MTEgNTU2IDU1NiA1NTYgNTU2IDU1NiA1NTYgODg5IDU1NiA1NTYgNTU2IDU1NiA1NTYgMjc4IDI3OCAyNzgKMjc4IDYxMSA2MTEgNjExIDYxMSA2MTEgNjExIDYxMSA1NDkgNjExIDYxMSA2MTEgNjExIDYxMSA1NTYgNjExIF0NCmVuZG9iag0KOCAwIG9iaiANPDwNCi9UeXBlL0ZvbnREZXNjcmlwdG9yCi9Gb250TmFtZS9BcmlhbCxCb2xkCi9Bc2NlbnQgNzI4Ci9DYXBIZWlnaHQgNTAwCi9EZXNjZW50IC0yMTAKL0ZsYWdzIDMyCi9Gb250QkJveCBbLTYyOCAtMzc2IDIwMDAgMTA1Nl0KL0l0YWxpY0FuZ2xlIDAKL1N0ZW1WIDAKL0F2Z1dpZHRoIDQ3OQovTGVhZGluZyAxNTAKL01heFdpZHRoIDAKL1hIZWlnaHQgMjUwDQo+PiANZW5kb2JqDQo5IDAgb2JqIA08PA0KL1R5cGUvRm9udAovU3VidHlwZS9UcnVlVHlwZQovQmFzZUZvbnQvQXJpYWwsQm9sZAovRW5jb2RpbmcgMiAwIFIKL0ZpcnN0Q2hhciAzMA0KL0xhc3RDaGFyIDI1NQ0KL1dpZHRocyA3IDAgUg0KL0ZvbnREZXNjcmlwdG9yIDggMCBSDQo+PiANZW5kb2JqDQoxMCAwIG9iag0KWyA3NTAgNzUwIDI3OCAyNzggMzU1IDU1NiA1NTYgODg5IDY2NyAxOTEgMzMzIDMzMyAzODkgNTg0IDI3OCAzMzMgMjc4IDI3OCA1NTYKNTU2IDU1NiA1NTYgNTU2IDU1NiA1NTYgNTU2IDU1NiA1NTYgMjc4IDI3OCA1ODQgNTg0IDU4NCA1NTYgMTAxNSA2NjcgNjY3IDcyMgo3MjIgNjY3IDYxMSA3NzggNzIyIDI3OCA1MDAgNjY3IDU1NiA4MzMgNzIyIDc3OCA2NjcgNzc4IDcyMiA2NjcgNjExIDcyMiA2NjcKOTQ0IDY2NyA2NjcgNjExIDI3OCAyNzggMjc4IDQ2OSA1NTYgMzMzIDU1NiA1NTYgNTAwIDU1NiA1NTYgMjc4IDU1NiA1NTYgMjIyCjIyMiA1MDAgMjIyIDgzMyA1NTYgNTU2IDU1NiA1NTYgMzMzIDUwMCAyNzggNTU2IDUwMCA3MjIgNTAwIDUwMCA1MDAgMzM0IDI2MAozMzQgNTg0IDc1MCA1NTYgNzUwIDIyMiA1NTYgMzMzIDEwMDAgNTU2IDU1NiAzMzMgMTAwMCA2NjcgMzMzIDEwMDAgNzUwIDYxMSA3NTAKNzUwIDIyMiAyMjIgMzMzIDMzMyAzNTAgNTU2IDEwMDAgMzMzIDEwMDAgNTAwIDMzMyA5NDQgNzUwIDUwMCA2NjcgMjc4IDMzMyA1NTYKNTU2IDU1NiA1NTYgMjYwIDU1NiAzMzMgNzM3IDM3MCA1NTYgNTg0IDMzMyA3MzcgNTUyIDQwMCA1NDkgMzMzIDMzMyAzMzMgNTc2CjUzNyAzMzMgMzMzIDMzMyAzNjUgNTU2IDgzNCA4MzQgODM0IDYxMSA2NjcgNjY3IDY2NyA2NjcgNjY3IDY2NyAxMDAwIDcyMiA2NjcKNjY3IDY2NyA2NjcgMjc4IDI3OCAyNzggMjc4IDcyMiA3MjIgNzc4IDc3OCA3NzggNzc4IDc3OCA1ODQgNzc4IDcyMiA3MjIgNzIyCjcyMiA2NjcgNjY3IDYxMSA1NTYgNTU2IDU1NiA1NTYgNTU2IDU1NiA4ODkgNTAwIDU1NiA1NTYgNTU2IDU1NiAyNzggMjc4IDI3OAoyNzggNTU2IDU1NiA1NTYgNTU2IDU1NiA1NTYgNTU2IDU0OSA2MTEgNTU2IDU1NiA1NTYgNTU2IDUwMCA1NTYgXQ0KZW5kb2JqDQoxMSAwIG9iaiANPDwNCi9UeXBlL0ZvbnREZXNjcmlwdG9yCi9Gb250TmFtZS9BcmlhbAovQXNjZW50IDcyOAovQ2FwSGVpZ2h0IDUwMAovRGVzY2VudCAtMjEwCi9GbGFncyAzMgovRm9udEJCb3ggWy02NjUgLTMyNSAyMDAwIDEwNDBdCi9JdGFsaWNBbmdsZSAwCi9TdGVtViAwCi9BdmdXaWR0aCA0NDEKL0xlYWRpbmcgMTUwCi9NYXhXaWR0aCAwCi9YSGVpZ2h0IDI1MA0KPj4gDWVuZG9iag0KMTIgMCBvYmogDTw8DQovVHlwZS9Gb250Ci9TdWJ0eXBlL1RydWVUeXBlCi9CYXNlRm9udC9BcmlhbAovRW5jb2RpbmcgMiAwIFIKL0ZpcnN0Q2hhciAzMA0KL0xhc3RDaGFyIDI1NQ0KL1dpZHRocyAxMCAwIFINCi9Gb250RGVzY3JpcHRvciAxMSAwIFINCj4+IA1lbmRvYmoNCjEzIDAgb2JqDQpbIDYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMAo2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAKNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwCjYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMAo2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAKNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwCjYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMAo2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAKNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwCjYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMAo2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAKNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwIDYwMCA2MDAgNjAwIF0NCmVuZG9iag0KMTQgMCBvYmogDTw8DQovVHlwZS9Gb250RGVzY3JpcHRvcgovRm9udE5hbWUvQ291cmllck5ldwovQXNjZW50IDYxMwovQ2FwSGVpZ2h0IDUwMAovRGVzY2VudCAtMTg4Ci9GbGFncyAzMgovRm9udEJCb3ggWy0xMjIgLTY4MCA2MjMgMTAyMV0KL0l0YWxpY0FuZ2xlIDAKL1N0ZW1WIDAKL0F2Z1dpZHRoIDYwMAovTGVhZGluZyAxMzMKL01heFdpZHRoIDAKL1hIZWlnaHQgMjUwDQo+PiANZW5kb2JqDQoxNSAwIG9iaiANPDwNCi9UeXBlL0ZvbnQKL1N1YnR5cGUvVHJ1ZVR5cGUKL0Jhc2VGb250L0NvdXJpZXJOZXcKL0VuY29kaW5nIDIgMCBSCi9GaXJzdENoYXIgMzANCi9MYXN0Q2hhciAyNTUNCi9XaWR0aHMgMTMgMCBSDQovRm9udERlc2NyaXB0b3IgMTQgMCBSDQo+PiANZW5kb2JqDQoyIDAgb2JqIA08PA0KL1R5cGUvRW5jb2RpbmcvRGlmZmVyZW5jZXMKWzEyOCAvRXVyb10vQmFzZUVuY29kaW5nL1dpbkFuc2lFbmNvZGluZw0KPj4gDWVuZG9iag0KNiAwIG9iaiANPDwNCi9Qcm9jU2V0IFsvUERGL1RleHQvSW1hZ2VDXQ0KL0ZvbnQgPDwgL0YxIDkgMCBSDQovRjIgMTIgMCBSDQovRjMgMTUgMCBSID4+DQo+PiANZW5kb2JqDQo1IDAgb2JqIA08PA0KL1R5cGUvUGFnZXMNCi9LaWRzIFsgNCAwIFIgXQ0KL0NvdW50IDENCj4+IA1lbmRvYmoNCjE2IDAgb2JqIA08PA0KL1R5cGUvQ2F0YWxvZw0KL1BhZ2VzIDUgMCBSDQovUGFnZU1vZGUvVXNlTm9uZQ0KPj4gDWVuZG9iag0KeHJlZg0KMCAxNw0KMDAwMDAwMDAwMCA2NTUzNSBmDQowMDAwMDAwMDQyIDAwMDAwIG4NCjAwMDAwMDUyMzQgMDAwMDAgbg0KMDAwMDAwMDI4NiAwMDAwMCBuDQowMDAwMDAxMTg2IDAwMDAwIG4NCjAwMDAwMDU0MjkgMDAwMDAgbg0KMDAwMDAwNTMyOCAwMDAwMCBuDQowMDAwMDAxMjk4IDAwMDAwIG4NCjAwMDAwMDIyMjYgMDAwMDAgbg0KMDAwMDAwMjQ1MyAwMDAwMCBuDQowMDAwMDAyNjEyIDAwMDAwIG4NCjAwMDAwMDM1NDIgMDAwMDAgbg0KMDAwMDAwMzc2NSAwMDAwMCBuDQowMDAwMDAzOTIyIDAwMDAwIG4NCjAwMDAwMDQ4NDUgMDAwMDAgbg0KMDAwMDAwNTA3MiAwMDAwMCBuDQowMDAwMDA1NDk0IDAwMDAwIG4NCnRyYWlsZXIKPDwKL1NpemUgMTcNCi9Sb290IDE2IDAgUg0KL0lEWzw1NjUwNTg0NDUyNDc0ZjQ4NTk1MzU4NTQ1YTU1NDE0NT48NTY1MDU4NDQ1MjQ3NGY0ODU5NTM1ODU0NWE1NTQxNDU+XQ0KL0luZm8gMSAwIFINCj4+DQpzdGFydHhyZWYNCjU1NjgNCiUlRU9GDQo='

  // private isLoggedIn: any = false
  // private hasPicture: any = false
  // private hasVerifiedEmail: any = false

  private hasError: any = {
    code: null,
    message: '',
    hasError: null
  }

  private user: any = {
    displayName: null,
    email: null,
    uid: null,
    emailVerified: null
  }

  constructor(
    private fbServices: FBServices,
    private router: Router,
    private route: ActivatedRoute,
    private element: ElementRef
  ) {

  }

  private fnVerificarEmail() {
    this.fbServices.sendEmailVerification().then(result => {
      this.hasError = result
    })
  }

  private fnRecuperarSenha() {
    return this.fbServices.sendPasswordResetEmail(this.email).then(result => {
      this.hasError = result
    })
  }

  private fnEntrar() {



    // this.fbServices.getCurrentUser().then(user => {
    //   if (user) {
    //     console.log(user.emailVerified)
    //     this.user = user
    //     if (user.emailVerified) {
    //       this.route.queryParams.subscribe(params => this.navigateTo = params['return'] || '')
    //       this.router.navigate([this.navigateTo])
    //       this.hasError = {
    //         code: 1,
    //         hasError: null,
    //         message: ''
    //       }
    //     } else {
    //       this.hasError = {
    //         code: 2,
    //         hasError: true,
    //         message: 'Você logou, mas seu email ainda não foi verificado.'
    //       }
    //     }
    //   }
    // })
    window.location.reload()
  }

  private fnCriarConta() {
    this.route.queryParams.subscribe(params => this.navigateTo = params['return'] || '')
    this.header = "Nova Conta"
    this.placeholderEmail = "Informe seu email"
    this.placeholderSenha = "Crie uma senha"
    this.fbServices.fnCriarConta(this.email, this.password, this.navigateTo).then(result => {
      var hasError: any = result
      this.hasError = hasError
      if (hasError.user) {
        this.user = hasError.user
      }
    })
  }

  private fnLogin() {
    this.header = "Login"
    this.placeholderEmail = "Email"
    this.placeholderSenha = "Senha"
    this.route.queryParams.subscribe(params => this.navigateTo = params['return'] || '')
    this.fbServices.login(this.email, this.password, this.navigateTo).then(result => {
      var hasError: any = result
      this.hasError = hasError
      if (hasError.user) {
        this.user = hasError.user
      }
    })
  }

  private fnLogout() {
    return this.fbServices.logout()
  }

  ngOnInit() {
    this.fbServices.getCurrentUser().then(user => {
      if (user) {
        this.user = user
        if (user.emailVerified) {
          this.route.queryParams.subscribe(params => this.navigateTo = params['return'] || '')
          this.router.navigate([this.navigateTo])
          this.hasError = {
            code: 1,
            hasError: null,
            message: ''
          }
        } else {
          this.hasError = {
            code: 2,
            hasError: true,
            message: 'Você logou, mas seu email ainda não foi verificado.'
          }
        }
      }
    })
  }

  ngAfterViewInit() {

    if (this.router.url.includes("login")) {
      // document.getElementsByClassName('sidebar')[0].remove()
      // document.getElementsByClassName('navbar-toggler')[0].remove()
      // document.getElementsByClassName('navbar')[0].remove()
    }else{
      // const toggleButton = this.toggleButton;
        // const body = document.getElementsByTagName('body')[0];
        // setTimeout(function () {
        //     toggleButton.classList.add('toggled');
        // }, 500);

        // body.classList.add('nav-open');

        // this.sidebarVisible = true;
    }

    // var navbar : HTMLElement = this.element.nativeElement

    // console.log(navbar)

    // var sidebar = navbar.getElementsByClassName('sidebar')[0]
    // sidebar.classList.remove('sidebar')


    // var toggleButton = navbar.getElementsByClassName('navbar-toggle')[0]
    // toggleButton.classList.remove('toggled')
    // const body = document.getElementsByTagName('body')[0]
    // body.classList.remove('nav-open')


    // const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper')
    // elemSidebar.remove()

    // console.log()

    // const body = document.getElementsByTagName('body')[0];
    // body.classList.remove('nav-open');
    // console.log(body)
    // this.toggleButton.classList.remove('toggled');
    // this.sidebarVisible = false;
    //this.route.queryParams.subscribe(params => this.navigateTo = params['return'] || '')






  }


}
