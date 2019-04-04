import { APPFunctions } from './../app.functions';
import { FBServices } from './../firebase.services';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, NativeDateAdapter, DateAdapter } from '@angular/material';
import * as moment from 'moment';
import * as Map from 'leaflet';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-trackpoint',
  templateUrl: './trackpoint.component.html',
  styleUrls: ['./trackpoint.component.scss'],
  styles: [
    "styles.css",
    "./node_modules/leaflet/dist/leaflet.css"
  ],
})

export class TrackpointComponent implements OnInit {

  public displayedColumns: string[] = ['apeEmp', 'nomFun', 'numCpf', 'tipCol']

  public dataSource: any;

  public unsubscribe: any = null

  //leaflet
  public map: any = null
  public pointer: Map.PointTuple
  public message: string
  public position: any = null
  public repMarker: any
  public groupReps: any
  public reps: any = null
  public hasError: string = ''
  //public marker = leaflet.marker()
  //public circle = leaflet.circle()
  //public cities = leaflet.layerGroup()
  //public position: object = {}

  //empresa
  public empresaAtiva: object

  //datePicker
  public startDate = new FormControl((new Date()).toISOString())
  public YYYYMMDD: string = moment().format('YYYYMMDD')
  public dateInput: any

  //employee
  public employee: any = null



  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator

  constructor(
    public fbServices: FBServices,
    public func: APPFunctions,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('pt-Br');
  }

  fnStartMap(repMarker: any) {

    this.groupReps = new Map.featureGroup(repMarker)
    if (this.reps != null) {
      this.reps.clearLayers()
    }
    this.reps = Map.layerGroup(repMarker)

    this.reps.addTo(this.map)

    this.map.fitBounds(this.groupReps.getBounds())

    this.map.scrollWheelZoom.disable()

    // this.map.on('click', function(e) {
    //   console.log(e)
    // })

  }


  fnGetDate(dateInput: any) {

    this.dateInput = dateInput

    this.YYYYMMDD = moment(this.dateInput).format('YYYYMMDD')

    if (this.employee) {
      return this.fnMonitorar(this.employee)
    }
  }

  async fnMonitorar(employee: any) {

    this.employee = employee
    console.log(this.employee)
    if (this.unsubscribe) {
      this.unsubscribe()
    }


    let numCpf: any = this.func.toCpfId(employee.numCpf)
    var unsubscribe = this.fbServices.DB.FS.collection(`users/${employee.uid}/rep/${employee.cnpjContratoTrabalho}/${numCpf}/${employee.id}/${this.YYYYMMDD}`).onSnapshot(reps => {
      this.unsubscribe = unsubscribe
      this.repMarker = []

      return new Promise(resolve => {

        reps.forEach(rep => {

          let serverHora = moment.unix(rep.data().serverTimestamp.seconds).format('HH:mm:ss')

          if (rep.exists) {
            if (rep.data().position) {
              this.position = rep.data().position
            } else if (rep.data().webPosition) {
              this.position = rep.data().webPosition
            }

            if (this.position) {

              var posTraLatLng = Map.latLng(-19.926158, -43.9879306)

              var pointer = Map.latLng(this.position.latitude, this.position.longitude)

              let distance = this.map.distance(pointer, posTraLatLng)

              var hasSucces = 'text-success'

              if (distance > 80) {
                hasSucces = 'text-danger'
              }


              var myIcon = Map.icon({
                iconUrl: 'assets/my-icon.png',
                iconSize: [38, 95],
                iconAnchor: [22, 94],
                popupAnchor: [-3, -76],
                shadowUrl: 'assets/my-icon-shadow.png',
                shadowSize: [68, 95],
                shadowAnchor: [22, 94]
              })

              this.pointer = [this.position.latitude, this.position.longitude]
              this.message = `Hora: ${rep.data().time}\n<span class="${hasSucces}"> (${serverHora})\n ${parseInt(distance)}m</span> `
              this.repMarker.push(Map.marker(this.pointer, /*{ icon: myIcon }*/).bindPopup(this.message))
            } else {
              this.hasError = 'Marcações sem informação do Posicionamento.'
            }
          } else {

            this.hasError = 'Colaborador sem marcações nesta data.'
          }
          //console.warn(this.hasError)
        })

        resolve({ result: 'OK' })
        return this.fnStartMap(this.repMarker)

      })
    })

  }

  fnGetEmployees() {
    if (this.fbServices.DB.LS.empresaAtiva != undefined) {
      var empresaAtiva = JSON.parse(this.func.decrypt(this.fbServices.DB.LS.empresaAtiva))
      console.log(empresaAtiva)
      return new Promise((resolve, reject) => {
        this.fbServices.DB.FB.ref('employees').child(this.func.toCnpjId(empresaAtiva.cnpj)).on('value', employees => {
          if (employees.exists()) {
            var data = []
            for (let cpf in employees.val()) {
              let employee = employees.val()[cpf]
              for (let key in employee) {
                let value = employee[key]
                data.push(value)
              }
            }
            resolve(data)
          } else {
            reject({ result: 'Sem Registros.' })
          }
        })
      })
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {

    this.fbServices.canLoad()

    if (this.map == null) {
      this.map = Map.map('mapId', {

      }).fitWorld().setZoom(2)

      Map.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a>overt | Intelligence</a>'
      }).addTo(this.map)

      document.querySelector('.leaflet-bottom.leaflet-right').innerHTML = ''
      //document.querySelector('.leaflet-top.leaflet-left').innerHTML = ''
    }


    if (this.fbServices.DB.LS.empresaAtiva != undefined) {
      this.empresaAtiva = JSON.parse(this.func.decrypt(this.fbServices.DB.LS.empresaAtiva))
      this.fnGetEmployees().then(employees => {
        var data: any = employees
        this.dataSource = new MatTableDataSource(data)
        this.dataSource.paginator = this.paginator
        this.dataSource.sort = this.sort
      })
    }


    // var app= angular.module('myapp', ['ui.bootstrap']);

    // app.run(function(paginationConfig){
    //   paginationConfig.firstText='MY FIRST';
    //   paginationConfig.previousText='YOUR TEXT';

    // })







  }



}
