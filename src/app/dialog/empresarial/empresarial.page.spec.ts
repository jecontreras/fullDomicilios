import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EmpresarialPage } from './empresarial.page';

describe('EmpresarialPage', () => {
  let component: EmpresarialPage;
  let fixture: ComponentFixture<EmpresarialPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpresarialPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EmpresarialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
