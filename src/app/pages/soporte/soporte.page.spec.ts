import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SoportePage } from './soporte.page';

describe('SoportePage', () => {
  let component: SoportePage;
  let fixture: ComponentFixture<SoportePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoportePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SoportePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
