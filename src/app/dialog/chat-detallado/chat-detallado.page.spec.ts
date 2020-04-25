import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChatDetalladoPage } from './chat-detallado.page';

describe('ChatDetalladoPage', () => {
  let component: ChatDetalladoPage;
  let fixture: ComponentFixture<ChatDetalladoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatDetalladoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatDetalladoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
