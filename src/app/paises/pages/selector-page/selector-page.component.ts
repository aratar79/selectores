import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesService } from '../../services/paises.service';
import { PaisSmall, Borders } from '../../interfaces/paises.interface';
import { map, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.css']
})
export class SelectorPageComponent implements OnInit {

  myForm: FormGroup = this.fb.group({
    continent: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required]
  });

  // Llenar selectores
  regiones: string[] = [];
  paises: PaisSmall[] = [];
  borders: string[] = [] ;
  countryBorders: PaisSmall[] = [];

  // UI
  cargando: boolean = false; 

  constructor
    (
      private fb: FormBuilder,
      private ps: PaisesService
    ) { }

  ngOnInit(): void {

    this.regiones = this.ps.regiones;

    // Cuando cambia la región
    this.myForm.get('continent')?.valueChanges
      .pipe(
        tap((_) => {
          this.cargando = true;
          this.myForm.get('pais')?.reset('');
        }),
        switchMap(region => this.ps.getCountrieByRegion(region))
      )
      .subscribe(paises => {
        this.paises = paises;
        this.cargando = false;
      });

    // Cuando cambia el país
    this.myForm.get('pais')?.valueChanges
      .pipe(
        tap((_) => {
          this.cargando = true;
          this.borders = [];
          this.myForm.get('frontera')?.reset('');
        }),
        switchMap(pais => this.ps.getBordersByCode(pais)),
        switchMap(borders => this.ps.getCountriesByBorders(borders.borders))
      )
      .subscribe(
        countryBorders => {
          this.countryBorders = countryBorders || [];
          this.cargando = false;
          console.log(this.countryBorders)
        });
  }

  guardar() {
    console.log(this.myForm.value)
  }

}
