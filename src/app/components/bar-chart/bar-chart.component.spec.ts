import { GestionApiService } from './../../services/gestion-api.service';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BarChartComponent } from './bar-chart.component';
//import { HttpClientModule } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Chart } from 'chart.js/auto';

describe('BarChartComponent', () => {
  let component: BarChartComponent;
  let fixture: ComponentFixture<BarChartComponent>;

  //Será un array de un objeto que contenga categoria y totalResults, estará inicializado a un array vacío.
  let mockApiData: Array<{ categoria: string, totalResults: number }> = []; /*Inicializar variable*/

  // Declara un BehaviorSubject falso para usar en las pruebas. Asignar un valor inicial al objeto que contiene categoria y totalResults.
  const fakeSubject = new BehaviorSubject<{ categoria: string, totalResults: number }>(
    { categoria: 'general', 
      totalResults: 3 }
  ); /*Inicializar variable*/

  //Creamos un mock para sustituir GestionApiService. 
  //Contiene un método cargarCategoria que recibe un string categoria y no devulve nada.
  const mockGestionService = {
    cargarCategoria: (categoria: string) => {
    },
    datos$: fakeSubject.asObservable()
  };/*Inicializar variable*/

  //Necesitamos añadir el sustituto de HttpClient
  //De providers, como sustituiremos GestionApiService, como useValue, necesitaremos añadir {datos$: fakeSubject, mockGestionService}
  //En este caso, cuando queremos hacer uso de GestionApiService, estaremos haciendo uso de mockGestionService y fakeSubject
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BarChartComponent ],
      imports: [IonicModule.forRoot(), HttpClientTestingModule],
      providers: [ { 
        provide: GestionApiService, 
        useValue: mockGestionService 
      }],
    }).compileComponents();

    fixture = TestBed.createComponent(BarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //Comprobamos si podemos ejecutar el método ngOnInit
  //No se ejecuta la lógica del ngOnInit
  it('Se puede ejecutar ngOnInit', () => {
    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
  });

  //Comprobamos si podemos ejecutar el método ngOnInit
  //Se ejecuta la lógica de ngOnInit
  it('El método ngOnInit se ejecuta correctamente', () => {
    spyOn(component, 'actualizarValoresChart');
    spyOn(component, 'actualizarChart');

    component.ngOnInit();

    expect(component.actualizarValoresChart).toHaveBeenCalledWith('general', 3);
    expect(component.actualizarChart).toHaveBeenCalled();
  });

  //Necesitaremos 2 espías uno por cada método
  //Usaremos un mockData, será un objeto que contenga un valor de categoria y totalResults
  //Haremos uso de fakeSubject (el fake BehaviorSubject). Simularemos el next de este BehaviorSubject pasándole el mockData

  it('Comprobamos si podemos llamar a actualizarValoresChart y actualizarChart', () => {
    spyOn(component, 'actualizarValoresChart');
    spyOn(component, 'actualizarChart');

    const mockdata = { categoria: 'testCategoria', totalResults: 25 };
    fakeSubject.next(mockdata);

    expect(component.actualizarValoresChart).toHaveBeenCalledWith('testCategoria', 25);
    expect(component.actualizarChart).toHaveBeenCalled();
  });

  //Cargaremos el mockApiData de valores e inicializaremos la variable apiData del componente con este mockApiData (No asignar todos los valores)
  //Crearemos un mockData, con los datos de categoria y totalResults que no existen en el mockApiData, para pasar estos valores al método actualizarValoresChart
  //Si el método actualizarValoresChart, se ha ejecutado correctamente, mediante el método find, podemos comprobar a ver si los valores de mockData se han insertado en component.apiData
  //Al hacer uso de .find, devolverá el objeto encontrado, los que hemos puesto en mockData.
  //Por tanto, esperamos que ese objeto devuelto exista y que el valor totalResults sea igual al totalResults de mockData
  it('Comprobamos si podemos ejecutar actualizarValoresChart', () => {
    // Inicializamos apiData con valores previos
    mockApiData = [
      { categoria: 'General', totalResults: 5 },
      { categoria: 'Technology', totalResults: 15 }
    ];

    component.apiData = [...mockApiData];

    // Usamos datos que NO están en mockApiData para probar inserción
    const mockData = { categoria: 'Bussines', totalResults: 30 };

    component.actualizarValoresChart(mockData.categoria, mockData.totalResults);

    const inserted = component.apiData.find(item => item.categoria === mockData.categoria);
    expect(inserted).toBeTruthy();
    expect(inserted?.totalResults).toBe(mockData.totalResults);
  });

});
