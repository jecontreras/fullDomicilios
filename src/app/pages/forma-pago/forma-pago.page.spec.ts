import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormaPagoPage } from './forma-pago.page';

describe('FormaPagoPage', () => {
  let component: FormaPagoPage;
  let fixture: ComponentFixture<FormaPagoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormaPagoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormaPagoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
