import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetalleProductoPage } from './detalle-producto.page';

describe('DetalleProductoPage', () => {
  let component: DetalleProductoPage;
  let fixture: ComponentFixture<DetalleProductoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleProductoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetalleProductoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
