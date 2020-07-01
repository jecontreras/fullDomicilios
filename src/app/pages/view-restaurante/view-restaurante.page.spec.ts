import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewRestaurantePage } from './view-restaurante.page';

describe('ViewRestaurantePage', () => {
  let component: ViewRestaurantePage;
  let fixture: ComponentFixture<ViewRestaurantePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewRestaurantePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewRestaurantePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
