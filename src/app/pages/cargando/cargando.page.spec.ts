import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CargandoPage } from './cargando.page';

describe('CargandoPage', () => {
  let component: CargandoPage;
  let fixture: ComponentFixture<CargandoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CargandoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CargandoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
