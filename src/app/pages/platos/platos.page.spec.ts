import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PlatosPage } from './platos.page';

describe('PlatosPage', () => {
  let component: PlatosPage;
  let fixture: ComponentFixture<PlatosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlatosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PlatosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
