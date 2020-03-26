import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SeguridadPage } from './seguridad.page';

describe('SeguridadPage', () => {
  let component: SeguridadPage;
  let fixture: ComponentFixture<SeguridadPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeguridadPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SeguridadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
