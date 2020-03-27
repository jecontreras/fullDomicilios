import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InterurbanoPage } from './interurbano.page';

describe('InterurbanoPage', () => {
  let component: InterurbanoPage;
  let fixture: ComponentFixture<InterurbanoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterurbanoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InterurbanoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
