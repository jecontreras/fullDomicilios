import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UneteNosotrosPage } from './unete-nosotros.page';

describe('UneteNosotrosPage', () => {
  let component: UneteNosotrosPage;
  let fixture: ComponentFixture<UneteNosotrosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UneteNosotrosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UneteNosotrosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
