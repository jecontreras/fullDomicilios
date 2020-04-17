import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VercionPage } from './vercion.page';

describe('VercionPage', () => {
  let component: VercionPage;
  let fixture: ComponentFixture<VercionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VercionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VercionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
