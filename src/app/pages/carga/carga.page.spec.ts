import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CargaPage } from './carga.page';

describe('CargaPage', () => {
  let component: CargaPage;
  let fixture: ComponentFixture<CargaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CargaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CargaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
